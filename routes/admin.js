const express = require('express');
const router = express.Router();
const adminMenuController = require('../controllers/adminMenuController');

// View menu
router.get('/menu', adminMenuController.viewMenu);

// Add menu
router.post('/menu/add', adminMenuController.addMenuItem);

// Edit menu
router.post('/menu/edit/:id', adminMenuController.editMenuItem);

// Delete menu
router.get('/menu/delete/:id', adminMenuController.deleteMenuItem);

module.exports = router;
