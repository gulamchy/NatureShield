import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import CustomHeader from "../Components/customHeader";
import { useFocusEffect } from "@react-navigation/native";

const Home = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <StatusBar style="light" />
        <CustomHeader
          title="NatureShield"
          // subtitle="Welcome back"
          icons={["search", "notifications"]}
          onIconPress={{
            search: () => alert("Search Pressed"),
            notifications: () => alert("Notifications Pressed"),
          }}
        />
        <Text style={styles.title}>This is home screen</Text>
        {/* Add your screen-specific UI here */}
        <Button
          title="Identify"
          onPress={() => props.navigation.navigate("Identify")}
        />
        <Button
          title="More"
          onPress={() => props.navigation.navigate("More")}
        />
        <Button
          title="Species"
          onPress={() => props.navigation.navigate("Species")}
        />
        <Button
          title="Reports"
          onPress={() => props.navigation.navigate("Reports")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#001A1A",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    padding: 16,
  },
});
