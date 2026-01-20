const express = require("express");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/summary (user-specific) with optional filters
// ?category=Food&startDate=2025-01-01&endDate=2025-01-31
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, startDate, endDate } = req.query;

    // build a reusable match for expenses
    const expenseMatch = { user: userId };
    if (category) expenseMatch.category = category;
    if (startDate || endDate) {
      expenseMatch.date = {};
      if (startDate) expenseMatch.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        expenseMatch.date.$lte = end;
      }
    }

    // ✅ Expense Summary (group by category, filtered by user + filters)
    const expenseSummary = await Expense.aggregate([
      { $match: expenseMatch },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
        },
      },
      { $sort: { totalSpent: -1 } }
    ]);

    // ✅ Budget Summary (this user's budgets), compute spent with same expenseMatch
    const budgets = await Budget.find({ user: userId });

    const budgetSummary = await Promise.all(
      budgets.map(async (budget) => {
        const matchForBudget = {
          ...expenseMatch,
          category: budget.category, // override to this budget category
        };

        const spentAgg = await Expense.aggregate([
          { $match: matchForBudget },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const spent = spentAgg.length > 0 ? spentAgg[0].total : 0;
        const remaining = (Number(budget.limit) || 0) - spent;

        return {
          category: budget.category,
          limit: budget.limit,
          period: budget.period,
          spent,
          remaining,
          status: remaining < 0 ? "Over Budget" : "Within Budget",
        };
      })
    );

    res.json({
      expenseSummary,
      budgetSummary,
    });
  } catch (err) {
    console.error("Error in summary API:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

module.exports = router;
