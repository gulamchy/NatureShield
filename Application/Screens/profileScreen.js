import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../authContext";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const backendIp = process.env.EXPO_PUBLIC_BACKEND_IP;
  const backendPort = process.env.EXPO_PUBLIC_BACKEND_PORT;
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const url = `http://${backendIp}:${backendPort}/profile`;
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("cachedUser");
    await AsyncStorage.removeItem("cachedProfile");
    logout();
  };

  // useEffect(() => {
  //   const fetchUserAndProfile = async () => {
  //     const token = await AsyncStorage.getItem("token");

  //     try {
  //       setLoading(true)
  //       const res = await axios.post(url, { token });
  //       const user = res.data.data;
  //       setUserData(user);

  //       const profileRes = await axios.get(`${url}/${user._id}`);
  //       const profile = profileRes.data;
  //       setProfileData(profile);
  //       setLoading(false)
  //     } catch (err) {
  //       console.error(
  //         "Error loading profile screen:",
  //         err.response?.data || err.message
  //       );
  //       setUserData(null);
  //       setProfileData(null);
  //     }
  //   };

  //   if (isFocused) {
  //     fetchUserAndProfile();
  //   }
  // }, [isFocused]);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const token = await AsyncStorage.getItem("token");

      try {
        setLoading(true);

        // Try to load cached data
        const cachedProfile = await AsyncStorage.getItem("cachedProfile");
        const cachedUser = await AsyncStorage.getItem("cachedUser");

        if (cachedProfile && cachedUser) {
          setProfileData(JSON.parse(cachedProfile));
          setUserData(JSON.parse(cachedUser));
          setLoading(false);
          return;
        }

        // Otherwise fetch from server
        const res = await axios.post(url, { token });
        const user = res.data.data;
        setUserData(user);
        await AsyncStorage.setItem("cachedUser", JSON.stringify(user));

        const profileRes = await axios.get(`${url}/${user._id}`);
        const profile = profileRes.data;
        setProfileData(profile);
        await AsyncStorage.setItem("cachedProfile", JSON.stringify(profile));

        setLoading(false);
      } catch (err) {
        console.error(
          "Error loading profile screen:",
          err.response?.data || err.message
        );
        setUserData(null);
        setProfileData(null);
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchUserAndProfile();
    }
  }, [isFocused]);

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
            Fetching Profile...
          </Text>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() =>
                navigation.navigate("ProfileEditScreen", {
                  userData: userData,
                  profileData: profileData,
                })
              }
            >
              <Text style={styles.editButton}>Edit Profile</Text>
            </Pressable>
          </View>

          <View style={styles.textContainer}>
            {profileData?.image ? (
              <Image
                source={{ uri: profileData?.image }}
                style={styles.image}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image" size={32} color="#ffffff7A" />
              </View>
            )}
            <Text style={styles.title}>{userData?.name || "Hi There"}</Text>
            <Text style={styles.subTitle}>{profileData?.location}</Text>
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
                  <Text style={styles.textDetails}>
                    {profileData?.bio || ""}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Ionicons name="compass" size={16} color="#3E7272" />
                <View style={styles.infoContainer}>
                  <Text style={styles.textHeader}>Location</Text>
                  <Text style={styles.textDetails}>
                    {profileData?.location}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionBox}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.headerText}>Contact Information</Text>
              </View>

              <View style={styles.sectionContainer}>
                <Ionicons name="mail" size={16} color="#3E7272" />
                <View style={styles.infoContainer}>
                  <Text style={styles.textHeader}>Email</Text>
                  <Text style={styles.textDetails}>{userData?.email}</Text>
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Ionicons name="call" size={16} color="#3E7272" />
                <View style={styles.infoContainer}>
                  <Text style={styles.textHeader}>Cell Number</Text>
                  <Text style={styles.textDetails}>{profileData?.phone}</Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonBox}>
              <Pressable
                style={styles.buttonInfo}
                onPress={() => navigation.navigate("ProfileEditScreen")}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="play" size={16} color="#3E7272" />
                </View>
                <Text style={styles.textButton}>Tutorials</Text>
              </Pressable>

              <Pressable style={styles.buttonInfo} onPress={handleLogout}>
                <View style={styles.iconBox}>
                  <Ionicons name="log-out" size={16} color="red" />
                </View>
                <Text style={[styles.textButton, { color: "red" }]}>
                  Log out
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FFFF",
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 24,
  },
  editButton: {
    fontSize: 14,
    fontWeight: "700",
    color: "#408080",
    textTransform: "uppercase",
    lineHeight: 16,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 900,
    lineHeight: 32,
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8FB2B2",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 32,
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
  nameContent: {
    gap: 32,
    marginTop: 32,
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
    flexDirection: "column",
    width: "100%",
  },
  buttonBox: {
    flexDirection: "column",
    gap: 32,
  },
  buttonInfo: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "700",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: "#E9FAFA",
    alignItems: "center",
    justifyContent: "center",
  },
});
