"use client";

// Auth state for the whole app, backed by the API.
// The session (token + user) is cached in localStorage so a reload keeps you signed in.
import { createContext, useContext, useEffect, useState } from "react";
import { api, getAuth, setAuth, clearAuth, toUser, toFormError, AUTH_KEY } from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function load() {
      const auth = getAuth();
      const valid = Boolean(auth) && new Date(auth.expiryAt) > new Date();
      if (!valid) clearAuth();
      setUser(valid ? auth.user : null);
      setLoading(false);
    }
    load();

    // another tab signed in/out, or api() saw a 401
    function handleStorage(e) {
      if (e.key === null || e.key === AUTH_KEY) load();
    }
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-expired", load);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-expired", load);
    };
  }, []);

  function saveUser(next) {
    setAuth({ ...getAuth(), user: next });
    setUser(next);
  }

  async function signUp({ firstName, lastName, username, email, password }) {
    try {
      await api("/api/users", {
        method: "POST",
        body: { firstName, lastName, username, email, password },
      });
      return {}; // the user signs in themselves on /login
    } catch (err) {
      return toFormError(err);
    }
  }

  async function signIn({ email, password }) {
    try {
      const res = await api("/api/auth/login", { method: "POST", body: { email, password } });
      const nextUser = toUser(res.userDto);
      setAuth({ accessToken: res.accessToken, expiryAt: res.expiryAt, user: nextUser });
      setUser(nextUser);
      return {};
    } catch (err) {
      // same message for both cases - don't reveal which accounts exist
      return { error: err.status === 401 ? "Wrong email or password." : err.message };
    }
  }

  function signOut() {
    clearAuth();
    setUser(null);
  }

  async function updateProfile({ firstName, lastName, username, bio, avatar }) {
    try {
      const dto = await api(`/api/users/${user.id}`, {
        method: "PUT",
        body: { firstName, lastName, username, bio, avatarUrl: avatar },
      });
      saveUser(toUser(dto));
      return {};
    } catch (err) {
      return toFormError(err);
    }
  }

  async function changePassword({ currentPassword, newPassword }) {
    try {
      await api("/api/auth/change-password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      return {};
    } catch (err) {
      return toFormError(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signOut, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
