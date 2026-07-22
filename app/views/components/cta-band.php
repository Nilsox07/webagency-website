<?php
/**
 * CTA-Leiste (Abschluss-Call-to-Action). Auf vielen Seiten wiederkehrend.
 * Aufruf:  echo component('cta-band', [
 *              'heading' => 'Bereit für Ihre neue Website?',
 *              'text'    => '…',
 *              'cta'     => ['href' => 'pakete.html', 'label' => 'Paket wählen'],
 *          ]);
 */
$heading = $heading ?? '';
$text    = $text ?? '';
$cta     = $cta ?? ['href' => 'pakete.html', 'label' => 'Jetzt buchen'];
?>
        <section class="section" style="padding-top: 0;">
            <div class="container">
                <div class="cta-band reveal">
                    <h2><?= e($heading) ?></h2>
                    <p><?= e($text) ?></p>
                    <a href="<?= e($cta['href']) ?>" class="btn btn-light"><?= e($cta['label']) ?></a>
                </div>
            </div>
        </section>
