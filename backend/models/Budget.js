const mongoose = require("mongoose");
const getMonthYear = require("../helper/getMonthYear");

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true, trim: true },
    limit: { type: Number, required: true },
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly", // default monthly now
    },
    startDate: { type: Date, default: Date.now },
    monthYear: { type: String } // e.g. "September 2025"
  },
  { timestamps: true }
);

budgetSchema.pre("save", function (next) {
  if (!this.monthYear && this.startDate) {
    this.monthYear = getMonthYear(this.startDate);
  }
  next();
});

module.exports = mongoose.model("Budget", budgetSchema);
