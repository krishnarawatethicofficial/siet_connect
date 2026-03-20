import express from "express";
import { body } from "express-validator";
import { signup, login, logout, getMe, updateProfile } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { rateLimit } from "../middleware/ratelimit.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  rateLimit,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 3 }).withMessage("Password must be at least 3 characters"),
    body("studentId").trim().notEmpty().withMessage("Student/Employee ID is required"),
  ],
  validate,
  signup
);

router.post(
  "/login",
  rateLimit,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
