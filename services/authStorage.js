// All reads/writes of accounts + the current session live here, so the rest of
// the app never touches localStorage keys directly.
//
// ⚠️ This is a learning project with NO backend. Anything in localStorage can be
// read and edited in DevTools, so this is not real security. We still store a
// SHA-256 hash instead of the plain password - it is a good habit to practise.

export const USERS_KEY = "users";
export const SESSION_KEY = "session";

function readJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback; // storage blocked or bad JSON
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked - ignore
  }
}

// users: [{ id, name, username, email, passwordHash, avatar, bio, createdAt }]
export function getUsers() {
  return readJSON(USERS_KEY, []);
}

export function saveUsers(users) {
  writeJSON(USERS_KEY, users);
}

// session: { userId } while signed in, nothing while signed out
export function getSession() {
  return readJSON(SESSION_KEY, null);
}

export function setSession(userId) {
  writeJSON(SESSION_KEY, { userId });
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// Find by email OR username (case-insensitive) - used by sign in.
export function findUserByIdentifier(users, identifier) {
  const value = identifier.trim().toLowerCase();
  return users.find((u) => u.email === value || u.username.toLowerCase() === value) ?? null;
}

// SHA-256 -> hex string. crypto.subtle only exists on https:// or localhost.
export async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
