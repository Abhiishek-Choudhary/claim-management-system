import React, { useEffect, useState } from "react";
import axios from "axios";

const FinalReview = () => {
  const [claims, setClaims] = useState([]);

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims/admin/approved",
        {
          headers: { Authorization: token },
        }
      );
      setClaims(res.data);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    }
  };

  const handleFinalDecision = async (claimId, decision) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims/admin/${decision}/${claimId}`,
        {},
        { headers: { Authorization: token } }
      );
      alert(`Claim ${decision}d successfully`);
      fetchClaims(); // Refresh list
    } catch (err) {
      console.error(`Failed to ${decision} claim:`, err);
      alert(`Failed to ${decision} claim`);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        Claims for Final Review
      </h2>
      {claims.map((claim) => (
        <div
          key={claim._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p>
            <strong>User:</strong>{" "}
            {claim.user?.username ||
              claim.userId?.username ||
              claim.userId?._id ||
              "Unknown"}
          </p>
          <p>
            <strong>Expected:</strong> ₹{claim.expectedEarnings}
          </p>
          <p>
            <strong>Deduction:</strong> ₹{claim.deductedEarnings}
          </p>
          <p>
            <strong>Status:</strong> {claim.status}
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={() => handleFinalDecision(claim._id, "approve")}
              style={{
                backgroundColor: "#16a34a",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Approve
            </button>
            <button
              onClick={() => handleFinalDecision(claim._id, "reject")}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinalReview;
