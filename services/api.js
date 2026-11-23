// The ONE place that talks to the backend.
// Every request goes through api(), so the base URL, token header and
// error handling live here and nowhere else.

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const AUTH_KEY = "auth";

// ---- token storage: { accessToken, expiryAt, user } ----
export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

export function setAuth(auth) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  } catch {
    // storage blocked - the session only lasts until reload
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }
}

// ---- errors ----
export class ApiError extends Error {
  constructor(status, message, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors; // { email: "Already exists" }
  }
}

function parse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const camel = (key) => key.charAt(0).toLowerCase() + key.slice(1);

function toApiError(status, data) {
  // 1. ASP.NET validation: { title, errors: { Email: ["..."] } }
  if (data?.errors) {
    const fieldErrors = {};
    for (const [key, messages] of Object.entries(data.errors)) {
      fieldErrors[camel(key)] = messages[0];
    }
    return new ApiError(status, data.title ?? "Please check the form.", fieldErrors);
  }
  // 2. Our own conflicts: { field, message }
  if (data?.field) return new ApiError(status, data.message, { [data.field]: data.message });
  // 3. Plain text: "User ... does not exist."
  if (typeof data === "string" && data) return new ApiError(status, data);
  return new ApiError(status, `Request failed (${status}).`);
}

// ---- the request function ----
export async function api(path, { method = "GET", body } = {}) {
  const auth = getAuth();
  let res;

  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(auth?.accessToken && { Authorization: `Bearer ${auth.accessToken}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Is the API running?");
  }

  // Token missing, expired or invalid -> sign out everywhere.
  if (res.status === 401 && auth) {
    clearAuth();
    window.dispatchEvent(new Event("auth-expired"));
  }

  const text = await res.text(); // 204 No Content has an empty body
  const data = text ? parse(text) : null;

  if (!res.ok) throw toApiError(res.status, data);
  return data;
}

// ---- API user -> the shape the UI already uses ----
export function toUser(dto) {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    name: `${dto.firstName} ${dto.lastName}`.trim(),
    username: dto.username,
    email: dto.email,
    bio: dto.bio ?? "",
    avatar: dto.avatarUrl ?? null, // -> initials
  };
}

// ApiError -> the { field?, error } shape the forms already expect
export function toFormError(err) {
  const [field, error] = Object.entries(err.fieldErrors ?? {})[0] ?? [];
  return field ? { field, error } : { error: err.message };
}
