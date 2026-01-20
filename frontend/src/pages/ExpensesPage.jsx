import React, { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);

      // Default to latest month if available
      const months = Array.from(new Set(data.map((e) => e.monthYear)));
      setSelectedMonth(months[0] || "");
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExpense(editingId, form);
      } else {
        await addExpense(form);
      }
      setForm({ title: "", amount: "", category: "", date: "" });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date ? expense.date.substring(0, 10) : "",
    });
    setEditingId(expense.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const handleCancelEdit = () => {
    setForm({ title: "", amount: "", category: "", date: "" });
    setEditingId(null);
  };

  // Collect dropdown options
  const monthOptions = Array.from(new Set(expenses.map((e) => e.monthYear)));
  const categoryOptions = Array.from(new Set(expenses.map((e) => e.category)));

  // Filtering logic
  const filteredExpenses = expenses.filter((e) => {
    const matchesMonth = selectedMonth ? e.monthYear === selectedMonth : true;
    const matchesCategory = selectedCategory
      ? e.category === selectedCategory
      : true;
    const matchesDateRange =
      (!startDate || new Date(e.date) >= new Date(startDate)) &&
      (!endDate || new Date(e.date) <= new Date(endDate));

    return matchesMonth && matchesCategory && matchesDateRange;
  });

  // Total amount of filtered expenses
  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  return (
    <div>
      <h2>Expenses</h2>

      {/* Filters */}
      <div style={{ marginBottom: "1rem" }}>
        {/* Month Filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        >
          <option value="">All Months</option>
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Date Range Filter */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"} Expense</button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Total Display */}
      <h3 style={{ marginTop: "1rem" }}>
        Total: {totalAmount.toLocaleString("en-IN")}
      </h3>

      {/* Expenses Table */}
      {filteredExpenses.length > 0 ? (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.title}</td>
                <td>{expense.amount}</td>
                <td>{expense.category}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(expense)}>Edit</button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    style={{
                      marginLeft: "5px",
                      backgroundColor: "tomato",
                      color: "white",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expenses found for selected filters.</p>
      )}
    </div>
  );
};

export default ExpensesPage;
