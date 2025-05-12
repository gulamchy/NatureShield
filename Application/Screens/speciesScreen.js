import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Button } from "react-native";
import CustomHeader from "../Components/customHeader";
import { StatusBar } from "expo-status-bar";

const Species = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View>
        <CustomHeader
          title="Species"
          // subtitle="Welcome back"
          icons={["options", "search", "notifications"]}
          onIconPress={{
            options: () => alert("Options Pressed"),
            search: () => alert("Search Pressed"),
            notifications: () => alert("Notifications Pressed"),
          }}
        />
        <Text style={styles.title}>This is species screen</Text>
        {/* Add your screen-specific UI here */}
        <Button
          title="Home"
          onPress={() => props.navigation.navigate("Home")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Species;

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
