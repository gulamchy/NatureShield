// RootNavigator.js
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Entypo from "@expo/vector-icons/Entypo";
import * as Network from "expo-network";

import MainNavigator from "./Screens/mainNavigator";
import SignUpScreen from "./Screens/signupScreen";
import LoginScreen from "./Screens/loginScreen";
import { AuthContext } from "./authContext";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 1000, fade: true });

export default function RootNavigator() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [ip, setIp] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    (async () => {
      const ipAddress = await Network.getIpAddressAsync();
      setIp(ipAddress);
    })();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) SplashScreen.hide();
  }, [appIsReady]);

  const Stack = createNativeStackNavigator();

  if (!appIsReady || isLoggedIn === null) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="mainNavigator" component={MainNavigator} />
        ) : (
          <>
            <Stack.Screen
              name="signup"
              children={(props) => <SignUpScreen {...props} ipAddress={ip} />}
            />
            <Stack.Screen name="login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </View>
  );
}
