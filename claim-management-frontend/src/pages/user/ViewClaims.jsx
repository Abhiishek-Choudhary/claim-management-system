import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewClaims = () => {
  const [claims, setClaims] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchClaims = async (pageNumber = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims/user?page=${pageNumber}&limit=${limit}`,
        { headers: { Authorization: token } }
      );

      setClaims(res.data.claims);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    }
  };

  const handleAccept = async (claimId) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims/deduction/accept/${claimId}`,
      {},
      { headers: { Authorization: token } }
    );
    fetchClaims(page);
  };

  const handleReject = async (claimId) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims/deduction/reject/${claimId}`,
      {},
      { headers: { Authorization: token } }
    );
    fetchClaims(page);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const styles = {
    container: { maxWidth: "600px", margin: "20px auto", fontFamily: "sans-serif" },
    header: { fontSize: "20px", fontWeight: "600", marginBottom: "16px" },
    card: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    label: { fontWeight: "bold" },
    buttonGroup: { display: "flex", gap: "8px", marginTop: "12px" },
    btn: {
      padding: "6px 12px",
      border: "none",
      borderRadius: "4px",
      color: "#fff",
      cursor: "pointer",
    },
    acceptBtn: { backgroundColor: "#16a34a" },
    rejectBtn: { backgroundColor: "#dc2626" },
    pagination: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "24px",
      alignItems: "center",
    },
    pageBtn: {
      padding: "6px 12px",
      backgroundColor: "#e5e7eb",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      opacity: 1,
    },
    disabledBtn: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Your Claims</h2>

      {claims.length === 0 ? (
        <p>No claims found.</p>
      ) : (
        claims.map((claim) => (
          <div key={claim._id} style={styles.card}>
            <p>
              <span style={styles.label}>Status:</span> {claim.status}
            </p>
            <p>
              <span style={styles.label}>Expected:</span> ₹{claim.expectedEarnings}
            </p>

            {claim.status === "deducted" && (
              <>
                <p>
                  <span style={styles.label}>Deducted:</span> ₹{claim.deductedEarnings}
                </p>
                <p>
                  <span style={styles.label}>Reason:</span> {claim.deductionReason}
                </p>
                <div style={styles.buttonGroup}>
                  <button
                    style={{ ...styles.btn, ...styles.acceptBtn }}
                    onClick={() => handleAccept(claim._id)}
                  >
                    Accept
                  </button>
                  <button
                    style={{ ...styles.btn, ...styles.rejectBtn }}
                    onClick={() => handleReject(claim._id)}
                  >
                    Reject
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          style={{
            ...styles.pageBtn,
            ...(page <= 1 ? styles.disabledBtn : {}),
          }}
          onClick={() => fetchClaims(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          style={{
            ...styles.pageBtn,
            ...(page >= totalPages ? styles.disabledBtn : {}),
          }}
          onClick={() => fetchClaims(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewClaims;
