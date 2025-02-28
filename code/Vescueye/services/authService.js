import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api/auth"; // Update with your actual API URL

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, { email, password });

    if (response.data.success) {
      const { token, role, user } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      if (role === "hospital") {
        await AsyncStorage.setItem("hospitalEmail", email);
      }

      return response.data;
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("hospitalEmail");

    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    return { success: false, message: "Logout failed" };
  }
};
