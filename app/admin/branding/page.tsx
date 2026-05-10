import { AppShell } from '@/components/AppShell';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function BrandingPage() {
  return (
    <AppShell active="Branding">
      <div className="topbar">
        <div>
          <p className="kicker">Branding and UI/UX</p>
          <h1 className="h1">Theme Options</h1>
          <p className="muted">Choose between three UI/UX directions. This is currently local preview and will save to Supabase later.</p>
        </div>
        <button className="btn accent">Save Theme Later</button>
      </div>

      <div className="card">
        <h2 className="cardTitle">Customer-selectable UI/UX presets</h2>
        <p className="muted">Vaycora Classic, Operations Dark, and Clean Enterprise are built as theme presets.</p>
        <ThemeSwitcher />
      </div>

      <section className="grid two" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="cardTitle">Preview Panel</h2>
          <p className="kicker">OBS Review Card</p>
          <h3>Flagged Monitor Record</h3>
          <p className="muted">This panel uses the same theme variables as the rest of the app.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="pill accent">Flagged</span>
            <span className="pill">Needs Review</span>
            <span className="pill">Asset Linked</span>
          </div>
        </div>
        <div className="card">
          <h2 className="cardTitle">Place Card</h2>
          <p className="muted">Later this room will include logo upload, color pickers, saved theme settings, and customer/org theme assignment.</p>
        </div>
      </section>
    </AppShell>
  );
}
