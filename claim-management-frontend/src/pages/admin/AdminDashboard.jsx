import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import FinalReview from "./FinalReview";
import SettlementReports from "../../components/SettlementReports";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
    },
    sidebar: {
      width: "20%",
      backgroundColor: "#1F2937", // Tailwind gray-800
      color: "white",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    sidebarTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    navList: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
    },
    navItem: {
      marginBottom: "12px",
    },
    link: {
      color: "white",
      textDecoration: "none",
    },
    linkHover: {
      textDecoration: "underline",
    },
    logoutButton: {
      marginTop: "24px",
      backgroundColor: "#EF4444", // red-500
      color: "white",
      padding: "10px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
    logoutButtonHover: {
      backgroundColor: "#DC2626", // red-600
    },
    main: {
      width: "80%",
      padding: "24px",
      backgroundColor: "#F3F4F6", // gray-100
    },
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>Admin Panel</h2>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link
                to="final-review"
                style={styles.link}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                Final Approval
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link
                to="settlement-reports"
                style={styles.link}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                Settlement Reports
              </Link>
            </li>
          </ul>
        </div>
        <button
          style={styles.logoutButton}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.logoutButton.backgroundColor)}
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <Routes>
          <Route path="final-review" element={<FinalReview />} />
          <Route path="settlement-reports" element={<SettlementReports />} />
          <Route index element={<div>Welcome Admin</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
