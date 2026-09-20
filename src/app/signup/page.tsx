"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const response = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData)) });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) { setError(payload.error?.message ?? "Unable to create account."); return; }
    router.push("/dashboard");
  }

  return <main className="form-shell"><form className="form-panel" action={submit}>
    <p className="eyebrow">Make My Marriage</p><h1>Create your account</h1>
    <label>Name<input name="name" required maxLength={120} /></label>
    <label>Email<input name="email" type="email" required /></label>
    <label>Password<input name="password" type="password" minLength={8} required /></label>
    {error && <p className="form-error">{error}</p>}
    <button className="button button-primary" disabled={pending}>{pending ? "Creating..." : "Create account"}</button>
    <a className="form-link" href="/login">Already have an account? Sign in</a>
  </form></main>;
}
