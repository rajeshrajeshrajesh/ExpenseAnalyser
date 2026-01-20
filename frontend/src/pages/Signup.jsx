import { useState } from "react";
import { signup } from "../services/authService";

export default function Signup({ onAuthSuccess, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await signup({ name, email, password });

      if (res.token) {
        onAuthSuccess(res.token, res.role); // ✅ Pass role too
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
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
        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          style={{ color: "blue", border: "none", background: "none" }}
        >
          Login
        </button>
      </p>
    </div>
  );
}
