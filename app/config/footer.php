<?php
/**
 * Footer-Struktur (Link-Spalten + Rechtliches). Zentrale Pflege.
 * Die Kontaktspalte (E-Mail/Telefon inkl. Icons) rendert footer.php aus site['contact'].
 */
return [
    'columns' => [
        ['title' => 'Seiten', 'links' => [
            ['label' => 'Leistungen', 'href' => 'leistungen.html'],
            ['label' => 'Pakete',     'href' => 'pakete.html'],
            ['label' => 'Portfolio',  'href' => 'portfolio.html'],
            ['label' => 'Über uns',   'href' => 'ueber-uns.html'],
            ['label' => 'Kontakt',    'href' => 'kontakt.html'],
        ]],
    ],
    // Untere Leiste – rechtliche Links
    'legal' => [
        ['label' => 'Impressum',   'href' => 'impressum.html'],
        ['label' => 'Datenschutz', 'href' => 'datenschutz.html'],
        ['label' => 'AGB',         'href' => 'agb.html'],
        ['label' => 'Widerruf',    'href' => 'widerruf.html'],
    ],
];
