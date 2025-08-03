const lockedClaims = new Map(); // claimId → { lockedBy, role }

const claimLockSocketHandler = (io, socket) => {
  // Lock a claim
  socket.on("lockClaim", ({ claimId, userId, role }) => {
    const existingLock = lockedClaims.get(claimId);

    if (existingLock && existingLock.lockedBy !== userId) {
      // Notify this specific socket that claim is already locked
      socket.emit("claimLockError", {
        claimId,
        message: "This claim is already being reviewed by another approver.",
      });
    } else {
      // Grant the lock to this user
      lockedClaims.set(claimId, { lockedBy: userId, role });
      socket.userId = userId;
      socket.claimId = claimId; // ✅ Track for disconnect cleanup

      // Notify everyone (including self)
      io.emit("claimLocked", { claimId, lockedBy: userId, role });
    }
  });

  // Unlock a claim
  socket.on("unlockClaim", ({ claimId, userId }) => {
    const lock = lockedClaims.get(claimId);
    if (lock?.lockedBy === userId) {
      lockedClaims.delete(claimId);
      io.emit("claimUnlocked", { claimId });
    }
  });

  // On disconnect — release any claim this user had locked
  socket.on("disconnect", () => {
    for (const [claimId, lock] of lockedClaims.entries()) {
      if (lock.lockedBy === socket.userId) {
        lockedClaims.delete(claimId);
        io.emit("claimUnlocked", { claimId });
      }
    }
    console.log("❌ WebSocket disconnected:", socket.id);
  });
};

export default claimLockSocketHandler;
