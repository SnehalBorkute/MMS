
const express = require("express");
const router = express.Router();
const adminFeedbackController = require("../controllers/adminFeedbackController");

router.get("/", adminFeedbackController.getAllFeedbackForAdmin);

module.exports = router;

