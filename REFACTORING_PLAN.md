# REFACTORING_PLAN.md — Nils Webdesign Website

> Ziel: Die gewachsene, statische Marketing-Website in eine saubere, modulare,
> **wartbare** Struktur überführen — **ohne** Design, Inhalte, URLs, SEO oder
> die Formular-/API-Anbindung zu zerstören. Zusätzlich: konsistente Kodierung,
> Bilder/Medien asynchron, kleine Logik-/SEO-Fehler beheben.

Stand der Analyse: siehe Zahlen unten (alle per Skript verifiziert, nicht geschätzt).

---

## 1. Aktuelle Struktur (Ist-Zustand, verifiziert)

Das Repository ist eine **flache, statische Website** (Deployment: Vercel,
`cleanUrls: true`). Es gibt **keine** Unterverzeichnisse, **kein** `/api`,
`/admin`, `/dashboard`, `/branchen`, `/blog`, `/wissen`, `/score` und **keine**
MySQL-Anbindung im Repo. Die im ursprünglichen Auftragstext genannten Bereiche
existieren hier nicht — dieser Plan bezieht sich ausschließlich auf das, was
tatsächlich vorhanden ist.

```
/  (Repo-Wurzel)
├── 16 × *.html            je 127–164 KB, je ~1.700–2.750 Zeilen
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── vercel.json            (statisch, Security-Header, cleanUrls)
└── README.md
```

Die 16 Seiten:
`index, webdesign, webdesign-dresden, seo, local-seo, ki-suche-geo, hosting,
leistungen, pakete, portfolio, ueber-uns, kontakt, impressum, datenschutz,
agb, widerruf`.

### Aufbau jeder Seite (identisch geformt — offensichtlich generiert)

| Bereich            | Zeilen (Beispiel index) | Zustand |
|--------------------|-------------------------|---------|
| `<head>` Meta      | 3–24                    | pro Seite unterschiedlich (title/description/canonical/OG) |
| `<style>` (CSS)    | 25–1340 (~55,6 KB)      | **auf allen 16 Seiten inhaltlich identisch** |
| JSON-LD            | 1341–1342               | pro Seite (0–3 Blöcke) |
| `<header>`+`<nav>` | 1347–1373               | geteilt, nur `class="active"` unterscheidet |
| `<main>`           | 1375–1667               | **individueller Seiteninhalt** |
| `<footer>`         | 1670–1706               | geteilt (identisch) |
| `<script>` (JS)    | 1708–Ende (~1.039 Z.)   | **auf allen 16 Seiten inhaltlich identisch** |

## 2. Erkannte Wiederholung / Fehler (verifiziert)

1. **CSS 16-fach dupliziert.** Der `<style>`-Block ist ~55,6 KB groß und auf
   allen 16 Seiten **inhaltlich identisch** (`diff -w` = 0 Unterschiede).
   → ~890 KB redundanter Quelltext.
2. **JS 16-fach dupliziert.** Der gemeinsame `<script>`-Block (~1.039 Zeilen)
   ist ebenfalls auf allen Seiten identisch (`diff -w` = 0). Kommentar im Code:
   „Wird von allen Seiten eingebunden."
3. **Header, Nav, Footer, Cookie-Banner, Head-Grundgerüst und der
   Organization/LocalBusiness-JSON-LD** sind auf jeder Seite kopiert.
4. **Uneinheitliche Zeilenenden (Bug).** `leistungen`, `pakete`, `seo` sind mit
   **CRLF** gespeichert, die übrigen 13 mit **LF**. Rein kosmetisch, aber ein
   klassischer „Passungsfehler".
5. **`pakete.html` hat keine `<h1>` (SEO-Bug).** Alle anderen Seiten haben genau
   eine; pakete hat null.
6. **Relative Font-Pfade (latenter Bug).** Das CSS referenziert Schriften als
   `url('assets/fonts/…woff2')` (relativ). Inline funktioniert das (Bezug =
   Dokumentwurzel). Beim Auslagern in `/assets/style.css` würde es zu
   `/assets/assets/fonts/…` — muss auf absolute Pfade korrigiert werden.
7. **`assets/`-Verzeichnis fehlt.** Fonts und `og-image.svg` werden referenziert,
   liegen aber nicht im Repo (aktuell System-Font-Fallback). Wird dokumentiert.
8. **Keine Rasterbilder.** Es gibt **kein** `<img>`, `<iframe>`, kein
   png/jpg/webp. Grafik = Inline-SVG + CSS-Gradienten. Schriften werden bereits
   **nach Einwilligung** (Consent) per JS geladen. „Bilder asynchron laden"
   wird deshalb als **async-by-default-Konvention** für künftige Bilder umgesetzt
   (siehe §7).

Formulare senden per `fetch('/api/…')` an ein **separat gehostetes Backend**
(nicht in diesem Repo). Diese Aufrufe bleiben **unangetastet**.

## 3. Zielstruktur

Ausgeliefert wird **weiterhin statisches HTML** (bleibt auf Vercel lauffähig,
kein PHP-Hosting nötig, kein Deployment-Risiko). PHP dient nur als **Bau-Werkzeug**.

```
/  (Repo-Wurzel = Deploy-Ausgabe)
├── *.html                 ← GENERIERT vom Build (identische URLs, schlank)
├── assets/
│   ├── style.css          ← ausgelagertes gemeinsames CSS (1×, LF, absolute Fontpfade)
│   ├── app.js             ← ausgelagertes gemeinsames JS (1×)
│   └── pakete.css         ← seitenspezifische Preistabellen-Styles
├── favicon.svg, robots.txt, sitemap.xml, site.webmanifest, vercel.json
├── .vercelignore          ← schließt /app (PHP-Quelle) vom CDN aus
└── app/                   ← QUELLE (nur zur Bauzeit, nicht deployt)
    ├── build.php          ← Generator: pro Seite Layout rendern → *.html schreiben
    ├── lib/template.php   ← Helfer: e(), asset(), component(), render()
    ├── config/
    │   ├── site.php       ← Marke, Domain, Kontakt, Asset-Version, Default-OG
    │   ├── nav.php        ← Hauptnavigation (inkl. Dropdown) — 1 Quelle
    │   ├── footer.php     ← Footer-Spalten/Links — 1 Quelle
    │   └── pages.php      ← pro Seite: Meta, JSON-LD, Fragment, aktive Nav
    └── views/
        ├── layout.php     ← HTML-Gerüst (Head, Header, Main-Slot, Footer, Scripts)
        ├── partials/{head,header,footer}.php
        ├── components/    ← wiederverwendbar: hero, price-card, solution-card,
        │                     industry-card, faq, seo-answer-block, cta-band,
        │                     seal-card, breadcrumb
        └── fragments/     ← pro Seite der <main>-Inhalt (verbatim übernommen)
```

**Neue Seite künftig** = 1 Eintrag in `config/pages.php` + 1 Fragment
(oder komplett datengetrieben über die Komponenten). Header/Footer/Meta/Preise
werden **nur noch an einer Stelle** gepflegt.

## 4. Entscheidung zu den `.html`-URLs (Option A/B/C)

Gewählt: **Option A — Build-time-Rendering zu statischem HTML.**

- **Warum nicht B (Laufzeit-PHP):** Die Seite liegt auf Vercel (statisch);
  Vercel führt kein PHP aus. Option B erzwänge einen Hosting-Wechsel → hohes
  Risiko fürs Live-Deployment. Nicht gerechtfertigt für eine Marketing-Website.
- **Warum A:** Die erzeugten `.html` sind **byte-nah** zum Browser-Ergebnis von
  heute, alle URLs bleiben 1:1 (`/webdesign.html`, via cleanUrls auch
  `/webdesign`), SEO/OG/JSON-LD/Formulare unverändert. Läuft auf **jedem**
  Hosting (statisch **oder** PHP). Quelle wird modular & datengetrieben.
- Ergebnis: maximale Sicherheit + volle Wartbarkeit, „kein Schnickschnack".

## 5. Migrationsreihenfolge (Prototyp zuerst, dann Übertragung)

1. Gemeinsames CSS → `assets/style.css` (LF, Fontpfade absolut), JS → `assets/app.js`.
2. Template-Gerüst: `lib/template.php`, `layout.php`, `partials/{head,header,footer}`.
3. Datenquellen: `config/{site,nav,footer,pages}.php`.
4. **Prototyp-Seiten** bauen & prüfen: `index` → `pakete` → `leistungen` →
   `webdesign` → `kontakt` → eine Rechtsseite (`impressum`).
5. Wenn Prototypen sauber (Diff gegen Original ohne Inline-Blöcke = nur erwartete
   Unterschiede): **alle 16 Seiten** über denselben Build erzeugen.
6. Komponenten-Bibliothek + „Neue Seite anlegen"-Anleitung.
7. Fixes: `pakete`-H1 ergänzen (Design unverändert), async-Bild-Konvention.
8. QA-Durchlauf (§7), dann `REFACTORING_SUMMARY.md` + `MIGRATION_NOTES.md`.

## 6. Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Inhalt geht beim Zerlegen verloren | `<main>` **verbatim** als Fragment; automatischer Vergleich Alt↔Neu je Seite |
| Fontpfade brechen nach Auslagern | url() global auf absolute `/assets/fonts/…` umgeschrieben |
| SEO-Regression (Title/Canonical/JSON-LD) | Meta 1:1 aus Original geparst, im Build wieder ausgegeben; Prüfliste §7 |
| Vercel serviert PHP-Quelle | `.vercelignore` schließt `/app` aus |
| JS-Reihenfolge (war Inline am Body-Ende) | externes `app.js` mit `defer` (verhaltensgleich) |
| pakete-H1 ändert Optik | H1 visuell wie bisherige Headline gestylt, kein Layout-Bruch |
| Kein PHP auf User-Maschine | Fallback dokumentiert: generierte `.html` direkt editierbar |

## 7. Testplan (nach jedem großen Schritt)

- `php -l` für **alle** PHP-Dateien (0 Fehler).
- Build läuft ohne Fehler/Warnung, erzeugt **16** `.html`.
- Pro Seite: genau **eine** `<h1>` (inkl. Fix für `pakete`).
- Meta erhalten: `<title>`, `description`, `canonical`, `robots`, OG/Twitter,
  JSON-LD identisch zum Original.
- Interne Links funktionieren; `sitemap.xml` enthält keine toten lokalen URLs.
- Formulare zeigen weiter auf `fetch('/api/…')` (nicht verändert).
- Mobile-Navigation + Cookie-Banner funktionieren (JS unverändert ausgelagert).
- Seite ohne JavaScript grundlegend nutzbar (Inhalt steht im HTML).
- Keine Secrets/Passwörter/Tokens im Repo.
- Automatischer Alt↔Neu-Vergleich: identischer sichtbarer Inhalt, nur CSS/JS
  ausgelagert + Fixes.

## 8. Ausdrücklich NICHT Teil dieses Umbaus

- Kein Redesign, keine Neuentwicklung, keine Framework-Einführung.
- Keine inhaltlichen Umformulierungen, keine neuen Rechtsaussagen.
- Kein Upload/Deploy, keine Änderung von Live-Konfiguration oder Zugangsdaten.
- Das `/api`-Backend wird nicht angefasst (liegt außerhalb dieses Repos).
