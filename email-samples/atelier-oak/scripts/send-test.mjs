#!/usr/bin/env node
/**
 * Seed-send the built email to your own inboxes with Nodemailer.
 *
 *   node scripts/send-test.mjs you@gmail.com you@outlook.com
 *   node scripts/send-test.mjs --state=partial you@gmail.com
 *
 * SMTP settings come from environment variables, and anything missing is asked for at the prompt:
 *   SMTP_HOST  SMTP_PORT (default 587)  SMTP_USER  SMTP_PASS  SMTP_FROM (default SMTP_USER)
 *
 * Nothing is stored. Do not put credentials in this file or commit them. With Gmail or Outlook.com as the
 * sending account, use an app password, not your normal password.
 *
 * The email's images are absolute URLs. They show only if those URLs are online: either the site has been
 * deployed, or you rebuilt with `node scripts/build.mjs --base=<preview url>/email-samples/atelier-oak/images`.
 */
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import nodemailer from "nodemailer";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const state = args.find((a) => a.startsWith("--state="))?.split("=")[1] ?? "full";
const recipients = args.filter((a) => !a.startsWith("--"));

function ask(question, { hidden = false } = {}) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((done) => {
    if (hidden) {
      // Do not echo the password.
      rl._writeToOutput = (s) => { if (s.includes(question)) process.stdout.write(question); };
    }
    rl.question(question, (answer) => { rl.close(); if (hidden) process.stdout.write("\n"); done(answer.trim()); });
  });
}

const host = process.env.SMTP_HOST || (await ask("SMTP host: "));
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER || (await ask("SMTP user: "));
const pass = process.env.SMTP_PASS || (await ask("SMTP password (hidden): ", { hidden: true }));
const from = process.env.SMTP_FROM || user;
const to = recipients.length ? recipients : (await ask("Send to (comma separated): ")).split(",").map((s) => s.trim()).filter(Boolean);
if (!host || !user || !pass || to.length === 0) {
  console.error("Missing SMTP settings or recipients. Nothing sent.");
  process.exit(1);
}

const html = await readFile(join(root, "dist", `${state}.html`), "utf8");
const text = await readFile(join(root, "dist", `${state}.txt`), "utf8");

// Warn (do not block) when the images are not online yet.
const firstImage = html.match(/src="(https:\/\/[^"]+\.png)"/)?.[1];
if (firstImage) {
  try {
    const res = await fetch(firstImage, { method: "HEAD" });
    if (!res.ok) console.warn(`Warning: ${firstImage} answered ${res.status}. Images will be broken in the inbox until that URL is live.`);
  } catch {
    console.warn(`Warning: could not reach ${firstImage}. Images will be broken in the inbox until that URL is live.`);
  }
}

const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
await transport.verify();
for (const address of to) {
  const info = await transport.sendMail({
    from: `"Atelier & Oak (concept test)" <${from}>`,
    to: address,
    subject: `[TEST] The Hearth Collection has arrived${state === "full" ? "" : ` (${state} data)`}`,
    html,
    text,
  });
  console.log(`sent to ${address}: ${info.messageId}`);
}
