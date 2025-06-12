import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
} from "react-native";

const HorizontalSection = ({
  title,
  items,
  onItemPress,
  onViewPress,
  viewVisibility = true,
}) => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.topSection}>
        <Text style={styles.headerText}>{title}</Text>
        {viewVisibility && (
          <Pressable onPress={onViewPress}>
            <Text style={styles.viewButton}>View All</Text>
          </Pressable>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <Pressable
            key={index}
            style={styles.card}
            onPress={() => onItemPress(item)}
          >
            {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                <Ionicons name="image" size={32} color="#ffffff7A" />
              </View>
            )}
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HorizontalSection;

const styles = StyleSheet.create({
  safeContainer: {
    paddingVertical: 12,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    opacity: 0.6,
    textTransform: "uppercase",
    lineHeight: 16,
  },
  viewButton: {
    fontSize: 12,
    fontWeight: "700",
    color: "#408080",
    textTransform: "uppercase",
    lineHeight: 16,
  },
  card: {
    marginRight: 8,
  },
  image: {
    width: 120,
    height: 96,
    borderRadius: 12,
    marginBottom: 8,
  },
  placeholder: {
    backgroundColor: "#2B4040", // or any fallback color
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#001A1A",
    flexWrap: "wrap",
    fontWeight: "500",
    maxWidth: 120,
    paddingHorizontal: 8,
    textTransform: "capitalize",
  },
});
