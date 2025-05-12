import CustomHeader from "../Components/customHeader";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";

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
      <View>
        <CustomHeader
          title="Identify"
          icons={["warning", "information-circle"]}
          onIconPress={{
            warning: () => alert("Warning Pressed"),
            "information-circle": () => alert("Info Pressed"),
          }}
        />

        <Button
          title="Open Camera"
          onPress={() => navigation.navigate("CameraScreen")}
        />
        <Button title="Pick Image" onPress={() => pickImage(navigation)} />
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
    // justifyContent: "center",
    // alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
