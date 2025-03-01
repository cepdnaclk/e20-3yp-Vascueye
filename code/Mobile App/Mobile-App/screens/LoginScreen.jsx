import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/AuthService";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      console.log("🚀 Attempting login with:", { email, password });

      const response = await loginUser(email, password);

      console.log("🔹 API Response:", response);

      if (response.success) {
        console.log("✅ Login successful! Token received:", response.token);
        login(response.token, response.user);

        console.log("🔄 Navigating to Dashboard...");
        navigation.navigate("Dashboard");
      } else {
        console.log("❌ Login failed:", response.message);
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ Unexpected login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, marginBottom: 20 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        onPress={() => navigation.navigate("SignUp")}
        style={{ marginTop: 10, color: "blue" }}
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

export default SignInScreen;
