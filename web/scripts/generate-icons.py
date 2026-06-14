#!/usr/bin/env python3
"""Generate Nudge's icon set from a single square master PNG.

Produces favicons, PWA icons, a maskable icon and an Apple touch icon under
``web/public/``. Re-run whenever the master art changes:

    python scripts/generate-icons.py [path/to/master.png]

Requires Pillow (``pip install Pillow``).
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
WEB = HERE.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "icon-master.png"
OUT = WEB / "public"

# Espresso background (#1A1714) used to flatten/pad opaque variants.
BG = (26, 23, 20, 255)


def load_square() -> Image.Image:
    img = Image.open(SRC).convert("RGBA")
    if img.width != img.height:
        side = max(img.width, img.height)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2), img)
        img = canvas
    return img


def resized(img: Image.Image, size: int) -> Image.Image:
    return img.resize((size, size), Image.LANCZOS)


def save_png(img: Image.Image, name: str) -> Path:
    path = OUT / name
    img.save(path, "PNG", optimize=True)
    return path


def flatten(img: Image.Image, size: int) -> Image.Image:
    """Opaque, full-bleed variant (for Apple touch icon)."""
    bg = Image.new("RGBA", img.size, BG)
    bg.alpha_composite(img)
    return resized(bg, size).convert("RGB")


def maskable(img: Image.Image, size: int, inner: float = 0.8) -> Image.Image:
    """Art scaled into the central safe zone on a solid background."""
    canvas = Image.new("RGBA", (size, size), BG)
    inner_size = int(size * inner)
    offset = (size - inner_size) // 2
    canvas.alpha_composite(resized(img, inner_size), (offset, offset))
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    img = load_square()
    print(f"source: {SRC.name} {Image.open(SRC).size}")

    written: list[Path] = []

    for size in (16, 32, 48):
        written.append(save_png(resized(img, size), f"favicon-{size}x{size}.png"))

    for size in (192, 512):
        written.append(save_png(resized(img, size), f"pwa-{size}x{size}.png"))

    written.append(save_png(maskable(img, 512), "maskable-512x512.png"))
    written.append(save_png(flatten(img, 180), "apple-touch-icon.png"))

    ico = OUT / "favicon.ico"
    img.save(ico, sizes=[(16, 16), (32, 32), (48, 48)])
    written.append(ico)

    print("written:")
    for path in written:
        print(f"  {path.name:<26} {path.stat().st_size / 1024:6.1f} KB")


if __name__ == "__main__":
    main()
