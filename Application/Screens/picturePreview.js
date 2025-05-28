// Components/PicturePreview.js
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../Components/customHeader";
import ResultScreen from "./resultScreen";
import axios from "axios";

import * as ImageManipulator from "expo-image-manipulator";
import { Image as RNImage, Platform } from "react-native";

export default function PicturePreview() {
  const backendIp = process.env.EXPO_PUBLIC_BACKEND_IP;
  const backendPort = process.env.EXPO_PUBLIC_BACKEND_PORT;

  const navigation = useNavigation();

  const route = useRoute();
  const uri = route?.params?.uri;
  const newPath = route?.params?.newPath;
  const url_plant = `http://${backendIp}:${backendPort}/analyze`;


  // const uploadToServer = async (localUri) => {
  //   try {
  //     const filename = localUri.split("/").pop();
  //     const type = "image/jpeg"; // or use mime.lookup(filename)

  //     const formData = new FormData();
  //     formData.append("image", {
  //       uri: localUri,
  //       name: filename,
  //       type,
  //     });
  //     formData.append("category", "plants"); // hardcoded category
  //     // ${process.env.EXPO_PUBLIC_BACKEND_IP}:
  //     const response = await fetch("http://10.111.173.150:5001/analyze", {
  //       method: "POST",
  //       body: formData,
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     const data = await response.json();

  //     console.log("Server response:", data);
  //     navigation.navigate("ResultScreen", {
  //       uri: uri, // original image URI
  //       newPath: newPath, // local file path, if needed
  //       scientificName: data.scientific_name, // adapt key name if different
  //     });
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     alert("Failed to upload: " + error.message);
  //   }
  // };

  // const uploadToServer = async (localUri) => {
  //   try {
  //     const filename = localUri.split("/").pop();
  //     const type = "image/jpeg"; // You can use 'mime' package for dynamic detection if needed

  //     const formData = new FormData();
  //     formData.append("image", {
  //       uri: localUri,
  //       name: filename,
  //       type,
  //     });

  //     const response = await fetch("http://10.111.173.150:5001/analyze", {
  //       method: "POST",
  //       body: formData,
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     const data = await response.json();
  //     console.log("Server response:", data);

  //     navigation.navigate("ResultScreen", {
  //       uri: uri,
  //       newPath: newPath,
  //       scientificName: data.scientific_name,
  //       isInvasive: data.invasive,
  //     });
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     alert("Upload failed: " + error.message);
  //   }
  // };

// Google Cloud Vision Server

  const uploadToServer = async (localUri) => {
    try {
      // Step 1: Get image dimensions to check width
      // const { width, height } = await new Promise((resolve, reject) => {
      //   // react-native built-in method
      //   RNImage.getSize(
      //     localUri,
      //     (w, h) => resolve({ width: w, height: h }),
      //     (error) => reject(error)
      //   );
      // });

      // let resizedUri = localUri;

      // Step 2: Resize if width > 500 px, keep aspect ratio
      // if (width > 500) {
      //   const newHeight = Math.floor((500 * height) / width);

      //   const resizedResult = await ImageManipulator.manipulateAsync(
      //     localUri,
      //     [{ resize: { width: 500, height: newHeight } }],
      //     { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      //   );
      //   resizedUri = resizedResult.uri;
      // }
      const filename = localUri.split("/").pop();
      const type = "image/jpeg"; // or use mime.lookup(filename)

      const formData = new FormData();
      formData.append("image", {
        uri: localUri,
        name: filename,
        type,
      });

      // const filename = resizedUri.split("/").pop();
      // const type = "image/jpeg";

      // const formData = new FormData();
      // formData.append("image", {
      //   uri:
      //     Platform.OS === "ios"
      //       ? resizedUri.replace("file://", "")
      //       : resizedUri,
      //   name: filename,
      //   type,
      // });

      const response = await fetch("http://10.111.173.150:5001/analyze", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      console.log("Server response:", data);

      navigation.navigate("ResultScreen", {
        uri: uri, // original image URI
        newPath: newPath, // local file path, if needed
        scientificName: data.scientific_name,
        isInvasive: data.invasive,
        confidence: data.confidence_percent,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + error.message);
    }
  };

// Plant.ID Server
//   const uploadToServer = async (localUri) => {
//   try {
//     const filename = localUri.split("/").pop();
//     const type = "image/jpeg";

//     const formData = new FormData();
//     formData.append("image", {
//       uri:
//         Platform.OS === "ios"
//           ? localUri.replace("file://", "")
//           : localUri,
//       name: filename,
//       type,
//     });

//     const response = await fetch(url_plant, {
//       method: "POST",
//       body: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     const data = await response.json();
//     console.log("Server response:", data);

//     navigation.navigate("ResultScreen", {
//       uri: localUri,
//       newPath: localUri,
//       scientificName: data.scientific_name,
//       isInvasive: data.invasive,
//       confidence: data.confidence_percent,
//     });
//   } catch (error) {
//     console.error("Upload failed:", error);
//     alert("Upload failed: " + error.message);
//   }
// };



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

          <SafeAreaView style={styles.infoContainer}>
            <Text style={styles.infoText}>Upload or Take Picture Again</Text>

            <View style={styles.botomContent}>
              <View style={styles.buttonContainer}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={[styles.button, { backgroundColor: "transparent" }]}
                >
                  <Text style={styles.buttonText}>Take Again</Text>
                </Pressable>
                <Pressable
                  onPress={() => uploadToServer(newPath)}
                  style={[styles.button, { backgroundColor: "#ffffff1A" }]}
                >
                  <Text style={styles.buttonText}>Check Status</Text>
                </Pressable>
              </View>

              <View style={styles.stepContainer}>
                <Text style={styles.stepText}>Step 1 out of 3</Text>
                <View style={styles.stepCircle}>
                  <View
                    style={[styles.circle, { backgroundColor: "#ffffff" }]}
                  ></View>
                  <View
                    style={[styles.circle, { backgroundColor: "#ffffff1A" }]}
                  ></View>
                  <View
                    style={[styles.circle, { backgroundColor: "#ffffff1A" }]}
                  ></View>
                </View>
              </View>
            </View>
          </SafeAreaView>
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
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
  },
  image: {
    flex: 1,
    // width: "100%",
    aspectRatio: 1,
    contentFit: "cover",
    borderRadius: 16,
  },
  infoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.6,
  },
  botomContent: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 32,
    gap: 32,
  },
  buttonContainer: {
    flexDirection: "row",
    borderRadius: 28,
    alignItems: "center",
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
