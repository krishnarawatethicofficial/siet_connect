import express from "express";
import { getLeaderboard, getActivityMap } from "../controllers/leaderboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getLeaderboard);
router.get("/activity", protect, getActivityMap);

export default router;
