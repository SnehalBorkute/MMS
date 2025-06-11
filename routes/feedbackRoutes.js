const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Route to submit feedback
router.post("/submit", feedbackController.submitFeedback);

// Route to view feedback page
router.get("/", feedbackController.getAllFeedback);

module.exports = router;
