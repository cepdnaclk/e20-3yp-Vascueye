import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [flapData, setFlapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flapLoading, setFlapLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const doctorEmail = "doctor@test.com"; 

  // API Base URL
  const BASE_URL = "http://192.168.8.100:5001/api/users";

  useEffect(() => {
    const getPatients = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/doctor/patients`, { email: doctorEmail });
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching assigned patients:", error);
      } finally {
        setLoading(false);
      }
    };
    getPatients();
  }, []);

  const handleFetchFlapData = async (patientId) => {
    setSelectedPatientId(patientId);
    setFlapData([]);
    setFlapLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/flap/search/${patientId}`);
      setFlapData(response.data);
    } catch (error) {
      setError("Failed to load flap data.");
      console.error("Error fetching flap data:", error);
    } finally {
      setFlapLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doctor Dashboard</Text>
      <Text style={styles.subHeader}>Welcome, Doctor!</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>
                <Text style={styles.boldText}>Name:</Text> {item.name}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.boldText}>Age:</Text> {item.age}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.boldText}>Contact:</Text> {item.contact}
              </Text>
              <Button title="Search Flap Data" onPress={() => handleFetchFlapData(item._id)} />
            </View>
          )}
        />
      )}

      {selectedPatientId && (
        <View style={styles.flapContainer}>
          <Text style={styles.sectionTitle}>Flap Data</Text>
          {flapLoading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : flapData.length > 0 ? (
            <FlatList
              data={flapData}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.flapCard}>
                  <Text style={styles.cardText}>
                    <Text style={styles.boldText}>Temperature:</Text> {item.temperature.toFixed(2)} °C
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.boldText}>Timestamp:</Text> {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              )}
            />
          ) : (
            <Text>No flap data available.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },  
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10,marginTop: 40, textAlign: "center" },
  subHeader: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  card: { 
    backgroundColor: "#ffffff",
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10,
    elevation: 3, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  cardText: { fontSize: 16 },
  boldText: { fontWeight: "bold" },
  flapContainer: { marginTop: 20, padding: 10, backgroundColor: "#fff", borderRadius: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  flapCard: { backgroundColor: "#eee", padding: 15, borderRadius: 8, marginBottom: 10 },
  errorText: { color: "red", fontSize: 16, textAlign: "center", marginTop: 10 }
});

// export default DoctorDashboard;
