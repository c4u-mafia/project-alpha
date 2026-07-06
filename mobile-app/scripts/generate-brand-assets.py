"""Generate Homelyn app icons/splash from the brand mark in components/splash-logo.tsx.

Mark geometry (SVG viewBox "-8 -2 96 88"):
  - house body: rect(0, 38, w=80, h=48, rx=4)
  - roof:       triangle (-8,42) (40,-2) (88,42)
  - chevron:    polyline (26,22)-(40,8)-(54,22), stroke 5, round caps/joins
  - doorknob:   circle (40,62) r=5
"""

from PIL import Image, ImageDraw, ImageFont, ImageChops

ASSETS = "/home/sunny/zero/homelyn/mobile-app/assets"
FONT = "/home/sunny/zero/homelyn/mobile-app/node_modules/@expo-google-fonts/geist/700Bold/Geist_700Bold.ttf"

TEAL = "#0E7C7B"
CREAM = "#FAF7F2"
ORANGE = "#F2A65A"
CHARCOAL = "#1A2332"

SS = 4  # supersampling factor

# unit-space bounds of the mark
UX, UY, UW, UH = -8.0, -2.0, 96.0, 88.0


def draw_mark(draw, cx, cy, width, house, chevron, knob):
    """Draw the mark centered at (cx, cy) with the given pixel width (all in SS space)."""
    s = width / UW

    def pt(x, y):
        return ((x - UX) * s + cx - width / 2, (y - UY) * s + cy - (UH * s) / 2)

    # house body (rounded rect)
    x0, y0 = pt(0, 38)
    x1, y1 = pt(80, 86)
    draw.rounded_rectangle([x0, y0, x1, y1], radius=4 * s, fill=house)
    # roof
    draw.polygon([pt(-8, 42), pt(40, -2), pt(88, 42)], fill=house)
    if chevron is not None:
        w = 5 * s
        a, b, c = pt(26, 22), pt(40, 8), pt(54, 22)
        draw.line([a, b], fill=chevron, width=round(w))
        draw.line([b, c], fill=chevron, width=round(w))
        for px, py in (a, b, c):
            draw.ellipse([px - w / 2, py - w / 2, px + w / 2, py + w / 2], fill=chevron)
    if knob is not None:
        kx, ky = pt(40, 62)
        r = 5 * s
        draw.ellipse([kx - r, ky - r, kx + r, ky + r], fill=knob)


def render(size, bg, mark_width, house=CREAM, chevron=TEAL, knob=ORANGE, dy=0):
    img = Image.new("RGBA", (size * SS, size * SS), bg if bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    draw_mark(d, size * SS / 2, size * SS / 2 + dy * SS, mark_width * SS, house, chevron, knob)
    return img.resize((size, size), Image.LANCZOS)


def save(img, name):
    img.save(f"{ASSETS}/{name}", "PNG")
    print(f"  {name}  {img.size[0]}x{img.size[1]}")


# ── App icons (opaque, 1024) — chevron matches the background color ─────────
save(render(1024, TEAL, 560).convert("RGB"), "icon.png")
save(render(1024, CHARCOAL, 560, chevron=CHARCOAL).convert("RGB"), "icon-dev.png")
save(render(1024, ORANGE, 560, chevron=ORANGE, knob=TEAL).convert("RGB"), "icon-preview.png")

# ── Android adaptive foregrounds (transparent, mark inside the 66% safe zone) ─
save(render(1024, None, 440), "adaptive-icon.png")
save(render(1024, None, 440, chevron=CHARCOAL), "adaptive-icon-dev.png")
save(render(1024, None, 440, chevron=ORANGE, knob=TEAL), "adaptive-icon-preview.png")

# ── Monochrome adaptive icon (white silhouette, chevron + knob punched out) ──
solid = render(1024, None, 440, house="#FFFFFF", chevron=None, knob=None)
punch = render(1024, None, 440, house=(0, 0, 0, 0), chevron="#FFFFFF", knob="#FFFFFF")
alpha = ImageChops.subtract(solid.getchannel("A"), punch.getchannel("A"))
mono = Image.new("RGBA", solid.size, "#FFFFFF")
mono.putalpha(alpha)
save(mono, "adaptive-icon-mono.png")

# ── Splash logo: mark + "homelyn" wordmark, transparent (bg from config) ─────
W = H = 1200
img = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
mark_w = 520
draw_mark(d, W * SS / 2, H * SS / 2 - 210 * SS, mark_w * SS, CREAM, TEAL, ORANGE)

text = "homelyn"
fsize = 170 * SS
font = ImageFont.truetype(FONT, fsize)
tracking = -0.03 * fsize  # letterSpacing -0.8 @ ~28px ≈ -0.03em
widths = [d.textlength(ch, font=font) for ch in text]
total = sum(widths) + tracking * (len(text) - 1)
x = (W * SS - total) / 2
baseline_y = H * SS / 2 + 195 * SS
for ch, w in zip(text, widths):
    d.text((x, baseline_y), ch, font=font, fill=CREAM, anchor="ls")
    x += w + tracking
img = img.resize((W, H), Image.LANCZOS)
# crop tight to content (+ even padding) so the logo centers exactly on the splash
left, top, right, bottom = img.getbbox()
pad = 24
img = img.crop((left - pad, top - pad, right + pad, bottom + pad))
save(img, "splash-icon.png")

# ── Favicon (rounded teal tile) ──────────────────────────────────────────────
fav = Image.new("RGBA", (196 * SS, 196 * SS), (0, 0, 0, 0))
d = ImageDraw.Draw(fav)
d.rounded_rectangle([0, 0, 196 * SS, 196 * SS], radius=44 * SS, fill=TEAL)
draw_mark(d, 196 * SS / 2, 196 * SS / 2, 110 * SS, CREAM, TEAL, ORANGE)
save(fav.resize((196, 196), Image.LANCZOS), "favicon.png")

print("done")
