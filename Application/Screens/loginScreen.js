import React, { useState, useContext } from "react";
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
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../authContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function LoginScreen() {
  const backendIp = process.env.EXPO_PUBLIC_BACKEND_IP;
  const backendPort = process.env.EXPO_PUBLIC_BACKEND_PORT;
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailVarify, setEmailVarify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVarify, setPasswordVarify] = useState(false);
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const url = `http://${backendIp}:${backendPort}/login`;

  const handleEmail = (text) => {
    setEmail(text.trim());
    setEmailVarify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(text));
  };

  const handlePassword = (text) => {
    setPassword(text);
    setPasswordVarify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(text));
  };

  // const handleSubmit = () => {
  //   const userData = { email, password };

  //   if (emailVarify && passwordVarify) {
  //     axios
  //       .post(url, userData)
  //       .then((res) => {
  //         console.log(res.data);

  //         // Clear input fields
  //         setEmail("");
  //         setPassword("");
  //         setEmailVarify(false);
  //         setPasswordVarify(false);
  //         if (res.data.status == "Ok") {
  //           // Alert.alert("Login Successful", "Welcome to NatureShield!");
  //           // login(res.data.token);
  //           // // navigation.navigate("mainNavigator");

  //           const token = res.data.token;

  //           // Save token to AsyncStorage
  //           AsyncStorage.setItem("token", token)
  //             .then(() => {
  //               login(token); // Update context
  //               Alert.alert("Login Successful", "Welcome to NatureShield!");
  //               // Optional: Navigate to main screen
  //               // navigation.navigate("mainNavigator");
  //             })
  //             .catch((err) => {
  //               console.error("Failed to save token:", err);
  //               Alert.alert("Error", "Could not save login session.");
  //             });

  //         } else {
  //           Alert.alert(JSON.stringify(res.data));
  //         }
  //       })
  //       .catch((error) => {
  //         if (error.response) {
  //           console.log("Response error:", error.response.data);
  //         } else if (error.request) {
  //           console.log("Request error:", error.request);
  //         } else {
  //           console.log("General error:", error.message);
  //         }
  //       });
  //   } else {
  //     alert("Fill mandatory details");
  //   }
  // };

  const handleSubmit = () => {
    const userData = { email, password };

    if (emailVarify && passwordVarify) {
      axios
        .post(url, userData)
        .then(async (res) => {
          if (res.data.status === "Ok") {
            const token = res.data.token;
            try {
              const decoded = jwtDecode(token);
              const expiryTime = decoded.exp * 1000;
              await login(token, expiryTime);

              setEmail("");
              setPassword("");
              setEmailVarify(false);
              setPasswordVarify(false);

              Alert.alert("Login Successful", "Welcome to NatureShield!");
            } catch (err) {
              console.error("Error decoding token:", err);
              Alert.alert("Login Error", "Failed to process token.");
            }
          } else {
            Alert.alert(
              "Login Failed",
              res.data.message || JSON.stringify(res.data)
            );
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log("Response error:", error.response.data);
            Alert.alert("Error", error.response.data.message || "Server error");
          } else if (error.request) {
            console.log("Request error:", error.request);
            Alert.alert("Error", "Network error or server is unreachable.");
          } else {
            console.log("General error:", error.message);
            Alert.alert("Error", error.message);
          }
        });
    } else {
      Alert.alert("Validation", "Fill mandatory details correctly.");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <SafeAreaView>
          <Text style={styles.logo}>NatureShield</Text>
        </SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={styles.headerText}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              Sign in to view your account information
            </Text>
          </SafeAreaView>

          <View style={styles.formContainer}>
            <View style={styles.formArea}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#8CA0A0"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={handleEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
                {email.length < 1 ? null : emailVarify ? (
                  <Feather name="check-circle" color="green" size={16} />
                ) : (
                  <Feather name="x-circle" color="red" size={16} />
                )}
              </View>
              {email.length < 1 ? null : emailVarify ? null : (
                <Text style={{ marginBottom: 16, color: "red" }}>
                  Email format is invalid
                </Text>
              )}

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#8CA0A0"
                  // secureTextEntry
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {password.length < 1 ? null : passwordVarify ? (
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      color="green"
                      size={16}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      color="red"
                      size={16}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {password.length < 1 ? null : passwordVarify ? null : (
                <Text style={{ marginBottom: 16, color: "red" }}>
                  Password should be at least 6 characters, include one
                  uppercase letter and one number
                </Text>
              )}

              {/* Sign Up Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>

              <Text style={styles.signInText}>
                Don't have an account?{" "}
                <Text
                  style={styles.signInLink}
                  onPress={() => {
                    navigation.navigate("signup");
                  }}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00221B",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    // borderColor: '#fff',
    // borderWidth: 2,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    textAlign: "center",
    paddingBottom: 32,
  },
  headerText: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#70E4CE",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#AAAAAA",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#EFFFFA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 64,
    padding: 44,
    marginTop: 64,
  },
  formArea: {},
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
});
