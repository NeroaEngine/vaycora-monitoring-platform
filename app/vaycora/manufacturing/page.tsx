import { getVaycoraDashboardData } from "@/lib/vaycora/repository";
import { AssetMiniCard, MetricBar, PortalHero, metadataNumber, metadataString } from "../_components/portal-helpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ManufacturingPortalPage() {
  const { assets } = await getVaycoraDashboardData();
  const machines = assets.filter((asset) => metadataString(asset, "machine_state") || asset.displayIdentifier.startsWith("MACH"));

  return (
    <main className="pageFrame" style={{ padding: "28px 18px 46px" }}>
      <PortalHero
        kicker="Manufacturing"
        title="Machine uptime and downtime."
        body="Machine running, stopped, downtime, OEE, production counts, target counts, fault codes, runtime, and service alerts."
        stats={[[String(machines.length), "Machines"], [String(machines.filter((a) => metadataString(a, "machine_state") === "stopped").length), "Stopped"], [String(machines.filter((a) => a.status === "alert").length), "Alerts"], ["OEE", "Production"]]}
      />
      <section className="card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18 }}>
          {machines.map((asset) => (
            <AssetMiniCard key={asset.id} asset={asset}>
              <MetricBar label="OEE" value={metadataNumber(asset, "oee")} />
              <MetricBar label="Battery" value={asset.internalBatteryLevel} />
              <div className="statusRail">
                <div className="statusItem"><span><strong>Machine state</strong><br /><small className="muted">{metadataString(asset, "machine_state") ?? "Unknown"}</small></span><span className="pill warn">State</span></div>
                <div className="statusItem"><span><strong>Downtime</strong><br /><small className="muted">{metadataNumber(asset, "downtime_minutes") ?? 0} minutes</small></span><span className="pill bad">Downtime</span></div>
                <div className="statusItem"><span><strong>Production</strong><br /><small className="muted">{metadataNumber(asset, "production_count") ?? 0} / {metadataNumber(asset, "target_count") ?? 0}</small></span><span className="pill">Count</span></div>
                <div className="statusItem"><span><strong>Fault</strong><br /><small className="muted">{metadataString(asset, "fault_code") ?? "No fault"}</small></span><span className="pill warn">Fault</span></div>
              </div>
            </AssetMiniCard>
          ))}
        </div>
      </section>
    </main>
  );
}
