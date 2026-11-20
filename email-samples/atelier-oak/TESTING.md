# Client testing checklist

**Concept piece.** Atelier & Oak is a fictional brand.

**Status (20 Nov 2026): tested on Email on Acid (Mailgun Inspect), all 103 clients.** The screenshots on the
case study page are real client renders from that run, filed as `assets-source/atelier-oak-concept/client-<id>.jpg`.
Samsung Mail is not in Mailgun Inspect's client list, so it was replaced on the page by Outlook 2016 at 125%
scaling and Outlook 2024 dark mode. The seed sends in section 2 have not been done.

Testing found four Outlook bugs that the automated checks did not:

1. **Outlook 2024, Windows, dark mode:** the VML button label turned dark on the dark button. Fixed with
   `mso-color-alt:auto` on the label.
2. **Classic Outlook (2016, 2019, 365, 2024):** the whole email rendered at 648px. The hero cell's 24px padding
   was added around the 600px VML rect. Fixed with `mso-padding-alt:0` on the hero cell and a 552px inner cell.

3. **Outlook 2019, 365, Microsoft 365 and 2024:** headings fell back to Calibri. These versions read the first family of
   the inline stack (the web font), miss it and ignore the MSO Georgia rule. Fixed by starting the inline stack with
   Georgia and adding Cormorant Garamond in a head rule hidden from Outlook.
4. **Outlook 2024, dark mode:** the dark logo sat on a darkened logo bar, so only its outline showed. Fixed with a
   solid light VML band behind the logo in Outlook.

All four were re-tested on every client before the screenshots were taken (final run: build 7ead8ca). New Outlook for
Windows did not render in the final run, so the page shows Microsoft 365 on Windows 11 in its place. Outlook.com is
shown from the Edge capture because the Chrome capture had a Microsoft Rewards popup over the email.

## 0. Before you test: the images have to be online

The email's images are absolute URLs under
`https://emmanuelgmarquez.com/email-samples/atelier-oak/images/`. Email clients (and Outlook's VML) cannot use
relative paths. Those URLs return nothing until this branch is deployed, so until then every test would show
broken images. Two ways to fix that:

1. **After deploying the site:** nothing to do. Use `dist/full.html` as it is.
2. **Before deploying, with a preview URL** (any URL that serves this branch's `public/` folder):

   ```bash
   cd email-samples/atelier-oak
   npm install
   node scripts/build.mjs --base=https://<preview-host>/email-samples/atelier-oak/images
   ```

   Test with the files this writes to `dist/`. Do not commit them or run `--publish` with a preview base;
   run `node scripts/build.mjs` again afterwards to restore the production URLs.

Check first: open `<base>/logo-light.png` in a browser. If it does not load, stop.

## 1. Litmus or Email on Acid

Paste the full contents of `dist/full.html` into a new test. Also run `dist/partial.html` and `dist/empty.html`
in at least one Outlook, one Gmail and one Apple Mail client.

| ID (screenshot file name) | Client | What to look for |
|---|---|---|
| `outlook-2016-windows` | Outlook 2016, Windows | Hero photo fills 600×480 with the cream card bottom-left (VML). Headings in Georgia, body in Arial, never Times New Roman. Product grid is 2×2 with equal 288px columns (ghost table). Button is a dark rectangle with centred white text and the whole shape is clickable. Only one logo and one hero card visible. No extra gaps under images. |
| `outlook-2019-windows` | Outlook 2019, Windows | Same as 2016. |
| `outlook-365-windows` | Outlook 365 (classic), Windows | Same as 2016. Also test at 120 DPI if the tool offers it: nothing should scale up or overflow 600px. |
| `outlook-new-windows` | New Outlook, Windows | Renders like Outlook.com: web font may load, CSS button (not VML), rounded 2px corners. Grid 2×2. |
| `outlook-com-light` | Outlook.com, light | Layout matches the Chromium light screenshot. Link colours are the brown accent, not default blue. |
| `outlook-com-dark` | Outlook.com, dark | `[data-ogsc]`/`[data-ogsb]` rules apply: dark card background, off-white text, light button with dark label. Dark logo and dark hero card swapped in, light versions gone. No black-on-dark or white-on-white text anywhere. |
| `gmail-web` | Gmail, web (Chrome) | Not clipped: no "[Message clipped] View entire message" at the bottom. Fallback fonts (Georgia/Arial) are expected. Grid 2×2. Footer links keep their colour. |
| `gmail-ios` | Gmail app, iOS | Single-column grid, full-width product photos, full-width button. In dark mode Gmail iOS fully inverts colours: check the logo is still legible (this is what the stroke is for) and no text disappears. |
| `gmail-android` | Gmail app, Android | Same as iOS. Dark mode here is a partial inversion: light backgrounds go dark, the photos are untouched. Check contrast on the card and the story panel. |
| `apple-mail-macos-light` | Apple Mail, macOS, light | Cormorant Garamond loads for headings. Matches the Chromium light screenshot. |
| `apple-mail-macos-dark` | Apple Mail, macOS, dark | `prefers-color-scheme` styles apply. Dark logo and dark hero card shown; light ones hidden. Matches the Chromium dark screenshot. |
| `apple-mail-ios-light` | Apple Mail, iOS, light | Web font loads. Single column. Email is not zoomed out or reflowed (the `x-apple-disable-message-reformatting` meta). Phone numbers/dates/addresses are not auto-linked in blue. |
| `apple-mail-ios-dark` | Apple Mail, iOS, dark | As macOS dark, at phone width. |
| `samsung-mail` | Samsung Mail, Android | Single column, links not recoloured, images scale to the screen. Check dark mode if the tool offers it. |
| `yahoo-mail` | Yahoo Mail, web | Grid 2×2, centred at 600px. Media-query rules may be ignored; the layout must still hold. |

In every client also check:

- Preheader in the inbox list reads "Four new pieces in oak, walnut and bouclé, made for the long evenings ahead." with no body copy leaking in after it.
- Images off: every image shows its alt text, the hero shows the solid dark-brown fallback with the headline still readable.
- `partial.html`: greeting is "Hi there,", the third product shows the A&O fallback tile.
- `empty.html`: no "New this season" heading and no gap where the grid was.

## 2. Seed sends

Send the real email to real inboxes. SMTP credentials are yours to enter; the script stores nothing.

```bash
cd email-samples/atelier-oak
npm install
node scripts/build.mjs            # or with --base=<preview> as in section 0
SMTP_HOST=smtp.example.com SMTP_USER=you@example.com node scripts/send-test.mjs you@gmail.com you@outlook.com
```

The script asks for anything not set in the environment (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
`SMTP_FROM`), with the password hidden as you type. With a Gmail or Outlook.com sending account use an app
password. Never commit credentials.

| ID (screenshot file name) | Inbox | What to look for |
|---|---|---|
| `seed-gmail` | Your Gmail address, in the browser | Subject and preheader in the inbox list. Not clipped. Lands in Primary or Promotions, not Spam (a one-off SMTP send says little about deliverability; note it, do not report it as a result). |
| `seed-outlook-com` | Your Outlook.com address | Light and dark. Same checks as the Outlook.com rows above. |
| `seed-iphone` | Your iPhone (Apple Mail, and the Gmail app if you use it) | Light and dark, by switching the phone's appearance. Tap the button and one product: the tap targets are comfortable and the links open. Plain-text part: view it with "View > Message > Plain Text Alternative" in Apple Mail on a Mac. |

## 3. Recording a pass on the case study

The "Tested across clients" grid on `/work/atelier-oak-concept` reads its status from the screenshots that
exist. To flip a client from PENDING:

1. Save the screenshot as a PNG named with the ID from the tables above, prefixed `client-`, into
   `assets-source/atelier-oak-concept/`. Example: `assets-source/atelier-oak-concept/client-outlook-365-windows.png`.
2. From the repository root run `npm run assets` (needs Python with Pillow).
   The script reprocesses every project, and on a different machine it can re-encode some of the older
   projects' images slightly differently. Those changes are not needed: before committing, run
   `git status` and undo anything outside `public/projects/atelier-oak-concept/` and
   `src/data/assets.generated.ts` (`git checkout -- public/projects/<other-project>`).
3. Rebuild the site. That client now shows the screenshot and "Tested" instead of PENDING.

Only add a screenshot for a client that actually renders correctly. If a client shows a problem, fix the
email first (edit `src/email.liquid`, then `npm run all` in this folder) and test again. To take a client
back to PENDING, delete its PNG and run `npm run assets` again.
