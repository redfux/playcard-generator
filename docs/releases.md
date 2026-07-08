# Changelog

Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [SemVer](https://semver.org/lang/de/). Rückwirkend aus der
Git-Historie rekonstruiert.

## [1.2.0]

### Added
- PDF-Druckbogen enthält jetzt auch die Kartenrückseite, falls gewählt:
  Vorder-/Rückseiten-Einheit wird um 90° gedreht und im 2×2-Raster (4
  Stück) auf A4 platziert, statt wie bisher ignoriert zu werden.

### Changed
- Die frei wählbare Kopienanzahl (1–9) wurde entfernt – zu viele
  Einstellungen für die Zielgruppe Kinder. Stattdessen feste Stückzahl je
  nach Rückseiten-Auswahl: 9 Karten (3×3, ohne Rückseite) bzw. 4 Karten
  (2×2, quer gedreht, mit Rückseite). Ein Hinweistext zeigt die jeweils
  geltende Anzahl an.

## [1.1.0]

### Added
- PDF-Druckbogen-Export: Die aktuelle Kartenvorderseite kann in 1 bis 9
  frei wählbaren Kopien auf einer A4-Seite exportiert werden, jeweils exakt
  in physischer Kartengröße (62×90 mm) mit dünnen Schnittlinien. Löst das
  Problem, dass der normale Drucken-Dialog von Android/iOS Bilder immer auf
  die volle Seite skaliert (dokumentiert in `docs/feature-requests.md`).
  Umgesetzt via lokal eingebundenem jsPDF (MIT-Lizenz).

### Changed
- Interne Zeichenlogik der Kartenvorderseite (`renderCardCanvas()`) aus dem
  JPG-Export herausgelöst, damit JPG- und PDF-Export dieselbe Funktion
  nutzen und garantiert identisch aussehen.

## [1.0.0]

### Added
- Aktuelle App-Version wird in der Footer-Zeile angezeigt
  (`APP_VERSION`-Konstante in `app.js`).

### Changed
- Erste als "1.0" gekennzeichnete Version (explizite Anweisung, siehe
  Masterprompt-Regel: MAJOR wird nur auf ausdrücklichen Wunsch erhöht).

## [0.6.1]

### Added
- Hinweis "thought up by human, created by ai" als Kommentar am Anfang von
  `index.html`, `styles.css` und `app.js` sowie als dezente Fußzeile in der
  Benutzeroberfläche.

## [0.6.0]

### Added
- `LICENSE` (MIT), `.editorconfig`, `docs/` mit `architecture.md`,
  `features.md`, `bugs.md`, `releases.md`, `THIRD_PARTY_LICENSES.md`.
- Content-Security-Policy (Meta-Tag) in `index.html` als harte, technische
  Absicherung gegen externes Nachladen.

### Changed
- `README.md` gekürzt auf Zweck/Setup/Nutzung, Architektur-Details nach
  `docs/architecture.md` verschoben.
- `.gitignore` um projektunabhängige Standard-Ausschlüsse ergänzt.

## [0.5.3]

### Changed
- Überschrift "Bewertung" zu "Seltenheitswert" umbenannt.

## [0.5.2]

### Changed
- Zeichenlimit für Eigenschaften-Label von 16 auf 24 Zeichen erhöht,
  inklusive Zeilenumbruch bei langen, zusammenhängenden Wörtern.

## [0.5.1]

### Changed
- Cropper.js (Bildzuschnitt-Bibliothek) wird nicht mehr von einem CDN
  geladen, sondern unverändert lokal aus `vendor/cropperjs/` eingebunden.

## [0.5.0]

### Changed
- Schriften ("Baloo 2", "Roboto", "Material Symbols Outlined") werden nicht
  mehr von Google Fonts nachgeladen, sondern als unveränderte, lokale
  Dateien eingebunden – keine Übertragung von Besucher-IPs an Google mehr,
  optisch identisch.

## [0.4.1]

### Fixed
- JPG-Export schlug bei gewählter Kartenrückseite fehl, wenn `index.html`
  per `file://` (Doppelklick) statt über einen Webserver geöffnet wurde
  (Canvas-Tainting durch dateibasiertes Nachladen). Rückseitenbilder liegen
  jetzt zusätzlich als Base64-Data-URLs vor.

## [0.4.0]

### Added
- Auswahl einer optionalen Kartenrückseite ("Keine" / "Normal" / "Golden").
  Wird eine Rückseite gewählt, hängt der Export sie in identischer Größe
  direkt rechts an die Vorderseite an (zum Ausschneiden, Falten, Kleben).

### Changed
- Physische Kartengröße von 5,5 × 8 cm auf 6,2 × 9 cm geändert (besser
  handhabbar beim Ausschneiden/Falten).

## [0.3.0]

### Added
- Beschriftung "Seltenheit" vor der 5-Sterne-Skala, sowohl in der
  Live-Vorschau als auch im Export.

### Changed
- Namensfeld hat jetzt eine feste Höhe; der Name bricht bei Bedarf um bzw.
  wird automatisch verkleinert, statt das Feld wachsen zu lassen.
- Abstände zwischen Name, Bild, Eigenschaften und Sternen verkleinert, damit
  das Bild mehr Platz auf der Karte bekommt.

## [0.2.1]

### Fixed
- Ungleichmäßiger Abstand zwischen Eigenschaften-Zeilen und den
  Trennlinien darunter (zu knapper Zeilenabstand ließ Wörter mit
  Unterlängen optisch näher an der Linie wirken).

## [0.2.0]

### Added
- Zeichenlimit für Eigenschaften-Werte von 12 auf 50 Zeichen erhöht
  (z. B. für kurze Angriffsbeschreibungen), inklusive automatischem
  Zeilenumbruch in Vorschau und Export.

### Changed
- Schriftgröße von Kartenname und Eigenschaften vergrößert für bessere
  Lesbarkeit im Ausdruck.

### Fixed
- Sterne blieben bei Aktivierung nur als Umriss sichtbar statt vollflächig
  gefüllt (falscher Google-Fonts-Endpunkt ohne FILL-Achse).
- Sterne auf der Karte waren je nach Hintergrundfarbe schwer erkennbar –
  Kontrast-Umrandung/-Schatten ergänzt.

## [0.1.0]

### Added
- Erste lauffähige Version: Name, Bildaufnahme/-Upload mit Zuschnitt, bis zu
  5 Eigenschaften, 5-Sterne-Bewertung, frei wählbarer Farbverlauf-
  Hintergrund, JPG-Export im Kartenformat, responsive Material-Design-UI,
  GitHub-Pages-Hosting.
