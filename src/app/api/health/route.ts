import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";

/**
 * Health check: always responds HTTP 200 with the current service state so
 * load balancers / uptime checks can read `convex` from the JSON body.
 */
export async function GET() {
  const time = new Date().toISOString();
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!url) {
    return NextResponse.json({ status: "degraded", convex: "unconfigured", time });
  }

  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(2500) });
    const isReachable = res.ok || res.status < 500;
    return NextResponse.json({
      status: isReachable ? "ok" : "degraded",
      convex: isReachable ? "reachable" : "unreachable",
      time,
    });
  } catch {
    return NextResponse.json({ status: "degraded", convex: "unreachable", time });
  }
}
