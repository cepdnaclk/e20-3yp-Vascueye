import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // For icons

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient colors={["#a6e8f0", "#52ebf6"]} style={styles.container}>
      {/* Profile Button at Top */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-circle-outline" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Header Section */}
      <Text style={styles.header}>Welcome Doctor!</Text>
      <Text style={styles.description}>
        Explore the features and manage your account.
      </Text>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        {/* View Patients Button */}
        <TouchableOpacity
          style={[styles.button, styles.viewPatientsButton]}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="people-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>View Patients</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LiveFlapScreen")}
        >
          <Ionicons name="camera-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>View Live Data</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => navigation.navigate("Welcome")}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#007aff",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    marginBottom: 40,
    opacity: 0.9,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007aff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  viewPatientsButton: {
    backgroundColor: "#34c759", // Green for "View Patients"
  },
  logoutButton: {
    backgroundColor: "#ff3b30", // Red for "Logout"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
