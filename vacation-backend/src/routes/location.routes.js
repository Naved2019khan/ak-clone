const express = require("express");
const router = express.Router();
const controller = require("../controllers/location.controller");
const upload = require("../middleware/upload");

router.get("/search", controller.search);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
