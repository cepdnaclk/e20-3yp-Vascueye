import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signup from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";

import PatientDashboard from "./pages/PatientDashboard";
import PatientRegister from "./pages/PatientRegister";
import PatientSearch from "./pages/PatientSearch";
import AssignPatient from "./pages/AssignPatient";

import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorRegister from "./pages/DoctorRegister";
import DoctorSearch from "./pages/DoctorSearch";
import FlapSearch from "./pages/FlapSearch";
import HospitalDashboard from "./pages/HospitalDashboard";
import Dashboard from "./pages/Dashboard";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Protected Route Wrapper
const AuthRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />

          <div style={{ flex: 1 }}>
            {/* ✅ Wrap all Routes inside <Routes> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/register-patient" element={<PatientRegister />} />
              <Route path="/search-patient" element={<PatientSearch />} />
              <Route path="/assign-patient" element={<AssignPatient />} />
              <Route path="/register-doctor" element={<DoctorRegister />} />
              <Route path="/search-doctor" element={<DoctorSearch />} />
              {/* Role-based Dashboard Routing */}
              <Route
                path="/dashboard"
                element={
                  <AuthRoute>
                    <Dashboard />
                  </AuthRoute>
                }
              />
              <Route
                path="/patient-dashboard"
                element={
                  <AuthRoute roles={["patient"]}>
                    <PatientDashboard />
                  </AuthRoute>
                }
              />
              <Route
                path="/doctor-dashboard"
                element={
                  <AuthRoute roles={["doctor"]}>
                    <DoctorDashboard />
                  </AuthRoute>
                }
              />
              <Route
                path="/search-flap"
                element={
                  <AuthRoute roles={["doctor"]}>
                    <FlapSearch />
                  </AuthRoute>
                }
              />
              <Route
                path="/hospital-dashboard"
                element={
                  <AuthRoute roles={["hospital"]}>
                    <HospitalDashboard />
                  </AuthRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
