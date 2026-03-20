import Document from "../models/document.model.js";

// Get my document requests (student)
export const getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ requestedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("processedBy", "name")
      .lean();

    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching documents" });
  }
};

// Get all document requests (admin)
export const getAllDocuments = async (req, res) => {
  try {
    const { status, docType } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (docType && docType !== "all") filter.docType = docType;

    const docs = await Document.find(filter)
      .sort({ createdAt: -1 })
      .populate("requestedBy", "name studentId branch semester")
      .populate("processedBy", "name")
      .lean();

    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching documents" });
  }
};

// Create a document request
export const createDocument = async (req, res) => {
  try {
    const { docType, reason, priority } = req.body;

    const doc = await Document.create({
      requestedBy: req.user._id,
      docType,
      reason,
      priority: priority || "normal",
    });

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating request" });
  }
};

// Update document request status (admin)
export const updateDocumentStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status, remarks, processedBy: req.user._id },
      { new: true, runValidators: true }
    )
      .populate("requestedBy", "name studentId")
      .populate("processedBy", "name")
      .lean();

    if (!doc) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Notify student via Socket.io
    const io = req.app.get("io");
    io.emit("document:updated", doc);

    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating request" });
  }
};
