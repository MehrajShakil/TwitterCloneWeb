import ProfileSettingsForm from "@/components/user/ProfileSettingsForm";
import PasswordForm from "@/components/user/PasswordForm";
import styles from "@/components/user/Settings.module.css";

export const metadata = {
  title: "Settings",
};

// The ids "profile" and "password" let the toolbar link straight to a card:
// /settings#profile and /settings#password
export default function SettingsPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>Settings</h1>

      <section id="profile" className={styles.card}>
        <h2 className={styles.cardTitle}>Edit profile</h2>
        <ProfileSettingsForm />
      </section>

      <section id="password" className={styles.card}>
        <h2 className={styles.cardTitle}>Change password</h2>
        <PasswordForm />
      </section>
    </>
  );
}
