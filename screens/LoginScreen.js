import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";

// Écran de connexion (email / mot de passe)
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const { theme } = useTheme();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Image source={require("../assets/cinetrack.png")} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.title, { color: theme.text }]}>CineTrack</Text>
        <Text style={[styles.subtitle, { color: theme.border }]}>
          Connectez-vous pour continuer
        </Text>

        <View style={[styles.inputRow, { borderColor: theme.border }]}>
          <MaterialIcons
            name="email"
            size={20}
            color={theme.border}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.border}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputRow, { borderColor: theme.border }]}>
          <MaterialIcons
            name="lock"
            size={20}
            color={theme.border}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor={theme.border}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={{ marginTop: 8 }}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <PrimaryButton title="Se connecter" onPress={handleLogin} />
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 12 }}
        >
          <Text style={[styles.link, { color: theme.primary }]}>
            Créer un compte
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: "center",
      backgroundColor: theme.background,
    },
    card: {
      marginHorizontal: 12,
      padding: 20,
      borderRadius: 14,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 4,
    },
    logo: { width: 220, height: 90, alignSelf: "center", marginBottom: 12 },
    subtitle: { fontSize: 13, textAlign: "center", marginBottom: 12 },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      marginBottom: 10,
    },
    input: { flex: 1, color: theme.text },
    error: { color: "#ff6b6b", marginBottom: 8, textAlign: "center" },
    link: { textAlign: "center", fontWeight: "600" },
  });
}

