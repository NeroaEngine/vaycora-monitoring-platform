import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="loginPage">
      <section className="loginCard">
        <div className="loginHero">
          <div className="brandMark">
            <span className="brandIcon">VM</span>
            <span>Vaycora Monitoring</span>
          </div>
          <h1 className="h1">OBS monitor review, asset visibility, and admin control.</h1>
          <p>
            Placeholder authentication surface. This is the front door before reviewers enter the monitoring dashboard.
          </p>
          <div className="placeholderTag" style={{ marginTop: 24 }}>
            Room status: Login/auth architecture is built as a placeholder and ready for Supabase Auth wiring.
          </div>
        </div>
        <div className="loginForm">
          <div>
            <p className="kicker">Authentication</p>
            <h2>Sign in to continue</h2>
            <p className="muted">Demo form for now. It will connect to Supabase Auth when we harden this room.</p>
          </div>
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Password" type="password" />
          <Link href="/dashboard" className="btn accent" style={{ textAlign: 'center' }}>Enter Dashboard</Link>
        </div>
      </section>
    </main>
  );
}
