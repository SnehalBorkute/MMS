


const Feedback = require("../models/feedback");

exports.getAllFeedbackForAdmin = async (req, res) => {
    try {
        console.log("Fetching admin feedbacks...");
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });

        console.log("Fetched feedbacks:", feedbacks.length);
        res.render("admin_feedback", { feedbacks });
    } catch (error) {
        console.error("Admin Feedback Fetch Error:", error.message);
        res.status(500).send("Error fetching feedback");
    }
};
