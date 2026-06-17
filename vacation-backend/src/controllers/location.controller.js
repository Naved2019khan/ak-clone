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
      .populate("packageTypes", "name")
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
    const { name, country, description, price, strikePrice, rating, reviews, days, nights, tag, packageTypes } = req.body;
    const image = req.file ? req.file.path : "";

    // Parse packageTypes if it's a JSON string
    let parsedPackageTypes = packageTypes;
    if (typeof packageTypes === "string") {
      try { parsedPackageTypes = JSON.parse(packageTypes); } catch { parsedPackageTypes = []; }
    }

    const location = await Location.create({
      name, country, description, image,
      price: price || 0,
      strikePrice: strikePrice || 0,
      rating: rating || 0,
      reviews: reviews || 0,
      days: days || 1,
      nights: nights || 0,
      tag: tag || "",
      packageTypes: parsedPackageTypes || [],
    });
    const populated = await location.populate(["country", "packageTypes"]);
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
    // Parse packageTypes if it's a JSON string
    if (typeof updateData.packageTypes === "string") {
      try { updateData.packageTypes = JSON.parse(updateData.packageTypes); } catch { updateData.packageTypes = []; }
    }

    const location = await Location.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("country", "name code").populate("packageTypes", "name");

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
