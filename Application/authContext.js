// AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading state
  const [countClick, setCountClick] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const checkLoginStatus = async () => {
      try {
        const stored = await AsyncStorage.getItem("token");
        const storeCount = await AsyncStorage.getItem("countClick");

        if (isMounted) {
          setIsLoggedIn(!!stored);
          setCountClick(parseInt(storeCount, 10) || 0);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (token) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("isLoggedIn", "true");
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

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, countClick, clickCamera }}
    >
      {children}
    </AuthContext.Provider>
  );
};
