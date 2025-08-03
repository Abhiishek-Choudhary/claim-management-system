import React, { useEffect, useState } from "react";
import axios from "axios";

const SubmitClaim = () => {
  const [posts, setPosts] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [mediaProof, setMediaProof] = useState(null);
  const [expectedEarnings, setExpectedEarnings] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/posts/user", {
          headers: { Authorization: token },
        });
        setPosts(Array.isArray(res.data.posts) ? res.data.posts : []);
      } catch (err) {
        console.error(err);
        setPosts([]);
      }
    };
    fetchUserPosts();
  }, []);

  const handleInputChange = (postId, field, value) => {
    setClaimData((prev) =>
      prev.map((item) =>
        item.postId === postId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCheckboxChange = (post) => {
    setClaimData((prev) => {
      const exists = prev.find((p) => p.postId === post._id);
      if (exists) {
        return prev.filter((p) => p.postId !== post._id);
      } else {
        return [...prev, { postId: post._id, views: "", likes: "" }];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("mediaProof", mediaProof);
    formData.append("expectedEarnings", expectedEarnings);
    formData.append("posts", JSON.stringify(claimData));

    try {
      await axios.post("https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/claims", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
      setClaimData([]);
      setMediaProof(null);
      setExpectedEarnings("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "30px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        Submit Claim
      </h2>

      {success && (
        <div style={{ marginBottom: "16px", color: "green", fontWeight: "500" }}>
          ✅ Claim submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => {
            const isSelected = claimData.find((p) => p.postId === post._id);
            return (
              <div
                key={post._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  marginBottom: "18px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      checked={!!isSelected}
                      onChange={() => handleCheckboxChange(post)}
                    />
                    <span style={{ fontWeight: "500", fontSize: "16px", color: "#333" }}>
                      {post.content}
                    </span>
                  </label>
                  <div style={{ fontSize: "13px", color: "#888" }}>
                    Views: {post.views} | Likes: {post.likes}
                  </div>
                </div>

                {isSelected && (
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ marginBottom: "10px" }}>
                      <label
                        style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}
                      >
                        Claimed Views:
                      </label>
                      <input
                        type="number"
                        value={isSelected.views}
                        onChange={(e) =>
                          handleInputChange(post._id, "views", e.target.value)
                        }
                        required
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}
                      >
                        Claimed Likes:
                      </label>
                      <input
                        type="number"
                        value={isSelected.likes}
                        onChange={(e) =>
                          handleInputChange(post._id, "likes", e.target.value)
                        }
                        required
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>
            Expected Earnings:
          </label>
          <input
            type="number"
            value={expectedEarnings}
            onChange={(e) => setExpectedEarnings(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #bbb",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>
            Upload Media Proof (Image or PDF):
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setMediaProof(e.target.files[0])}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #bbb",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "12px",
            fontSize: "16px",
            width: "100%",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit Claim
        </button>
      </form>
    </div>
  );
};

export default SubmitClaim;
