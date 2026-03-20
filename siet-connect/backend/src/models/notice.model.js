import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    // Notice title
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Detailed content
    content: {
      type: String,
      required: true,
    },
    // Category for filtering
    category: {
      type: String,
      enum: ["academic", "placement", "event", "exam", "general", "urgent"],
      default: "general",
    },
    // Auto-generated tags via keyword extraction
    tags: [{ type: String, lowercase: true, trim: true }],
    // Who posted it
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Upvote tracking for Socket.io live ranking
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    upvoteCount: {
      type: Number,
      default: 0,
    },
    // Target audience
    targetBranch: {
      type: String,
      enum: ["CSE-AIML", "CSE-CS", "RAE", "all"],
      default: "all",
    },
    targetSemester: {
      type: Number,
      min: 0, // 0 = all semesters
      max: 8,
      default: 0,
    },
    // Is this pinned to top?
    isPinned: {
      type: Boolean,
      default: false,
    },
    // Attachment URL (optional)
    attachmentUrl: {
      type: String,
      default: "",
    },
    // File type info for accessibility
    fileType: {
      type: String,
      default: "",
    },
    fileSize: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ category: 1 });
noticeSchema.index({ upvoteCount: -1 });
noticeSchema.index({ tags: 1 });

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
