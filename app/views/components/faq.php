<?php
/**
 * FAQ-Block (Akkordeon; Auf-/Zuklappen via assets/app.js).
 * Aufruf:  echo component('faq', ['items' => [
 *              ['q' => 'Frage?', 'a' => 'Antwort.'],
 *              ...
 *          ]]);
 *
 * Tipp: Dieselben $items koennen mit faq_jsonld($items) (lib/template.php)
 * in einen FAQPage-JSON-LD-Block verwandelt und in pages.php eingetragen werden –
 * so bleiben sichtbare FAQ und strukturierte Daten aus EINER Quelle.
 */
$items = $items ?? [];
?>
        <div class="reveal">
<?php foreach ($items as $item): ?>
            <div class="faq-item">
                <button class="faq-q"><?= e($item['q']) ?>
                    <svg class="plus" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <div class="faq-a"><div class="faq-a-inner"><?= e($item['a']) ?></div></div>
            </div>
<?php endforeach; ?>
        </div>
