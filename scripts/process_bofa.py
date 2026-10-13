#!/usr/bin/env python3
"""
Turn the Bank of America renders (from bofa-render/render.sh) into site assets.

  python3 scripts/process_bofa.py <renders-dir> <catalog.json>

<renders-dir> contains desktop/*.png and mobile/*.png named like
  2024__04-2024__EMAIL-04-24-0114__EMAIL-04-24-0114_A.png
<catalog.json> is the archive catalog (scripts/bofa_catalog.json).

Writes:
  public/projects/bank-of-america/featured/<slug>.webp                  desktop, q92
  public/projects/bank-of-america/featured/<slug>-mobile.webp           mobile, q92
  public/projects/bank-of-america/archive/<code>.webp                   desktop, q80
  public/projects/bank-of-america/archive/thumbs/<code>.webp            480px wide, top crop
  src/data/bofa.generated.ts
"""
from __future__ import annotations

import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "projects" / "bank-of-america"
TS = ROOT / "src" / "data" / "bofa.generated.ts"

# Hand-picked builds for the featured gallery, in display order: (code, file stem, title, note)
FEATURED = json.loads((Path(__file__).parent / "bofa_featured.json").read_text())

MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()


def trim(im: Image.Image, pad: int = 0) -> Image.Image:
    bg = Image.new("RGB", im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert("L").point(lambda p: 255 if p > 6 else 0)
    box = diff.getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


def email_box(im: Image.Image) -> Image.Image:
    """Crop to the email column: full-height trim, then horizontal bounds of the content."""
    return trim(im, pad=0)


def key_for(file: str) -> str:
    return file[:-5].replace("/", "__")


def month_label(code: str) -> str:
    m = re.search(r"(\d\d)-(\d\d)-\d{4}", code)
    if not m:
        return ""
    mm, yy = int(m.group(1)), int(m.group(2))
    return f"{MONTHS[mm - 1]} 20{yy:02d}" if 1 <= mm <= 12 else ""


def is_primary(stem: str) -> int:
    """Lower is better: plain build, then _A/.A, then anything else."""
    s = stem.split("_")[-1] if "_" in stem else stem
    if re.fullmatch(r"EMAIL-\d\d-\d\d-\d{4}", stem):
        return 0
    if re.search(r"[_.]A(\.1)?$", stem):
        return 1
    return 2


def save(im: Image.Image, path: Path, lossless: bool, q: int = 88) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if lossless:
        im.save(path, "WEBP", lossless=True, quality=60, method=3)
    else:
        im.save(path, "WEBP", quality=q, method=4)


def main() -> None:
    renders = Path(sys.argv[1])
    rows = json.loads(Path(sys.argv[2]).read_text())
    camp: "OrderedDict[str, list[dict]]" = OrderedDict()
    for r in rows:
        camp.setdefault(r["code"], []).append(r)

    featured_only = "--featured-only" in sys.argv
    archive = []
    if featured_only:
        prev = TS.read_text()
        start = prev.index("export const bofaArchive = ") + len("export const bofaArchive = ")
        archive = json.loads(prev[start:].rstrip().rstrip(";"))
    for code, builds in ([] if featured_only else camp.items()):
        builds.sort(key=lambda r: (is_primary(Path(r["file"]).stem), r["file"]))
        primary = builds[0]
        if all(b.get("placeholder") for b in builds):
            continue
        src = renders / "desktop" / f"{key_for(primary['file'])}.png"
        if not src.exists():
            print("  missing render", src.name)
            continue
        im = email_box(Image.open(src).convert("RGB"))
        if im.height < 300:
            print("  blank render", src.name)
            continue
        full = OUT / "archive" / f"{code}.webp"
        save(im, full, lossless=False, q=80)
        th = im.resize((480, round(im.height * 480 / im.width)), Image.LANCZOS)
        th = th.crop((0, 0, 480, min(th.height, 640)))
        save(th, OUT / "archive" / "thumbs" / f"{code}.webp", lossless=False, q=82)
        archive.append(
            {
                "code": code,
                "title": re.sub(r"\s+", " ", primary["h1"] or primary["preheader"])[:110],
                "lob": primary["lob"],
                "month": month_label(code),
                "builds": len(builds),
                "spanish": any(b["lang"] == "es" for b in builds),
                "src": f"/projects/bank-of-america/archive/{code}.webp",
                "thumb": f"/projects/bank-of-america/archive/thumbs/{code}.webp",
                "width": im.width,
                "height": im.height,
            }
        )
    print(f"archive: {len(archive)} campaigns")

    featured = []
    by_file = {key_for(r["file"]): r for r in rows}
    for f in FEATURED:
        k = f["key"]
        src = renders / "desktop" / f"{k}.png"
        if not src.exists():
            print("  featured missing", k)
            continue
        im = email_box(Image.open(src).convert("RGB"))
        if f.get("cropTop"):
            # Drop an unrendered Content Builder reference (e.g. the shared logo block) above the email.
            im = im.crop((0, f["cropTop"], im.width, im.height))
        slug = f["slug"]
        save(im, OUT / "featured" / f"{slug}.webp", lossless=False, q=92)
        item = {k: v for k, v in f.items() if not k.startswith("cropTop")}
        item = {**item, "src": f"/projects/bank-of-america/featured/{slug}.webp", "width": im.width, "height": im.height}
        msrc = renders / "mobile" / f"{k}.png"
        if f.get("mobile") and msrc.exists():
            m = email_box(Image.open(msrc).convert("RGB"))
            if f.get("cropTopMobile"):
                m = m.crop((0, f["cropTopMobile"], m.width, m.height))
            save(m, OUT / "featured" / f"{slug}-mobile.webp", lossless=False, q=92)
            item["mobile"] = {"src": f"/projects/bank-of-america/featured/{slug}-mobile.webp", "width": m.width, "height": m.height}
        else:
            item.pop("mobile", None)
        meta = by_file.get(k, {})
        item["code"] = meta.get("code", "")
        featured.append(item)
    print(f"featured: {len(featured)}")

    builds = len(rows)
    stats = {
        "campaigns": len(camp),
        "builds": builds,
        "linesOfBusiness": len({r["lob"] for r in rows}),
        "spanishBuilds": sum(1 for r in rows if r["lang"] == "es"),
        "vmlBuilds": sum(1 for r in rows if r["vml"]),
        "ampscriptBuilds": sum(1 for r in rows if r["ampscript"]),
        "footnoteBuilds": sum(1 for r in rows if r["footnotes"]),
        "animatedBuilds": sum(1 for r in rows if r["gif"]),
        "mobileSwapBuilds": sum(1 for r in rows if r["mobile_swap"]),
        "maxVariants": max(len(v) for v in camp.values()),
    }
    TS.write_text(
        "// Generated by scripts/process_bofa.py. Do not edit by hand.\n"
        + "export const bofaStats = "
        + json.dumps(stats, indent=2)
        + " as const;\n\nexport const bofaFeatured = "
        + json.dumps(featured, indent=2)
        + ";\n\nexport const bofaArchive = "
        + json.dumps(archive, indent=2)
        + ";\n"
    )
    print("stats", stats)


if __name__ == "__main__":
    main()
