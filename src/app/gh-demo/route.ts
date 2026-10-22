import { GH_DEMO_HTML } from "./ghDemoHtml";

export const dynamic = "force-static";

export function GET() {
  return new Response(GH_DEMO_HTML, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
