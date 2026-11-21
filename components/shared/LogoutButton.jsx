"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import styles from "./Sidebar.module.css";

export default function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  function handleClick() {
    signOut();
    router.push("/login");
  }

  return (
    <button type="button" className={styles.logout} onClick={handleClick}>
      Log out
    </button>
  );
}
