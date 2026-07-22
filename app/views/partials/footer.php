<?php
/**
 * Footer. Erwartet: $footer (config/footer.php), $site, $footer_about (Text).
 */
$c = $site['contact'];
?>
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-about">
                    <div class="logo"><?= e(BRAND) ?><span class="dot">.</span></div>
                    <p><?= e($footer_about) ?></p>
                </div>
<?php foreach ($footer['columns'] as $col): ?>
                <div class="footer-col">
                    <h4><?= e($col['title']) ?></h4>
                    <ul>
<?php foreach ($col['links'] as $l): ?>
                        <li><a href="<?= e($l['href']) ?>"><?= e($l['label']) ?></a></li>
<?php endforeach; ?>
                    </ul>
                </div>
<?php endforeach; ?>
                <div class="footer-col footer-contact">
                    <h4>Kontakt</h4>
                    <ul>
                        <li>
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <a href="mailto:<?= e($c['email']) ?>"><?= e($c['email']) ?></a>
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            <a href="tel:<?= e($c['phone_href']) ?>"><?= e($c['phone_text']) ?></a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <span>© <span data-year><?= date('Y') ?></span> <?= e(BRAND) ?>. Alle Rechte vorbehalten.</span>
                <span><?php
                    $legal = [];
                    foreach ($footer['legal'] as $l) {
                        $legal[] = '<a href="' . e($l['href']) . '">' . e($l['label']) . '</a>';
                    }
                    echo implode(' &nbsp;·&nbsp; ', $legal);
                ?></span>
            </div>
        </div>
    </footer>
