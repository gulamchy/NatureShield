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
        const stored = await AsyncStorage.getItem("token");
        const storeCount = await AsyncStorage.getItem("countClick");

        if (stored) {
          setIsLoggedIn(!!stored);
          setCountClick(parseInt(storeCount, 10) || 0);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (token) => {
    await AsyncStorage.setItem("token", token);
    // await AsyncStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const clickCamera = async () => {
    const newCount = countClick + 1;
    setCountClick(newCount);
    await AsyncStorage.setItem("countClick", newCount.toString());
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
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
