import { AppShell } from '@/components/AppShell';

const adminRooms = [
  'Branding settings',
  'Users and roles',
  'OBS review statuses',
  'Asset statuses',
  'Flag reasons',
  'System settings'
];

export default function AdminPage() {
  return (
    <AppShell active="Admin">
      <div className="topbar">
        <div>
          <p className="kicker">Backend Control Room</p>
          <h1 className="h1">Admin</h1>
          <p className="muted">Placeholder admin room for controlling branding, users, roles, review settings, and asset settings.</p>
        </div>
      </div>
      <section className="grid stats">
        {adminRooms.map((room) => (
          <div className="card" key={room}>
            <h2 className="cardTitle">{room}</h2>
            <p className="muted">Place card built. This room will be wired and hardened as needed.</p>
            <span className="pill">Placeholder</span>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
