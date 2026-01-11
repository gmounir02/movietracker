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

// Écran d'inscription (email / mot de passe)
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const { theme } = useTheme();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      await register(firstName.trim(), lastName.trim(), email.trim(), password);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MovieTracker — Inscription</Text>
      <TextInput
        placeholder="Prénom"
        placeholderTextColor={theme.border}
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Nom"
        placeholderTextColor={theme.border}
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
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
        <PrimaryButton title="S'inscrire" onPress={handleRegister} />
      )}
      <View style={{ height: 12 }} />
      <PrimaryButton
        title="Déjà un compte ?"
        onPress={() => navigation.navigate("Login")}
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
