import React, { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext({});

const light = {
  mode: "light",
  background: "#ffffff",
  card: "#f8f8f8",
  text: "#111111",
  border: "#e0e0e0",
  primary: "#007AFF",
};

const dark = {
  mode: "dark",
  background: "#121212",
  card: "#1e1e1e",
  text: "#ffffff",
  border: "#303030",
  primary: "#0A84FF",
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => (mode === "light" ? light : dark), [mode]);

  const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
