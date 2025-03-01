import axios from "axios";

const API_URL = "http://192.168.56.1:5000/api/auth"; // Update this to your backend URL

export const loginUser = async (email, password) => {
  try {
    console.log("🚀 Sending login request to:", `${API_URL}/signin`);
    console.log("📤 Request Payload:", { email, password });

    const response = await axios.post(`${API_URL}/signin`, { email, password });

    console.log("✅ Login successful! Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Login error:", error);
    console.log("🔍 Full Error Object:", JSON.stringify(error, null, 2));

    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};
