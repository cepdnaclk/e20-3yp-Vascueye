import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "./context/AuthContext";
import SignInScreen from "./screens/LoginScreen";
import DashBoardScreen from "./screens/DashBoardScreen";
import SplashScreen from "./screens/SplashScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="Dashboard" component={DashBoardScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={SignInScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
