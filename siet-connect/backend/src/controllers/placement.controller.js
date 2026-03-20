import Placement from "../models/placement.model.js";
import User from "../models/user.model.js";
import { extractTags } from "../utils/autoTag.js";

// Get all placements with filtering
export const getPlacements = async (req, res) => {
  try {
    const { type, status, branch, search, sort } = req.query;

    const filter = {};
    if (type && type !== "all") filter.type = type;
    if (status && status !== "all") filter.status = status;
    if (branch && branch !== "all") filter.eligibleBranches = { $in: [branch, "all"] };
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption = sort === "popular" ? { upvoteCount: -1 } : { createdAt: -1 };

    const placements = await Placement.find(filter)
      .sort(sortOption)
      .populate("postedBy", "name")
      .lean();

    res.json({ success: true, data: placements });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching placements" });
  }
};

// Get placement stats (avg package, top recruiters, etc.)
export const getPlacementStats = async (req, res) => {
  try {
    const total = await Placement.countDocuments().lean();
    const open = await Placement.countDocuments({ status: "open" }).lean();
    const internships = await Placement.countDocuments({ type: "internship" }).lean();
    const fulltime = await Placement.countDocuments({ type: "fulltime" }).lean();

    res.json({
      success: true,
      data: {
        total,
        open,
        internships,
        fulltime,
        avgPackage: "5.2 LPA", // placeholder — computed from real data in prod
        topRecruiters: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant"],
        placementRate: "85%",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};

// Create a placement (admin/faculty only)
export const createPlacement = async (req, res) => {
  try {
    const { company, role, type, stipend, package: pkg, applyLink, deadline, description, skills, eligibleBranches, location } = req.body;

    const tags = extractTags(`${company} ${role} ${description}`);

    const placement = await Placement.create({
      company,
      role,
      type,
      stipend: stipend || "Not disclosed",
      package: pkg || "Not disclosed",
      applyLink: applyLink || "",
      deadline,
      description,
      skills: skills || [],
      eligibleBranches: eligibleBranches || ["all"],
      location: location || "On-site",
      postedBy: req.user._id,
      tags,
    });

    const populated = await Placement.findById(placement._id).populate("postedBy", "name").lean();

    const io = req.app.get("io");
    io.emit("placement:new", populated);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating placement" });
  }
};

// Upvote a placement opportunity
export const upvotePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ success: false, message: "Placement not found" });
    }

    const userId = req.user._id;
    const hasUpvoted = placement.upvotes.includes(userId);

    if (hasUpvoted) {
      placement.upvotes = placement.upvotes.filter((id) => id.toString() !== userId.toString());
    } else {
      placement.upvotes.push(userId);
      await User.findByIdAndUpdate(userId, { $inc: { xp: 2 } });
    }

    placement.upvoteCount = placement.upvotes.length;
    await placement.save();

    res.json({ success: true, data: { upvoteCount: placement.upvoteCount, hasUpvoted: !hasUpvoted } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error upvoting placement" });
  }
};

// Delete a placement (admin only)
export const deletePlacement = async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: "Placement deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting placement" });
  }
};
