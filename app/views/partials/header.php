<?php
/**
 * Header + Hauptnavigation. Erwartet:
 *   $nav (config/nav.php), $active (aktiver href oder null), $cta ['href','label'].
 */
?>
    <header class="header" id="header">
        <div class="container header-inner">
            <a href="index.html" class="logo"><?= e(BRAND) ?><span class="dot">.</span></a>
            <nav class="nav" id="nav">
                <ul class="nav-links">
<?php foreach ($nav as $item): ?>
<?php $isActive = ($active !== null && $item['href'] === $active); ?>
<?php if (!empty($item['children'])): ?>
                    <li class="has-dropdown">
                        <a href="<?= e($item['href']) ?>"<?= $isActive ? ' class="active"' : '' ?>><?= e($item['label']) ?></a>
                        <div class="dropdown">
<?php foreach ($item['children'] as $child): ?>
                            <a href="<?= e($child['href']) ?>"><?= e($child['label']) ?></a>
<?php endforeach; ?>
                        </div>
                    </li>
<?php else: ?>
                    <li><a href="<?= e($item['href']) ?>"<?= $isActive ? ' class="active"' : '' ?>><?= e($item['label']) ?></a></li>
<?php endif; ?>
<?php endforeach; ?>
                </ul>
                <a href="<?= e($cta['href']) ?>" class="btn btn-primary"><?= e($cta['label']) ?></a>
            </nav>
            <button class="nav-toggle" id="navToggle" aria-label="Menü öffnen" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
        </div>
    </header>
