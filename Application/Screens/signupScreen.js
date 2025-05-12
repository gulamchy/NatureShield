import React, { useState } from "react";
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
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function SignUpScreen({ ipAddress }) {
  const backendIp = process.env.EXPO_PUBLIC_BACKEND_IP;
  const backendPort = process.env.EXPO_PUBLIC_BACKEND_PORT;

  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [nameVarify, setNameVarify] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVarify, setEmailVarify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVarify, setPasswordVarify] = useState(false);

  const url = `http://${backendIp}:${backendPort}/signup`;

  const handleName = (text) => {
    setName(text);
    setNameVarify(text.length > 5);
  };

  const handleEmail = (text) => {
    setEmail(text);
    setEmailVarify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(text));
  };

  const handlePassword = (text) => {
    setPassword(text);
    setPasswordVarify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(text));
  };

  const handleSubmit = () => {
    const userData = { name, email, password };

    if (nameVarify && emailVarify && passwordVarify) {
      axios
        .post(url, userData)
        .then((res) => {
          console.log(res.data);

          // Clear input fields
          setName("");
          setEmail("");
          setPassword("");
          setNameVarify(false);
          setEmailVarify(false);
          setPasswordVarify(false);
          if (res.data.status == "Ok") {
            Alert.alert("Registration Successful", "You can now log in.");

            navigation.navigate("login");
          } else {
            Alert.alert(JSON.stringify(res.data));
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log("Response error:", error.response.data);
          } else if (error.request) {
            console.log("Request error:", error.request);
          } else {
            console.log("General error:", error.message);
          }
        });
    } else {
      alert("Fill mandatory details");
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
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView style={styles.headerText}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Sign up to Join the community</Text>
          </SafeAreaView>

          <View style={styles.formContainer}>
            <View style={styles.formArea}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#8CA0A0"
                  value={name}
                  onChangeText={handleName}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {name.length < 1 ? null : nameVarify ? (
                  <Feather name="check-circle" color="green" size={16} />
                ) : (
                  <Feather name="x-circle" color="red" size={16} />
                )}
              </View>
              {name.length < 1 ? null : nameVarify ? null : (
                <Text style={{ marginBottom: 16, color: "red" }}>
                  Name should be more than 5 characters
                </Text>
              )}

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
                  secureTextEntry
                  value={password}
                  onChangeText={handlePassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {password.length < 1 ? null : passwordVarify ? (
                  <Feather name="check-circle" color="green" size={16} />
                ) : (
                  <Feather name="x-circle" color="red" size={16} />
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
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              <Text style={styles.signInText}>
                Have an account?{" "}
                <Text
                  style={styles.signInLink}
                  onPress={() => {
                    navigation.navigate("login");
                  }}
                >
                  Sign In
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
