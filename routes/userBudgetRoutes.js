const express = require('express');
const router = express.Router();
const userBudgetController = require('../controllers/userBudgetController');

// Use the controller method you already created
router.get('/view-budget', userBudgetController.viewUserBudget);

module.exports = router;
