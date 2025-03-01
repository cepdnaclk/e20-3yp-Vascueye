import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";

const DashboardScreen = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Welcome, {user?.name}!</Text>
      <Text>Your Role: {user?.role}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default DashboardScreen;
