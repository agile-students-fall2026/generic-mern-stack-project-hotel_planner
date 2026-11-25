import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sign.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const [devResetLink, setDevResetLink] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setError("");

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    // Backend only sends this in development
    if (data.devResetLink) {
      setDevResetLink(data.devResetLink);
    }
    setSubmitted(true);
  };

    return (
      <div className="sign-in">
        <h2>Forgot Password</h2>
        <p className="sign-description">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        {submitted ? (
        <p>
          If an account exists for <strong>{email}</strong>, a reset link has
          been sent.
          {devResetLink && ( // delete this once postman is set up to handle the reset link
            <>
              <br />
              Dev link: <a href={devResetLink}>{devResetLink}</a>
            </>
          )}
        </p>
        ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-email">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Send Reset Link</button>
        </form>
      )}

      <p>
        <Link to="/signin">Back to Sign In</Link>
      </p>
      </div>
    );
  }

export default ForgotPassword;