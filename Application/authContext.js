// AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading state
  const [countClick, setCountClick] = useState(0);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedExpiry = await AsyncStorage.getItem("tokenExpiry");

        if (storedToken && storedExpiry) {
          const expiryTime = parseInt(storedExpiry, 10);
          const now = Date.now();

          if (now < expiryTime) {
            setIsLoggedIn(true);
          } else {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("tokenExpiry");
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }

        const storeCount = await AsyncStorage.getItem("countClick");
        setCountClick(parseInt(storeCount, 10) || 0);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (token, expiryTime) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("tokenExpiry", expiryTime.toString());
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error storing token:", error);
      setIsLoggedIn(false);
    }
  };

  const clickCamera = async () => {
    const newCount = countClick + 1;
    setCountClick(newCount);
    await AsyncStorage.setItem("countClick", newCount.toString());
  };

  // const logout = async () => {

  //   await AsyncStorage.removeItem("token");
  //   await AsyncStorage.removeItem("tokenExpiry");
  //   await AsyncStorage.setItem("isLoggedIn", "false");
  //   setIsLoggedIn(false);
  // };
  const logout = async () => {
  try {
    await AsyncStorage.multiRemove([
      "token",
      "tokenExpiry",
      "cachedSpecies",
      "cachedReports",
      "cachedProfile",
      "cachedUser"
    ]);
    await AsyncStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  } catch (error) {
    console.error("Error clearing async storage on logout:", error);
  }
};


  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00aa00" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, countClick, clickCamera }}
    >
      {children}
    </AuthContext.Provider>
  );
};
