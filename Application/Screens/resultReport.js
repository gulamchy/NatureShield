import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../Components/customHeader";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { AuthContext } from "../authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MailComposer from "expo-mail-composer";

export default function ResultReport() {
  const navigation = useNavigation();

  const backendIp = process.env.EXPO_PUBLIC_BACKEND_IP;
  const backendPort = process.env.EXPO_PUBLIC_BACKEND_PORT;
  const EmailAddress = process.env.EXPO_PUBLIC_RECEIVER_EMAIL;
  const url = `http://${backendIp}:${backendPort}`;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  const uri = route?.params?.uri;
  const newPath = route?.params?.newPath;
  const scientificName = route?.params?.scientificName;
  const isInvasive = route?.params?.isInvasive;
  const confidence = route?.params?.confidence;
  const location = route?.params?.location;
  const date = route?.params?.date;

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      // setUserData(null);
    }, [])
  );

  const handleReportDone = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      setLoading(true);
      const res = await axios.post(`${url}/profile`, { token });
      const user = res.data.data;
      setUserData(user);

      const userId = user._id;
      const formData = new FormData();

      formData.append("name", scientificName || "Unknown plant");
      formData.append("date", date);

      if (uri) {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists) {
          formData.append("image", {
            uri,
            name: `${
              scientificName?.replace(/\s+/g, "_") || "plant"
            }_${Date.now()}.jpg`,
            type: "image/jpeg",
          });
        }
      }

      const response = await axios.post(`${url}/report/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // alert("Report submitted successfully!");
        sendReportEmail({
          imageUri: uri,
          scientificName: scientificName,
          time: new Date().toLocaleString(),
          location: location,
        });

        navigation.navigate("Reports");
      } else {
        alert("Failed to submit report");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting report");
    }
  };

  const sendReportEmail = async ({
    imageUri,
    scientificName,
    time,
    location,
  }) => {
    const emailBody = `
    Hi, 
    We are from NatureShield. We have built an application that identifies invasive species near certain location of our users. Below is their reports. 
    
    Species Report:

    Scientific Name: ${scientificName}
    Time: ${time}
    Location: ${location}

    Please find the image attached.
  `;

    const options = {
      recipients: [EmailAddress],
      subject: `Species Report: for ${scientificName}`,
      body: emailBody,
      attachments: [imageUri], // imageUri should be a local file URI or base64
      isHtml: false,
    };

    const canCompose = await MailComposer.isAvailableAsync();
    if (!canCompose) {
      alert("Email client is not available on this device");
      return;
    }

    try {
      await MailComposer.composeAsync(options);
    } catch (err) {
      console.error("Failed to open mail composer", err);
    }
  };

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
            Submitting Report...
          </Text>
        </View>
      </>
    );
  }

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
                        backgroundColor: isInvasive ? "#F872342A" : "#54AF892A",
                        borderColor: isInvasive ? "#F87234" : "#54AF89",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.invasiveText,
                        { color: isInvasive ? "#F87234" : "#54AF89" },
                      ]}
                    >
                      {isInvasive ? "Invasive" : "Non-Invasive"}
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
                  <Text style={styles.headerText}>Location</Text>
                  <Text style={styles.textDetails}>{location}</Text>
                </View>

                <View style={styles.nameContent}>
                  <Text style={styles.headerText}>Date</Text>
                  <Text style={styles.textDetails}>{date}</Text>
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
                {isInvasive ? (
                  <Pressable
                    onPress={handleReportDone}
                    style={[styles.button, { backgroundColor: "#ffffff1A" }]}
                  >
                    <Text style={styles.buttonText}>Report</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => navigation.navigate("IdentifyMain")}
                    style={[styles.button, { backgroundColor: "#ffffff1A" }]}
                  >
                    <Text style={styles.buttonText}>Done</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.stepContainer}>
                <Text style={styles.stepText}>Step 3 out of 3</Text>
                <View style={styles.stepCircle}>
                  <View
                    style={[styles.circle, { backgroundColor: "#ffffff1A" }]}
                  ></View>
                  <View
                    style={[styles.circle, { backgroundColor: "#ffffff1A" }]}
                  ></View>
                  <View
                    style={[styles.circle, { backgroundColor: "#ffffff" }]}
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
    marginBottom: 32,
    gap: 32,
    // alignItems: "center",
  },
  buttonContainer: {
    fles: 1,
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
