import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";
import styles from "../auth.module.css";

export const metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <>
      <h2 className={styles.formTitle}>Create your account</h2>

      <SignUpForm />

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <div className={styles.signupPrompt}>
        Already have an account?{" "}
        <Link href="/login" className={styles.linkSignup}>
          Sign in
        </Link>
      </div>
    </>
  );
}
