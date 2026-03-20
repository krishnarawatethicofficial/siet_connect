import express from "express";
import { body } from "express-validator";
import { getPYQs, createPYQ, downloadPYQ, deletePYQ } from "../controllers/pyq.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", protect, getPYQs);

router.post(
  "/",
  protect,
  requireRole("admin", "faculty"),
  [
    body("subject").trim().notEmpty().withMessage("Subject name is required"),
    body("subjectCode").trim().notEmpty().withMessage("Subject code is required"),
    body("branch").isIn(["CSE-AIML", "CSE-CS", "RAE", "common"]).withMessage("Valid branch required"),
    body("semester").isInt({ min: 1, max: 8 }).withMessage("Semester must be 1-8"),
    body("year").isInt({ min: 2020 }).withMessage("Valid year required"),
    body("fileUrl").trim().notEmpty().withMessage("File URL is required"),
  ],
  validate,
  createPYQ
);

router.put("/:id/download", protect, downloadPYQ);
router.delete("/:id", protect, requireRole("admin"), deletePYQ);

export default router;
