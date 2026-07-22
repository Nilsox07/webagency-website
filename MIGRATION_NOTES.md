# MIGRATION_NOTES.md — Pflege der Website

Praktische Anleitung für den Alltag: Wie die Seite künftig gepflegt wird, ohne
Design, URLs oder SEO zu gefährden. Für den Hintergrund siehe `REFACTORING_PLAN.md`
und `REFACTORING_SUMMARY.md`.

---

## 0. Das Wichtigste in 3 Sätzen

1. Du bearbeitest **Templates + Daten** unter `app/`, nicht mehr die 16 `*.html` direkt.
2. Danach einmal **`php app/build.php`** ausführen – das erzeugt die fertigen
   `*.html` neu.
3. Die erzeugten `*.html` + `assets/` werden wie bisher (statisch, z. B. Vercel)
   ausgeliefert.

> Kein PHP zur Hand? Dann können die generierten `*.html` notfalls auch direkt
> bearbeitet werden – beim nächsten `build.php`-Lauf würde das aber überschrieben.
> Der saubere Weg ist immer über `app/`.

## 1. Projektstruktur

```
app/
  build.php              → erzeugt die *.html (Generator)
  lib/template.php       → Helfer: e(), asset(), render(), component(), *_jsonld()
  config/
    site.php             → Marke, Domain, Kontakt, Asset-Version, Standard-Meta
    nav.php              → Hauptnavigation (Header)
    footer.php           → Footer-Spalten + rechtliche Links
    pages.php            → Seiten-Register: Meta/SEO je Seite
    org.jsonld           → gemeinsamer Organization/LocalBusiness-JSON-LD
  views/
    layout.php           → HTML-Gerüst (Head, Header, Main, Footer, Script)
    partials/            → head.php, header.php, footer.php (zentrale Bereiche)
    components/          → hero, cta-band, faq, breadcrumb, image
    fragments/<slug>.html→ der individuelle Seiteninhalt (<main>) je Seite
assets/style.css app.js pakete.css   → ausgeliefert, gecacht
*.html                               → GENERIERT (nicht direkt pflegen)
```

## 2. Häufige Aufgaben

### a) Text/Preis/Menü an EINER Stelle ändern
- **Navigation** (Header): `app/config/nav.php`
- **Footer-Links / Rechtliches**: `app/config/footer.php`
- **Kontaktdaten, Marke, Standard-OG-Bild**: `app/config/site.php`
- **Footer-Beschreibungstext** (global): `site.php → default_footer_about`
  (einzelne Seite abweichend: `footer_about` in `pages.php`)

Danach `php app/build.php`. Die Änderung erscheint automatisch auf **allen** Seiten.

### b) SEO einer Seite anpassen (Title, Description, Canonical, OG …)
Alles in `app/config/pages.php` beim jeweiligen Slug. OG/Twitter werden aus
Title/Description **abgeleitet**; nur echte Abweichungen als `og`/`twitter`
eintragen. `robots => 'noindex'` z. B. bei Rechtsseiten.

### c) Inhalt einer bestehenden Seite ändern
Den `<main>`-Inhalt im passenden `app/views/fragments/<slug>.html` bearbeiten,
dann bauen. (Header/Footer/Head kommen automatisch dazu.)

### d) CSS/JS ändern
`assets/style.css` bzw. `assets/app.js` bearbeiten. **Wichtig:** danach in
`app/config/site.php` die `ASSET_VERSION` erhöhen (Cache-Busting), dann bauen.

### e) NEUE Inhaltsseite anlegen
1. `app/views/fragments/meine-seite.html` anlegen (nur der `<main>`-Inhalt,
   ohne `<header>`/`<footer>`).
2. In `app/config/pages.php` einen Eintrag ergänzen:
   ```php
   'meine-seite' => [
       'title'       => 'Titel | Nils Webdesign',
       'description' => 'Kurzbeschreibung für Google.',
       'canonical'   => 'https://nils.w500.de/meine-seite',
       'active'      => 'leistungen.html', // optional: aktiver Menüpunkt
   ],
   ```
3. `php app/build.php` → `meine-seite.html` entsteht.
4. Bei indexierbaren Seiten die URL in `sitemap.xml` ergänzen.

### f) NEUE Leistungs-/Branchenseite datengetrieben (mit Komponenten)
Statt statischem `.html`-Fragment ein **`.php`-Fragment** anlegen
(`app/views/fragments/<slug>.php`). Es hat Zugriff auf `component()` und die
JSON-LD-Helfer. Beispiel `app/views/fragments/beispiel.php`:
```php
<?php $crumbs = [
    ['label' => 'Start', 'href' => 'index.html'],
    ['label' => 'Leistungen', 'href' => 'leistungen.html'],
    ['label' => 'Beispiel'],
]; ?>
<?= component('hero', [
    'breadcrumb' => $crumbs,
    'eyebrow'    => 'Neue Leistung',
    'title'      => 'Überschrift,<br>die wirkt.',
    'lead'       => 'Einleitung …',
    'actions'    => [['href' => 'pakete.html', 'label' => 'Paket wählen', 'primary' => true]],
]) ?>
<?= component('faq', ['items' => [
    ['q' => 'Frage 1?', 'a' => 'Antwort 1.'],
    ['q' => 'Frage 2?', 'a' => 'Antwort 2.'],
]]) ?>
<?= component('cta-band', [
    'heading' => 'Bereit?', 'text' => 'Kurzer Schlusssatz.',
    'cta' => ['href' => 'pakete.html', 'label' => 'Jetzt starten'],
]) ?>
```
Passende strukturierte Daten in `pages.php` erzeugen die Helfer – aus **derselben**
Datenquelle:
```php
// oben in pages.php nutzbar, z. B.:
'jsonld' => ['ORG', breadcrumb_jsonld($crumbs), faq_jsonld($faqItems)],
```
> `.php`-Fragmente haben Vorrang vor gleichnamigen `.html`-Fragmenten. Bestehende
> Seiten bleiben als `.html`-Fragmente unverändert.

## 3. Verfügbare Komponenten (`component('name', [...])`)

| Name | Zweck | Wichtige Felder |
|---|---|---|
| `hero` | Seitenkopf mit H1 | `breadcrumb`, `eyebrow`, `title` (HTML), `lead`, `actions` |
| `breadcrumb` | Brotkrumen-Pfad | `items` (letztes ohne `href`) |
| `faq` | FAQ-Akkordeon | `items` (`q`,`a`) |
| `cta-band` | Abschluss-CTA | `heading`, `text`, `cta` (`href`,`label`) |
| `image` | **asynchrones** Bild | `src`, `alt`, `width`, `height`, `eager?` |

Weitere Komponenten (z. B. Preisbox, Branchenkarte) werden bei Bedarf nach dem
gleichen Muster in `app/views/components/` ergänzt. Es wurden bewusst nur die
Komponenten angelegt, die es auf dieser Website tatsächlich gibt.

## 4. Wichtige Regeln (damit nichts bricht)

- **`*.html` nie von Hand als Quelle pflegen** – sie werden überschrieben.
- **Formular-Endpunkte** (`fetch('/api/…')`) und die Lumi-Logik stecken in
  `assets/app.js` – nicht ohne Grund anfassen.
- **Canonical & robots** bewusst setzen; Rechtsseiten bleiben `noindex`.
- **Genau eine `<h1>` pro Seite** (der Build warnt, wenn nicht).
- Nach Asset-Änderungen **`ASSET_VERSION` erhöhen**.
- Keine Zugangsdaten/Secrets ins Repo.

## 5. Offene Punkte / Empfehlungen (kein Blocker)

- `assets/fonts/*.woff2` und `assets/og-image.svg` werden referenziert, liegen
  aber **nicht im Repo** (aktuell System-Font-Fallback bzw. 404 nur für
  Social-Scraper). Empfehlung: die Font-Dateien und ein OG-Bild unter `assets/`
  ablegen. Die `@font-face`-Regeln sind bereits korrekt auf `/assets/fonts/…`.
- In `sitemap.xml` bei neuen indexierbaren Seiten den `<loc>`-Eintrag ergänzen.
- JSON-LD-Platzhalter in `app/config/org.jsonld` (Telefon `[+49 …]`, Adresse
  `[Straße]`, Social-`sameAs`) bei Gelegenheit mit echten Daten füllen –
  gilt dann zentral für alle Seiten.
