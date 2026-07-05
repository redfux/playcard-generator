# playcard-generator (Kartenmacher)

Eine kleine, kindgerechte Web-App, mit der man eigene Spielkarten im Stil von
Pokémon-Sammelkarten erstellen und als JPG exportieren kann. Läuft komplett
im Browser, ohne Server-Backend.

**Live:** https://redfux.github.io/playcard-generator/ (gehostet via GitHub
Pages, wird bei jedem Push auf `main` automatisch aktualisiert)

## Funktionen

- **Name** (Pflichtfeld, bis zu 28 Zeichen) – steht oben auf der Karte in
  einem fest dimensionierten Namensfeld. Ist der Name zu lang, bricht der
  Text automatisch um bzw. wird die Schrift verkleinert, damit das Feld
  selbst nicht wächst und dem Bild kein Platz wegnimmt.
- **Bild** – per Handy-Kamera aufnehmen oder aus der Galerie hochladen.
  Anschließend lässt sich der Bildausschnitt zuschneiden, verschieben und
  zoomen (quadratischer Ausschnitt) via [Cropper.js](https://github.com/fengyuanchen/cropperjs).
- **Eigenschaften** – bis zu 5 frei benennbare Eigenschaften (Label + Wert),
  müssen nicht alle ausgefüllt werden. Werte dürfen bis zu 50 Zeichen lang
  sein (z. B. für kurze Angriffsbeschreibungen) und brechen bei Bedarf auf
  mehrere Zeilen um.
- **Seltenheit** – 5-Sterne-Skala am unteren Kartenrand, beschriftet mit
  "Seltenheit".
- **Hintergrund** – frei wählbarer Farbverlauf, entweder über 8 Vorlagen-Verläufe
  oder zwei eigene Farben (Color-Picker).
- **Rückseite** (optional) – Auswahl zwischen "Keine", "Normal" und "Golden"
  (zwei fest hinterlegte Bild-Vorlagen). Wird eine Rückseite gewählt, hängt
  der Export sie direkt rechts neben das Kartenbild – in exakt gleicher
  Größe, damit man beides in einem Stück ausschneiden, einmal in der Mitte
  falten und zusammenkleben kann.
- **Export** – Export der fertigen Karte als JPG in Druckqualität, passend
  zur physischen Kartengröße von **6,2 × 9 cm**.
- **Responsive & barrierearm** – nutzbar auf Handy und PC, großzügige
  Touch-Ziele und einfache Sprache für Kinder ab ca. 9 Jahren, Look & Feel
  angelehnt an Google Material Design.

## Technik-Stack

Bewusst einfach gehalten, kein Build-Prozess nötig:

- **HTML/CSS/JavaScript** (Vanilla, keine Frameworks)
- **[Cropper.js](https://github.com/fengyuanchen/cropperjs)** (CDN) für den
  Bildzuschnitt
- **Canvas API** für das Zusammensetzen der Karte und den JPG-Export
- **Google Fonts**: "Baloo 2" (verspielte Überschriftenschrift für den
  Namen), "Roboto" (Fließtext) und "Material Symbols Outlined" (Icons,
  variable Schrift mit FILL-Achse für ausgefüllte/leere Sterne)

## Projektstruktur

```
playcard-generator/
├── index.html   Seitenstruktur (Formular + Kartenvorschau + Zuschneide-Dialog)
├── styles.css   Material-Design-Styling, responsive Layout
├── app.js       App-Logik: Formular, Live-Vorschau, Bildzuschnitt, JPG-Export
└── assets/
    ├── back-normal.jpeg    Kartenrückseite "Normal" (62×90mm), nur für die Auswahl-Vorschau
    ├── back-gold.jpeg      Kartenrückseite "Golden" (62×90mm), nur für die Auswahl-Vorschau
    └── card-backs-data.js  Dieselben beiden Bilder als Base64-Data-URLs für den Export
```

## Lokal starten

Kein Node/Build nötig – ein beliebiger statischer Webserver genügt, z. B.:

```bash
python3 -m http.server 3457
```

Danach die Seite unter `http://localhost:3457` öffnen.

## Funktionsweise / Architektur-Details

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
wird.

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
  `assets/card-backs-data.js` (`CARD_BACK_DATA_URLS`). Grund: Ein per
  Dateipfad nachgeladenes Bild gilt für den Browser als eigene Quelle und
  "verunreinigt" (tainted) den Canvas, sobald die Seite über `file://`
  (Doppelklick auf `index.html`) statt über einen Webserver geöffnet wird –
  `canvas.toBlob()` bricht dann mit einem SecurityError ab. Data-URLs
  umgehen dieses Problem grundsätzlich, unabhängig vom Aufruf-Weg. Die
  `.jpeg`-Dateien in `assets/` bleiben trotzdem bestehen, da sie für die
  Miniaturansichten in der Auswahl (`background-image` in `index.html`)
  verwendet werden – dort tritt das Tainting-Problem nicht auf, weil dabei
  nichts in einen Canvas gezeichnet wird.
- Die Rückseitenbilder sind bereits exakt im Kartenformat (62:90) angelegt
  und werden deshalb 1:1 auf die Zielgröße gestreckt, ohne Zuschneiden oder
  Verzerrung.
- Es gibt bewusst **keine** Live-Vorschau der Rückseite auf der Karte – nur
  die Auswahl-Kachel zeigt eine Miniaturansicht.

### Bekannte Stolpersteine (für künftige Änderungen)

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

## Kartengestaltung im Detail

- **Format**: 6,2 × 9 cm (Seitenverhältnis 62:90)
- **Aufbau von oben nach unten**: Name → Bild → Eigenschaften (optional) →
  "Seltenheit" mit 5-Sterne-Skala
- **Rahmen**: weißer äußerer Kartenrand, darin der frei wählbare
  Farbverlauf als Hintergrund
- **Max. Eigenschaften**: 5
- **Zeichenlimits**: Name 28 Zeichen, Eigenschaft-Label 16 Zeichen,
  Eigenschaft-Wert 50 Zeichen
- **Rückseite** (optional): "Normal" oder "Golden", exakt im Kartenformat
  62:90 – wird beim Export direkt rechts an die Vorderseite angehängt, zum
  Ausschneiden, einmal Falten und Kleben

## Browser-Voraussetzungen

Moderne Browser mit Unterstützung für `CanvasRenderingContext2D.roundRect`,
`canvas.toBlob` und variable Webfonts (aktuelle Versionen von Chrome, Edge,
Firefox, Safari). Für die Kamera-Aufnahme wird ein Gerät mit Kamera und ein
Browser mit Unterstützung für `<input type="file" capture>` benötigt
(funktioniert zuverlässig auf mobilen Geräten).
