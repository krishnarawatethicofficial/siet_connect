import { generateToken } from "../utils/token.js";

// DUMMY LOGIN - accepts any email/password
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Dummy user - accepts anything
    const dummyUser = {
      _id: "dummy-" + Date.now(),
      name: email.split("@")[0],
      email: email,
      studentId: "SIET2024001",
      role: "student",
      branch: "CSE-AIML",
      semester: 1,
      xp: 100,
      streak: 5,
      attendance: 85,
    };

    // Generate token for dummy user
    generateToken(dummyUser._id, res);

    res.json({
      success: true,
      data: dummyUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error" });
  }
};

// DUMMY SIGNUP - accepts any email/password
export const signup = async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;

    const dummyUser = {
      _id: "dummy-" + Date.now(),
      name: name || email.split("@")[0],
      email: email,
      studentId: studentId || "SIET2024001",
      role: "student",
      branch: "CSE-AIML",
      semester: 1,
      xp: 0,
      streak: 0,
      attendance: 0,
    };

    generateToken(dummyUser._id, res);

    res.status(201).json({
      success: true,
      data: dummyUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Signup error" });
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
