// src/pages/ReportsPage.jsx
import React, { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";
import { getBudgets } from "../services/budgetService";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9A32CD"];

const ReportsPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const expData = await getExpenses();
      const budData = await getBudgets();
      setExpenses(expData);
      setBudgets(budData);

      // Extract unique months from DB field
      const months = Array.from(new Set(expData.map((e) => e.monthYear))).sort();
      setSelectedMonth(months[months.length - 1] || "");
    } catch (err) {
      console.error("Error loading reports:", err);
    }
  };

  // Dropdown options
  const monthOptions = Array.from(new Set(expenses.map((e) => e.monthYear))).sort();

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => e.monthYear === selectedMonth);

  // Pie chart data: category totals
  const expensesByCategory = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const pieData = Object.keys(expensesByCategory).map((key) => ({
    name: key,
    value: expensesByCategory[key],
  }));

  // Bar chart: Budgets vs Expenses grouped by monthYear
  const allMonths = Array.from(
    new Set([
      ...budgets.map((b) => b.monthYear),
      ...expenses.map((e) => e.monthYear),
    ])
  ).sort();

  const barData = allMonths.map((month) => {
    const monthExpenses = expenses
      .filter((e) => e.monthYear === month)
      .reduce((sum, e) => sum + e.amount, 0);

    const monthBudget = budgets
      .filter((b) => b.monthYear === month)
      .reduce((sum, b) => sum + b.amount, 0);

    return {
      month,
      Budget: monthBudget,
      Expenses: monthExpenses,
    };
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Expenses by Category</h3>

          {/* Month Dropdown */}
          <select
            className="border p-2 rounded mb-4"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Budgets vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Budget" fill="#0088FE" />
              <Bar dataKey="Expenses" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
