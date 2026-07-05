# playcard-generator (Kartenmacher)

Eine kleine, kindgerechte Web-App, mit der man eigene Spielkarten im Stil von
Pokémon-Sammelkarten erstellen und als JPG exportieren kann. Läuft komplett
im Browser, ohne Server-Backend.

**Live:** https://redfux.github.io/playcard-generator/ (gehostet via GitHub
Pages, wird bei jedem Push auf `main` automatisch aktualisiert)

## Funktionen

- **Name** (Pflichtfeld, bis zu 28 Zeichen) – steht oben auf der Karte in
  einem fest dimensionierten Namensfeld. Ist der Name zu lang, bricht der
  Text automatisch um bzw. wird die Schrift verkleinert.
- **Bild** – per Handy-Kamera aufnehmen oder aus der Galerie hochladen,
  anschließend zuschneidbar (verschieben, zoomen).
- **Eigenschaften** – bis zu 5 frei benennbare Eigenschaften (Label + Wert),
  müssen nicht alle ausgefüllt werden.
- **Seltenheitswert** – 5-Sterne-Skala am unteren Kartenrand.
- **Hintergrund** – frei wählbarer Farbverlauf (Vorlagen oder eigene Farben).
- **Rückseite** (optional) – "Keine", "Normal" oder "Golden"; wird beim
  Export in identischer Größe direkt neben die Vorderseite gesetzt, zum
  Ausschneiden, Falten und Kleben.
- **Export** – JPG in Druckqualität, Kartenformat 6,2 × 9 cm.
- **Responsive & barrierearm** – nutzbar auf Handy und PC, für Kinder ab ca.
  9 Jahren, Look & Feel angelehnt an Google Material Design.

Ausführliche Anforderungen: [`docs/features.md`](docs/features.md).

## Lokal starten

Kein Node/Build nötig – ein beliebiger statischer Webserver genügt, z. B.:

```bash
python3 -m http.server 3457
```

Danach die Seite unter `http://localhost:3457` öffnen.

## Weiterführende Dokumentation

- [`docs/features.md`](docs/features.md) – Funktionsumfang / Anforderungen
- [`docs/architecture.md`](docs/architecture.md) – Technik-Stack,
  Projektstruktur, Architekturentscheidungen
- [`docs/bugs.md`](docs/bugs.md) – gefundene Bugs & deren Lösung
- [`docs/releases.md`](docs/releases.md) – Changelog
- [`docs/THIRD_PARTY_LICENSES.md`](docs/THIRD_PARTY_LICENSES.md) – Lizenzen
  eingebetteter Schriften/Bibliotheken

## Hinweise zu bewussten Abweichungen von den Projektvorgaben

- **Repo ist public statt private**: GitHub Pages steht auf einem
  kostenlosen GitHub-Account nur für öffentliche Repos zur Verfügung. Der
  Quellcode enthält keine Geheimnisse oder Nutzerdaten.
- **Keine `/src`-Aufteilung**: `index.html` muss für das aktuelle
  GitHub-Pages-Setup im Repo-Root liegen; bei nur drei Code-Dateien ohne
  Build-Prozess bietet ein separater `/src`-Ordner keinen praktischen
  Vorteil. Details siehe [`docs/architecture.md`](docs/architecture.md).
- **Kein ESLint/Prettier**: Würde Node-Tooling (`package.json`,
  `node_modules`) einführen, das dem bewussten "kein Build-Prozess"-Ansatz
  widerspricht. Stattdessen sorgt `.editorconfig` (kein npm nötig) für
  einheitliche Einrückung und Zeilenenden.
