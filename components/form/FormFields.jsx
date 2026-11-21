"use client";

// Small building blocks so every form looks and behaves the same.
// Use them with React Hook Form like this:
//   <TextField id="name" label="Name" error={errors.name} {...register("name")} />
// `register()` returns { name, onChange, onBlur, ref } - in React 19 `ref` is a
// normal prop, so we can just spread it onto the <input>.
import { useState } from "react";
import { PASSWORD_RULES, meetsAllPasswordRules } from "@/validation/schemas";
import styles from "./Form.module.css";

function FieldShell({ id, label, error, hint, children }) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      {children}
      <div className={styles.fieldFooter}>
        <span className={styles.errorMsg} id={`${id}-error`} role={error ? "alert" : undefined}>
          {error?.message ?? ""}
        </span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    </div>
  );
}

// red border on error, green border when `valid` (error wins)
function inputProps(id, error, valid = false) {
  const state = error ? styles.invalid : valid ? styles.valid : "";
  return {
    id,
    className: `${styles.input} ${state}`,
    "aria-invalid": Boolean(error),
    "aria-describedby": `${id}-error`,
  };
}

// Live list of the password rules: grey ○ until met, green ✓ after.
function PasswordChecklist({ value = "" }) {
  return (
    <ul className={styles.checklist} aria-label="Password requirements">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(value);
        return (
          <li key={rule.label} className={met ? styles.met : ""}>
            <span aria-hidden="true">{met ? "✓" : "○"}</span> {rule.label}
            <span className={styles.srOnly}>{met ? " (done)" : " (not yet)"}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function TextField({ id, label, error, hint, multiline = false, ...rest }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <Tag {...inputProps(id, error)} {...rest} />
    </FieldShell>
  );
}

// Pass `strengthValue` (the live value from useWatch) to show the rule
// checklist and turn the border green once every rule is met.
export function PasswordField({ id, label, error, hint, strengthValue, ...rest }) {
  const [show, setShow] = useState(false);
  const checkStrength = strengthValue !== undefined;
  const strong = checkStrength && meetsAllPasswordRules(strengthValue);

  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className={styles.passwordWrapper}>
        <input type={show ? "text" : "password"} {...inputProps(id, error, strong)} {...rest} />
        <button
          type="button"
          className={styles.togglePassword}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {checkStrength && <PasswordChecklist value={strengthValue} />}
    </FieldShell>
  );
}

export function FormMessage({ type = "error", children }) {
  if (!children) return null;
  return (
    <p className={type === "error" ? styles.formError : styles.formSuccess} role="status">
      {children}
    </p>
  );
}

export function SubmitButton({ children, ...rest }) {
  return (
    <button type="submit" className={styles.btnPrimary} {...rest}>
      {children}
    </button>
  );
}
