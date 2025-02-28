import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Footer from '../screens/Footer'; // Import Footer

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Background Image */}
            <Image source={require('../assets/background.webp')} style={styles.backgroundImage} />

            {/* Overlay to darken background */}
            <View style={styles.overlay} />

            {/* Main Content */}
            <View style={styles.content}>
                {/* Logo */}
                <Image source={require('../assets/vescueye-logo.png')} style={styles.logo} />

                <Text style={styles.heading}>Welcome to VescuEye</Text>
                <Text style={styles.introduction}>
                    VescuEye is an advanced vein visualization solution using near-infrared (NIR) technology to assist healthcare professionals.
                </Text>
            </View>

            {/* Login Button at Bottom */}
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Footer */}
            <Footer />
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    content: {
        alignItems: 'center',
        width: '80%',
        flex: 1,
        justifyContent: 'center',
    },
    logo: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
        marginBottom: 100,
    },
    heading: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    introduction: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    loginButton: {
        position: 'absolute',
        bottom: 60, // Adjusted to keep space for footer
        backgroundColor: '#10e0f8',
        paddingVertical: 20,
        borderRadius: 30,
        alignItems: 'center',
        width: '80%',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
