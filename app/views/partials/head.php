<?php
/**
 * <head>-Inhalt. Erwartet $site und ein aufgelöstes $page:
 *   title, description, canonical, robots, theme, og(array|null),
 *   twitter(array|null), jsonld(array raw), extra_css(array).
 */
?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($page['title']) ?></title>
    <meta name="description" content="<?= e($page['description']) ?>">
    <link rel="canonical" href="<?= e($page['canonical']) ?>">
    <meta name="robots" content="<?= e($page['robots']) ?>">
    <meta name="theme-color" content="<?= e($page['theme']) ?>">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <link rel="manifest" href="/site.webmanifest">
<?php if (!empty($page['og'])): foreach ($page['og'] as $prop => $val): ?>
    <meta property="og:<?= e($prop) ?>" content="<?= e($val) ?>">
<?php endforeach; endif; ?>
<?php if (!empty($page['twitter'])): foreach ($page['twitter'] as $name => $val): ?>
    <meta name="twitter:<?= e($name) ?>" content="<?= e($val) ?>">
<?php endforeach; endif; ?>
    <!-- Schriften werden lokal ausgeliefert (assets/fonts/) – kein externer Font-Request -->
    <link rel="stylesheet" href="<?= e(asset('/assets/style.css')) ?>">
<?php foreach ($page['extra_css'] as $href): ?>
    <link rel="stylesheet" href="<?= e(asset($href)) ?>">
<?php endforeach; ?>
<?php foreach ($page['jsonld'] as $block): ?>
    <script type="application/ld+json"><?= $block ?></script>
<?php endforeach; ?>
