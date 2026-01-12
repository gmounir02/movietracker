import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import PrimaryButton from "../components/PrimaryButton";

const OMDB_API_KEY = "9d2296fe";

export default function MovieDetailsScreen() {
  const route = useRoute();
  const { imdbID } = route.params || {};
  const { theme } = useTheme();
  const { user } = useAuth();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${encodeURIComponent(
            imdbID
          )}&plot=full&apikey=${OMDB_API_KEY}`
        );
        const json = await res.json();
        if (mounted) setDetails(json);
      } catch (e) {
        console.warn(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      mounted = false;
    };
  }, [imdbID]);

  useEffect(() => {
    if (!user || !imdbID) return;
    const check = async () => {
      try {
        const docRef = doc(db, "users", user.uid, "movies", imdbID);
        const snap = await getDoc(docRef);
        setIsAdded(!!snap.exists());
      } catch (e) {
        console.warn(e);
      }
    };
    check();
  }, [user, imdbID]);

  const handleAdd = async () => {
    if (!user)
      return Alert.alert("Non authentifié", "Veuillez vous connecter.");
    setAddLoading(true);
    try {
      const docRef = doc(db, "users", user.uid, "movies", imdbID);
      await setDoc(docRef, {
        imdbID,
        title: details?.Title || "",
        year: details?.Year || "",
        poster: details?.Poster || null,
        rating: 0,
        watched: false,
        genres: details?.Genre ? details.Genre.split(",").map((g) => g.trim()) : [],
        createdAt: serverTimestamp(),
      });
      setIsAdded(true);
    } catch (e) {
      Alert.alert("Erreur", e.message);
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (!details || details.Response === "False") {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Détails indisponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {details.Poster && details.Poster !== "N/A" ? (
        <Image source={{ uri: details.Poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, { backgroundColor: theme.border }]} />
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          {details.Title}
        </Text>
        <Text style={{ color: theme.border, marginBottom: 8 }}>
          {details.Year} • {details.Runtime} • {details.Genre}
        </Text>
        <Text style={{ color: theme.text, marginBottom: 12 }}>
          {details.Plot}
        </Text>

        <Text style={[styles.label, { color: theme.border }]}>Réalisateur</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {details.Director}
        </Text>

        <Text style={[styles.label, { color: theme.border }]}>Acteurs</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {details.Actors}
        </Text>

        <Text style={[styles.label, { color: theme.border }]}>Note OMDb</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {details.imdbRating} / 10
        </Text>

        <View style={{ marginTop: 16 }}>
          <PrimaryButton
            title={isAdded ? "Ajouté" : "Ajouter"}
            onPress={handleAdd}
            loading={addLoading}
            disabled={isAdded}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  poster: { width: "100%", height: 420, resizeMode: "cover" },
  content: { padding: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  label: { marginTop: 8, fontSize: 12, fontWeight: "600" },
  value: { marginTop: 2, fontSize: 14 },
});
