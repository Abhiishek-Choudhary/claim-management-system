// controllers/post.controller.js
import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const newPost = await Post.create({
      userId: req.user.id,
      content: caption,
      image: imagePath,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Post creation failed", error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;     // Default to page 1
    const limit = parseInt(req.query.limit) || 10;  // Default to 10 posts per page
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments(); // Total number of posts
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};


export const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to like post" });
  }
};

export const viewPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to increase view count" });
  }
};