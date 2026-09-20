"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData)) });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) { setError(payload.error?.message ?? "Unable to sign in."); return; }
    router.push("/dashboard");
  }

  return <main className="form-shell"><form className="form-panel" action={submit}>
    <p className="eyebrow">Make My Marriage</p><h1>Welcome back</h1>
    <label>Email<input name="email" type="email" required /></label>
    <label>Password<input name="password" type="password" required /></label>
    {error && <p className="form-error">{error}</p>}
    <button className="button button-primary" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</button>
    <a className="form-link" href="/signup">Need an account? Sign up</a>
  </form></main>;
}
