// routes/user.routes.js
import express from 'express';
import { getAllUsers,updateUserRole } from '../controllers/user.controller.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get("/users", verifyAdmin, getAllUsers);
router.put("/users/:id/role", verifyAdmin, updateUserRole);
