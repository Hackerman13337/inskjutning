"""
Minimal PDF-skrivare för måltavlorna.

Skriver PDF direkt i stället för att gå via HTML eller bilder. Skälet är
måttnoggrannhet: en måltavla är oanvändbar om rutorna inte är exakt en
centimeter på papperet, och då duger inte en skärmdump. Här anges allt i
millimeter och räknas om till PDF:ens punkter (1 mm = 72/25.4 pt).

Inga beroenden — bara standardbiblioteket.
"""

import math

MM = 72.0 / 25.4  # punkter per millimeter

A4 = (210.0, 297.0)
A5 = (148.0, 210.0)


def _pdf_text(value: str) -> bytes:
    """Kodar text för de inbyggda Type1-fonterna (WinAnsi) och rymmer å ä ö."""
    raw = value.encode("cp1252", errors="replace")
    out = bytearray()
    for byte in raw:
        if byte in (0x28, 0x29, 0x5C):  # ( ) \
            out += b"\\" + bytes([byte])
        elif byte < 32 or byte > 126:
            out += f"\\{byte:03o}".encode("ascii")
        else:
            out.append(byte)
    return bytes(out)


class Page:
    """Ritytan. Alla koordinater i millimeter, origo nere till vänster."""

    def __init__(self, width_mm: float, height_mm: float):
        self.width = width_mm
        self.height = height_mm
        self._ops: list[bytes] = []

    # -- lågnivå ----------------------------------------------------------

    def _op(self, text: str) -> None:
        self._ops.append(text.encode("ascii"))

    def _xy(self, x: float, y: float) -> str:
        return f"{x * MM:.4f} {y * MM:.4f}"

    # -- tillstånd --------------------------------------------------------

    def save(self) -> None:
        self._op("q")

    def restore(self) -> None:
        self._op("Q")

    def set_line_width(self, mm: float) -> None:
        self._op(f"{mm * MM:.4f} w")

    def set_stroke_gray(self, value: float) -> None:
        self._op(f"{value:.4f} G")

    def set_fill_gray(self, value: float) -> None:
        self._op(f"{value:.4f} g")

    def set_stroke_rgb(self, r: float, g: float, b: float) -> None:
        self._op(f"{r:.4f} {g:.4f} {b:.4f} RG")

    def set_fill_rgb(self, r: float, g: float, b: float) -> None:
        self._op(f"{r:.4f} {g:.4f} {b:.4f} rg")

    def set_dash(self, on_mm: float, off_mm: float) -> None:
        self._op(f"[{on_mm * MM:.3f} {off_mm * MM:.3f}] 0 d")

    def clear_dash(self) -> None:
        self._op("[] 0 d")

    def set_line_cap_round(self) -> None:
        self._op("1 J")

    def set_line_cap_butt(self) -> None:
        self._op("0 J")

    # -- former -----------------------------------------------------------

    def line(self, x1: float, y1: float, x2: float, y2: float) -> None:
        self._op(f"{self._xy(x1, y1)} m {self._xy(x2, y2)} l S")

    def rect(self, x: float, y: float, w: float, h: float, fill=False, stroke=True) -> None:
        self._op(f"{self._xy(x, y)} {w * MM:.4f} {h * MM:.4f} re")
        self._op("B" if (fill and stroke) else ("f" if fill else "S"))

    def _circle_path(self, cx: float, cy: float, r: float) -> None:
        # Fyra Bézier-segment approximerar en cirkel med försumbart fel.
        k = 0.5523 * r
        self._op(f"{self._xy(cx + r, cy)} m")
        for (x1, y1, x2, y2, x3, y3) in (
            (cx + r, cy + k, cx + k, cy + r, cx, cy + r),
            (cx - k, cy + r, cx - r, cy + k, cx - r, cy),
            (cx - r, cy - k, cx - k, cy - r, cx, cy - r),
            (cx + k, cy - r, cx + r, cy - k, cx + r, cy),
        ):
            self._op(
                f"{self._xy(x1, y1)} {self._xy(x2, y2)} {self._xy(x3, y3)} c"
            )

    def circle(self, cx: float, cy: float, r: float, fill=False, stroke=True) -> None:
        self._circle_path(cx, cy, r)
        self._op("B" if (fill and stroke) else ("f" if fill else "S"))

    def clip_circle(self, cx: float, cy: float, r: float) -> None:
        """Begränsar fortsatt ritande till en cirkel. Kräver save/restore runt."""
        self._circle_path(cx, cy, r)
        self._op("W n")

    def clip_rect(self, x: float, y: float, w: float, h: float) -> None:
        self._op(f"{self._xy(x, y)} {w * MM:.4f} {h * MM:.4f} re W n")

    def polygon(self, points, fill=False, stroke=True) -> None:
        first, *rest = points
        self._op(f"{self._xy(*first)} m")
        for point in rest:
            self._op(f"{self._xy(*point)} l")
        self._op("h")
        self._op("B" if (fill and stroke) else ("f" if fill else "S"))

    # -- text -------------------------------------------------------------

    #: Ungefärliga teckenbredder för Helvetica, räcker för att centrera text.
    _WIDTHS = {"space": 278, "digit": 556, "upper": 667, "lower": 528, "other": 500}

    def text_width(self, value: str, size: float) -> float:
        """Textbredd i millimeter."""
        total = 0
        for ch in value:
            if ch == " ":
                total += self._WIDTHS["space"]
            elif ch.isdigit():
                total += self._WIDTHS["digit"]
            elif ch.isupper():
                total += self._WIDTHS["upper"]
            elif ch in ".,:;'":
                total += 250
            elif ch.islower():
                total += self._WIDTHS["lower"]
            else:
                total += self._WIDTHS["other"]
        return total / 1000.0 * size / MM

    def text(self, x: float, y: float, value: str, size: float, bold=False,
             align="left", gray=0.0, tracking=0.0) -> None:
        """Storlek i punkter. align: left, center eller right."""
        width = self.text_width(value, size)
        if align == "center":
            x -= width / 2
        elif align == "right":
            x -= width

        font = "/F2" if bold else "/F1"
        self._op(f"{gray:.4f} g")
        self._op("BT")
        self._op(f"{font} {size:.3f} Tf")
        if tracking:
            self._op(f"{tracking * MM:.3f} Tc")
        self._op(f"{self._xy(x, y)} Td")
        self._ops.append(b"(" + _pdf_text(value) + b") Tj")
        self._op("ET")
        if tracking:
            self._op("0 Tc")

    def content(self) -> bytes:
        return b"\n".join(self._ops)


def write_pdf(path: str, pages: list[Page], title: str, subject: str = "") -> None:
    """Skriver ihop sidorna till en PDF med korrekt korsreferenstabell."""
    objects: list[bytes] = []

    def add(body: bytes) -> int:
        objects.append(body)
        return len(objects)  # objektnummer, 1-baserat

    font_regular = add(
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica "
        b"/Encoding /WinAnsiEncoding >>"
    )
    font_bold = add(
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold "
        b"/Encoding /WinAnsiEncoding >>"
    )

    pages_obj = add(b"")  # fylls i när barnen är kända
    page_ids: list[int] = []

    for page in pages:
        stream = page.content()
        contents = add(
            b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n"
            + stream + b"\nendstream"
        )
        page_id = add(
            f"<< /Type /Page /Parent {pages_obj} 0 R "
            f"/MediaBox [0 0 {page.width * MM:.4f} {page.height * MM:.4f}] "
            f"/Resources << /Font << /F1 {font_regular} 0 R /F2 {font_bold} 0 R >> >> "
            f"/Contents {contents} 0 R >>".encode("ascii")
        )
        page_ids.append(page_id)

    kids = " ".join(f"{pid} 0 R" for pid in page_ids)
    objects[pages_obj - 1] = (
        f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>".encode("ascii")
    )

    info = add(
        b"<< /Title (" + _pdf_text(title) + b") "
        b"/Subject (" + _pdf_text(subject) + b") "
        b"/Creator (" + _pdf_text("Inskjutning.se") + b") >>"
    )
    catalog = add(f"<< /Type /Catalog /Pages {pages_obj} 0 R >>".encode("ascii"))

    out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0] * (len(objects) + 1)

    for index, body in enumerate(objects, start=1):
        offsets[index] = len(out)
        out += f"{index} 0 obj\n".encode("ascii") + body + b"\nendobj\n"

    xref_at = len(out)
    out += f"xref\n0 {len(objects) + 1}\n".encode("ascii")
    out += b"0000000000 65535 f \n"
    for index in range(1, len(objects) + 1):
        out += f"{offsets[index]:010d} 00000 n \n".encode("ascii")
    out += (
        f"trailer\n<< /Size {len(objects) + 1} /Root {catalog} 0 R "
        f"/Info {info} 0 R >>\nstartxref\n{xref_at}\n%%EOF\n".encode("ascii")
    )

    with open(path, "wb") as handle:
        handle.write(bytes(out))
