import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data & token on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function: Stores token & user data
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  // Logout function: Clears token & user data
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    axios.defaults.headers.common["Authorization"] = null;
    setUser(null);
  };

  // Signup function: Automatically logs in the user after signup
  const signup = async (name, email, password, role) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", { 
        name, email, password, role 
      });

      if (res.data.success && res.data.token) {
        login(res.data.token, res.data.user); // Auto-login after signup
      }
      
      return res.data;
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
