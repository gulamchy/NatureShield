import React, { useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import CustomHeader from "../Components/customHeader";
import { useNavigation } from "@react-navigation/native";
import HorizontalSection from "../Components/horizontalSection";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../authContext";
import IconButton from "../Components/iconButton";

import Ionicons from "@expo/vector-icons/Ionicons";
// import { LinearGradient } from "expo-linear-gradient";

const Home = (props) => {
  const navigation = useNavigation();
  const { clickCamera, countClick } = useContext(AuthContext);

  const sampleItems = [
    {
      image:
        "https://woodlandessence.com/cdn/shop/products/JapaneseKnotweed2-IS-website_1400x.jpg?v=1573522162",
      label: "Japanese Knotweed",
    },
    {
      image:
        "https://www.gardenia.net/wp-content/uploads/2023/05/Wisteria-Sinensis-Chinese-Wisteria.webp",
      label: "Chinese wisteria",
    },
    {
      image:
        "https://newfs.s3.amazonaws.com/taxon-images-239x239/Rosaceae/rosa-multiflora-fl-ahaines-b.jpg",
      label: "Multiflora rose",
    },
  ];

  const sampleOrg = [
    {
      image:
        "https://res.cloudinary.com/dd7rhunty/image/upload/v1748297375/NAISMA_yap0ry.png",
      label: "NAISMA",
    },
    {
      image:
        "https://res.cloudinary.com/dd7rhunty/image/upload/v1748297333/NAISN_x9goog.png",
      label: "NAISN",
    },
    {
      image:
        "https://res.cloudinary.com/dd7rhunty/image/upload/v1748297333/NPS_jydihj.png",
      label: "NPS",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <CustomHeader
          title="NatureShield"
          // subtitle="Welcome back"
          icons={["search", "notifications"]}
          onIconPress={{
            search: () => alert("Search Pressed"),
            notifications: () => alert("Notifications Pressed"),
          }}
        />
        <View style={styles.mainContent}>
          <View style={styles.headerText}>
            <View style={styles.subTitleView}>
              <Text style={styles.subTitle}>Current Sighting Around you</Text>
              <Ionicons
                name="eye-outline"
                color="#fff"
                size={16}
                style={{ opacity: 0.6 }}
              />
            </View>
            <Text style={styles.title}>{countClick} </Text>
          </View>

          <View style={styles.buttonContent}>
            <View style={styles.buttonRow}>
              <IconButton
                label="Report"
                iconName="warning-outline"
                onPress={() => navigation.navigate("Reports")}
              />
              <IconButton
                label="Donate"
                iconName="card-outline"
                onPress={() => alert("Donate Pressed")}
              />
              <IconButton
                label="More"
                iconName="ellipsis-vertical"
                onPress={() => alert("More Pressed")}
              />
            </View>
          </View>

          <View style={styles.additionalContent}>
            <HorizontalSection
              title="Species"
              items={sampleItems}
              onViewPress={() => navigation.navigate("Species")}
              onItemPress={(item) => alert(`Pressed on ${item.label}`)}
            />

            <HorizontalSection
              title="Organizations"
              items={sampleOrg}
              onItemPress={(item) => alert(`Pressed on ${item.label}`)}
              viewVisibility={false}
            />
          </View>
        </View>
      </ScrollView>
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
  mainContent: {
    flex: 1,
    justifyContent: "space-around",
  },
  headerText: {
    alignItems: "center",
    justifyContent: "center",
  },
  subTitleView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#95E5E5",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    alignItems: "center",
  },
  additionalContent: {
    flex: 1,
    backgroundColor: "#F2FFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    gap: 32,
  },
});
