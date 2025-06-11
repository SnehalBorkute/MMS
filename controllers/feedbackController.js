const Feedback = require("../models/feedback");

// Submit feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { studentName, rating, comments } = req.body;
        const feedback = new Feedback({ studentName, rating, comments });
        await feedback.save();
        res.redirect("/feedback");
    } catch (error) {
        res.status(500).send("Error submitting feedback");
    }
};

// Get all feedbacks
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.render("feedback", { feedbacks });
    } catch (error) {
        res.status(500).send("Error fetching feedback");
    }
};
