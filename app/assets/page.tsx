import { AppShell } from '@/components/AppShell';
import { AssetTable } from '@/components/AssetTable';

export default function AssetsPage() {
  return (
    <AppShell active="Assets">
      <section className="heroPanel">
        <div>
          <p className="kicker">Asset Registry</p>
          <h1 className="h1">Every monitored thing starts here.</h1>
          <p className="muted" style={{ maxWidth: 620 }}>
            Core asset room for OBS monitors, RVs, containers, porta-potties, livestock trackers, fleet vehicles, gateways, and sensor kits.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
            <span className="pill accent">Lane 2 placeholder</span>
            <span className="pill">Hardware agnostic</span>
            <span className="pill">Ready for Supabase schema</span>
          </div>
        </div>

        <div className="heroMetricGrid">
          <div className="heroMetric"><strong>09</strong><span>Asset types planned</span></div>
          <div className="heroMetric"><strong>01</strong><span>Unified registry</span></div>
          <div className="heroMetric"><strong>00</strong><span>Hard-coded vendor locks</span></div>
          <div className="heroMetric"><strong>Next</strong><span>Asset detail room</span></div>
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <div className="topbar">
            <div>
              <p className="kicker">Live Table Placeholder</p>
              <h2 className="cardTitle">Asset inventory</h2>
              <p className="muted">This room will become the central list for all physical assets and linked monitor packages.</p>
            </div>
            <button className="btn accent">Add Placeholder Asset</button>
          </div>
          <div style={{ marginTop: 16 }}>
            <AssetTable />
          </div>
        </div>

        <div className="card">
          <p className="kicker">Harden Tree</p>
          <h2 className="cardTitle">What this lane needs next</h2>
          <div className="statusRail">
            <div className="statusItem"><span>Asset list UI</span><span className="pill good">Built</span></div>
            <div className="statusItem"><span>Asset detail page</span><span className="pill">Next</span></div>
            <div className="statusItem"><span>Asset schema</span><span className="pill">Supabase</span></div>
            <div className="statusItem"><span>Archive/no hard delete flow</span><span className="pill warn">Planned</span></div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
