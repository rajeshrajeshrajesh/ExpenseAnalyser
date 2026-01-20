const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const { protect } = require("../middleware/authMiddleware");

// ✅ Get all expenses
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses", error: err });
  }
});

// ✅ Add expense
router.post("/", protect, async (req, res) => {
  try {
    const expense = new Expense({
      user: req.user.id,
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date || new Date(),
    });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Error adding expense", error: err });
  }
});

// ✅ Update expense
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating expense", error: err });
  }
});

// ✅ Delete expense
router.delete("/:id", protect, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense", error: err });
  }
});

module.exports = router;
