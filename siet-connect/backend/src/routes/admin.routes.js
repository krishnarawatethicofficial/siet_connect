import express from "express";
import { getDashboardStats, getAllUsers, updateUserRole, updateAttendance } from "../controllers/admin.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", protect, requireRole("admin"), getDashboardStats);
router.get("/users", protect, requireRole("admin", "faculty"), getAllUsers);
router.put("/users/:id/role", protect, requireRole("admin"), updateUserRole);
router.put("/users/:id/attendance", protect, requireRole("admin", "faculty"), updateAttendance);

export default router;
