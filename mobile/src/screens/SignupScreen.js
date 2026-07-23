import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth, firebaseConfig } from "../config/firebaseConfig";

export default function SignupScreen({ navigation }) {
  const recaptchaVerifier = useRef(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // digits only, without country code
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your name.");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 6) {
      Alert.alert("Invalid phone number", "Please enter a valid phone number.");
      return;
    }
    const fullPhone = `${countryCode}${digits}`;

    setLoading(true);
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaVerifier.current
      );
      navigation.navigate("OtpVerify", {
        confirmation,
        name: name.trim(),
        phone: fullPhone,
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Failed to send OTP", error.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification
      />

      <Image
        source={require("../assets/logo-mark.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Pallavi</Text>
      <Text style={styles.subtitle}>Sign up with your phone number</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Pallavi Sharma"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneRow}>
          <TextInput
            style={styles.ccInput}
            value={countryCode}
            onChangeText={setCountryCode}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="98765 43210"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={sendOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: { width: 84, height: 84, borderRadius: 20, marginBottom: 12 },
  title: { fontSize: 30, fontWeight: "800", color: "#5B2A86" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24, marginTop: 4 },
  form: { width: "100%" },
  label: { fontSize: 13, color: "#444", marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  phoneRow: { flexDirection: "row" },
  ccInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: 70,
    marginRight: 8,
    fontSize: 16,
  },
  phoneInput: { flex: 1 },
  button: {
    backgroundColor: "#5B2A86",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
