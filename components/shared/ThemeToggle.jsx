"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import styles from "./Sidebar.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme(); // no props needed!

  return (
    <button type="button" className={styles.themeBtn} onClick={toggleTheme}>
      {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
    </button>
  );
}
