#!/usr/bin/env python3

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH, HEIGHT = 1600, 900
INK = "#202529"
BLUE = "#2E5E78"
DARK_BLUE = "#173B4F"
PALE_BLUE = "#E8F0F4"
PALE_GRAY = "#F2F4F5"
WHITE = "#FFFFFF"


def font(size, bold=False):
    name = "Arial Bold.ttf" if bold else "Arial.ttf"
    return ImageFont.truetype(f"/System/Library/Fonts/Supplemental/{name}", size)


def box(draw, bounds, title, subtitle, fill=WHITE):
    draw.rounded_rectangle(bounds, radius=12, fill=fill, outline=BLUE, width=4)
    x1, y1, x2, y2 = bounds
    draw.text(((x1 + x2) / 2, y1 + 34), title, font=font(30, True), fill=DARK_BLUE, anchor="mm")
    draw.multiline_text(
        ((x1 + x2) / 2, y1 + 82), subtitle, font=font(22), fill=INK,
        anchor="ma", align="center", spacing=6,
    )


def arrow(draw, start, end, label=None):
    draw.line((start, end), fill=BLUE, width=5)
    x2, y2 = end
    x1, y1 = start
    length = max(((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5, 1)
    ux, uy = (x2 - x1) / length, (y2 - y1) / length
    px, py = -uy, ux
    tip = (x2, y2)
    left = (x2 - ux * 22 + px * 11, y2 - uy * 22 + py * 11)
    right = (x2 - ux * 22 - px * 11, y2 - uy * 22 - py * 11)
    draw.polygon((tip, left, right), fill=BLUE)
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        bbox = draw.textbbox((mx, my), label, font=font(19), anchor="mm")
        draw.rounded_rectangle((bbox[0] - 8, bbox[1] - 4, bbox[2] + 8, bbox[3] + 4), radius=5, fill=WHITE)
        draw.text((mx, my), label, font=font(19), fill=INK, anchor="mm")


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: build_system_context.py OUTPUT.png")
    output = Path(sys.argv[1])
    output.parent.mkdir(parents=True, exist_ok=True)

    image = Image.new("RGB", (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(image)
    draw.text((80, 55), "KubeView system context", font=font(42, True), fill=DARK_BLUE)
    draw.text((80, 115), "The backend is the Kubernetes credential and data-access boundary.", font=font(24), fill=INK)

    boxes = {
        "user": (70, 260, 330, 440),
        "browser": (420, 260, 710, 440),
        "frontend": (800, 190, 1110, 360),
        "backend": (800, 500, 1110, 670),
        "api": (1250, 500, 1530, 670),
        "config": (420, 610, 710, 780),
        "history": (1250, 730, 1530, 860),
    }
    draw.rounded_rectangle((760, 455, 1150, 710), radius=18, fill="#F8FBFC", outline=DARK_BLUE, width=3)
    draw.text((955, 475), "Credential boundary", font=font(20, True), fill=DARK_BLUE, anchor="mm")
    box(draw, boxes["user"], "User", "Developer or\ncluster operator", PALE_GRAY)
    box(draw, boxes["browser"], "Web browser", "Resource views, logs,\nand history", PALE_BLUE)
    box(draw, boxes["frontend"], "Frontend", "Next.js and React")
    box(draw, boxes["backend"], "Backend", "Go net/http", PALE_BLUE)
    box(draw, boxes["api"], "Kubernetes API", "Selected cluster")
    box(draw, boxes["config"], "Configuration", "Kubeconfig or\nin-cluster identity", PALE_GRAY)
    box(draw, boxes["history"], "History store", "Local bbolt file", PALE_GRAY)

    arrow(draw, (330, 350), (420, 350), "uses")
    arrow(draw, (710, 315), (800, 275), "loads UI")
    arrow(draw, (710, 390), (800, 555), "REST / SSE / logs")
    arrow(draw, (1110, 585), (1250, 585), "get / list / watch")
    arrow(draw, (710, 695), (800, 625), "allowed context")
    arrow(draw, (1110, 640), (1250, 780), "version records")

    image.save(output, optimize=True)
    print(f"Wrote {output}")


if __name__ == "__main__":
    main()
