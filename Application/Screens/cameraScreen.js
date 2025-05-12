import {
  CameraView,
  Camera,
  CameraType,
  useCameraPermissions,
} from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  let cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Photo captured:", photo.uri);
        Alert.alert("Photo captured", `Saved to: ${photo.uri}`);
      } catch (e) {
        console.error("Failed to take photo:", e.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
        {/* // <View style={styles.buttonContainer}>
        //   <TouchableOpacity style={styles.button} onPress={takePhoto}>
        //     <Text style={styles.text}>Capture Photo</Text>
        //   </TouchableOpacity>
        // </View> */}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

// import { StatusBar } from "expo-status-bar";
// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   Button,
//   Image,
//   TouchableOpacity,
// } from "react-native";
// import { useEffect, useRef, useState } from "react";
// import { Camera, useCameraPermissions } from "expo-camera";
// import { shareAsync } from "expo-sharing";
// import * as MediaLibrary from "expo-media-library";

// export default function CameraScreen() {
//   let cameraRef = useRef(null);
//   const [photo, setPhoto] = useState();
//   const [permission, requestPermission] = useCameraPermissions();
//   const [hasMediaLibraryPermission, requestMediaLibraryPermission] =
//     MediaLibrary.usePermissions();

//   if (!permission) {
//     return <View />;
//   }
//   useEffect(() => {
//     if (!hasMediaLibraryPermission) {
//       requestMediaLibraryPermission();
//     }
//   }, []);
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to show the camera
//         </Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   let takePic = async () => {
//     let options = {
//       quality: 1,
//       base64: true,
//       exif: false,
//     };

//     let newPhoto = await cameraRef.current.takePictureAsync(options);
//     setPhoto(newPhoto);
//   };

//   if (photo) {
//     let sharePic = () => {
//       shareAsync(photo.uri).then(() => {
//         setPhoto(undefined);
//       });
//     };

//     let savePhoto = () => {
//       MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
//         setPhoto(undefined);
//       });
//     };

//     return (
//       <SafeAreaView style={styles.container}>
//         <Image
//           style={styles.preview}
//           source={{ uri: "data:image/jpg;base64," + photo.base64 }}
//         />
//         <Button title="Share" onPress={sharePic} />
//         {hasMediaLibraryPermission ? (
//           <Button title="Save" onPress={savePhoto} />
//         ) : undefined}
//         <Button title="Discard" onPress={() => setPhoto(undefined)} />
//       </SafeAreaView>
//     );
//   }

//   if (!permission.granted) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to show the camera
//         </Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   function toggleCameraFacing() {
//     setFacing((current) => (current === "back" ? "front" : "back"));
//   }

//   const takePhoto = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         console.log("Photo captured:", photo.uri);
//         Alert.alert("Photo captured", `Saved to: ${photo.uri}`);
//       } catch (e) {
//         console.error("Failed to take photo:", e.message);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Camera style={styles.camera} ref={cameraRef}>
//         {/* <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//             <Text style={styles.text}>Flip Camera</Text>
//           </TouchableOpacity>
//         </View> */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button}>
//             <Button title="Take Pic" onPress={takePic} />
//           </TouchableOpacity>
//         </View>
//       </Camera>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   message: {
//     textAlign: "center",
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "transparent",
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: "flex-end",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
// });
