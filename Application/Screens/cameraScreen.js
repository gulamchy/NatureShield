import {
  Camera,
  CameraView,
  useCameraPermissions,
  CameraType,
} from "expo-camera";
import { useRef, useState, useContext } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { AuthContext } from "../authContext";
import { useNavigation } from "@react-navigation/native";
import CameraPreview from "../Components/cameraPreviewComponent";

export default function CameraScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const ref = useRef(null);
  const [uri, setUri] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [flash, setFlash] = useState("off");
  const { clickCamera, countClick } = useContext(AuthContext);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button
          onPress={() => {
            requestPermission();
            requestMediaPermission();
          }}
          title="Grant permission"
        />
      </View>
    );
  }
  if (!mediaPermission?.granted) {
    requestMediaPermission();
  }

  const toggleFlash = () => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  };

  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync();
      if (!photo?.uri) return;

      setUri(photo.uri);

      const asset = await MediaLibrary.createAssetAsync(photo.uri);

      const filename = photo.uri.split("/").pop();
      const newPath = FileSystem.documentDirectory + filename;

      await FileSystem.copyAsync({
        from: photo.uri,
        to: newPath,
      });

      navigation.navigate("PicturePreview", { uri: photo.uri });
      clickCamera();
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };
  //   return (
  //     <CameraView
  //       style={styles.container}
  //       ref={ref}
  //       mode="picture"
  //       facing="back"
  //       zoom={zoom}
  //       flash={flash}
  //     >
  //       <SafeAreaView style={styles.contentContainer}>
  //         <View style={styles.cancelContainer}>
  //           <Pressable
  //             style={styles.cancelArea}
  //             onPress={() => navigation.navigate("IdentifyMain")}
  //           >
  //             <Ionicons name="close" style={styles.iconStyle} size={24} />
  //           </Pressable>
  //         </View>

  //         <View style={styles.sliderContainer}>
  //           <Text style={{ color: "white" }}>0x</Text>
  //           <Slider
  //             style={{ width: 200, height: 40 }}
  //             minimumValue={0}
  //             maximumValue={1}
  //             step={0.01}
  //             value={zoom}
  //             onValueChange={setZoom}
  //             minimumTrackTintColor="#FFFFFF"
  //             maximumTrackTintColor="rgba(0, 0, 0, 0.3)"
  //           />
  //           <Text style={{ color: "white" }}>10x</Text>
  //         </View>

  //         <View style={styles.shutterContainer}>
  //           <View style={styles.iconContainer}>
  //             <Pressable onPress={toggleFlash}>
  //               <MaterialIcons
  //                 name={flash === "off" ? "flash-off" : "flash-on"}
  //                 size={32}
  //                 color="white"
  //               />
  //             </Pressable>
  //           </View>

  //           <View style={styles.iconContainer}>
  //             <Pressable onPress={takePicture}>
  //               {({ pressed }) => (
  //                 <View
  //                   style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}
  //                 >
  //                   <View
  //                     style={[
  //                       styles.shutterBtnInner,
  //                       { backgroundColor: "white" },
  //                     ]}
  //                   />
  //                 </View>
  //               )}
  //             </Pressable>
  //           </View>
  //           <View style={styles.iconContainer}></View>
  //         </View>
  //       </SafeAreaView>
  //     </CameraView>
  //   );
  // };

  return (
    <View style={styles.container}>
      <CameraPreview
        refProp={ref}
        zoom={zoom}
        setZoom={setZoom}
        flash={flash}
        toggleFlash={toggleFlash}
        takePicture={takePicture}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    marginBottom: 64,
    width: "100%",
    justifyContent: "flex-end",
  },
  cancelContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flex: 1,
    margin: 32,
  },
  cancelArea: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyle: {
    color: "#fff",
    opacity: 1,
  },
  sliderContainer: {
    alignItems: "center",
    marginBottom: 32,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  shutterContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
