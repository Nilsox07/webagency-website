<?php
/**
 * Hauptnavigation (eine Quelle für Header + aktive Markierung).
 * 'href'   = Ziel (bestehende .html-URLs bleiben erhalten)
 * 'key'    = Wert, gegen den pages.php['active'] geprüft wird
 * children = Dropdown-Einträge (nur "Leistungen")
 *
 * Neuen Menüpunkt hinzufügen = hier einen Eintrag ergänzen.
 */
return [
    ['label' => 'Start',      'href' => 'index.html',      'key' => 'index.html'],
    ['label' => 'Leistungen', 'href' => 'leistungen.html', 'key' => 'leistungen.html', 'children' => [
        ['label' => 'Webdesign',         'href' => 'webdesign.html'],
        ['label' => 'Hosting & Wartung', 'href' => 'hosting.html'],
        ['label' => 'SEO Optimierung',   'href' => 'seo.html'],
        ['label' => 'Lokales SEO',       'href' => 'local-seo.html'],
        ['label' => 'KI-Suche (GEO)',    'href' => 'ki-suche-geo.html'],
    ]],
    ['label' => 'Pakete',    'href' => 'pakete.html',    'key' => 'pakete.html'],
    ['label' => 'Portfolio', 'href' => 'portfolio.html', 'key' => 'portfolio.html'],
    ['label' => 'Über uns',  'href' => 'ueber-uns.html', 'key' => 'ueber-uns.html'],
];
