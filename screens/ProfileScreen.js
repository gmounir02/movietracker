import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import PrimaryButton from "../components/PrimaryButton";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [movieCount, setMovieCount] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (mounted) setProfile(snap.exists() ? snap.data() : null);

        const moviesColl = collection(db, "users", user.uid, "movies");
        const moviesSnap = await getDocs(moviesColl);
        if (mounted) setMovieCount(moviesSnap.size);
      } catch (e) {
        console.warn(e);
      }
    };
    load();
    return () => (mounted = false);
  }, [user]);

  const initials =
    profile?.firstName || profile?.lastName
      ? `${(profile.firstName || "").charAt(0) || ""}${(profile.lastName || "").charAt(0) || ""}`.toUpperCase()
      : (user?.displayName || "").split(" ").map((s) => s?.charAt(0)).join("");

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <View style={[styles.avatar, { backgroundColor: theme.primary + "33" }]}> 
          <Text style={[styles.initials, { color: theme.card }]}>{initials || "U"}</Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}> {profile?.firstName || user?.displayName || "Utilisateur"} {profile?.lastName || ""}</Text>
        <Text style={{ color: theme.border }}>{user?.email}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{movieCount === null ? <ActivityIndicator /> : movieCount}</Text>
            <Text style={{ color: theme.border }}>Mes films</Text>
          </View>
        </View>
        <View style={{ marginTop: 12, width: "100%" }}>
          <PrimaryButton title="Se déconnecter" onPress={logout} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: "center" },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  initials: { fontSize: 32, fontWeight: "700" },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  statsRow: { flexDirection: "row", marginTop: 12 },
  stat: { alignItems: "center", marginHorizontal: 12 },
  statNumber: { fontSize: 18, fontWeight: "700" },
});
