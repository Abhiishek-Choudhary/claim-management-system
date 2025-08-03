import React, { useState } from "react";
import axios from "axios";

const CreatePost = () => {
  const [form, setForm] = useState({ caption: "", image: null });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("caption", form.caption);
    formData.append("image", form.image);

    try {
      await axios.post("https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/posts", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
      setForm({ caption: "", image: null });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "24px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
        Create New Post
      </h2>

      {success && (
        <p style={{ color: "green", marginBottom: "12px" }}>
          Post created successfully!
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="caption" style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Caption:
          </label>
          <input
            type="text"
            name="caption"
            placeholder="Write a caption..."
            value={form.caption}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="image" style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Upload Image:
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
