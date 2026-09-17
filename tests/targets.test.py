#!/usr/bin/env python3
"""
Mäter måltavlornas PDF:er och kontrollerar att rutnäten är exakta.

Det här är den enda kontroll som verkligen betyder något för en måltavla: är
rutorna inte exakt en centimeter blir varje avvikelse man matar in i verktyget
fel. Testet läser PDF:ens innehållsström och mäter linjeavstånden i punkter.

Kör:  python3 tests/targets.test.py
"""

import os
import re
import sys
from collections import Counter

PT_PER_MM = 72 / 25.4

#: Tolerans i millimeter. Koordinaterna skrivs med fyra decimaler i punkter,
#: vilket ger avrundningsfel på någon tiondels mikrometer. En laserskrivare
#: lägger en punkt på ungefär 42 mikrometer, så det här är långt under vad
#: någon skrivare kan återge.
TOLERANCE_MM = 0.002

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET_DIR = os.path.join(ROOT, "public", "maltavlor")

CASES = [
    # filnamn, namn, rutstorlek, blockbredd, blockhöjd, antal block i bredd/höjd
    ("maltavla-precision-a4.pdf", "Precision", 10, 180, 220, 1, 1),
    ("maltavla-jakt-a4.pdf", "Jakt", 20, 160, 200, 1, 1),
    ("maltavla-fyra-grupper-a4.pdf", "Fyra grupper", 10, 80, 100, 2, 2),
    ("maltavla-sex-sma-a4.pdf", "Sex små", 10, 80, 60, 2, 3),
]

failures = 0


def check(name, ok, detail=""):
    global failures
    print(f"{'  ok  ' if ok else ' FEL  '} {name}{'' if ok else f' — {detail}'}")
    if not ok:
        failures += 1


def read_pdf(path):
    data = open(path, "rb").read()
    stream = re.search(rb"stream\n(.*?)\nendstream", data, re.S).group(1)
    media = re.search(rb"/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]", data)
    raw = re.findall(r"([\d.]+) ([\d.]+) m ([\d.]+) ([\d.]+) l S",
                     stream.decode("latin-1"))
    segs = [(float(a), float(b), float(c), float(d)) for a, b, c, d in raw]
    return (float(media.group(1)), float(media.group(2))), segs


def cluster(positions, step_mm, min_lines=3):
    """
    Delar upp linjepositioner i grupper — en per tavla på bladet.

    Ett hopp större än ett par rutor betyder att vi lämnat en tavla. Grupper med
    för få linjer är inte rutnät utan enstaka streck, som linjen under sidhuvudet.
    """
    ordered = sorted(positions)
    if not ordered:
        return []

    step_pt = step_mm * PT_PER_MM
    groups = [[ordered[0]]]
    for value in ordered[1:]:
        if value - groups[-1][-1] > step_pt * 1.5:
            groups.append([value])
        else:
            groups[-1].append(value)

    return [g for g in groups if len(g) >= min_lines]


def spacing_mm(values):
    gaps = [round(values[i + 1] - values[i], 4) for i in range(len(values) - 1)]
    return Counter(gaps).most_common(1)[0][0] / PT_PER_MM


for filename, label, step, width, height, cols, rows in CASES:
    path = os.path.join(TARGET_DIR, filename)
    if not os.path.exists(path):
        check(f"{label}: filen finns", False, filename)
        continue

    (pw, ph), segs = read_pdf(path)

    check(f"{label}: A4-format",
          abs(pw / PT_PER_MM - 210) < TOLERANCE_MM
          and abs(ph / PT_PER_MM - 297) < TOLERANCE_MM,
          f"{pw / PT_PER_MM:.3f} × {ph / PT_PER_MM:.3f} mm")

    # En rutnätslinje går tvärs över hela tavlan och har därför exakt tavlans
    # bredd respektive höjd. Det skiljer den från linjalen i nederkanten,
    # strecket under sidhuvudet och raderna man skriver på.
    def has_length(a, b, expected_mm):
        return abs(abs(b - a) / PT_PER_MM - expected_mm) < 0.5

    verticals = {round(x1, 4) for x1, y1, x2, y2 in segs
                 if abs(x1 - x2) < 0.001 and has_length(y1, y2, height)}
    horizontals = {round(y1, 4) for x1, y1, x2, y2 in segs
                   if abs(y1 - y2) < 0.001 and has_length(x1, x2, width)}

    x_groups = cluster(verticals, step)
    y_groups = cluster(horizontals, step)

    check(f"{label}: {cols} tavla/tavlor i bredd", len(x_groups) == cols,
          f"hittade {len(x_groups)}")
    check(f"{label}: {rows} tavla/tavlor i höjd", len(y_groups) == rows,
          f"hittade {len(y_groups)}")

    for index, group in enumerate(x_groups, start=1):
        got_step = spacing_mm(group)
        span = (max(group) - min(group)) / PT_PER_MM
        check(f"{label}: rutbredd {step} mm (block {index})",
              abs(got_step - step) < TOLERANCE_MM, f"{got_step:.6f} mm")
        check(f"{label}: rutnätet {width} mm brett och jämnt delbart (block {index})",
              abs(span - width) < 0.01 and abs(span / step - round(span / step)) < 0.001,
              f"{span:.4f} mm")

    for index, group in enumerate(y_groups, start=1):
        got_step = spacing_mm(group)
        span = (max(group) - min(group)) / PT_PER_MM
        check(f"{label}: ruthöjd {step} mm (rad {index})",
              abs(got_step - step) < TOLERANCE_MM, f"{got_step:.6f} mm")
        check(f"{label}: rutnätet {height} mm högt och jämnt delbart (rad {index})",
              abs(span - height) < 0.01 and abs(span / step - round(span / step)) < 0.001,
              f"{span:.4f} mm")

    # Kontrollmåttet i nederkanten ska vara exakt 10 cm.
    footer = [abs(x2 - x1) for x1, y1, x2, y2 in segs
              if abs(y1 - y2) < 0.001 and y1 / PT_PER_MM < 25]
    ruler = max(footer) / PT_PER_MM if footer else 0
    check(f"{label}: kontrollmåttet är exakt 10 cm", abs(ruler - 100) < TOLERANCE_MM,
          f"{ruler:.6f} mm")

print("\nAlla måttkontroller gick igenom." if failures == 0
      else f"\n{failures} kontroll(er) misslyckades.")
sys.exit(0 if failures == 0 else 1)
