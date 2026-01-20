import React, { useEffect, useState } from "react";
import axios from "axios";

const SummaryTable = () => {
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // ✅ get token saved during login/signup
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found. Please login first.");
          return;
        }

        // ✅ pass token in Authorization header
        const res = await axios.get("http://localhost:5000/api/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExpenseSummary(res.data.expenseSummary || []);
        setBudgetSummary(res.data.budgetSummary || []);
      } catch (error) {
        console.error("Error fetching summary:", error.response?.data || error.message);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <h2>Expense Summary</h2>
      <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {expenseSummary.length > 0 ? (
            expenseSummary.map((exp, idx) => (
              <tr key={idx}>
                <td>{exp._id}</td>
                <td>{exp.totalSpent}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No data</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Budget Summary</h2>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Limit</th>
            <th>Period</th>
            <th>Spent</th>
            <th>Remaining</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {budgetSummary.length > 0 ? (
            budgetSummary.map((bud, idx) => (
              <tr key={idx}>
                <td>{bud.category}</td>
                <td>{bud.limit}</td>
                <td>{bud.period}</td>
                <td>{bud.spent}</td>
                <td>{bud.remaining}</td>
                <td>{bud.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
