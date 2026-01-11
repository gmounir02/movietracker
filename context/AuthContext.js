import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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

  // Inscription: crée l'utilisateur, met à jour le profile et crée un doc user
  const register = async (firstName, lastName, email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = res.user;
    // update displayName
    try {
      await updateProfile(firebaseUser, {
        displayName: `${firstName || ""} ${lastName || ""}`.trim(),
      });
    } catch (e) {
      console.warn("Failed to update profile displayName:", e.message || e);
    }
    // create a Firestore user document
    try {
      await setDoc(doc(db, "users", firebaseUser.uid), {
        firstName: firstName || null,
        lastName: lastName || null,
        email: firebaseUser.email,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("Failed to create user doc:", e.message || e);
    }
    return res;
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
