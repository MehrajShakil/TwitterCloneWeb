"use client";

// Route protection. The session lives in localStorage, which middleware/the
// server can't read - so the check happens here, in the browser.
//   mode="user"  -> only signed-in users  (else go to /login)
//   mode="guest" -> only signed-out users (else go to /home)
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import styles from "./AuthGuard.module.css";

export default function AuthGuard({ mode = "user", children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = mode === "user" ? Boolean(user) : !user;

  useEffect(() => {
    if (!loading && !allowed) router.replace(mode === "user" ? "/login" : "/home");
  }, [loading, allowed, mode, router]);

  if (loading || !allowed) {
    return (
      <div className={styles.loading} role="status" aria-label="Loading">
        <span className={styles.spinner} />
      </div>
    );
  }
  return children;
}
