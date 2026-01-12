import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import MovieItem from "../components/MovieItem";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
// removed duplicate imports

const OMDB_API_KEY = "9d2296fe";

const SUGGESTED = [
  "The Shawshank Redemption",
  "The Dark Knight",
  "Inception",
  "Parasite",
  "Interstellar",
  "Pulp Fiction",
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recMovies, setRecMovies] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = [];
        for (const title of SUGGESTED) {
          try {
            const res = await fetch(
              `https://www.omdbapi.com/?t=${encodeURIComponent(
                title
              )}&apikey=${OMDB_API_KEY}`
            );
            const json = await res.json();
            if (json && json.Response === "True") results.push(json);
          } catch (e) {
            // ignore individual failures
          }
        }
        if (mounted) setMovies(results);
      } catch (e) {
        console.warn(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAll();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchRecs = async () => {
      if (!user) return;
      setRecLoading(true);
      try {
        // fetch user favorite genres
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const fav = userSnap.exists() ? userSnap.data().favoriteGenres || [] : [];

        // fetch user's saved movies and extract genres
        const moviesColl = collection(db, "users", user.uid, "movies");
        const moviesSnap = await getDocs(moviesColl);
        const genresFromMovies = [];
        moviesSnap.forEach((d) => {
          const data = d.data();
          if (Array.isArray(data.genres)) genresFromMovies.push(...data.genres);
        });

        const merged = Array.from(new Set([...(fav || []), ...genresFromMovies]));
        if (merged.length === 0) {
          if (mounted) setRecMovies([]);
          return;
        }

        const results = [];
        // For each genre, perform a simple OMDb search by keyword
        for (const g of merged.slice(0, 6)) {
          try {
            const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(g)}&type=movie&apikey=${OMDB_API_KEY}`);
            const json = await res.json();
            if (json && json.Response === "True") {
              for (const item of json.Search || []) {
                if (!results.find((r) => r.imdbID === item.imdbID)) results.push(item);
              }
            }
          } catch (e) {
            // ignore
          }
        }
        if (mounted) setRecMovies(results.slice(0, 20));
      } catch (e) {
        console.warn(e);
      } finally {
        if (mounted) setRecLoading(false);
      }
    };
    fetchRecs();
    return () => (mounted = false);
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Suggestions</Text>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 12 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(i) => i.imdbID}
          renderItem={({ item }) => <MovieItem movie={item} />}
          contentContainerStyle={{ padding: 12, paddingBottom: 36 }}
        />
      )}
      <View style={{ paddingHorizontal: 12 }}>
        <Text style={[{ color: theme.text, fontSize: 18, fontWeight: '700', marginTop: 8 }]}>🎯 Recommended for you</Text>
        {recLoading ? (
          <ActivityIndicator style={{ marginTop: 12 }} />
        ) : recMovies.length === 0 ? (
          <Text style={{ color: theme.border, marginTop: 8 }}>No recommendations yet — add genres or movies to get personalized picks.</Text>
        ) : (
          <FlatList
            data={recMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.imdbID}
            renderItem={({ item }) => (
              <View style={{ marginRight: 10, width: 120 }}>
                {item.Poster && item.Poster !== 'N/A' ? (
                  <Image source={{ uri: item.Poster }} style={{ width: 120, height: 180, borderRadius: 8 }} />
                ) : (
                  <View style={{ width: 120, height: 180, backgroundColor: theme.border, borderRadius: 8 }} />
                )}
                <Text numberOfLines={2} style={{ color: theme.text }}>{item.Title}</Text>
              </View>
            )}
            style={{ marginTop: 8 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 22, fontWeight: "700", padding: 12 },
});
