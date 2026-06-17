const TravelType = require("../models/TravelType");

// @desc    Get all travel types
// @route   GET /api/travel-types
exports.getAll = async (req, res) => {
  try {
    const travelTypes = await TravelType.find().sort({ createdAt: -1 });
    res.json({ success: true, data: travelTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single travel type
// @route   GET /api/travel-types/:id
exports.getById = async (req, res) => {
  try {
    const travelType = await TravelType.findById(req.params.id);
    if (!travelType) {
      return res.status(404).json({ success: false, message: "Travel type not found" });
    }
    res.json({ success: true, data: travelType });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create travel type
// @route   POST /api/travel-types
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : "";

    const travelType = await TravelType.create({ name, description, image });
    res.status(201).json({ success: true, data: travelType });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Travel type already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update travel type
// @route   PUT /api/travel-types/:id
exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const travelType = await TravelType.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!travelType) {
      return res.status(404).json({ success: false, message: "Travel type not found" });
    }
    res.json({ success: true, data: travelType });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Travel type already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete travel type
// @route   DELETE /api/travel-types/:id
exports.remove = async (req, res) => {
  try {
    const travelType = await TravelType.findByIdAndDelete(req.params.id);
    if (!travelType) {
      return res.status(404).json({ success: false, message: "Travel type not found" });
    }
    res.json({ success: true, message: "Travel type deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
