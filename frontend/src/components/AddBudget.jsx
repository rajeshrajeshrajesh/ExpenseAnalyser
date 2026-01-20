import { useState } from "react";
import { addBudget } from "../api";

export default function AddBudget({ onAdded }) {
  const [form, setForm] = useState({
    category: "",
    amount: "",
    period: "monthly", // default
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.category.trim() || !form.amount) {
      setErr("Please fill category and amount.");
      return;
    }

    try {
      setSubmitting(true);
      await addBudget(form);
      setForm({ category: "", amount: "", period: "monthly" });
      onAdded?.(); // refresh list in parent
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="row" style={{ marginBottom: 12 }}>
      <select value={form.category} onChange={update("category")} required>
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Groceries">Groceries</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={update("amount")}
        required
      />

      <select value={form.period} onChange={update("period")}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : "Add Budget"}
      </button>
      {err && <span className="err">{err}</span>}
    </form>
  );
}
