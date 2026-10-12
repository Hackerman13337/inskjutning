#!/usr/bin/env python3
"""
Hämtar ut bitmönstren för de ArUco-markörer måltavlorna använder och skriver
dem till scripts/aruco_patterns.py.

Körs bara när markörerna ska ändras, och kräver OpenCV:

    python3 -m venv /tmp/aruco && /tmp/aruco/bin/pip install opencv-python-headless
    /tmp/aruco/bin/python scripts/make_aruco_patterns.py

Mönstren skrivs ut som rena listor så att måltavlegeneratorn förblir fri från
beroenden — den behöver aldrig OpenCV, bara den färdiga tabellen.
"""

import os
import sys

import cv2
import numpy as np

DICTIONARY = cv2.aruco.DICT_4X4_50
DICTIONARY_NAME = "DICT_4X4_50"

#: ID:n måltavlorna använder. Varje tavla har fyra, ett per hörn, och
#: ID-serien talar om vilken tavla det är.
IDS = {
    10: "Precision, övre vänster",
    11: "Precision, övre höger",
    12: "Precision, nedre höger",
    13: "Precision, nedre vänster",
}

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "aruco_patterns.py")


def pattern(dictionary, marker_id: int) -> list[list[int]]:
    """Markören som rader av 0 (svart) och 1 (vit), inklusive svart ram."""
    # En pixel per cell: 4 databitar plus en cells ram på varje sida = 6.
    side = cv2.aruco.getPredefinedDictionary(DICTIONARY).markerSize + 2
    image = cv2.aruco.generateImageMarker(dictionary, marker_id, side)
    return [[1 if value > 127 else 0 for value in row] for row in np.asarray(image)]


def main() -> None:
    dictionary = cv2.aruco.getPredefinedDictionary(DICTIONARY)

    lines = [
        '"""',
        "Bitmönster för ArUco-markörerna på måltavlorna.",
        "",
        f"Ordlista: {DICTIONARY_NAME}. Genererad av scripts/make_aruco_patterns.py —",
        "redigera inte för hand, kör om skriptet i stället.",
        "",
        "Varje mönster är rader uppifrån och ner, 1 = vit cell, 0 = svart.",
        "Den yttersta ramen är svart, så som ArUco kräver.",
        '"""',
        "",
        f'DICTIONARY = "{DICTIONARY_NAME}"',
        "",
        "PATTERNS = {",
    ]

    for marker_id, description in IDS.items():
        rows = pattern(dictionary, marker_id)
        lines.append(f"    # {description}")
        lines.append(f"    {marker_id}: [")
        for row in rows:
            lines.append(f"        {row},")
        lines.append("    ],")

    lines.append("}")
    lines.append("")

    with open(OUT, "w") as handle:
        handle.write("\n".join(lines))

    print(f"skrev {os.path.relpath(OUT)} med {len(IDS)} mönster ur {DICTIONARY_NAME}")


if __name__ == "__main__":
    sys.exit(main())
