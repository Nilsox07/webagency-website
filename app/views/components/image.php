<?php
/**
 * Bild-Komponente – laedt Bilder standardmaessig ASYNCHRON.
 *
 * Diese Website nutzt aktuell KEINE Rasterbilder (nur Inline-SVG, CSS-Verläufe
 * und lokale Schriften). Diese Komponente stellt sicher, dass JEDES kuenftig
 * eingefuegte Bild automatisch performant geladen wird:
 *   - loading="lazy"   → laedt erst kurz vor Sichtbarkeit (spart Ladezeit)
 *   - decoding="async" → blockiert das Rendern nicht
 *   - width/height     → reserviert Platz, verhindert Layout-Sprünge (CLS)
 *
 * Fuer ein Bild "above the fold" (z. B. großes Hero-Bild) 'eager' => true setzen –
 * dann wird es priorisiert geladen (loading="eager", fetchpriority="high").
 *
 * Aufruf:  echo component('image', [
 *              'src' => '/assets/img/team.jpg', 'alt' => 'Unser Team',
 *              'width' => 1200, 'height' => 800,
 *          ]);
 */
$src    = $src ?? '';
$alt    = $alt ?? '';
$width  = $width ?? null;
$height = $height ?? null;
$class  = $class ?? null;
$eager  = !empty($eager);

$attrs = 'src="' . e($src) . '" alt="' . e($alt) . '"';
if ($width)  $attrs .= ' width="' . (int) $width . '"';
if ($height) $attrs .= ' height="' . (int) $height . '"';
if ($class)  $attrs .= ' class="' . e($class) . '"';
$attrs .= $eager
    ? ' loading="eager" fetchpriority="high" decoding="async"'
    : ' loading="lazy" decoding="async"';
?>
<img <?= $attrs ?>>
