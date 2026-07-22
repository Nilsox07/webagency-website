<?php
/**
 * Seiten-Hero (Kopfbereich einer Unterseite) mit der H1 der Seite.
 * Aufruf:  echo component('hero', [
 *              'breadcrumb' => [ ['label'=>'Start','href'=>'index.html'], ['label'=>'Webdesign'] ],
 *              'eyebrow'    => 'Webdesign Agentur',
 *              'title'      => 'Corporate Webdesign,<br>das Eindruck macht.', // darf <br> enthalten
 *              'lead'       => 'Einleitungstext …',
 *              'actions'    => [ ['href'=>'pakete.html','label'=>'Paket auswählen','primary'=>true] ],
 *          ]);
 * Hinweis: 'title' wird als HTML ausgegeben (fuer <br>) – nur vertrauenswuerdigen
 * Text uebergeben. Alle anderen Felder werden escaped.
 */
$breadcrumb = $breadcrumb ?? null;
$eyebrow    = $eyebrow ?? null;
$title      = $title ?? '';
$lead       = $lead ?? null;
$actions    = $actions ?? [];
?>
        <section class="page-hero">
            <div class="container">
<?php if ($breadcrumb): ?>
<?= component('breadcrumb', ['items' => $breadcrumb]) ?>
<?php endif; ?>
<?php if ($eyebrow !== null): ?>
                <span class="eyebrow reveal"><?= e($eyebrow) ?></span>
<?php endif; ?>
                <h1 class="reveal"><?= $title ?></h1>
<?php if ($lead !== null): ?>
                <p class="lead reveal"><?= e($lead) ?></p>
<?php endif; ?>
<?php if ($actions): ?>
                <div class="hero-actions reveal" style="justify-content:center;margin-top:32px;">
<?php foreach ($actions as $a): $primary = !empty($a['primary']); ?>
                    <a href="<?= e($a['href']) ?>" class="btn <?= $primary ? 'btn-primary' : 'btn-light' ?>"><?= e($a['label']) ?><?php if ($primary): ?>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    <?php endif; ?></a>
<?php endforeach; ?>
                </div>
<?php endif; ?>
            </div>
        </section>
