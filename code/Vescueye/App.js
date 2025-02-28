import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./screens/authContext"; // Ensure this is correct
import SplashScreen from "./screens/SplashScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import HospitalDashboard from "./screens/HospitalDashboard";
import ForgetPassword from "./screens/ForgetPassword";



const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider> 
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="HospitalDashboard" component={HospitalDashboard} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
