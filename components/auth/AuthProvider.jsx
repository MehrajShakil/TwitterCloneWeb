"use client";

// Same idea as ThemeProvider: one context that the whole app can read with useAuth().
// It lives in the ROOT layout so both (auth) and (main) pages can use it.
import { createContext, useContext, useEffect, useState } from "react";
import * as storage from "@/services/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  // true until we have read localStorage in the browser (the server can't)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function load() {
      setUsers(storage.getUsers());
      setSession(storage.getSession());
      setLoading(false);
    }
    load(); // read browser-only storage after mount

    // another tab signed in / out or edited a profile -> stay in sync
    function handleStorage(e) {
      if (e.key === null || e.key === storage.USERS_KEY || e.key === storage.SESSION_KEY) load();
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const user = users.find((u) => u.id === session?.userId) ?? null;

  function commitUsers(next) {
    storage.saveUsers(next);
    setUsers(next);
  }

  function startSession(userId) {
    storage.setSession(userId);
    setSession({ userId });
  }

  // Every action returns {} on success or { error, field? } on failure,
  // so forms can show the message with React Hook Form's setError().

  async function signUp({ name, username, email, password }) {
    const all = storage.getUsers(); // read fresh, in case another tab changed it
    if (all.some((u) => u.email === email)) {
      return { field: "email", error: "An account with this email already exists." };
    }
    if (all.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { field: "username", error: "This username is already taken." };
    }

    const newUser = {
      id: storage.createId(),
      name,
      username,
      email,
      passwordHash: await storage.hashPassword(password),
      avatar: "", // "" -> show initials
      bio: "",
      createdAt: new Date().toISOString(),
    };
    commitUsers([...all, newUser]);
    // no startSession() here - the user signs in themselves on /login
    return {};
  }

  async function signIn({ identifier, password }) {
    const found = storage.findUserByIdentifier(storage.getUsers(), identifier);
    const hash = await storage.hashPassword(password);
    // same message for both cases - don't reveal which accounts exist
    if (!found || found.passwordHash !== hash) {
      return { error: "Wrong email/username or password." };
    }
    startSession(found.id);
    return {};
  }

  function signOut() {
    storage.clearSession();
    setSession(null);
  }

  function updateProfile({ name, username, bio, avatar }) {
    const all = storage.getUsers();
    const taken = all.some(
      (u) => u.id !== user.id && u.username.toLowerCase() === username.toLowerCase(),
    );
    if (taken) return { field: "username", error: "This username is already taken." };

    commitUsers(all.map((u) => (u.id === user.id ? { ...u, name, username, bio, avatar } : u)));
    return {};
  }

  async function changePassword({ currentPassword, newPassword }) {
    const all = storage.getUsers();
    const me = all.find((u) => u.id === user.id);
    if (me.passwordHash !== (await storage.hashPassword(currentPassword))) {
      return { field: "currentPassword", error: "Current password is incorrect." };
    }
    const passwordHash = await storage.hashPassword(newPassword);
    commitUsers(all.map((u) => (u.id === user.id ? { ...u, passwordHash } : u)));
    return {};
  }

  return (
    <AuthContext.Provider
      value={{ user, users, loading, signUp, signIn, signOut, updateProfile, changePassword }}
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
