import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";

// Affiche la collection personnelle de l'utilisateur
export default function MyMoviesScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const colRef = collection(db, "users", user.uid, "movies");
    const unsub = onSnapshot(
      colRef,
      (snapshot) => {
        // Enable LayoutAnimation on Android
        if (
          Platform.OS === "android" &&
          UIManager.setLayoutAnimationEnabledExperimental
        ) {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMovies(items);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return unsub;
  }, [user]);

  const confirmDelete = (movie) => {
    Alert.alert("Confirmer", `Supprimer ${movie.title} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => handleDelete(movie),
      },
    ]);
  };

  const handleDelete = async (movie) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "movies", movie.imdbID));
    } catch (e) {
      Alert.alert("Erreur", e.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        { borderColor: theme.border, backgroundColor: theme.card },
      ]}
      onPress={() => navigation.navigate("EditMovie", { movie: item })}
    >
      {item.poster && item.poster !== "N/A" ? (
        <Image source={{ uri: item.poster }} style={styles.poster} />
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
          <MaterialIcons name="movie" size={32} color={theme.card} />
        </View>
      )}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontWeight: "700", color: theme.text, fontSize: 16 }}>
          {item.title}
        </Text>
        <Text style={{ color: theme.border, marginTop: 4 }}>{item.year}</Text>
        <View
          style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}
        >
          <MaterialIcons
            name="star"
            size={16}
            color={item.rating ? "#FFD700" : theme.border}
          />
          <Text style={{ color: theme.text, marginLeft: 6 }}>
            {" "}
            {item.rating || 0}
          </Text>
          <MaterialIcons
            name="visibility"
            size={16}
            color={item.watched ? theme.primary : theme.border}
            style={{ marginLeft: 12 }}
          />
          <Text style={{ color: theme.text, marginLeft: 6 }}>
            {item.watched ? "Vu" : "À regarder"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => confirmDelete(item)}
        style={{ padding: 8 }}
      >
        <Text style={{ color: "#FF3B30", fontWeight: "600" }}>Supprimer</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {movies.length === 0 ? (
        <Text style={{ color: theme.text }}>Aucun film enregistré.</Text>
      ) : null}
      <FlatList
        data={movies}
        keyExtractor={(i) => i.imdbID}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: theme.background },
    item: {
      flexDirection: "row",
      padding: 8,
      borderBottomWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
    },
    poster: { width: 60, height: 90, backgroundColor: "#ddd" },
  });
}
