import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";

const FlapSearch = () => {
  const [patientId, setPatientId] = useState("");
  const [flapData, setFlapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to Fetch Flap Data by Patient ID
  const searchFlapData = async () => {
    if (!patientId.trim()) {
      setError("Please enter a Patient ID.");
      return;
    }

    setLoading(true);
    setError("");
    setFlapData([]); // Clear previous data before making a new request

    try {
      console.log(`Fetching flap data for Patient ID: ${patientId}`);

      const response = await axios.get(
        `http://localhost:5000/api/users/flap/search/${patientId}`
      );

      console.log("API Response:", response.data); // Log response

      if (response.data.length === 0) {
        setError("No flap data found for this patient.");
      } else {
        setFlapData(response.data); // Update state with flap data
      }
    } catch (err) {
      console.error("API Error:", err); // Log error
      setError(err.response?.data?.error || "Error fetching flap data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Flap Data</Text>

      {/* Flap Data Search Section */}
      <View style={styles.searchContainer}>
        <Text style={styles.subtitle}>Search by Patient ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Patient ID"
          value={patientId}
          onChangeText={setPatientId}
        />
        <TouchableOpacity style={styles.button} onPress={searchFlapData}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Show Loading State */}
      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loading} />}

      {/* Show Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Show Flap Data Results */}
      {flapData.length > 0 && (
        <View style={styles.tableContainer}>
          <Text style={styles.subtitle}>Flap Data Results</Text>
          <FlatList
            data={flapData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <Text style={styles.text}>
                  <Text style={styles.bold}>Temperature:</Text> {item.temperature.toFixed(2)} °C
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Timestamp:</Text>{" "}
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    alignItems: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  loading: {
    marginVertical: 20,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginVertical: 10,
  },
  tableContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginTop: 15,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default FlapSearch;
