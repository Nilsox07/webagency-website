<?php
/**
 * Gesamt-Layout einer Frontend-Seite.
 * Erwartet: $site, $head, $header, $body, $footer (bereits gerenderte HTML-Teile).
 */
?><!DOCTYPE html>
<html lang="<?= e($site['lang']) ?>">
<head>
<?= $head ?>
</head>
<body>

<?= $header ?>

    <main><?= $body ?>
    </main>

<?= $footer ?>

    <script src="<?= e(asset('/assets/app.js')) ?>" defer></script>
</body>
</html>
