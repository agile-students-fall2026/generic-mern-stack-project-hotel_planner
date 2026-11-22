import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sign.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      navigate("/signin", { replace: true });
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sign-up">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-email">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-password">
          <label htmlFor="password">Password (8+ characters):</label>
          <input id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p>Already have an account? <Link to="/signin">Sign In</Link></p>
      </form>
    </div>
  );
}
