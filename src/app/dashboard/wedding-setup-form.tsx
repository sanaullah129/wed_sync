"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function WeddingSetupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const response = await fetch("/api/wedding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brideName: formData.get("brideName"), groomName: formData.get("groomName"), weddingDate: formData.get("weddingDate"), timeZone: formData.get("timeZone"), location: { city: formData.get("city") } }) });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) { setError(payload.error?.message ?? "Unable to create wedding."); return; }
    router.push("/events");
  }

  return <form action={submit} className="setup-form">
    <label>Bride&apos;s name<input name="brideName" required /></label>
    <label>Groom&apos;s name<input name="groomName" required /></label>
    <label>Wedding date<input name="weddingDate" type="date" required /></label>
    <label>Timezone<input name="timeZone" defaultValue="Asia/Kolkata" required /></label>
    <label>City<input name="city" placeholder="Dehradun" /></label>
    {error && <p className="form-error">{error}</p>}
    <button className="button button-primary" disabled={pending}>{pending ? "Creating..." : "Create wedding"}</button>
  </form>;
}
