"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@/validation/schemas";
import { useAuth } from "@/components/auth/AuthProvider";
import { PasswordField, FormMessage, SubmitButton } from "@/components/form/FormFields";

const EMPTY = { currentPassword: "", newPassword: "", confirmNewPassword: "" };

export default function PasswordForm() {
  const { changePassword } = useAuth();
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
    defaultValues: EMPTY,
  });

  // live value -> drives the green ✓ checklist under "New password"
  const newPassword = useWatch({ control, name: "newPassword" });

  async function onSubmit(values) {
    setSaved(false);
    const result = await changePassword(values);
    if (result.error) {
      setError(result.field, { message: result.error }, { shouldFocus: true });
      return;
    }
    reset(EMPTY); // clear the fields
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {saved && <FormMessage type="success">Password updated 🔒</FormMessage>}

      <PasswordField
        id="currentPassword"
        label="Current password"
        autoComplete="current-password"
        error={errors.currentPassword}
        {...register("currentPassword")}
      />
      <PasswordField
        id="newPassword"
        label="New password"
        autoComplete="new-password"
        strengthValue={newPassword}
        error={errors.newPassword}
        {...register("newPassword")}
      />
      <PasswordField
        id="confirmNewPassword"
        label="Confirm new password"
        autoComplete="new-password"
        error={errors.confirmNewPassword}
        {...register("confirmNewPassword")}
      />

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update password"}
      </SubmitButton>
    </form>
  );
}
