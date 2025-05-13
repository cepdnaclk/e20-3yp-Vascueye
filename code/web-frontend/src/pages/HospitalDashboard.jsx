import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/HospitalDashboard.css";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

const HospitalDashboard = () => {
  const { user } = useContext(AuthContext);
  const lastLogin = localStorage.getItem("lastLogin");

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundColor:"#fefefe",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Hospital Dashboard
      </Typography>

      {/* Admin Profile Info */}
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          {user ? (
            <>
              <Typography variant="body1">Logged in as: {user.name}</Typography>
              <Typography variant="body1">
                Last Logged In: {lastLogin}
              </Typography>
            </>
          ) : (
            <Typography>Loading user data...</Typography>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        {/* Patient Management */}
        <Card sx={{ flex: 1, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Patient Management
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mb: 1,
                color: "#1976d2",
                borderColor: "#1976d2",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
              component={Link}
              to="/register-patient"
            >
              Register Patient
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mb: 1,
                color: "#1976d2",
                borderColor: "#1976d2",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
              component={Link}
              to="/search-patient"
            >
              Search Patient
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                color: "#1976d2",
                borderColor: "#1976d2",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
              component={Link}
              to="/discharge-patient"
            >
              Discharge
            </Button>
          </CardContent>
        </Card>

        {/* Doctor Management */}
        <Card sx={{ flex: 1, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Doctor Management
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mb: 1,
                color: "#1976d2",
                borderColor: "#1976d2",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
              component={Link}
              to="/register-doctor"
            >
              Register Doctor
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mb: 1,
                color: "#1976d2",
                borderColor: "#1976d2",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
              component={Link}
              to="/search-doctor"
            >
              Search Doctor
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                color: "#1976d2",
                borderColor: "#1976d2",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
              component={Link}
              to="/assign-patient"
            >
              Assign Patients
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        {/* <Card sx={{ flex: 1, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Quick Links
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mb: 1,
                color: "#1976d2",
                borderColor: "#1976d2",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
              component={Link}
              to="/appointments"
            >
              Manage Appointments
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mb: 1,
                color: "#1976d2",
                borderColor: "#1976d2",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
              component={Link}
              to="/medical-records"
            >
              View Medical Records
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                color: "#1976d2",
                borderColor: "#1976d2",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderColor: "#1976d2",
                },
              }}
              component={Link}
              to="/billing"
            >
              Billing & Payments
            </Button>
          </CardContent>
        </Card> */}
      </Box>
    </div>
  );
};

export default HospitalDashboard;
