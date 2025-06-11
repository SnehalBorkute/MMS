

const Attendance = require('../models/attendanceModel');
const User = require('../models/user');
const Payment = require('../models/payment');
const Feedback = require('../models/feedback');

// Menu Management Functions
const {
    renderMenuPage,
    addMenu,
    deleteMenu,
    renderEditPage,
    updateMenu
} = require('./adminMenuController');

// Admin Dashboard
exports.dashboard = (req, res) => {
    res.render('admindashboard');
};

// Attendance Management
exports.viewAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find().populate('userId');
        res.render('admin_attendance', {
            attendance,
            absentees,
            selectedDate: req.query.date || null
        });
    } catch (error) {
        res.status(500).send('Error fetching attendance');
    }
};

// User Management
exports.viewUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin_users', { users });
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/users');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
};

// Payment Management
exports.viewPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('userId');
        res.render('admin_payments', { payments });
    } catch (err) {
        res.status(500).send('Error fetching payments');
    }
};

// Feedback Management
exports.viewFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId');
        res.render('admin_feedback', { feedbacks });
    } catch (err) {
        res.status(500).send('Error fetching feedback');
    }
};

// Menu Management
exports.renderMenuPage = renderMenuPage;
exports.addMenu = addMenu;
exports.deleteMenu = deleteMenu;
exports.renderEditPage = renderEditPage;
exports.updateMenu = updateMenu;
