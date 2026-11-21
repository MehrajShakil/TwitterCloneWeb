"use client";

// Account toolbar in the home header: avatar button -> dropdown menu with
// profile, settings, theme and sign out.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTheme } from "@/components/theme/ThemeProvider";
import UserAvatar from "./UserAvatar";
import styles from "./UserToolbar.module.css";

export default function UserToolbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // close the menu on a click outside it, or on Escape
  useEffect(() => {
    if (!open) return;
    function handlePointer(e) {
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!user) return null;

  const close = () => setOpen(false);

  function handleSignOut() {
    close();
    signOut();
    router.push("/login");
  }

  return (
    <div className={styles.toolbar} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <UserAvatar user={user} size={36} />
        <span className={styles.caret} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.menuHeader}>
            <UserAvatar user={user} size={44} />
            <div className={styles.who}>
              <p className={styles.name}>{user.name}</p>
              <p className={styles.handle}>@{user.username}</p>
            </div>
          </div>

          <Link role="menuitem" href="/profile" className={styles.item} onClick={close}>
            👤 View profile
          </Link>
          <Link role="menuitem" href="/settings#profile" className={styles.item} onClick={close}>
            ✏️ Edit profile
          </Link>
          <Link role="menuitem" href="/settings#password" className={styles.item} onClick={close}>
            🔒 Change password
          </Link>
          <button role="menuitem" type="button" className={styles.item} onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
          </button>

          <hr className={styles.separator} />

          <button
            role="menuitem"
            type="button"
            className={`${styles.item} ${styles.danger}`}
            onClick={handleSignOut}
          >
            ↪ Sign out
          </button>
        </div>
      )}
    </div>
  );
}
