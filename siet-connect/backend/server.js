// Load env vars FIRST — must be before all other imports
import "./src/config/env.js";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import noticeRoutes from "./src/routes/notice.routes.js";
import placementRoutes from "./src/routes/placement.routes.js";
import documentRoutes from "./src/routes/document.routes.js";
import pyqRoutes from "./src/routes/pyq.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import leaderboardRoutes from "./src/routes/leaderboard.routes.js";

const app = express();
const server = http.createServer(app);

// Socket.io for real-time features
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Track active users for real-time presence
const activeUsers = new Map();

io.on("connection", (socket) => {
  // User joins — track presence
  socket.on("user:join", (userData) => {
    activeUsers.set(socket.id, {
      userId: userData.userId,
      name: userData.name,
      avatar: userData.name?.charAt(0) || "S",
      joinedAt: new Date(),
    });
    io.emit("presence:update", {
      count: activeUsers.size,
      users: Array.from(activeUsers.values()).slice(0, 10),
    });
  });

  // Notice upvote — broadcast to all
  socket.on("notice:upvote", (data) => {
    io.emit("notice:upvoted", data);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.id);
    io.emit("presence:update", {
      count: activeUsers.size,
      users: Array.from(activeUsers.values()).slice(0, 10),
    });
  });
});

// Make io accessible in routes
app.set("io", io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/pyqs", pyqRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, data: { status: "running", activeUsers: activeUsers.size } });
});

const PORT = process.env.PORT || 5000;

// Connect DB then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
