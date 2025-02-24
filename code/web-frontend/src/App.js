import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";  
import { useContext } from "react";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";

import PatientDashboard from "./pages/PatientDashboard";  
import DoctorDashboard from "./pages/DoctorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import Dashboard from "./pages/Dashboard";

// Protected Route Wrapper
const AuthRoute = ({ element, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

function App() {
  return (
    <AuthProvider>  
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />

          {/* Role-based Dashboard Routing */}
          <Route path="/dashboard" element={<AuthRoute element={<Dashboard />} />} />
          <Route path="/patient-dashboard" element={<AuthRoute element={<PatientDashboard />} roles={["patient"]} />} />
          <Route path="/doctor-dashboard" element={<AuthRoute element={<DoctorDashboard />} roles={["doctor"]} />} />
          <Route path="/hospital-dashboard" element={<AuthRoute element={<HospitalDashboard />} roles={["hospital"]} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
