#!/usr/bin/env node
/**
 * Automated checks for the built email (run `node scripts/build.mjs` first).
 *
 *   node scripts/check.mjs       prints the report, writes reports/check-report.md, exits 1 on any failure
 *
 * 1. doiuse-email (caniemail data) for Outlook, Gmail and Apple Mail. Every flagged feature must be
 *    listed in KEPT below with the fallback that covers it; anything unlisted fails the run.
 * 2. Structure: tables/rows/cells balanced in BOTH the Outlook view (MSO conditionals unwrapped) and the
 *    non-Outlook view; role="presentation" on every table; <div> only in the known MSO-safe patterns.
 * 3. Images: width, height and alt attributes; width/height in CSS; display:block; border:0; files under
 *    200KB and exported at 2x of their slot.
 * 4. Size under 102KB (Gmail clips larger messages) for all three data states.
 * 5. Head requirements, lang, 14px minimum text, no unrendered Liquid.
 * 6. WCAG AA contrast, computed for every text/background pair in light and dark.
 *
 * None of this is an email-client test. See TESTING.md.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { doIUseEmail } from "doiuse-email";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STATES = ["full", "partial", "empty"];
const GMAIL_CLIP = 102 * 1024;
const IMAGE_LIMIT = 200 * 1024;
const html = Object.fromEntries(await Promise.all(STATES.map(async (s) => [s, await readFile(join(root, "dist", `${s}.html`), "utf8")])));

const out = [];
let failures = 0;
const say = (line = "") => out.push(line);
const result = (ok, label, detail = "") => {
  if (!ok) failures++;
  say(`- ${ok ? "PASS" : "**FAIL**"} ${label}${detail ? `: ${detail}` : ""}`);
};

/* ------------------------------------------------------------ 1. doiuse-email */

/** Features caniemail flags that this email keeps on purpose, and what covers each one. */
const KEPT = {
  "@import": "Progressive enhancement. Clients that drop it use the Georgia/Arial stacks; Outlook is forced to Georgia/Arial in an MSO-only style block.",
  "@font-face": "Same as @import: web font where supported, Georgia/Arial everywhere else.",
  "@media": "Enhancement only. Columns stack through inline-block + max-width with no media query; light is the default colour scheme.",
  ":hover": "Button hover tint only. No content depends on it.",
  "Type selector": "Used in the head-only reset block. All layout and type styles are inlined by juice.",
  "Class selector": "Only for media-query, dark-mode and reset rules. Base styles are inlined.",
  "ID selector": "Gmail/Samsung link-colour resets (u + #body, #MessageViewBody). Harmless where ignored.",
  "Attribute selector": "[data-ogsc]/[data-ogsb] target Outlook.com dark mode and a[x-apple-data-detectors] targets Apple. Ignored elsewhere by design.",
  "Adjacent sibling combinator": "Part of the Gmail-only reset `u + #body a`.",
  "Descendant combinator": "Dark-mode and reset rules in the head; nothing structural.",
  "!important keyword": "Only in the head block (dark mode, media queries), written lowercase with a leading space. Never inline.",
  "<body> element": "Gmail and Outlook mobile replace <body>, so the page colour is also set on the outer 100% table.",
  "role attribute": "role=\"presentation\" is for screen readers; a client that strips it loses nothing visual.",
  "margin": "Used on <p>/<h*> (supported in Outlook) and as `0 auto` centring, which is backed by align=\"center\" and the MSO ghost table.",
  "padding": "On table cells only, apart from the CSS button, which Outlook never sees (it gets the VML button).",
  "max-width": "Outlook: fixed-width ghost tables. iOS Mail ignores max-width on tables, so every max-width sits on a <div> wrapper.",
  "display": "inline-block columns (ghost table in Outlook) and display:none for the dark-mode swap.",
  "display:none": "Hidden dark-mode containers are wrapped in <!--[if !mso]> and carry mso-hide:all, so Outlook never has to honour it.",
  "overflow": "Only on hidden blocks (preheader, dark swap) together with max-height:0 and mso-hide:all.",
  "background attribute": "Hero photo. Outlook gets the same image through VML v:fill; bgcolor #2A2118 is the solid fallback.",
  "background-image": "Hero photo. VML v:rect/v:fill for Outlook, solid #2A2118 behind it if images are off.",
  "background-position": "Hero photo framing; VML type=\"frame\" covers Outlook.",
  "background-size": "Hero photo `cover`; the 1200x960 file already matches the 600x480 slot where it is ignored.",
  "background-repeat": "Hero photo; VML type=\"frame\" does not tile.",
  "border-radius": "2px corners on the CSS button; Outlook draws its own v:roundrect with arcsize.",
  "border": "1px hairlines on table cells and the button, well under Outlook's 8px limit; none on <p> or <div>.",
  "line-height": "Always px and always paired with mso-line-height-rule:exactly.",
  "font-weight": "500 headings render as normal weight in Outlook (Georgia), which is the intended fallback.",
  "letter-spacing": "px values only (never em).",
  "text-transform": "uppercase only; the VML button text is typed in capitals.",
  "text-decoration": "Single values only (underline, line-through, none).",
  "text-align": "left/center only, with matching align attributes on the cells.",
  "width attribute": "Pixel widths on images and ghost tables; the PixelsPerInch 96 setting handles Outlook's 120dpi scaling.",
  "height attribute": "Pixel heights on images; same DPI note as width.",
};

const clients = ["outlook.*", "gmail.*", "apple-mail.*"];
say(`## 1. doiuse-email (${clients.join(", ")})`);
say();
const flagged = new Map(); // feature -> { unsupported:Set, partial:Set }
for (const state of STATES) {
  const report = doIUseEmail(html[state], { emailClients: clients });
  for (const [kind, lines] of [["unsupported", report.errors ?? []], ["partial", report.warnings ?? []]]) {
    for (const line of lines) {
      const m = line.match(/^`(.+?)` is (?:not supported|only partially supported) by `(.+?)`/);
      if (!m) throw new Error(`Unrecognised doiuse-email line: ${line}`);
      const entry = flagged.get(m[1]) ?? { unsupported: new Set(), partial: new Set() };
      entry[kind].add(m[2]);
      flagged.set(m[1], entry);
    }
  }
}
const unlisted = [...flagged.keys()].filter((f) => !(f in KEPT));
result(unlisted.length === 0, "every flagged feature is a documented, intentional keep", unlisted.length ? `unlisted: ${unlisted.join(", ")}` : `${flagged.size} features flagged, all covered`);
say();
say("| Feature | Not supported in | Partial in | Why it stays / what covers it |");
say("|---|---|---|---|");
for (const [feature, e] of [...flagged].sort((a, b) => a[0].localeCompare(b[0]))) {
  say(`| \`${feature}\` | ${[...e.unsupported].sort().join(", ") || "-"} | ${[...e.partial].sort().join(", ") || "-"} | ${KEPT[feature] ?? "**NOT DOCUMENTED**"} |`);
}
say();
say("Removed after the first run (no longer flagged): `opacity` on the preheader, `outline` in the image reset, the `dir` attribute, and `max-width` set directly on tables (moved to `<div>` wrappers for iOS Mail).");
for (const gone of ["opacity", "outline", "dir attribute"]) result(!flagged.has(gone), `\`${gone}\` no longer flagged`);

/* ---------------------------------------------------------------- 2. structure */

/** Outlook view: unwrap <!--[if mso]> blocks, drop <!--[if !mso]><!--> ... <!--<![endif]--> blocks. */
const outlookView = (s) =>
  s
    .replace(/<!--\[if !mso\]><!-->[\s\S]*?<!--<!\[endif\]-->/g, "")
    .replace(/<!--\[if (?:gte )?mso[^\]]*\]>([\s\S]*?)<!\[endif\]-->/g, "$1")
    .replace(/<!--[\s\S]*?-->/g, "");
/** Everyone-else view: drop MSO blocks, keep the !mso content. */
const standardView = (s) =>
  s
    .replace(/<!--\[if (?:gte )?mso[^\]]*\]>[\s\S]*?<!\[endif\]-->/g, "")
    .replace(/<!--\[if !mso\]><!-->|<!--<!\[endif\]-->/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");

function balance(view) {
  const stack = [];
  const errors = [];
  const re = /<(\/?)(table|tr|td|div|v:rect|v:textbox|v:roundrect)\b[^>]*?(\/?)>/gi;
  let m;
  while ((m = re.exec(view))) {
    const [, close, tagRaw, selfClose] = m;
    const tag = tagRaw.toLowerCase();
    if (selfClose) continue;
    if (!close) stack.push(tag);
    else {
      const top = stack.pop();
      if (top !== tag) errors.push(`</${tag}> closes <${top ?? "nothing"}> near offset ${m.index}`);
    }
  }
  if (stack.length) errors.push(`unclosed: ${stack.join(", ")}`);
  return errors;
}

const DIV_PATTERNS = ["preheader", "wrap", "col", "swap-light", "swap-dark"];
say();
say("## 2. Structure");
say();
for (const state of STATES) {
  for (const [name, view] of [["Outlook view", outlookView(html[state])], ["standard view", standardView(html[state])]]) {
    const errors = balance(view);
    const tables = view.match(/<table\b[^>]*>/gi) ?? [];
    const closes = (view.match(/<\/table>/gi) ?? []).length;
    result(errors.length === 0 && tables.length === closes, `${state}, ${name}: ${tables.length} tables opened, ${closes} closed, nesting balanced`, errors.join("; "));
    const noRole = tables.filter((t) => !/role="presentation"/.test(t));
    result(noRole.length === 0, `${state}, ${name}: role="presentation" on all ${tables.length} tables`, noRole.join(" "));
  }
  const std = standardView(html[state]);
  const divs = std.match(/<div\b[^>]*>/gi) ?? [];
  const stray = divs.filter((d) => !DIV_PATTERNS.some((c) => new RegExp(`class="[^"]*\\b${c}\\b`).test(d)));
  result(stray.length === 0, `${state}: ${divs.length} <div>s, all in MSO-safe patterns (${DIV_PATTERNS.join(", ")})`, stray.join(" "));
  result(!/<div\b/i.test(outlookView(html[state]).replace(/<div class="(preheader|wrap|col|swap-light)"[^>]*>/g, "")), `${state}: Outlook is sent no <div> other than preheader, wrap, col and the light hero card`);
  const cols = (html[state].match(/<div class="col"/g) ?? []).length;
  const ghosts = (html[state].match(/<!--\[if mso\]><td width="288" valign="top"><!\[endif\]-->\s*<div class="col"/g) ?? []).length;
  result(cols === ghosts, `${state}: each of the ${cols} fluid columns sits inside an MSO ghost cell`);
}

/* ------------------------------------------------------------------- 3. images */

say();
say("## 3. Images");
say();
const pngSize = (buf) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  throw new Error("no JPEG size");
}
const seenFiles = new Map();
say("| State | Image | width × height (attr) | CSS width/height | display:block | border:0 | alt |");
say("|---|---|---|---|---|---|---|");
for (const state of STATES) {
  for (const tag of html[state].match(/<img\b[^>]*>/gi) ?? []) {
    const attr = (n) => tag.match(new RegExp(`\\s${n}="([^"]*)"`))?.[1];
    const style = attr("style") ?? "";
    const css = (p) => style.match(new RegExp(`(?:^|;)\\s*${p}:\\s*([^;]+)`))?.[1]?.trim();
    const file = basename(attr("src") ?? "");
    const hidden = /swap-dark/.test(attr("class") ?? "");
    const checks = {
      wh: /^\d+$/.test(attr("width") ?? "") && /^\d+$/.test(attr("height") ?? ""),
      css: Boolean(css("width") && css("height")),
      block: css("display") === "block" || (hidden && css("display") === "none"),
      border: /^0/.test(css("border") ?? ""),
      alt: (attr("alt") ?? "").trim().length > 0,
    };
    const ok = Object.values(checks).every(Boolean);
    if (!ok) failures++;
    const mark = (b) => (b ? "yes" : "**NO**");
    say(`| ${state} | ${file} | ${attr("width")} × ${attr("height")} | ${css("width")} / ${css("height")} | ${hidden ? "none until dark swap" : mark(checks.block)} | ${mark(checks.border)} | ${checks.alt ? `“${attr("alt").replace(/&amp;/g, "&")}”` : "**MISSING**"} |`);
    seenFiles.set(file, [Number(attr("width")), Number(attr("height"))]);
  }
}
for (const m of html.full.matchAll(/background="[^"]*\/([^"\/]+)"[^>]*height="(\d+)"/g)) seenFiles.set(m[1], [600, Number(m[2])]);
say();
for (const [file, [w, h]] of seenFiles) {
  const buf = await readFile(join(root, "images", file));
  const [fw, fh] = file.endsWith(".png") ? pngSize(buf) : jpegSize(buf);
  const kb = (buf.length / 1024).toFixed(0);
  result(buf.length < IMAGE_LIMIT && fw === w * 2 && Math.abs(fh - h * 2) <= 2, `${file}: ${kb} KB, ${fw}×${fh} file for a ${w}×${h} slot (2x)`);
  result(!/\.webp$/i.test(file), `${file}: JPEG/PNG, not WebP`);
}

/* --------------------------------------------------------------------- 4. size */

say();
say("## 4. Size (Gmail clips above 102 KB)");
say();
for (const state of STATES) {
  const bytes = Buffer.byteLength(html[state]);
  result(bytes < GMAIL_CLIP, `dist/${state}.html`, `${(bytes / 1024).toFixed(1)} KB of 102 KB (${Math.round((bytes / GMAIL_CLIP) * 100)}%)`);
}

/* ------------------------------------------------------------- 5. head and text */

say();
say("## 5. Head, language, text size, Liquid");
say();
const h = html.full;
const needs = [
  ["lang attribute on <html>", /<html lang="en"/],
  ["x-apple-disable-message-reformatting", /<meta name="x-apple-disable-message-reformatting">/],
  ["color-scheme meta", /<meta name="color-scheme" content="light dark">/],
  ["supported-color-schemes meta", /<meta name="supported-color-schemes" content="light dark">/],
  ["OfficeDocumentSettings with PixelsPerInch 96", /<o:OfficeDocumentSettings>[\s\S]*<o:PixelsPerInch>96<\/o:PixelsPerInch>/],
  ["MSO-only font override (Georgia/Arial)", /<!--\[if mso\]>\s*<style>[\s\S]*Georgia[\s\S]*Arial[\s\S]*<\/style>\s*<!\[endif\]-->/],
  ["@import and @font-face for the web font", /@import url\([\s\S]*@font-face/],
  ["prefers-color-scheme: dark block", /@media \(prefers-color-scheme: dark\)/],
  ["[data-ogsc] and [data-ogsb] rules", /\[data-ogsc\][\s\S]*\[data-ogsb\]|\[data-ogsb\][\s\S]*\[data-ogsc\]/],
  ["VML hero (v:rect + v:fill with fallback colour)", /<v:rect[\s\S]*<v:fill type="frame" src="https:\/\/[^"]+" color="#2A2118"/],
  ["VML bulletproof button (v:roundrect)", /<v:roundrect[\s\S]*<w:anchorlock\/>/],
  ["dark logo and dark hero card hidden from Outlook", /<!--\[if !mso\]><!-->\s*<img class="swap-dark"[\s\S]*<!--\[if !mso\]><!-->[\s\S]*<div class="swap-dark"/],
  ["one <h1>-level heading per rendered mode, <h2>/<h3> below it", /<h1[\s\S]*<h2[\s\S]*<h3/],
  ["absolute https image URLs only", /^(?![\s\S]*(?:src|background)="(?!https:\/\/))/],
];
for (const [label, re] of needs) result(re.test(h), label);
for (const state of STATES) {
  result(!/\{\{|\{%|%\}|\}\}/.test(html[state]), `${state}: no unrendered Liquid`);
  const sizes = [...standardView(html[state]).replace(/<head[\s\S]*?<\/head>/, "").matchAll(/font-size:\s*(\d+)px/g)].map((m) => Number(m[1])).filter((n) => n > 1);
  result(Math.min(...sizes) >= 14, `${state}: smallest text size is ${Math.min(...sizes)}px (minimum 14px)`);
  result(/mso-line-height-rule: ?exactly/.test(html[state]), `${state}: mso-line-height-rule: exactly present`);
}
result(/Hi there,/.test(html.partial) && /Hi Maya,/.test(html.full), "first_name default: partial data greets “Hi there,”");
result(/product-fallback\.png/.test(html.partial) && !/product-fallback\.png/.test(html.full), "missing product image falls back to product-fallback.png (partial data only)");
result(!/New this season/.test(html.empty) && !/class="col"/.test(html.empty), "empty product list removes the whole grid module, heading included");
result(/Now \$1,790/.test(html.full) && /line-through[^>]*>Was \$2,150/.test(html.full), "sale price logic: Now/Was on the sale item, single price on the rest");

/* ------------------------------------------------------------------ 6. contrast */

say();
say("## 6. Colour contrast (WCAG 2.x AA: 4.5:1 text, 3:1 large text)");
say();
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// [mode, what, text colour, background colour, large text?]
const PAIRS = [
  ["light", "Body and headings on card", "#1F1D1A", "#FAF8F4"],
  ["light", "Secondary text on card", "#5C564D", "#FAF8F4"],
  ["light", "Accent (eyebrow, sale price) on card", "#7A4E22", "#FAF8F4"],
  ["light", "Body on story panel", "#1F1D1A", "#E9E2D6"],
  ["light", "Accent link on story panel", "#7A4E22", "#E9E2D6"],
  ["light", "Footer text on page ground", "#5C564D", "#EDE8E0"],
  ["light", "Button label on button", "#FAF8F4", "#1F1D1A"],
  ["light", "Button label on hover tint", "#FAF8F4", "#3A352E"],
  ["dark", "Body and headings on card", "#F2EEE7", "#1C1B19"],
  ["dark", "Secondary text on card", "#B9B2A7", "#1C1B19"],
  ["dark", "Accent (eyebrow, sale price) on card", "#E0B37E", "#1C1B19"],
  ["dark", "Body on story panel", "#F2EEE7", "#262421"],
  ["dark", "Accent link on story panel", "#E0B37E", "#262421"],
  ["dark", "Footer text on page ground", "#B9B2A7", "#121110"],
  ["dark", "Button label on button", "#1C1B19", "#F2EEE7"],
  ["dark", "Button label on hover tint", "#1C1B19", "#DDD6CB"],
];
say("| Mode | Pair | Text | Background | Ratio | AA (4.5:1) |");
say("|---|---|---|---|---|---|");
for (const [mode, what, fg, bg] of PAIRS) {
  const r = ratio(fg, bg);
  const used = [fg, bg].every((c) => new RegExp(c, "i").test(h));
  if (r < 4.5 || !used) failures++;
  say(`| ${mode} | ${what} | ${fg} | ${bg} | ${r.toFixed(2)}:1 | ${r >= 4.5 ? "pass" : "**FAIL**"}${used ? "" : " **colour not found in the HTML**"} |`);
}
say();
result(!/#FFFFFF|#FFF\b|#000000|#000\b/i.test(h.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/g, "")), "no pure #FFFFFF or #000000 anywhere (off-white and off-black only)");
say("Hero text sits on a solid card (not on the photograph), so its contrast is the card pair above in both modes.");

/* ----------------------------------------------------------------------- output */

let commit = "";
try { commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: root }).toString().trim(); } catch {}
const header = [
  "# Automated check report: Atelier & Oak concept email",
  "",
  `Generated by \`scripts/check.mjs\`${commit ? ` (working tree on top of ${commit})` : ""}. Static analysis and Chromium only; **no email client has been tested**. See TESTING.md.`,
  "",
  `**Result: ${failures === 0 ? "all checks passed" : `${failures} check(s) FAILED`}**`,
  "",
];
const report = [...header, ...out, ""].join("\n");
await mkdir(join(root, "reports"), { recursive: true });
await writeFile(join(root, "reports", "check-report.md"), report);
console.log(report);
process.exit(failures === 0 ? 0 : 1);
