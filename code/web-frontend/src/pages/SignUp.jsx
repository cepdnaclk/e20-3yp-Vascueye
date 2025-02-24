import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Signup.css"; // You'll need to create this CSS file

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("patient");

  // Common state for all forms
  const [formData, setFormData] = useState({
    patient: {
      firstName: '', lastName: '', dateOfBirth: '', 
      telephone: '', nic: '', email: '', 
      password: '', confirmPassword: ''
    },
    doctor: {
      title: 'Mr', firstName: '', lastName: '', 
      speciality: '', telephone: '', nic: '', 
      email: '', password: '', confirmPassword: ''
    },
    hospital: {
      name: '', address: '', telephone: '', 
      registrationNumber: '', email: '', 
      password: '', confirmPassword: ''
    }
  });

  const validateForm = (role) => {
    const data = formData[role];
    const errors = [];

    // Common validations
    if (data.password !== data.confirmPassword) {
      errors.push("Passwords don't match");
    }
    if (data.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    if (!/^\d{10}$/.test(data.telephone)) {
      errors.push("Telephone must be 10 digits");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Invalid email format");
    }

    // Role-specific validations
    if (role === 'patient') {
      if (!data.dateOfBirth) {
        errors.push("Date of birth is required");
      }
    }
    if (role === 'doctor') {
      if (!data.speciality) {
        errors.push("Speciality is required");
      }
    }
    if (role === 'hospital') {
      if (!data.registrationNumber) {
        errors.push("Registration number is required");
      }
    }

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
  
    const data = formData[role];
    try {
      // Create a request object with all required fields
      const requestData = {
        email: data.email,
        password: data.password,
        role: role,
        telephone: data.telephone,
        nic: data.nic
      };
  
      // Add role-specific fields
      if (role === 'patient') {
        requestData.name = `${data.firstName} ${data.lastName}`;
        requestData.firstName = data.firstName;
        requestData.lastName = data.lastName;
        requestData.dateOfBirth = data.dateOfBirth;
      } 
      else if (role === 'doctor') {
        requestData.name = `${data.title} ${data.firstName} ${data.lastName}`;
        requestData.title = data.title;
        requestData.firstName = data.firstName;
        requestData.lastName = data.lastName;
        requestData.speciality = data.speciality;
      } 
      else if (role === 'hospital') {
        requestData.name = data.name;
        requestData.address = data.address;
        requestData.registrationNumber = data.registrationNumber;
      }
  
      // Call the signup function with the complete request data
      const res = await signup(requestData);
  
      if (res.success) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => navigate(`/${role}-dashboard`), 1500);
      } else {
        setError(res.errors?.map(err => err.msg).join(", ") || "Signup failed");
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleChange = (role, field, value) => {
    setFormData(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value
      }
    }));
  };

  return (
    <div className="auth-container">
      <div className="signup-card">
        <h2 className="signup-title">Create a New Account</h2>
        
        <div className="tabs">
          <div className="tab-list">
            <button 
              className={`tab-button ${activeTab === "patient" ? "active" : ""}`}
              onClick={() => setActiveTab("patient")}
            >
              Patient
            </button>
            <button 
              className={`tab-button ${activeTab === "doctor" ? "active" : ""}`}
              onClick={() => setActiveTab("doctor")}
            >
              Doctor
            </button>
            <button 
              className={`tab-button ${activeTab === "hospital" ? "active" : ""}`}
              onClick={() => setActiveTab("hospital")}
            >
              Admin
            </button>
          </div>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          {activeTab === "patient" && (
            <form onSubmit={(e) => handleSubmit(e, 'patient')} className="signup-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.patient.firstName}
                  onChange={(e) => handleChange('patient', 'firstName', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.patient.lastName}
                  onChange={(e) => handleChange('patient', 'lastName', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={formData.patient.dateOfBirth}
                  onChange={(e) => handleChange('patient', 'dateOfBirth', e.target.value)}
                  required
                />
              </div>
              
              <input
                type="tel"
                placeholder="Telephone (10 digits)"
                value={formData.patient.telephone}
                onChange={(e) => handleChange('patient', 'telephone', e.target.value)}
                required
              />
              
              <input
                type="text"
                placeholder="National Identity Number"
                value={formData.patient.nic}
                onChange={(e) => handleChange('patient', 'nic', e.target.value)}
                required
              />
              
              <input
                type="email"
                placeholder="Email"
                value={formData.patient.email}
                onChange={(e) => handleChange('patient', 'email', e.target.value)}
                required
              />
              
              <div className="form-row">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.patient.password}
                  onChange={(e) => handleChange('patient', 'password', e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.patient.confirmPassword}
                  onChange={(e) => handleChange('patient', 'confirmPassword', e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="signup-button">Sign Up as Patient</button>
            </form>
          )}

          {activeTab === "doctor" && (
            <form onSubmit={(e) => handleSubmit(e, 'doctor')} className="signup-form">
              <div className="form-row">
                <select
                  value={formData.doctor.title}
                  onChange={(e) => handleChange('doctor', 'title', e.target.value)}
                  className="title-select"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr">Dr</option>
                </select>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.doctor.firstName}
                  onChange={(e) => handleChange('doctor', 'firstName', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.doctor.lastName}
                  onChange={(e) => handleChange('doctor', 'lastName', e.target.value)}
                  required
                />
              </div>
              
              <input
                type="text"
                placeholder="Speciality"
                value={formData.doctor.speciality}
                onChange={(e) => handleChange('doctor', 'speciality', e.target.value)}
                required
              />
              
              <input
                type="tel"
                placeholder="Telephone (10 digits)"
                value={formData.doctor.telephone}
                onChange={(e) => handleChange('doctor', 'telephone', e.target.value)}
                required
              />
              
              <input
                type="text"
                placeholder="National Identity Number"
                value={formData.doctor.nic}
                onChange={(e) => handleChange('doctor', 'nic', e.target.value)}
                required
              />
              
              <input
                type="email"
                placeholder="Email"
                value={formData.doctor.email}
                onChange={(e) => handleChange('doctor', 'email', e.target.value)}
                required
              />
              
              <div className="form-row">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.doctor.password}
                  onChange={(e) => handleChange('doctor', 'password', e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.doctor.confirmPassword}
                  onChange={(e) => handleChange('doctor', 'confirmPassword', e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="signup-button">Sign Up as Doctor</button>
            </form>
          )}

          {activeTab === "hospital" && (
            <form onSubmit={(e) => handleSubmit(e, 'hospital')} className="signup-form">
              <input
                type="text"
                placeholder="Healthcare Facility Name"
                value={formData.hospital.name}
                onChange={(e) => handleChange('hospital', 'name', e.target.value)}
                required
              />
              
              <textarea
                placeholder="Address"
                value={formData.hospital.address}
                onChange={(e) => handleChange('hospital', 'address', e.target.value)}
                required
              />
              
              <input
                type="tel"
                placeholder="Telephone (10 digits)"
                value={formData.hospital.telephone}
                onChange={(e) => handleChange('hospital', 'telephone', e.target.value)}
                required
              />
              
              <input
                type="text"
                placeholder="Registration Number"
                value={formData.hospital.registrationNumber}
                onChange={(e) => handleChange('hospital', 'registrationNumber', e.target.value)}
                required
              />
              
              <input
                type="email"
                placeholder="Email"
                value={formData.hospital.email}
                onChange={(e) => handleChange('hospital', 'email', e.target.value)}
                required
              />
              
              <div className="form-row">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.hospital.password}
                  onChange={(e) => handleChange('hospital', 'password', e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.hospital.confirmPassword}
                  onChange={(e) => handleChange('hospital', 'confirmPassword', e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="signup-button">Sign Up as Healthcare Facility</button>
            </form>
          )}

          <p className="signin-link">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;