import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SigupScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import DoctorDashboard from './screens/DoctorDashboard';
import FlapSearch from './screens/FlapSearch';

// Footer Component
import Footer from './components/Footer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigation (For Home)
function HomeStack() {
    return (
        <Drawer.Navigator initialRouteName="HomeDrawer">
            <Drawer.Screen name="HomeDrawer" component={HomeScreen} />
            <Drawer.Screen name="Doctor" component={DoctorDashboard} />
        </Drawer.Navigator>
    );
}

// Stack Navigation for Main App
export default function App() {
    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
                <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="Home" component={HomeStack} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="doctorpage" component={DoctorDashboard} />
                    <Stack.Screen name="flapsearch" component={FlapSearch} />
                </Stack.Navigator>

                {/* Footer */}
                <Footer />
            </View>
        </NavigationContainer>
    );
}
