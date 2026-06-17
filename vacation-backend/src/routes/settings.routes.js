const express = require("express");
const router = express.Router();
const Setting = require("../models/Setting");

// @desc    Get featured count
// @route   GET /api/settings/featured-count
router.get("/featured-count", async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: "featured_count" });
    const count = setting ? setting.value : 4;
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Set featured count
// @route   POST /api/settings/featured-count
router.post("/featured-count", async (req, res) => {
  try {
    const { count } = req.body;
    const value = Math.max(1, Math.min(20, Number(count) || 4));

    await Setting.findOneAndUpdate(
      { key: "featured_count" },
      { key: "featured_count", value },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: { count: value } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get featured packages for frontend
// @route   GET /api/settings/featured-packages
router.get("/featured-packages", async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: "featured_count" });
    const count = setting ? setting.value : 4;

    const Package = require("../models/Package");
    const packages = await Package.find({ isFeatured: true, isActive: true })
      .populate("country", "name code")
      .populate("location", "name")
      .populate("travelType", "name")
      .sort({ createdAt: -1 })
      .limit(count);

    res.json({ success: true, data: { packages, count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
