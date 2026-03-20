import express from "express";
import { body } from "express-validator";
import { getMyDocuments, getAllDocuments, createDocument, updateDocumentStatus } from "../controllers/document.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/mine", protect, getMyDocuments);
router.get("/all", protect, requireRole("admin"), getAllDocuments);

router.post(
  "/",
  protect,
  [
    body("docType").isIn(["bonafide", "transcript", "fee-receipt", "character-cert", "id-card", "migration", "other"]).withMessage("Valid document type required"),
    body("reason").trim().notEmpty().withMessage("Reason is required"),
  ],
  validate,
  createDocument
);

router.put("/:id/status", protect, requireRole("admin"), updateDocumentStatus);

export default router;
