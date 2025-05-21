import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SigupScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import PatientScreen from './screens/PatientScreen';
import ForgotPassword from './screens/ForgotPassword';
import LiveFlapScreen from './screens/LiveFlapScreen';
import DoctorDashboard from './screens/DoctorDashboard';

// Footer Component
import Footer from './components/Footer';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
                <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                    <Stack.Screen name="LiveFlapScreen" component={LiveFlapScreen} />
                    <Stack.Screen name="Dashboard" component={DoctorDashboard} />
                    <Stack.Screen name="Patients" component={PatientScreen} />
                </Stack.Navigator>

                {/* Footer */}
                <Footer />
            </View>
        </NavigationContainer>
    );
}
