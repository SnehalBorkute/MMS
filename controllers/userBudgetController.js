const Budget = require('../models/budget');

// Render user-facing budget transparency page
exports.viewUserBudget = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ createdAt: -1 }).lean();
    const currentBudget = budgets.length > 0 ? budgets[0] : null;
    const previousBudgets = budgets.slice(1); // all except latest

    res.render('userViewBudget', {
      currentBudget,
      previousBudgets
    });
  } catch (error) {
    console.error('Error fetching user budget data:', error);
    res.status(500).send('Internal Server Error');
  }
};

