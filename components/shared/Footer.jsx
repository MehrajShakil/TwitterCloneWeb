"use client";

// Client Component because it reads the theme from Context.
import { useTheme } from "@/components/theme/ThemeProvider";
import styles from "./Footer.module.css";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={styles.siteFooter}>
      <p>&copy; 2024 Tweetly. All rights reserved. · {theme} mode</p>
    </footer>
  );
}
