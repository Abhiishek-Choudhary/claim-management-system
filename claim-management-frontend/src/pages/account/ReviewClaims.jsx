import React, { useEffect, useState } from "react";
import axios from "axios";
import ClaimReviewModal from "./ClaimReviewModal";
import socket from "../../services/socket";

const ReviewClaims = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [lockedClaims, setLockedClaims] = useState([]);

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims/review", {
        headers: { Authorization: token },
      });

      const filtered = res.data.filter((claim) =>
        ["pending", "submitted"].includes(claim.status)
      );

      setClaims(filtered);
    } catch (error) {
      console.error("Failed to fetch claims:", error.message);
    }
  };

  useEffect(() => {
    socket.connect();

    socket.on("claimLocked", ({ claimId }) => {
      setLockedClaims((prev) => [...new Set([...prev, claimId])]);
    });

    socket.on("claimUnlocked", ({ claimId }) => {
      setLockedClaims((prev) => prev.filter((id) => id !== claimId));
    });

    return () => {
      socket.off("claimLocked");
      socket.off("claimUnlocked");
    };
  }, []);

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
        Pending Claims for Review
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {claims.map((claim) => {
          const isLocked = lockedClaims.includes(claim._id);
          return (
            <div
              key={claim._id}
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <p>
                <strong>User:</strong>{" "}
                {claim.user?.username || claim.userId?.username || "Unknown"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {claim.user?.email || claim.userId?.email || "N/A"}
              </p>
              <p>
                <strong>Expected Earnings:</strong> ₹{claim.expectedEarnings}
              </p>
              <p>
                <strong>Calculated Earnings:</strong> ₹{claim.calculatedEarnings}
              </p>
              <p>
                <strong>Status:</strong> {claim.status}
              </p>
              <button
                disabled={isLocked}
                onClick={() => setSelectedClaim(claim)}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  backgroundColor: isLocked ? "#ccc" : "#2563eb",
                  color: "#fff",
                  border: "none",
                  cursor: isLocked ? "not-allowed" : "pointer",
                }}
              >
                {isLocked ? "Locked by another reviewer" : "Review"}
              </button>
            </div>
          );
        })}
      </div>

      {selectedClaim && (
        <ClaimReviewModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onSuccess={fetchClaims}
        />
      )}
    </div>
  );
};

export default ReviewClaims;
