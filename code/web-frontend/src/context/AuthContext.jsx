import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Define your API URL here
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hospitalEmail, setHospitalEmail] = useState(null); // Store hospital email separately

  // Load user data & token on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedHospitalEmail = localStorage.getItem("hospitalEmail");

    if (token && storedUser) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    }

    if (storedHospitalEmail) {
      setHospitalEmail(storedHospitalEmail);
    }
  }, []);

  // Login function: Stores token & user data
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);

    if (userData.role === "hospital") {
      localStorage.setItem("hospitalEmail", userData.email);
      setHospitalEmail(userData.email);
    }
  };

  // Logout function: Clears token & user data
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("hospitalEmail");
    axios.defaults.headers.common["Authorization"] = null;
    setUser(null);
    setHospitalEmail(null);
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success && data.token && data.user) {
        login(data.token, data.user); // Automatically log in the user after signup
      }

      return data;
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Network error" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, hospitalEmail, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
