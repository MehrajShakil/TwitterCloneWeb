"use client";

// "/" has no UI of its own. The session is in localStorage (browser only),
// so we decide here: signed in -> /home, otherwise -> /login.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) router.replace(user ? "/home" : "/login");
  }, [user, loading, router]);

  return null;
}
