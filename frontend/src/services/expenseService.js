import api from "../api/axios";

// 🔄 Normalize API response to always use `id`
const normalizeExpense = (expense) => ({
  id: expense.id || expense._id,
  title: expense.title,
  amount: expense.amount,
  category: expense.category,
  date: expense.date,
  monthYear: expense.monthYear,
});

// ➕ Add expense
export const addExpense = async (data) => {
  const res = await api.post("/expenses", data);
  return normalizeExpense(res.data);
};

// 📥 Get expenses (with optional filters)
export const getExpenses = async (filters = {}) => {
  const res = await api.get("/expenses", { params: filters });
  return res.data.map(normalizeExpense);
};

// 📊 Get expense months
export const getExpenseMonths = async () => {
  const res = await api.get("/expenses/months");
  return res.data;
};

// 📊 Get expense summary
export const getExpenseSummary = async (filters = {}) => {
  const res = await api.get("/expenses/summary", { params: filters });
  return res.data;
};

// 🔎 Get single expense by ID
export const getExpenseById = async (id) => {
  const res = await api.get(`/expenses/${id}`);
  return normalizeExpense(res.data);
};

// ✏️ Update expense
export const updateExpense = async (id, data) => {
  const res = await api.put(`/expenses/${id}`, data);
  return normalizeExpense(res.data);
};

// ❌ Delete expense
export const deleteExpense = async (id) => {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
};
