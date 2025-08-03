// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import claimRoutes from "./routes/claim.routes.js";
import claimLockSocketHandler from "./sockets/claimLock.socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const allowedOrigin = process.env.CLIENT_URL || "*";

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.json());

// DB Connection
connectDB();

app.use("/uploads", express.static("uploads"));

// Test route
app.get('/', (req, res) => {
  res.send('Claim Management Backend is running');
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/claims", claimRoutes);

io.on("connection", (socket) => {
  console.log("✅ WebSocket connected:", socket.id);
  claimLockSocketHandler(io, socket);
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
