from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


OUT = Path("output/sfah/SFAH_revised_agreement_summary_2026-10-07.png")
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1800, 2260
M = 110
NAVY = "#123C66"
BLUE = "#1E5B8F"
PALE_BLUE = "#EAF3FA"
TEAL = "#0B7A75"
PALE_TEAL = "#E8F6F4"
TEXT = "#162536"
MUTED = "#5A6A78"
GRID = "#CAD6E0"
WHITE = "#FFFFFF"
AMBER = "#A85A00"
PALE_AMBER = "#FFF4DF"

REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REGULAR, size)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def wrap(draw, text, fnt, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = word if not current else current + " " + word
        if draw.textbbox((0, 0), trial, font=fnt)[2] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(draw, xy, text, fnt, fill, max_width, line_gap=10):
    x, y = xy
    lines = wrap(draw, text, fnt, max_width)
    line_h = fnt.size + line_gap
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_h
    return y


img = Image.new("RGB", (W, H), "#F5F8FB")
d = ImageDraw.Draw(img)

# Header
d.rectangle((0, 0, W, 260), fill=NAVY)
d.text((M, 62), "SFAH REVISED VENUE AGREEMENT", font=font(55, True), fill=WHITE)
d.text((M, 137), "ISMPC2027  |  1–4 August 2027", font=font(31), fill="#D9E8F5")
d.text((M, 190), "Reply received 7 October 2026  •  Ref. SFAH/202609/027/N", font=font(25), fill="#BFD5E7")

y = 320

# Summary block
rounded(d, (M, y, W - M, y + 650), 24, WHITE, GRID, 2)
d.text((M + 42, y + 34), "What SFAH confirmed", font=font(36, True), fill=NAVY)

summary = [
    "The revised agreement reflects the requested hours: Auditorium 8:00 am–6:00 pm on all four days; Lavender 8:00 am–10:00 pm on 1–3 August and 8:00 am–6:00 pm on 4 August.",
    "Sunday AV technician and cleaner overtime has been recalculated to 10 hours. Lavender's 6:00–10:00 pm use appears not to require those staff, but this should be confirmed explicitly.",
    "Base AV and registration furniture are complimentary. Requirements beyond the listed complimentary items will be chargeable.",
    "Booking hours may be changed by email without an adjustment fee; cancellation fees apply if a room booking is cancelled.",
    "For NUS departments, payment will be collected after the event.",
]

bullet_font = font(26)
sy = y + 100
for item in summary:
    d.ellipse((M + 44, sy + 9, M + 58, sy + 23), fill=TEAL)
    end_y = draw_wrapped(d, (M + 78, sy), item, bullet_font, TEXT, W - 2 * M - 125, 9)
    sy = end_y + 20

# Key number cards
card_y = y + 650 + 34
gap = 28
card_w = (W - 2 * M - gap) // 2
rounded(d, (M, card_y, M + card_w, card_y + 205), 24, PALE_TEAL, "#B9DDD9", 2)
d.text((M + 38, card_y + 30), "REVISED TOTAL", font=font(24, True), fill=TEAL)
d.text((M + 38, card_y + 80), "S$17,804", font=font(58, True), fill=NAVY)
d.text((M + 38, card_y + 154), "Agreement total shown; GST needs confirmation", font=font(21), fill=MUTED)

x2 = M + card_w + gap
rounded(d, (x2, card_y, W - M, card_y + 205), 24, PALE_BLUE, "#BED4E5", 2)
d.text((x2 + 38, card_y + 30), "SAVING VS PREVIOUS VERSION", font=font(24, True), fill=BLUE)
d.text((x2 + 38, card_y + 80), "S$4,096  (18.7%)", font=font(49, True), fill=NAVY)
d.text((x2 + 38, card_y + 154), "Previous total: S$21,900", font=font(21), fill=MUTED)

# Comparison table
table_y = card_y + 260
d.text((M, table_y), "Comparison with 18 September version", font=font(36, True), fill=NAVY)
table_y += 60

cols = [M, M + 620, M + 940, M + 1260, W - M]
headers = ["Item", "Previous", "Revised", "Change"]
rows = [
    ["Auditorium, 1–3 Aug", "8:00 am–10:00 pm", "8:00 am–6:00 pm", "–4 hrs/day"],
    ["Venue subtotal", "S$30,200", "S$24,440", "–S$5,760"],
    ["Venue after 40% NUS discount", "S$18,120", "S$14,664", "–S$3,456"],
    ["Sunday AV technician", "14 hrs / S$840", "10 hrs / S$600", "–S$240"],
    ["Sunday cleaners (min. 2)", "28 hrs / S$1,400", "20 hrs / S$1,000", "–S$400"],
    ["Additional equipment/services", "S$3,780", "S$3,140", "–S$640"],
    ["TOTAL AMOUNT DUE", "S$21,900", "S$17,804", "–S$4,096"],
]
header_h, row_h = 72, 76
d.rectangle((cols[0], table_y, cols[-1], table_y + header_h), fill=NAVY)
for i, h in enumerate(headers):
    d.text((cols[i] + 18, table_y + 20), h, font=font(24, True), fill=WHITE)

ty = table_y + header_h
for r_idx, row in enumerate(rows):
    fill = PALE_BLUE if r_idx % 2 else WHITE
    if r_idx == len(rows) - 1:
        fill = PALE_TEAL
    d.rectangle((cols[0], ty, cols[-1], ty + row_h), fill=fill, outline=GRID, width=1)
    for c in cols[1:-1]:
        d.line((c, ty, c, ty + row_h), fill=GRID, width=1)
    for i, value in enumerate(row):
        is_total = r_idx == len(rows) - 1
        color = TEAL if (i == 3 and value.startswith("–")) else TEXT
        d.text((cols[i] + 18, ty + 22), value, font=font(23, is_total), fill=color)
    ty += row_h

# Checks before signing
note_y = ty + 42
rounded(d, (M, note_y, W - M, H - 90), 22, PALE_AMBER, "#E7C78A", 2)
d.text((M + 38, note_y + 28), "Points to confirm before signing", font=font(31, True), fill=AMBER)
checks = [
    "Confirm that no AV technician or cleaner is required for Lavender from 6:00–10:00 pm on Sunday.",
    "Review/remove provisional charges: 16 extra microphones (S$800), 16 single sofas (S$240), and Lavender customised setup (S$100).",
    "Correct the agreement date typo: “7 Ocotober 2026” → “7 October 2026”; confirm whether GST is additional.",
]
ny = note_y + 84
for item in checks:
    d.ellipse((M + 45, ny + 8, M + 59, ny + 22), fill=AMBER)
    ny = draw_wrapped(d, (M + 83, ny), item, font(23), TEXT, W - 2 * M - 120, 8) + 11

img.save(OUT, optimize=True)
print(OUT.resolve())
