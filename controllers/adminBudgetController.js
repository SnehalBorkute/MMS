const Budget = require("../models/budget");

// 1. Render Budget Page
exports.viewBudgetPage = async (req, res) => {
  try {
    const latestBudget = await Budget.findOne().sort({ createdAt: -1 }).lean();

    res.render("adminBudget", {
      budget: latestBudget || { items: [], totalCollection: 0 },
    });
  } catch (error) {
    console.error("Error loading budget page:", error);
    res.status(500).send("Error loading budget page");
  }
};

// 2. Save Budget Data (from form submission)
exports.submitBudgetData = async (req, res) => {
  try {
    const { items, prices, totalCollection } = req.body;

    const formattedItems = items.map((name, index) => ({
      name,
      price: parseFloat(prices[index]),
    }));

    const newBudget = new Budget({
      totalCollection: parseFloat(totalCollection),
      items: formattedItems,
      createdAt: new Date(),
    });

    await newBudget.save();
    res.redirect("/admin/budget/history");
  } catch (error) {
    console.error("Failed to save budget:", error);
    res.status(500).send("Failed to save budget data");
  }
};

// 3. View Budget History
exports.getAllBudgets = async (req, res) => {
  try {
    const previousBudgets = await Budget.find().sort({ createdAt: -1 }).lean();
    res.render("adminBudgetHistory", { previousBudgets });
  } catch (err) {
    console.error("Error fetching budget history:", err);
    res.status(500).send("Internal Server Error");
  }
};
