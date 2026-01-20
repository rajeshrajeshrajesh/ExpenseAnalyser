import { useState } from "react";
import { addExpense } from "../api";

export default function AddExpense({ onAdded }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food", // default
    date: "", // optional
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.title.trim() || !form.category.trim() || !form.amount) {
      setErr("Please fill title, amount, and category.");
      return;
    }

    try {
      setSubmitting(true);

      // ✅ Normalize payload
      const payload = {
        ...form,
        amount: Number(form.amount),
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
      };

      await addExpense(payload);

      // ✅ Reset form
      setForm({ title: "", amount: "", category: "Food", date: "" });

      onAdded?.(); // notify parent to refresh
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="row" style={{ marginBottom: 12 }}>
      <input
        placeholder="Title"
        value={form.title}
        onChange={update("title")}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={update("amount")}
        required
      />
      <select value={form.category} onChange={update("category")} required>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Groceries">Groceries</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="date"
        value={form.date}
        onChange={update("date")}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : "Add Expense"}
      </button>
      {err && <span className="err">{err}</span>}
    </form>
  );
}
