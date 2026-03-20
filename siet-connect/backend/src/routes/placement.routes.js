import express from "express";
import { body } from "express-validator";
import { getPlacements, getPlacementStats, createPlacement, upvotePlacement, deletePlacement } from "../controllers/placement.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", protect, getPlacements);
router.get("/stats", protect, getPlacementStats);

router.post(
  "/",
  protect,
  requireRole("admin", "faculty"),
  [
    body("company").trim().notEmpty().withMessage("Company name is required"),
    body("role").trim().notEmpty().withMessage("Role is required"),
    body("type").isIn(["internship", "fulltime", "offcampus"]).withMessage("Valid type required"),
    body("deadline").isISO8601().withMessage("Valid deadline date required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
  ],
  validate,
  createPlacement
);

router.put("/:id/upvote", protect, upvotePlacement);
router.delete("/:id", protect, requireRole("admin"), deletePlacement);

export default router;
