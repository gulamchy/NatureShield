import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import CustomHeader from "../Components/customHeader";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";


// import invasiveSpecies from "../Components/invasiveSpecies";
// import invasiveSpecies from "../species.json";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Species = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [invasiveSpecies, setInvasiveSpecies] = useState([]);

  // useEffect(() => {
  //   const fetchSpecies = async () => {
  //     try {
  //       const data = require("../species.json");
  //       setTimeout(() => {
  //         setInvasiveSpecies(data);
  //         setLoading(false);
  //       }, 1000);
  //     } catch (error) {
  //       console.error("Failed to load species data", error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchSpecies();
  // }, []);
  useEffect(() => {
  const fetchSpecies = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        // No token means user not logged in, handle as needed
        setLoading(false);
        return;
      }

      const cached = await AsyncStorage.getItem("cachedSpecies");
      if (cached) {
        setInvasiveSpecies(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // If no cache, load from JSON and cache it
      const data = require("../species.json");
      await AsyncStorage.setItem("cachedSpecies", JSON.stringify(data));
      setInvasiveSpecies(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading species data", error);
      setLoading(false);
    }
  };

  fetchSpecies();
}, []);

  if (loading) {
    return (
      <>
        <StatusBar style="light" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#001A1A",
          }}
        >
          <ActivityIndicator size="large" color="#00aa00" />
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              fontWeight: "500",
              color: "#fff",
            }}
          >
            Fetching species...
          </Text>
        </View>
      </>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        <CustomHeader
          title="Species"
          icons={["", "", ""]}
          onIconPress={
            {
              // options: () => alert("Options Pressed"),
              // search: () => alert("Search Pressed"),
              // notifications: () => alert("Notifications Pressed"),
            }
          }
        />

        <FlatList
          data={invasiveSpecies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("SpeciesIndividual", {
                  CommonName: item.CommonName,
                  ScientificName: item.ScientificName,
                  Durations: item.Durations,
                  GrowthHabits: item.GrowthHabits,
                  OtherCommonNames: item.OtherCommonNames,
                  Description: item.WikiDescription,
                  image: item.WikiImage,
                  NativeStatus: JSON.parse(
                    "[" + item.NativeStatuses.replace(/'/g, '"') + "]"
                  )[0]?.Type,
                })
              }
            >
              <View style={styles.CardContainer}>
                {item["WikiImage"] && item["WikiImage"].trim() !== "" ? (
                  <Image
                    source={{ uri: item["WikiImage"] }}
                    style={styles.image}
                  />
                ) : (
                  <View style={[styles.image, styles.placeholder]}>
                    <Ionicons name="image" size={32} color="#ffffff7A" />
                  </View>
                )}

                <View style={styles.TextContainer}>
                  <Text style={styles.topText}>Name</Text>
                  <Text style={styles.name}>{item.CommonName}</Text>
                </View>

                <View style={styles.TextContainer}>
                  <Text style={styles.topText}>Label</Text>
                  {item.InvasiveFlag == "yes" ? (
                    <Text style={styles.name}>Invasive</Text>
                  ) : (
                    <Text style={styles.name}>
                      {
                        JSON.parse(
                          "[" + item.NativeStatuses.replace(/'/g, '"') + "]"
                        )[0]?.Type
                      }
                    </Text>
                  )}
                </View>
                <View>
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={"#ffffff5A"}
                  />
                </View>
              </View>
            </Pressable>
          )}
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
  card: {
    backgroundColor: "#0B2424",
    // borderRadius: 4,
    marginBottom: 8,
    // marginHorizontal: 16,
    overflow: "hidden",
    flex: 1,
    padding: 24,
  },
  CardContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  cardInnerContainer: {
    flex: 1,
  },
  TextContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 8,
  },
  image: {
    height: 64,
    width: 64,
    borderRadius: 12,
  },
  placeholder: {
    backgroundColor: "#2B4040", // or any fallback color
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 12,
  },
  topText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
    opacity: 0.5,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flexWrap: "wrap",
    maxWidth: 150,
    textTransform: "capitalize",
  },
  label: {
    marginTop: 4,
    color: "red",
    fontWeight: "bold",
    fontSize: 14,
  },
});
