# Architektur

Technischer Hintergrund zu den Entscheidungen im Projekt. Für Funktionsumfang
siehe [`features.md`](features.md), für die Versionshistorie
[`releases.md`](releases.md).

## Technik-Stack

Bewusst einfach gehalten, kein Build-Prozess nötig:

- **HTML/CSS/JavaScript** (Vanilla, keine Frameworks)
- **[Cropper.js](https://github.com/fengyuanchen/cropperjs) 1.6.2** (MIT-Lizenz)
  für den Bildzuschnitt – selbst gehostet unter `vendor/cropperjs/`, kein CDN
- **Canvas API** für das Zusammensetzen der Karte und den JPG-Export
- **[jsPDF](https://github.com/parallax/jsPDF) 4.2.1** (MIT-Lizenz) für den
  PDF-Druckbogen-Export – selbst gehostet unter `vendor/jspdf/`, kein CDN
- **Selbst gehostete Schriften**: "Baloo 2", "Roboto" und "Material Symbols
  Outlined" – ursprünglich von Google Fonts, liegen aber als lokale Dateien
  im Projekt (siehe "Selbst gehostete Ressourcen" weiter unten)

## Projektstruktur

```
playcard-generator/
├── index.html   Seitenstruktur (Formular + Kartenvorschau + Zuschneide-Dialog)
├── styles.css   Material-Design-Styling, responsive Layout, @font-face-Regeln
├── app.js       App-Logik: Formular, Live-Vorschau, Bildzuschnitt, JPG-Export
├── fonts/
│   ├── baloo2-variable.woff2             Namens-/Überschriftenschrift
│   ├── roboto-variable.woff2             Fließtext
│   └── material-symbols-outlined.woff2   Icon-Schrift (inkl. FILL-Achse)
├── vendor/cropperjs/
│   ├── cropper.min.js    Cropper.js 1.6.2 (MIT), selbst gehostet statt CDN
│   └── cropper.min.css
├── vendor/jspdf/
│   └── jspdf.umd.min.js  jsPDF 4.2.1 (MIT), selbst gehostet statt CDN
├── assets/
│   ├── back-normal.jpeg    Kartenrückseite "Normal" (62×90mm), nur für die Auswahl-Vorschau
│   ├── back-gold.jpeg      Kartenrückseite "Golden" (62×90mm), nur für die Auswahl-Vorschau
│   └── card-backs-data.js  Dieselben beiden Bilder als Base64-Data-URLs für den Export
└── docs/        Diese Dokumentation
```

### Bewusste Abweichungen von der Standard-Ordnerstruktur

Der [Masterprompt](../README.md) sieht eigentlich `/src`, `/docs` und `/tests`
vor. Für dieses Projekt wurde bewusst **kein** `/src` angelegt:

- `index.html` muss für das aktuell genutzte GitHub-Pages-Hosting (Quelle:
  `main`-Branch, Root-Verzeichnis) im Repo-Root liegen. Ein Umzug nach `/src`
  hätte eine Anpassung der Pages-Konfiguration erfordert und das Risiko
  erhöht, die produktiv erreichbare Seite zu unterbrechen.
- Das Projekt hat bewusst **keinen Build-Prozess** (kein Bundler, kein
  Transpiler) – bei drei flachen Dateien (`index.html`, `styles.css`,
  `app.js`) bietet ein separater `/src`-Ordner keinen praktischen Vorteil.
- `/tests` entfällt, da es aktuell keine automatisierten Tests gibt (manuelle
  Verifikation im Browser bei jeder Änderung, siehe `releases.md`).

## Lokal starten

Kein Node/Build nötig – ein beliebiger statischer Webserver genügt, z. B.:

```bash
python3 -m http.server 3457
```

Danach die Seite unter `http://localhost:3457` öffnen.

## Funktionsweise

### Live-Vorschau vs. Export

Die Karte wird an zwei Stellen unabhängig voneinander gerendert:

1. **Live-Vorschau (DOM/CSS)** – `index.html`/`styles.css`, aktualisiert sich
   bei jeder Eingabe über `renderPreview()` in `app.js`. Nutzt `flexbox`,
   `clamp()` für responsive Schriftgrößen und CSS-Gradients.
2. **JPG-Export (Canvas)** – `exportCard()` in `app.js` zeichnet die Karte
   pixelgenau auf ein `<canvas>` (1240 × 1800 px, entspricht 6,2 × 9 cm bei
   20 px/mm Druckauflösung) und lädt sie als JPG herunter.

Beide Renderer teilen sich dieselben Daten (`state`-Objekt), aber nicht denselben
Zeichencode – Anpassungen an Layout/Größen müssen daher i. d. R. an **beiden**
Stellen vorgenommen werden.

### Namensfeld: feste Höhe, automatische Schriftanpassung

Damit das Namensfeld nicht wächst, wird die Schriftgröße dynamisch an die
verfügbare Fläche angepasst:

- **Vorschau**: `fitCardName()` verkleinert die Schriftgröße iterativ (über
  `scrollHeight`/`clientHeight`-Vergleich), bis der (ggf. mehrzeilige) Name in
  die fest definierte Feldhöhe passt. Wird bei jeder Texteingabe und bei
  Fenstergrößenänderung neu berechnet.
- **Export**: `fitNameLines()` macht das Gleiche für den Canvas-Kontext –
  Text wird testweise umgebrochen (`wrapTextLines()`), die Schriftgröße
  reduziert, bis die Gesamthöhe aller Zeilen in die Namensbox passt.

### Eigenschaften-Zeilen mit variabler Höhe

Kurze Werte (z. B. Zahlen) stehen inline neben dem Label. Längere Werte
(Beschreibungstexte) werden erkannt (`layoutStatRows()` im Export bzw. Flexbox
im DOM) und brechen auf mehrere Zeilen um; die Zeilenhöhe jeder
Eigenschaften-Zeile passt sich automatisch an, ohne dass Text abgeschnitten
wird. Labels verhalten sich analog (`word-break: break-word`).

### Selbst gehostete Ressourcen (kein Drittanbieter-Server-Kontakt)

Die App lädt zur Laufzeit **keine** Ressourcen mehr von externen Servern –
weder von `fonts.googleapis.com`/`fonts.gstatic.com` noch von einem CDN für
Cropper.js. Dadurch wird beim Seitenaufruf keine Besucher-IP an Dritte
übertragen (u. a. relevant wegen der DSGVO-Rechtsprechung zu extern
eingebundenen Google Fonts). Stattdessen liegen alle benötigten Dateien lokal
im Projekt:

- **Schriften** (`fonts/`, eingebunden per `@font-face` in `styles.css`):
  Baloo 2, Roboto und Material Symbols Outlined liegen als unveränderte,
  weiterhin frei lizenzierte (SIL OFL bzw. Apache 2.0) Original-Dateien
  lokal – die Optik ist dadurch exakt identisch zur vorherigen
  Google-Fonts-Einbindung. Lizenzdetails siehe
  [`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md).
  - Alle drei sind **variable Fonts**: `baloo2-variable.woff2` deckt die
    Schriftschnitte 500–800 ab, `roboto-variable.woff2` die Schnitte
    400–700, `material-symbols-outlined.woff2` die FILL-Achse (0–1) für
    leere/gefüllte Sterne. Ein einziges File pro Familie genügt daher.
  - Die Basis-Regel für `.material-symbols-outlined` (u. a.
    `font-feature-settings: 'liga'`, die Text wie `star` per Ligatur in das
    passende Icon-Glyph verwandelt) kam vorher aus Googles Stylesheet und
    ist jetzt am Anfang von `styles.css` fest hinterlegt.
- **Cropper.js** (`vendor/cropperjs/`): unveränderte Version 1.6.2
  (MIT-Lizenz), vorher von cdnjs/Cloudflare geladen, jetzt lokal
  eingebunden über `<link>`/`<script>` in `index.html`.

### Content-Security-Policy

`index.html` setzt ein CSP-Meta-Tag (`default-src 'self'` u. a.) als harte,
technische Absicherung gegen versehentliches Nachladen externer Ressourcen –
unabhängig davon, dass zur Laufzeit ohnehin nichts mehr extern geladen wird.
`img-src` erlaubt zusätzlich `data:` (Foto-Upload, Kartenrückseiten-Export),
`style-src` erlaubt `'unsafe-inline'` (für die inline `background-image`-Styles
der Rückseiten-Miniaturansichten in `index.html`).

### Rückseite anhängen

`state.cardBack` speichert `'none'`, `'normal'` oder `'gold'` (Auswahl über
die Vorschau-Kacheln in `#backPresets`, verkabelt in `app.js`). Beim Export
zeichnet `exportCard()` die Vorderseite wie bisher auf ein Canvas in
Kartengröße; `appendCardBack()` prüft danach, ob eine Rückseite gewählt ist:

- **Keine** (`state.cardBack === 'none'`): Die Funktion gibt das
  Vorderseiten-Canvas unverändert zurück – am bisherigen Export ändert sich
  nichts.
- **Normal/Golden**: Es wird ein neues, doppelt so breites Canvas erzeugt.
  Die Vorderseite wird unverändert links hineingezeichnet, das gewählte
  Rückseitenbild wird direkt angrenzend rechts hineingezeichnet – ohne
  Spiegelung, da beim Falten entlang der senkrechten Mittelachse (bedruckte
  Seite nach außen gefaltet, Rückseiten der Blätter verklebt) die Rückseite
  dadurch beim Umdrehen der fertigen Karte automatisch richtig herum
  erscheint.
- Für den Export wird **nicht** die Bilddatei aus `assets/` geladen, sondern
  die identische Grafik als Base64-Data-URL aus
  `assets/card-backs-data.js` (`CARD_BACK_DATA_URLS`). Grund: siehe Bug
  "Export schlägt mit gewählter Rückseite fehl" in
  [`bugs.md`](bugs.md).
- Die Rückseitenbilder sind bereits exakt im Kartenformat (62:90) angelegt
  und werden deshalb 1:1 auf die Zielgröße gestreckt, ohne Zuschneiden oder
  Verzerrung.
- Es gibt bewusst **keine** Live-Vorschau der Rückseite auf der Karte – nur
  die Auswahl-Kachel zeigt eine Miniaturansicht.

### PDF-Druckbogen-Export

Grund und geprüfte Alternativen siehe
[`feature-requests.md`](feature-requests.md) (Abschnitt "Karten in korrekter
physischer Größe … drucken"). Kurzfassung: Normale JPG-Ausdrucke über den
Handy-"Drucken"-Dialog werden von Android/iOS immer auf die volle A4-Seite
skaliert. Ein PDF mit exakter Seitengeometrie in mm wird dagegen von allen
gängigen PDF-Renderern korrekt in Originalgröße gedruckt, sofern beim Drucken
*"Tatsächliche Größe"* statt *"An Seite anpassen"* gewählt wird.

- `renderCardCanvas()` (in `app.js`) enthält die komplette Zeichenlogik der
  Kartenvorderseite und ist von `exportCard()` (JPG) und `exportPdfSheet()`
  (PDF) gemeinsam genutzt – beide Export-Wege bleiben dadurch garantiert
  pixelidentisch.
- `exportPdfSheet()` erzeugt ein A4-PDF (`jsPDF`, portrait, Einheit `mm`) und
  platziert die gewählte Anzahl (1–9, per Dropdown) Kopien der Karte in
  einem Raster mit maximal 3 Spalten/Zeilen (mehr passt bei 62×90 mm nicht
  verzerrungsfrei auf A4: `floor(210/62) = 3`, `floor(297/90) = 3`). Das
  Raster wird auf der Seite zentriert, dünne gestrichelte Linien markieren
  die Schnittkanten zwischen den Karten.
- `CARD_WIDTH_MM`/`CARD_HEIGHT_MM` sind die einzige Quelle der Wahrheit für
  die physische Kartengröße – sowohl die JPG-Export-Canvas-Auflösung
  (`EXPORT_W`/`EXPORT_H`, abgeleitet über `PX_PER_MM`) als auch die
  PDF-Platzierung rechnen von diesen zwei Werten ab, damit beide Formate
  nie auseinanderlaufen können.
- **Bewusste Einschränkung der ersten Version**: Es wird immer nur die
  Kartenvorderseite gedruckt, unabhängig von einer gewählten Rückseite
  ("Normal"/"Golden"). Das hält die erste Version einfach; siehe
  `feature-requests.md` für die Überlegung, das später zu erweitern.

## Bekannte Stolpersteine (für künftige Änderungen)

- **Bilder im Canvas & `file://`**: Jedes Bild, das per Dateipfad (statt als
  `data:`-URL) in ein `<canvas>` gezeichnet wird, muss beim Export
  funktionieren – auch wenn `index.html` direkt per Doppelklick geöffnet
  wird. Deshalb werden die Kartenrückseiten zusätzlich als Base64-Data-URLs
  in `assets/card-backs-data.js` gepflegt (siehe "Rückseite anhängen").
  Neue, für den Export benötigte Bild-Assets sollten demselben Muster
  folgen.
- **`[hidden]`-Attribut**: Wird in diesem Projekt global mit
  `[hidden] { display: none !important; }` abgesichert, weil einzelne
  Klassen (z. B. von Icon-Fonts) sonst `display` überschreiben und Elemente
  trotz `hidden`-Attribut sichtbar bleiben.
- **Klassennamen-Kollisionen mit Cropper.js**: Cropper.js bringt eigene
  interne CSS-Klassen mit (u. a. `.cropper-modal` mit `opacity: .5`). Eigene
  Elemente sollten daher nie `cropper-*`-Klassennamen verwenden (siehe
  `.photo-crop-overlay` als bewusst eigenständiger Name für den
  Vollbild-Dialog).
- **Prozentuale vs. `em`-basierte Abstände**: Innerhalb der Karte werden
  Abstände bevorzugt in `em`/feste Einheiten statt Prozent angegeben, da
  Prozent-Werte für `gap`/`padding` bei nicht eindeutig definierter
  Containerhöhe browserabhängig uneinheitlich berechnet werden können.

## Browser-Voraussetzungen

Moderne Browser mit Unterstützung für `CanvasRenderingContext2D.roundRect`,
`canvas.toBlob` und variable Webfonts (aktuelle Versionen von Chrome, Edge,
Firefox, Safari). Für die Kamera-Aufnahme wird ein Gerät mit Kamera und ein
Browser mit Unterstützung für `<input type="file" capture>` benötigt
(funktioniert zuverlässig auf mobilen Geräten).
