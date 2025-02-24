import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      const res = await signup(name, email, password, role);

      if (res.success) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => navigate(`/${role}-dashboard`), 1500); // Redirect based on role
      } else {
        setError(res.errors?.map(err => err.msg).join(", ") || "Signup failed");
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="hospital">Hospital</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>
        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <Link to="/signin">Sign in</Link></p>
    </div>
  );
};

export default Signup;
