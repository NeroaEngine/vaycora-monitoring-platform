import Link from "next/link";
import { getVaycoraDashboardData } from "@/lib/vaycora/repository";
import type { Asset } from "@/lib/vaycora/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function metadataNumber(asset: Asset, key: string) {
  const value = asset.metadata?.[key];
  return typeof value === "number" ? value : undefined;
}

function metadataString(asset: Asset, key: string) {
  const value = asset.metadata?.[key];
  return typeof value === "string" ? value : undefined;
}

function metadataBoolean(asset: Asset, key: string) {
  const value = asset.metadata?.[key];
  return typeof value === "boolean" ? value : undefined;
}

function metadataStringArray(asset: Asset, key: string) {
  const value = asset.metadata?.[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function buildRentalAlerts(asset: Asset) {
  const alerts = metadataStringArray(asset, "alerts_to_send");
  const customer = metadataString(asset, "rental_customer") ?? "Rental customer";
  const email = metadataString(asset, "customer_email") ?? "customer@example.com";

  return alerts.map((alert) => {
    const isGeofence = alert.toLowerCase().includes("geofence");
    const isDump = alert.toLowerCase().includes("dumped");
    const isFuel = alert.toLowerCase().includes("fuel");
    const isWater = alert.toLowerCase().includes("water");
    const isPropane = alert.toLowerCase().includes("propane");
    const severity = isGeofence ? "high" : isDump ? "medium" : "warning";
    const action = isGeofence ? "Notify customer + owner" : isDump ? "Warn customer + flag return fee" : "Send customer reminder";
    const fee = isDump ? "$75 dump fee risk" : isFuel ? "Fuel refill charge risk" : isPropane ? "Propane refill charge risk" : isWater ? "Water refill reminder" : "No fee set";

    return {
      id: `${asset.id}-${alert}`,
      asset,
      alert,
      customer,
      email,
      severity,
      action,
      fee,
    };
  });
}

export default async function RentalAlertsPage() {
  const { assets } = await getVaycoraDashboardData();
  const rentalAssets = assets.filter((asset) => metadataBoolean(asset, "rental_mode"));
  const alerts = rentalAssets.flatMap(buildRentalAlerts);

  return (
    <main className="pageFrame" style={{ padding: "28px 18px 46px" }}>
      <section className="heroPanel">
        <div>
          <p className="kicker">Rental Alert Center</p>
          <h1 className="h1">Protect every rental.</h1>
          <p className="muted" style={{ maxWidth: 780 }}>
            Active rental issues across return readiness, geofence enforcement, fuel, propane, water, dump status, cleaning, and customer notifications.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
            <Link className="pill" href="/vaycora">Back to Workboard</Link>
            <span className="pill accent">Managed rental protection</span>
          </div>
        </div>
        <div className="heroMetricGrid">
          <div className="heroMetric"><strong>{rentalAssets.length}</strong><span>Rental assets</span></div>
          <div className="heroMetric"><strong>{alerts.length}</strong><span>Open alerts</span></div>
          <div className="heroMetric"><strong>{alerts.filter((alert) => alert.severity === "high").length}</strong><span>High priority</span></div>
          <div className="heroMetric"><strong>{rentalAssets.filter((asset) => metadataString(asset, "geofence_status") === "violation").length}</strong><span>Geofence violations</span></div>
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <p className="kicker">Open Workflow</p>
          <h2 className="cardTitle">Customer and owner actions</h2>
          <div className="statusRail" style={{ marginTop: 18 }}>
            {alerts.map((item) => (
              <div className="statusItem" key={item.id} style={{ alignItems: "stretch" }}>
                <span>
                  <strong>{item.asset.displayIdentifier} — {item.alert}</strong><br />
                  <small className="muted">{item.customer} · {item.email} · {item.fee}</small><br />
                  <small className="muted">Recommended action: {item.action}</small>
                </span>
                <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span className={item.severity === "high" ? "pill bad" : item.severity === "medium" ? "pill warn" : "pill"}>{item.severity}</span>
                  <span className="pill warn">Email</span>
                  <span className="pill">Owner</span>
                  <span className="pill">Fee</span>
                </span>
              </div>
            ))}
            {alerts.length === 0 ? <p className="muted">No active rental alerts.</p> : null}
          </div>
        </div>

        <aside className="card">
          <p className="kicker">Managed Services Policy</p>
          <h2 className="cardTitle">Monitoring required</h2>
          <p className="muted">
            For managed rentals, Vaycora monitoring should be required on every high-value unit so the owner has real-time proof of location, fuel, propane, water, tank status, usage, and return condition.
          </p>
          <div className="luxuryDivider" style={{ margin: "18px 0" }} />
          <div className="statusRail">
            <div className="statusItem"><span><strong>Insurance support</strong><br /><small className="muted">Location, geofence, and usage evidence.</small></span><span className="pill good">Proof</span></div>
            <div className="statusItem"><span><strong>Customer disputes</strong><br /><small className="muted">Fuel, dump, propane, and return condition record.</small></span><span className="pill good">Record</span></div>
            <div className="statusItem"><span><strong>Revenue protection</strong><br /><small className="muted">Fee recommendations for missed return requirements.</small></span><span className="pill accent">Fees</span></div>
          </div>
        </aside>
      </section>
    </main>
  );
}
