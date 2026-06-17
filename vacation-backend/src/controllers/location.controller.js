const Location = require("../models/Location");

// @desc    Get all locations
// @route   GET /api/locations
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.country) {
      filter.country = req.query.country;
    }

    const locations = await Location.find(filter)
      .populate("country", "name code")
      .sort({ name: 1 });
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
exports.getById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate("country", "name code");
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create location
// @route   POST /api/locations
exports.create = async (req, res) => {
  try {
    const { name, country, description } = req.body;
    const image = req.file ? req.file.path : "";

    const location = await Location.create({ name, country, description, image });
    const populated = await location.populate("country", "name code");
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Location already exists in this country" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const location = await Location.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("country", "name code");

    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Location already exists in this country" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
exports.remove = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }
    res.json({ success: true, message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
