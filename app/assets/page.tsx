import { AppShell } from '@/components/AppShell';
import { AssetTable } from '@/components/AssetTable';

export default function AssetsPage() {
  return (
    <AppShell active="Assets">
      <div className="topbar">
        <div>
          <p className="kicker">Basic Asset Tracking</p>
          <h1 className="h1">Assets</h1>
          <p className="muted">Live asset table placeholder for physical OBS assets, linked monitors, status, condition, and future fleet IDs.</p>
        </div>
        <button className="btn accent">Add Placeholder Asset</button>
      </div>
      <div className="card">
        <AssetTable />
      </div>
    </AppShell>
  );
}
