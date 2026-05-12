export const dynamic = "force-dynamic";
export const revalidate = 0;

const colorPresets = [
  { name: "Vaycora Green", primary: "#123c2b", accent: "#e96f12", background: "Dark" },
  { name: "Clean White", primary: "#102a24", accent: "#2563eb", background: "White" },
  { name: "Rental Blue", primary: "#102a43", accent: "#0ea5e9", background: "White" },
  { name: "Equipment Orange", primary: "#1f2937", accent: "#f97316", background: "Light" },
  { name: "Industrial Gray", primary: "#111827", accent: "#f59e0b", background: "Light" },
];

export default function BrandSettingsPage() {
  return (
    <main className="pageFrame" style={{ padding: "28px 18px 46px" }}>
      <section className="card" style={{ background: "#fff", color: "#111827", borderColor: "rgba(17,24,39,.12)" }}>
        <div className="topbar">
          <div>
            <p className="kicker" style={{ color: "#9a5a00" }}>Brand Settings</p>
            <h1 style={{ margin: "6px 0 8px", fontSize: 42, letterSpacing: "-0.055em" }}>Customize the portal</h1>
            <p style={{ color: "#4b5563", margin: 0, maxWidth: 760 }}>
              Simple white-label controls for logo, name, color, background, and portal style. This page is intentionally plain so it is easy to use.
            </p>
          </div>
          <span className="pill accent">Temporary settings room</span>
        </div>
      </section>

      <section className="grid two">
        <div className="card" style={{ background: "#fff", color: "#111827", borderColor: "rgba(17,24,39,.12)" }}>
          <p className="kicker" style={{ color: "#9a5a00" }}>Step 1</p>
          <h2 className="cardTitle">Basic brand information</h2>
          <div className="formGrid" style={{ marginTop: 18 }}>
            <label style={{ color: "#374151" }}>
              Company / portal name
              <input defaultValue="Vaycora Demo Operations" style={{ background: "#fff", color: "#111827", borderColor: "#d1d5db" }} />
            </label>
            <label style={{ color: "#374151" }}>
              Short name shown in header
              <input defaultValue="Vaycora" style={{ background: "#fff", color: "#111827", borderColor: "#d1d5db" }} />
            </label>
            <label style={{ color: "#374151" }}>
              Logo upload
              <input type="file" style={{ background: "#fff", color: "#111827", borderColor: "#d1d5db" }} />
            </label>
            <label style={{ color: "#374151" }}>
              Portal type
              <select defaultValue="rental" style={{ background: "#fff", color: "#111827", borderColor: "#d1d5db" }}>
                <option value="rental">Rental Protection</option>
                <option value="fleet">Fleet</option>
                <option value="assets">Assets</option>
                <option value="sanitation">Sanitation</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="video">Video Telematics</option>
              </select>
            </label>
          </div>
        </div>

        <div className="card" style={{ background: "#fff", color: "#111827", borderColor: "rgba(17,24,39,.12)" }}>
          <p className="kicker" style={{ color: "#9a5a00" }}>Step 2</p>
          <h2 className="cardTitle">Colors and background</h2>
          <div className="formGrid" style={{ marginTop: 18 }}>
            <label style={{ color: "#374151" }}>
              Primary color
              <input type="color" defaultValue="#123c2b" style={{ background: "#fff", color: "#111827", borderColor: "#d1d5db" }} />
            </label>
            <label style={{ color: "#374151" }}>
              Accent color
              <input type="color" defaultValue="#e96f12" style={{ background: "#fff", color: "#111827", borderColor: "#d1d5db" }} />
            </label>
            <label style={{ color: "#374151" }}>
              Background
              <select defaultValue="white" style={{ background: "#fff", color: "#111827", borderColor: "#d1d5db" }}>
                <option value="white">White</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label style={{ color: "#374151" }}>
              Dashboard style
              <select defaultValue="simple" style={{ background: "#fff", color: "#111827", borderColor: "#d1d5db" }}>
                <option value="simple">Simple</option>
                <option value="operations">Operations</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="card" style={{ background: "#fff", color: "#111827", borderColor: "rgba(17,24,39,.12)" }}>
        <div className="topbar">
          <div>
            <p className="kicker" style={{ color: "#9a5a00" }}>Step 3</p>
            <h2 className="cardTitle">Quick color presets</h2>
            <p style={{ color: "#4b5563", marginTop: 0 }}>These are simple choices. Later we will make clicking one apply it automatically.</p>
          </div>
          <span className="pill warn">Preview only</span>
        </div>
        <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
          {colorPresets.map((preset) => (
            <div key={preset.name} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 14, alignItems: "center", padding: 16, border: "1px solid #e5e7eb", borderRadius: 18, background: "#f9fafb" }}>
              <div>
                <strong>{preset.name}</strong><br />
                <span style={{ color: "#6b7280" }}>{preset.background} background</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ width: 34, height: 34, borderRadius: 999, background: preset.primary, border: "1px solid #d1d5db" }} />
                <span style={{ width: 34, height: 34, borderRadius: 999, background: preset.accent, border: "1px solid #d1d5db" }} />
              </div>
              <button className="btn secondary" style={{ color: "#111827", borderColor: "#d1d5db" }}>Use preset</button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid two">
        <div className="card" style={{ background: "#fff", color: "#111827", borderColor: "rgba(17,24,39,.12)" }}>
          <p className="kicker" style={{ color: "#9a5a00" }}>Preview</p>
          <h2 className="cardTitle">Header preview</h2>
          <div style={{ marginTop: 18, padding: 18, borderRadius: 18, border: "1px solid #e5e7eb", background: "#f9fafb", display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ width: 54, height: 54, borderRadius: 14, background: "#123c2b", color: "#fff", display: "grid", placeItems: "center", fontWeight: 900 }}>V</span>
            <span>
              <strong>Vaycora Demo Operations</strong><br />
              <small style={{ color: "#6b7280" }}>Rental Protection Portal</small>
            </span>
          </div>
        </div>

        <div className="card" style={{ background: "#fff", color: "#111827", borderColor: "rgba(17,24,39,.12)" }}>
          <p className="kicker" style={{ color: "#9a5a00" }}>Save</p>
          <h2 className="cardTitle">Apply changes</h2>
          <p style={{ color: "#4b5563" }}>This page is now cleaned up. Next build step will make these fields save to the database and apply the selected theme to the customer portal.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <button className="btn accent">Save brand settings</button>
            <button className="btn secondary" style={{ color: "#111827", borderColor: "#d1d5db" }}>Reset</button>
          </div>
        </div>
      </section>
    </main>
  );
}
