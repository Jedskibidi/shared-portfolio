<?php

/** @var array $data */
$certs   = $data['certificates'] ?? [];
$issuers = array_values(array_unique(array_filter(array_column($certs, 'issuer'))));
$ticker  = array_values(array_unique(array_filter(array_merge($issuers, array_column($certs, 'title')))));
?>
<section id="certificates" class="certs">
    <div class="cx-orbs" aria-hidden="true"><span></span><span></span><span></span></div>

    <div class="certs-head" data-replay>
        <div>
            <h2>Certificates</h2>
            <p class="certs-count"><b id="certsCount" data-count="<?= count($certs) ?>"><?= count($certs) ?></b> earned</p>
        </div>

        <?php if (count($issuers) > 1): ?>
            <div class="certs-filters" role="group" aria-label="Filter certificates by issuer">
                <button type="button" class="certs-chip is-active" data-filter="all">All</button>
                <?php foreach ($issuers as $issuer): ?>
                    <button type="button" class="certs-chip" data-filter="<?= e($issuer) ?>"><?= e($issuer) ?></button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <?php if (!empty($ticker)): ?>
        <div class="cx-marquee" aria-hidden="true" data-replay="fade">
            <div class="cx-marquee-track">
                <?php for ($h = 0; $h < 2; $h++): ?>
                    <div class="cx-marquee-half">
                        <?php for ($r = 0; $r < 3; $r++): foreach ($ticker as $word): ?>
                                <span><?= e($word) ?></span>
                        <?php endforeach;
                        endfor; ?>
                    </div>
                <?php endfor; ?>
            </div>
        </div>
    <?php endif; ?>

    <div class="cx-stage" id="cxStage" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Certificates">
        <?php foreach ($certs as $n => $cert):
            $images    = array_values(array_filter((array) ($cert['image'] ?? [])));
            $multiple  = count($images) > 1;
            $title     = $cert['title'] ?? '';
            $issuer    = $cert['issuer'] ?? '';
            $date      = $cert['date'] ?? '';
            $link      = trim($cert['link'] ?? '');
            $linkLabel = trim($cert['linkLabel'] ?? '');
        ?>
            <div class="cx-item" data-issuer="<?= e($issuer) ?>">
                <article class="cx-card"
                    data-title="<?= e($title) ?>"
                    data-issuer="<?= e($issuer) ?>"
                    data-date="<?= e($date) ?>"
                    data-images="<?= e(json_encode($images)) ?>">

                    <span class="cx-badge"><?= e($issuer) ?></span>
                    <span class="cx-seal" aria-hidden="true"><i class="fa-solid fa-award"></i></span>

                    <?php if (empty($images)): ?>
                        <div class="cx-media cx-media--empty">No image yet</div>
                    <?php else: ?>
                        <button type="button" class="cx-media" aria-label="View <?= e($title) ?> full size">
                            <img src="<?= e($images[0]) ?>" alt="<?= e($title) ?>" loading="lazy">
                            <span class="cx-glare"></span>
                            <span class="cx-zoom"><i class="fa-solid fa-magnifying-glass-plus"></i> View</span>
                        </button>
                    <?php endif; ?>

                    <div class="cx-body">
                        <span class="cx-index" aria-hidden="true"><?= sprintf('%02d', $n + 1) ?></span>
                        <h3><?= e($title) ?></h3>
                        <p class="cx-meta"><?= e($issuer) ?> &middot; <?= e($date) ?></p>

                        <div class="cx-foot">
                            <?php if ($link !== ''): ?>
                                <a class="cx-link" href="<?= e($link) ?>" target="_blank" rel="noopener noreferrer">
                                    <?php if ($linkLabel === ''): ?><i class="fa-solid fa-circle-check"></i><?php endif; ?>
                                    <?= e($linkLabel !== '' ? $linkLabel : 'Verify') ?>
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            <?php else: ?>
                                <span></span>
                            <?php endif; ?>

                            <?php if ($multiple): ?>
                                <div class="cx-pager">
                                    <button type="button" data-dir="-1" aria-label="Previous image">&larr;</button>
                                    <div class="cx-dots" aria-hidden="true">
                                        <?php foreach ($images as $i => $_): ?><i class="<?= $i === 0 ? 'on' : '' ?>"></i><?php endforeach; ?>
                                    </div>
                                    <button type="button" data-dir="1" aria-label="Next image">&rarr;</button>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </article>
            </div>
        <?php endforeach; ?>
    </div>

    <div class="cx-controls">
        <button type="button" class="cx-arrow" id="cxPrev" aria-label="Previous certificate"><i class="fa-solid fa-arrow-left"></i></button>
        <div class="cx-pips" id="cxPips"></div>
        <button type="button" class="cx-arrow" id="cxNext" aria-label="Next certificate"><i class="fa-solid fa-arrow-right"></i></button>
        <button type="button" class="cx-arrow cx-play" id="cxPlay" aria-label="Pause autoplay"><i class="fa-solid fa-pause"></i></button>
    </div>
    <p class="cx-hint">Drag, swipe or use the arrow keys</p>
</section>

<div class="cx-lb" id="cxLb" role="dialog" aria-modal="true" aria-label="Certificate viewer" aria-hidden="true">
    <button type="button" class="cx-lb-btn cx-lb-close" id="cxLbClose" aria-label="Close">&times;</button>
    <button type="button" class="cx-lb-btn cx-lb-prev" id="cxLbPrev" aria-label="Previous">&larr;</button>
    <figure>
        <img id="cxLbImg" src="" alt="">
        <figcaption id="cxLbCap"></figcaption>
    </figure>
    <button type="button" class="cx-lb-btn cx-lb-next" id="cxLbNext" aria-label="Next">&rarr;</button>
</div>