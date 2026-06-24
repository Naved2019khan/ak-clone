const Country = require("../models/Country");
const { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require("../middleware/upload");

// @desc    Get all countries
// @route   GET /api/countries
exports.getAll = async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 });
    res.json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single country
// @route   GET /api/countries/:id
exports.getById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.json({ success: true, data: country });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create country
// @route   POST /api/countries
exports.create = async (req, res) => {
  try {
    const { name, code, description, image: imageUrl } = req.body;

    let image = "";
    if (imageUrl) {
      // Image already uploaded to Cloudinary from client
      image = imageUrl;
    } else if (req.file) {
      // Fallback: upload via multer buffer
      const result = await uploadToCloudinary(req.file.buffer, { folder: "vacation/countries" });
      image = result.secure_url;
    }

    const country = await Country.create({ name, code, description, image });
    res.status(201).json({ success: true, data: country });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Country already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update country
// @route   PUT /api/countries/:id
exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.image && req.body.image.startsWith("http")) {
      // Image already uploaded to Cloudinary from client — delete old one
      const existingCountry = await Country.findById(req.params.id);
      if (existingCountry && existingCountry.image && existingCountry.image !== req.body.image) {
        const publicId = getPublicIdFromUrl(existingCountry.image);
        if (publicId) {
          await deleteFromCloudinary(publicId).catch(() => {});
        }
      }
    } else if (req.file) {
      // Fallback: upload via multer buffer
      const existingCountry = await Country.findById(req.params.id);
      if (existingCountry && existingCountry.image) {
        const publicId = getPublicIdFromUrl(existingCountry.image);
        if (publicId) {
          await deleteFromCloudinary(publicId).catch(() => {});
        }
      }
      const result = await uploadToCloudinary(req.file.buffer, { folder: "vacation/countries" });
      updateData.image = result.secure_url;
    }

    const country = await Country.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.json({ success: true, data: country });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Country already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete country
// @route   DELETE /api/countries/:id
exports.remove = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    // Delete image from Cloudinary if exists
    if (country.image) {
      const publicId = getPublicIdFromUrl(country.image);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(() => {});
      }
    }
    res.json({ success: true, message: "Country deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
