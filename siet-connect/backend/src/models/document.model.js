import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    // Who is requesting the document
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Type of document requested
    docType: {
      type: String,
      enum: ["bonafide", "transcript", "fee-receipt", "character-cert", "id-card", "migration", "other"],
      required: true,
    },
    // Reason for the request
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    // Current status of request
    status: {
      type: String,
      enum: ["pending", "processing", "ready", "rejected", "collected"],
      default: "pending",
    },
    // Admin remarks (why rejected, when to collect, etc.)
    remarks: {
      type: String,
      default: "",
    },
    // Urgency level
    priority: {
      type: String,
      enum: ["normal", "urgent"],
      default: "normal",
    },
    // Processed by which admin
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ requestedBy: 1, createdAt: -1 });
documentSchema.index({ status: 1 });
documentSchema.index({ docType: 1 });

const Document = mongoose.model("Document", documentSchema);
export default Document;
