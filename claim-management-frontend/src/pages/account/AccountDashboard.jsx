import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ReviewClaims from "./ReviewClaims";

const AccountDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Inline styles
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  };

  const sidebarStyle = {
    width: "20%",
    backgroundColor: "#1f2937",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const headingStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const linkStyle = {
    display: "block",
    color: "#fff",
    textDecoration: "none",
    marginBottom: "10px",
  };

  const linkHoverStyle = {
    textDecoration: "underline",
  };

  const logoutButtonStyle = {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const mainContentStyle = {
    width: "80%",
    padding: "30px",
    backgroundColor: "#f3f4f6",
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div>
          <h2 style={headingStyle}>Account Panel</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link
                to="review"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                Review Claims
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <Routes>
          <Route path="review" element={<ReviewClaims />} />
          <Route index element={<div>Welcome, Finance Reviewer!</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default AccountDashboard;
