import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { AuthContext } from "../authContext";

const Profile = (props) => {
  const backendIp = process.env.EXPO_PUBLIC_BACKEND_IP;
  const backendPort = process.env.EXPO_PUBLIC_BACKEND_PORT;
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const url = `http://${backendIp}:${backendPort}/profile`;
  const [userData, setUserData] = useState();

  async function getData() {
    const token = await AsyncStorage.getItem("token");
    console.log(token);

    axios
      .post(url, { token: token })
      .then((res) => {
        console.log("Full response:", res.data.data);
        setUserData(res.data.data);
      })
      .catch((err) => {
        console.error("Error from backend:", err.response?.data || err.message);
      });
  }
  function handleLogout() {
    logout();
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View>
        <Text style={styles.title}>Hi {userData ? userData.name : ""}</Text>
        {/* Add your screen-specific UI here */}
        <Button title="Logout" onPress={() => handleLogout()} />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F2FFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
