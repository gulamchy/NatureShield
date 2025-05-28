import React from "react";
import { AuthProvider } from "./authContext"; // adjust path if needed
import RootNavigator from "./rootNavigator"; // we'll move navigation logic here
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";

export default function App() {
  const ipAddress = process.env.EXPO_PUBLIC_BACKEND_IP
  return (
    <AuthProvider>
      <View style={{ flex: 1 }} >
        <NavigationContainer>
          <RootNavigator ip={ipAddress}/>
        </NavigationContainer>
      </View>
    </AuthProvider>
  );
}
