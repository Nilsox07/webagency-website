<?php
/**
 * Minimale Template-Helfer – kein Framework, reines PHP.
 */

/** HTML-escape (Attribut- und Textkontext). */
function e(?string $s): string {
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/** Asset-URL mit Cache-Busting-Version (?v=ASSET_VERSION). */
function asset(string $path): string {
    $v = defined('ASSET_VERSION') ? ASSET_VERSION : '1';
    $sep = strpos($path, '?') !== false ? '&' : '?';
    return $path . $sep . 'v=' . rawurlencode($v);
}

/**
 * Rendert eine View-Datei mit übergebenen Variablen und gibt HTML zurück.
 * Variablen stehen in der View als lokale Variablen zur Verfügung.
 */
function render(string $__file, array $__vars = []): string {
    if (!is_file($__file)) {
        throw new RuntimeException("View nicht gefunden: {$__file}");
    }
    extract($__vars, EXTR_SKIP);
    ob_start();
    include $__file;
    return ob_get_clean();
}

/** Rendert eine wiederverwendbare Komponente aus views/components/. */
function component(string $name, array $vars = []): string {
    return render(dirname(__DIR__) . '/views/components/' . $name . '.php', $vars);
}

/**
 * Baut aus FAQ-Items ([['q'=>…,'a'=>…], …]) einen FAQPage-JSON-LD-Rohstring.
 * So entstehen sichtbare FAQ (component('faq')) und strukturierte Daten aus EINER Quelle.
 */
function faq_jsonld(array $items): string {
    $main = [];
    foreach ($items as $it) {
        $main[] = [
            '@type' => 'Question',
            'name'  => $it['q'],
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $it['a']],
        ];
    }
    return json_encode(
        ['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $main],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
}

/** Baut aus Breadcrumb-Items einen BreadcrumbList-JSON-LD-Rohstring. */
function breadcrumb_jsonld(array $items): string {
    $list = [];
    foreach ($items as $i => $it) {
        $entry = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $it['label']];
        if (!empty($it['href'])) {
            $entry['item'] = $it['href'];
        }
        $list[] = $entry;
    }
    return json_encode(
        ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => $list],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
}
