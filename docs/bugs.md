# Bugs & Lösungen

Rückwirkend dokumentierte Bugs, die während der Entwicklung gefunden und
behoben wurden. Dient als Referenz, damit dieselben Fehlerquellen nicht
wiederholt werden.

## Sterne blieben trotz Aktivierung nur umrandet, nie voll gefüllt

- **Symptom**: Aktivierte Sterne zeigten nur eine goldene Umrandung statt
  vollflächig gefüllt zu sein.
- **Ursache**: Die Material-Symbols-Schrift wurde über den älteren
  `icon?family=...`-Endpunkt von Google Fonts geladen. Dieser liefert eine
  statische Icon-Schrift ohne die variable `FILL`-Achse, wodurch
  `font-variation-settings: 'FILL' 1` wirkungslos blieb.
- **Fix**: Umstellung auf den `css2`-Endpunkt mit expliziter Variablen-Achse
  (`Material+Symbols+Outlined:FILL@0..1`). Zusätzlich Kontrast-Schatten/
  -Umrandung für die Sterne ergänzt, damit sie auf jedem Farbverlauf gut
  erkennbar sind.

## Zuschneide-Dialog beim Öffnen sofort komplett sichtbar (statt versteckt)

- **Symptom**: Das Crop-Overlay war schon vor dem ersten Klick auf
  "Bild wählen" sichtbar.
- **Ursache**: `.cropper-modal { display: flex; }` (eigene Klasse) hat das
  `[hidden]`-Attribut überschrieben, da beide dieselbe CSS-Spezifität haben
  und die Autoren-Regel dabei gegenüber der UA-Standardregel gewinnt.
- **Fix**: Globale Regel `[hidden] { display: none !important; }` ergänzt.

## Hochgeladenes Foto saß leicht versetzt im Bildrahmen

- **Symptom**: Das Bild im Kartenrahmen war um ein paar Pixel nach links
  verschoben, mit sichtbarer Lücke am rechten Rand.
- **Ursache**: Der (eigentlich per `hidden` ausgeblendete) Platzhalter-Icon-
  Span blieb durch eine Material-Symbols-Regel (`display: inline-block`)
  trotzdem im Flex-Layout vorhanden und nahm Platz neben dem Bild ein.
- **Fix**: Durch dieselbe globale `[hidden]`-Regel wie oben behoben.

## Zuschneide-Overlay halbtransparent statt dunkel

- **Symptom**: Der abgedunkelte Bereich außerhalb des Zuschnitts war nur
  leicht getönt, der Hintergrund schimmerte durch.
- **Ursache**: Klassennamens-Kollision – die eigene Vollbild-Overlay-Klasse
  hieß `.cropper-modal`, genau wie eine interne Klasse von Cropper.js selbst
  (`.cropper-modal { opacity: .5 }` für den abgedunkelten Bereich *innerhalb*
  des Zuschnitt-Werkzeugs).
- **Fix**: Eigene Klasse umbenannt zu `.photo-crop-overlay`.

## Ungleichmäßiger Abstand zwischen Eigenschaften-Zeilen und Trennlinien

- **Symptom**: Manche Zeilen wirkten näher an der Trennlinie darunter als
  andere, obwohl der Zeilenkasten rechnerisch gleich hoch war.
- **Ursache**: `line-height: normal` ließ zu wenig Puffer für Unterlängen
  (g, p, y, j) – bei Wörtern mit Unterlängen wirkte der Abstand zur Linie
  optisch kleiner, obwohl das Box-Modell identisch war.
- **Fix**: `line-height: 1.5` gesetzt und Abstände von Prozent- auf
  `em`-Einheiten umgestellt (robuster bei nicht eindeutig definierter
  Containerhöhe).

## Export mit gewählter Kartenrückseite schlägt lokal fehl

- **Symptom**: War eine Rückseite ("Normal"/"Golden") gewählt, brach der
  JPG-Export mit einem Sicherheitsfehler ab – aber nur, wenn `index.html`
  direkt per Doppelklick (`file://`) statt über einen lokalen Webserver
  geöffnet wurde.
- **Ursache**: Das Rückseitenbild wurde per Dateipfad nachgeladen. Unter
  `file://` gilt jede nachgeladene Datei als eigene, fremde Quelle – der
  Canvas wird dadurch "tainted" (verunreinigt), wodurch `canvas.toBlob()`
  einen `SecurityError` wirft. Das eigene Foto war davon nicht betroffen, da
  es bereits als `data:`-URL vorlag.
- **Fix**: Die beiden Rückseitenbilder zusätzlich als Base64-Data-URLs in
  `assets/card-backs-data.js` eingebettet und für den Export ausschließlich
  darüber geladen. Data-URLs verunreinigen den Canvas grundsätzlich nicht,
  unabhängig vom Aufruf-Weg.
