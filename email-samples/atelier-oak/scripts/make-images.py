#!/usr/bin/env python3
"""
Prepare the email images: crop the stock originals to their 2x slot sizes, save as
progressive JPEG under 200KB, and draw the Atelier & Oak wordmark as transparent PNGs.

  python3 scripts/make-images.py <folder with originals> <Cormorant Garamond 600 .ttf>

Originals are the Unsplash downloads listed in CREDITS.md (hero.jpg, chair.jpg, ...).
They are not committed; the processed files in images/ are.
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

SRC = Path(sys.argv[1])
FONT = sys.argv[2]
OUT = Path(__file__).resolve().parent.parent / "images"
OUT.mkdir(exist_ok=True)
LIMIT = 200 * 1024

# name: (source, 2x width, 2x height, crop centering x, y)
PHOTOS = {
    "hero-autumn-light.jpg": ("hero.jpg", 1200, 960, 0.5, 0.5),
    "product-lounge-chair.jpg": ("chair.jpg", 528, 646, 0.45, 0.62),
    "product-round-table.jpg": ("table.jpg", 528, 646, 0.5, 1.0),
    "product-sideboard.jpg": ("sideboard.jpg", 528, 646, 0.5, 0.6),
    "product-floor-lamp.jpg": ("lamp.jpg", 528, 646, 0.5, 0.25),
    "story-workshop.jpg": ("story.jpg", 1200, 680, 0.5, 0.45),
}

for name, (src, w, h, cx, cy) in PHOTOS.items():
    im = ImageOps.fit(Image.open(SRC / src).convert("RGB"), (w, h), Image.LANCZOS, centering=(cx, cy))
    for q in (84, 80, 76, 72, 68, 64, 60):
        im.save(OUT / name, "JPEG", quality=q, optimize=True, progressive=True)
        if (OUT / name).stat().st_size < LIMIT:
            break
    print(f"{name}: {w}x{h} q{q} {(OUT / name).stat().st_size / 1024:.0f}KB")


def wordmark(name: str, fill: str, stroke: str) -> None:
    """ATELIER & OAK, letterspaced, 2x of a 208x32 slot, transparent, with a 1px (2x) stroke."""
    W, H, size, track = 416, 64, 40, 9
    font = ImageFont.truetype(FONT, size)
    text = "ATELIER & OAK"
    widths = [font.getlength(c) for c in text]
    total = sum(widths) + track * (len(text) - 1)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = (W - total) / 2
    for c, cw in zip(text, widths):
        d.text((x, H / 2 + 1), c, font=font, fill=fill, anchor="lm", stroke_width=1, stroke_fill=stroke)
        x += cw + track
    im.save(OUT / name, "PNG", optimize=True)
    print(f"{name}: {W}x{H} {(OUT / name).stat().st_size / 1024:.1f}KB")


# Light wordmark: ink letters, faint off-white stroke. Dark wordmark: the reverse.
# The stroke keeps the letters legible if a client inverts the background behind them.
wordmark("logo-light.png", "#1F1D1A", "#FAF8F480")
wordmark("logo-dark.png", "#F2EEE7", "#1C1B1980")

# Fallback tile for a product with no image: brand monogram on a sand ground (a graphic, not a photo).
tile = Image.new("RGB", (528, 646), "#E3DCD0")
d = ImageDraw.Draw(tile)
d.text((264, 311), "A&O", font=ImageFont.truetype(FONT, 96), fill="#8B8273", anchor="mm")
d.line((224, 384, 304, 384), fill="#8B8273", width=2)
tile.save(OUT / "product-fallback.png", "PNG", optimize=True)
print("product-fallback.png", (OUT / "product-fallback.png").stat().st_size)
