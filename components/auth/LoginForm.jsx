"use client";

// Sign-in form: React Hook Form + Zod (lib/schemas.js) instead of hand-written
// useState + validate functions. mode "onTouched" = an error shows after the
// user leaves a field, then updates live while they fix it.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/validation/schemas";
import { useAuth } from "./AuthProvider";
import { TextField, PasswordField, FormMessage, SubmitButton } from "@/components/form/FormFields";

// `registeredUsername` is set when we arrive here right after signing up.
export default function LoginForm({ registeredUsername = "" }) {
  const router = useRouter();
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: { email: registeredUsername, password: "" },
  });

  // only runs when the Zod schema passes
  async function onSubmit(values) {
    const result = await signIn(values);
    if (result.error) {
      setError("root", { message: result.error }); // not tied to one field
      return;
    }
    router.push("/home");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormMessage>{errors.root?.message}</FormMessage>
      {registeredUsername && !errors.root && (
        <FormMessage type="success">
          Account created 🎉 Sign in to continue.
        </FormMessage>
      )}

      <TextField
        id="email"
        label="Email"
        placeholder="Email"
        autoComplete="email"
        error={errors.email}
        {...register("email")}
      />

      <PasswordField
        id="password"
        label="Password"
        placeholder="Password"
        autoComplete="current-password"
        error={errors.password}
        {...register("password")}
      />

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </SubmitButton>
    </form>
  );
}
