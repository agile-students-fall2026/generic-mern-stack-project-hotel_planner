import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import "./Sign.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      setError("Please fill in both fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Password reset failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/signin", { replace: true }), 2000);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // No token in the URL means the link is broken or was typed by hand
  if (!token) {
    return (
      <div className="sign-in">
        <h2>Reset Password</h2>
        <p className="error">This reset link is invalid or incomplete.</p>
        <p>
          <Link to="/forgot-password">Request a new reset link</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="sign-in">
      <h2>Reset Password</h2>

      {success ? (
        <p>Your password has been reset. Redirecting to Sign In...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-password">
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-password">
            <label htmlFor="confirm">Confirm Password:</label>
            <input
              type="password"
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      <p>
        <Link to="/signin">Back to Sign In</Link>
      </p>
    </div>
  );
}

export default ResetPassword;
