import { EventForm } from "./event-form";

export default function EventsPage() {
  return <main className="form-shell"><section className="form-panel">
    <p className="eyebrow">Wedding planning</p><h1>Add your first event.</h1>
    <p className="landing-copy">Start with the ceremonies and celebrations your family will coordinate together.</p>
    <EventForm />
  </section></main>;
}
