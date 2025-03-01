import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Background Image (preloaded in App.js) */}
            <Image
                source={require('../assets/background.webp')}
                style={styles.backgroundImage}
            />

            {/* Overlay to darken background */}
            <View style={styles.overlay} />

            {/* Main Content */}
            <View style={styles.content}>
                {/* Logo (preloaded in App.js) */}
                <Image 
                    source={require('../assets/vescueye-logo.png')} 
                    style={styles.logo} 
                />

                <Text style={styles.heading}>Welcome to VescuEye</Text>
                <Text style={styles.introduction}>
                    VescuEye is an advanced vein visualization solution using near-infrared (NIR) technology to assist healthcare professionals.
                </Text>

                {/* Bottom Buttons */}
                <View style={styles.bottomButtonsContainer}>
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={() => navigation.navigate('Login')} // Navigate directly to Login
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    content: {
        alignItems: 'center',
        width: '80%',
    },
    logo: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
        marginBottom: 20,
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
    bottomButtonsContainer: {
        marginTop: 100,
        width: '100%',
        alignItems: 'center',
    },
    getStartedButton: {
        backgroundColor: '#10e0f8',
        paddingVertical: 20,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    loginButton: {
        borderWidth: 2,
        borderColor: 'white',
        paddingVertical: 20,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
