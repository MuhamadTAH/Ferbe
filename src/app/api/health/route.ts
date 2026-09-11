import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

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
    await Promise.race([
      new ConvexHttpClient(url).query(api.categories.list, {}),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("convex ping timeout")), 2500)
      ),
    ]);
    return NextResponse.json({ status: "ok", convex: "reachable", time });
  } catch {
    return NextResponse.json({ status: "degraded", convex: "unreachable", time });
  }
}
