const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// Get Summary Report (monthly aware)
exports.getSummaryReport = async (req, res) => {
  try {
    const { period, startDate, endDate, monthYear } = req.query;
    const filter = { user: req.user.id };

    if (monthYear) {
      filter.monthYear = monthYear;
    } else if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter);

    // Group by category
    let spentByCategory = {};
    expenses.forEach(exp => {
      spentByCategory[exp.category] = (spentByCategory[exp.category] || 0) + exp.amount;
    });

    let budgetFilter = { user: req.user.id };
    if (monthYear) budgetFilter.monthYear = monthYear;
    else if (period) budgetFilter.period = period;

    const budgets = await Budget.find(budgetFilter);

    let report = [];
    budgets.forEach(b => {
      const spent = spentByCategory[b.category] || 0;
      const remaining = b.limit - spent;
      report.push({
        category: b.category,
        period: b.period,
        monthYear: b.monthYear,
        spent,
        remaining,
        exceeded: remaining < 0
      });
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Trends Report (by monthYear)
exports.getTrendsReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const matchFilter = { user: new mongoose.Types.ObjectId(userId) };

    if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) matchFilter.date.$gte = new Date(startDate);
      if (endDate) matchFilter.date.$lte = new Date(endDate);
    }

    const pipeline = [
      { $match: matchFilter },
      {
        $group: {
          _id: "$monthYear",
          totalSpent: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ];

    const trends = await Expense.aggregate(pipeline);
    res.json(trends);
  } catch (err) {
    console.error("Error generating trends report:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Category Report (monthly aware)
exports.getCategoryReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { monthYear, startDate, endDate } = req.query;

    const matchFilter = { user: new mongoose.Types.ObjectId(userId) };
    if (monthYear) {
      matchFilter.monthYear = monthYear;
    } else if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) matchFilter.date.$gte = new Date(startDate);
      if (endDate) matchFilter.date.$lte = new Date(endDate);
    }

    const results = await Expense.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: null,
          grandTotal: { $sum: "$totalSpent" },
          categories: { $push: { category: "$_id", totalSpent: "$totalSpent" } }
        }
      },
      { $unwind: "$categories" },
      {
        $addFields: {
          "categories.percentage": {
            $multiply: [{ $divide: ["$categories.totalSpent", "$grandTotal"] }, 100]
          }
        }
      },
      {
        $group: {
          _id: "$_id",
          grandTotal: { $first: "$grandTotal" },
          categories: { $push: "$categories" }
        }
      },
      { $project: { _id: 0, grandTotal: 1, categories: 1 } }
    ]);

    res.json(results[0] || { grandTotal: 0, categories: [] });
  } catch (err) {
    console.error("Error generating category report:", err);
    res.status(500).json({ error: "Failed to generate category report" });
  }
};
