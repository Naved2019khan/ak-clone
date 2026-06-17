const express = require("express");
const router = express.Router();
const controller = require("../controllers/country.controller");
const upload = require("../middleware/upload");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
