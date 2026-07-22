<?php
/**
 * Breadcrumb-Pfad. Letztes Element ohne href = aktuelle Seite.
 * Aufruf:  echo component('breadcrumb', ['items' => [
 *              ['label' => 'Start',      'href' => 'index.html'],
 *              ['label' => 'Leistungen', 'href' => 'leistungen.html'],
 *              ['label' => 'Webdesign'],  // aktuell, ohne href
 *          ]]);
 *
 * Passender BreadcrumbList-JSON-LD: breadcrumb_jsonld($items) (lib/template.php).
 */
$items = $items ?? [];
$parts = [];
foreach ($items as $it) {
    $parts[] = !empty($it['href'])
        ? '<a href="' . e($it['href']) . '">' . e($it['label']) . '</a>'
        : e($it['label']);
}
?>
                <div class="breadcrumb reveal"><?= implode('<span>/</span>', $parts) ?></div>
