# CineTrack (Expo + React Native)

Application mobile simple pour gérer une collection de films personnelle.

Technologies

- React Native (Expo)
- Firebase Authentication (email/password)
- Firebase Firestore
- OMDb API (clé intégrée `9d2296fe`)
- React Navigation

Structure principale

- `App.js` — point d'entrée, navigation, `AuthProvider` et `ThemeProvider`.
- `firebase/config.js` — initialisation Firebase (remplacez les placeholders par votre config).
- `context/AuthContext.js` — gestion de l'authentification (register/login/logout).
- `context/ThemeContext.js` — thème clair/sombre et bascule.
- `screens/` — `LoginScreen.js`, `RegisterScreen.js`, `SearchScreen.js`, `MyMoviesScreen.js`, `EditMovieScreen.js`.
- `components/MovieItem.js` — composant pour afficher les résultats OMDb.

Fonctionnalités

- Inscription / Connexion via Firebase Auth.
- Recherche de films via OMDb et ajout à la collection personnelle.
- Stockage Firestore sous `users/{userId}/movies/{imdbID}` — champs: `imdbID, title, year, poster, rating, watched, createdAt`.
- Liste des films personnels, modification (note 1–5, vu/à regarder), suppression avec confirmation.
- Mode sombre simple (bascule depuis l'en-tête lorsqu'authentifié).

Installation

1. Installer les dépendances:

```bash
npm install
npx expo install firebase @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @expo/vector-icons
```

2. Configurer Firebase: éditez `firebase/config.js` et remplacez les placeholders par votre configuration Firebase (apiKey, projectId, appId...).

3. Lancer l'application:

```bash
npx expo start
```

Notes pédagogiques

- Utilisez `users/{uid}/movies/{imdbID}` pour éviter les conflits entre utilisateurs.
- La clé OMDb est fournie dans le code pour simplifier la démonstration (`9d2296fe`). Pour production, stockez-la en variable d'environnement.

Souhaitez-vous que je :

- committe les changements dans git ?
- ajoute des tests ou un écran de profil utilisateur ?
