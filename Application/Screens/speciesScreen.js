// import React from "react";
// import { View, Text, StyleSheet, SafeAreaView } from "react-native";
// import CustomHeader from "../Components/customHeader";
// import { StatusBar } from "expo-status-bar";

// const Species = (props) => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="light" />
//       <View style={{ flex: 1 }}>
//         <CustomHeader
//           title="Species"
//           // subtitle="Welcome back"
//           icons={["options", "search", "notifications"]}
//           onIconPress={{
//             options: () => alert("Options Pressed"),
//             search: () => alert("Search Pressed"),
//             notifications: () => alert("Notifications Pressed"),
//           }}
//         />
//         <View style={styles.containerBox}>
//           <View style={styles.orangeContainer}>
//             <Text style={styles.textLabel}>Hi 1</Text>
//           </View>

//           <View style={styles.redContainer}>
//             <Text style={styles.textLabel}>Hi 2</Text>
//           </View>

//           <View style={styles.blueContainer}>
//             <Text style={styles.textLabel}>Hi 3</Text>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Species;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#001A1A",
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#fff",
//     padding: 16,
//   },
//   containerBox: {
//     flex: 1,
//   },
//   orangeContainer: {
//     flex: 1,
//     backgroundColor: "orange",
//   },
//   redContainer: {
//     flex: 1,
//     backgroundColor: "red",
//   },
//   blueContainer: {
//     flex: 1,
//     backgroundColor: "blue",
//   },
//   textLabel: {
//     color: "#fff",
//   },
// });

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import CustomHeader from "../Components/customHeader";
import { StatusBar } from "expo-status-bar";

import invasiveSpecies from "../Components/invasiveSpecies";
import { Ionicons } from "@expo/vector-icons";

const Species = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        <CustomHeader
          title="Species"
          icons={["options", "search", "notifications"]}
          onIconPress={{
            options: () => alert("Options Pressed"),
            search: () => alert("Search Pressed"),
            notifications: () => alert("Notifications Pressed"),
          }}
        />

        <FlatList
          data={invasiveSpecies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => alert(`Pressed on ${item.Name}`)}
            >
              <View style={styles.CardContainer}>
                {/* <Image
                  // source={{ uri: item["Image Address"] }}
                  source={{ uri: item["Image Address"].split(",")[0].trim() }}
                  style={styles.image}
                /> */}
                {item["Image Address"] &&
                item["Image Address"].trim() !== "" ? (
                  <Image
                    source={{
                      uri: item["Image Address"].split(",")[0].trim(),
                    }}
                    style={styles.image}
                  />
                ) : (
                  <View style={[styles.image, styles.placeholder]}>
                    <Ionicons name="image" size={32} color="#ffffff7A" />
                  </View>
                )}

                <View style={styles.TextContainer}>
                  <Text style={styles.topText}>Name</Text>
                  <Text style={styles.name}>{item.Name}</Text>
                </View>

                <View style={styles.TextContainer}>
                  <Text style={styles.topText}>Label</Text>
                  <Text style={styles.name}>Invasive</Text>
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
  },
  label: {
    marginTop: 4,
    color: "red",
    fontWeight: "bold",
    fontSize: 14,
  },
});
