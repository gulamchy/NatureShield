// Components/CameraPreview.js
import { CameraView } from "expo-camera";
import { View, Text, Pressable, SafeAreaView, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function CameraPreview({
  refProp,
  zoom,
  setZoom,
  flash,
  toggleFlash,
  takePicture,
  navigation,
}) {
  return (
    <CameraView
      style={styles.container}
      ref={refProp}
      mode="picture"
      facing="back"
      zoom={zoom}
      flash={flash}
    >
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.cancelContainer}>
          <Pressable
            style={styles.cancelArea}
            onPress={() => navigation.navigate("IdentifyMain")}
          >
            <Ionicons name="close" style={styles.iconStyle} size={24} />
          </Pressable>
        </View>

        <View style={styles.sliderContainer}>
          <Text style={{ color: "white" }}>0x</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={zoom}
            onValueChange={setZoom}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="rgba(0, 0, 0, 0.3)"
          />
          <Text style={{ color: "white" }}>10x</Text>
        </View>

        <View style={styles.shutterContainer}>
          <View style={styles.iconContainer}>
            <Pressable onPress={toggleFlash}>
              <MaterialIcons
                name={flash === "off" ? "flash-off" : "flash-on"}
                size={32}
                color="white"
              />
            </Pressable>
          </View>

          <View style={styles.iconContainer}>
            <Pressable onPress={takePicture}>
              {({ pressed }) => (
                <View
                  style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}
                >
                  <View
                    style={[
                      styles.shutterBtnInner,
                      { backgroundColor: "white" },
                    ]}
                  />
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.iconContainer}></View>
        </View>
      </SafeAreaView>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
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
  iconStyle: { color: "#fff", opacity: 1 },
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
  shutterBtnInner: { width: 64, height: 64, borderRadius: 32 },
});
