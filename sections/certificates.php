<?php /** @var array $data */ ?>
<section id="certificates">
    <h2>Certificates</h2>
    <div class="grid">
        <?php foreach ($data['certificates'] as $cert):
            $images = array_values(array_filter((array) ($cert['image'] ?? [])));
            $multiple = count($images) > 1;
        ?>
            <article class="card certificate-card">
                <div class="cert-images">
                    <?php if (empty($images)): ?>
                        <div class="cert-placeholder">No image yet</div>
                    <?php else: ?>
                        <?php foreach ($images as $i => $img): ?>
                            <img src="<?= e($img) ?>"
                                 alt="<?= e($cert['title']) ?> (<?= $i + 1 ?>)"
                                 class="cert-img"
                                 <?= $i > 0 ? 'hidden' : '' ?>>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>

                <?php if ($multiple): ?>
                    <div class="cert-nav">
                        <button type="button" class="cert-prev" aria-label="Previous image">&larr;</button>
                        <span class="cert-counter">1 / <?= count($images) ?></span>
                        <button type="button" class="cert-next" aria-label="Next image">&rarr;</button>
                    </div>
                <?php endif; ?>

                <h3><?= e($cert['title']) ?></h3>
                <p><?= e($cert['issuer']) ?> &middot; <?= e($cert['date']) ?></p>
            </article>
        <?php endforeach; ?>
    </div>
</section>

<div class="cert-overlay" id="certOverlay">
    <img id="certOverlayImg" src="" alt="">
</div>