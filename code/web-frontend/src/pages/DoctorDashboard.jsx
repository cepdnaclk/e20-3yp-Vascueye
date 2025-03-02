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
} from "@mui/material";
import "../styles/DoctorDashboard.css"; // ✅ Import separate CSS file

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [flapData, setFlapData] = useState([]);
  const [selectedFlap, setSelectedFlap] = useState(null);
  const [latestFlap, setLatestFlap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <Box className="dashboard-container">
      {/* Doctor Profile Section */}
      <Card className="doctor-profile">
        <CardContent>
          <Typography variant="h4">Doctor Dashboard</Typography>
          {user ? (
            <Box>
              <Typography><strong>Name:</strong> {user.name}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Role:</strong> {user.role}</Typography>
            </Box>
          ) : (
            <Typography>Loading profile...</Typography>
          )}
        </CardContent>

        {/* Navigate to Search Flap Page */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/search-flap")}
        >
          Search Flap Data
        </Button>
      </Card>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Right Side - Assigned Patients */}
        <Grid item xs={12} md={6}>
          <Card className="assigned-patients">
            <CardContent>
              <Typography variant="h5">Assigned Patients</Typography>
              {assignedPatients.length > 0 ? (
                assignedPatients.map((patient) => (
                  <Card
                    key={patient._id}
                    className={`patient-item ${
                      selectedPatientId === patient._id ? "selected" : ""
                    }`}
                    // onClick={() => fetchFlapData(patient._id)}
                  >
                    <Typography><strong>Name:</strong> {patient.name}</Typography>
                    <Typography><strong>Age:</strong> {patient.age}</Typography>
                    <Typography> <strong>Contact:</strong> {patient.contact}</Typography>
                  </Card>
                ))
              ) : (
                <Typography>No assigned patients.</Typography>
              )}
              {selectedPatientId && (
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => setSelectedPatientId(null)}
                >
                  Back to Assigned Patients
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      
        {/* Left Side - Flap Data */}
        <Grid item xs={12} md={6}>
          <Card className="flap-data">
            <CardContent>
              <Typography variant="h5">
                {selectedFlap
                  ? `Flap Detail - ${selectedFlap.patient_id?.name}`
                  : latestFlap
                  ? `Latest Flap Data - ${latestFlap.patient_id?.name}`
                  : "No Flap Data Available"}
              </Typography>

              {selectedFlap ? (
                <Box>
                  <Typography>
                    <strong>Patient Name:</strong>{" "}
                    {selectedFlap.patient_id?.name || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Patient ID:</strong>{" "}
                    {selectedFlap.patient_id?._id || "N/A"}
                  </Typography>
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
                    Back to Patient Flap List
                  </Button>
                </Box>
              ) : latestFlap ? (
                <Box>
                  <Typography>
                    <strong>Patient Name:</strong> {latestFlap.patient_id?.name || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Patient ID:</strong> {latestFlap.patient_id?._id || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Temperature:</strong> {latestFlap.temperature.toFixed(2)} °C
                  </Typography>
                  <Typography>
                    <strong>Timestamp:</strong> {new Date(latestFlap.timestamp).toLocaleString()}
                  </Typography>
                  <img
                    src={latestFlap.image_url}
                    alt="Flap"
                    className="flap-image"
                  />
                </Box>
              ) : (
                <Typography>No flap data available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid></Grid>
    </Box>
  );
};

export default DoctorDashboard;
