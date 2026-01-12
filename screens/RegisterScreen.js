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
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Image source={require("../assets/cinetrack.png")} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.title, { color: theme.text }]}> 
          Créer un compte
        </Text>
        <Text style={[styles.subtitle, { color: theme.border }]}> 
          Rejoignez CineTrack
        </Text>

        <View style={[styles.inputRow, { borderColor: theme.border }]}>
          <MaterialIcons
            name="person"
            size={20}
            color={theme.border}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Prénom"
            placeholderTextColor={theme.border}
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
        </View>

        <View style={[styles.inputRow, { borderColor: theme.border }]}>
          <MaterialIcons
            name="person-outline"
            size={20}
            color={theme.border}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Nom"
            placeholderTextColor={theme.border}
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
        </View>

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
            <PrimaryButton title="S'inscrire" onPress={handleRegister} />
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 12 }}
        >
          <Text style={[styles.link, { color: theme.primary }]}>
            Déjà un compte ? Connexion
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
      fontSize: 22,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 4,
    },
    logo: { width: 140, height: 60, alignSelf: "center", marginBottom: 8 },
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
