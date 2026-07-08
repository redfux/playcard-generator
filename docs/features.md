# Funktionsumfang / Anforderungen

Aktueller Stand des Funktionsumfangs von playcard-generator ("Kartenmacher").
Für die Entstehungsgeschichte siehe [`releases.md`](releases.md).

## Zielgruppe & Anspruch

- Zielgruppe: Kinder ab ca. 9 Jahren – Bedienung muss ohne Erklärung
  verständlich sein.
- Nutzbar auf Handy und PC (responsive).
- Gestalterische Grundlage: Google Material Design.

## Karteninhalt

| Feld | Pflicht? | Details |
|---|---|---|
| Name | Ja | Max. 28 Zeichen. Bricht bei Bedarf um bzw. wird verkleinert – das Namensfeld selbst wächst nicht. |
| Bild | Nein | Aufnahme per Handy-Kamera oder Upload aus der Galerie, danach zuschneidbar (Verschieben/Zoomen, quadratischer Ausschnitt). |
| Eigenschaften | Nein | Bis zu 5 Stück, je Label (max. 24 Zeichen) + Wert (max. 50 Zeichen). Müssen nicht alle ausgefüllt werden. Lange Werte/Labels brechen um. |
| Seltenheitswert | Nein (Default: 0) | 5-Sterne-Skala, beschriftet mit "Seltenheit" auf der Karte. |
| Hintergrund | Ja (mit Vorgabe) | Farbverlauf – entweder aus 8 Vorlagen oder zwei frei wählbaren Farben. |
| Rückseite | Nein (Default: keine) | Auswahl zwischen "Keine", "Normal", "Golden" (feste Bild-Vorlagen). |

## Kartengestaltung im Detail

- **Format**: 6,2 × 9 cm (Seitenverhältnis 62:90)
- **Aufbau von oben nach unten**: Name → Bild → Eigenschaften (optional) →
  "Seltenheit" mit 5-Sterne-Skala
- **Rahmen**: weißer äußerer Kartenrand, darin der frei wählbare Farbverlauf
  als Hintergrund

## Export

- Export als JPG in Druckqualität (1240 × 1800 px, 20 px/mm).
- Ist eine Rückseite gewählt, wird sie direkt rechts neben das Kartenbild
  gesetzt – in exakt gleicher Größe, sodass man beides in einem Stück
  ausschneiden, einmal in der Mitte falten und zusammenkleben kann.
- Ohne gewählte Rückseite bleibt der Export unverändert (nur die
  Kartenvorderseite).
- **PDF-Druckbogen**: Export als PDF auf einer A4-Seite, mit 1 bis 9 frei
  wählbaren Kopien der aktuellen Kartenvorderseite in einem Raster
  (max. 3×3), jeweils exakt in physischer Kartengröße (62×90 mm) platziert,
  mit dünnen Schnittlinien. Löst das Problem, dass normale Handy-Druckdialoge
  Bilder immer auf die volle Seite skalieren – beim Drucken muss "Tatsächliche
  Größe"/"Originalgröße" statt "An Seite anpassen" gewählt werden. Enthält
  aktuell nur die Vorderseite, unabhängig von einer gewählten Rückseite
  (siehe [`feature-requests.md`](feature-requests.md)).

## Datenschutz & Offline-Fähigkeit

- Keine Server-Backend-Anbindung, keine Nutzerdaten-Persistierung
  (kein `localStorage`/`IndexedDB` – der Stand geht beim Neuladen verloren).
- Keine Analytics- oder Tracking-Skripte.
- Lädt zur Laufzeit nichts von externen Servern nach (Schriften, Icons und
  die Zuschneide-Bibliothek sind lokal im Projekt vendort). Siehe
  [`architecture.md`](architecture.md) für Details.

## Nicht-Ziele (aktuell bewusst nicht umgesetzt)

- Kein Speichern/Laden mehrerer Karten oder Kartensätze.
- Keine Mehrsprachigkeit (App ist auf Deutsch).
- Keine automatisierten Tests.
