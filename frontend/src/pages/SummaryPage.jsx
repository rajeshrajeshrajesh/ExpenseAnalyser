import { useEffect, useState } from "react";
import { getBudgetSummary } from "../services/budgetService";
import Navbar from "../components/Navbar";

export default function SummaryPage() {
  const [budgetSummary, setBudgetSummary] = useState([]);

  useEffect(() => {
    fetchBudgetSummary();
  }, []);

  const fetchBudgetSummary = async () => {
    try {
      const data = await getBudgetSummary();
      setBudgetSummary(data);
    } catch (err) {
      console.error("Failed to fetch budget summary", err);
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Budget Summary</h2>

      {/* ✅ Only show Budget Summary Table */}
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Category</th>
            <th>Budget</th>
            <th>Spent</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {budgetSummary.length > 0 ? (
            budgetSummary.map((summary, index) => (
              <tr key={index}>
                <td>{summary.category}</td>
                <td>${summary.budget}</td>
                <td>${summary.spent}</td>
                <td>${summary.remaining}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No budget summary available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
