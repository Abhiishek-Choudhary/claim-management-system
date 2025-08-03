import React, { useEffect, useState } from "react";
import axios from "axios";

const PostCard = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (currentPage = 1) => {
    try {
      const res = await axios.get(`https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/posts/user?page=${currentPage}&limit=${limit}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/posts/${postId}/like`);
      fetchPosts(page);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleView = async (postId) => {
    try {
      await axios.put(`https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/api/posts/${postId}/view`);
      fetchPosts(page);
    } catch (err) {
      console.error("Error viewing post:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchPosts(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchPosts(page - 1);
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center", marginBottom: "30px" }}>Your Posts</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          justifyItems: "center",
        }}
      >
        {posts.map((post) => (
          <div
            key={post._id}
            style={{
              width: "280px",
              height: "420px",
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"}
          >
            <div onClick={() => handleView(post._id)} style={{ width: "100%", height: "190px", overflow: "hidden" }}>
              <img
                src={`https://e8323325-9fea-40d9-a0fc-5aba07e1a323-00-1uedzks77cj6m.sisko.replit.dev/${post.image}`}
                alt="Post"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
              <p style={{ color: "#333", fontSize: "14px", lineHeight: "1.5", marginBottom: "12px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {post.content}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", alignItems: "center" }}>
                <button
                  onClick={() => handleLike(post._id)}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "#ff4d4d", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  ❤️ <span>{post.likes}</span>
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  👁️ <span>{post.views}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", gap: "20px", alignItems: "center" }}>
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          style={{
            padding: "10px 16px",
            backgroundColor: "#ccc",
            border: "none",
            borderRadius: "6px",
            cursor: page === 1 ? "not-allowed" : "pointer",
            opacity: page === 1 ? 0.5 : 1,
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: "16px", fontWeight: "500" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          style={{
            padding: "10px 16px",
            backgroundColor: "#ccc",
            border: "none",
            borderRadius: "6px",
            cursor: page === totalPages ? "not-allowed" : "pointer",
            opacity: page === totalPages ? 0.5 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostCard;

