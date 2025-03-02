import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import "../styles/DoctorDashboard.css"; // ✅ Import separate CSS file

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [flapData, setFlapData] = useState([]);
  const [selectedFlap, setSelectedFlap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch assigned patients when component loads
  useEffect(() => {
    const fetchAssignedPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/users/doctors/patients",
          { email: user.email } // 🔹 Send email in the body
        );
        setAssignedPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching assigned patients:", err);
        setError("Failed to load assigned patients.");
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchAssignedPatients();
    }
  }, [user]);

  // Fetch flap data when a patient is selected
  const fetchFlapData = async (patientId) => {
    try {
      setLoading(true);
      setSelectedPatientId(patientId);
      setSelectedFlap(null); // Reset selected flap
      const response = await axios.get(
        `http://localhost:5000/api/users/flap/search/${patientId}`
      );
      setFlapData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching flap data:", err);
      setError("Failed to load flap data.");
      setLoading(false);
    }
  };

  return (
    <Box className="dashboard-container">
      {/* Doctor Profile Section */}
      <Card className="doctor-profile">
        <CardContent>
          <Typography variant="h4">Doctor Dashboard</Typography>
          {user ? (
            <Box>
              <Typography>
                <strong>Name:</strong> {user.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography>
                <strong>Role:</strong> {user.role}
              </Typography>
            </Box>
          ) : (
            <Typography>Loading profile...</Typography>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Left Side - Assigned Patients */}
        <Grid item xs={12} md={6}>
          <Card className="assigned-patients">
            <CardContent>
              <Typography variant="h5">Assigned Patients</Typography>
              {loading ? (
                <CircularProgress />
              ) : assignedPatients.length > 0 ? (
                assignedPatients.map((patient) => (
                  <Card
                    key={patient._id}
                    className={`patient-item ${
                      selectedPatientId === patient._id ? "selected" : ""
                    }`}
                    onClick={() => fetchFlapData(patient._id)}
                  >
                    <Typography>
                      <strong>Name:</strong> {patient.name}
                    </Typography>
                    <Typography>
                      <strong>Age:</strong> {patient.age}
                    </Typography>
                    <Typography>
                      <strong>Contact:</strong> {patient.contact}
                    </Typography>
                  </Card>
                ))
              ) : (
                <Typography>No assigned patients.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side - All Flap Data for Selected Patient */}
        <Grid item xs={12} md={6}>
          <Card className="flap-data">
            <CardContent>
              <Typography variant="h5">
                {selectedPatientId
                  ? "Flap Data for Selected Patient"
                  : "Select a Patient to View Flap Data"}
              </Typography>

              {loading ? (
                <CircularProgress />
              ) : flapData.length > 0 ? (
                flapData.map((flap) => (
                  <Card
                    key={flap._id}
                    className={`flap-item ${
                      selectedFlap?._id === flap._id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedFlap(flap)}
                  >
                    <Typography>
                      <strong>Temperature:</strong>{" "}
                      {flap.temperature.toFixed(2)} °C
                    </Typography>
                    <Typography>
                      <strong>Timestamp:</strong>{" "}
                      {new Date(flap.timestamp).toLocaleString()}
                    </Typography>
                  </Card>
                ))
              ) : (
                <Typography>No flap data available.</Typography>
              )}

              {selectedFlap && (
                <Box className="flap-detail">
                  <Typography variant="h6">Flap Detail</Typography>
                  <Typography>
                    <strong>Temperature:</strong>{" "}
                    {selectedFlap.temperature.toFixed(2)} °C
                  </Typography>
                  <Typography>
                    <strong>Timestamp:</strong>{" "}
                    {new Date(selectedFlap.timestamp).toLocaleString()}
                  </Typography>
                  <img
                    src={selectedFlap.image_url}
                    alt="Flap"
                    className="flap-image"
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => setSelectedFlap(null)}
                  >
                    Back to Flap List
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDashboard;
