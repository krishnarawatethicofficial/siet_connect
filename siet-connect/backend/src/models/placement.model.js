import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    // Company name
    company: {
      type: String,
      required: true,
      trim: true,
    },
    // Role offered
    role: {
      type: String,
      required: true,
      trim: true,
    },
    // Type of opportunity
    type: {
      type: String,
      enum: ["internship", "fulltime", "offcampus"],
      required: true,
    },
    // Compensation details
    stipend: {
      type: String,
      default: "Not disclosed",
    },
    package: {
      type: String,
      default: "Not disclosed",
    },
    // Application link or instructions
    applyLink: {
      type: String,
      default: "",
    },
    // Deadline for applying
    deadline: {
      type: Date,
      required: true,
    },
    // Description of the role
    description: {
      type: String,
      required: true,
    },
    // Required skills
    skills: [{ type: String, trim: true }],
    // Eligible branches
    eligibleBranches: [{
      type: String,
      enum: ["CSE-AIML", "CSE-CS", "RAE", "all"],
    }],
    // Location
    location: {
      type: String,
      default: "On-site",
    },
    // Status tracking
    status: {
      type: String,
      enum: ["open", "closed", "ongoing"],
      default: "open",
    },
    // Posted by admin/TPO
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Live upvote for ranking popular opportunities
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    upvoteCount: {
      type: Number,
      default: 0,
    },
    // Auto-generated tags
    tags: [{ type: String, lowercase: true, trim: true }],
  },
  {
    timestamps: true,
  }
);

placementSchema.index({ createdAt: -1 });
placementSchema.index({ type: 1 });
placementSchema.index({ status: 1 });
placementSchema.index({ deadline: 1 });
placementSchema.index({ upvoteCount: -1 });

const Placement = mongoose.model("Placement", placementSchema);
export default Placement;
