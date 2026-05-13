import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AlertTriangle, Bell, CheckCircle2, CircleDot, ClipboardList, Droplets, Gauge, MapPin, PackageCheck, Plus, Radio, Save, Search, ShieldCheck, Truck, Wifi, Wrench, X } from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "vcore-recorder-v02";

const seedAssets = [
  { id: "RV-001", name: "Demo RV Fleet Unit", type: "RV", status: "ready", installStatus: "testing", priority: "medium", location: "Orlando Storage Lot", lastSeen: "2 min ago", device: "ST6560 OBDII + TPMS", nextAction: "Verify propane and tank sensor mounting plan.", sensors: { propane: "68%", fresh: "72%", gray: "31%", black: "19%", generatorHours: "142.7 h", tirePressure: "OK", battery: "12.7V" }, alerts: [], notes: [{ at: "2026-05-12 09:15", text: "RV MVP lane: propane, tanks, generator hours, tire pressure, location." }] },
  { id: "PP-014", name: "Porta-Potty Jobsite A", type: "Porta-Potty", status: "attention", installStatus: "parts needed", priority: "high", location: "Jobsite A - North Gate", lastSeen: "7 min ago", device: "ST4955LCBW Solar Node", nextAction: "Order one ultrasonic fill sensor and test threshold alert at 80 percent.", sensors: { fill: "82%", doorCount: "56 today", temp: "91F", tip: "Upright", battery: "91% solar" }, alerts: ["Service soon: fill level over 80 percent"], notes: [{ at: "2026-05-12 10:40", text: "Use ST4955 as solar node. Add ultrasonic fill level and door reed switch." }] },
  { id: "COW-007", name: "Cow Collar Prototype", type: "Cattle", status: "prototype", installStatus: "prototype", priority: "medium", location: "Test Pasture", lastSeen: "18 min ago", device: "ST4280 Collar Test", nextAction: "Run collar rotation and GPS quality test before buying multiples.", sensors: { gps: "Reporting", motion: "Normal", collar: "Mounted top/back neck", battery: "Long-life primary" }, alerts: [], notes: [{ at: "2026-05-12 11:05", text: "Prototype only. Test collar rotation, GPS quality, battery behavior, animal safety." }] },
  { id: "TR-022", name: "Rental Trailer", type: "Asset", status: "ready", installStatus: "installed", priority: "low", location: "Customer Yard", lastSeen: "22 min ago", device: "ST4315B Wired Tracker", nextAction: "Confirm external power remains stable over a 7-day window.", sensors: { ignition: "Off", movement: "Parked", battery: "External power OK" }, alerts: [], notes: [{ at: "2026-05-12 11:30", text: "Hardwired rugged tracker for powered asset installs." }] }
];

const seedCatalog = [
  { id: "PROPANE-01", name: "Mopeka / AP Products Propane", use: "RV propane level", module: "RV", status: "buy", quantity: 1, critical: true },
  { id: "TANK-01", name: "Garnet SeeLevel 3 Tank", use: "Fresh / gray / black RV tanks", module: "RV", status: "buy", quantity: 1, critical: true },
  { id: "GEN-01", name: "Runleader Hour Meter", use: "Generator runtime", module: "RV", status: "buy", quantity: 1, critical: false },
  { id: "FILL-01", name: "Ultrasonic Level Sensor", use: "Porta-potty fill level", module: "Porta-Potty", status: "buy one", quantity: 1, critical: true },
  { id: "TEMP-01", name: "DS18B20 1-Wire Probe", use: "Water/temp/freeze sensor", module: "Operations", status: "later", quantity: 2, critical: false },
  { id: "DOOR-01", name: "Magnetic Reed Switch", use: "Door open / usage count", module: "Porta-Potty", status: "buy", quantity: 3, critical: true }
];

const modules = [
  { title: "RV Source of Truth", icon: Truck, points: ["Propane", "Fresh / gray / black tanks", "Generator hours", "TPMS", "OBD status"] },
  { title: "Porta-Potty Source of Truth", icon: Droplets, points: ["Fill level", "Door count", "Tip-over", "Temperature", "Location"] },
  { title: "Cattle Source of Truth", icon: Radio, points: ["GPS collar", "Movement", "Ear temp concept", "Water visits", "Geofence"] },
  { title: "Operations Source of Truth", icon: ClipboardList, points: ["Open alerts", "Device health", "Service notes", "Install status", "Customer site state"] }
];

const emptyAsset = { id: "", name: "", type: "Asset", status: "ready", installStatus: "planned", priority: "medium", location: "", lastSeen: "manual entry", device: "", nextAction: "", sensorsText: "battery: pending\nlocation: pending" };

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { assets: seedAssets, catalog: seedCatalog };
    const parsed = JSON.parse(stored);
    return { assets: parsed.assets?.length ? parsed.assets : seedAssets, catalog: parsed.catalog?.length ? parsed.catalog : seedCatalog };
  } catch {
    return { assets: seedAssets, catalog: seedCatalog };
  }
}

function parseSensors(text) {
  return text.split("\n").map((row) => row.trim()).filter(Boolean).reduce((acc, row) => {
    const [key, ...rest] = row.split(":");
    if (key && rest.length) acc[key.trim()] = rest.join(":").trim();
    return acc;
  }, {});
}

function sensorsToText(sensors) {
  return Object.entries(sensors || {}).map(([key, value]) => `${key}: ${value}`).join("\n");
}

function statusClass(status) {
  return `status ${status}`.replace(/\s+/g, "-");
}

function App() {
  const [{ assets, catalog }, setData] = useState(loadState);
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedAssetId, setSelectedAssetId] = useState(seedAssets[1].id);
  const [noteText, setNoteText] = useState("");
  const [form, setForm] = useState(emptyAsset);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify({ assets, catalog })), [assets, catalog]);

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) || assets[0];
  const openAlerts = assets.flatMap((asset) => asset.alerts.map((alert) => ({ asset: asset.id, alert })));
  const serviceQueue = assets.filter((asset) => asset.status === "attention" || asset.priority === "high");
  const partsToBuy = catalog.filter((item) => ["buy", "buy one"].includes(item.status));
  const filteredAssets = useMemo(() => assets.filter((asset) => {
    const matchesType = selectedType === "All" || asset.type === selectedType;
    const text = `${asset.id} ${asset.name} ${asset.type} ${asset.location} ${asset.device} ${asset.nextAction}`.toLowerCase();
    return matchesType && text.includes(query.toLowerCase());
  }), [assets, query, selectedType]);

  function addOrUpdateAsset(event) {
    event.preventDefault();
    const id = form.id.trim().toUpperCase();
    if (!id || !form.name.trim()) return;
    const nextAsset = { id, name: form.name.trim(), type: form.type, status: form.status, installStatus: form.installStatus, priority: form.priority, location: form.location.trim() || "Unassigned", lastSeen: form.lastSeen.trim() || "manual entry", device: form.device.trim() || "Not assigned", nextAction: form.nextAction.trim() || "Assign next action.", sensors: parseSensors(form.sensorsText), alerts: form.status === "attention" ? ["Needs operator review"] : [], notes: [{ at: new Date().toLocaleString(), text: "Created or updated from dashboard form." }] };
    setData((current) => {
      const exists = current.assets.some((asset) => asset.id === id);
      return { ...current, assets: exists ? current.assets.map((asset) => asset.id === id ? { ...asset, ...nextAsset, notes: asset.notes?.length ? asset.notes : nextAsset.notes } : asset) : [nextAsset, ...current.assets] };
    });
    setSelectedAssetId(id);
    setForm(emptyAsset);
  }

  function editAsset(asset) {
    setForm({ ...asset, sensorsText: sensorsToText(asset.sensors) });
    setSelectedAssetId(asset.id);
  }

  function addNote() {
    if (!selectedAsset || !noteText.trim()) return;
    setData((current) => ({ ...current, assets: current.assets.map((asset) => asset.id === selectedAsset.id ? { ...asset, notes: [{ at: new Date().toLocaleString(), text: noteText.trim() }, ...(asset.notes || [])] } : asset) }));
    setNoteText("");
  }

  function toggleCatalogStatus(id) {
    const order = ["buy", "bought", "installed", "later"];
    setData((current) => ({ ...current, catalog: current.catalog.map((item) => item.id === id ? { ...item, status: order[(order.indexOf(item.status) + 1) % order.length] } : item) }));
  }

  function resetDemo() {
    setData({ assets: seedAssets, catalog: seedCatalog });
    setSelectedAssetId(seedAssets[1].id);
    setForm(emptyAsset);
    setNoteText("");
  }

  return <main className="app-shell">
    <section className="hero"><div><p className="eyebrow">Vaycora Hardwear</p><h1>VCore Recorder Dashboard</h1><p className="subtitle">The source-of-truth layer for assets, sensors, installs, service alerts, field notes, and the next action queue.</p><div className="hero-actions"><a href="#asset-form">Add asset</a><button type="button" className="ghost-button" onClick={resetDemo}>Reset demo</button></div></div><div className="hero-card"><ShieldCheck size={34} /><span>Recorder MVP v0.2</span><strong>{assets.length} assets tracked</strong><small>{openAlerts.length} open alert - {partsToBuy.length} buy-list items</small></div></section>
    <section className="metric-grid"><Metric icon={Wifi} label="Connected devices" value={assets.length.toString()} /><Metric icon={Bell} label="Open alerts" value={openAlerts.length.toString()} tone="warning" /><Metric icon={Wrench} label="Service queue" value={serviceQueue.length.toString()} /><Metric icon={PackageCheck} label="Parts to buy" value={partsToBuy.length.toString()} /></section>
    <section className="panel"><div className="panel-header"><div><h2>Source Modules</h2><p>One recorder model across RV, porta-potty, cattle, tracking, and operations.</p></div></div><div className="module-grid">{modules.map((module) => { const Icon = module.icon; return <article className="module-card" key={module.title}><Icon size={24} /><h3>{module.title}</h3><ul>{module.points.map((point) => <li key={point}>{point}</li>)}</ul></article>; })}</div></section>
    <section className="workspace-grid"><section className="panel registry-panel"><div className="panel-header controls-row"><div><h2>Asset Registry</h2><p>Current truth for every unit, sensor stack, install state, and next move.</p></div><div className="controls"><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets" /></label><select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>{["All", "RV", "Porta-Potty", "Cattle", "Asset"].map((type) => <option key={type}>{type}</option>)}</select></div></div><div className="asset-grid">{filteredAssets.map((asset) => <article className={`asset-card ${selectedAsset?.id === asset.id ? "selected" : ""}`} key={asset.id}><button className="card-hit" type="button" onClick={() => setSelectedAssetId(asset.id)} aria-label={`Open ${asset.name}`} /><div className="asset-topline"><span className={statusClass(asset.status)}>{asset.status}</span><small>{asset.id}</small></div><h3>{asset.name}</h3><p className="asset-location"><MapPin size={15} /> {asset.location}</p><p className="asset-device"><CircleDot size={14} /> {asset.device}</p><div className="mini-meta"><span>{asset.installStatus}</span><span>{asset.priority} priority</span></div><p className="next-action"><strong>Next:</strong> {asset.nextAction}</p>{asset.alerts.length > 0 && <AlertBox text={asset.alerts[0]} />}<small className="last-seen">Last seen {asset.lastSeen}</small><button className="tiny-button" type="button" onClick={() => editAsset(asset)}>Edit</button></article>)}</div></section>
    <aside className="panel detail-panel">{selectedAsset ? <><div className="detail-header"><div><p className="eyebrow">Selected Asset</p><h2>{selectedAsset.name}</h2><span className={statusClass(selectedAsset.status)}>{selectedAsset.status}</span></div><Gauge size={30} /></div><div className="sensor-list">{Object.entries(selectedAsset.sensors || {}).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div><div className="action-card"><strong>Next action</strong><p>{selectedAsset.nextAction}</p></div><div className="note-composer"><h3>Field Notes</h3><textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Add install, service, purchase, or operator note..." /><button type="button" onClick={addNote}><Plus size={16} /> Add note</button></div><div className="note-list">{(selectedAsset.notes || []).map((note, index) => <div className="note-item" key={`${note.at}-${index}`}><small>{note.at}</small><p>{note.text}</p></div>)}</div></> : <p>No asset selected.</p>}</aside></section>
    <section className="two-column"><div className="panel"><div className="panel-header"><div><h2>Buy / Install Tracker</h2><p>Click an item to cycle: buy, bought, installed, later.</p></div></div><div className="catalog-list">{catalog.map((sensor) => <button className="catalog-item" type="button" key={sensor.id} onClick={() => toggleCatalogStatus(sensor.id)}><div><strong>{sensor.name}</strong><span>{sensor.use} - {sensor.module} - qty {sensor.quantity}</span></div><em className={`catalog-status ${sensor.status.replace(/\s+/g, "-")}`}>{sensor.critical ? "MVP - " : ""}{sensor.status}</em></button>)}</div></div><div className="panel" id="asset-form"><div className="panel-header"><div><h2>Add / Edit Asset</h2><p>Changes save in this browser now; database sync comes next.</p></div></div><form className="asset-form" onSubmit={addOrUpdateAsset}><div className="form-grid"><label>ID<input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} placeholder="PP-015" /></label><label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Jobsite B Unit" /></label><label>Type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>{["RV", "Porta-Potty", "Cattle", "Asset"].map((type) => <option key={type}>{type}</option>)}</select></label><label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{["ready", "attention", "prototype", "offline"].map((status) => <option key={status}>{status}</option>)}</select></label><label>Install<select value={form.installStatus} onChange={(event) => setForm({ ...form, installStatus: event.target.value })}>{["planned", "parts needed", "installed", "testing", "prototype"].map((status) => <option key={status}>{status}</option>)}</select></label><label>Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{["low", "medium", "high"].map((priority) => <option key={priority}>{priority}</option>)}</select></label></div><label>Location<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Customer site / yard / pasture" /></label><label>Device<input value={form.device} onChange={(event) => setForm({ ...form, device: event.target.value })} placeholder="Tracker or sensor stack" /></label><label>Next Action<input value={form.nextAction} onChange={(event) => setForm({ ...form, nextAction: event.target.value })} placeholder="What needs to happen next?" /></label><label>Sensors<textarea value={form.sensorsText} onChange={(event) => setForm({ ...form, sensorsText: event.target.value })} /></label><div className="form-actions"><button type="submit"><Save size={16} /> Save asset</button><button type="button" className="ghost-button" onClick={() => setForm(emptyAsset)}><X size={16} /> Clear</button></div></form></div></section>
    <section className="panel queue-panel"><div className="panel-header"><div><h2>Open Work Queue</h2><p>What gets handled before this dashboard is considered done enough to leave alone.</p></div></div><div className="queue-grid">{["Keep local persistence and import/export until Supabase is wired.", "Make porta-potty fill-level rules the first real alert lane.", "Create Supabase tables for assets, devices, readings, alerts, notes, and parts.", "Add real ingestion endpoints for Suntech and sensor payloads."].map((item) => <div className="queue-item" key={item}><CheckCircle2 size={18} /><span>{item}</span></div>)}</div></section>
  </main>;
}

function AlertBox({ text }) { return <div className="alert-box"><AlertTriangle size={16} /> {text}</div>; }
function Metric({ icon: Icon, label, value, tone = "default" }) { return <article className={`metric-card ${tone}`}><Icon size={22} /><span>{label}</span><strong>{value}</strong></article>; }

createRoot(document.getElementById("root")).render(<App />);
