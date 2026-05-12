import Link from "next/link";
import { getVaycoraDashboardData } from "@/lib/vaycora/repository";
import type { Asset } from "@/lib/vaycora/types";

function formatAssetType(type: string) {
  return type.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatTime(value?: string) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function getDeviceForAsset(asset: Asset, devices: Awaited<ReturnType<typeof getVaycoraDashboardData>>["devices"]) {
  return devices.find((device) => device.id === asset.assignedDeviceId);
}

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

function barStyle(value?: number) {
  const width = Math.max(0, Math.min(100, value ?? 0));
  return { width: `${width}%` };
}

function statusClass(status: string) {
  if (["active", "running", "online", "clear", "ready"].includes(status)) return "pill good";
  if (["alert", "service_due", "stopped", "offline", "needs action"].includes(status)) return "pill warn";
  return "pill";
}

function WorkMetric({ label, value, suffix = "%" }: { label: string; value?: number; suffix?: string }) {
  return (
    <div style={{ display: "grid", gap: 7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <span className="muted">{label}</span>
        <strong>{typeof value === "number" ? `${Math.round(value)}${suffix}` : "—"}</strong>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,.09)", overflow: "hidden", border: "1px solid var(--color-border)" }}>
        <div style={{ ...barStyle(value), height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--color-gold), #f97316)" }} />
      </div>
    </div>
  );
}

function RentalReadinessCard({ asset }: { asset: Asset }) {
  const score = metadataNumber(asset, "return_readiness_score");
  const fuel = metadataNumber(asset, "fuel_level");
  const requiredFuel = metadataNumber(asset, "required_fuel_level");
  const freshWater = metadataNumber(asset, "fresh_water");
  const requiredFreshWater = metadataNumber(asset, "required_fresh_water");
  const propane = metadataNumber(asset, "propane_level");
  const requiredPropane = metadataNumber(asset, "required_propane_level");
  const grayDumped = metadataBoolean(asset, "gray_water_dumped");
  const blackDumped = metadataBoolean(asset, "black_water_dumped");
  const hoursUntilReturn = metadataNumber(asset, "hours_until_return");
  const customer = metadataString(asset, "rental_customer");
  const alerts = metadataStringArray(asset, "alerts_to_send");

  return (
    <div className="card" style={{ display: "grid", gap: 18, borderColor: "rgba(249,115,22,.42)", background: "linear-gradient(135deg, rgba(249,115,22,.12), rgba(255,255,255,.03))" }}>
      <div className="topbar">
        <div>
          <p className="kicker">Rental Return Readiness</p>
          <h2 className="cardTitle">{asset.name}</h2>
          <p className="muted">{customer ?? "Rental customer"} · due in {hoursUntilReturn ?? "—"} hours</p>
        </div>
        <span className={score && score >= 80 ? "pill good" : "pill warn"}>{score ?? 0}% ready</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
        <WorkMetric label={`Fuel / req ${requiredFuel ?? "—"}%`} value={fuel} />
        <WorkMetric label={`Fresh water / req ${requiredFreshWater ?? "—"}%`} value={freshWater} />
        <WorkMetric label={`Propane / req ${requiredPropane ?? "—"}%`} value={propane} />
        <WorkMetric label="Return readiness" value={score} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <div className="placeholderTag"><strong>{grayDumped ? "Dumped" : "Not dumped"}</strong><br /><span className="muted">Gray water</span></div>
        <div className="placeholderTag"><strong>{blackDumped ? "Dumped" : "Not dumped"}</strong><br /><span className="muted">Black water</span></div>
        <div className="placeholderTag"><strong>{asset.speedMph ?? 0} mph</strong><br /><span className="muted">Current movement</span></div>
        <div className="placeholderTag"><strong>{metadataBoolean(asset, "cleaning_required") ? "Required" : "Clear"}</strong><br /><span className="muted">Cleaning</span></div>
      </div>

      <div className="statusRail">
        {alerts.map((alert) => (
          <div className="statusItem" key={alert}>
            <span><strong>{alert}</strong><br /><small className="muted">Customer notification should be sent before return.</small></span>
            <span className="pill warn">Email</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkboardCard({ asset, device }: { asset: Asset; device?: ReturnType<typeof getDeviceForAsset> }) {
  const fuel = metadataNumber(asset, "fuel_level");
  const propane = metadataNumber(asset, "propane_level");
  const battery = asset.internalBatteryLevel ?? metadataNumber(asset, "asset_battery");
  const fill = metadataNumber(asset, "fill_level");
  const freshWater = metadataNumber(asset, "fresh_water");
  const oilLife = metadataNumber(asset, "oil_life");
  const driverScore = metadataNumber(asset, "driver_score");
  const oee = metadataNumber(asset, "oee");
  const runtime = metadataNumber(asset, "runtime_hours");
  const load = metadataNumber(asset, "load_percent");
  const production = metadataNumber(asset, "production_count");
  const target = metadataNumber(asset, "target_count");
  const productionPct = production && target ? (production / target) * 100 : undefined;
  const machineState = metadataString(asset, "machine_state");
  const powerState = metadataString(asset, "power_state");
  const cameraStatus = metadataString(asset, "camera_status");
  const faultCode = metadataString(asset, "fault_code");
  const rentalMode = metadataBoolean(asset, "rental_mode");

  const mainStatus = rentalMode ? "needs action" : machineState ?? powerState ?? cameraStatus ?? asset.status;

  return (
    <Link href={`/vaycora/assets/${asset.id}`} className="card" style={{ textDecoration: "none", color: "inherit", display: "grid", gap: 18 }}>
      <div className="topbar">
        <div>
          <p className="kicker">{rentalMode ? "Rental Protection" : formatAssetType(asset.assetType)}</p>
          <h3 style={{ fontSize: 24, margin: "4px 0 0" }}>{asset.name}</h3>
          <p className="muted">{asset.displayIdentifier} · {device?.model ?? "No device"}</p>
        </div>
        <span className={statusClass(String(mainStatus))}>{String(mainStatus).replaceAll("_", " ")}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14 }}>
        {typeof fuel === "number" ? <WorkMetric label="Fuel" value={fuel} /> : null}
        {typeof propane === "number" ? <WorkMetric label="Propane" value={propane} /> : null}
        {typeof battery === "number" ? <WorkMetric label="Battery" value={battery} /> : null}
        {typeof fill === "number" ? <WorkMetric label="Fill Level" value={fill} /> : null}
        {typeof freshWater === "number" ? <WorkMetric label="Fresh Water" value={freshWater} /> : null}
        {typeof oilLife === "number" ? <WorkMetric label="Oil Life" value={oilLife} /> : null}
        {typeof driverScore === "number" ? <WorkMetric label="Driver Score" value={driverScore} /> : null}
        {typeof oee === "number" ? <WorkMetric label="OEE" value={oee} /> : null}
        {typeof load === "number" ? <WorkMetric label="Load" value={load} /> : null}
        {typeof productionPct === "number" ? <WorkMetric label="Production" value={productionPct} /> : null}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))", gap: 10 }}>
        {typeof asset.speedMph === "number" ? <div className="placeholderTag"><strong>{Math.round(asset.speedMph)}</strong><br /><span className="muted">mph</span></div> : null}
        {typeof asset.batteryVoltage === "number" ? <div className="placeholderTag"><strong>{asset.batteryVoltage}V</strong><br /><span className="muted">Vehicle battery</span></div> : null}
        {typeof runtime === "number" ? <div className="placeholderTag"><strong>{runtime}</strong><br /><span className="muted">runtime hours</span></div> : null}
        {typeof production === "number" ? <div className="placeholderTag"><strong>{production}</strong><br /><span className="muted">units today</span></div> : null}
        <div className="placeholderTag"><strong>{asset.ignitionStatus ? "On" : asset.ignitionStatus === false ? "Off" : asset.externalPowerStatus ? "Powered" : "—"}</strong><br /><span className="muted">power/ignition</span></div>
      </div>

      {faultCode ? <div className="placeholderTag" style={{ borderColor: "rgba(249,115,22,.45)" }}><strong>Fault:</strong> {faultCode}</div> : null}
    </Link>
  );
}

const portalCards = [
  ["Fleet", "OBD, fuel, ignition, trips, VIN intelligence, video telematics, and vehicle health.", "Enabled"],
  ["Rental Protection", "Required monitoring for managed rentals, insurance reduction, deposits, return readiness, and customer alerts.", "Enabled"],
  ["Assets", "Trailers, containers, equipment, generators, tanks, and battery assets.", "Enabled"],
  ["Sanitation", "Fill, tip, water, site assignment, and service-needed workflows.", "Enabled"],
  ["Manufacturing", "Machine start/stop, runtime, downtime, fault state, OEE, and production counts.", "Planned"],
  ["Video", "ST9730 live view, event clips, ADAS, DMS, and driver score workflows.", "Planned"],
  ["Admin", "Device provisioning, payload debugging, tenants, and integration operations.", "Enabled"],
];

export default async function VaycoraPage() {
  const { tenants, assets, devices, events, rawPayloads, source } = await getVaycoraDashboardData();
  const activeDevices = devices.filter((device) => device.status === "active").length;
  const serviceDueAssets = assets.filter((asset) => asset.status === "service_due" || asset.status === "alert").length;
  const tenant = tenants[0] ?? { name: "Vaycora", slug: "vaycora", status: "trial", enabledPortals: [] };
  const avgFuel = assets.map((asset) => metadataNumber(asset, "fuel_level")).filter((value): value is number => typeof value === "number");
  const avgBattery = assets.map((asset) => asset.internalBatteryLevel ?? metadataNumber(asset, "asset_battery")).filter((value): value is number => typeof value === "number");
  const rentalAssets = assets.filter((asset) => metadataBoolean(asset, "rental_mode"));
  const average = (values: number[]) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

  return (
    <main className="pageFrame" style={{ padding: "28px 18px 46px" }}>
      <section className="heroPanel">
        <div>
          <p className="kicker">Vaycora Workboard</p>
          <h1 className="h1">Operations at a glance.</h1>
          <p className="muted" style={{ maxWidth: 780 }}>
            Managed rentals, fuel, propane, water tanks, gray/black water, machine status, camera status, power, service needs, and live SunTech data.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
            <span className="pill accent">SunTech ingestion live</span>
            <span className="pill">Data source: {source}</span>
            <span className="pill">Tenant: {tenant.name}</span>
            <Link className="pill good" href="/vaycora/admin/payloads">Admin Payloads</Link>
          </div>
        </div>
        <div className="heroMetricGrid">
          <div className="heroMetric"><strong>{assets.length}</strong><span>Assets</span></div>
          <div className="heroMetric"><strong>{activeDevices}</strong><span>Active devices</span></div>
          <div className="heroMetric"><strong>{rentalAssets.length}</strong><span>Rental mode</span></div>
          <div className="heroMetric"><strong>{serviceDueAssets}</strong><span>Need action</span></div>
        </div>
      </section>

      {rentalAssets.length > 0 ? (
        <section className="grid" style={{ marginTop: 24 }}>
          {rentalAssets.map((asset) => <RentalReadinessCard key={asset.id} asset={asset} />)}
        </section>
      ) : null}

      <section className="grid two">
        <div className="card">
          <div className="topbar">
            <div>
              <p className="kicker">Command Map</p>
              <h2 className="cardTitle">Live asset positions</h2>
              <p className="muted">Visual map placeholder with operational pins. Mapbox replaces this next.</p>
            </div>
            <span className={serviceDueAssets > 0 ? "pill warn" : "pill good"}>{serviceDueAssets} need attention</span>
          </div>

          <div style={{ position: "relative", minHeight: 430, marginTop: 22, borderRadius: 28, overflow: "hidden", border: "1px solid var(--color-border)", background: "linear-gradient(135deg, rgba(255,255,255,.07), rgba(255,255,255,.02))" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)", backgroundSize: "46px 46px" }} />
            <div style={{ position: "absolute", left: "18%", top: "58%", width: "72%", height: 8, transform: "rotate(-12deg)", borderRadius: 999, background: "rgba(201,164,92,.28)" }} />
            <div style={{ position: "absolute", left: "52%", top: "14%", width: 8, height: "72%", transform: "rotate(45deg)", borderRadius: 999, background: "rgba(201,164,92,.22)" }} />
            {assets.map((asset, index) => {
              const positions = [
                { left: "38%", top: "45%" },
                { left: "55%", top: "35%" },
                { left: "68%", top: "58%" },
                { left: "46%", top: "66%" },
                { left: "72%", top: "30%" },
                { left: "30%", top: "28%" },
                { left: "61%", top: "72%" },
              ];
              const position = positions[index % positions.length];
              return (
                <Link key={asset.id} href={`/vaycora/assets/${asset.id}`} style={{ position: "absolute", ...position, transform: "translate(-50%, -50%)" }}>
                  <span className="brandIcon" style={{ width: 54, height: 54, fontSize: 18 }}>{asset.assetType === "vehicle" ? "V" : asset.assetType === "porta_potty" ? "P" : asset.assetType === "container" ? "C" : asset.assetType === "generator" ? "G" : asset.assetType === "rv" ? "R" : "M"}</span>
                  <span className="pill" style={{ position: "absolute", left: "50%", top: 62, transform: "translateX(-50%)", whiteSpace: "nowrap" }}>{asset.displayIdentifier}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <aside className="grid">
          <div className="card">
            <p className="kicker">Portal Modules</p>
            <h2 className="cardTitle">One core, many lanes</h2>
            <div className="statusRail" style={{ marginTop: 18 }}>
              {portalCards.map(([title, body, status]) => (
                <div className="statusItem" key={title}>
                  <span><strong>{title}</strong><br /><small className="muted">{body}</small></span>
                  <span className={status === "Enabled" ? "pill good" : "pill warn"}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="card">
        <div className="topbar">
          <div>
            <p className="kicker">Operational Workboard</p>
            <h2 className="cardTitle">Fuel, propane, fill, runtime, cameras, and service status</h2>
          </div>
          <span className="pill accent">{assets.length} cards</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18, marginTop: 18 }}>
          {assets.map((asset) => <WorkboardCard key={asset.id} asset={asset} device={getDeviceForAsset(asset, devices)} />)}
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <p className="kicker">Latest Events</p>
          <div className="statusRail" style={{ marginTop: 16 }}>
            {events.map((event) => {
              const asset = assets.find((item) => item.id === event.assetId);
              return (
                <div className="statusItem" key={event.id}>
                  <span><strong>{event.eventType}</strong><br /><small className="muted">{asset?.name ?? "Unknown"} · {formatTime(event.eventTime)}</small></span>
                  <span className="pill">{event.source}</span>
                </div>
              );
            })}
            {events.length === 0 ? <p className="muted">No events yet. Send a test payload to see events here.</p> : null}
          </div>
        </div>

        <div className="card">
          <div className="topbar">
            <div>
              <p className="kicker">Payload Debugger</p>
              <h2 className="cardTitle">Admin-only technical view</h2>
              <p className="muted">Customer workboards stay clean. Raw payloads and protocol debugging live here.</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
            <Link className="btn secondary" href="/vaycora/admin/payloads">Open Payload Admin</Link>
            <Link className="btn secondary" href="/api/vaycora/db-check">Database Check</Link>
            <span className="pill accent">{rawPayloads.length} recent payloads</span>
          </div>
        </div>
      </section>
    </main>
  );
}
