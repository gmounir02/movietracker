import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import MovieItem from "../components/MovieItem";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";
import PrimaryButton from "../components/PrimaryButton";

// Clé OMDb fournie
const OMDB_API_KEY = "9d2296fe";

// Écran de recherche via l'API OMDb
export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [ownedIds, setOwnedIds] = useState(new Set());
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const { theme } = useTheme();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          query.trim()
        )}&apikey=${OMDB_API_KEY}`
      );
      const json = await res.json();
      if (json.Response === "True") {
        setResults(json.Search || []);
      } else {
        setResults([]);
        setError(json.Error || "Aucun résultat");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Ajoute un film dans Firestore sous users/{uid}/movies/{imdbID}
  const handleAdd = async (movie) => {
    if (!user)
      return Alert.alert("Non authentifié", "Veuillez vous connecter.");
    const imdbID = movie.imdbID;
    const docRef = doc(db, "users", user.uid, "movies", imdbID);
    // mark loading for this item
    setLoadingIds((prev) => new Set(prev).add(imdbID));
    try {
      await setDoc(docRef, {
        imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        rating: 0,
        watched: false,
        createdAt: serverTimestamp(),
      });
      // update owned ids
      setOwnedIds((prev) => {
        const next = new Set(prev);
        next.add(imdbID);
        return next;
      });
    } catch (e) {
      Alert.alert("Erreur", e.message);
    } finally {
      // remove loading flag
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(imdbID);
        return next;
      });
    }
  };

  // subscribe to user's movie collection to know which items are already added
  React.useEffect(() => {
    if (!user) {
      setOwnedIds(new Set());
      return;
    }
    const coll = collection(db, "users", user.uid, "movies");
    const unsub = onSnapshot(
      coll,
      (snap) => {
        const ids = new Set();
        snap.forEach((d) => ids.add(d.id));
        setOwnedIds(ids);
      },
      (err) => {
        console.warn("Failed to subscribe to user movies:", err);
      }
    );
    return () => unsub();
  }, [user]);

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher un film (OMDb)</Text>
      <TextInput
        placeholder="Titre"
        placeholderTextColor={theme.border}
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <PrimaryButton title="Rechercher" onPress={handleSearch} />
      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={results}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            onAdd={handleAdd}
            isAdded={ownedIds.has(item.imdbID)}
            isLoading={loadingIds.has(item.imdbID)}
          />
        )}
        style={{ marginTop: 12 }}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: theme.background },
    title: { fontSize: 18, marginBottom: 8, color: theme.text },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      padding: 8,
      borderRadius: 6,
      marginBottom: 8,
      color: theme.text,
    },
    error: { color: "red", marginTop: 8 },
  });
}
