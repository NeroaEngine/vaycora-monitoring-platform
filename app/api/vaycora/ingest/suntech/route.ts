import { NextRequest, NextResponse } from "next/server";
import { normalizePayloadFormat, parseSunTechPayload } from "@/lib/vaycora/suntech-parser";

export async function POST(request: NextRequest) {
  const rawPayload = await request.text();
  const sourceIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
  const receivedAt = new Date().toISOString();
  const parseResult = parseSunTechPayload(rawPayload);
  const payloadFormat = normalizePayloadFormat(rawPayload);

  return NextResponse.json({
    ok: parseResult.status === "parsed",
    provider: "suntech",
    receivedAt,
    sourceIp,
    payloadFormat,
    parseStatus: parseResult.status,
    normalized: parseResult.normalized ?? null,
    error: parseResult.error ?? null,
    ack: "ACK_PLACEHOLDER",
  });
}

export async function GET() {
  return NextResponse.json({
    service: "vaycora-suntech-ingestion",
    status: "ready",
    note: "POST raw SunTech JSON or key-value payloads here for parser smoke tests.",
  });
}
