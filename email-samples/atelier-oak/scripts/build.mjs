#!/usr/bin/env node
/**
 * Build the Atelier & Oak concept email.
 *
 *   node scripts/build.mjs                       render the three data states into dist/
 *   node scripts/build.mjs --base=<url>          use another absolute URL for the images folder
 *   node scripts/build.mjs --publish             also copy the full-data build, plain text and images
 *                                                to <repo>/public/email-samples/atelier-oak/
 *
 * Steps: Liquid (liquidjs) -> CSS inlining (juice). The <style data-embed> block (fonts, resets,
 * media queries, dark mode, [data-ogsc]) is left in the head; the plain <style> block is inlined
 * onto the elements and removed. MSO conditional comments and VML pass through untouched,
 * and the build fails if any of them go missing.
 */
import { readFile, writeFile, mkdir, cp, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Liquid } from "liquidjs";
import juice from "juice";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const arg = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

export const PRODUCTION_BASE = "https://emmanuelgmarquez.com/email-samples/atelier-oak/images";
const assetBase = (arg("base") ?? process.env.ASSET_BASE ?? PRODUCTION_BASE).replace(/\/$/, "");
const publish = args.includes("--publish");
const STATES = ["full", "partial", "empty"];

const engine = new Liquid({ root: join(root, "src"), strictFilters: true, jsTruthy: false });

const count = (s, re) => (s.match(re) ?? []).length;
const fingerprint = (html) => ({
  msoOpen: count(html, /<!--\[if [^\]]*mso[^\]]*\]>/g),
  msoClose: count(html, /<!\[endif\]-->/g),
  vml: count(html, /<v:(rect|roundrect|fill|textbox)\b/g),
  ogsc: count(html, /\[data-ogsc\]/g),
  ogsb: count(html, /\[data-ogsb\]/g),
  darkQuery: count(html, /prefers-color-scheme:\s*dark/g),
  fontFace: count(html, /@font-face/g),
  importRule: count(html, /@import/g),
});

async function loadData(state) {
  const raw = await readFile(join(root, "data", `${state}.json`), "utf8");
  return { ...JSON.parse(raw.replaceAll("{{ASSET_BASE}}", assetBase)), asset_base: assetBase };
}

await mkdir(join(root, "dist"), { recursive: true });
const template = await readFile(join(root, "src", "email.liquid"), "utf8");
const plainTemplate = await readFile(join(root, "src", "plain.txt.liquid"), "utf8");

for (const state of STATES) {
  const data = await loadData(state);
  const rendered = await engine.parseAndRender(template, data);
  const before = fingerprint(rendered);

  const inlined = juice(rendered, {
    removeStyleTags: true, // the plain <style> block; <style data-embed> is kept by juice
    preserveMediaQueries: true,
    preserveFontFaces: true,
    preserveImportant: true,
    applyWidthAttributes: false,
    applyHeightAttributes: false,
    applyAttributesTableElements: false,
    inlinePseudoElements: false,
    xmlMode: false,
  })
    // Tidy the blank lines Liquid tags leave behind (never inside a tag).
    .replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n");

  const after = fingerprint(inlined);
  for (const key of Object.keys(before)) {
    if (before[key] !== after[key]) {
      throw new Error(`[${state}] juice changed "${key}": ${before[key]} before, ${after[key]} after. Refusing to write.`);
    }
  }

  const text = (await engine.parseAndRender(plainTemplate, data)).replace(/\n{3,}/g, "\n\n").trimStart();
  await writeFile(join(root, "dist", `${state}.html`), inlined);
  await writeFile(join(root, "dist", `${state}.txt`), text);
  const kb = (Buffer.byteLength(inlined) / 1024).toFixed(1);
  console.log(`dist/${state}.html  ${kb} KB   (mso blocks ${after.msoOpen}, vml ${after.vml}, [data-ogsc] ${after.ogsc})`);
}
console.log(`asset base: ${assetBase}`);

if (publish) {
  if (assetBase !== PRODUCTION_BASE) throw new Error("--publish only with the production asset base.");
  const out = resolve(root, "..", "..", "public", "email-samples", "atelier-oak");
  await mkdir(join(out, "images"), { recursive: true });
  await cp(join(root, "dist", "full.html"), join(out, "index.html"));
  await cp(join(root, "dist", "full.txt"), join(out, "plain.txt"));
  for (const f of await readdir(join(root, "images"))) await cp(join(root, "images", f), join(out, "images", f));
  console.log(`published to ${out}`);
}
