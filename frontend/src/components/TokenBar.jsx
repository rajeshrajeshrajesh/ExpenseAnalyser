// Paste your JWT token here (only if your backend protects /api/expenses with auth).
// If your backend does NOT require a token, you can delete this component and its usage in App.jsx.

import { useEffect, useState } from "react";

export default function TokenBar({ onTokenChange }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
    onTokenChange?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="tokenbar card">
      <strong>JWT:</strong>
      <input
        type="text"
        placeholder="Paste your JWT (leave blank if not needed)"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={() => setToken("")}>Clear</button>
    </div>
  );
}
