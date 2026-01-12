import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const GENRES = [
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Sci-Fi",
  "Romance",
  "Horror",
  "Animation",
  "Documentary",
  "Crime",
  "Fantasy",
  "Adventure",
];

export default function SelectGenresScreen({ navigation, route }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // preselect if provided
    const pre = route.params?.preselect;
    if (pre && Array.isArray(pre)) setSelected(pre);
    else loadFromFirestore();
  }, []);

  const loadFromFirestore = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.favoriteGenres) setSelected(data.favoriteGenres || []);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const toggle = (g) => {
    setSelected((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const save = async () => {
    if (!user) return Alert.alert("Erreur", "Utilisateur non connecté");
    if (!selected || selected.length === 0)
      return Alert.alert("Sélection requise", "Choisissez au moins un genre");
    setLoading(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        { favoriteGenres: Array.from(new Set(selected)), updatedAt: serverTimestamp() },
        { merge: true }
      );
      navigation.replace("Home");
    } catch (e) {
      Alert.alert("Erreur", e.message || "Impossible d'enregistrer");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const active = selected.includes(item);
    return (
      <TouchableOpacity
        onPress={() => toggle(item)}
        style={[
          styles.chip,
          { backgroundColor: active ? theme.primary : theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={{ color: active ? theme.card : theme.text }}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.header, { color: theme.text }]}>Choisissez vos genres favoris</Text>
      <Text style={{ color: theme.border, marginBottom: 12 }}>Sélection multiple — au moins 1</Text>
      <FlatList
        data={GENRES}
        numColumns={2}
        keyExtractor={(i) => i}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />
      <View style={{ padding: 12 }}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={save} style={[styles.saveBtn, { backgroundColor: theme.primary }]}> 
            <Text style={{ color: "white", fontWeight: "700" }}>Enregistrer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 24 },
  header: { fontSize: 20, fontWeight: "700", paddingHorizontal: 12, marginBottom: 6 },
  chip: {
    padding: 12,
    borderRadius: 10,
    margin: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  saveBtn: { padding: 14, borderRadius: 10, alignItems: "center" },
});
