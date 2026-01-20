import api from "../api/axios";

// 🔄 Normalize API response to always use `id`
const normalizeBudget = (budget) => ({
  id: budget.id || budget._id,
  category: budget.category,
  limit: budget.limit,
  period: budget.period,
  month: budget.month || new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  }),
});

// ✅ Get all budgets (with optional filters)
export const getBudgets = async (filters = {}) => {
  const res = await api.get("/budgets", { params: filters });
  return res.data.map(normalizeBudget);
};

// ✅ Get budget months
export const getBudgetMonths = async () => {
  const res = await api.get("/budgets/months");
  return res.data;
};

// ✅ Add a new budget
export const addBudget = async (budget) => {
  if (!budget.month) {
    budget.month = new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }
  const res = await api.post("/budgets", budget);
  return normalizeBudget(res.data);
};

// ✅ Update a budget
export const updateBudget = async (id, updatedBudget) => {
  const res = await api.put(`/budgets/${id}`, updatedBudget);
  return normalizeBudget(res.data);
};

// ✅ Delete a budget
export const deleteBudget = async (id) => {
  const res = await api.delete(`/budgets/${id}`);
  return res.data;
};

// ✅ Get budget summary
export const getBudgetSummary = async (month) => {
  const res = await api.get("/budgets/summary", { params: { month } });
  return res.data;
};
