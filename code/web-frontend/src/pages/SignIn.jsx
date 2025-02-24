import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(`/${user.role}-dashboard`);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      try {
        const res = await fetch("http://localhost:5000/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success) {
          login(data.token, data.user);
          navigate(`/${data.user.role}-dashboard`); // Redirect after login
        } else {
          setError(data.message || "Invalid credentials");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    },
    [formData, login, navigate]
  );

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="auth-btn">
          Sign In
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>

      <p className="auth-footer">
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </div>
  );
};

export default SignIn;
