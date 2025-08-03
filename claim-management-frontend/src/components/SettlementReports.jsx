import React from "react";
import axios from "axios";

const SettlementReports = () => {
  const handleDownload = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims/settlement-report`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `settlement-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report.");
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginTop: "32px",
        maxWidth: "600px",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "16px",
          color: "#333",
        }}
      >
        Export Settlement Reports
      </h2>

      <button
        onClick={handleDownload}
        style={{
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Download Report
      </button>
    </div>
  );
};

export default SettlementReports;

