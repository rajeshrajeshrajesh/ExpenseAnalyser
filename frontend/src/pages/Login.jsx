import { useState } from "react";
import { login } from "../services/authService";

export default function Login({ onAuthSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await login({ email, password });

      if (res.token) {
        onAuthSuccess(res.token, res.role); // ✅ Pass role too
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          style={{ color: "blue", border: "none", background: "none" }}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
