import Link from "next/link";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";
import styles from "./Sidebar.module.css";

// Left navbar (class 28 Sidebar.jsx).
// This stays a Server Component - only the small interactive parts
// (NavLinks, ThemeToggle, LogoutButton) are Client Components.
export default function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <Link href="/home" className={styles.logo}>
        Tweetly
      </Link>
      <NavLinks />
      <Link href="/home" className={styles.tweetBtn}>
        Tweet
      </Link>
      <ThemeToggle />
      <LogoutButton />
    </nav>
  );
}
