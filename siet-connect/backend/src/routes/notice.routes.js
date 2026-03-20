import express from "express";
import { body } from "express-validator";
import { getNotices, createNotice, upvoteNotice, deleteNotice } from "../controllers/notice.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", protect, getNotices);

router.post(
  "/",
  protect,
  requireRole("admin", "faculty"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
  ],
  validate,
  createNotice
);

router.put("/:id/upvote", protect, upvoteNotice);
router.delete("/:id", protect, requireRole("admin"), deleteNotice);

export default router;
