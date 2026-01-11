import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/config";

// Context pour stocker l'état d'authentification globalement
const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Observateur d'état d'authentification Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Inscription
  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Connexion
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Déconnexion
  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pratique pour utiliser le contexte
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;

// Note pédagogique:
// - `AuthProvider` entoure l'app et fournit `user`, `loading` et les méthodes
// - `onAuthStateChanged` garde `user` synchro avec Firebase
