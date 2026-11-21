# Tweetly — Feature Guide (for Next.js beginners)

This guide walks through **every feature** of Tweetly: what the user sees, **which files make it happen**, and **which Next.js idea** is behind it.

> **How to read it:** start with [Part 1](#part-1--nextjs-ideas-you-need-first) (the 10 Next.js ideas used everywhere), then jump to any feature in [Part 2](#part-2--features-one-by-one). Every file name is a link — open it next to this guide.

There is **no backend**. Everything (accounts, session, tweets) is saved in the browser's **localStorage**. That keeps the project simple, but it is **not real security** (see [Gotchas](#part-4--beginner-gotchas)).

---

## Table of contents

- [Part 1 — Next.js ideas you need first](#part-1--nextjs-ideas-you-need-first)
- [Part 2 — Features one by one](#part-2--features-one-by-one)
  1. [Pages, URLs and shared layouts](#1-pages-urls-and-shared-layouts)
  2. [Sign up](#2-sign-up)
  3. [Sign in](#3-sign-in)
  4. [Protecting pages (AuthGuard)](#4-protecting-pages-authguard)
  5. [User toolbar (avatar menu)](#5-user-toolbar-avatar-menu)
  6. [Default avatar (initials)](#6-default-avatar-initials)
  7. [Profile page](#7-profile-page)
  8. [Settings: edit profile](#8-settings-edit-profile)
  9. [Settings: change password + green checklist](#9-settings-change-password--green-password-checklist)
  10. [Tweets: post, like, delete, search, draft](#10-tweets-post-like-delete-search-draft)
  11. [Dark mode](#11-dark-mode)
  12. [Right column: Trends + Who to follow](#12-right-column-trends--who-to-follow)
  13. [Online / Offline badge](#13-online--offline-badge)
  14. [404 page](#14-404-page)
- [Part 3 — Where the data lives](#part-3--where-the-data-lives)
- [Part 4 — Beginner gotchas](#part-4--beginner-gotchas)
- [Part 5 — Recipes: how to add things](#part-5--recipes-how-to-add-things)

---

## Part 1 — Next.js ideas you need first

### 1. File-based routing (the App Router)
In plain React you install a router and write `<Route path="/home" />`. In Next.js **the folder structure *is* the router**: a folder inside `app/` becomes a URL segment, and a `page.jsx` inside it is what shows on that URL.

```
app/(main)/home/page.jsx      →  /home
app/(auth)/login/page.jsx     →  /login
app/page.jsx                  →  /
```

### 2. `layout.jsx` — UI shared by many pages
A `layout.jsx` wraps **every page in its folder and all sub-folders**. It stays on screen while only the page inside it changes, so you write the sidebar once instead of on every page.

```
app/layout.jsx             wraps EVERYTHING (html, body, AuthProvider)
app/(main)/layout.jsx      wraps /home, /profile, /settings, ...  (sidebar, right column)
app/(auth)/layout.jsx      wraps /login and /signup              (blue brand panel)
```

### 3. Route groups — folders in `( )`
A folder name in brackets, like `(main)` or `(auth)`, is **not part of the URL**. It only exists to **group pages so they can share a layout**. That's why the URL is `/home`, not `/main/home`.

### 4. Server Components vs Client Components
- **Server Component (the default):** runs on the server, sends ready HTML. It **cannot** use `useState`, `useEffect`, `onClick`, context, or browser things like `localStorage`.
- **Client Component:** the file starts with `"use client"`. It runs in the browser too, so it **can** use state, effects, events, and `localStorage`.

**Rule of thumb used in this project:** keep pages and layouts as Server Components, and move only the interactive part into a small Client Component.
Example: [app/(auth)/login/page.jsx](app/(auth)/login/page.jsx) is a Server Component that renders [LoginForm.jsx](components/auth/LoginForm.jsx), which is a Client Component.

### 5. Hydration
The server sends HTML first, then React "wakes it up" in the browser (**hydration**). The first browser render **must match** the server HTML. Since the server has no `localStorage`, we always render a "default" first and read `localStorage` **after** mount (inside `useEffect`). You'll see this pattern in [useLocalStorage.js](hooks/useLocalStorage.js) and [AuthProvider.jsx](components/auth/AuthProvider.jsx).

### 6. `metadata` — the browser tab title
A page or layout can `export const metadata = { title: "Home" }`. The root layout sets a template `"%s / Tweetly"`, so the tab shows **"Home / Tweetly"**. (Only Server Components can export `metadata`.)

### 7. Navigation: `<Link>`, `useRouter`, `usePathname`
| Tool | Use it when | Example in project |
|---|---|---|
| `<Link href="/profile">` | user clicks a link | [UserToolbar.jsx](components/user/UserToolbar.jsx) |
| `useRouter().push("/home")` | navigate **from code** (after a form submits) | [LoginForm.jsx](components/auth/LoginForm.jsx) |
| `useRouter().replace("/login")` | same, but **no Back-button entry** (for redirects) | [AuthGuard.jsx](components/auth/AuthGuard.jsx) |
| `usePathname()` | know the current URL (highlight active link) | [NavLinks.jsx](components/layout/NavLinks.jsx) |

All three come from `next/navigation` (Client Components only) except `<Link>` from `next/link`.

### 8. `searchParams` — reading `?key=value` from the URL
A page receives `searchParams` as a prop. **In Next.js 15+ it is a Promise**, so the page must be `async` and `await` it:
```jsx
export default async function LoginPage({ searchParams }) {
  const { registered } = await searchParams;   // /login?registered=jane → "jane"
}
```

### 9. `next/image` and CSS Modules
- `<Image>` from `next/image` resizes/lazy-loads images automatically. Local images need `width` and `height`.
- `Something.module.css` = **CSS Modules**. Class names are made unique per file, so `.title` in two files never clash. Use as `className={styles.title}`.

### 10. The `@/` import alias
`@/` means "project root" (set in [jsconfig.json](jsconfig.json)). So `import { useAuth } from "@/components/auth/AuthProvider"` works from any folder — no `../../../`.

---

## Part 2 — Features one by one

### 1. Pages, URLs and shared layouts

**What the user sees:** two "shells" — the blue login/sign-up screen, and the 3-column app (sidebar · feed · trends).

| File | What it does |
|---|---|
| [app/layout.jsx](app/layout.jsx) | Root layout. Adds `<html>`, `<body>`, global CSS, the title template, and wraps **everything** in `<AuthProvider>` |
| [app/page.jsx](app/page.jsx) | `/` has no UI. Sends you to `/home` if signed in, otherwise `/login` |
| [app/(auth)/layout.jsx](app/(auth)/layout.jsx) | Blue brand panel + white form card, shared by `/login` and `/signup` |
| [app/(main)/layout.jsx](app/(main)/layout.jsx) | Sidebar + page + right column + footer, shared by all app pages |
| [app/(main)/*/page.jsx](app/(main)/) | One file per page: home, profile, settings, explore, ... |
| [data/data.js](data/data.js) | Static content: nav links, trends, seed tweets, avatar choices |

**How the layouts nest for `/home`:**
```
RootLayout            (app/layout.jsx)
 └ AuthProvider
    └ MainLayout      (app/(main)/layout.jsx)
       └ ThemeProvider
          └ AuthGuard mode="user"
             ├ Sidebar
             ├ <main> HomePage </main>   ← only this part changes when you navigate
             ├ RightColumn
             └ Footer
```

> 🔗 **Next.js idea:** layouts + route groups ([Part 1 §2–3](#2-layoutjsx--ui-shared-by-many-pages)). The sidebar does **not** re-mount when you go from `/home` to `/profile` — only `{children}` changes.

---

### 2. Sign up

**What the user sees:** a form (name, username, email, password, confirm). Errors show under each field. On success → sent to **/login** with a green "Account created 🎉" message and the username already filled in.

| File | What it does |
|---|---|
| [app/(auth)/signup/page.jsx](app/(auth)/signup/page.jsx) | The page (Server Component): title + `<SignUpForm />` + "Sign in" link |
| [components/auth/SignUpForm.jsx](components/auth/SignUpForm.jsx) | The form (Client Component) using **React Hook Form** + **Zod** |
| [validation/schemas.js](validation/schemas.js) | `signUpSchema` — all the rules and error messages |
| [components/form/FormFields.jsx](components/form/FormFields.jsx) | Reusable `TextField`, `PasswordField`, `FormMessage`, `SubmitButton` |
| [components/auth/AuthProvider.jsx](components/auth/AuthProvider.jsx) | `signUp()` — checks email/username are free, saves the user |
| [services/authStorage.js](services/authStorage.js) | Reads/writes `users` in localStorage, hashes the password |

**Step by step:**
1. User types. React Hook Form tracks the values; with `mode: "onTouched"` an error appears after leaving a field.
2. On submit, `zodResolver(signUpSchema)` checks every rule. If anything fails, `onSubmit` **never runs**.
3. `onSubmit` calls `signUp(values)` from `useAuth()`.
4. `signUp` reads `users` from localStorage. Email or username taken? → returns `{ field: "email", error: "..." }` and the form shows it under that field with `setError()`.
5. Otherwise it hashes the password (SHA-256), adds the user, saves `users`. **It does not sign the user in.**
6. The form calls `router.push("/login?registered=<username>")`.
7. The login page reads `registered` from `searchParams` and passes it to `<LoginForm registeredUsername=... />`, which shows the success message and pre-fills the field.

> 🔗 **Next.js ideas:** Server page + Client form ([§4](#4-server-components-vs-client-components)), `useRouter().push` ([§7](#7-navigation-link-userouter-usepathname)), `searchParams` as a Promise ([§8](#8-searchparams--reading-keyvalue-from-the-url)).

---

### 3. Sign in

**What the user sees:** email-or-username + password. Wrong details → "Wrong email/username or password." Correct → `/home`.

| File | What it does |
|---|---|
| [app/(auth)/login/page.jsx](app/(auth)/login/page.jsx) | `async` page, reads `?registered=` and renders `<LoginForm />` |
| [components/auth/LoginForm.jsx](components/auth/LoginForm.jsx) | The form (RHF + `signInSchema`) |
| [components/auth/AuthProvider.jsx](components/auth/AuthProvider.jsx) | `signIn()` — finds the user, compares password hashes, starts the session |

**Step by step:**
1. Zod checks both fields are filled.
2. `signIn()` finds the user by email **or** username, hashes the typed password, compares it with the saved hash.
3. No match → returns an error → shown with `setError("root", ...)` (a banner at the top, because it's not about one specific field). The message is the same for "unknown user" and "wrong password" on purpose, so nobody can find out which accounts exist.
4. Match → saves `session = { userId }` in localStorage and in React state → `router.push("/home")`.

---

### 4. Protecting pages (AuthGuard)

**What the user sees:** signed out + open `/home` → sent to `/login`. Signed in + open `/login` or `/signup` → sent to `/home`. A spinner shows for a moment while it checks.

| File | What it does |
|---|---|
| [components/auth/AuthProvider.jsx](components/auth/AuthProvider.jsx) | Knows **who** is signed in: `user`, and `loading` (true until localStorage is read) |
| [components/auth/AuthGuard.jsx](components/auth/AuthGuard.jsx) | Decides **allowed or redirect** |
| [app/(main)/layout.jsx](app/(main)/layout.jsx) | Uses `<AuthGuard mode="user">` → protects every app page |
| [app/(auth)/layout.jsx](app/(auth)/layout.jsx) | Uses `<AuthGuard mode="guest">` → login/signup only for signed-out people |

**The core logic (simplified):**
```jsx
const allowed = mode === "user" ? Boolean(user) : !user;

useEffect(() => {
  if (!loading && !allowed) router.replace(mode === "user" ? "/login" : "/home");
}, [loading, allowed]);

if (loading || !allowed) return <Spinner />;   // never flash the protected page
return children;
```

**Why a spinner first?** On the server (and the very first browser render) we can't read localStorage, so we *don't know yet* who you are. `loading` is `true` → spinner. After mount, AuthProvider reads localStorage, `loading` becomes `false`, and the guard decides.

**Why one guard protects many pages:** it sits in the **group layout**. Any new page you put in `app/(main)/` is protected automatically — you don't touch the page at all.

> 🔗 **Next.js ideas:** layouts wrap all child pages ([§2](#2-layoutjsx--ui-shared-by-many-pages)), hydration ([§5](#5-hydration)), `router.replace` ([§7](#7-navigation-link-userouter-usepathname)).
>
> ⚠️ In real apps you'd protect pages on the **server** (in `middleware.js` or a Server Component, using an httpOnly cookie). The server can't read localStorage, so here the check must happen in the browser.

---

### 5. User toolbar (avatar menu)

**What the user sees:** top-right of the Home header — your avatar with ▾. Click → menu with your name, **View profile**, **Edit profile**, **Change password**, **Dark/Light mode**, **Sign out**. Clicking outside or pressing **Esc** closes it.

| File | What it does |
|---|---|
| [components/user/UserToolbar.jsx](components/user/UserToolbar.jsx) | Button + dropdown menu |
| [components/user/UserToolbar.module.css](components/user/UserToolbar.module.css) | Menu styles |
| [components/tweet/Feed.jsx](components/tweet/Feed.jsx) | Places `<UserToolbar />` in the Home header |
| [components/layout/LogoutButton.jsx](components/layout/LogoutButton.jsx) | The sidebar's "Log out" (same `signOut()`) |

**How it works:**
- `open` state (true/false) shows or hides the menu.
- A `useRef` points at the wrapper `<div>`. While open, a `useEffect` adds `mousedown` and `keydown` listeners on `document`: a click **outside** the ref, or `Escape`, closes it. The effect's cleanup removes the listeners.
- "Edit profile" links to `/settings#profile` — the `#profile` part scrolls to the element with `id="profile"`.
- **Sign out:** `signOut()` clears the session → `user` becomes `null` → the guard on `(main)` redirects to `/login`.

> 🔗 **Next.js idea:** `<Link href>` with a `#hash` scrolls to that section; context (`useAuth`, `useTheme`) needs a Client Component.

---

### 6. Default avatar (initials)

**What the user sees:** if you haven't chosen a picture, a coloured circle with your initials (e.g. **JD**). The colour is always the same for the same username.

| File | What it does |
|---|---|
| [components/user/UserAvatar.jsx](components/user/UserAvatar.jsx) | Picture **or** initials circle. Used in toolbar, tweets, profile, settings |

- `user.avatar` set → `<Image>` from `next/image`.
- Empty → takes the first letter of the first and last word of the name, and turns the username into a colour with a tiny hash → `hsl(hue 55% 45%)`.

> 🔗 **Next.js idea:** `next/image` ([§9](#9-nextimage-and-css-modules)). Note this component has no `"use client"` — it has no state, so it works as either.

---

### 7. Profile page

**What the user sees:** `/profile` — cover banner, big avatar, name, @username, bio, "Joined November 2026", number of tweets, likes received, and a list of **only your tweets**.

| File | What it does |
|---|---|
| [app/(main)/profile/page.jsx](app/(main)/profile/page.jsx) | Server page + `metadata` |
| [components/user/ProfileView.jsx](components/user/ProfileView.jsx) | Reads `user` from `useAuth()` and tweets from `useTweets()` |
| [hooks/useTweets.js](hooks/useTweets.js) | Shared tweet logic (also used by Home) |

The counts are **derived values** — calculated from the tweet list on every render, not stored separately:
```js
const myTweets = tweets.filter((t) => t.isMine);
const likesReceived = myTweets.reduce((sum, t) => sum + t.likes, 0);
```

---

### 8. Settings: edit profile

**What the user sees:** `/settings` → "Edit profile" card. Pick a picture (4 presets or initials), change name, username, bio (with a `0 / 160` counter). **Save** is disabled until you change something. After saving: "Profile saved ✅". Your **old tweets update** to the new name/avatar too.

| File | What it does |
|---|---|
| [app/(main)/settings/page.jsx](app/(main)/settings/page.jsx) | Two cards with `id="profile"` and `id="password"` |
| [components/user/ProfileSettingsForm.jsx](components/user/ProfileSettingsForm.jsx) | The form |
| [validation/schemas.js](validation/schemas.js) | `profileSchema` |
| [components/auth/AuthProvider.jsx](components/auth/AuthProvider.jsx) | `updateProfile()` — rejects a username someone else has |

**React Hook Form features used here:**
| Feature | Why |
|---|---|
| `defaultValues: { name: user.name, ... }` | Form starts filled with your current data |
| `useWatch({ control, name: [...] })` | Live values for the bio counter and avatar preview |
| `formState.isDirty` | `true` only if something changed → enables Save |
| `reset(values)` after saving | The saved values become the new "unchanged" state |
| `setError("username", ...)` | Show "username taken" under the right field |

**Why old tweets update:** each new tweet stores `authorId`. When tweets are shown, [useTweets.js](hooks/useTweets.js) looks up the author's **current** name/avatar from `users`.

---

### 9. Settings: change password + green password checklist

**What the user sees:** current password, new password, confirm. Under "New password" a live checklist: `○ At least 8 characters ○ One uppercase letter ○ One number`. Each rule turns into a **green ✓** as you meet it, and the input border turns **green** when all are met. Wrong current password → error under that field. Success → "Password updated 🔒" and the fields clear.

The same checklist is on the **sign-up** password field.

| File | What it does |
|---|---|
| [components/user/PasswordForm.jsx](components/user/PasswordForm.jsx) | The form |
| [validation/schemas.js](validation/schemas.js) | `PASSWORD_RULES` (one list of rules) + `passwordSchema` |
| [components/form/FormFields.jsx](components/form/FormFields.jsx) | `PasswordField` with show/hide, and the `PasswordChecklist` |
| [components/form/Form.module.css](components/form/Form.module.css) | `.valid` (green border), `.checklist`, `.met` |
| [app/globals.css](app/globals.css) | `--success` / `--success-text` colours |

**One list, two uses:**
```js
export const PASSWORD_RULES = [
  { label: "At least 8 characters", message: "...", test: (v) => v.length >= 8 },
  { label: "One uppercase letter",  message: "...", test: (v) => /[A-Z]/.test(v) },
  { label: "One number",            message: "...", test: (v) => /[0-9]/.test(v) },
];
```
- **Zod** builds the password rule from it (`.refine(rule.test, rule.message)` for each).
- **The checklist** loops over it and calls `rule.test(value)` on every keystroke.
→ Add a rule once and both the validation and the checklist update.

**Cross-field rules** (comparing two fields) use `.refine()` on the whole object:
```js
.refine((d) => d.newPassword === d.confirmNewPassword, {
  message: "Passwords do not match.",
  path: ["confirmNewPassword"],   // which field shows the error
})
```

---

### 10. Tweets: post, like, delete, search, draft

**What the user sees:** Home feed. Write a tweet (280-char counter, **Ctrl/Cmd + Enter** to post), like ❤️ (each user has their own likes), retweet 🔁, delete 🗑️ (**only on your own tweets**), search box, and your unfinished tweet is kept as a draft if you leave.

| File | What it does |
|---|---|
| [app/(main)/home/page.jsx](app/(main)/home/page.jsx) | Server page that renders `<Feed />` |
| [components/tweet/Feed.jsx](components/tweet/Feed.jsx) | Header + search + list. Updates the tab title with the tweet count |
| [components/tweet/NewTweet.jsx](components/tweet/NewTweet.jsx) | Text box, counter, auto-focus (`useRef`), draft saved 500 ms after you stop typing |
| [components/tweet/Tweet.jsx](components/tweet/Tweet.jsx) | One tweet card. Retweet is local state; like/delete call the parent |
| [hooks/useTweets.js](hooks/useTweets.js) | **All tweet logic**: list, `addTweet`, `toggleLike`, `deleteTweet` |
| [hooks/useLocalStorage.js](hooks/useLocalStorage.js) | `useState` that also saves to localStorage (hydration-safe) |

**Data flow:**
```
localStorage "tweets"
   ↕ useLocalStorage
useTweets()  ── adds author info, liked, isMine ──►  Feed / ProfileView
   ▲                                                    │
   └──── addTweet / toggleLike / deleteTweet ◄──────────┘ (passed down as props)
```

- **Like per user:** each tweet has `likedBy: [userId, ...]`. `liked` = "is my id in that list?".
- **Delete only own:** `isMine` = `tweet.authorId === user.id`; the 🗑️ button only renders when `isMine`.
- **Search** uses `useMemo` so filtering only re-runs when tweets or the search text change.

> 🔗 **Next.js idea:** the page is a Server Component, the feed is a Client Component ([§4](#4-server-components-vs-client-components)). `useLocalStorage` loads saved data **after** mount to avoid hydration errors ([§5](#5-hydration)).

---

### 11. Dark mode

**What the user sees:** "🌙 Dark mode" in the sidebar and in the toolbar menu. The choice is remembered.

| File | What it does |
|---|---|
| [components/theme/ThemeProvider.jsx](components/theme/ThemeProvider.jsx) | Context with `theme` + `toggleTheme`, saved via `useLocalStorage("theme")`. Sets `data-theme` on a wrapper `<div>` |
| [components/layout/ThemeToggle.jsx](components/layout/ThemeToggle.jsx) | Sidebar button |
| [app/globals.css](app/globals.css) | `[data-theme="dark"] { --app-bg: ...; }` swaps the colour variables |

Components never check the theme themselves — they use `var(--app-bg)`, `var(--app-text)`, ... and the variables change underneath them.

> 🔗 **Next.js idea:** a Server layout ([app/(main)/layout.jsx](app/(main)/layout.jsx)) can wrap its children in a Client provider. Context only works in Client Components, so the provider file has `"use client"`.

---

### 12. Right column: Trends + Who to follow

| File | What it does |
|---|---|
| [components/layout/RightColumn.jsx](components/layout/RightColumn.jsx) | **Server Component**. Puts `<Trends />` and `<WhoToFollow />` side by side, with `<Suspense>` around WhoToFollow |
| [components/layout/Trends.jsx](components/layout/Trends.jsx) | Client. "Show more / Show less" with [useToggle.js](hooks/useToggle.js) |
| [components/layout/WhoToFollow.jsx](components/layout/WhoToFollow.jsx) | **async Server Component** — fetches users from an API **on the server** |
| [components/layout/FollowItem.jsx](components/layout/FollowItem.jsx) | Client. Follow / Following button |

This is the best example of **Server Components with data fetching**:
```jsx
export default async function WhoToFollow() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users?_limit=3", {
    next: { revalidate: 3600 },   // cache it, refresh at most once an hour
  });
  ...
}
```
No `useEffect`, no loading state — the component just `await`s. While it waits, `<Suspense fallback={...}>` in RightColumn shows "Loading...".

> 🔗 **Next.js ideas:** async Server Components, `fetch` caching with `revalidate`, `<Suspense>` for loading UI. Note: a Client Component **can't import** a Server Component, so RightColumn (Server) places both side by side.

---

### 13. Online / Offline badge

[components/tweet/ConnectionStatus.jsx](components/tweet/ConnectionStatus.jsx) — the 🟢 Online / 🔴 Offline badge next to "Home". It uses React's `useSyncExternalStore`, which can subscribe to browser events **and** say what to render on the server (`getServerSnapshot → true`), so there's no hydration mismatch.

---

### 14. 404 page

[app/not-found.jsx](app/not-found.jsx) — a special file name. Next.js shows it automatically for any URL that has no matching page.

---

## Part 3 — Where the data lives

Everything is in **localStorage** (DevTools → Application → Local Storage → `http://localhost:3000`).

| Key | Shape | Written by |
|---|---|---|
| `users` | `[{ id, name, username, email, passwordHash, avatar, bio, createdAt }]` | [authStorage.js](services/authStorage.js) via AuthProvider |
| `session` | `{ userId }` — missing when signed out | [authStorage.js](services/authStorage.js) |
| `tweets` | `[{ id, authorId, name, handle, avatar, text, image, likes, likedBy, ... }]` | [useTweets.js](hooks/useTweets.js) |
| `theme` | `"light"` or `"dark"` | [ThemeProvider.jsx](components/theme/ThemeProvider.jsx) |
| `draft` | unfinished tweet text | [NewTweet.jsx](components/tweet/NewTweet.jsx) |

**Folder roles:**
| Folder | Contains | File type |
|---|---|---|
| `app/` | routes: pages and layouts | `.jsx` |
| `components/<feature>/` | UI components + their `.module.css` | `.jsx` |
| `hooks/` | reusable React hooks (`useTweets`, `useLocalStorage`, `useToggle`) | `.js` |
| `services/` | talking to storage (would talk to an API in a real app) | `.js` |
| `validation/` | Zod schemas | `.js` |
| `data/` | static content | `.js` |

> 💡 **Tip:** to reset the app, run `localStorage.clear()` in the browser console and reload.
>
> 💡 **Multiple tabs:** AuthProvider listens to the browser's `storage` event. Sign out in one tab and the other tabs sign out too.

---

## Part 4 — Beginner gotchas

| Problem | Why it happens | How this project handles it |
|---|---|---|
| `localStorage is not defined` | Code ran on the **server** | Only read it inside `useEffect` (after mount) |
| "Hydration failed" error | First browser render ≠ server HTML | Render a default first, load saved data after mount ([useLocalStorage.js](hooks/useLocalStorage.js)) |
| `useState` / `onClick` error in a component | It's a Server Component | Add `"use client"` at the top — or better, move the interactive part into a small child component |
| `searchParams.registered` is `undefined` | In Next.js 15+ `searchParams` is a **Promise** | `const { registered } = await searchParams;` in an `async` page |
| `metadata` export ignored | `metadata` only works in **Server** components | Keep pages as Server Components; put `"use client"` in child components |
| Two elements with the same `id` after navigating | This project turns on `cacheComponents` in [next.config.mjs](next.config.mjs); Next.js keeps the previous page mounted but **hidden**, so it can come back instantly | Harmless for users; in tests, target the visible element |
| "Is this secure?" | localStorage can be read and edited in DevTools | It's **not**. Real apps hash passwords on the **server** and use **httpOnly cookies** for sessions |

---

## Part 5 — Recipes: how to add things

### Add a new protected page (e.g. `/lists`)
1. Create `app/(main)/lists/page.jsx`:
   ```jsx
   export const metadata = { title: "Lists" };
   export default function ListsPage() {
     return <h1>Lists</h1>;
   }
   ```
2. Add `{ href: "/lists", label: "Lists" }` to `navLinks` in [data/data.js](data/data.js).

That's it — it's inside `(main)`, so it already has the sidebar **and** is protected by AuthGuard.

### Add a new form
1. Write a schema in [validation/schemas.js](validation/schemas.js).
2. In a `"use client"` component:
   ```jsx
   const { register, handleSubmit, setError, formState: { errors } } = useForm({
     resolver: zodResolver(mySchema),
     mode: "onTouched",
     defaultValues: { title: "" },
   });

   <form onSubmit={handleSubmit(onSubmit)} noValidate>
     <TextField id="title" label="Title" error={errors.title} {...register("title")} />
     <SubmitButton>Save</SubmitButton>
   </form>
   ```
3. `onSubmit(values)` only runs when the schema passes. For errors from your own logic, call `setError("field", { message })`.

### Use the signed-in user anywhere
In any Client Component:
```jsx
import { useAuth } from "@/components/auth/AuthProvider";
const { user } = useAuth();   // { id, name, username, avatar, bio, ... } or null
```

### Add a password rule (e.g. "one symbol")
Add one object to `PASSWORD_RULES` in [validation/schemas.js](validation/schemas.js):
```js
{ label: "One symbol", message: "Add at least one symbol.", test: (v) => /[^A-Za-z0-9]/.test(v) },
```
Validation **and** the green checklist both update.
