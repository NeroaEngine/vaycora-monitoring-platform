import { assets as mockAssets, devices as mockDevices, events as mockEvents, rawPayloads as mockPayloads, tenants as mockTenants } from "./mock-data";
import type { Asset, Device, RawPayload, Tenant, VaycoraEvent } from "./types";
import { query } from "./db";

type TenantRow = {
  id: string;
  name: string;
  slug: string;
  status: Tenant["status"];
  enabled_portals: Tenant["enabledPortals"];
};

type DeviceRow = {
  id: string;
  tenant_id: string;
  device_identifier: string;
  imei: string | null;
  manufacturer: Device["manufacturer"];
  model: Device["model"];
  status: Device["status"];
  firmware_version: string | null;
  last_seen_at: string | null;
  last_payload_at: string | null;
};

type AssetRow = {
  id: string;
  tenant_id: string;
  asset_type: Asset["assetType"];
  name: string;
  display_identifier: string;
  status: Asset["status"];
  assigned_device_id: string | null;
  current_lat: number | null;
  current_lng: number | null;
  speed_mph: number | null;
  heading: number | null;
  ignition_status: boolean | null;
  battery_voltage: number | null;
  internal_battery_level: number | null;
  external_power_status: boolean | null;
  last_seen_at: string | null;
  metadata: Record<string, string | number | boolean | null>;
};

type EventRow = {
  id: string;
  tenant_id: string;
  asset_id: string | null;
  device_id: string | null;
  event_type: VaycoraEvent["eventType"];
  event_time: string;
  location_lat: number | null;
  location_lng: number | null;
  value_json: Record<string, unknown>;
  source: VaycoraEvent["source"];
  raw_payload_id: string | null;
};

type PayloadRow = {
  id: string;
  provider: RawPayload["provider"];
  device_identifier: string | null;
  device_id: string | null;
  tenant_id: string | null;
  raw_payload: string;
  payload_format: RawPayload["payloadFormat"];
  source_ip: string | null;
  received_at: string;
  parsed_at: string | null;
  parse_status: RawPayload["parseStatus"];
  parse_error: string | null;
  ack_sent: boolean;
};

function toTenant(row: TenantRow): Tenant {
  return { id: row.id, name: row.name, slug: row.slug, status: row.status, enabledPortals: row.enabled_portals };
}

function toDevice(row: DeviceRow): Device {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    deviceIdentifier: row.device_identifier,
    imei: row.imei ?? row.device_identifier,
    manufacturer: row.manufacturer,
    model: row.model,
    status: row.status,
    firmwareVersion: row.firmware_version ?? undefined,
    lastSeenAt: row.last_seen_at ?? undefined,
    lastPayloadAt: row.last_payload_at ?? undefined,
  };
}

function toAsset(row: AssetRow): Asset {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    assetType: row.asset_type,
    name: row.name,
    displayIdentifier: row.display_identifier,
    status: row.status,
    assignedDeviceId: row.assigned_device_id ?? undefined,
    currentLat: row.current_lat ?? undefined,
    currentLng: row.current_lng ?? undefined,
    speedMph: row.speed_mph ?? undefined,
    heading: row.heading ?? undefined,
    ignitionStatus: row.ignition_status ?? undefined,
    batteryVoltage: row.battery_voltage ?? undefined,
    internalBatteryLevel: row.internal_battery_level ?? undefined,
    externalPowerStatus: row.external_power_status ?? undefined,
    lastSeenAt: row.last_seen_at ?? undefined,
    metadata: row.metadata ?? {},
  };
}

function toEvent(row: EventRow): VaycoraEvent {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    assetId: row.asset_id ?? undefined,
    deviceId: row.device_id ?? undefined,
    eventType: row.event_type,
    eventTime: row.event_time,
    locationLat: row.location_lat ?? undefined,
    locationLng: row.location_lng ?? undefined,
    value: row.value_json ?? {},
    source: row.source,
    rawPayloadId: row.raw_payload_id ?? undefined,
  };
}

function toPayload(row: PayloadRow): RawPayload {
  return {
    id: row.id,
    provider: row.provider,
    deviceIdentifier: row.device_identifier ?? undefined,
    deviceId: row.device_id ?? undefined,
    tenantId: row.tenant_id ?? undefined,
    rawPayload: row.raw_payload,
    payloadFormat: row.payload_format,
    sourceIp: row.source_ip ?? undefined,
    receivedAt: row.received_at,
    parsedAt: row.parsed_at ?? undefined,
    parseStatus: row.parse_status,
    parseError: row.parse_error ?? undefined,
    ackSent: row.ack_sent,
  };
}

export async function getVaycoraDashboardData() {
  try {
    const [tenantRows, assetRows, deviceRows, eventRows, payloadRows] = await Promise.all([
      query<TenantRow>("select id, name, slug, status, enabled_portals from tenants order by created_at asc limit 1"),
      query<AssetRow>("select * from assets order by updated_at desc, created_at desc limit 50"),
      query<DeviceRow>("select * from devices order by updated_at desc, created_at desc limit 50"),
      query<EventRow>("select * from events order by event_time desc, created_at desc limit 25"),
      query<PayloadRow>("select * from device_payloads order by received_at desc limit 25"),
    ]);

    return {
      source: "database" as const,
      tenants: tenantRows.map(toTenant),
      assets: assetRows.map(toAsset),
      devices: deviceRows.map(toDevice),
      events: eventRows.map(toEvent),
      rawPayloads: payloadRows.map(toPayload),
    };
  } catch {
    return {
      source: "mock" as const,
      tenants: mockTenants,
      assets: mockAssets,
      devices: mockDevices,
      events: mockEvents,
      rawPayloads: mockPayloads,
    };
  }
}

export async function getVaycoraAssetDetailData(assetId: string) {
  try {
    const assetRows = await query<AssetRow>("select * from assets where id = $1 limit 1", [assetId]);
    const asset = assetRows[0] ? toAsset(assetRows[0]) : null;

    if (!asset) return null;

    const [deviceRows, eventRows, payloadRows] = await Promise.all([
      query<DeviceRow>("select * from devices where id = $1 limit 1", [asset.assignedDeviceId ?? ""]),
      query<EventRow>("select * from events where asset_id = $1 order by event_time desc, created_at desc limit 50", [asset.id]),
      query<PayloadRow>(
        "select p.* from device_payloads p join devices d on d.id = p.device_id where d.id = $1 order by p.received_at desc limit 50",
        [asset.assignedDeviceId ?? ""]
      ),
    ]);

    return {
      source: "database" as const,
      asset,
      device: deviceRows[0] ? toDevice(deviceRows[0]) : undefined,
      events: eventRows.map(toEvent),
      rawPayloads: payloadRows.map(toPayload),
    };
  } catch {
    const asset = mockAssets.find((item) => item.id === assetId);
    if (!asset) return null;
    const device = mockDevices.find((item) => item.id === asset.assignedDeviceId);
    return {
      source: "mock" as const,
      asset,
      device,
      events: mockEvents.filter((event) => event.assetId === asset.id),
      rawPayloads: mockPayloads.filter((payload) => payload.deviceId === device?.id),
    };
  }
}
