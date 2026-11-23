# Atelier & Oak: "The Hearth Collection" email

**Concept piece.** Atelier & Oak is a fictional premium furniture brand invented for this portfolio study.
There is no client, no send, and no results. The email is hand-coded (no MJML, no framework) to show how I
build for Outlook, dark mode and dynamic content, and how I review AI-written email code.

Case study: `/work/atelier-oak-concept`. Live HTML: `/email-samples/atelier-oak/index.html` (after deployment).

## What is here

```
src/email.liquid         The hand-coded template (generic Liquid)
src/plain.txt.liquid     Plain-text version
data/full.json           Full data
data/partial.json        No first name; one product with no image
data/empty.json          Empty product list
scripts/build.mjs        liquidjs render, then juice CSS inlining, into dist/
scripts/check.mjs        Automated checks (doiuse-email, structure, images, size, contrast)
scripts/screenshot.mjs   Playwright screenshots, Chromium only
scripts/send-test.mjs    Nodemailer seed send; SMTP credentials entered at run time, never stored
scripts/make-images.py   Crops/compresses the stock photos, draws the wordmark
dist/                    Built output: full/partial/empty .html and .txt
images/                  Email images (JPEG photos at 2x, PNG wordmark)
screenshots/             Chromium renders: desktop/mobile, light/dark, three data states
reports/check-report.md  Output of the last check run
review/                  AI first draft of the product grid, and the audit of it
CREDITS.md               Photo sources and photographers
TESTING.md               Real-client test checklist (every client is PENDING)
```

## Commands

```bash
cd email-samples/atelier-oak
npm install                 # liquidjs, juice, doiuse-email, nodemailer (separate from the site's dependencies)
npm run build               # render the three data states into dist/
npm run check               # automated checks; writes reports/check-report.md
npm run screenshots         # Chromium screenshots (needs Playwright with Chromium available)
npm run publish-live        # build and copy the full-data email to public/email-samples/atelier-oak/
npm run all                 # publish-live + check + screenshots
```

`node scripts/build.mjs --base=<absolute url>` builds against a different images folder (for example a preview
deployment). The committed output always uses the production base,
`https://emmanuelgmarquez.com/email-samples/atelier-oak/images`.

## What the build does

1. **Liquid.** `liquidjs` renders `src/email.liquid` with each JSON file. Every variable has a default, the
   product loop is limited to four, a product with no image gets the fallback tile, and an empty list removes
   the whole module.
2. **Inlining.** `juice` inlines the base `<style>` block onto the elements. The `<style data-embed>` block
   (web font, resets, media queries, dark mode, `[data-ogsc]` / `[data-ogsb]`) stays in the head. The build
   counts MSO conditionals, VML elements and dark-mode rules before and after and refuses to write if any
   changed.

The Liquid is generic and rendered locally. This email was not built in, or sent from, Braze or any other ESP.

## Honest limits

- The screenshots are Chromium renders. They show the layout, the data states and the
  `prefers-color-scheme` dark styles. They do not show Outlook, Gmail or any other email client.
- No email client has been tested yet. See `TESTING.md`.
- The image URLs resolve only after the site is deployed (or after a rebuild with `--base`).
