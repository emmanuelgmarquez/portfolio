#!/usr/bin/env node
/**
 * Local screenshots with Playwright (Chromium only).
 *
 *   node scripts/screenshot.mjs          writes screenshots/*.png
 *   node scripts/screenshot.mjs --site   also copies them into <repo>/assets-source/atelier-oak-concept/
 *                                        for the case study (then run `npm run assets` at the repo root)
 *
 * The committed build points its images at the production URL, which only resolves once the site is
 * deployed. Here those requests are intercepted and answered from the local images/ folder, so the
 * screenshots show the same HTML that ships.
 *
 * These are Chromium renders. They are NOT email-client tests; see TESTING.md.
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { readFile, mkdir, cp } from "node:fs/promises";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTION_BASE = "https://emmanuelgmarquez.com/email-samples/atelier-oak/images";

// Use the project's Playwright if there is one, otherwise the globally installed module.
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  const globalRoot = execSync("npm root -g").toString().trim();
  ({ chromium } = require(join(globalRoot, "playwright")));
}

const out = join(root, "screenshots");
await mkdir(out, { recursive: true });
const browser = await chromium.launch();

async function open(state, { width, scale, dark }) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: scale,
    colorScheme: dark ? "dark" : "light",
  });
  await context.route(`${PRODUCTION_BASE}/**`, async (route) => {
    const file = join(root, "images", basename(new URL(route.request().url()).pathname));
    const body = await readFile(file);
    await route.fulfill({ body, contentType: file.endsWith(".png") ? "image/png" : "image/jpeg" });
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(join(root, "dist", `${state}.html`)).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => getComputedStyle(i).display !== "none" && (!i.complete || i.naturalWidth === 0)).map((i) => i.src),
  );
  if (broken.length) throw new Error(`Images failed to load in ${state}: ${broken.join(", ")}`);
  return { context, page };
}

const shots = [
  ["01-desktop-light", "full", { width: 600, scale: 2, dark: false }],
  ["02-desktop-dark", "full", { width: 600, scale: 2, dark: true }],
  ["03-mobile-light", "full", { width: 375, scale: 3, dark: false }],
  ["04-mobile-dark", "full", { width: 375, scale: 3, dark: true }],
];
for (const [name, state, opts] of shots) {
  const { context, page } = await open(state, opts);
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: true });
  console.log(`screenshots/${name}.png  (${opts.width}px, ${opts.dark ? "dark" : "light"})`);
  await context.close();
}

// The three data states, cropped to the part that changes: greeting through the product grid to the button.
for (const [name, state] of [["05-state-full", "full"], ["06-state-partial", "partial"], ["07-state-empty", "empty"]]) {
  const { context, page } = await open(state, { width: 600, scale: 2, dark: false });
  const clip = await page.evaluate(() => {
    const top = document.getElementById("intro").getBoundingClientRect().top + window.scrollY;
    const bottom = document.getElementById("story").getBoundingClientRect().top + window.scrollY;
    return { x: 0, y: Math.round(top), width: 600, height: Math.round(bottom - top) };
  });
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: true, clip });
  console.log(`screenshots/${name}.png  (${state} data, cropped)`);
  await context.close();
}
await browser.close();

if (process.argv.includes("--site")) {
  const site = resolve(root, "..", "..", "assets-source", "atelier-oak-concept");
  await mkdir(site, { recursive: true });
  await cp(out, site, { recursive: true });
  console.log(`copied to ${site}`);
}
