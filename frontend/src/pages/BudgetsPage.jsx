import React, { useEffect, useState } from "react";
import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from "../services/budgetService";

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: "", limit: "", period: "monthly" });
  const [editingId, setEditingId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);

      const months = Array.from(new Set(data.map((b) => b.monthYear || "All")));
      setSelectedMonth(months[0] || "All");
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBudget(editingId, form);
      } else {
        await addBudget(form);
      }
      setForm({ category: "", limit: "", period: "monthly" });
      setEditingId(null);
      fetchBudgets();
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };

  const handleEdit = (budget) => {
    setForm({
      category: budget.category,
      limit: budget.limit,
      period: budget.period,
    });
    setEditingId(budget.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    try {
      await deleteBudget(id);
      fetchBudgets();
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  const handleCancelEdit = () => {
    setForm({ category: "", limit: "", period: "monthly" });
    setEditingId(null);
  };

  const filteredBudgets =
    selectedMonth === "All"
      ? budgets
      : budgets.filter((b) => b.monthYear === selectedMonth);

  const monthOptions = Array.from(new Set(budgets.map((b) => b.monthYear || "All")));

  return (
    <div>
      <h2>Budgets</h2>

      {/* Month Dropdown */}
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      >
        {monthOptions.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="limit"
          placeholder="Limit"
          value={form.limit}
          onChange={handleChange}
          required
        />
        <select name="period" value={form.period} onChange={handleChange} required>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Budget</button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        )}
      </form>

      {/* Budgets Table */}
      {filteredBudgets.length > 0 ? (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Limit</th>
              <th>Period</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBudgets.map((budget) => (
              <tr key={budget.id}>
                <td>{budget.category}</td>
                <td>{budget.limit}</td>
                <td>{budget.period}</td>
                <td>
                  <button onClick={() => handleEdit(budget)}>Edit</button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    style={{ marginLeft: "5px", backgroundColor: "tomato", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No budgets found for {selectedMonth}.</p>
      )}
    </div>
  );
};

export default BudgetsPage;
