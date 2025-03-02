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
      const response = await fetch(
        "http://localhost:5000/api/users/patients/unassigned"
      );
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor.");
      return;
    }

    if (selectedPatient === "assign_all") {
      // Assign all patients
      const allPatientIds = patients.map((pat) => pat._id);
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/assign-all-patients",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              doctorId: selectedDoctor,
              patientIds: allPatientIds,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("All patients assigned successfully!");
          setSelectedDoctor("");
          setSelectedPatient("");
        } else {
          alert(data.error || "Failed to assign all patients.");
          setSelectedDoctor("");
          setSelectedPatient("");
        }
      } catch (error) {
        console.error("Error assigning all patients:", error);
      } finally {
        window.location.reload();
      }
    } else {
      // Assign a single patient
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
        const data = await response.json();
        if (response.ok) {
          alert("Patient assigned successfully!");
        } else {
          alert(data.error || "Failed to assign patient.");
        }
      } catch (error) {
        console.error("Error assigning patient:", error);
      } finally {
        window.location.reload();
      }
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
              <MenuItem value="assign_all">Assign All</MenuItem>
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
