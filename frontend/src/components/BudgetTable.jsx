import React from "react";

export default function BudgetTable({ budgets }) {
  if (!budgets || budgets.length === 0) {
    return <p>No budgets found.</p>;
  }

  return (
    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Category</th>
          <th>Limit</th>
          <th>Period</th>
        </tr>
      </thead>
      <tbody>
        {budgets.map((b) => (
          <tr key={b._id}>
            <td>{b.category}</td>
            <td>{b.limit}</td>
            <td>{b.period}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
