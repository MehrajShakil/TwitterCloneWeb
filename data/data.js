// All the content of the page lives here as plain JavaScript data (from class 28).
// The components only decide HOW it looks - change the data, and the page changes.

export const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/notifications", label: "Notifications" },
  { href: "/messages", label: "Messages" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

// The signed-in user now comes from useAuth() (localStorage), not from here.
// These are the preset pictures a user can pick on the Settings page
// ("" = no picture -> show their initials).
export const avatarOptions = [
  "/images/avatar1.jpg",
  "/images/avatar2.jpg",
  "/images/avatar3.jpg",
  "/images/avatar4.jpg",
];

// next/image needs width + height for local images, so `image` is an object here
// (in class 28 it was just a string).
export const tweets = [
  {
    id: 2,
    name: "John Doe",
    handle: "@John",
    avatar: "/images/avatar2.jpg",
    text: "This is a sample tweet. #HelloWorld",
    image: { src: "/images/post1.jpg", width: 500, height: 300 },
    replies: 4,
    retweets: 2,
    likes: 20,
    liked: false,
  },
  {
    id: 3,
    name: "John Doe",
    handle: "@John",
    avatar: "/images/avatar2.jpg",
    text: "This is a sample tweet 2. #HelloWorld",
    image: { src: "/images/post1.jpg", width: 500, height: 300 },
    replies: 40,
    retweets: 20,
    likes: 200,
    liked: false,
  },
];

export const trends = [
  { id: 1, category: "WorldCup2024", name: "FIFA World Cup 2024", count: "1.2M Tweets" },
  { id: 2, category: "Technology", name: "React 19", count: "845K Tweets" },
  { id: 3, category: "Programming", name: "ASP.NET Core", count: "320K Tweets" },
];
