import { assets as mockAssets, devices as mockDevices, events as mockEvents, rawPayloads as mockPayloads, tenants as mockTenants } from "./mock-data";
import type { Asset, Device, RawPayload, Tenant, VaycoraEvent } from "./types";
import { query, queryOne } from "./db";

export type BrandSettings = {
  tenantId: string;
  companyName: string;
  shortName: string;
  portalType: string;
  primaryColor: string;
  accentColor: string;
  backgroundMode: string;
  dashboardStyle: string;
  logoUrl?: string | null;
};

type TenantRow = {
  id: string;
  name: string;
  slug: string;
  status: Tenant["status"];
  enabled_portals: Tenant["enabledPortals"];
};

type BrandSettingsRow = {
  tenant_id: string;
  company_name: string;
  short_name: string;
  portal_type: string;
  primary_color: string;
  accent_color: string;
  background_mode: string;
  dashboard_style: string;
  logo_url: string | null;
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

type PayloadDetailRow = PayloadRow & {
  device_model: string | null;
  asset_id: string | null;
  asset_name: string | null;
  asset_type: string | null;
  event_count: string | number;
  location_count: string | number;
};

type StatsRow = {
  tenants: string | number;
  devices: string | number;
  assets: string | number;
  payloads: string | number;
  parsed_payloads: string | number;
  failed_payloads: string | number;
  events: string | number;
  locations: string | number;
  latest_payload_at: string | null;
};

function toTenant(row: TenantRow): Tenant {
  return { id: row.id, name: row.name, slug: row.slug, status: row.status, enabledPortals: row.enabled_portals };
}

function toBrandSettings(row: BrandSettingsRow): BrandSettings {
  return {
    tenantId: row.tenant_id,
    companyName: row.company_name,
    shortName: row.short_name,
    portalType: row.portal_type,
    primaryColor: row.primary_color,
    accentColor: row.accent_color,
    backgroundMode: row.background_mode,
    dashboardStyle: row.dashboard_style,
    logoUrl: row.logo_url,
  };
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

export async function getBrandSettings(tenantId = "tenant_demo") {
  const row = await queryOne<BrandSettingsRow>("select * from brand_settings where tenant_id = $1", [tenantId]);
  return row ? toBrandSettings(row) : {
    tenantId,
    companyName: "Vaycora Demo Operations",
    shortName: "Vaycora",
    portalType: "rental",
    primaryColor: "#123c2b",
    accentColor: "#e96f12",
    backgroundMode: "dark",
    dashboardStyle: "operations",
    logoUrl: null,
  };
}

export async function saveBrandSettings(settings: BrandSettings) {
  const row = await queryOne<BrandSettingsRow>(`
    insert into brand_settings (tenant_id, company_name, short_name, portal_type, primary_color, accent_color, background_mode, dashboard_style, logo_url, updated_at)
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
    on conflict (tenant_id) do update set
      company_name = excluded.company_name,
      short_name = excluded.short_name,
      portal_type = excluded.portal_type,
      primary_color = excluded.primary_color,
      accent_color = excluded.accent_color,
      background_mode = excluded.background_mode,
      dashboard_style = excluded.dashboard_style,
      logo_url = excluded.logo_url,
      updated_at = now()
    returning *
  `, [
    settings.tenantId,
    settings.companyName,
    settings.shortName,
    settings.portalType,
    settings.primaryColor,
    settings.accentColor,
    settings.backgroundMode,
    settings.dashboardStyle,
    settings.logoUrl ?? null,
  ]);

  return row ? toBrandSettings(row) : settings;
}

export async function getVaycoraDashboardData() {
  try {
    const [tenantRows, assetRows, deviceRows, eventRows, payloadRows, brandSettings] = await Promise.all([
      query<TenantRow>("select id, name, slug, status, enabled_portals from tenants order by created_at asc limit 1"),
      query<AssetRow>("select * from assets order by updated_at desc, created_at desc limit 50"),
      query<DeviceRow>("select * from devices order by updated_at desc, created_at desc limit 50"),
      query<EventRow>("select * from events order by event_time desc, created_at desc limit 25"),
      query<PayloadRow>("select * from device_payloads order by received_at desc limit 25"),
      getBrandSettings(),
    ]);

    return {
      source: "database" as const,
      tenants: tenantRows.map(toTenant),
      assets: assetRows.map(toAsset),
      devices: deviceRows.map(toDevice),
      events: eventRows.map(toEvent),
      rawPayloads: payloadRows.map(toPayload),
      brandSettings,
    };
  } catch {
    return {
      source: "mock" as const,
      tenants: mockTenants,
      assets: mockAssets,
      devices: mockDevices,
      events: mockEvents,
      rawPayloads: mockPayloads,
      brandSettings: {
        tenantId: "tenant_demo",
        companyName: "Vaycora Demo Operations",
        shortName: "Vaycora",
        portalType: "rental",
        primaryColor: "#123c2b",
        accentColor: "#e96f12",
        backgroundMode: "dark",
        dashboardStyle: "operations",
        logoUrl: null,
      },
    };
  }
}

export async function getVaycoraStats() {
  const stats = await queryOne<StatsRow>(`
    select
      (select count(*) from tenants) as tenants,
      (select count(*) from devices) as devices,
      (select count(*) from assets) as assets,
      (select count(*) from device_payloads) as payloads,
      (select count(*) from device_payloads where parse_status = 'parsed') as parsed_payloads,
      (select count(*) from device_payloads where parse_status = 'failed') as failed_payloads,
      (select count(*) from events) as events,
      (select count(*) from location_history) as locations,
      (select max(received_at)::text from device_payloads) as latest_payload_at
  `);

  return {
    tenants: Number(stats?.tenants ?? 0),
    devices: Number(stats?.devices ?? 0),
    assets: Number(stats?.assets ?? 0),
    payloads: Number(stats?.payloads ?? 0),
    parsedPayloads: Number(stats?.parsed_payloads ?? 0),
    failedPayloads: Number(stats?.failed_payloads ?? 0),
    events: Number(stats?.events ?? 0),
    locations: Number(stats?.locations ?? 0),
    latestPayloadAt: stats?.latest_payload_at ?? null,
  };
}

export async function getPayloadAdminData() {
  const [payloadRows, stats] = await Promise.all([
    query<PayloadDetailRow>(`
      select
        p.*,
        d.model as device_model,
        a.id as asset_id,
        a.name as asset_name,
        a.asset_type,
        (select count(*) from events e where e.raw_payload_id = p.id) as event_count,
        (select count(*) from location_history l where l.raw_payload_id = p.id) as location_count
      from device_payloads p
      left join devices d on d.id = p.device_id
      left join assets a on a.assigned_device_id = d.id
      order by p.received_at desc
      limit 100
    `),
    getVaycoraStats(),
  ]);

  return {
    stats,
    payloads: payloadRows.map((row) => ({
      ...toPayload(row),
      deviceModel: row.device_model,
      assetId: row.asset_id,
      assetName: row.asset_name,
      assetType: row.asset_type,
      eventCount: Number(row.event_count ?? 0),
      locationCount: Number(row.location_count ?? 0),
    })),
  };
}

export async function getPayloadDetailData(payloadId: string) {
  const payload = await queryOne<PayloadDetailRow>(`
    select
      p.*,
      d.model as device_model,
      a.id as asset_id,
      a.name as asset_name,
      a.asset_type,
      (select count(*) from events e where e.raw_payload_id = p.id) as event_count,
      (select count(*) from location_history l where l.raw_payload_id = p.id) as location_count
    from device_payloads p
    left join devices d on d.id = p.device_id
    left join assets a on a.assigned_device_id = d.id
    where p.id = $1
    limit 1
  `, [payloadId]);

  if (!payload) return null;

  const [eventRows, locationRows] = await Promise.all([
    query<EventRow>("select * from events where raw_payload_id = $1 order by event_time desc", [payloadId]),
    query<{ id: string; latitude: number; longitude: number; speed: number | null; heading: number | null; recorded_at: string; received_at: string }>(
      "select id, latitude, longitude, speed, heading, recorded_at::text, received_at::text from location_history where raw_payload_id = $1 order by recorded_at desc",
      [payloadId]
    ),
  ]);

  return {
    payload: {
      ...toPayload(payload),
      deviceModel: payload.device_model,
      assetId: payload.asset_id,
      assetName: payload.asset_name,
      assetType: payload.asset_type,
      eventCount: Number(payload.event_count ?? 0),
      locationCount: Number(payload.location_count ?? 0),
    },
    events: eventRows.map(toEvent),
    locations: locationRows,
  };
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
