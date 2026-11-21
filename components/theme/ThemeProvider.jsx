"use client";

// Class 28's ThemeContext + the provider part of App.jsx.
// Context only works in Client Components, so the provider lives here and
// the (main) layout (a Server Component) simply wraps its children with it.
import { createContext, useContext } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import styles from "./ThemeProvider.module.css";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    // every component inside can read { theme, toggleTheme }
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={styles.app} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// small helper so components write useTheme() instead of useContext(ThemeContext)
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
