"use client";

import { useState } from "react";

export function EventForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setMessage("");
    const start = `${formData.get("date")}T${formData.get("startTime")}:00+05:30`;
    const endTime = formData.get("endTime");
    const response = await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.get("name"), type: "CUSTOM", startsAt: start, endsAt: endTime ? `${formData.get("date")}T${endTime}:00+05:30` : null, venueName: formData.get("venueName") }) });
    const payload = await response.json();
    setPending(false);
    setMessage(response.ok ? "Event added to your wedding." : payload.error?.message ?? "Unable to add event.");
  }

  return <form action={submit} className="setup-form">
    <label>Event name<input name="name" placeholder="Mehendi" required /></label>
    <label>Date<input name="date" type="date" required /></label>
    <label>Start time<input name="startTime" type="time" required /></label>
    <label>End time<input name="endTime" type="time" /></label>
    <label>Venue<input name="venueName" placeholder="Royal Garden" /></label>
    {message && <p className="form-message">{message}</p>}
    <button className="button button-primary" disabled={pending}>{pending ? "Adding..." : "Add event"}</button>
  </form>;
}
