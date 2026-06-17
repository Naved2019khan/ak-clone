const express = require("express");
const router = express.Router();
const controller = require("../controllers/package.controller");
const upload = require("../middleware/upload");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", upload.array("images", 10), controller.create);
router.put("/:id", upload.array("images", 10), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
