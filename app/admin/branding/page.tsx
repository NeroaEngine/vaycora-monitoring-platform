import { AppShell } from '@/components/AppShell';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function BrandingPage() {
  return (
    <AppShell active="Branding">
      <section className="heroPanel">
        <div>
          <p className="kicker">White-Label Brand Control</p>
          <h1 className="h1">Control the customer-facing brand layer.</h1>
          <p className="muted" style={{ maxWidth: 640 }}>
            Update the brand name, product name, uploaded logo preview, color preset, and luxury theme controls from one room.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
            <span className="pill accent">Brand controls active</span>
            <span className="pill">Local preview</span>
            <span className="pill">Supabase save later</span>
          </div>
        </div>

        <div className="heroMetricGrid">
          <div className="heroMetric"><strong>Name</strong><span>Brand text input</span></div>
          <div className="heroMetric"><strong>Logo</strong><span>Upload preview</span></div>
          <div className="heroMetric"><strong>Color</strong><span>Dropdown controls</span></div>
          <div className="heroMetric"><strong>Theme</strong><span>Luxury presets</span></div>
        </div>
      </section>

      <section className="card">
        <div className="topbar">
          <div>
            <p className="kicker">Live Branding Controls</p>
            <h2 className="cardTitle">Brand name, logo, and color settings</h2>
            <p className="muted">
              These controls update the app locally now. Later this same room will save brand settings to Supabase per customer/organization.
            </p>
          </div>
          <button className="btn accent">Save to Supabase Later</button>
        </div>
        <div style={{ marginTop: 18 }}>
          <ThemeSwitcher />
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <p className="kicker">Preview Panel</p>
          <h2 className="cardTitle">Customer-facing module preview</h2>
          <p className="muted">This panel uses the same theme variables as the dashboard, assets, admin, and OBS review rooms.</p>
          <div className="luxuryDivider" style={{ margin: '18px 0' }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="pill accent">Premium brand</span>
            <span className="pill">Asset linked</span>
            <span className="pill warn">Needs review</span>
          </div>
        </div>

        <div className="card">
          <p className="kicker">Lane 0 Status</p>
          <h2 className="cardTitle">Brand room hardening</h2>
          <div className="statusRail">
            <div className="statusItem"><span>Brand name input</span><span className="pill good">Built</span></div>
            <div className="statusItem"><span>Product name input</span><span className="pill good">Built</span></div>
            <div className="statusItem"><span>Logo upload preview</span><span className="pill good">Built</span></div>
            <div className="statusItem"><span>Color dropdowns</span><span className="pill good">Built</span></div>
            <div className="statusItem"><span>Customer/org save</span><span className="pill">Later</span></div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
