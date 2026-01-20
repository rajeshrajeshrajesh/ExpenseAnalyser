import { useCallback, useEffect, useState } from "react";
import {
  getExpenses,
  getBudgets,
  getExpenseSummary,
  getBudgetSummary,
  addExpense,
  updateExpense,
  deleteExpense,
  getMonthlyExpenses, // ✅
} from "./api";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import ReportsPage from "./pages/ReportsPage";
import ExpensesPage from "./pages/ExpensesPage";
import BudgetsPage from "./pages/BudgetsPage";
import SummaryTable from "./components/SummaryTable";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({ expenses: [], budgets: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [view, setView] = useState(localStorage.getItem("view") || "home");

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [isSignup, setIsSignup] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setErr("");

      if (view === "expenses") {
        const data = await getExpenses();
        setExpenses(Array.isArray(data) ? data : []);
      } else if (view === "budgets") {
        const data = await getBudgets();
        setBudgets(Array.isArray(data) ? data : []);
      } else if (view === "summary") {
        const exp = await getExpenseSummary();
        const bud = await getBudgetSummary();
        setSummary({
          expenses: Array.isArray(exp) ? exp : [],
          budgets: Array.isArray(bud) ? bud : [],
        });
      }
      // ✅ reports handled inside ReportsPage
    } catch (e) {
      if (e?.response?.status === 401) {
        handleLogout();
        return;
      }
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }, [view, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  const handleAdded = () => fetchData();

  const handleUpdate = async (id, payload) => {
    try {
      await updateExpense(id, payload);
      fetchData();
    } catch (err) {
      console.error("Failed to update expense", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  const handleAuthSuccess = (newToken, newRole = "user") => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
    setView("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("view");
    setToken("");
    setRole("user");
    setView("home");
  };

  if (!token) {
    return isSignup ? (
      <Signup
        onAuthSuccess={handleAuthSuccess}
        onSwitch={() => setIsSignup(false)}
      />
    ) : (
      <Login
        onAuthSuccess={handleAuthSuccess}
        onSwitch={() => setIsSignup(true)}
      />
    );
  }

  return (
    <div className="wrap">
      <div className="card">
        <h1>Expense Analyser</h1>
        <button onClick={handleLogout} style={{ float: "right" }}>
          Logout
        </button>

        {err && <p className="err">{err}</p>}

        {loading && view !== "home" ? (
          <p>Loading…</p>
        ) : view === "home" ? (
          <Homepage setView={setView} />
        ) : view === "expenses" ? (
          <>
            <Nav setView={setView} />
            <ExpensesPage
              expenses={expenses}
              onAdded={handleAdded}
              onUpdate={handleUpdate}
              onDelete={(id) => {
                if (window.confirm("Are you sure you want to delete this expense?")) {
                  handleDelete(id);
                }
              }}
            />
          </>
        ) : view === "budgets" ? (
          <>
            <Nav setView={setView} />
            <BudgetsPage budgets={budgets} />
          </>
        ) : view === "summary" ? (
          <>
            <Nav setView={setView} />
            <SummaryTable setView={setView} />
          </>
        ) : (
          <>
            <Nav setView={setView} />
            <ReportsPage fetchMonthlyExpenses={getMonthlyExpenses} />
          </>
        )}
      </div>
    </div>
  );
}

// ✅ Extracted navigation buttons so we don’t repeat them everywhere
function Nav({ setView }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setView("home")}>Home</button>
      <button onClick={() => setView("expenses")}>Expenses</button>
      <button onClick={() => setView("budgets")}>Budgets</button>
      <button onClick={() => setView("summary")}>Summary</button>
      <button onClick={() => setView("reports")}>Reports</button>
    </div>
  );
}
