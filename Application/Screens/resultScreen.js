// Components/PicturePreview.js
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../Components/customHeader";
import { getReadableLocationAndTime } from "../Components/getReadableLocationAndTime";
import { useState, useEffect } from "react";
import ResultReport from "./resultReport";
import axios from "axios";
import speciesData from "../species.json";

export default function ResultScreen() {
  const navigation = useNavigation();

  const route = useRoute();
  const uri = route?.params?.uri;
  const newPath = route?.params?.newPath;
  const scientificName = route?.params?.scientificName;
  const isInvasive = route?.params?.isInvasive;
  const confidence = route?.params?.confidence;
  const [locationTimeInfo, setLocationTimeInfo] = useState(null);
  const [snippet, setSnippet] = useState("");
  const backendIp = process.env.EXPO_PUBLIC_BACKEND_IP;
  const backendPort = process.env.EXPO_PUBLIC_BACKEND_PORT;
  const [finalIsInvasive, setFinalIsInvasive] = useState(false);

  const url = `http://${backendIp}:${backendPort}/extract`;

  const handleSnippet = (name) => {
    axios
      .post(url, { scientificName: name })
      .then((res) => {
        // console.log("Full response:", res.data.snippet);
        setSnippet(res.data.snippet);
      })
      .catch((err) => {
        console.error("Error from backend:", err.response?.data || err.message);
      });
  };

  useEffect(() => {
    if (scientificName) {
      handleSnippet(scientificName);
    }
  }, [scientificName]);

  useEffect(() => {
    (async () => {
      const info = await getReadableLocationAndTime();
      if (info) {
        setLocationTimeInfo(info);
      }
    })();
  }, []);

  useEffect(() => {
    if (route?.params?.isInvasive === true) {
      setFinalIsInvasive(true);
      return;
    }

    if (scientificName) {
      const match = speciesData.find(
        (species) =>
          species.ScientificName?.toLowerCase().trim() ===
          scientificName.toLowerCase().trim()
      );

      if (match?.InvasiveFlag === "Yes") {
        setFinalIsInvasive(true);
      } else {
        setFinalIsInvasive(false);
      }
    }
  }, [route?.params?.isInvasive, scientificName]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.wrapper}>
        <CustomHeader
          title="Identify"
          icons={["", ""]}
          onIconPress={
            {
              // "warning": () => alert("Warning Pressed"),
              // "information-circle": () => alert("Info Pressed"),
            }
          }
        />
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri }}
              contentFit="cover"
              style={[styles.image, { aspectRatio: 1 }]}
            />
          </View>

          <View style={styles.infoContainer}>
            {/* <Text style={styles.infoText}>{scientificName}</Text> */}
            <View style={styles.scrollInfoContainer}>
              <View style={styles.infoInnerContainer}>
                <View style={styles.nameContent}>
                  <View
                    style={[
                      styles.invasiveContainer,
                      {
                        backgroundColor: finalIsInvasive
                          ? "#F872342A"
                          : "#54AF892A",
                        borderColor: finalIsInvasive ? "#F87234" : "#54AF89",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.invasiveText,
                        { color: finalIsInvasive ? "#F87234" : "#54AF89" },
                      ]}
                    >
                      {finalIsInvasive ? "Invasive" : "Non-Invasive"}
                    </Text>
                  </View>
                </View>

                <View style={styles.nameContent}>
                  <Text style={styles.headerText}>Likely</Text>
                  <View style={styles.namePercentageContent}>
                    <Text style={styles.infoTextHeader}>{scientificName}</Text>
                    <Text style={styles.percentageContent}>{confidence}%</Text>
                  </View>
                </View>

                <View style={styles.nameContent}>
                  <Text style={styles.headerText}>Learn About Species</Text>
                  <Text style={styles.textDetails}>{snippet}</Text>
                </View>
              </View>
            </View>

            <View style={styles.botomContent}>
              <View style={styles.buttonContainer}>
                <Pressable
                  onPress={() => navigation.navigate("IdentifyMain")}
                  style={[styles.button, { backgroundColor: "transparent" }]}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                {confidence > 80 ? (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("ResultReport", {
                        uri: uri, // original image URI
                        newPath: newPath, // local file path, if needed
                        scientificName: scientificName, // adapt key name if different
                        isInvasive: finalIsInvasive,
                        confidence: confidence,
                        location: locationTimeInfo?.locationName || "",
                        date: locationTimeInfo?.timestamp || "",
                      })
                    }
                    style={[styles.button, { backgroundColor: "#ffffff1A" }]}
                  >
                    <Text style={styles.buttonText}>Report Plant</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => navigation.navigate("IdentifyMain")}
                    style={[styles.button, { backgroundColor: "#ffffff1A" }]}
                  >
                    <Text style={styles.buttonText}>Take Picture Again</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.stepContainer}>
                <Text style={styles.stepText}>Step 2 out of 3</Text>
                <View style={styles.stepCircle}>
                  <View
                    style={[styles.circle, { backgroundColor: "#ffffff1A" }]}
                  ></View>
                  <View
                    style={[styles.circle, { backgroundColor: "#ffffff" }]}
                  ></View>
                  <View
                    style={[styles.circle, { backgroundColor: "#ffffff1A" }]}
                  ></View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* <Button onPress={onRetake} title="Take another picture" />  backgroundColor: "#ffffff1A", */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: "#001A1A",
  },
  wrapper: {
    flex: 1,
    // paddingHorizontal: 16,
    gap: 16,
  },
  contentContainer: { flex: 1, gap: 32, paddingHorizontal: 16 },
  imageContainer: {
    // flex: 1,
    // width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    marginVertical: 16,
  },
  image: {
    // flex: 1,
    width: 196,
    height: 196,
    aspectRatio: 1,
    contentFit: "cover",
    borderRadius: 16,
  },
  infoContainer: {
    flex: 2,
    justifyContent: "space-between",
  },

  scrollInfoContainer: {
    flex: 1,
  },
  infoInnerContainer: {
    flex: 1,
    gap: 32,
  },
  nameContent: {},
  invasiveContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#F872342A",
    // backgroundColor: "#54AF892A",
    paddingVertical: 20,
    marginHorizontal: 64,
    borderRadius: 100,
    borderWidth: 2,
    // borderColor: "#F87234"
    // borderColor: "#54AF89"
  },
  invasiveText: {
    fontSize: 18,
    fontWeight: "800",
    // color: "#F87234",
    // color: "#54AF89",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.6,
    textTransform: "uppercase",
    lineHeight: 16,
    marginBottom: 16,
  },
  namePercentageContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoTextHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  textDetails: {
    fontSize: 16,
    flexWrap: "wrap",
    // maxwidth: 150,
    fontWeight: "500",
    color: "#fff",
    lineHeight: 28,
  },
  percentageContent: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  botomContent: {
    flex: 1,
    justifyContent: "flex-end",
    marginVertical: 32,
    gap: 32,
    // alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  button: {
    paddingHorizontal: 36,
    paddingVertical: 24,
    borderRadius: 100,
    color: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.6,
  },
  stepCircle: {
    flexDirection: "row",
    gap: 8,
  },
  circle: {
    borderRadius: 100,
    padding: 4,
  },
});
