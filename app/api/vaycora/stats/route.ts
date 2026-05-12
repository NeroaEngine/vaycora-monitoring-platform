import { NextResponse } from "next/server";
import { getVaycoraStats } from "@/lib/vaycora/repository";

export async function GET() {
  try {
    const stats = await getVaycoraStats();
    return NextResponse.json({ ok: true, stats });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown stats error" },
      { status: 500 }
    );
  }
}
