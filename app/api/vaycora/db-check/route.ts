import { NextResponse } from "next/server";
import { queryOne } from "@/lib/vaycora/db";

export async function GET() {
  try {
    const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

    if (!hasDatabaseUrl) {
      return NextResponse.json(
        {
          ok: false,
          hasDatabaseUrl,
          error: "DATABASE_URL is not configured on this DigitalOcean app component.",
        },
        { status: 500 }
      );
    }

    const result = await queryOne<{ now: string }>("select now()::text as now");

    return NextResponse.json({
      ok: true,
      hasDatabaseUrl,
      databaseTime: result?.now ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        error: error instanceof Error ? error.message : "Unknown database check error",
      },
      { status: 500 }
    );
  }
}
