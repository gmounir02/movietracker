import ProfileScreen from "./screens/ProfileScreen";
import React from "react";
import { ActivityIndicator, TouchableOpacity, Text, View } from "react-native";
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SearchScreen from "./screens/SearchScreen";
import MyMoviesScreen from "./screens/MyMoviesScreen";
import EditMovieScreen from "./screens/EditMovieScreen";
import MovieDetailsScreen from "./screens/MovieDetailsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.border,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === "Home"
              ? "home"
              : route.name === "Search"
              ? "search"
              : "movie";
          return <MaterialIcons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Accueil" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Rechercher" }}
      />
      <Tab.Screen
        name="MyMovies"
        component={MyMoviesScreen}
        options={{ title: "Mes films" }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        // Authenticated app
        <>
          <Stack.Screen
            name="Home"
            component={AppTabs}
            options={({ navigation }) => ({
              title: "MovieTracker",
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={toggleTheme}
                    style={{ marginRight: 12 }}
                  >
                    <Text style={{ color: theme.primary }}>
                      {theme.mode === "light" ? "🌙" : "☀️"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Profile")}
                    style={{ marginRight: 12 }}
                  >
                    <Text style={{ color: theme.primary }}>Profil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={logout}
                    style={{ marginRight: 12 }}
                  >
                    <Text style={{ color: theme.primary }}>Déconnexion</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="EditMovie"
            component={EditMovieScreen}
            options={{ title: "Editer" }}
          />
          <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={({ route }) => ({
              title: route.params?.title || "Détails",
            })}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Profil" }}
          />
        </>
      ) : (
        // Auth screens
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Connexion" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "S'inscrire" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppContent() {
  const { theme } = useTheme();
  // Map our theme to React Navigation theme shape
  const navTheme = {
    ...NavDefaultTheme,
    dark: theme.mode === "dark",
    colors: {
      ...NavDefaultTheme.colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.primary,
    },
    // provide a safe fonts object so native-stack's header code can access fonts.regular
    fonts: {
      regular: {},
      medium: {},
      bold: {},
      heavy: {},
    },
  };

  return (
    <AuthProvider>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
