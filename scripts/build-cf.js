#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log(">>> [1/2] Building Next.js for Cloudflare with OpenNext...");
execSync("npx opennextjs-cloudflare build", { stdio: "inherit" });

console.log(">>> [2/2] Preparing Cloudflare Pages _worker.js entrypoint...");
const assetsDir = path.join(process.cwd(), ".open-next", "assets");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const workerContent = `export * from "../worker.js";\nexport { default } from "../worker.js";\n`;
fs.writeFileSync(path.join(assetsDir, "_worker.js"), workerContent, "utf8");

console.log(">>> [Done] Cloudflare build ready in .open-next/assets with _worker.js!");
