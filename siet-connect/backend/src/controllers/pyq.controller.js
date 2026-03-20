import PYQ from "../models/pyq.model.js";
import User from "../models/user.model.js";
import { extractTags } from "../utils/autoTag.js";

// Get PYQs with filtering
export const getPYQs = async (req, res) => {
  try {
    const { branch, semester, year, examType, search } = req.query;

    const filter = {};
    if (branch && branch !== "all") filter.branch = branch;
    if (semester) filter.semester = Number(semester);
    if (year) filter.year = Number(year);
    if (examType && examType !== "all") filter.examType = examType;
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: "i" } },
        { subjectCode: { $regex: search, $options: "i" } },
      ];
    }

    const pyqs = await PYQ.find(filter)
      .sort({ year: -1, semester: 1 })
      .populate("uploadedBy", "name")
      .lean();

    res.json({ success: true, data: pyqs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching PYQs" });
  }
};

// Upload a PYQ (admin/faculty)
export const createPYQ = async (req, res) => {
  try {
    const { subject, subjectCode, branch, semester, year, examType, fileUrl, fileType, fileSize } = req.body;

    const tags = extractTags(`${subject} ${subjectCode} ${examType}`);

    const pyq = await PYQ.create({
      subject,
      subjectCode,
      branch,
      semester,
      year,
      examType: examType || "end-sem",
      fileUrl,
      fileType: fileType || "PDF",
      fileSize: fileSize || "",
      uploadedBy: req.user._id,
      tags,
    });

    // Award XP for contributing
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 15 } });

    res.status(201).json({ success: true, data: pyq });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading PYQ" });
  }
};

// Track download (increment counter + XP)
export const downloadPYQ = async (req, res) => {
  try {
    const pyq = await PYQ.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    ).lean();

    if (!pyq) {
      return res.status(404).json({ success: false, message: "PYQ not found" });
    }

    // Award XP for engagement
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 1 } });

    res.json({ success: true, data: pyq });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error tracking download" });
  }
};

// Delete PYQ (admin only)
export const deletePYQ = async (req, res) => {
  try {
    await PYQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: "PYQ deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting PYQ" });
  }
};
