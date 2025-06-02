import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './navigation/RootNavigation';

// Screens
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
import ImageViewer from './screens/ImageViewer';

const Stack = createStackNavigator();
const BASE_URL = "http://172.20.10.6:5001/api/users";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const subscription = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const data = response.notification.request.content.data;
      const { navigateTo, params } = data;

      const isLoggedIn = await checkAuthStatus();

      if (navigateTo) {
        if (isLoggedIn) {
          navigationRef.current?.navigate(navigateTo, params || {});
        } else {
          setPendingNavigation({ screen: navigateTo, params: params || {} });
          navigationRef.current?.navigate('Login');
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch {
      return false;
    }
  };

  const handleLoginSuccess = () => {
    if (pendingNavigation) {
      const { screen, params } = pendingNavigation;
      navigationRef.current?.navigate(screen, params);
      setPendingNavigation(null);
    } else {
      navigationRef.current?.navigate('Home');
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              onLoginSuccess={handleLoginSuccess}
              pendingNavigation={pendingNavigation}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="LiveFlapScreen" component={LiveFlapScreen} />
        <Stack.Screen name="Dashboard" component={DoctorDashboard} />
        <Stack.Screen name="Patients" component={PatientScreen} />
        <Stack.Screen name="ImageViewer" component={ImageViewer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('❌ Must use physical device');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('❌ Permission not granted');
    return;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log('✅ Expo Push Token:', tokenData.data);
    await sendPushTokenToBackend(tokenData.data);
  } catch (err) {
    console.log('❌ Error getting Expo Push Token:', err);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}

async function sendPushTokenToBackend(expoPushToken) {
  try {
    const response = await fetch(`${BASE_URL}/savePushToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: expoPushToken }),
    });

    if (response.ok) {
      console.log('✅ Push token sent');
    } else {
      console.log('❌ Failed to send push token');
    }
  } catch (err) {
    console.log('❌ Error sending push token:', err);
  }
}
