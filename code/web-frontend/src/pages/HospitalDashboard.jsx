import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

const HospitalDashboard = () => {
  const { user } = useContext(AuthContext);
  const lastLogin = localStorage.getItem("lastLogin");

  return (
    <div className="dashboard-container">
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
                Last Logged In : {lastLogin}
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
              sx={{ mb: 1 }}
              component={Link}
              to="/register-patient"
            >
              Register Patient
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              component={Link}
              to="/search-patient"
            >
              Search Patient
            </Button>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              to="/assign-patient"
            >
              Assign Patient to Doctor
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
              sx={{ mb: 1 }}
              component={Link}
              to="/register-doctor"
            >
              Register Doctor
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              component={Link}
              to="/search-doctor"
            >
              Search Doctor
            </Button>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              to="/appointments"
            >
              Appointments
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card sx={{ flex: 1, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Quick Links
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              component={Link}
              to="/appointments"
            >
              Manage Appointments
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              component={Link}
              to="/medical-records"
            >
              View Medical Records
            </Button>
            <Button variant="outlined" fullWidth component={Link} to="/billing">
              Billing & Payments
            </Button>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default HospitalDashboard;
