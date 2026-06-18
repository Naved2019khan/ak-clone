const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller");

// Public route - frontend can create bookings without auth
router.post("/", controller.create);

// Admin routes
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
