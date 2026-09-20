import { WeddingSetupForm } from "./wedding-setup-form";

export default function DashboardPage() {
  return <main className="form-shell"><section className="form-panel">
    <p className="eyebrow">Your wedding workspace</p><h1>Begin with the essentials.</h1>
    <p className="landing-copy">Add the couple, date, timezone, and location. You can invite family members and build the rest from there.</p>
    <WeddingSetupForm />
  </section></main>;
}
