import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Full name of the student/faculty
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // College email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Hashed password
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    // Student ID / Employee ID
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Role for access control
    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },
    // Branch/department
    branch: {
      type: String,
      enum: ["CSE-AIML", "CSE-CS", "RAE", "general"],
      default: "general",
    },
    // Current semester (1-8)
    semester: {
      type: Number,
      min: 1,
      max: 8,
      default: 1,
    },
    // Attendance percentage
    attendance: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    // XP for gamification / streak system
    xp: {
      type: Number,
      default: 0,
    },
    // Current login streak (days)
    streak: {
      type: Number,
      default: 0,
    },
    // Last login date for streak calculation
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    // Activity heatmap — stores day counts for last 365 days
    activityMap: {
      type: Map,
      of: Number,
      default: {},
    },
    // Profile photo URL (optional)
    avatar: {
      type: String,
      default: "",
    },
    // Phone number (optional)
    phone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries (unique fields already indexed via schema)
userSchema.index({ role: 1 });
userSchema.index({ xp: -1 }); // leaderboard sorting

const User = mongoose.model("User", userSchema);
export default User;
