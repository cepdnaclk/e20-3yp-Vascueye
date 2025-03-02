import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient colors={['#a6e8f0', '#52ebf6']} style={styles.container}>
      <Text style={styles.header}>Welcome to the Home Screen</Text>
      <Text style={styles.description}>
        This is where the main app content will be displayed.
      </Text>

      {/* Logout Button */}
      <Button title="Logout" onPress={() => navigation.navigate('Welcome')} color="#ffffff" />

      {/* Profile Button */}
      <View style={styles.buttonContainer}>
        <Button title="Change Profile" onPress={() => navigation.navigate('Profile')} color="#ffffff" />
      </View>
    </LinearGradient>
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
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
});
