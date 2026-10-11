# Måltavlor som en app kan läsa av

Specifikation för `maltavla-precision-markorer-a4.pdf`, så att en målkamera-app
kan räkna fram perspektiv, skala och nollpunkt helt automatiskt.

Tavlan genereras av [`scripts/generate-targets.py`](scripts/generate-targets.py).
Ändras layouten måste måtten här uppdateras — och tvärtom.

## Koordinatsystem

Alla mått i millimeter på **sidan**, med origo i sidans övre vänstra hörn och
y nedåt. Det är samma orientering som en bild, vilket gör omräkningen från
bildpunkter rak.

Sidan är A4: **210 × 297 mm**.

> **Observera:** skottens avvikelse räknas med y **uppåt** (positivt = träffen
> sitter över riktpunkten), eftersom det är så siktets höjdratt fungerar. Byt
> tecken på y när du går från sidkoordinat till skottkoordinat.

## Markörer

Fyra ArUco-markörer ur ordlistan **`DICT_4X4_50`**, 24 × 24 mm, en i varje hörn.

| ID | Hörn | x | y |
|---|---|---|---|
| 10 | Övre vänster | 7–31 | 7–31 |
| 11 | Övre höger | 179–203 | 7–31 |
| 12 | Nedre höger | 179–203 | 266–290 |
| 13 | Nedre vänster | 7–31 | 266–290 |

ID-serien **10–13 betyder "Precision"**. Andra tavlor får egna serier (20–23,
30–33 och så vidare), så appen kan slå upp layouten direkt ur det den ser.

Att hörnen har olika ID gör orienteringen entydig: tavlan kan hänga uppochner
eller kameran stå vriden utan att det spelar roll.

### Varför fyra och inte en

Varje markör ger fyra hörnpunkter, vilket räcker för en homografi på egen hand.
**En enda överlevande markör är alltså nog** — de övriga får skjutas sönder.
Fyra spridda markörer ger bara en bättre betingad lösning över hela ytan.

## Rutnät och riktpunkt

| Vad | Värde |
|---|---|
| Rutstorlek | 10 mm |
| Rutnätets yta | x 15–195, y 49–249 |
| Rutnätets storlek | 180 × 200 mm |
| Riktpunkt och nollpunkt | **x 105, y 149** |

Nollpunkten räknas fram ur markörernas geometri, **aldrig ur siktringen i
mitten** — den är ju just det som skjuts bort.

## Kontrollmått

En 100 mm lång skala med millimeterstreck:

| Vad | Värde |
|---|---|
| Vänster ände | x 40, y 286 |
| Höger ände | x 140, y 286 |
| Längd | 100,000 mm |

Använd den som **självtest** efter perspektivkorrigeringen: mät samma sträcka
och jämför. Blir den inte 100 mm ± 1 % är utskriften omskalad, och då ska appen
varna i stället för att räkna fel i tysthet.

## Gången i appen

```
1.  detectMarkers(bild, DICT_4X4_50)
2.  Minst en känd markör?  nej -> fall tillbaka på manuell kalibrering
3.  Para ihop varje hittad markörs fyra hörn med tabellen ovan
4.  findHomography(bildpunkter -> millimeter)
5.  Mät kontrollmåttet. Avviker det mer än 1 % -> varna om skalan
6.  Räkna om varje markerat hål till millimeter
7.  Dra bort riktpunkten (105, 149) och vänd tecknet på y
8.  Skicka avvikelsen i centimeter till ballistikberäkningen
```

## Uppmätt noggrannhet

Testat genom att rendera PDF:en i 1131 × 1600 px och förvränga den med
perspektiv, vilket motsvarar en kamera vid sidan om tavlan:

| Vinkel | Hittade ID | Kontrollmått | Fel i nollpunkten |
|---|---|---|---|
| Rakt framifrån | 10, 11, 12, 13 | 99,906 mm | 0,27 mm |
| Snett ~30° | 10, 11, 12, 13 | 99,894 mm | 0,28 mm |
| Snett med lutning | 10, 11, 12, 13 | 99,885 mm | 0,31 mm |
| Kraftigt snett | 10, 11, 12, 13 | 99,867 mm | 0,32 mm |

Felet ligger under en tredjedels millimeter även i den värsta vinkeln, vilket
är försumbart jämfört med ett kulhål på 6–8 mm.

## Om markörerna inte hittas

Appen ska aldrig stanna vid "fel tavla". Tre nivåer som faller tillbaka på
varandra:

| Nivå | Användaren gör | Appen får |
|---|---|---|
| **Auto** | Ingenting | Perspektiv, skala, nollpunkt, rutnät |
| **Halvauto** | Trycker på tavlans fyra hörn och anger måtten | Perspektiv och skala |
| **Skala** | Trycker på två punkter med känt avstånd | Bara skala |

Den sista nivån behövs när tavlan är en kartong utan raka kanter att trycka på.
Lägg en tumstock bredvid, markera 10 cm, klart.

## Ändra eller lägga till markörer

Bitmönstren ligger färdiga i
[`scripts/aruco_patterns.py`](scripts/aruco_patterns.py) så att generatorn
förblir fri från beroenden. Ska de ändras körs:

```bash
python3 -m venv /tmp/aruco
/tmp/aruco/bin/pip install opencv-python-headless
/tmp/aruco/bin/python scripts/make_aruco_patterns.py
```

Måtten kontrolleras sedan med `npm run test:targets`.
