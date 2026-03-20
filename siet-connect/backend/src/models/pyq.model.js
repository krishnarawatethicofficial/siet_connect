import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema(
  {
    // Subject name
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    // Subject code
    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    // Branch this PYQ belongs to
    branch: {
      type: String,
      enum: ["CSE-AIML", "CSE-CS", "RAE", "common"],
      required: true,
    },
    // Semester (1-8)
    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: true,
    },
    // Exam year
    year: {
      type: Number,
      required: true,
    },
    // Exam type
    examType: {
      type: String,
      enum: ["mid-sem", "end-sem", "supplementary"],
      default: "end-sem",
    },
    // Download URL
    fileUrl: {
      type: String,
      required: true,
    },
    // File info for accessibility
    fileType: {
      type: String,
      default: "PDF",
    },
    fileSize: {
      type: String,
      default: "",
    },
    // Number of times downloaded
    downloads: {
      type: Number,
      default: 0,
    },
    // Uploaded by
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Auto tags
    tags: [{ type: String, lowercase: true, trim: true }],
  },
  {
    timestamps: true,
  }
);

pyqSchema.index({ branch: 1, semester: 1 });
pyqSchema.index({ subject: "text", subjectCode: "text" }); // full text search
pyqSchema.index({ createdAt: -1 });
pyqSchema.index({ downloads: -1 });

const PYQ = mongoose.model("PYQ", pyqSchema);
export default PYQ;
