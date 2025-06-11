const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/adminBudgetController');

// View budget page
router.get('/budget', budgetController.viewBudgetPage);

// Submit budget data
router.post('/budget', budgetController.submitBudgetData);

// router.get("/budget/history", budgetController.getAllBudgets);
router.get('/budget', budgetController.viewBudgetPage); // फक्त 1 GET ठेव

router.post('/budget', budgetController.submitBudgetData); // Form submission

router.get('/budget/history', budgetController.getAllBudgets); // Show previous budgets

module.exports = router;
