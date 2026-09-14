#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log(">>> [1/2] Building Next.js for Cloudflare with OpenNext...");
execSync("npx opennextjs-cloudflare build", { stdio: "inherit" });

console.log(">>> [2/2] Preparing Cloudflare Pages _worker.js entrypoints...");
const openNextAssetsDir = path.join(process.cwd(), ".open-next", "assets");
if (!fs.existsSync(openNextAssetsDir)) {
  fs.mkdirSync(openNextAssetsDir, { recursive: true });
}

const workerContentForOpenNext = `export * from "../worker.js";\nexport { default } from "../worker.js";\n`;
fs.writeFileSync(path.join(openNextAssetsDir, "_worker.js"), workerContentForOpenNext, "utf8");

// Mirror entrypoint and assets to .next so deployment succeeds whether output dir is .open-next/assets OR .next
const nextDir = path.join(process.cwd(), ".next");
if (fs.existsSync(nextDir)) {
  const workerContentForNext = `export * from "../.open-next/worker.js";\nexport { default } from "../.open-next/worker.js";\n`;
  fs.writeFileSync(path.join(nextDir, "_worker.js"), workerContentForNext, "utf8");

  try {
    fs.cpSync(openNextAssetsDir, nextDir, { recursive: true, force: false });
  } catch (err) {
    console.warn("Notice: could not mirror assets to .next:", err.message);
  }
}

console.log(">>> [Done] Cloudflare Pages entrypoints ready in both .open-next/assets and .next!");
