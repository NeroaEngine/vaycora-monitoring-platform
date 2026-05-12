import { NextResponse } from "next/server";
import { setupVaycoraSchema } from "@/lib/vaycora/schema";

export async function POST() {
  try {
    await setupVaycoraSchema();
    return NextResponse.json({ ok: true, message: "Vaycora database schema is ready." });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown setup error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "vaycora-db-setup",
    status: "ready",
    note: "POST this endpoint once after deployment to create Vaycora tables and seed demo records.",
  });
}
