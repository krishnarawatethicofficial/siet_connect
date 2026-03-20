import User from "../models/user.model.js";

// Get XP leaderboard (top 50 users)
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: "student" })
      .sort({ xp: -1 })
      .limit(50)
      .select("name studentId branch semester xp streak")
      .lean();

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching leaderboard" });
  }
};

// Get user's activity heatmap data
export const getActivityMap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("activityMap xp streak").lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: {
        activityMap: user.activityMap || {},
        xp: user.xp,
        streak: user.streak,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching activity" });
  }
};
