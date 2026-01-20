const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");
const getMonthYear = require("../helper/getMonthYear");

// ✅ Add new expense
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || typeof amount !== "number" || isNaN(amount) || !category) {
      return res.status(400).json({
        error: "title, numeric amount, and category are required",
      });
    }

    const expense = new Expense({
      user: new mongoose.Types.ObjectId(req.user.id),
      title: title.trim(),
      amount: Number(amount),
      category: category.trim(),
      date: date ? new Date(date) : new Date(),
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("addExpense error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ✅ Get all expenses (with optional month filter)
 */
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { monthYear } = req.query;

    const filter = { user: new mongoose.Types.ObjectId(userId) };

    if (monthYear) {
      const [monthName, year] = monthYear.split(" ");
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
      const start = new Date(year, monthIndex, 1);
      const end = new Date(year, monthIndex + 1, 1);

      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.json(
      expenses.map((exp) => ({
        id: exp._id,
        title: exp.title,
        amount: exp.amount,
        category: exp.category,
        date: exp.date,
        monthYear: getMonthYear(exp.date),
      }))
    );
  } catch (err) {
    console.error("getExpenses error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ✅ Get single expense by ID
 */
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (err) {
    console.error("getExpenseById error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ✅ Update expense by ID
 */
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        ...(title && { title: title.trim() }),
        ...(amount !== undefined && { amount: Number(amount) }),
        ...(category && { category: category.trim() }),
        ...(date && { date: new Date(date) }),
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    console.error("updateExpense error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ✅ Delete expense by ID
 */
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("deleteExpense error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ✅ Get expenses summary (renamed from getSummaryReport)
 */
exports.getExpensesSummary = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    const filter = { user: req.user.id };

    let start, end;
    const now = new Date();

    if (period === "daily") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (period === "weekly") {
      const firstDayOfWeek = now.getDate() - now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
      end = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek + 7);
    } else if (period === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (period === "yearly") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear() + 1, 0, 1);
    } else if (startDate || endDate) {
      start = startDate ? new Date(startDate) : null;
      end = endDate ? new Date(endDate) : null;
    }

    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = start;
      if (end) filter.date.$lte = end;
    }

    const expenses = await Expense.find(filter);

    let spentByCategory = {};
    expenses.forEach((exp) => {
      spentByCategory[exp.category] =
        (spentByCategory[exp.category] || 0) + exp.amount;
    });

    let budgets;
    if (period) {
      budgets = await Budget.find({ user: req.user.id, period });
    } else {
      budgets = await Budget.find({ user: req.user.id });
    }

    let report = [];
    budgets.forEach((b) => {
      const spent = spentByCategory[b.category] || 0;
      const remaining = b.limit - spent;
      report.push({
        category: b.category,
        period: b.period,
        spent,
        remaining,
        exceeded: remaining < 0,
      });
    });

    res.json(report);
  } catch (err) {
    console.error("getExpensesSummary error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get Trends Report
 */
exports.getTrendsReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period, startDate, endDate } = req.query;

    const periodFormat = {
      daily: "%Y-%m-%d",
      weekly: "%Y-%U",
      monthly: "%Y-%m",
      yearly: "%Y",
    }[period] || "%Y-%m";

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
          _id: {
            period: { $dateToString: { format: periodFormat, date: "$date" } },
          },
          totalSpent: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.period": 1 } },
    ];

    const trends = await Expense.aggregate(pipeline);
    res.json(trends);
  } catch (err) {
    console.error("getTrendsReport error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get Category Report
 */
exports.getCategoryReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period, startDate, endDate } = req.query;

    let start, end;
    const now = new Date();

    if (period === "daily") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (period === "weekly") {
      const firstDayOfWeek = now.getDate() - now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
      end = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek + 7);
    } else if (period === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (period === "yearly") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear() + 1, 0, 1);
    } else if (startDate || endDate) {
      start = startDate ? new Date(startDate) : null;
      end = endDate ? new Date(endDate) : null;
    }

    const matchFilter = { user: new mongoose.Types.ObjectId(userId) };
    if (start || end) {
      matchFilter.date = {};
      if (start) matchFilter.date.$gte = start;
      if (end) matchFilter.date.$lte = end;
    }

    const results = await Expense.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: null,
          grandTotal: { $sum: "$totalSpent" },
          categories: {
            $push: { category: "$_id", totalSpent: "$totalSpent" },
          },
        },
      },
      { $unwind: "$categories" },
      {
        $addFields: {
          "categories.percentage": {
            $multiply: [
              { $divide: ["$categories.totalSpent", "$grandTotal"] },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          grandTotal: { $first: "$grandTotal" },
          categories: { $push: "$categories" },
        },
      },
      { $project: { _id: 0, grandTotal: 1, categories: 1 } },
    ]);

    res.json(results[0] || { grandTotal: 0, categories: [] });
  } catch (err) {
    console.error("getCategoryReport error:", err);
    res.status(500).json({ error: "Failed to generate category report" });
  }
};
