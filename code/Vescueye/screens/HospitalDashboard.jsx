import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { AuthContext } from "./authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Card, Button, Text } from "react-native-paper";

const HospitalDashboard = () => {
  const { user } = useContext(AuthContext);
  const [lastLogin, setLastLogin] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLastLogin = async () => {
      const storedLastLogin = await AsyncStorage.getItem("lastLogin");
      setLastLogin(storedLastLogin);
    };
    fetchLastLogin();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
      {/* Back Button */}
      <Button mode="outlined" onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
        Back
      </Button>

      {/* Dashboard Title */}
      <Text variant="headlineMedium" style={{ textAlign: "center", marginBottom: 20 }}>
        Hospital Dashboard
      </Text>

      {/* User Info */}
      <Card style={{ marginBottom: 20, padding: 10 }}>
        <Card.Content>
          {user ? (
            <>
              <Text variant="bodyLarge">Logged in as: {user.name}</Text>
              <Text variant="bodyLarge">Last Logged In: {lastLogin}</Text>
            </>
          ) : (
            <Text>Loading user data...</Text>
          )}
        </Card.Content>
      </Card>

      {/* Patient Management */}
      <Card style={{ marginBottom: 20, padding: 10 }}>
        <Card.Content>
          <Text variant="titleLarge">Patient Management</Text>
          <Button mode="contained" onPress={() => navigation.navigate("RegisterPatient")} style={{ marginTop: 10 }}>
            Register Patient
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate("SearchPatient")} style={{ marginTop: 10 }}>
            Search Patient
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate("AssignPatient")} style={{ marginTop: 10 }}>
            Assign Patient to Doctor
          </Button>
        </Card.Content>
      </Card>

      {/* Doctor Management */}
      <Card style={{ marginBottom: 20, padding: 10 }}>
        <Card.Content>
          <Text variant="titleLarge">Doctor Management</Text>
          <Button mode="contained" onPress={() => navigation.navigate("RegisterDoctor")} style={{ marginTop: 10 }}>
            Register Doctor
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate("SearchDoctor")} style={{ marginTop: 10 }}>
            Search Doctor
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate("AssignDoctor")} style={{ marginTop: 10 }}>
            Assign Doctor to Patient
          </Button>
        </Card.Content>
      </Card>

      {/* Quick Links */}
      <Card style={{ marginBottom: 20, padding: 10 }}>
        <Card.Content>
          <Text variant="titleLarge">Quick Links</Text>
          <Button mode="contained" onPress={() => navigation.navigate("Appointments")} style={{ marginTop: 10 }}>
            Manage Appointments
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate("MedicalRecords")} style={{ marginTop: 10 }}>
            View Medical Records
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate("Billing")} style={{ marginTop: 10 }}>
            Billing & Payments
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default HospitalDashboard;
