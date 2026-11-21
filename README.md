# Final Next.js Twitter (Tweetly)

A Next.js (App Router) migration of two earlier class projects:

| Original | Became |
| --- | --- |
| `class 11 - Twitter login page` (HTML + CSS + JS) | `/login` |
| `class 28 - twitter-home-react` (React + Vite + hooks) | `/home` (+ Explore, Notifications, Messages, Bookmarks placeholders) |

> 📘 **New to Next.js?** Read [FEATURES.md](FEATURES.md): it covers every feature, the files that power it, and the Next.js idea behind it.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000  (redirects to /login)
npm run build    # production build
npm run lint
```

## Folder structure

```
app/
  layout.jsx               Root layout (html/body, global CSS, metadata template)
  globals.css              Reset + color variables (light AND dark theme)
  page.jsx                 "/" -> /home if signed in, else /login
  not-found.jsx            404 page
  (auth)/                  Route group - NOT part of the URL
    layout.jsx             Brand panel + form card, guest-only (AuthGuard mode="guest")
    login/page.jsx         /login  (class 11)
    signup/page.jsx        /signup
  (main)/                  Route group with a shared layout (class 28 App.jsx)
    layout.jsx             ThemeProvider + AuthGuard + Sidebar + {children} + RightColumn + Footer
    home/page.jsx          /home
    profile/page.jsx       /profile  - your details, stats and tweets
    settings/page.jsx      /settings - edit profile + change password
    explore/ notifications/ messages/ bookmarks/   placeholder pages
components/                Grouped by feature; each CSS Module sits next to its component
  auth/
    AuthProvider.jsx       "use client" - AuthContext + useAuth(): sign up/in/out, profile, password
    AuthGuard.jsx          "use client" - redirects signed-out users (or signed-in guests)
    LoginForm.jsx          "use client" - React Hook Form + Zod
    SignUpForm.jsx         "use client" - React Hook Form + Zod
  form/
    FormFields.jsx         TextField, PasswordField (show/hide), FormMessage, SubmitButton
  layout/
    Sidebar.jsx, NavLinks.jsx, ThemeToggle.jsx, LogoutButton.jsx, Footer.jsx
    RightColumn.jsx        Server - Trends + <Suspense> around WhoToFollow
    Trends.jsx, TrendItem.jsx
    WhoToFollow.jsx        async SERVER Component - fetches users on the server
    FollowItem.jsx         "use client" - Follow / Following button
  theme/
    ThemeProvider.jsx      "use client" - ThemeContext + useTheme() (dark mode)
  tweet/
    Feed.jsx               "use client" - header (with UserToolbar), search, tweet list
    NewTweet.jsx           "use client" - char counter, draft autosave, Ctrl/Cmd+Enter
    Tweet.jsx              "use client" - retweet, like, delete (own tweets only)
    ConnectionStatus.jsx   "use client" - online/offline badge (useSyncExternalStore)
  user/
    UserAvatar.jsx         picture, or coloured initials as the default avatar
    UserToolbar.jsx        "use client" - avatar dropdown: profile, settings, theme, sign out
    ProfileView.jsx, ProfileSettingsForm.jsx, PasswordForm.jsx
hooks/
  useLocalStorage.js       SSR-safe version of the class 28 hook
  useTweets.js             tweets + add/like/delete, linked to the signed-in user
  useToggle.js
services/
  authStorage.js           users + session in localStorage, SHA-256 password hashing
validation/
  schemas.js               Zod schemas for every form
data/data.js               Seed tweets, trends, nav links, avatar choices
public/images/             Images
```

## What changed in the migration

**Class 11 (HTML/CSS/JS) -> Next.js**
- `index.html` -> `app/(auth)/login/page.jsx`; DOM code (`getElementById`, `addEventListener`) -> React state in `LoginForm.jsx`.

**Class 28 (React + Vite) -> Next.js**
- **`App.jsx` -> `(main)/layout.jsx`.** Sidebar, right column and footer are shared by every page in the group.
- **Server vs Client Components.** Vite renders everything in the browser. In Next.js, components are Server Components by default; only components using state, effects, context or event handlers get `"use client"`.
- **Context must live in a Client Component** -> `ThemeProvider.js`, wrapped around the layout.
- **No `localStorage` / `navigator` during the first render.** The server has no browser APIs, so:
  - `useLocalStorage` starts with the initial value and loads the saved one after mount.
  - `NewTweet` loads the draft in `useEffect`.
  - `ConnectionStatus` uses `useSyncExternalStore` with a server snapshot.
- **Data fetching moved to the server.** `WhoToFollow` was `useEffect` + `fetch` + loading/error state + an `ignore` flag. Now it is an `async` Server Component, with `<Suspense>` for loading and `next: { revalidate: 3600 }` for caching.
- **Active nav item:** `useState('Home')` -> the URL, read with `usePathname()`.
- **Dark mode CSS:** `.app.dark .xyz` rules -> CSS variables swapped by `[data-theme="dark"]` in `globals.css`.
- **`<img>` -> `next/image`**, `<a href>` -> `<Link>`, `document.title` -> `metadata` (Feed still updates it with the tweet count).

## Login rules (demo only - no backend)

- Email or username is required. If it contains `@`, it must be a valid email; otherwise it needs at least 3 characters.
- Password needs at least 6 characters.
- The **Sign in** button stays disabled until both fields are valid. Submitting goes to `/home`.
