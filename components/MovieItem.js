import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import PrimaryButton from "./PrimaryButton";
import { MaterialIcons } from "@expo/vector-icons";

// Composant réutilisable pour afficher un résultat OMDb
// Props:
// - movie: objet retourné par OMDb (Title, Year, Poster, imdbID)
// - onAdd: fonction appelée quand on appuie sur "Ajouter"
export default function MovieItem({
  movie,
  onAdd,
  isAdded = false,
  isLoading = false,
}) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 12,
      bounciness: 4,
    }).start();
  }, [anim]);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });
  const opacity = anim;

  const posterAvailable = movie?.Poster && movie.Poster !== "N/A";

  return (
    <Animated.View
      style={[styles.animated, { opacity, transform: [{ scale }] }]}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() =>
          navigation.navigate("MovieDetails", {
            imdbID: movie.imdbID,
            title: movie.Title,
          })
        }
        style={[
          styles.container,
          { borderColor: theme.border, backgroundColor: theme.card },
        ]}
      >
        {posterAvailable ? (
          <Image
            source={{ uri: movie.Poster }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.poster,
              {
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.border,
              },
            ]}
          >
            <MaterialIcons name="movie" size={36} color={theme.card} />
          </View>
        )}

        <View style={styles.info}>
          <Text numberOfLines={2} style={[styles.title, { color: theme.text }]}>
            {movie.Title}
          </Text>
          <Text style={[styles.year, { color: theme.border }]}>
            {movie.Year}
          </Text>
          <View
            style={{ flexDirection: "row", marginTop: 8, alignItems: "center" }}
          >
            <PrimaryButton
              title={isAdded ? "Ajouté" : "Ajouter"}
              onPress={() => !isAdded && !isLoading && onAdd && onAdd(movie)}
              loading={isLoading}
              style={
                isAdded
                  ? { flex: 1, backgroundColor: theme.border }
                  : { flex: 1 }
              }
            />
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.border}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  poster: {
    width: 84,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
  },
  year: {
    color: "#666",
    marginTop: 4,
    fontSize: 13,
  },
});
