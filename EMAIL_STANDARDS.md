# Email standards checklist

The checklist used to review hand-coded HTML email in this repository, including AI-generated drafts
(see `email-samples/atelier-oak/review/audit.md` for it applied to one). Most items can be checked
automatically with `email-samples/atelier-oak/scripts/check.mjs`; the rest need a real client.

## 1. Structure

- [ ] Table-based layout. 600px maximum width.
- [ ] `role="presentation"`, `cellpadding="0"`, `cellspacing="0"` and `border="0"` on every layout table.
- [ ] Every `<table>`, `<tr>` and `<td>` is closed, in the Outlook view and in the standard view.
- [ ] No flexbox, grid, floats or positioning for layout.
- [ ] Multi-column sections are hybrid: `inline-block` columns with a `max-width`, so they stack without a media query.
- [ ] Each hybrid section has an MSO ghost table (`<!--[if mso]>`) that fixes the column widths in Outlook.
- [ ] `<div>` only in known, MSO-safe patterns (preheader, max-width wrappers, hybrid columns, hidden swap containers).
- [ ] Spacing by `padding` on cells. `margin` only on `<p>` and headings.
- [ ] `max-width` on a `<div>` wrapper, not on a `<table>` (iOS Mail ignores it on tables).

## 2. Head

- [ ] `<!DOCTYPE html>`, `lang` on `<html>`, UTF-8 charset, viewport meta.
- [ ] `<meta name="x-apple-disable-message-reformatting">`.
- [ ] `color-scheme` and `supported-color-schemes` metas.
- [ ] Outlook `o:OfficeDocumentSettings` with `o:PixelsPerInch` 96 (the 120dpi scaling fix).
- [ ] Resets: text-size-adjust, `mso-table-lspace/rspace`, image interpolation, Apple data detectors, Gmail and Samsung link colours.

## 3. CSS

- [ ] Critical styles are inline (inlined by a build step, not by hand).
- [ ] Only media queries, dark mode and resets stay in `<style>`.
- [ ] Longhand properties: no `font`, `background` or `border-radius`-dependent layouts; px units, never `rem`.
- [ ] `line-height` in px with `mso-line-height-rule: exactly`.
- [ ] No inline `!important`.

## 4. Images

- [ ] `width` and `height` as HTML attributes and in CSS.
- [ ] `display:block` and `border:0`.
- [ ] Real alt text (empty `alt=""` only for decoration).
- [ ] Exported at 2x of the slot, under 200KB each.
- [ ] JPEG or PNG. No WebP or SVG (Outlook shows neither).
- [ ] Absolute `https://` URLs.
- [ ] No text baked into images. Headlines and buttons are live text.

## 5. Outlook on Windows

- [ ] Background images drawn with VML (`v:rect` + `v:fill`) and a solid fallback colour.
- [ ] Buttons drawn with VML (`v:roundrect`); HTML/CSS button for everyone else.
- [ ] Web fonts overridden to Georgia/Arial in an MSO-only style block, so nothing falls back to Times New Roman.
- [ ] Anything hidden by default is wrapped in `<!--[if !mso]><!-->` and carries `mso-hide:all`.

## 6. Fonts

- [ ] Web font loaded with both `@import` and `@font-face`.
- [ ] A complete fallback stack on every text element.

## 7. Dark mode

There are three behaviours to design for: clients that leave the email alone, clients that partially invert
(light backgrounds go dark, dark ones stay), and clients that fully invert everything.

- [ ] `@media (prefers-color-scheme: dark)` for Apple Mail and iOS Mail.
- [ ] `[data-ogsc]` (text colour) and `[data-ogsb]` (background) for Outlook.com and the Outlook apps.
- [ ] Off-white and off-black, never pure `#FFFFFF` or `#000000`.
- [ ] Logos are transparent PNGs with a subtle stroke, so they survive a forced inversion.
- [ ] Container swapping where a colour change is not enough: light version shown by default, dark version
      hidden, swapped in dark mode, with the dark version kept away from Outlook on Windows.

## 8. Dynamic content

- [ ] A default on every variable.
- [ ] Loops are limited to what the layout can hold.
- [ ] Missing images have a fallback.
- [ ] A module with no data is removed completely, heading included.
- [ ] Rendered and reviewed with full, partial and empty data.

## 9. Accessibility

- [ ] Semantic headings (`<h1>` to `<h3>`) inside the tables, in order.
- [ ] Body text 14px or larger.
- [ ] WCAG AA contrast (4.5:1) in light and dark, computed rather than judged by eye.
- [ ] Meaning never carried by colour alone.
- [ ] Link text that makes sense out of context.
- [ ] A plain-text version.

## 10. Deliverability and size

- [ ] HTML under 102KB, so Gmail does not clip it.
- [ ] Preheader text set and padded.
- [ ] Physical address, unsubscribe and preferences links in the footer.

## 11. Testing

- [ ] Automated checks pass (`check.mjs`).
- [ ] Rendered in real clients through Litmus or Email on Acid, plus seed sends to real inboxes.
- [ ] A client is only called "passing" when there is a screenshot of it.
