# REFACTORING_SUMMARY.md

Zusammenfassung des Umbaus der statischen Website **Nils Webdesign**
(nils.w500.de) in eine modulare, wartbare Struktur. Details zum Vorgehen:
`REFACTORING_PLAN.md`. Pflege künftig: `MIGRATION_NOTES.md`.

## Ergebnis in einem Satz

Aus 16 einzeln gepflegten HTML-Seiten mit je ~55 KB **16-fach dupliziertem**
Inline-CSS/JS wurde ein **datengetriebenes Template-System**, das dieselben
16 statischen Seiten erzeugt – gleiche Optik, gleiche URLs, gleiche SEO-Daten,
aber zentrale Pflege und deutlich schlankere Seiten.

## Was sich sichtbar NICHT geändert hat

- **Design/Layout:** identisch (CSS unverändert, nur ausgelagert).
- **Inhalte & Texte:** wörtlich übernommen (per Skript verifiziert).
- **URLs:** alle `*.html` bleiben 1:1 erhalten.
- **SEO:** `<title>`, Description, Canonical, Robots, Open Graph, Twitter,
  JSON-LD – pro Seite identisch (semantisch geprüft, alle 16 Seiten).
- **Formulare:** rufen weiterhin `fetch('/api/…')` auf (Backend nicht berührt).
- **Cookie-Banner, mobile Navigation, FAQ-Akkordeon, Lumi-Assistent:** unverändert
  (JS 1:1 ausgelagert).

## Was besser wurde

| Vorher | Nachher |
|---|---|
| CSS ~55 KB **inline auf jeder** der 16 Seiten | **1×** `assets/style.css` (extern, browserseitig gecacht) |
| Gemeinsames JS inline auf jeder Seite | **1×** `assets/app.js` (`defer`) |
| Header/Footer/Nav/Meta/JSON-LD auf jeder Seite kopiert | **je 1 zentrale Quelle** (Partial + Datendatei) |
| Seitengröße z. B. `index.html` **153 KB** | **~36 KB** (−76 %) |
| Neue Seite = 1.700 Zeilen kopieren & anpassen | 1 Eintrag in `pages.php` + 1 Fragment |
| gemischte Zeilenenden (CRLF/LF) | einheitlich LF |
| `pakete.html` **ohne `<h1>`** (SEO-Fehler) | genau **eine `<h1>`** (Optik unverändert) |
| relative Font-Pfade (brächen beim Auslagern) | absolute Pfade `/assets/fonts/…` |

## Behobene Fehler ("Passungs-/Logikfehler")

1. **Fehlende H1 auf `pakete.html`** → `<h2 class="pricing-title">` zu
   `<h1 class="pricing-title">` gemacht. Da per CSS-Klasse gestylt: **optisch
   identisch**, aber SEO-konform (jede Seite genau eine H1).
2. **Uneinheitliche Zeilenenden** (CRLF in leistungen/pakete/seo) → alles LF.
3. **Relative `url('assets/fonts/…')`** im CSS → beim Auslagern nach
   `/assets/style.css` auf absolute Pfade `/assets/fonts/…` korrigiert (hätten
   sonst zu `/assets/assets/fonts/…` aufgelöst und die Schriften gebrochen).

## Bilder asynchron

Die Website enthält **keine Rasterbilder** (`<img>`), sondern nur Inline-SVG,
CSS-Verläufe und lokale Schriften (Letztere werden bereits **nach Einwilligung**
per JS geladen). Für künftige Bilder gibt es die Komponente
`app/views/components/image.php`, die Bilder **standardmäßig asynchron** ausgibt
(`loading="lazy"` + `decoding="async"`, mit `width/height` gegen Layout-Sprünge;
`eager`-Option für Hero-Bilder). So sind neue Bilder automatisch performant.

## Auslieferung / Hosting

Unverändert **statisches HTML auf Vercel**. PHP ist nur **Bau-Werkzeug**:
`php app/build.php` erzeugt die fertigen `*.html`. `.vercelignore` hält die
Bau-Quelle (`app/`) vom CDN fern. Läuft dadurch auf **jedem** Hosting.

## Verifikation

- `php -l` für alle PHP-Dateien: fehlerfrei.
- Build erzeugt 16 Seiten, **0 Warnungen**, jede Seite genau **eine `<h1>`**.
- **Semantischer Alt↔Neu-Vergleich** aller 16 Seiten: Titel, Description,
  Canonical, Robots, OG, Twitter, JSON-LD (geparst), `<main>`-Inhalt, Header und
  Footer **identisch** – einzige Abweichungen: ausgelagertes CSS/JS + H1-Fix.
- Interne Links: alle 16 Ziele existieren. Sitemap: alle 12 URLs gültig
  (noindex-Rechtsseiten korrekt nicht enthalten). Keine Secrets im Repo.
- Alle 16 erzeugten Seiten parsen fehlerfrei (DOMDocument).

## Geänderte / neue Dateien

**Ausgeliefert (generiert bzw. neu):**
- `index.html`, `webdesign.html`, `webdesign-dresden.html`, `seo.html`,
  `local-seo.html`, `ki-suche-geo.html`, `hosting.html`, `leistungen.html`,
  `pakete.html`, `portfolio.html`, `ueber-uns.html`, `kontakt.html`,
  `impressum.html`, `datenschutz.html`, `agb.html`, `widerruf.html`
  – neu **generiert** (schlank, externes CSS/JS).
- `assets/style.css` – gemeinsames CSS (ausgelagert).
- `assets/app.js` – gemeinsames JS (ausgelagert).
- `assets/pakete.css` – seitenspezifische Preistabellen-Styles.
- `.vercelignore` – hält `app/` vom Deploy fern.

**Bau-Quelle (neu, nur zur Bauzeit):**
- `app/build.php` – Generator.
- `app/lib/template.php` – Helfer (`e`, `asset`, `render`, `component`, JSON-LD-Helfer).
- `app/config/site.php` `nav.php` `footer.php` `pages.php` `org.jsonld` – Daten.
- `app/views/layout.php` – Seiten-Gerüst.
- `app/views/partials/head.php` `header.php` `footer.php` – zentrale Bereiche.
- `app/views/components/hero.php` `cta-band.php` `faq.php` `breadcrumb.php` `image.php`.
- `app/views/fragments/<slug>.html` – der individuelle `<main>`-Inhalt je Seite (16×).

**Dokumentation (neu):**
- `REFACTORING_PLAN.md`, `REFACTORING_SUMMARY.md`, `MIGRATION_NOTES.md`, `README.md` (aktualisiert).

**Unverändert:** `favicon.svg`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `vercel.json`.
