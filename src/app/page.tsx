export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="landing-panel">
        <p className="eyebrow">Make My Marriage</p>
        <h1>One calm place for every wedding detail.</h1>
        <p className="landing-copy">
          Bring family, events, guests, tasks, and memories into one shared wedding workspace.
        </p>
        <div className="landing-actions">
          <a className="button button-primary" href="/signup">Create your wedding</a>
          <a className="button button-secondary" href="/login">Sign in</a>
        </div>
      </section>
    </main>
  );
}
