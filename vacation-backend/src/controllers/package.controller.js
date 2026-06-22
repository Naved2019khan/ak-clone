const Package = require("../models/Package");
const { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require("../middleware/upload");

// @desc    Get all packages
// @route   GET /api/packages
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.country) filter.country = req.query.country;
    if (req.query.location) filter.location = req.query.location;
    if (req.query.travelType) filter.travelType = req.query.travelType;
    if (req.query.featured) filter.isFeatured = req.query.featured === "true";

    const packages = await Package.find(filter)
      .populate("country", "name code")
      .populate("location", "name")
      .populate("travelType", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single package
// @desc    Get single package by ID
// @route   GET /api/packages/:id
exports.getById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
      .populate("country", "name code image")
      .populate("location", "name image")
      .populate("travelType", "name image");

    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single package by slug
// @route   GET /api/packages/slug/:slug
exports.getBySlug = async (req, res) => {
  try {
    let pkg = await Package.findOne({ slug: req.params.slug })
      .populate("country", "name code image")
      .populate("location", "name image")
      .populate("travelType", "name image");

    // Fallback: try by _id if slug not found
    if (!pkg && req.params.slug.match(/^[0-9a-fA-F]{24}$/)) {
      pkg = await Package.findById(req.params.slug)
        .populate("country", "name code image")
        .populate("location", "name image")
        .populate("travelType", "name image");
    }

    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create package
// @route   POST /api/packages
exports.create = async (req, res) => {
  try {
    const {
      title,
      description,
      country,
      location,
      travelType,
      price,
      strikePrice,
      duration,
      highlights,
      amenities,
      inclusions,
      exclusions,
      itinerary,
      isFeatured,
    } = req.body;

    // Upload images to Cloudinary
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, { folder: "vacation/packages" })
      );
      const results = await Promise.all(uploadPromises);
      images = results.map((r) => r.secure_url);
    }

    const pkg = await Package.create({
      title,
      description,
      country,
      location,
      travelType,
      price,
      strikePrice: strikePrice || 0,
      duration: typeof duration === "string" ? JSON.parse(duration) : duration,
      highlights: typeof highlights === "string" ? JSON.parse(highlights) : highlights,
      amenities: typeof amenities === "string" ? JSON.parse(amenities) : amenities,
      inclusions: typeof inclusions === "string" ? JSON.parse(inclusions) : inclusions,
      exclusions: typeof exclusions === "string" ? JSON.parse(exclusions) : exclusions,
      itinerary: typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary || [],
      images,
      isFeatured,
    });

    const populated = await pkg.populate([
      { path: "country", select: "name code" },
      { path: "location", select: "name" },
      { path: "travelType", select: "name" },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      // Upload new images to Cloudinary
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, { folder: "vacation/packages" })
      );
      const results = await Promise.all(uploadPromises);
      updateData.images = results.map((r) => r.secure_url);
    }

    // Parse JSON strings if sent from FormData
    if (typeof updateData.duration === "string") {
      updateData.duration = JSON.parse(updateData.duration);
    }
    if (typeof updateData.highlights === "string") {
      updateData.highlights = JSON.parse(updateData.highlights);
    }
    if (typeof updateData.amenities === "string") {
      updateData.amenities = JSON.parse(updateData.amenities);
    }
    if (typeof updateData.inclusions === "string") {
      updateData.inclusions = JSON.parse(updateData.inclusions);
    }
    if (typeof updateData.exclusions === "string") {
      updateData.exclusions = JSON.parse(updateData.exclusions);
    }
    if (typeof updateData.itinerary === "string") {
      updateData.itinerary = JSON.parse(updateData.itinerary);
    }

    const pkg = await Package.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("country", "name code")
      .populate("location", "name")
      .populate("travelType", "name");

    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a single image from package
// @route   DELETE /api/packages/:id/image
exports.deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    // Delete from Cloudinary
    if (imageUrl) {
      const publicId = getPublicIdFromUrl(imageUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(() => {});
      }
      // Remove from images array
      pkg.images = pkg.images.filter((img) => img !== imageUrl);
      await pkg.save();
    }

    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
exports.remove = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, message: "Package deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
