"""
Bitmönster för ArUco-markörerna på måltavlorna.

Ordlista: DICT_4X4_50. Genererad av scripts/make_aruco_patterns.py —
redigera inte för hand, kör om skriptet i stället.

Varje mönster är rader uppifrån och ner, 1 = vit cell, 0 = svart.
Den yttersta ramen är svart, så som ArUco kräver.
"""

DICTIONARY = "DICT_4X4_50"

PATTERNS = {
    # Precision, övre vänster
    10: [
        [0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0],
    ],
    # Precision, övre höger
    11: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0],
    ],
    # Precision, nedre höger
    12: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 1, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0],
    ],
    # Precision, nedre vänster
    13: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0],
    ],
}
