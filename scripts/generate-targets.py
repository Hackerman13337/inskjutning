#!/usr/bin/env python3
"""
Genererar måltavlorna i public/maltavlor/ som PDF med exakta mått.

Kör:  python3 scripts/generate-targets.py

Måtten är själva poängen: ett rutnät som inte är exakt en centimeter gör tavlan
oanvändbar, eftersom man mäter träffen i rutor och matar in centimeter i
verktyget. Därför skrivs PDF:en direkt (se scripts/pdfkit.py) i stället för att
gå via HTML eller bild, och varje tavla har ett kontrollmått i nederkanten som
avslöjar en utskrift som skalats om.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from pdfkit import A4, Page, write_pdf  # noqa: E402

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       "public", "maltavlor")

# Gråskala genomgående — svart bläck skriver ut likadant på varje skrivare,
# och färg kostar bara pengar på en tavla som ska bli sönderskjuten.
INK = 0.0
GRID_MINOR = 0.70
GRID_MAJOR = 0.42
AXIS = 0.15
LABEL = 0.40
FAINT = 0.62

W_MINOR = 0.15
W_MAJOR = 0.28
W_AXIS = 0.40


# --------------------------------------------------------------------------- #
#  Gemensamma delar                                                           #
# --------------------------------------------------------------------------- #

def header(page: Page, name: str, hint: str) -> None:
    page.text(15, 283, "INSKJUTNING.SE", 9.5, bold=True, gray=0.25, tracking=0.35)
    page.text(195, 283, name, 9.5, bold=True, gray=0.25, align="right")
    page.text(195, 277.5, hint, 7.5, gray=0.45, align="right")

    page.set_line_width(0.25)
    page.set_stroke_gray(0.75)
    page.line(15, 273.5, 195, 273.5)


def write_in_fields(page: Page, y: float) -> None:
    """Rader att fylla i med penna vid bänken."""
    fields = [("Vapen", 52), ("Ammunition", 52), ("Avstånd (m)", 30), ("Datum", 30)]
    x = 15
    for label, width in fields:
        page.text(x, y + 1.5, label, 6.5, gray=0.5)
        page.set_line_width(0.25)
        page.set_stroke_gray(0.72)
        page.line(x, y - 1, x + width - 6, y - 1)
        x += width


def scale_check(page: Page, y: float) -> None:
    """
    Kontrollmått: en 10 cm lång skala med millimeterstreck. Mäter den inte
    exakt 10 cm på papperet är utskriften omskalad och tavlan oanvändbar.
    """
    x0 = 15
    length = 100

    page.set_line_cap_butt()
    page.set_stroke_gray(INK)

    page.set_line_width(0.3)
    page.line(x0, y, x0 + length, y)

    for mm in range(length + 1):
        if mm % 10 == 0:
            height, width = 4.0, 0.35
        elif mm % 5 == 0:
            height, width = 2.6, 0.25
        else:
            height, width = 1.5, 0.18
        page.set_line_width(width)
        page.line(x0 + mm, y, x0 + mm, y + height)

    for cm in range(0, 11, 2):
        page.text(x0 + cm * 10, y + 5, str(cm), 6.5, gray=0.35, align="center")

    page.text(x0 + length + 5, y + 1,
              "Kontrollmått — ska mäta exakt 10 cm. Gör den inte det är utskriften",
              7, gray=0.45)
    page.text(x0 + length + 5, y - 3,
              "omskalad: skriv ut igen i skala 100 %, inte \"anpassa till sidan\".",
              7, gray=0.45)


def grid(page: Page, cx: float, cy: float, half_w: float, half_h: float,
         step: float, major_every: int) -> None:
    """Rutnät centrerat i (cx, cy). Alla mått i millimeter."""
    left, right = cx - half_w, cx + half_w
    bottom, top = cy - half_h, cy + half_h

    page.set_line_cap_butt()

    steps_x = int(half_w / step)
    steps_y = int(half_h / step)

    # Lodräta linjer
    for i in range(-steps_x, steps_x + 1):
        if i == 0:
            continue
        x = cx + i * step
        is_major = i % major_every == 0
        page.set_line_width(W_MAJOR if is_major else W_MINOR)
        page.set_stroke_gray(GRID_MAJOR if is_major else GRID_MINOR)
        page.line(x, bottom, x, top)

    # Vågräta linjer
    for i in range(-steps_y, steps_y + 1):
        if i == 0:
            continue
        y = cy + i * step
        is_major = i % major_every == 0
        page.set_line_width(W_MAJOR if is_major else W_MINOR)
        page.set_stroke_gray(GRID_MAJOR if is_major else GRID_MINOR)
        page.line(left, y, right, y)

    # Ram
    page.set_line_width(W_MAJOR)
    page.set_stroke_gray(GRID_MAJOR)
    page.rect(left, bottom, half_w * 2, half_h * 2, fill=False, stroke=True)

    # Mittaxlar sist så att de ligger över rutnätet
    page.set_line_width(W_AXIS)
    page.set_stroke_gray(AXIS)
    page.line(left, cy, right, cy)
    page.line(cx, bottom, cx, top)


def grid_labels(page: Page, cx: float, cy: float, half_w: float, half_h: float,
                step: float, label_every: int, size: float = 6.8,
                bull_radius: float = 0.0) -> None:
    """
    Siffror längs axlarna, räknade i centimeter från mitten.

    Den yttersta linjen får ingen siffra — den skulle hamna ovanpå ramen. Ligger
    siffran inne i en svart siktpunkt skrivs den i vitt i stället, så att den
    som träffat i svarta ändå kan läsa av hur långt ut träffen sitter.
    """
    steps_x = int(half_w / step)
    steps_y = int(half_h / step)

    for i in range(-steps_x, steps_x + 1):
        if i == 0 or i % label_every != 0 or abs(i) == steps_x:
            continue
        distance = abs(i) * step
        inside_bull = distance < bull_radius - 1
        page.text(cx + i * step, cy + 1.6, f"{distance / 10:g}", size,
                  gray=1.0 if inside_bull else LABEL, align="center")

    for i in range(-steps_y, steps_y + 1):
        if i == 0 or i % label_every != 0 or abs(i) == steps_y:
            continue
        distance = abs(i) * step
        inside_bull = distance < bull_radius - 1
        page.text(cx - 1.8, cy + i * step - 1.1, f"{distance / 10:g}", size,
                  gray=1.0 if inside_bull else LABEL, align="right")


def aim_ring(page: Page, cx: float, cy: float, diameter: float,
             tick: float = 4.5, dot: float = 0.8) -> None:
    """
    Öppen siktpunkt: en ring med fyra streck inåt. Mitten lämnas fri så att
    hålen syns och går att mäta — det är hela poängen med en rutnätstavla.
    """
    r = diameter / 2

    page.set_line_cap_butt()
    page.set_stroke_gray(INK)
    page.set_line_width(0.7)
    page.circle(cx, cy, r)

    page.set_line_width(0.9)
    page.line(cx, cy + r, cx, cy + r - tick)
    page.line(cx, cy - r, cx, cy - r + tick)
    page.line(cx - r, cy, cx - r + tick, cy)
    page.line(cx + r, cy, cx + r - tick, cy)

    if dot:
        page.set_fill_gray(INK)
        page.circle(cx, cy, dot, fill=True, stroke=False)


def reference_circles(page: Page, cx: float, cy: float, radii, half_w, half_h) -> None:
    """Streckade cirklar som snabb referens för spridningen."""
    page.set_dash(1.6, 1.6)
    page.set_line_width(0.22)
    page.set_stroke_gray(FAINT)
    for r in radii:
        if r <= min(half_w, half_h):
            page.circle(cx, cy, r)
    page.clear_dash()


# --------------------------------------------------------------------------- #
#  Tavlorna                                                                   #
# --------------------------------------------------------------------------- #

def target_precision() -> Page:
    """1 cm rutnät, fin öppen siktpunkt. För kikarsikte på bänk."""
    page = Page(*A4)
    header(page, "Precision", "1 × 1 cm rutor · 18 × 22 cm")
    write_in_fields(page, 266)

    cx, cy, half_w, half_h = 105, 143, 90, 110
    grid(page, cx, cy, half_w, half_h, step=10, major_every=5)
    reference_circles(page, cx, cy, [50], half_w, half_h)
    grid_labels(page, cx, cy, half_w, half_h, step=10, label_every=2)
    aim_ring(page, cx, cy, diameter=24)

    scale_check(page, 16)
    return page


def target_hunting() -> Page:
    """2 cm rutnät och stor svart siktpunkt. För öppna sikten och dåligt ljus."""
    page = Page(*A4)
    header(page, "Jakt", "2 × 2 cm rutor · 16 × 20 cm · svart siktpunkt 6 cm")
    write_in_fields(page, 266)

    # 80 och 100 är multiplar av 20 — annars hamnar en halv ruta längs kanten.
    cx, cy, half_w, half_h = 105, 143, 80, 100
    grid(page, cx, cy, half_w, half_h, step=20, major_every=5)

    bull_r = 30

    # Fylld siktpunkt som syns genom öppna sikten i skymning.
    page.set_fill_gray(INK)
    page.circle(cx, cy, bull_r, fill=True, stroke=False)

    # Rutnätet fortsätter i vitt inne i siktpunkten. Utan det går det inte att
    # mäta en träff som sitter i svarta — den vanligaste träffen av alla.
    page.save()
    page.clip_circle(cx, cy, bull_r)
    page.set_stroke_gray(1.0)
    page.set_line_cap_butt()
    for i in range(-2, 3):
        if i == 0:
            continue
        page.set_line_width(W_MINOR + 0.05)
        page.line(cx + i * 20, cy - bull_r, cx + i * 20, cy + bull_r)
        page.line(cx - bull_r, cy + i * 20, cx + bull_r, cy + i * 20)
    page.set_line_width(0.35)
    page.line(cx - bull_r, cy, cx + bull_r, cy)
    page.line(cx, cy - bull_r, cx, cy + bull_r)
    page.restore()

    # Vit ring en bit in, som hjälp att centrera kornet i svarta.
    page.set_stroke_gray(1.0)
    page.set_line_width(0.5)
    page.circle(cx, cy, 12)

    # Siffrorna sist, så att de som hamnar i svarta kan skrivas i vitt.
    grid_labels(page, cx, cy, half_w, half_h, step=20, label_every=1,
                bull_radius=bull_r)

    scale_check(page, 16)
    return page


def _mini_target(page: Page, cx: float, cy: float, half_w: float, half_h: float,
                 step: float, number: int, aim_diameter: float,
                 label_every: int) -> None:
    """En av flera tavlor på samma blad."""
    grid(page, cx, cy, half_w, half_h, step=step, major_every=5)
    grid_labels(page, cx, cy, half_w, half_h, step=step,
                label_every=label_every, size=5.6)
    aim_ring(page, cx, cy, diameter=aim_diameter, tick=3.0, dot=0.6)

    # Numret ovanför ramen, inte inne i rutnätet — där skulle det täcka rutor
    # som man kan behöva mäta i.
    page.text(cx - half_w, cy + half_h + 2.5, str(number), 8, bold=True, gray=0.3)


def target_four_groups() -> Page:
    """Fyra tavlor på ett blad — en per grupp eller ammunitionssort."""
    page = Page(*A4)
    header(page, "Fyra grupper", "1 × 1 cm rutor · fyra tavlor om 8 × 10 cm")
    write_in_fields(page, 266)

    # 8 cm brett är vad två tavlor rymmer på A4 med tryckbara marginaler.
    # Höjden går det att ta ut mer av, så blocken är 10 cm höga.
    half_w, half_h = 40, 50  # 8 × 10 cm per tavla
    positions = [
        (55, 205), (155, 205),
        (55, 87), (155, 87),
    ]
    for index, (cx, cy) in enumerate(positions, start=1):
        _mini_target(page, cx, cy, half_w, half_h, step=10, number=index,
                     aim_diameter=18, label_every=1)

    scale_check(page, 16)
    return page


def target_six_small() -> Page:
    """Sex små tavlor för finkalibrigt på korta avstånd."""
    page = Page(*A4)
    header(page, "Sex små", "1 × 1 cm rutor · sex tavlor om 8 × 6 cm · för .22 och luftgevär")
    write_in_fields(page, 266)

    # Bredare än höga: en tavla behöver inte vara kvadratisk, och avlånga
    # block fyller A4 betydligt bättre än sex kvadrater.
    half_w, half_h = 40, 30  # 8 × 6 cm per tavla
    positions = [
        (55, 224), (155, 224),
        (55, 146), (155, 146),
        (55, 68), (155, 68),
    ]
    for index, (cx, cy) in enumerate(positions, start=1):
        _mini_target(page, cx, cy, half_w, half_h, step=10, number=index,
                     aim_diameter=12, label_every=1)

    scale_check(page, 16)
    return page


TARGETS = [
    ("maltavla-precision-a4.pdf", target_precision, "Precision",
     "1 cm rutnät med öppen siktpunkt"),
    ("maltavla-jakt-a4.pdf", target_hunting, "Jakt",
     "2 cm rutnät med stor svart siktpunkt"),
    ("maltavla-fyra-grupper-a4.pdf", target_four_groups, "Fyra grupper",
     "Fyra siktpunkter på ett blad"),
    ("maltavla-sex-sma-a4.pdf", target_six_small, "Sex små",
     "Sex siktpunkter för korta avstånd"),
]


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    for filename, builder, name, subject in TARGETS:
        path = os.path.join(OUT_DIR, filename)
        write_pdf(path, [builder()], f"Måltavla — {name} | Inskjutning.se", subject)
        print(f"skrev {os.path.relpath(path)}  ({os.path.getsize(path) // 1024} kB)")


if __name__ == "__main__":
    main()
