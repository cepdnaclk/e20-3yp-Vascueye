import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Login Successful!');
                
                // Redirect to respective dashboard
                if (data.role === 'doctor') {
                    navigation.replace('DoctorDashboard');
                } else if (data.role === 'patient') {
                    navigation.replace('PatientDashboard');
                } else {
                    Alert.alert('Error', 'Unknown user role.');
                }
            } else {
                Alert.alert('Error', data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Error', 'Failed to connect to server');
        }
    };

    return (
        <View style={styles.container}>
            {/* Vescueye Logo */}
            <Image 
                source={require('../assets/vescueye-logo.png')} // Ensure this path is correct
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.hospitalButton} onPress={() => navigation.navigate('HospitalDashboard')}>
                <Text style={styles.hospitalButtonText}>Go to Hospital Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    forgotPasswordText: {
        alignSelf: 'flex-end',
        color: '#007bff',
        marginBottom: 15,
    },
    loginButton: {
        backgroundColor: '#0ab6c9',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    hospitalButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    hospitalButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerText: {
        marginTop: 15,
        color: '#007bff',
    },
});
