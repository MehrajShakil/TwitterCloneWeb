import { z } from "zod";
import { avatarOptions } from "@/data/data";

// Zod schemas = the rules for every form, in one place.
// React Hook Form runs them through zodResolver() and shows the messages.

// ---- reusable field rules ----
const name = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters.")
  .max(50, "Name must be at most 50 characters.");

const username = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(15, "Username must be at most 15 characters.")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and _ are allowed.");

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required.")
  .email("Please enter a valid email address.");

// Password rules live in ONE list: Zod uses it to validate, and the
// <PasswordChecklist /> uses it to show ✓ / ○ while the user types.
export const PASSWORD_RULES = [
  { label: "At least 8 characters", message: "Password must be at least 8 characters.", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", message: "Add at least one uppercase letter.", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", message: "Add at least one number.", test: (v) => /[0-9]/.test(v) },
];

export function meetsAllPasswordRules(value = "") {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}

// z.string().refine(rule 1).refine(rule 2)...
const strongPassword = PASSWORD_RULES.reduce(
  (schema, rule) => schema.refine(rule.test, rule.message),
  z.string(),
);

// ---- form schemas ----
export const signInSchema = z.object({
  email: z.string().trim().min(1, "Email or username is required."),
  password: z.string().min(1, "Password is required."),
});

export const signUpSchema = z
  .object({
    firstName: name,
    lastName: name,
    username,
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  firstName: name,
  lastName: name,
  username,
  bio: z.string().trim().max(160, "Bio must be at most 160 characters."),
  avatar: z.enum(["", ...avatarOptions]),
});


export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: strongPassword,
    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from the current one.",
    path: ["newPassword"],
  });
