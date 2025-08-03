// routes/post.routes.js
import express from "express";
import {
  createPost,
  getAllPosts,
  likePost,
  viewPost,
} from "../controllers/post.controller.js";
import { verifyUser } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/", verifyUser, upload.single("image"), createPost);     // Create post
router.get("/user", getAllPosts);                    // Get all posts
router.put("/:id/like", likePost);
router.put("/:id/view", viewPost);             // View count

export default router;
