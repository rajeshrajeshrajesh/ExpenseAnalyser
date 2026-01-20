const mongoose = require("mongoose");
const getMonthYear = require("../helper/getMonthYear");

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    monthYear: { type: String } // e.g. "September 2025"
  },
  { timestamps: true }
);

// Auto-set monthYear before save
expenseSchema.pre("save", function (next) {
  if (!this.monthYear && this.date) {
    this.monthYear = getMonthYear(this.date);
  }
  next();
});

module.exports = mongoose.model("Expense", expenseSchema);
