import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import styles from "../auth.module.css";

// Server Component; the interactive form is the <LoginForm /> Client Component.
// The brand panel is in (auth)/layout.jsx.
export const metadata = {
  title: "Log in",
};

// After sign-up we land on /login?registered=<username>.
// In Next.js 15+ `searchParams` is a Promise, so the page is async.
export default async function LoginPage({ searchParams }) {
  const { registered } = await searchParams;

  return (
    <>
      <h2 className={styles.formTitle}>Sign in to Tweetly</h2>

      <LoginForm registeredUsername={typeof registered === "string" ? registered : ""} />

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <div className={styles.signupPrompt}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className={styles.linkSignup}>
          Sign up
        </Link>
      </div>
    </>
  );
}
