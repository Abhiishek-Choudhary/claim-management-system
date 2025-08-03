import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "4rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    outline: "none",
    marginBottom: "1rem",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.5rem",
    backgroundColor: "#16a34a",
    color: "#fff",
    fontWeight: "600",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const errorStyle = {
    color: "#dc2626",
    fontSize: "0.875rem",
    marginBottom: "1rem",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "1.875rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "1.5rem",
  };

  const textCenter = {
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#6b7280",
    marginTop: "1rem",
  };

  const linkButtonStyle = {
    background: "none",
    color: "#2563eb",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "underline",
    padding: 0,
    marginLeft: "4px",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Create an Account</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            style={inputStyle}
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            style={inputStyle}
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={inputStyle}
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="user">User</option>
            <option value="account">Account</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" style={buttonStyle}>
            Register
          </button>
        </form>

        <div style={textCenter}>
          Already have an account?
          <button
            onClick={() => navigate("/login")}
            style={linkButtonStyle}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
