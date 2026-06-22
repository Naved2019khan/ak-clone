const Location = require("../models/Location");
const { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require("../middleware/upload");

// @desc    Search locations
// @route   GET /api/locations/search
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = { isActive: true };

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { name: regex },
        { description: regex },
        { tag: regex },
      ];
    }

    // First find matching locations by name/description/tag
    let locations = await Location.find(filter)
      .populate("country", "name code")
      .populate("packageTypes", "name")
      .sort({ rating: -1, name: 1 })
      .limit(50);

    // If query provided, also search by country name
    if (q && q.trim() && locations.length < 50) {
      const Country = require("../models/Country");
      const regex = new RegExp(q.trim(), "i");
      const matchingCountries = await Country.find({ name: regex }).select("_id");
      if (matchingCountries.length > 0) {
        const countryIds = matchingCountries.map((c) => c._id);
        const existingIds = locations.map((l) => l._id.toString());
        const countryLocations = await Location.find({
          isActive: true,
          country: { $in: countryIds },
          _id: { $nin: existingIds },
        })
          .populate("country", "name code")
          .populate("packageTypes", "name")
          .sort({ rating: -1, name: 1 })
          .limit(50 - locations.length);
        locations = [...locations, ...countryLocations];
      }
    }

    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
    
    let image = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, { folder: "vacation/locations" });
      image = result.secure_url;
    }

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
      // Delete old image from Cloudinary if exists
      const existingLocation = await Location.findById(req.params.id);
      if (existingLocation && existingLocation.image) {
        const publicId = getPublicIdFromUrl(existingLocation.image);
        if (publicId) {
          await deleteFromCloudinary(publicId).catch(() => {});
        }
      }
      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer, { folder: "vacation/locations" });
      updateData.image = result.secure_url;
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

// @desc    Delete location image
// @route   DELETE /api/locations/:id/image
exports.deleteImage = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }
    if (location.image) {
      const publicId = getPublicIdFromUrl(location.image);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(() => {});
      }
      location.image = "";
      await location.save();
    }
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
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
