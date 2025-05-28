import CustomHeader from "../Components/customHeader";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const Identify = (props) => {
  const [image, setImage] = useState(null);
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const navigation = useNavigation();
  useEffect(() => {}, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        <CustomHeader
          title="Identify"
          icons={["warning", "information-circle"]}
          onIconPress={{
            warning: () => alert("Warning Pressed"),
            "information-circle": () => alert("Info Pressed"),
          }}
        />

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.buttonArea}
            onPress={() => navigation.navigate("CameraScreen")}
          >
            <Ionicons name="camera" size={36} style={styles.icon} />
            <Text style={styles.iconText}>Open Camera</Text>
          </Pressable>
          <Pressable
            style={styles.buttonArea}
            onPress={() => pickImage(navigation)}
          >
            <Ionicons name="image" size={36} style={styles.icon} />
            <Text style={styles.iconText}>Open Gallery</Text>
          </Pressable>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.headerText}>Instructions</Text>
          <FlatList
            data={[
              { key: "Image Size should be 10MB" },
              { key: "Put the species in focus" },
              { key: "Upload jpg or jpeg format only" },
            ]}
            renderItem={({ item }) => (
              <Text style={styles.item}>{item.key}</Text>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Identify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#001A1A",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
    margin: 32,
  },
  buttonArea: {
    flex: 1,
    backgroundColor: "#073232",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  icon: {
    color: "#408080",
  },
  iconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    // opacity: 0.7,
  },
  instructionContainer: {
    flex: 3,
    marginHorizontal: 32,
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
  item: {
    // padding: 10,
    fontSize: 16,
    height: 32,
    color: "#fff",
    opacity: 0.7,
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 4,
  },
});
