import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MovieItem from "../components/MovieItem";
import { useTheme } from "../context/ThemeContext";

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
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 22, fontWeight: "700", padding: 12 },
});
