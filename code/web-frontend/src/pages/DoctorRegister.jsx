import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DoctorRegister = () => {
  const [doctorData, setDoctorData] = useState({
    name: "",
    specialty: "",
    contact: "",
    email: "",
  });

  const [errors, setErrors] = useState({ contact: "", email: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact") {
      if (!/^\d{0,10}$/.test(value)) return; // Allow only up to 10 digits
      if (value.length === 10) {
        setErrors((prev) => ({ ...prev, contact: "" })); // Clear error if valid
      } else {
        setErrors((prev) => ({
          ...prev,
          contact: "Contact must be 10 digits",
        }));
      }
    }

    if (name === "email") {
        // Simple email validation: must include "@" and "."
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
        } else {
          setErrors((prev) => ({ ...prev, email: "" }));
        }
      }

    setDoctorData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (doctorData.contact.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        contact: "Contact must be exactly 10 digits",
      }));
      return;
    }

    if (errors.email) {
        return; // Prevent submission if email is invalid
      }

    const response = await fetch(
      "http://localhost:5000/api/users/doctor/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData),
      }
    );

    if (response.ok) {
      console.log("Doctor registered successfully");
      navigate("/hospital-dashboard");
      setDoctorData({
        name: "",
        speciality: "",
        contact: "",
        email: "",
      });
    } else {
      console.error("Error registering doctor");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Register Doctor
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={doctorData.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Specialty"
              name="specialty"
              value={doctorData.specialty}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contact"
              name="contact"
              value={doctorData.contact}
              onChange={handleChange}
              required
              placeholder="Enter a 10-digit contact number"
              margin="normal"
              error={!!errors.contact}
              helperText={errors.contact}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={doctorData.email}
              onChange={handleChange}
              required
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={!!errors.email || !!errors.contact}
            >
              Register Doctor
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DoctorRegister;
