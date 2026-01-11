import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";

// Écran pour modifier la note et le statut d'un film
export default function EditMovieScreen({ route, navigation }) {
  const { movie } = route.params || {};
  const { user } = useAuth();
  const [rating, setRating] = useState(movie?.rating || 0);
  const [watched, setWatched] = useState(!!movie?.watched);
  const { theme } = useTheme();

  const save = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid, "movies", movie.imdbID);
      await updateDoc(docRef, { rating, watched });
      navigation.goBack();
    } catch (e) {
      alert(e.message);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie?.title}</Text>
      <Text style={{ marginBottom: 8, color: theme.text }}>
        Année: {movie?.year}
      </Text>

      <Text style={{ marginTop: 8, color: theme.text }}>Note: {rating} ⭐</Text>
      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => setRating(n)}
            style={[styles.star, rating >= n ? styles.starActive : null]}
          >
            <Text style={{ color: rating >= n ? "white" : theme.text }}>
              {n}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <Text style={{ marginRight: 8, color: theme.text }}>Vu</Text>
        <Switch value={watched} onValueChange={setWatched} />
      </View>

      <PrimaryButton title="Enregistrer" onPress={save} />
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: theme.background },
    title: { fontSize: 18, fontWeight: "bold", color: theme.text },
    star: {
      width: 40,
      height: 40,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    starActive: { backgroundColor: "#FFD700", borderColor: "#FFD700" },
  });
}
