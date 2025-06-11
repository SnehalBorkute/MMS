// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');  // Adjust path as necessary

// Route to get menu for users
router.get('/menu', menuController.getMenuForUser);

module.exports = router;
