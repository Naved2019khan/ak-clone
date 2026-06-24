const TravelType = require("../models/TravelType");
const { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require("../middleware/upload");

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
    const { name, description, image: imageUrl } = req.body;

    let image = "";
    if (imageUrl) {
      // Image already uploaded to Cloudinary from client
      image = imageUrl;
    } else if (req.file) {
      // Fallback: upload via multer buffer
      const result = await uploadToCloudinary(req.file.buffer, { folder: "vacation/travel-types" });
      image = result.secure_url;
    }

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

    if (req.body.image && req.body.image.startsWith("http")) {
      // Image already uploaded to Cloudinary from client — delete old one
      const existingType = await TravelType.findById(req.params.id);
      if (existingType && existingType.image && existingType.image !== req.body.image) {
        const publicId = getPublicIdFromUrl(existingType.image);
        if (publicId) {
          await deleteFromCloudinary(publicId).catch(() => {});
        }
      }
    } else if (req.file) {
      // Fallback: upload via multer buffer
      const existingType = await TravelType.findById(req.params.id);
      if (existingType && existingType.image) {
        const publicId = getPublicIdFromUrl(existingType.image);
        if (publicId) {
          await deleteFromCloudinary(publicId).catch(() => {});
        }
      }
      const result = await uploadToCloudinary(req.file.buffer, { folder: "vacation/travel-types" });
      updateData.image = result.secure_url;
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
    // Delete image from Cloudinary if exists
    if (travelType.image) {
      const publicId = getPublicIdFromUrl(travelType.image);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(() => {});
      }
    }
    res.json({ success: true, message: "Travel type deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
