# AI code review: product grid

**Concept piece.** Atelier & Oak is a fictional brand.

`ai-first-draft.html` is a fast first draft of the product grid, written by an AI assistant (Claude) asked for
a quick, generic "responsive 2x2 product grid with Liquid". It is saved exactly as generated. It looks fine in a
browser, which is the problem: a browser is not an email client.

This file is the review of that draft against [`EMAIL_STANDARDS.md`](../../../EMAIL_STANDARDS.md). Every issue
below is present in the draft at the line given. The reviewed version is the product grid module in
[`src/email.liquid`](../src/email.liquid) (search for `PRODUCT GRID`).

## Findings

| # | Draft line(s) | What the draft does | Why it fails in email | Fix in the reviewed build |
|---|---|---|---|---|
| 1 | 3, 4, 11 | Lays the grid out with `display: flex`, `flex-wrap`, `gap` and `calc()` | Outlook on Windows renders with Word, which ignores flexbox, so the four products collapse into one unstyled column. `gap` and `calc()` are also unreliable in several webmail clients. | Hybrid columns: `display:inline-block` blocks with `max-width:288px`, which sit side by side at 600px and stack on a phone with no media query. |
| 2 | whole file | No `<!--[if mso]>` conditionals anywhere | Nothing pins the column widths in Outlook, and there is no place to give Outlook its own markup. | An MSO ghost table: a 576px table with a `288px` cell around each column and a new ghost row after every second product. |
| 3 | 14, 24 | Two `<table>` elements with no `role="presentation"`, and no `cellpadding`, `cellspacing` or `border` reset | Screen readers announce layout tables as data tables ("table with 1 row and 2 columns"). Without the resets, clients add their own cell spacing. | `role="presentation" cellpadding="0" cellspacing="0" border="0"` on every table. |
| 4 | 21 | `<img>` with no `alt`, no `width`, no `height`, no `display:block`, no `border:0` | With images blocked the product is invisible and unnamed. Outlook renders an image with no width at its file size, so the 2x file shows at double size and breaks the layout. Inline images get a gap underneath; linked images can get a blue border. | `width="264" height="323"` as attributes and in CSS, `display:block`, `border:0`, and alt text from `product.image_alt`, defaulting to the product name. |
| 5 | 25 to 32 | The price table never closes its `<tr>`, and the sale branch never closes `<td class="was">` | Browsers repair this silently. Word-based Outlook and some webmail sanitisers do not repair it the same way, which is how nested-table layouts drift or lose a column. | Price is a single `<p>` with `<span>`s; every table, row and cell is closed. `scripts/check.mjs` verifies the nesting in both the Outlook view and the standard view. |
| 6 | 6, 8, 17 | `font` shorthand and `rem` units (`font: 600 1.25rem/1.3 ...`) | Outlook can drop the whole `font` shorthand, falling back to Times New Roman at the default size. `rem` is not supported in every client. | Longhand `font-family`, `font-size`, `line-height`, `font-weight` in px, with `mso-line-height-rule: exactly`, and an MSO-only style block that forces Georgia/Arial. |
| 7 | 3, 6, 7, 8 | Spacing by `margin` on `<div>`s and on a `<table>`; centring by `margin: 0 auto` | Outlook ignores margins on tables and applies them inconsistently on block elements, and does not support `auto`. | Spacing by `padding` on table cells; centring by `align="center"` and the ghost table. Margins are kept only on `<p>` and headings, where Outlook honours them. |
| 8 | 4, 5 | `border-radius`, `box-shadow`, `overflow: hidden`, `object-fit: cover`, `aspect-ratio` | None are supported by Outlook on Windows; `object-fit` and `aspect-ratio` are missing in more clients than that. The card design depends on all five. | The photographs are cropped to the slot in the image file itself (528x646 for a 264x323 slot), so no CSS cropping is needed. No card chrome that only some clients can draw. |
| 9 | 2 to 12 | All styling lives in a `<style>` block with class selectors; nothing is inline | Gmail with a non-Google account, and any client that strips or truncates `<style>`, shows the grid with no styling at all. | `juice` inlines the base styles at build time. Only media queries, dark mode and resets stay in the head. |
| 10 | 4, 6 | Pure `#fff` background and pure `#000` text | Pure white and black are the colours forced dark modes invert hardest, and there is no dark-mode styling at all. | Off-white `#FAF8F4` and off-black `#1F1D1A`, plus `prefers-color-scheme` and `[data-ogsc]` / `[data-ogsb]` rules. |
| 11 | 7, 10 | Material line is `12px` in `#999` on `#fff`; the old price is dimmed with `opacity: .5` | `#999` on `#fff` is 2.85:1, which fails WCAG AA (4.5:1), and 12px is under the 14px minimum. `opacity` is not supported in Outlook. | 14px `#5C564D` on `#FAF8F4`, 6.84:1. No opacity. |
| 12 | 26 to 28 | Sale and original price differ only by colour and a strike-through | Colour alone does not carry meaning for colour-blind readers, and a screen reader reads two prices with no explanation. | The words "Now" and "Was" are part of the text. |
| 13 | 19 to 30 | Liquid with no defaults, no `limit`, no image fallback and no empty-state guard | A missing image renders `<img src="">`; a fifth product breaks the 2x2; an empty list leaves the "New this season" heading above nothing. | `limit:4`, `default` on every variable, a fallback image, and the whole module (heading included) wrapped in `{% if products and products.size > 0 %}`. |

## How each fix was confirmed

- Structure, image attributes, text size, contrast and Liquid output: `node scripts/check.mjs` (see `reports/check-report.md`).
- The three data states: `dist/full.html`, `dist/partial.html`, `dist/empty.html` and their screenshots.
- Outlook, Gmail, Apple Mail and the rest: **not yet tested in real clients.** See `TESTING.md`. Nothing here claims a client pass.
