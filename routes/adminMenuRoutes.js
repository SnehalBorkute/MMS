const express = require("express");
const router = express.Router();
const menuController = require("../controllers/adminMenuController");

router.get("/", menuController.renderMenuPage);
router.post("/add", menuController.addMenu);
router.get("/delete/:id", menuController.deleteMenu);
router.get("/edit/:id", menuController.renderEditPage);
router.post("/edit/:id", menuController.updateMenu);

module.exports = router;
