import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "../../services/socket";

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "10px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  width: "100%",
  maxWidth: "550px",
  fontFamily: "Arial, sans-serif",
};

const labelStyle = {
  fontWeight: "600",
  marginBottom: "6px",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "12px",
  fontSize: "14px",
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
};

const ClaimReviewModal = ({ claim, onClose, onSuccess }) => {
  const [deduction, setDeduction] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const claimIdRef = useRef(claim?._id);

  useEffect(() => {
    if (!claim?._id || !user?._id) return;

    if (!socket.connected) socket.connect();

    socket.emit("lockClaim", {
      claimId: claim._id,
      userId: user._id,
      role: user.role,
    });

    socket.on("claimLockError", ({ claimId, message }) => {
      if (claimId === claim._id) {
        setLocked(true);
        setLockMessage(message);
      }
    });

    return () => {
      socket.emit("unlockClaim", {
        claimId: claimIdRef.current,
        userId: user._id,
      });

      socket.off("claimLockError");
    };
  }, [claim?._id]);

  const handleApprove = async () => {
    try {
      setLoading(true);
      await axios.put(
        `https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims/approve/${claim._id}`,
        {},
        { headers: { Authorization: token } }
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeduct = async () => {
    if (!deduction || !reason) {
      alert("Please provide both deduction amount and reason.");
      return;
    }
    try {
      setLoading(true);
      await axios.put(
        `https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims/deduct/${claim._id}`,
        {
          amount: deduction,
          reason,
        },
        { headers: { Authorization: token } }
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>
          Review Claim
        </h2>

        {locked ? (
          <p style={{ color: "red", marginBottom: "20px", fontWeight: 600 }}>
            ⚠️ {lockMessage}
          </p>
        ) : (
          <>
            <p><strong>User:</strong> {claim.user?.username || claim.userId?.username || "Unknown"}</p>
            <p><strong>Email:</strong> {claim.user?.email || claim.userId?.email || "N/A"}</p>
            <p><strong>Expected Earnings:</strong> ₹{claim.expectedEarnings}</p>

            <div style={{ marginTop: "20px", marginBottom: "10px" }}>
              <label style={labelStyle}>Deduct Amount</label>
              <input
                type="number"
                style={inputStyle}
                value={deduction}
                onChange={(e) => setDeduction(e.target.value)}
              />

              <label style={labelStyle}>Reason</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Reason for deduction"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={onClose}
                style={{ ...buttonStyle, backgroundColor: "#ddd" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeduct}
                disabled={loading}
                style={{ ...buttonStyle, backgroundColor: "#f5a623", color: "white" }}
              >
                Send Back with Deduction
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                style={{ ...buttonStyle, backgroundColor: "#28a745", color: "white" }}
              >
                Approve
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClaimReviewModal;
