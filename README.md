# Nils Webdesign — Website

Statische Marketing-Website (nils.w500.de), erzeugt aus **modularen
PHP-Templates + zentralen Daten** und ausgeliefert als **statisches HTML**
(z. B. Vercel). PHP ist nur Bau-Werkzeug – auf dem Server läuft kein PHP.

## Schnellstart (5 Schritte)

1. **Voraussetzung:** PHP 8.1+ lokal (`php -v`). Keine weiteren Abhängigkeiten,
   kein Composer, kein Node.
2. **Bearbeiten:** Inhalte/SEO/Navigation unter `app/` ändern
   (siehe `MIGRATION_NOTES.md`).
3. **Bauen:** `php app/build.php` – erzeugt die 16 `*.html` im Wurzelverzeichnis.
4. **Prüfen:** Seiten lokal öffnen (z. B. `php -S localhost:8000` und im Browser
   aufrufen). Der Build meldet Warnungen (z. B. fehlende H1).
5. **Ausliefern:** die generierten `*.html` + `assets/` deployen (bei Vercel:
   committen/pushen; `.vercelignore` hält die Bau-Quelle `app/` vom CDN fern).

## Struktur (Kurzfassung)

```
app/                 Bau-Quelle (Templates + Daten + Generator)  — nicht ausgeliefert
  build.php          → php app/build.php  erzeugt alle *.html
  config/            site, nav, footer, pages (Daten)
  views/             layout, partials (head/header/footer), components, fragments
assets/              style.css, app.js, pakete.css               — ausgeliefert & gecacht
*.html               generierte Seiten                            — ausgeliefert
```

## Was wo geändert wird

| Ziel | Datei |
|---|---|
| Navigation | `app/config/nav.php` |
| Footer-Links | `app/config/footer.php` |
| Kontakt/Marke/Defaults | `app/config/site.php` |
| Titel/Description/SEO je Seite | `app/config/pages.php` |
| Seiteninhalt | `app/views/fragments/<slug>.html` |
| Design (CSS) / Verhalten (JS) | `assets/style.css` / `assets/app.js` |

Neue Seite anlegen, Komponenten nutzen, Fehler-Checkliste: **`MIGRATION_NOTES.md`**.
Hintergrund & Entscheidungen: **`REFACTORING_PLAN.md`**, **`REFACTORING_SUMMARY.md`**.

## Hinweise

- Alle bestehenden `*.html`-URLs bleiben erhalten; Formulare nutzen weiterhin
  das separate `/api`-Backend (nicht Teil dieses Repos).
- Rechtsseiten (Impressum, Datenschutz, AGB, Widerruf) sind bewusst `noindex`.
- Nach Änderungen an `assets/` die `ASSET_VERSION` in `app/config/site.php`
  erhöhen (Cache-Busting).
