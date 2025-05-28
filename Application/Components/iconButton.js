import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Button, Pressable } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const IconButton = ({ iconName, label, onPress }) => (
  <Pressable style={styles.buttonContainer} onPress={onPress}>
    <LinearGradient
      colors={["rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
      style={styles.outerCircle}
    >
      <View style={styles.middleCircle}>
        <LinearGradient
          colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0)"]}
          style={styles.innerCircle}
        >
          <Ionicons name={iconName} size={24} color="#fff" />
        </LinearGradient>
      </View>
    </LinearGradient>

    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    margin: 10,
    flex: 1,
  },
  outerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  middleCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#001A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: "#fff",
    opacity: 0.5,
    fontWeight: "400",
  },
});
