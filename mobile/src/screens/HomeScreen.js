import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        // Fall back to Firebase auth info if backend record isn't available
        setProfile({ name: user.displayName || "Pallavi User", phone: user.phoneNumber });
      }
    } catch (e) {
      console.log("profile load error", e);
      setProfile({ name: user.displayName || "Pallavi User", phone: user.phoneNumber });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5B2A86" />
      </View>
    );
  }

  // Encoding as a tel: URI means most stock QR scanners / camera apps
  // will directly offer to "Call <number>" when they scan it.
  const qrValue = `tel:${profile?.phone || ""}`;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Image source={require("../assets/logo-mark.png")} style={styles.logo} />
      <Text style={styles.name}>{profile?.name}</Text>
      <Text style={styles.phone}>{profile?.phone}</Text>

      <View style={styles.qrCard}>
        <QRCode
          value={qrValue}
          size={220}
          color="#1a1a1a"
          backgroundColor="#ffffff"
        />
      </View>
      <Text style={styles.hint}>
        Anyone who scans this code can see and dial your number.
      </Text>

      <TouchableOpacity style={styles.signOutButton} onPress={() => signOut(auth)}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  container: { flexGrow: 1, alignItems: "center", padding: 24, backgroundColor: "#fff" },
  logo: { width: 64, height: 64, borderRadius: 16, marginTop: 12, marginBottom: 8 },
  name: { fontSize: 22, fontWeight: "700", color: "#222", marginTop: 8 },
  phone: { fontSize: 15, color: "#666", marginBottom: 24 },
  qrCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  hint: { color: "#888", fontSize: 12, marginTop: 16, textAlign: "center", paddingHorizontal: 20 },
  signOutButton: { marginTop: 36, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10, borderWidth: 1, borderColor: "#5B2A86" },
  signOutText: { color: "#5B2A86", fontWeight: "700" },
});
