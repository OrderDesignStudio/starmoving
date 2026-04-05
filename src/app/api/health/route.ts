import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const masked = dbUrl.replace(/:[^@]+@/, ":***@").substring(0, 80);
  const start = Date.now();

  try {
    const result = await prisma.$queryRawUnsafe("SELECT 1 as ok");
    return NextResponse.json({
      status: "ok",
      db: "connected",
      latencyMs: Date.now() - start,
      dbUrlPrefix: masked,
      region: process.env.VERCEL_REGION || "unknown",
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error: unknown) {
    const err = error as Error & { code?: string; meta?: unknown };
    return NextResponse.json(
      {
        status: "error",
        db: "failed",
        latencyMs: Date.now() - start,
        dbUrlPrefix: masked,
        error: {
          message: err.message,
          name: err.name,
          code: err.code,
          meta: err.meta,
          stack: err.stack?.split("\n").slice(0, 5),
        },
        region: process.env.VERCEL_REGION || "unknown",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
