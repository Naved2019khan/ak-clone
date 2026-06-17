const express = require("express");
const router = express.Router();
const Location = require("../models/Location");
const TravelType = require("../models/TravelType");

// @desc    Get all destinations (locations with pricing info) for frontend
// @route   GET /api/destinations
// @query   ?type=TRAVEL_TYPE_ID&country=COUNTRY_ID
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      // Filter locations that have this travel type in their packageTypes array
      filter.packageTypes = req.query.type;
    }
    if (req.query.country) {
      filter.country = req.query.country;
    }

    const locations = await Location.find(filter)
      .populate("country", "name code")
      .populate("packageTypes", "name")
      .sort({ rating: -1, createdAt: -1 });

    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get filter options (travel types) for destination filtering
// @route   GET /api/destinations/filters
router.get("/filters", async (req, res) => {
  try {
    const travelTypes = await TravelType.find({ isActive: true }).select("name").sort({ name: 1 });
    res.json({ success: true, data: travelTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
