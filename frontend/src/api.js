import api from "./api/axios";

// ================== EXPENSES ==================
export async function getExpenses() {
  const res = await api.get("/expenses");
  return res.data;
}

export async function addExpense(payload) {
  const res = await api.post("/expenses", {
    ...payload,
    amount: Number(payload.amount),
    ...(payload.date ? { date: new Date(payload.date).toISOString() } : {}),
  });
  return res.data;
}

export async function updateExpense(id, payload) {
  const res = await api.put(`/expenses/${id}`, {
    ...payload,
    amount: Number(payload.amount),
    ...(payload.date ? { date: new Date(payload.date).toISOString() } : {}),
  });
  return res.data;
}

export async function deleteExpense(id) {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
}

// ================== BUDGETS ==================
export async function getBudgets() {
  const res = await api.get("/budgets");
  return res.data;
}

// ================== SUMMARY ==================
export async function getExpenseSummary(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);

  const res = await api.get(`/expenses/summary?${params.toString()}`);
  return res.data;
}

export async function getBudgetSummary() {
  const res = await api.get("/budgets/summary");
  return res.data;
}

// ================== REPORTS ==================
export async function getMonthlyExpenses() {
  const res = await api.get("/expenses/monthly");
  return res.data; // [{ month: "2025-06", total: 1234, expenses: [...] }]
}

