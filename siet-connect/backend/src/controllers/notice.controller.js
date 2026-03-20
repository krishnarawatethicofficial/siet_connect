import Notice from "../models/notice.model.js";
import User from "../models/user.model.js";
import { extractTags } from "../utils/autoTag.js";

// Get all notices with filtering and sorting
export const getNotices = async (req, res) => {
  try {
    const { category, branch, search, sort } = req.query;

    const filter = {};
    if (category && category !== "all") filter.category = category;
    if (branch && branch !== "all") filter.targetBranch = { $in: [branch, "all"] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption = sort === "popular" ? { upvoteCount: -1 } : { isPinned: -1, createdAt: -1 };

    const notices = await Notice.find(filter)
      .sort(sortOption)
      .populate("postedBy", "name role")
      .lean();

    res.json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notices" });
  }
};

// Create a new notice (admin/faculty only)
export const createNotice = async (req, res) => {
  try {
    const { title, content, category, targetBranch, targetSemester, isPinned, attachmentUrl, fileType, fileSize } = req.body;

    // Auto-tag from title + content
    const tags = extractTags(`${title} ${content}`);

    const notice = await Notice.create({
      title,
      content,
      category: category || "general",
      tags,
      postedBy: req.user._id,
      targetBranch: targetBranch || "all",
      targetSemester: targetSemester || 0,
      isPinned: isPinned || false,
      attachmentUrl: attachmentUrl || "",
      fileType: fileType || "",
      fileSize: fileSize || "",
    });

    const populated = await Notice.findById(notice._id).populate("postedBy", "name role").lean();

    // Broadcast new notice via Socket.io
    const io = req.app.get("io");
    io.emit("notice:new", populated);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating notice" });
  }
};

// Upvote a notice — pushes urgent items to top
export const upvoteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    const userId = req.user._id;
    const hasUpvoted = notice.upvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote (toggle)
      notice.upvotes = notice.upvotes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Add upvote + award XP to voter
      notice.upvotes.push(userId);
      await User.findByIdAndUpdate(userId, { $inc: { xp: 2 } });
    }

    notice.upvoteCount = notice.upvotes.length;
    await notice.save();

    // Broadcast upvote via Socket.io
    const io = req.app.get("io");
    io.emit("notice:upvoted", { noticeId: notice._id, upvoteCount: notice.upvoteCount });

    res.json({ success: true, data: { upvoteCount: notice.upvoteCount, hasUpvoted: !hasUpvoted } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error upvoting notice" });
  }
};

// Delete a notice (admin only)
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    res.json({ success: true, data: { message: "Notice deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting notice" });
  }
};
