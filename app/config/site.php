<?php
/**
 * Globale Seiten-Konfiguration (eine Quelle der Wahrheit).
 * Wird vom Build geladen und an alle Templates übergeben.
 *
 * Preise, Modul-/Leistungsnamen, Kontaktdaten, Standard-Meta usw. NUR hier
 * bzw. in nav.php / footer.php / pages.php pflegen – nicht in einzelnen Seiten.
 */

// Konstanten, die auch die Helfer (asset(), url) nutzen:
define('BASE_URL', 'https://nils.w500.de');
define('BRAND', 'Nils Webdesign');
// Version für Cache-Busting von CSS/JS. Nach jeder Änderung an assets/ erhöhen:
define('ASSET_VERSION', '2026-07-22');

return [
    'brand'        => BRAND,
    'base_url'     => BASE_URL,
    'lang'         => 'de',
    'theme_color'  => '#0B2545',
    'default_robots' => 'index, follow, max-image-preview:large, max-snippet:-1',

    // Open-Graph / Twitter-Defaults. Pro Seite in pages.php überschreibbar.
    'og_defaults' => [
        'type'      => 'website',
        'site_name' => BRAND,
        'locale'    => 'de_DE',
        'image'     => BASE_URL . '/assets/og-image.svg',
    ],
    'twitter_defaults' => [
        'card'  => 'summary_large_image',
        'image' => BASE_URL . '/assets/og-image.svg',
    ],

    // Footer-Standardtext (einzelne Seiten können ihn in pages.php überschreiben).
    'default_footer_about' => 'Hochwertige Websites für Unternehmen, Start-ups und private Projekte – persönlich betreut, ehrlich beraten, technisch makellos.',

    // Header-CTA-Standard (pakete.html überschreibt href auf #pakete).
    'cta' => ['href' => 'pakete.html', 'label' => 'Jetzt buchen'],

    // Kontaktdaten (Footer). Zentrale Pflege.
    'contact' => [
        'email'      => 'hallo@nils-webdesign.de',
        'phone_text' => '+49 (0) 000 000 000',
        'phone_href' => '+490000000000',
    ],

    // Wiederkehrender Organization/LocalBusiness-JSON-LD (auf allen Marketing-Seiten).
    'org_jsonld' => trim(file_get_contents(__DIR__ . '/org.jsonld')),
];
