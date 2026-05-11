import { AppShell } from '@/components/AppShell';

const adminRooms = [
  { title: 'Branding settings', status: 'Active', note: 'Name, logo, and color controls are in progress.' },
  { title: 'Users and roles', status: 'Next lane', note: 'Supabase Auth, organizations, and permissions.' },
  { title: 'OBS review statuses', status: 'Planned', note: 'Workflow statuses and review decisions.' },
  { title: 'Asset statuses', status: 'Planned', note: 'Asset states, archive flow, and condition values.' },
  { title: 'Flag reasons', status: 'Planned', note: 'Reusable alert and review flag reasons.' },
  { title: 'System settings', status: 'Planned', note: 'Platform defaults and admin-only controls.' }
];

export default function AdminPage() {
  return (
    <AppShell active="Admin">
      <section className="heroPanel">
        <div>
          <p className="kicker">Backend Control Room</p>
          <h1 className="h1">Control the platform from one room.</h1>
          <p className="muted" style={{ maxWidth: 620 }}>
            Admin command layer for branding, users, roles, review settings, asset statuses, flag reasons, and system controls.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
            <span className="pill accent">Admin shell</span>
            <span className="pill">White-label controls</span>
            <span className="pill">Roles next</span>
          </div>
        </div>

        <div className="heroMetricGrid">
          <div className="heroMetric"><strong>06</strong><span>Admin rooms</span></div>
          <div className="heroMetric"><strong>01</strong><span>Branding active</span></div>
          <div className="heroMetric"><strong>Next</strong><span>Auth and roles</span></div>
          <div className="heroMetric"><strong>RLS</strong><span>Supabase later</span></div>
        </div>
      </section>

      <section className="grid three">
        {adminRooms.map((room) => (
          <div className="card" key={room.title}>
            <p className="kicker">{room.status}</p>
            <h2 className="cardTitle">{room.title}</h2>
            <p className="muted">{room.note}</p>
            <span className="pill">Place card</span>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
