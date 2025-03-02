import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from "react-native";

const WEBSOCKET_URL = "ws://192.168.8.101:8080"; // Replace with your backend IP

const LiveFlapScreen = () => {
  const [flapData, setFlapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setLoading(false);
    };

    ws.onmessage = (event) => {
      try {
        const newFlap = JSON.parse(event.data);
        console.log("🔹 New Flap Data:", newFlap);

        // Keep only the latest 5 images
        setFlapData((prevData) => {
          const updatedData = [newFlap, ...prevData].slice(0, 5);
          return updatedData;
        });
      } catch (error) {
        console.error("❌ Error parsing WebSocket data:", error);
      }
    };

    ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
    ws.onclose = () => console.log("❌ WebSocket Disconnected");

    return () => ws.close(); // Cleanup WebSocket on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live Flap Data</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <FlatList
          data={flapData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <Text style={styles.text}>Patient ID: {item.patient_id}</Text>
              <Text style={styles.text}>Temperature: {item.temperature} °C</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 40,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default LiveFlapScreen;
