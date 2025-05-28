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

export default function ResultScreen() {
  const navigation = useNavigation();

  const route = useRoute();
  const uri = route?.params?.uri;
  const newPath = route?.params?.newPath;
  const scientificName = route?.params?.scientificName;
  const isInvasive = route?.params?.isInvasive;
  const confidence = route?.params?.confidence;
  const [locationTimeInfo, setLocationTimeInfo] = useState(null);
  // const location = "";
  // const date = "";
  console.log(isInvasive);
  console.log(confidence);
  useEffect(() => {
    (async () => {
      const info = await getReadableLocationAndTime();
      if (info) {
        setLocationTimeInfo(info);
      }
    })();
  }, []);

  // console.log(locationTimeInfo?.locationName);
  // console.log(locationTimeInfo?.timestamp);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.wrapper}>
        <CustomHeader
          title="Identify"
          icons={["warning", "information-circle"]}
          onIconPress={{
            warning: () => alert("Warning Pressed"),
            "information-circle": () => alert("Info Pressed"),
          }}
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
            <ScrollView style={styles.scrollInfoContainer}>
              <View style={styles.infoInnerContainer}>
                <View style={styles.nameContent}>
                  <Text style={styles.headerText}>Likely</Text>
                  <View style={styles.namePercentageContent}>
                    <Text style={styles.infoTextHeader}>{scientificName}</Text>
                    <Text style={styles.percentageContent}>{confidence}%</Text>
                  </View>
                </View>

                <View style={styles.nameContent}>
                  <Text style={styles.headerText}>Learn About Species</Text>
                  <Text style={styles.textDetails}>
                    The common starling, also known simply as the starling in
                    Great Britain and Ireland, and as European starling in North
                    America.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.botomContent}>
              <View style={styles.buttonContainer}>
                <Pressable
                  onPress={() => navigation.navigate("IdentifyMain")}
                  style={[styles.button, { backgroundColor: "transparent" }]}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    navigation.navigate("ResultReport", {
                      uri: uri, // original image URI
                      newPath: newPath, // local file path, if needed
                      scientificName: scientificName, // adapt key name if different
                      location: locationTimeInfo?.locationName || "",
                      date: locationTimeInfo?.timestamp || "",
                    })
                  }
                  style={[styles.button, { backgroundColor: "#ffffff1A" }]}
                >
                  <Text style={styles.buttonText}>Report Plant</Text>
                </Pressable>
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
      </View>

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
    paddingHorizontal: 16,
    gap: 16,
  },
  contentContainer: { flex: 1, gap: 32 },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    marginVertical: 16,
  },
  image: {
    flex: 1,
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
    marginBottom: 32,
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
