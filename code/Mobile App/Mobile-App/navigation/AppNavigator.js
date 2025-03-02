import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DoctorHomeScreen from './screens/DoctorHomeScreen';
import PatientHomeScreen from './screens/PatientHomeScreen';
import AdminHomeScreen from './screens/AdminHomeScreen';
import SplashScreen from './screens/SplashScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const userData = JSON.parse(await AsyncStorage.getItem('userData'));
          setUserRole(userData?.role);
          setUserToken(token);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    // Show splash screen while checking login status
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {userToken === null ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          // App screens based on user role
          <>
            {userRole === 'doctor' && (
              <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} />
            )}
            {userRole === 'patient' && (
              <Stack.Screen name="PatientHome" component={PatientHomeScreen} />
            )}
            {userRole === 'hospital' && (
              <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;