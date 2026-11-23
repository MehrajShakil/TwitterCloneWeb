"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/validation/schemas";
import { useAuth } from "./AuthProvider";
import { TextField, PasswordField, FormMessage, SubmitButton } from "@/components/form/FormFields";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // live value -> drives the green ✓ checklist under the password field
  const password = useWatch({ control, name: "password" });

  async function onSubmit(values) {
    const result = await signUp(values);
    if (result.error) {
      // "email already exists" / "username taken" -> show it under that field
      setError(
        result.field ?? "root",
        { message: result.error },
        { shouldFocus: true },
      );
      return;
    }
    // account created -> go and sign in. The username in the URL lets /login
    // show a success message and pre-fill the field.
    router.push(`/login?registered=${encodeURIComponent(values.username)}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormMessage>{errors.root?.message}</FormMessage>

      <TextField
        id="firstName"
        label="First name"
        autoComplete="given-name"
        error={errors.firstName}
        {...register("firstName")}
      />
      <TextField
        id="lastName"
        label="Last name"
        autoComplete="family-name"
        error={errors.lastName}
        {...register("lastName")}
      />
      <TextField
        id="username"
        label="Username"
        placeholder="e.g. jane_doe"
        autoComplete="username"
        error={errors.username}
        {...register("username")}
      />
      <TextField
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email}
        {...register("email")}
      />
      <PasswordField
        id="password"
        label="Password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        strengthValue={password}
        error={errors.password}
        {...register("password")}
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        placeholder="Type it again"
        autoComplete="new-password"
        error={errors.confirmPassword}
        {...register("confirmPassword")}
      />

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </SubmitButton>
    </form>
  );
}
