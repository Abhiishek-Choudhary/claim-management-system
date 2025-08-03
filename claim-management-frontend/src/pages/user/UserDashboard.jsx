import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";
import SubmitClaim from "./SubmitClaim";
import ViewClaims from "./ViewClaims";
import PostCard from "../../components/PostCard";

const UserDashboard = () => {
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
      backgroundColor: "#1F2937", // Tailwind's gray-800
      color: "#fff",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    sidebarTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    navList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    navItem: {
      marginBottom: "10px",
    },
    navLink: {
      color: "#fff",
      textDecoration: "none",
      fontSize: "16px",
      transition: "text-decoration 0.2s",
    },
    navLinkHover: {
      textDecoration: "underline",
    },
    logoutButton: {
      marginTop: "20px",
      padding: "10px 16px",
      backgroundColor: "#DC2626", // Tailwind red-600
      border: "none",
      color: "#fff",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    logoutButtonHover: {
      backgroundColor: "#B91C1C", // Tailwind red-700
    },
    main: {
      width: "80%",
      padding: "24px",
      backgroundColor: "#F3F4F6", // Tailwind gray-100
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>User Panel</h2>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="create-post" style={styles.navLink}>
                Create Post
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="submit-claim" style={styles.navLink}>
                Submit Claim
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="claims" style={styles.navLink}>
                My Claims
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="posts" style={styles.navLink}>
                All Posts
              </Link>
            </li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = styles.logoutButtonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = styles.logoutButton.backgroundColor)
          }
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <Routes>
          <Route path="create-post" element={<CreatePost />} />
          <Route path="submit-claim" element={<SubmitClaim />} />
          <Route path="claims" element={<ViewClaims />} />
          <Route path="posts" element={<PostCard />} />
          <Route index element={<div>Welcome to your dashboard</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default UserDashboard;
