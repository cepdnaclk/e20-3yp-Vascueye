// screens/PatientScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PatientScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patient Screen</Text>
      <Text style={styles.description}>This is where patient details will be displayed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
});
