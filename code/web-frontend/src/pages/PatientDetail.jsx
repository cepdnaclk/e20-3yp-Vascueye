import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box, CircularProgress, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function PatientDetail() {
  const { id } = useParams();
  const [flapData, setFlapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState({});
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchFlapData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/flap/search/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFlapData(response.data.records || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch flap data", err);
        setLoading(false);
      }
    };

    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/patient/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatientData(response.data || []);
      } catch (err) {
        console.error("Failed to fetch patient data", err);
      }
    };

    fetchPatientData();
    fetchFlapData();
  }, [id]);

  const graphData = flapData.map((f) => ({
    time: new Date(f.timestamp).toLocaleString(),
    temp: f.temperature,
  }));

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2} align="center">
        Patient Flap Details
      </Typography>
      <Box sx={{ backgroundColor: "#f5f5f5", p: 3, marginBottom: 3 }}>
        <Typography variant="h6">Patient Details</Typography>
        <Typography variant="body1">
          <strong>Name:</strong> {patientData.name}
        </Typography>
        <Typography variant="body1">
          <strong>Age:</strong> {patientData.age}
        </Typography>
        <Typography variant="body1">
          <strong>Gender:</strong> {patientData.gender}
        </Typography>
        <Typography variant="body1">
          <strong>Address:</strong> {patientData.address}
        </Typography>
      </Box>

      {/* Temperature Graph */}
      <Box mb={4}>
        <Typography variant="h6">Temperature Variation</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <XAxis dataKey="time" />
            <YAxis dataKey="temp" unit="°C" />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey="temp" stroke="#1976d2" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Images */}
      <Typography variant="h6" gutterBottom>
        Flap Images
      </Typography>
      <Grid container spacing={2}>
        {flapData.map((f, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <img
              src={f.image_url}
              alt={`Flap ${index}`}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <Typography variant="body2">
              {new Date(f.timestamp).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              Temperature: {f.temperature.toFixed(2)} °C
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PatientDetail;
