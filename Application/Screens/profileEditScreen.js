import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function ProfileEditScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const userData = route?.params?.userData || {};
  const profileData = route?.params?.profileData || {};
  const userId = userData._id;

  const backendIp = process.env.EXPO_PUBLIC_BACKEND_IP;
  const backendPort = process.env.EXPO_PUBLIC_BACKEND_PORT;
  const url = `http://${backendIp}:${backendPort}/profile/${userId}`;

  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhone = (text) => {
    setPhone(text);
  };

  useEffect(() => {
    if (profileData?.bio) {
      setBio(profileData.bio);
    }
    if (profileData?.location) {
      setLocation(profileData.location);
    }
    if (profileData?.phone) {
      setPhone(profileData.phone);
    }
  }, [profileData]);

  const isEdited =
    bio !== (profileData.bio || "") ||
    location !== (profileData.location || "") ||
    phone !== (profileData.phone || "") ||
    imageUri !== "";
  const handleBio = (text) => {
    setBio(text);
  };

  const handleLocation = (text) => {
    setLocation(text);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: false });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (imageUri) {
        formData.append("image", {
          uri: imageUri,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("existingImage", profileData.image || "");
      }

      formData.append("phone", phone);
      formData.append("bio", bio);
      formData.append("location", location);
      formData.append("name", userData.name || "");
      formData.append("email", userData.email || "");

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        // Alert.alert("Profile updated!");
        navigation.goBack();
      }
    } catch (err) {
      console.log("Error uploading profile:", err.message);
      Alert.alert("Upload failed", err.message);
    }
  };

  if (loading) {
    return (
      <>
        <StatusBar style="dark" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F2FFFF",
          }}
        >
          <ActivityIndicator size="large" color="#00aa00" />
          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "700" }}>
            Updating Profile...
          </Text>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.cancelContainer}>
              <Pressable style={styles.cancelArea} onPress={() => navigation.navigate("ProfileScreen")}>
                <Ionicons name="close" style={styles.iconStyle} size={24} />
              </Pressable>
            </View>

            <View style={styles.formArea}>
              <View style={styles.textContainer}>
                {imageUri || profileData?.image ? (
                  <Image
                    source={{ uri: imageUri || profileData?.image }}
                    style={styles.image}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image" size={32} color="#ffffff7A" />
                  </View>
                )}
                <Text style={styles.subTitle}>
                  Upload your image in jpg format
                </Text>
                <Pressable
                  style={styles.buttonArea}
                  onPress={() => pickImage(navigation)}
                >
                  <Text style={styles.iconText}>Open Gallery</Text>
                </Pressable>
              </View>

              <View style={styles.nameContent}>
                <View style={styles.sectionBox}>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.headerText}>Personal Information</Text>
                  </View>
                  <View style={styles.sectionContainer}>
                    <Ionicons name="person" size={16} color="#3E7272" />
                    <View style={styles.infoContainer}>
                      <Text style={styles.textHeader}>Bio</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder={"write something about you"}
                          placeholderTextColor="#8CA0A0"
                          value={bio}
                          onChangeText={handleBio}
                          autoCapitalize="none"
                          autoCorrect={false}
                          multiline
                          textAlignVertical="top"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.sectionContainer}>
                    <Ionicons name="compass" size={16} color="#3E7272" />
                    <View style={styles.infoContainer}>
                      <Text style={styles.textHeader}>Location</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your location"
                          placeholderTextColor="#8CA0A0"
                          value={location}
                          onChangeText={handleLocation}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.sectionBox}>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.headerText}>Contact Information</Text>
                  </View>
                  <View style={styles.sectionContainer}>
                    <Ionicons name="call" size={16} color="#3E7272" />
                    <View style={styles.infoContainer}>
                      <Text style={styles.textHeader}>Cell Number</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your cell number"
                          placeholderTextColor="#8CA0A0"
                          value={phone}
                          onChangeText={handlePhone}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                disabled={!isEdited}
                style={[
                  styles.button,
                  { backgroundColor: isEdited ? "#00221B" : "#00221B1A" },
                ]}
                onPress={handleSubmit}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: isEdited ? "#FFFFFF" : "#00221B" },
                  ]}
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FFFF",
  },
  formContainer: {
    backgroundColor: "#EFFFFA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 64,
    margin: 24,
    // marginTop: 64,
  },
  formArea: {},
  cancelContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  cancelArea: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0000001A",
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyle: {
    color: "#408080",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 8,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0B2424",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8FB2B2",
  },
  buttonArea: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 32,
    // margin: 32,
    borderRadius: 100,
    backgroundColor: "#E0F7F1",
  },
  iconText: {
    color: "#00221B",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
  },
  nameContent: {
    gap: 32,
    marginTop: 32,
    // marginRight: 16,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8FB2B2",
    textTransform: "uppercase",
  },
  textDetails: {
    fontSize: 16,
    flexWrap: "wrap",
    fontWeight: "500",
    lineHeight: 28,
  },
  textHeader: {
    fontSize: 16,
    flexWrap: "wrap",
    fontWeight: "500",
    color: "#3E7272",
  },
  sectionBox: {},
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  sectionContainer: {
    flexDirection: "row",
    gap: 8,
    margin: 8,
    paddingLeft: 16,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F7F1",
    padding: 28,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    flexWrap: "wrap",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#00221B",
    paddingVertical: 28,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInText: {
    textAlign: "center",
    color: "#777",
    fontSize: 14,
  },
  signInLink: {
    color: "#555",
    fontWeight: "bold",
  },
  icon: {
    color: "#408080",
  },
});
