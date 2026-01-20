const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const { protect } = require("../middleware/authMiddleware");

// ✅ Get all budgets for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching budgets", error: err });
  }
});

// ✅ Add new budget
router.post("/", protect, async (req, res) => {
  try {
    const budget = new Budget({
      user: req.user.id,
      category: req.body.category,
      limit: req.body.limit,
      period: req.body.period,
    });
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: "Error adding budget", error: err });
  }
});

// ✅ Update budget
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating budget", error: err });
  }
});

// ✅ Delete budget
router.delete("/:id", protect, async (req, res) => {
  try {
    await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting budget", error: err });
  }
});

// ✅ Budget summary
router.get("/summary", protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    const expenses = await Expense.find({ user: req.user.id });

    const summary = budgets.map((budget) => {
      const spent = expenses
        .filter((e) => e.category === budget.category)
        .reduce((acc, e) => acc + e.amount, 0);

      return {
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining: budget.limit - spent,
      };
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Error fetching summary", error: err });
  }
});

module.exports = router;
