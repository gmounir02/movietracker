import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import PrimaryButton from "../components/PrimaryButton";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Mon profil</Text>
      <Text style={{ color: theme.text, marginTop: 8 }}>
        Email: {user?.email}
      </Text>
      <View style={{ height: 20 }} />
      <PrimaryButton title="Se déconnecter" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700" },
});
