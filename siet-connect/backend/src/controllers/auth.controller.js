import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";

// Register a new user
export const signup = async (req, res) => {
  try {
    const { name, email, password, studentId, role, branch, semester, phone } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { studentId }] }).lean();
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email or Student ID already registered" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      studentId,
      role: role || "student",
      branch: branch || "general",
      semester: semester || 1,
      phone: phone || "",
    });

    generateToken(user._id, res);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
        xp: user.xp,
        streak: user.streak,
        attendance: user.attendance,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
};

// Login existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Update streak on login
    const now = new Date();
    const lastLogin = new Date(user.lastLogin);
    const diffDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1;
      user.xp += 10; // +10 XP for maintaining streak
    } else if (diffDays > 1) {
      user.streak = 1; // reset streak
    }
    // diffDays === 0 means same day, no streak change

    // Update activity heatmap
    const dateKey = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentCount = user.activityMap.get(dateKey) || 0;
    user.activityMap.set(dateKey, currentCount + 1);

    user.lastLogin = now;
    await user.save();

    generateToken(user._id, res);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
        xp: user.xp,
        streak: user.streak,
        attendance: user.attendance,
        activityMap: Object.fromEntries(user.activityMap),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// Logout — clear cookie
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, data: { message: "Logged out successfully" } });
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching profile" });
  }
};

// Update own profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, branch, semester } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, branch, semester },
      { new: true, runValidators: true }
    ).select("-password").lean();

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};
