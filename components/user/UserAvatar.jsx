import Image from "next/image";
import styles from "./UserAvatar.module.css";

// Shows the user's picture, or - if they haven't picked one - a coloured circle
// with their initials (the "default avatar").
// `user` only needs { name, avatar } (+ optional username for the colour).

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Same text -> same colour, every time.
function colorFor(text = "") {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return `hsl(${hash} 55% 45%)`;
}

export default function UserAvatar({ user, size = 45 }) {
  const box = { width: size, height: size, minWidth: size };

  if (user?.avatar) {
    return (
      <Image
        src={user.avatar}
        alt={`${user.name}'s profile picture`}
        width={size}
        height={size}
        className={styles.avatar}
        style={box}
      />
    );
  }

  return (
    <span
      className={styles.initials}
      style={{ ...box, fontSize: size * 0.4, backgroundColor: colorFor(user?.username ?? user?.name) }}
      role="img"
      aria-label={`${user?.name ?? "User"}'s profile picture`}
    >
      {getInitials(user?.name)}
    </span>
  );
}
