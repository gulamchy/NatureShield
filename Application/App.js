// import { useCallback, useEffect, useState } from "react";
// import { View } from "react-native";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";
// import Entypo from "@expo/vector-icons/Entypo";
// import * as Network from "expo-network";

// import {
//   createStaticNavigation,
//   NavigationContainer,
// } from "@react-navigation/native";
// import MainNavigator from "./Screens/mainNavigator";
// import SignUpScreen from "./Screens/signupScreen";
// import LoginScreen from "./Screens/loginScreen";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// SplashScreen.preventAutoHideAsync();

// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });

// export default function App() {
//   const [appIsReady, setAppIsReady] = useState(false);
//   const [ip, setIp] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   async function getData() {
//     const data = await AsyncStorage.getItem("isLoggedIn");
//     setIsLoggedIn(data);
//   }

//   useEffect(() => {
//     async function prepare() {
//       try {
//         await Font.loadAsync(Entypo.font);
//         await new Promise((resolve) => setTimeout(resolve, 2000)); // Optional: Simulated delay
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         setAppIsReady(true);
//       }
//     }

//     prepare();
//   }, []);

//   useEffect(() => {
//     getData();
//     (async () => {
//       const ipAddress = await Network.getIpAddressAsync();
//       console.log("Device IP:", ipAddress);
//       setIp(ipAddress);
//     })();
//   }, []);

//   const onLayoutRootView = useCallback(() => {
//     if (appIsReady) {
//       SplashScreen.hide();
//     }
//   }, [appIsReady]);

//   if (!appIsReady) {
//     return null;
//   }

//   const Stack = createNativeStackNavigator();

//   return (
//     <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           {isLoggedIn ? (
//             <Stack.Screen name="mainNavigator" component={MainNavigator} />
//           ) : (
//             <>
//               <Stack.Screen
//                 name="signup"
//                 children={(props) => <SignUpScreen {...props} ipAddress={ip} />}
//               />
//               <Stack.Screen name="login" component={LoginScreen} />
//             </>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </View>
//   );
// }

import React from "react";
import { AuthProvider } from "./authContext"; // adjust path if needed
import RootNavigator from "./rootNavigator"; // we'll move navigation logic here
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";

export default function App() {
  return (
    <AuthProvider>
      <View style={{ flex: 1 }} >
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </View>
    </AuthProvider>
  );
}
