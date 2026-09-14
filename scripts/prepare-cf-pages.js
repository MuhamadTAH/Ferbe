#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

console.log(">>> Preparing Cloudflare Pages _worker.js entrypoints & _routes.json...");
const openNextAssetsDir = path.join(process.cwd(), ".open-next", "assets");
if (!fs.existsSync(openNextAssetsDir)) {
  fs.mkdirSync(openNextAssetsDir, { recursive: true });
}

// 1. Generate _routes.json for Cloudflare Pages edge CDN routing
const routesConfig = {
  version: 1,
  include: ["/*"],
  exclude: [
    "/_next/static/*",
    "/audio/*",
    "/favicon.ico",
    "/*.svg",
    "/*.ico",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.webp",
    "/*.mp3",
    "/*.txt",
  ],
};

fs.writeFileSync(
  path.join(openNextAssetsDir, "_routes.json"),
  JSON.stringify(routesConfig, null, 2),
  "utf8"
);
console.log(">>> Generated .open-next/assets/_routes.json");

// 2. Generate resilient _worker.js wrapper
function generateWorkerCode(workerImportPath) {
  return `import openNextWorker from "${workerImportPath}";
export * from "${workerImportPath}";

const STATIC_EXT_REGEX = /\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3|txt)$/i;

const capturedLogs = [];
const origError = console.error;
console.error = (...args) => {
  try {
    capturedLogs.push({
      time: new Date().toISOString(),
      msg: args.map((a) => (typeof a === "object" && a !== null ? (a.stack || a.message || JSON.stringify(a)) : String(a))).join(" ")
    });
    if (capturedLogs.length > 50) capturedLogs.shift();
  } catch (_) {}
  origError(...args);
};

export default {
  async fetch(request, env, ctx) {
    if (env && typeof env === "object") {
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
    }

    const url = new URL(request.url);

    // Diagnostics: dump last captured server error logs
    if (url.pathname === "/_cf_errors") {
      return new Response(JSON.stringify(capturedLogs, null, 2), {
        headers: { "content-type": "application/json" }
      });
    }

    // Health and configuration diagnostics
    if (url.pathname === "/_cf_health") {
      const masked = (val) => (val ? val.slice(0, 6) + "..." + val.slice(-4) : null);
      return new Response(
        JSON.stringify(
          {
            status: "ok",
            cf_pages: env?.CF_PAGES || null,
            clerk_publishable_key: masked(
              env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
            ),
            clerk_secret_present: Boolean(
              env?.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY
            ),
            convex_url:
              env?.NEXT_PUBLIC_CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL || null,
            has_assets_binding: Boolean(env?.ASSETS),
            available_keys: Object.keys(env || {}),
            timestamp: new Date().toISOString(),
          },
          null,
          2
        ),
        { headers: { "content-type": "application/json" } }
      );
    }

    // Serve static assets directly from env.ASSETS if present
    if (
      env?.ASSETS &&
      (url.pathname.startsWith("/_next/static/") ||
        url.pathname.startsWith("/audio/") ||
        url.pathname === "/favicon.ico" ||
        STATIC_EXT_REGEX.test(url.pathname))
    ) {
      try {
        const assetRes = await env.ASSETS.fetch(request);
        if (assetRes && assetRes.status < 400) {
          return assetRes;
        }
      } catch (assetErr) {
        console.warn("[_worker.js] env.ASSETS fallback error:", assetErr?.message);
      }
    }

    try {
      const response = await openNextWorker.fetch(request, env, ctx);
      if (response.status === 500) {
        const lastErr = capturedLogs.slice(-3).map((l) => l.msg).join("\n---\n");
        if (url.searchParams.has("debug") || request.headers.get("x-debug") === "1") {
          return new Response("500 Server Error Debug Logs:\n" + (lastErr || "No console.error captured"), {
            status: 500,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }
        const newHeaders = new Headers(response.headers);
        if (lastErr) {
          newHeaders.set("x-cf-last-error", encodeURIComponent(lastErr.slice(0, 500)));
        }
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }
      return response;
    } catch (err) {
      console.error("[_worker.js] Fatal uncaught error on", url.pathname, err);
      return new Response(
        "Worker Execution Error on " + url.pathname + ":\n" + (err?.message || err) + "\n" + (err?.stack || ""),
        {
          status: 500,
          headers: { "content-type": "text/plain; charset=utf-8" },
        }
      );
    }
  },
};
`;
}

fs.writeFileSync(
  path.join(openNextAssetsDir, "_worker.js"),
  generateWorkerCode("../worker.js"),
  "utf8"
);

// 3. Mirror to .next directory as fallback
const nextDir = path.join(process.cwd(), ".next");
if (fs.existsSync(nextDir)) {
  fs.writeFileSync(
    path.join(nextDir, "_routes.json"),
    JSON.stringify(routesConfig, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(nextDir, "_worker.js"),
    generateWorkerCode("../.open-next/worker.js"),
    "utf8"
  );

  try {
    fs.cpSync(openNextAssetsDir, nextDir, { recursive: true, force: false });
  } catch (err) {
    console.warn("Notice: could not mirror assets to .next:", err.message);
  }
}

console.log(">>> [Done] Cloudflare Pages entrypoints & _routes.json ready in both .open-next/assets and .next!");

