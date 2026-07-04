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
- **Export** – Export der fertigen Karte als JPG in Druckqualität, passend
  zur physischen Kartengröße von **5,5 × 8 cm**.
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
└── assets/      (aktuell ungenutzt, für zukünftige statische Assets)
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
   pixelgenau auf ein `<canvas>` (1100 × 1600 px, entspricht 5,5 × 8 cm bei
   sehr hoher Druckauflösung) und lädt sie als JPG herunter.

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

### Bekannte Stolpersteine (für künftige Änderungen)

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

- **Format**: 5,5 × 8 cm (Seitenverhältnis 55:80)
- **Aufbau von oben nach unten**: Name → Bild → Eigenschaften (optional) →
  "Seltenheit" mit 5-Sterne-Skala
- **Rahmen**: weißer äußerer Kartenrand, darin der frei wählbare
  Farbverlauf als Hintergrund
- **Max. Eigenschaften**: 5
- **Zeichenlimits**: Name 28 Zeichen, Eigenschaft-Label 16 Zeichen,
  Eigenschaft-Wert 50 Zeichen

## Browser-Voraussetzungen

Moderne Browser mit Unterstützung für `CanvasRenderingContext2D.roundRect`,
`canvas.toBlob` und variable Webfonts (aktuelle Versionen von Chrome, Edge,
Firefox, Safari). Für die Kamera-Aufnahme wird ein Gerät mit Kamera und ein
Browser mit Unterstützung für `<input type="file" capture>` benötigt
(funktioniert zuverlässig auf mobilen Geräten).
