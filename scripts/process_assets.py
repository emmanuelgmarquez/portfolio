#!/usr/bin/env python3
"""
Build the web-ready project imagery from the originals in assets-source/.

  python3 scripts/process_assets.py

For every project folder it writes, into public/projects/<slug>/:
  - <name>.webp           full-resolution image used by the viewer
                          (lossless WebP for email screenshots, so text stays crisp)
  - details/<name>.webp   close-up crops defined in DETAILS below
and regenerates src/data/assets.generated.ts with every image's real
width/height so layouts never distort or guess an aspect ratio.

Low-resolution screenshots (narrower than MIN_WIDTH) are enlarged with the
FSRCNN super-resolution model when OpenCV is available (pip install
opencv-contrib-python-headless; model in scripts/models/FSRCNN_x4.pb), and with
Lanczos resampling otherwise. FSRCNN is used deliberately instead of heavier GAN
or EDSR models: those invent letter shapes, which is unacceptable for regulated
medical and financial copy. Nothing in the source is redrawn or altered.

Requires Pillow (pip install Pillow).
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-source"
OUT = ROOT / "public" / "projects"
TS_OUT = ROOT / "src" / "data" / "assets.generated.ts"
MODEL = Path(__file__).resolve().parent / "models" / "FSRCNN_x4.pb"

MIN_WIDTH = 900          # screenshots narrower than this are enlarged
TARGET_WIDTH = 1200      # ...to this width (a 600px email at 2x)
PHOTO_QUALITY = 86

# Rendered builds are captured with generous whitespace; trim it.
TRIM = {"rialto/01-desktop-build", "rialto/02-mobile-build"}

# Photography (lossy) rather than screenshots (lossless).
PHOTOS = {"rialto/hero-photo": 2000}

# Close-up crops: (left, top, right, bottom) in SOURCE pixels. When a source is
# enlarged, the box is scaled with it.
DETAILS: dict[str, list[tuple[str, tuple[int, int, int, int]]]] = {
    "car-t-talk/03-call-reminder-merge-fields": [("merge-fields", (0, 290, 1214, 1000))],
    "car-t-talk/01-registration-scheduling": [("scheduling-module", (0, 380, 974, 1130))],
    "three-insurance/07-policy-renewal": [("ampscript-renewal", (40, 160, 962, 1330))],
    "three-insurance/06-payment-receipt": [("ampscript-receipt", (0, 180, 1204, 900))],
    "apokyn/01-maximizing-on-time": [
        ("on-time-stats", (0, 150, 312, 560)),
        ("safety-information", (0, 555, 312, 1040)),
    ],
    "apokyn/03-consider-apokyn": [("consider-modules", (0, 130, 308, 620))],
    "rialto/01-desktop-build": [
        ("desktop-hero", (0, 0, 1296, 985)),
        ("proof-panel", (0, 1550, 1296, 2090)),
    ],
    "rialto/02-mobile-build": [("mobile-hero", (0, 0, 1056, 1560))],
    "patient-programs/02-ofev-mentor-confirmation": [("ofev-call-instructions", (0, 360, 1300, 1260))],
    "patient-programs/15-alunbrig-registration": [("alunbrig-merge-fields", (0, 80, 606, 330))],
    "patient-programs/16-dupixent-prescribing-information": [("dupixent-merge-fields", (0, 0, 1312, 650))],
}

# Composite close-ups built from several sources: (slug, name, sources, crop box in source px).
COMPOSITES = [
    (
        "patient-programs",
        "lems-ambassador-variants",
        [f"{n:02d}-lems-event-ambassador-{c}" for n, c in zip(range(8, 15), "abcdefg")],
        (0, 0, 410, 640),
    )
]

_sr = None


def super_resolve(im: Image.Image) -> tuple[Image.Image, str]:
    """Enlarge to TARGET_WIDTH with FSRCNN x4 (then Lanczos down), or Lanczos alone."""
    global _sr
    target_h = round(im.height * TARGET_WIDTH / im.width)
    try:
        import cv2  # type: ignore
        import numpy as np  # type: ignore

        if _sr is None:
            if not MODEL.exists():
                raise FileNotFoundError(MODEL)
            _sr = cv2.dnn_superres.DnnSuperResImpl_create()
            _sr.readModel(str(MODEL))
            _sr.setModel("fsrcnn", 4)
        arr = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
        h = arr.shape[0]
        tile, pad = 256, 8
        rows = []
        for y in range(0, h, tile):
            y0, y1 = max(0, y - pad), min(h, y + tile + pad)
            up = _sr.upsample(arr[y0:y1])
            a = (y - y0) * 4
            rows.append(up[a : a + (min(h, y + tile) - y) * 4])
        big = Image.fromarray(cv2.cvtColor(np.vstack(rows), cv2.COLOR_BGR2RGB))
        out = big.resize((TARGET_WIDTH, target_h), Image.LANCZOS)
        method = "fsrcnn"
    except Exception:
        out = im.resize((TARGET_WIDTH, target_h), Image.LANCZOS)
        method = "lanczos"
    # Gentle sharpening to restore edge contrast lost in resampling.
    out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    return out, method


def trim_whitespace(im: Image.Image, pad: int = 48) -> Image.Image:
    bg = Image.new("RGB", im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert("L").point(lambda p: 255 if p > 8 else 0)
    box = diff.getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


def save(im: Image.Image, path: Path, photo: bool = False, enlarged: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if photo:
        im.save(path, "WEBP", quality=PHOTO_QUALITY, method=6)
    elif enlarged:
        # Enlarged images hold no extra detail to preserve; high-quality lossy keeps files small.
        im.save(path, "WEBP", quality=92, method=4)
    else:
        im.save(path, "WEBP", lossless=True, quality=100, method=6)


def main() -> None:
    manifest: dict[str, dict[str, int]] = {}
    processed: dict[str, tuple[Image.Image, float]] = {}

    for folder in sorted(p for p in SRC.iterdir() if p.is_dir()):
        slug = folder.name
        for src in sorted(folder.glob("*.png")):
            key = f"{slug}/{src.stem}"
            im = Image.open(src).convert("RGB")
            note = ""
            scale = 1.0
            if key in TRIM:
                im = trim_whitespace(im)
            if key in PHOTOS:
                w = PHOTOS[key]
                if im.width > w:
                    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            elif im.width < MIN_WIDTH:
                scale = TARGET_WIDTH / im.width
                im, method = super_resolve(im)
                note = f" (enlarged x{scale:.2f} via {method})"
            save(im, OUT / slug / f"{src.stem}.webp", photo=key in PHOTOS, enlarged=scale != 1.0)
            manifest[f"/projects/{slug}/{src.stem}.webp"] = {"width": im.width, "height": im.height}
            processed[key] = (im, scale)

            for name, box in DETAILS.get(key, []):
                b = tuple(round(v * scale) for v in box)
                crop = im.crop(b)
                save(crop, OUT / slug / "details" / f"{name}.webp", enlarged=scale != 1.0)
                manifest[f"/projects/{slug}/details/{name}.webp"] = {"width": crop.width, "height": crop.height}
            print(f"  {key}: {im.width}x{im.height}{note}")

    for slug, name, keys, box in COMPOSITES:
        crops = []
        for k in keys:
            im, scale = processed[f"{slug}/{k}"]
            c = im.crop(tuple(round(v * scale) for v in box))
            crops.append(c.resize((600, round(c.height * 600 / c.width)), Image.LANCZOS))
        gap = 24
        h = max(c.height for c in crops)
        sheet = Image.new("RGB", (sum(c.width for c in crops) + gap * (len(crops) + 1), h + gap * 2), (233, 238, 242))
        x = gap
        for c in crops:
            sheet.paste(c, (x, gap))
            x += c.width + gap
        save(sheet, OUT / slug / "details" / f"{name}.webp", enlarged=True)
        manifest[f"/projects/{slug}/details/{name}.webp"] = {"width": sheet.width, "height": sheet.height}
        print(f"  composite {slug}/{name}: {sheet.width}x{sheet.height}")

    TS_OUT.parent.mkdir(parents=True, exist_ok=True)
    TS_OUT.write_text(
        "// Generated by scripts/process_assets.py. Do not edit by hand.\n"
        "export const imageSizes: Record<string, { width: number; height: number }> = "
        + json.dumps(manifest, indent=2)
        + ";\n"
    )
    print(f"Wrote {len(manifest)} images and {TS_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
