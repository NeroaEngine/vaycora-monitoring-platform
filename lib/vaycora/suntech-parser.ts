import type { NormalizedSunTechPayload, RawPayloadStatus } from "./types";

type ParserResult = { status: RawPayloadStatus; normalized?: NormalizedSunTechPayload; error?: string };

function json(raw: string): Record<string, unknown> | undefined {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}

function kv(raw: string): Record<string, unknown> | undefined {
  const separator = raw.includes(";") ? ";" : raw.includes("|") ? "|" : ",";
  const parts = raw.split(separator).map((part) => part.trim()).filter(Boolean);
  const output: Record<string, unknown> = {};
  for (const part of parts) {
    const [key, ...value] = part.includes("=") ? part.split("=") : part.split(":");
    if (!key || value.length === 0) continue;
    output[key.trim()] = value.join("=").trim();
  }
  return Object.keys(output).length ? output : undefined;
}

function str(input: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = input[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
}

function num(input: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = input[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
}

function bool(input: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = input[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["1", "true", "on", "yes"].includes(normalized)) return true;
      if (["0", "false", "off", "no"].includes(normalized)) return false;
    }
  }
}

export function parseSunTechPayload(rawPayload: string): ParserResult {
  const source = json(rawPayload) ?? kv(rawPayload);
  if (!source) return { status: "failed", error: "Payload is not JSON or supported key-value text. Replace parser with official SunTech protocol when received." };

  const deviceIdentifier = str(source, ["device_identifier", "deviceId", "device_id", "imei", "IMEI", "serial", "unit", "id"]);
  if (!deviceIdentifier) return { status: "failed", error: "Could not find device identifier or IMEI in payload." };

  return {
    status: "parsed",
    normalized: {
      deviceIdentifier,
      timestamp: str(source, ["timestamp", "time", "eventTime", "event_time", "recordedAt", "recorded_at"]) ?? new Date().toISOString(),
      latitude: num(source, ["latitude", "lat", "gps_lat", "y"]),
      longitude: num(source, ["longitude", "lng", "lon", "gps_lng", "x"]),
      speedMph: num(source, ["speedMph", "speed_mph", "speed"]),
      heading: num(source, ["heading", "course", "bearing"]),
      ignitionStatus: bool(source, ["ignitionStatus", "ignition_status", "ignition", "ign"]),
      batteryVoltage: num(source, ["batteryVoltage", "battery_voltage", "externalBattery", "battery_v"]),
      internalBatteryLevel: num(source, ["internalBatteryLevel", "internal_battery_level", "battery", "batteryPercent", "battery_percent"]),
      externalPowerStatus: bool(source, ["externalPowerStatus", "external_power_status", "externalPower", "power"]),
      eventCode: str(source, ["eventCode", "event_code", "event"]),
      rawEventName: str(source, ["rawEventName", "raw_event_name", "eventName", "event_name"]),
    },
  };
}

export function normalizePayloadFormat(rawPayload: string) {
  if (json(rawPayload)) return "json" as const;
  if (kv(rawPayload)) return "text" as const;
  return "unknown" as const;
}
