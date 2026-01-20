export default function Homepage({ setView }) {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "4rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Welcome to Expense Analyser 🎉
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#555" }}>
        Select what you want to do:
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "2rem",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setView("expenses")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            minWidth: "150px",
          }}
        >
          💸 Go to Expenses
        </button>

        <button
          onClick={() => setView("budgets")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            minWidth: "150px",
          }}
        >
          📑 Go to Budgets
        </button>

        <button
          onClick={() => setView("summary")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            minWidth: "150px",
          }}
        >
          📊 View Summary
        </button>

        <button
          onClick={() => setView("reports")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#9C27B0",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            minWidth: "150px",
          }}
        >
          📈 View Reports
        </button>
      </div>
    </div>
  );
}
