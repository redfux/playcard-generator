# Feature-Anfragen (Backlog)

Ideen, die besprochen, aber noch **nicht** umgesetzt wurden. Im Unterschied zu
[`features.md`](features.md) (aktueller, bereits gebauter Funktionsumfang)
sammelt diese Datei offene Wünsche für spätere Entscheidungen.

## Karten in korrekter physischer Größe direkt vom Smartphone drucken

**Problem**: Der normale "Drucken"-Dialog von Android und iOS skaliert den
JPG-Export immer auf die volle A4-Seite. Weder Android (`PrintManager`) noch
iOS (AirPrint über den Teilen-Dialog) berücksichtigen eingebettete
DPI-Metadaten einer JPEG-Datei als Vorgabe für die physische Ausgabegröße –
das gilt für Fotos-App, Dateien-App, Chrome und Safari gleichermaßen.

**Recherche-Ergebnis**: Der zuverlässige Weg ist ein clientseitig erzeugtes
**PDF** (z. B. via [jsPDF](https://github.com/parallax/jsPDF), MIT-Lizenz,
~150 KB, lokal einzubinden wie Cropper.js) mit fester Seitengröße in mm –
PDF-Seitengeometrie wird von allen gängigen PDF-Renderern (Chrome-PDF-Viewer,
iOS Dateien/PDFKit, Adobe Acrobat) zuverlässig respektiert, sofern beim
Drucken *"Tatsächliche Größe"/"Originalgröße"/"100 %"* statt *"An Seite
anpassen"* gewählt wird. Das ist auch die Standardtechnik der
"Print & Play"-Community für Bastel-/Brettspielkarten.

Geprüfte, verworfene Alternativen:
- CSS `@page { size: 62mm 90mm }` + `window.print()` – von Safari/WebKit
  (also iOS) gar nicht unterstützt, auf Android Chrome uneinheitlich je nach
  Drucker-Plugin (Mopria, HP, etc.).
- DPI-Metadaten ins JPEG einbetten – wirkungslos für den
  Handy-Drucken-Dialog, hilft höchstens in Nebenfällen.
- Drittanbieter-Druck-Apps mit freier mm-Eingabe – kein verlässlicher
  genereller Fix, eher ein Nutzer-Workaround im Einzelfall.

### Variante A – Dieselbe Karte mehrfach auf einem Bogen ✅ umgesetzt (v1.1.0/v1.2.0)

Die aktuell offene Karte wird mehrfach in korrekter physischer Größe auf
eine A4-PDF-Seite gesetzt, mit dünnen gestrichelten Schnittlinien. Details
siehe [`architecture.md`](architecture.md#pdf-druckbogen-export).

- **v1.1.0**: erste Version mit frei wählbarer Anzahl (1–9) und nur
  Kartenvorderseite (eine gewählte Rückseite wurde ignoriert).
- **v1.2.0**: auf Wunsch vereinfacht (weniger Entscheidungen für Kinder)
  und um die Rückseite ergänzt – Anzahl ist jetzt fest und richtet sich
  automatisch nach der Rückseiten-Auswahl: 9 Karten (3×3) ohne Rückseite,
  4 Karten (2×2, quer gedreht) mit Rückseite.

### Variante B – Sammlung mehrerer unterschiedlicher Karten auf einem Bogen

Mehrere, unterschiedlich gestaltete Karten werden gesammelt und gemeinsam
auf einen Bogen gedruckt.

- **Aufwand**: höher.
- **Architektur**: braucht neuen Zustand (z. B. `state.collection = []`),
  einen Schritt "Karte zur Sammlung hinzufügen", eine kleine
  Verwaltungs-UI (Miniaturansichten, Entfernen) sowie den eigentlichen
  Mehrfach-Export. Aktuell ist die App bewusst zustandslos (immer nur die
  eine gerade bearbeitete Karte, siehe `docs/architecture.md`) – das wäre
  die erste Funktion, die mehrere Kartenentwürfe gleichzeitig vorhält.
- **Offene Entscheidung**: Soll die Sammlung einen Seitenaufruf überleben
  (`localStorage`) oder nur für die laufende Sitzung existieren? Ersteres
  wäre die erste Datenspeicherung im Projekt und müsste laut Masterprompt
  in `features.md`/`architecture.md` dokumentiert werden.

### Empfehlung für Variante B, falls umgesetzt wird

Kann unabhängig von Variante A nachgezogen werden, sobald Bedarf besteht.
