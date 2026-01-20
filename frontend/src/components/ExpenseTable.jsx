import { useState } from "react";

export default function ExpenseTable({ expenses, onUpdate, onDelete }) {
  const [category, setCategory] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
  });

  // unique categories
  const categories = [...new Set(expenses.map((e) => e.category).filter(Boolean))];

  // filter expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory = !category || e.category === category;
    const expenseDate = e.date ? new Date(e.date) : null;
    const matchesFromDate = !fromDate || (expenseDate && expenseDate >= new Date(fromDate));
    const matchesToDate = !toDate || (expenseDate && expenseDate <= new Date(toDate));
    return matchesCategory && matchesFromDate && matchesToDate;
  });

  // total amount
  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const startEdit = (exp) => {
    setEditingId(exp._id);
    setEditForm({
      title: exp.title,
      category: exp.category,
      amount: exp.amount,
      date: exp.date ? new Date(exp.date).toISOString().split("T")[0] : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", category: "", amount: "", date: "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await onUpdate(editingId, {
      ...editForm,
      amount: Number(editForm.amount),
      date: new Date(editForm.date),
    });
    cancelEdit();
  };

  return (
    <div>
      {/* filters */}
      <div style={{ marginBottom: 12, display: "flex", gap: "10px" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>

      {/* table */}
      <table className="table" border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
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
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((x) => (
              <tr key={x._id}>
                {editingId === x._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      />
                    </td>
                    <td>
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={cancelEdit} style={{ marginLeft: 5 }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{x.title || "-"}</td>
                    <td>₹{Number(x.amount).toFixed(2)}</td>
                    <td>{x.category}</td>
                    <td>{x.date ? new Date(x.date).toLocaleDateString() : "-"}</td>
                    <td>
                      <button onClick={() => startEdit(x)}>Edit</button>
                      <button
                        onClick={() => onDelete(x._id)}
                        style={{ marginLeft: "5px", backgroundColor: "tomato", color: "white" }}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No matching expenses found
              </td>
            </tr>
          )}
        </tbody>
        {filteredExpenses.length > 0 && (
          <tfoot>
            <tr>
              <td><b>Total</b></td>
              <td><b>₹{totalAmount.toFixed(2)}</b></td>
              <td colSpan="3"></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
