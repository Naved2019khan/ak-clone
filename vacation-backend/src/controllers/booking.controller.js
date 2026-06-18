const Booking = require("../models/Booking");

// @desc    Create a new booking (public - from frontend)
// @route   POST /api/bookings
exports.create = async (req, res) => {
  try {
    const { package: packageId, fullName, email, phone, travelers, duration, travelDate, specialRequests } = req.body;

    if (!packageId || !fullName || !email || !phone) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const booking = await Booking.create({
      package: packageId,
      fullName,
      email,
      phone,
      travelers: travelers || 1,
      duration: duration || "",
      travelDate: travelDate || "",
      specialRequests: specialRequests || "",
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate({
        path: "package",
        select: "title slug price duration country location",
        populate: [
          { path: "country", select: "name" },
          { path: "location", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
exports.getById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "package",
      select: "title slug price duration country location",
      populate: [
        { path: "country", select: "name" },
        { path: "location", select: "name" },
      ],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status/notes (admin)
// @route   PUT /api/bookings/:id
exports.update = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate({
      path: "package",
      select: "title slug price duration country location",
      populate: [
        { path: "country", select: "name" },
        { path: "location", select: "name" },
      ],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete booking (admin)
// @route   DELETE /api/bookings/:id
exports.remove = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
