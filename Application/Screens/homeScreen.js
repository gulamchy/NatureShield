import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import CustomHeader from "../Components/customHeader";
import { useNavigation } from "@react-navigation/native";
import HorizontalSection from "../Components/horizontalSection";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../authContext";
import IconButton from "../Components/iconButton";
import invasiveSpecies from "../species.json";
import InAppBrowser from 'react-native-inappbrowser-reborn';
import * as WebBrowser from 'expo-web-browser';


import Ionicons from "@expo/vector-icons/Ionicons";
// import { LinearGradient } from "expo-linear-gradient";

const Home = (props) => {
  const navigation = useNavigation();
  const { clickCamera, countClick } = useContext(AuthContext);

  const selectedSpecies = useMemo(() => {
    if (!invasiveSpecies || invasiveSpecies.length < 3) return invasiveSpecies;

    const shuffled = [...invasiveSpecies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((item) => ({
      ...item,
      image: item.WikiImage,
      label: item.CommonName,
    }));
  }, [invasiveSpecies]);

//   const openLink = async (url) => {
//   try {
//     if (await InAppBrowser.isAvailable()) {
//       await InAppBrowser.open(url, {
//         // optional customization
//         // tabBarActiveTintColor: "#408080",
//         // tabBarInactiveTintColor: "#99B2B2",
//         dismissButtonStyle: 'cancel',
//         preferredBarTintColor: '#001A1A',
//         preferredControlTintColor: 'white',
//         readerMode: false,
//         animated: true,
//         modalPresentationStyle: 'fullScreen',
//         modalEnabled: true,
//         enableBarCollapsing: true,
//       });
//     } else {
//       // fallback to default browser
//       Linking.openURL(url);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

const openLink = async (url) => {
  const result = await WebBrowser.openBrowserAsync(url);
};


  const sampleOrg = [
    {
      image:
        "https://res.cloudinary.com/dd7rhunty/image/upload/v1748297375/NAISMA_yap0ry.png",
      label: "NAISMA",
      url: "https://naisma.org",
    },
    {
      image:
        "https://res.cloudinary.com/dd7rhunty/image/upload/v1748297333/NAISN_x9goog.png",
      label: "NAISN",
      url: "https://www.naisn.org",
    },
    {
      image:
        "https://res.cloudinary.com/dd7rhunty/image/upload/v1748297333/NPS_jydihj.png",
      label: "NPS",
      url: "https://www.nps.gov/index.htm"
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <CustomHeader
          title="NatureShield"
          // subtitle="Welcome back"
          icons={["", ""]}
          onIconPress={{
            // search: () => alert("Search Pressed"),
            // notifications: () => alert("Notifications Pressed"),
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
                onPress={() => openLink("https://coff.ee/natureshield")}
              />
              <IconButton
                label="More"
                iconName="ellipsis-vertical"
                onPress={() => navigation.navigate("More")}
              />
            </View>
          </View>

          <View style={styles.additionalContent}>

            <HorizontalSection
              title="Species"
              items={selectedSpecies}
              onViewPress={() => navigation.navigate("Species")}
              onItemPress={(item) =>
                navigation.navigate("Species", {
                  screen: "SpeciesIndividual",
                  params: {
                    CommonName: item.CommonName,
                    ScientificName: item.ScientificName,
                    Durations: item.Durations,
                    GrowthHabits: item.GrowthHabits,
                    OtherCommonNames: item.OtherCommonNames,
                    Description: item.WikiDescription,
                    image: item.image,
                    NativeStatus: JSON.parse(
                      "[" + item.NativeStatuses.replace(/'/g, '"') + "]"
                    )[0]?.Type,
                  },
                })
              }
            />

            <HorizontalSection
              title="Organizations"
              items={sampleOrg}
              onItemPress={(item) => openLink(item.url)}
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
    paddingVertical: 16,
    // backgroundColor: "#fff"
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
    paddingBottom: 32,
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
