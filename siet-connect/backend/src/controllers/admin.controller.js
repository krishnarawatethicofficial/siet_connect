import User from "../models/user.model.js";
import Notice from "../models/notice.model.js";
import Placement from "../models/placement.model.js";
import Document from "../models/document.model.js";
import PYQ from "../models/pyq.model.js";

// Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const [users, notices, placements, documents, pyqs] = await Promise.all([
      User.countDocuments().lean(),
      Notice.countDocuments().lean(),
      Placement.countDocuments().lean(),
      Document.countDocuments().lean(),
      PYQ.countDocuments().lean(),
    ]);

    const pendingDocs = await Document.countDocuments({ status: "pending" }).lean();
    const openPlacements = await Placement.countDocuments({ status: "open" }).lean();

    res.json({
      success: true,
      data: {
        totalUsers: users,
        totalNotices: notices,
        totalPlacements: placements,
        totalDocuments: documents,
        totalPYQs: pyqs,
        pendingDocuments: pendingDocs,
        openPlacements: openPlacements,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};

// Get all users (admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, branch, search } = req.query;

    const filter = {};
    if (role && role !== "all") filter.role = role;
    if (branch && branch !== "all") filter.branch = branch;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).lean();

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// Update user role (admin)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating role" });
  }
};

// Update student attendance (admin/faculty)
export const updateAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { attendance },
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Alert if below threshold via Socket.io
    if (attendance < 75) {
      const io = req.app.get("io");
      io.emit("attendance:alert", {
        userId: user._id,
        name: user.name,
        attendance,
        message: `Attendance dropped to ${attendance}% — below 75% threshold`,
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating attendance" });
  }
};
