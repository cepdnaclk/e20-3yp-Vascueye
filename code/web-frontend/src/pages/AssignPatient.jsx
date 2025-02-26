import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const AssignPatient = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");

  // Fetch doctors and patients on component mount
  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/patients");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedDoctor || !selectedPatient) {
      alert("Please select both a doctor and a patient.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/assign-patient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId: selectedDoctor,
            patientId: selectedPatient,
          }),
        }
      );

      if (response.ok) {
        alert("Patient assigned successfully!");
      } else {
        alert("Failed to assign patient.");
      }
    } catch (error) {
      console.error("Error assigning patient:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Assign Patient to Doctor
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              {doctors.map((doc) => (
                <MenuItem key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialty})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Patient</InputLabel>
            <Select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              {patients.map((pat) => (
                <MenuItem key={pat._id} value={pat._id}>
                  {pat.name} (Age: {pat.age})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAssign}
          >
            Assign Patient
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssignPatient;
