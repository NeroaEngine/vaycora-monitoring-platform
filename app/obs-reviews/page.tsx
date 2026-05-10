import { AppShell } from '@/components/AppShell';
import { ReviewTable } from '@/components/ReviewTable';

export default function ObsReviewsPage() {
  return (
    <AppShell active="OBS Reviews">
      <div className="topbar">
        <div>
          <p className="kicker">Review Data Workflow</p>
          <h1 className="h1">OBS Reviews</h1>
          <p className="muted">Live review queue placeholder for new, in review, flagged, cleared, escalated, and archived records.</p>
        </div>
        <button className="btn accent">Add Placeholder Review</button>
      </div>
      <div className="card">
        <ReviewTable />
      </div>
    </AppShell>
  );
}
