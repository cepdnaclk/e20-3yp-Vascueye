import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://www.vescueye.work.gd/api"; // Updated API URL

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hospitalEmail, setHospitalEmail] = useState(null);
s
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        const storedHospitalEmail = await AsyncStorage.getItem("hospitalEmail");
        const storedLastLogin = await AsyncStorage.getItem("lastLogin");

        if (token && storedUser) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser({
            ...JSON.parse(storedUser),
            lastLogin: storedLastLogin ? new Date(storedLastLogin).toISOString() : null,
          });
        }

        if (storedHospitalEmail) {
          setHospitalEmail(JSON.parse(storedHospitalEmail));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const login = async (token, userData) => {
    try {
      const loginTime = new Date().toISOString();
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("lastLogin", loginTime);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ ...userData, lastLogin: loginTime });

      if (userData.role === "hospital") {
        await AsyncStorage.setItem("hospitalEmail", JSON.stringify(userData.email));
        setHospitalEmail(userData.email);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user", "hospitalEmail", "lastLogin"]);
      axios.defaults.headers.common["Authorization"] = null;
      setUser(null);
      setHospitalEmail(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, hospitalEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
