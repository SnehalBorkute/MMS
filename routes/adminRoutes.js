const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middlewares/auth');
const menuController = require('../controllers/adminMenuController');
const adminFeedbackController = require("../controllers/adminFeedbackController");

router.get('/dashboard', isAdmin, adminController.dashboard);
router.get('/attendance', isAdmin, adminController.viewAttendance);

router.get('/users', isAdmin, adminController.viewUsers);
router.post('/users/delete/:id', isAdmin, adminController.deleteUser);

router.get('/menu', adminController.renderMenuPage);
router.post('/menu/add', adminController.addMenu);
router.get('/menu/delete/:id', adminController.deleteMenu);
router.get('/menu/edit/:id', adminController.renderEditPage);
router.post('/menu/edit/:id', adminController.updateMenu);



router.get('/payments', isAdmin, adminController.viewPayments);

//router.get('/feedback', isAdmin, adminController.viewFeedback);
router.get("/feedback", adminFeedbackController.getAllFeedbackForAdmin);

module.exports = router;
