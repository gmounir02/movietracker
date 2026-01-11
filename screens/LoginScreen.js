import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

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
      <Text style={styles.title}>MovieTracker — Connexion</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.border}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor={theme.border}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <PrimaryButton title="Se connecter" onPress={handleLogin} />
      )}
      <View style={{ height: 12 }} />
      <PrimaryButton
        title="Créer un compte"
        onPress={() => navigation.navigate("Register")}
      />
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
    title: {
      fontSize: 20,
      marginBottom: 12,
      textAlign: "center",
      color: theme.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      padding: 8,
      marginBottom: 8,
      borderRadius: 6,
      color: theme.text,
    },
    error: { color: "red", marginBottom: 8 },
  });
}
