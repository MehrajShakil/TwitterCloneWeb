import AuthGuard from "@/components/auth/AuthGuard";
import styles from "./auth.module.css";

// Shared layout for /login and /signup: brand panel on the left, form card on
// the right. Each page only fills in the form card.
// <AuthGuard mode="guest"> sends already signed-in users to /home.
export default function AuthLayout({ children }) {
  return (
    <AuthGuard mode="guest">
      <div className={styles.loginPage}>
        {/* Left side: brand panel */}
        <div className={styles.brandPanel}>
          <div className={styles.brandLogo}>Tweetly</div>
          <h1 className={styles.brandTagline}>Happening now.</h1>
          <p className={styles.brandSub}>Join the conversation today.</p>
        </div>

        {/* Right side: form panel */}
        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            <div className={styles.formLogo}>Tweetly</div>
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
