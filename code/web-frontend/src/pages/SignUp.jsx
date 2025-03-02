import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Signup.css";
import vescueyeLogo from "../assets/vescueye-logo.png"; // Import Vescueye logo

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    patient: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      telephone: "",
      nic: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    doctor: {
      title: "Mr",
      firstName: "",
      lastName: "",
      speciality: "",
      telephone: "",
      nic: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    hospital: {
      name: "",
      address: "",
      telephone: "",
      registrationNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const validateForm = (role) => {
    const data = formData[role];
    const errors = [];

    if (data.password !== data.confirmPassword) errors.push("Passwords don't match");
    if (data.password.length < 6) errors.push("Password must be at least 6 characters");
    if (!/^\d{10}$/.test(data.telephone)) errors.push("Telephone must be 10 digits");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("Invalid email format");

    if (role === "patient" && !data.dateOfBirth) errors.push("Date of birth is required");
    if (role === "doctor" && !data.speciality) errors.push("Speciality is required");
    if (role === "hospital" && !data.registrationNumber) errors.push("Registration number is required");

    return errors;
  };

  const handleSubmit = async (e, role) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const validationErrors = validateForm(role);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    try {
      const res = await signup(formData[role]);

      if (res.success) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => navigate(`/${role}-dashboard`), 1500);
      } else {
        setError(res.errors?.map((err) => err.msg).join(", ") || "Signup failed");
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleChange = (role, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }));
  };

  return (
    <div className="auth-container">
      <div className="signup-card">
        {/* Vescueye Logo */}
        <div className="logo-container">
          <img src={vescueyeLogo} alt="Vescueye Logo" className="vescueye-logo" />
        </div>

        <h2 className="signup-title">Create a New Account</h2>

        <div className="tabs">
          {["patient", "doctor", "hospital"].map((role) => (
            <button
              key={role}
              className={`tab-button ${activeTab === role ? "active" : ""}`}
              onClick={() => setActiveTab(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="scroll-container">
          <form onSubmit={(e) => handleSubmit(e, activeTab)} className="signup-form">
            {Object.entries(formData[activeTab]).map(([field, value]) => (
              <div key={field} className="form-group">
                <input
                  type={field.includes("password") ? (showPassword ? "text" : "password") : "text"}
                  placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                  value={value}
                  onChange={(e) => handleChange(activeTab, field, e.target.value)}
                  required
                />
              </div>
            ))}

            <div className="password-toggle">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label>Show Password</label>
            </div>

            <button type="submit" className="signup-button">
              Sign Up as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </form>
        </div>

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
