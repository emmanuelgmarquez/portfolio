# Emmanuel G. Marquez: portfolio

The portfolio site for Emmanuel G. Marquez, Senior Marketing Technology Specialist (Salesforce Marketing Cloud, CRM & lifecycle marketing, front-end development).

- Homepage: hero with a wall of real project emails, selected work, expertise, experience, about and contact
- Recognition: FCS Portfolio Awards (Gold, Silver, Bronze) for Bank of America email, with links to the official winners lists
- Case studies: `/work/bank-of-america`, `/work/three-insurance`, `/work/car-t-talk`, `/work/apokyn`, `/work/rialto`, `/work/patient-programs`
  (`/work/resortstay-connect` permanently redirects to `/work/rialto`)
- Full-screen image viewer: zoom, keyboard (← → + − 0 Esc), touch swipe, scrollable tall emails, full-resolution originals

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4 (tokens in `src/app/globals.css`) |
| Motion | Motion (`motion/react`), with reduced-motion support |
| Icons | Lucide |
| Type | Newsreader (display, self-hosted variable font) and Geist (body) |
| Images | `next/image` with AVIF/WebP output; originals processed by `scripts/process_assets.py` |

No external services, analytics or environment variables are required.

## Requirements

- Node.js 20.9 or newer (22 LTS recommended)
- npm 10+
- Python 3 with Pillow, only if you re-process project images (`pip install Pillow`)
- Optional, for sharper enlargement of low-resolution screenshots: `pip install opencv-contrib-python-headless`
  (the FSRCNN model ships in `scripts/models/`; without OpenCV the script falls back to Lanczos)

## Commands

```bash
npm install        # install dependencies
npm run dev        # local development at http://localhost:3000
npm run build      # production build (all pages are statically generated)
npm start          # serve the production build
npm run lint       # ESLint (flat config)
npm run typecheck  # TypeScript, no emit
npm run assets     # regenerate public/projects/* from assets-source/*
```

## Project structure

```
assets-source/            Original screenshots/renders for each project (not served)
public/projects/<slug>/   Web-ready WebP images + details/ close-up crops (generated)
public/og/                Social sharing images (1200×630)
scripts/process_assets.py Image pipeline: converts, trims, crops close-ups, writes sizes
src/app/                  Routes, layout, metadata, sitemap, robots, icons
src/components/           Hero, featured work, case-study sections, viewer, header, footer
src/data/projects.ts      All case-study copy, captions, alt text and image lists
src/data/profile.ts       Experience timeline and expertise groups
src/data/assets.generated.ts  Image dimensions (generated; do not edit)
src/lib/site.ts           Name, title, URL, email, LinkedIn, nav
```

## Editing content

- **Copy, captions, alt text, tags:** `src/data/projects.ts`
- **Jobs and skills:** `src/data/profile.ts`
- **Name, email, LinkedIn, domain:** `src/lib/site.ts` (the domain feeds canonical URLs, the sitemap, robots and Open Graph)

### Bank of America archive

The Bank of America case study is generated from the production HTML archive (274 builds, 122 campaigns):

- `scripts/bofa_catalog.json`: one row per build (job code, headline, preheader, language, line of business,
  and which techniques it uses: VML, AMPscript, footnotes, animation). Built by `scripts/bofa_catalog_build.py`.
- `scripts/bofa_featured.json`: the hand-picked builds shown in "Featured campaigns", in order.
- `scripts/bofa-render/render.sh`: renders every build with Google Chrome at 820px (desktop) and inside a 375px
  iframe (mobile), with the real hosted images. Copy it and `mobile.html` next to an `emails/` folder and a
  `list.txt` of paths, then run it on a Mac.
- `scripts/process_bofa.py <renders-dir> scripts/bofa_catalog.json` trims the renders and writes
  `public/projects/bank-of-america/` plus `src/data/bofa.generated.ts`. Add `--featured-only` to redo just the
  featured set.

### Adding or replacing project images

1. Put the PNG in `assets-source/<slug>/` (file name becomes the image name, e.g. `07-new-email.png`).
2. Optional: add a close-up crop for it in `DETAILS` inside `scripts/process_assets.py`.
3. Run `npm run assets`. This writes the WebP files and refreshes `src/data/assets.generated.ts`.
4. Reference it in `src/data/projects.ts` with `img("/projects/<slug>/07-new-email.webp", title, alt, caption)`.
   The build fails loudly if an image is referenced but missing from the manifest.

## Deployment

### Vercel (recommended)

1. Push this folder to a GitHub repository.
2. In Vercel, **Add New → Project**, import the repository. The defaults are correct
   (Framework: Next.js, Build: `next build`, Output: automatic). No environment variables.
3. Deploy. Then **Settings → Domains → Add** `emmanuelgmarquez.com` (and `www.emmanuelgmarquez.com`, set to redirect to the apex).
4. At your DNS provider, add the records Vercel shows (typically an `A` record for the apex to `76.76.21.21` and a `CNAME` for `www` to `cname.vercel-dns.com`). HTTPS is issued automatically.

### Netlify

1. Push to GitHub, then **Add new site → Import an existing project**.
2. Build command `npm run build`; leave publish directory as detected. Netlify's Next.js runtime is applied automatically.
3. Add the custom domain under **Domain management**.

### Any Node host (Render, Railway, a VPS)

```bash
npm ci
npm run build
PORT=3000 npm start
```

Put it behind HTTPS (the host's TLS, or Nginx/Caddy as a reverse proxy).

### After the first deploy

- Check `https://<your-domain>/sitemap.xml` and `/robots.txt`.
- Submit the sitemap in Google Search Console.
- Paste the homepage and one case-study URL into the LinkedIn Post Inspector to confirm the preview image.
- If the domain is not `emmanuelgmarquez.com`, update `url` in `src/lib/site.ts` first.

## Notes on the content

- Awards are listed in `src/data/profile.ts` with the official FCS winners-list URL for each.
- Case-study copy describes what the supplied materials show. It makes no performance claims and invents no metrics, testimonials or awards.
- Medical, legal and safety language in the APOKYN and CAR-T TALK emails is shown exactly as supplied. Close-ups are labeled as excerpts and the complete emails are always one click away.
- Client names and trademarks belong to their owners; the footer states that work is shown for portfolio purposes.
