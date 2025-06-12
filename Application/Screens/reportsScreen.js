import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  FlatList,
} from "react-native";
import CustomHeader from "../Components/customHeader";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const Report = () => {
  const backendIp = process.env.EXPO_PUBLIC_BACKEND_IP;
  const backendPort = process.env.EXPO_PUBLIC_BACKEND_PORT;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const url = `http://${backendIp}:${backendPort}`;
  const [userData, setUserData] = useState(null);
  const [reportList, setReportList] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchReports = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setUserData(null);
        setReportList([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const cachedReports = await AsyncStorage.getItem("cachedReports");
        if (cachedReports) {
          const cachedData = JSON.parse(cachedReports);
          setReportList(cachedData);
        }

        const res = await axios.post(`${url}/profile`, { token });
        const user = res.data.data;
        setUserData(user);

        const reportRes = await axios.get(`${url}/report/${user._id}`);
        const freshReports = reportRes.data;

        setReportList(freshReports);
        await AsyncStorage.setItem(
          "cachedReports",
          JSON.stringify(freshReports)
        );

        setLoading(false);
      } catch (err) {
        console.error(
          "Error loading reports:",
          err.response?.data || err.message
        );
        setUserData(null);
        setReportList([]);
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchReports();
    }
  }, [isFocused]);

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
            Gathering Reports...
          </Text>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <CustomHeader
        title="Reports"
        icons={["", ""]}
        onIconPress={
          {
            // "search": () => alert("Search pressed"),
            // "add-circle": () => alert("Add pressed"),
          }
        }
      />
      {/* <ScrollView contentContainerStyle={styles.scroll}>
        {reportList.map((report, index) => (
          report &&
          <View style={styles.card} key={index}>
            <ImageBackground
              source={{ uri: report.image }}
              style={styles.imageBackground}
              imageStyle={styles.image}
            >
              <View style={styles.overlay}>
                <View style={styles.textContainer}>
                  <Text style={styles.name}>
                    {report.name || "Unknown Plant"}
                  </Text>
                  <Text style={styles.date}>{report.date || ""}</Text>
                </View>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Reported</Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView> */}
      <FlatList
        data={reportList}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) =>
          item && (
            <View style={styles.card}>
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.imageBackground}
                imageStyle={styles.image}
              >
                <View style={styles.overlay}>
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>
                      {item.name || "Unknown Plant"}
                    </Text>
                    <Text style={styles.date}>{item.date || ""}</Text>
                  </View>
                  <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Reported</Text>
                  </Pressable>
                </View>
              </ImageBackground>
            </View>
          )
        }
        contentContainerStyle={styles.scroll}
      />
    </SafeAreaView>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001A1A",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  imageBackground: {
    height: 180,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: 12,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  textContainer: {
    flexDirection: "column",
    gap: 8,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    color: "#FFFFFF9A",
    fontSize: 14,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#FFFFFF2A",
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#FFFFFF7A",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
