<?php
/**
 * ProteinScan? Nein – Nils-Webdesign Static-Site-Build.
 *
 * Erzeugt aus Templates + Daten die fertigen statischen *.html-Seiten.
 * Aufruf:  php app/build.php            (schreibt ins Projekt-Wurzelverzeichnis)
 *          php app/build.php /tmp/out   (schreibt in ein Zielverzeichnis, z. B. zum Testen)
 *
 * Es werden NUR die im Seiten-Register (config/pages.php) gelisteten *.html
 * geschrieben. Andere Dateien (assets, favicon, sitemap, …) bleibt unangetastet.
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

$APP  = __DIR__;
$ROOT = dirname(__DIR__);
$OUT  = $argv[1] ?? $ROOT;

require $APP . '/lib/template.php';
$site   = require $APP . '/config/site.php';
$nav    = require $APP . '/config/nav.php';
$footer = require $APP . '/config/footer.php';
$pages  = require $APP . '/config/pages.php';

if (!is_dir($OUT) && !mkdir($OUT, 0777, true)) {
    fwrite(STDERR, "Kann Zielverzeichnis nicht anlegen: $OUT\n");
    exit(1);
}

/** OG/Twitter in fester Reihenfolge auflösen (Overrides auf Defaults). */
function resolve_og(array $p, string $canonical, string $title, string $desc, array $site): ?array {
    if (array_key_exists('og', $p) && $p['og'] === false) return null;
    $ov = (isset($p['og']) && is_array($p['og'])) ? $p['og'] : [];
    $d  = $site['og_defaults'];
    return [
        'type'        => $ov['type']        ?? $d['type'],
        'site_name'   => $ov['site_name']   ?? $d['site_name'],
        'locale'      => $ov['locale']      ?? $d['locale'],
        'url'         => $ov['url']         ?? $canonical,
        'title'       => $ov['title']       ?? $title,
        'description' => $ov['description'] ?? $desc,
        'image'       => $ov['image']       ?? $d['image'],
    ];
}
function resolve_twitter(array $p, string $title, string $desc, array $site): ?array {
    if (array_key_exists('twitter', $p) && $p['twitter'] === false) return null;
    $ov = (isset($p['twitter']) && is_array($p['twitter'])) ? $p['twitter'] : [];
    $d  = $site['twitter_defaults'];
    return [
        'card'        => $ov['card']        ?? $d['card'],
        'title'       => $ov['title']       ?? $title,
        'description' => $ov['description'] ?? $desc,
        'image'       => $ov['image']       ?? $d['image'],
    ];
}

$count = 0; $warnings = [];
foreach ($pages as $slug => $p) {
    // Fragment: bevorzugt <slug>.php (mit Komponenten), sonst <slug>.html (verbatim).
    $fragmentSlug = $p['fragment'] ?? $slug;
    $fragPhp  = $APP . '/views/fragments/' . $fragmentSlug . '.php';
    $fragHtml = $APP . '/views/fragments/' . $fragmentSlug . '.html';
    if (is_file($fragPhp)) {
        $body = rtrim(render($fragPhp, ['site' => $site, 'nav' => $nav, 'page' => $p]), "\n");
    } elseif (is_file($fragHtml)) {
        $body = rtrim(file_get_contents($fragHtml), "\n");
    } else {
        $warnings[] = "FEHLT: Fragment für '$slug' ($fragHtml)";
        continue;
    }

    $canonical = $p['canonical'];
    $title = $p['title'];
    $desc  = $p['description'];

    // JSON-LD-Tokens auflösen ('ORG' -> gemeinsamer Block)
    $jsonld = [];
    foreach (($p['jsonld'] ?? []) as $t) {
        $jsonld[] = ($t === 'ORG') ? $site['org_jsonld'] : $t;
    }

    $resolvedPage = [
        'title'       => $title,
        'description' => $desc,
        'canonical'   => $canonical,
        'robots'      => $p['robots'] ?? $site['default_robots'],
        'theme'       => $site['theme_color'],
        'og'          => resolve_og($p, $canonical, $title, $desc, $site),
        'twitter'     => resolve_twitter($p, $title, $desc, $site),
        'jsonld'      => $jsonld,
        'extra_css'   => $p['extra_css'] ?? [],
    ];

    $head   = render($APP . '/views/partials/head.php',   ['site' => $site, 'page' => $resolvedPage]);
    $header = render($APP . '/views/partials/header.php', ['nav' => $nav, 'active' => $p['active'] ?? null, 'cta' => $p['cta'] ?? $site['cta']]);
    $foot   = render($APP . '/views/partials/footer.php', ['footer' => $footer, 'site' => $site, 'footer_about' => $p['footer_about'] ?? $site['default_footer_about']]);
    $html   = render($APP . '/views/layout.php', ['site' => $site, 'head' => $head, 'header' => $header, 'body' => $body, 'footer' => $foot]);

    // QA: genau eine <h1>
    $h1 = preg_match_all('#<h1[\s>]#', $html);
    if ($h1 !== 1) $warnings[] = "H1-Anzahl auf '$slug' = $h1 (erwartet 1)";

    file_put_contents($OUT . '/' . $slug . '.html', $html);
    $count++;
    printf("  ✓ %-22s → %s.html (%d KB, %d JSON-LD, H1=%d)\n", $slug, $slug, round(strlen($html)/1024), count($jsonld), $h1);
}

echo "\n$count Seiten nach $OUT geschrieben.\n";
if ($warnings) { echo "\nWARNUNGEN:\n - " . implode("\n - ", $warnings) . "\n"; exit(2); }
echo "Keine Warnungen.\n";
