import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayloadDetailData } from "@/lib/vaycora/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatTime(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function prettyJson(value: unknown) {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  return JSON.stringify(value, null, 2);
}

export default async function PayloadDetailPage({ params }: { params: Promise<{ payloadId: string }> }) {
  const { payloadId } = await params;
  const data = await getPayloadDetailData(payloadId);

  if (!data) notFound();

  const { payload, events, locations } = data;

  return (
    <main className="pageFrame" style={{ padding: "28px 18px 46px" }}>
      <section className="heroPanel">
        <div>
          <Link href="/vaycora/admin/payloads" className="pill">← Back to Payloads</Link>
          <p className="kicker" style={{ marginTop: 24 }}>Payload Detail</p>
          <h1 className="h1">{payload.id}</h1>
          <p className="muted" style={{ maxWidth: 760 }}>
            Raw SunTech message, parser status, matched device, matched asset, generated events, and location history writes.
          </p>
        </div>
        <div className="heroMetricGrid">
          <div className="heroMetric"><strong>{payload.parseStatus}</strong><span>Parse status</span></div>
          <div className="heroMetric"><strong>{payload.eventCount}</strong><span>Events</span></div>
          <div className="heroMetric"><strong>{payload.locationCount}</strong><span>Locations</span></div>
          <div className="heroMetric"><strong>{payload.ackSent ? "Yes" : "No"}</strong><span>ACK sent</span></div>
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <p className="kicker">Matched Data</p>
          <h2 className="cardTitle">Device and asset</h2>
          <div className="statusRail" style={{ marginTop: 18 }}>
            <div className="statusItem"><span><strong>Device Identifier</strong><br /><small className="muted">IMEI or SunTech device ID</small></span><span className="pill">{payload.deviceIdentifier ?? "unknown"}</span></div>
            <div className="statusItem"><span><strong>Device</strong><br /><small className="muted">Matched device record</small></span><span className="pill">{payload.deviceModel ?? payload.deviceId ?? "unmatched"}</span></div>
            <div className="statusItem"><span><strong>Asset</strong><br /><small className="muted">Assigned tracked object</small></span><span className="pill accent">{payload.assetName ?? "unmatched"}</span></div>
            <div className="statusItem"><span><strong>Received</strong><br /><small className="muted">Server receive time</small></span><span className="pill">{formatTime(payload.receivedAt)}</span></div>
          </div>
        </div>

        <div className="card">
          <p className="kicker">Source</p>
          <h2 className="cardTitle">Transport metadata</h2>
          <div className="statusRail" style={{ marginTop: 18 }}>
            <div className="statusItem"><span><strong>Provider</strong></span><span className="pill">{payload.provider}</span></div>
            <div className="statusItem"><span><strong>Format</strong></span><span className="pill">{payload.payloadFormat}</span></div>
            <div className="statusItem"><span><strong>Source IP</strong></span><span className="pill">{payload.sourceIp ?? "unknown"}</span></div>
            <div className="statusItem"><span><strong>Parsed At</strong></span><span className="pill">{formatTime(payload.parsedAt)}</span></div>
          </div>
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <p className="kicker">Raw Payload</p>
          <h2 className="cardTitle">Original message</h2>
          <pre className="placeholderTag" style={{ overflow: "auto", whiteSpace: "pre-wrap", marginTop: 16 }}>{prettyJson(payload.rawPayload)}</pre>
        </div>

        <div className="card">
          <p className="kicker">Parse Error</p>
          <h2 className="cardTitle">Error state</h2>
          <pre className="placeholderTag" style={{ overflow: "auto", whiteSpace: "pre-wrap", marginTop: 16 }}>{payload.parseError ?? "No parse error."}</pre>
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <p className="kicker">Generated Events</p>
          <h2 className="cardTitle">Event records</h2>
          <div className="statusRail" style={{ marginTop: 18 }}>
            {events.map((event) => (
              <div className="statusItem" key={event.id}>
                <span><strong>{event.eventType}</strong><br /><small className="muted">{formatTime(event.eventTime)} · {event.id}</small></span>
                <span className="pill">{event.source}</span>
              </div>
            ))}
            {events.length === 0 ? <p className="muted">No events were generated for this payload.</p> : null}
          </div>
        </div>

        <div className="card">
          <p className="kicker">Location History</p>
          <h2 className="cardTitle">GPS writes</h2>
          <div className="statusRail" style={{ marginTop: 18 }}>
            {locations.map((location) => (
              <div className="statusItem" key={location.id}>
                <span><strong>{location.latitude}, {location.longitude}</strong><br /><small className="muted">{formatTime(location.recorded_at)} · speed {location.speed ?? 0}</small></span>
                <span className="pill">{location.id}</span>
              </div>
            ))}
            {locations.length === 0 ? <p className="muted">No location row was generated for this payload.</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
