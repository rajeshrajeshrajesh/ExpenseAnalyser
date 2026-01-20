const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// Helper
const getMonthYear = (date) => {
  const d = new Date(date);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
};

// Add new budget
exports.addBudget = async (req, res) => {
  try {
    const { limit, category, period, date } = req.body;

    if (!limit || !category || !period) {
      return res.status(400).json({ error: "limit, category, and period are required" });
    }

    const budgetDate = date ? new Date(date) : new Date();

    const budget = new Budget({
      user: req.user.id,
      limit,
      category,
      period,
      monthYear: getMonthYear(budgetDate) // <-- added
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all budgets for logged-in user
exports.getBudgets = async (req, res) => {
  try {
    const { monthYear } = req.query;
    const filter = { user: req.user.id };
    if (monthYear) filter.monthYear = monthYear;

    const budgets = await Budget.find(filter);
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get distinct months
exports.getBudgetMonths = async (req, res) => {
  try {
    const months = await Budget.distinct("monthYear", { user: req.user.id });
    res.json(months.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get budget summary
exports.getBudgetSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { monthYear } = req.query;

    const filter = { user: userId };
    if (monthYear) filter.monthYear = monthYear;

    const budgets = await Budget.find(filter);

    const summary = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await Expense.aggregate([
          {
            $match: {
              user: mongoose.Types.ObjectId(userId),
              category: budget.category,
              ...(monthYear ? { monthYear } : {})
            }
          },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const spent = expenses.length > 0 ? expenses[0].total : 0;

        return {
          category: budget.category,
          budgetLimit: budget.limit,
          spent,
          remaining: budget.limit - spent,
          period: budget.period,
          monthYear: budget.monthYear
        };
      })
    );

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budget summary" });
  }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!deleted) return res.status(404).json({ error: "Budget not found" });
    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
