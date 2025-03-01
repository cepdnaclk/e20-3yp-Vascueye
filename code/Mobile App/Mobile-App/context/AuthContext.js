import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.56.1:5000/api/auth"; // Update this to your backend URL
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        console.log("🔹 Token retrieved from AsyncStorage:", token);
        console.log("🔹 Stored User retrieved from AsyncStorage:", storedUser);

        if (token && storedUser) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser(JSON.parse(storedUser));
          console.log("✅ User successfully loaded from AsyncStorage.");
        } else {
          console.log("⚠️ No user data found in AsyncStorage.");
        }
      } catch (error) {
        console.error("❌ Error loading user data:", error);
      }
    };
    loadUser();
  }, []);

  const login = async (token, userData) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
      
      // Debugging logs
      console.log("✅ Token stored in AsyncStorage:", await AsyncStorage.getItem("token"));
      console.log("✅ User stored in AsyncStorage:", await AsyncStorage.getItem("user"));
      console.log("🚀 User logged in:", userData);
    } catch (error) {
      console.error("❌ Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      axios.defaults.headers.common["Authorization"] = null;
      setUser(null);

      console.log("🚪 User logged out. Token and user removed.");
      console.log("🔄 Token after logout:", await AsyncStorage.getItem("token"));
      console.log("🔄 User after logout:", await AsyncStorage.getItem("user"));
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
