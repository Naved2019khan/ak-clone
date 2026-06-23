const express = require("express");
const router = express.Router();
const controller = require("../controllers/package.controller");
const upload = require("../middleware/upload");

// Dynamic fields: accept package images + up to 30 itinerary day images
const uploadFields = [
  { name: "images", maxCount: 10 },
  ...Array.from({ length: 30 }, (_, i) => ({ name: `itineraryImage_${i}`, maxCount: 1 })),
];

router.get("/", controller.getAll);
router.get("/slug/:slug", controller.getBySlug);
router.get("/:id", controller.getById);
router.post("/", upload.fields(uploadFields), controller.create);
router.put("/:id", upload.fields(uploadFields), controller.update);
router.delete("/:id/image", controller.deleteImage);
router.delete("/:id", controller.remove);

module.exports = router;
