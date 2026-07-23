import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { API_BASE_URL } from "../config/apiConfig";

export default function OtpVerifyScreen({ route, navigation }) {
  const { confirmation, name, phone } = route.params;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (code.trim().length < 4) {
      Alert.alert("Enter the OTP", "Please enter the code you received.");
      return;
    }
    setLoading(true);
    try {
      const result = await confirmation.confirm(code.trim());
      const idToken = await result.user.getIdToken();

      // Register / upsert the profile on our backend (stores name + phone in Firestore)
      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, name, phone }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.log("Backend register error:", errText);
        // Non-fatal: user is still authenticated with Firebase even if backend save fails.
      }

      // AuthContext's onAuthStateChanged listener will pick up the signed-in user
      // and the navigator will automatically switch to the Home stack.
    } catch (error) {
      console.log(error);
      Alert.alert("Verification failed", error.message || "Invalid code, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the code sent to {phone}</Text>

      <TextInput
        style={styles.input}
        placeholder="6-digit code"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={verify} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify & Continue</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
        <Text style={{ color: "#5B2A86" }}>Change phone number</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 26, fontWeight: "800", color: "#5B2A86", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 20,
    letterSpacing: 6,
    width: "100%",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#5B2A86",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
    width: "100%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
