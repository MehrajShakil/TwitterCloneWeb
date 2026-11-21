"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/validation/schemas";
import { avatarOptions } from "@/data/data";
import { useAuth } from "@/components/auth/AuthProvider";
import UserAvatar from "./UserAvatar";
import { TextField, FormMessage, SubmitButton } from "@/components/form/FormFields";
import styles from "./Settings.module.css";

const BIO_MAX = 160;

export default function ProfileSettingsForm() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    // start with the current values
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
    },
  });

  // live values for the bio counter + avatar preview
  const [name, bio, avatar] = useWatch({ control, name: ["name", "bio", "avatar"] });

  function onSubmit(values) {
    const result = updateProfile(values);
    if (result.error) {
      setError(result.field, { message: result.error }, { shouldFocus: true });
      return;
    }
    reset(values); // the saved values become the new "clean" state
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {saved && !isDirty && <FormMessage type="success">Profile saved ✅</FormMessage>}

      <fieldset className={styles.avatarPicker}>
        <legend>Profile picture</legend>
        <div className={styles.avatarOptions}>
          {["", ...avatarOptions].map((option) => (
            <label
              key={option || "initials"}
              className={`${styles.avatarOption} ${avatar === option ? styles.selected : ""}`}
              title={option ? "Use this picture" : "Use my initials"}
            >
              <input type="radio" value={option} {...register("avatar")} />
              <UserAvatar user={{ name: name || user.name, username: user.username, avatar: option }} size={56} />
            </label>
          ))}
        </div>
      </fieldset>

      <TextField id="name" label="Name" autoComplete="name" error={errors.name} {...register("name")} />
      <TextField
        id="username"
        label="Username"
        autoComplete="username"
        error={errors.username}
        {...register("username")}
      />
      <TextField
        id="bio"
        label="Bio"
        multiline
        rows={3}
        placeholder="Tell people a little about yourself"
        hint={`${bio?.length ?? 0} / ${BIO_MAX}`}
        error={errors.bio}
        {...register("bio")}
      />

      <SubmitButton disabled={!isDirty || isSubmitting}>Save changes</SubmitButton>
    </form>
  );
}
