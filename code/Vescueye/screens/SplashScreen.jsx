import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import Footer from '../screens/Footer'; // Adjust the path if necessary

export default function SplashScreen({ navigation }) {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            navigation.replace('Welcome');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
                <Image source={require('../assets/vescueye-logo.png')} style={styles.logo} />
            </Animated.View>

            {/* Footer Component */}
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 230,
        height: 230,
        resizeMode: 'contain',
    },
});
