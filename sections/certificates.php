<?php /** @var array $data */ ?>
<section id="certificates">
    <h2>Certificates</h2>
    <div class="grid">
        <?php foreach ($data['certificates'] as $cert): ?>
            <article class="card">
                <img src="<?= e($cert['image']) ?>" alt="<?= e($cert['title']) ?>" class="cert-img">
                <h3><?= e($cert['title']) ?></h3>
                <p><?= e($cert['issuer']) ?> &middot; <?= e($cert['date']) ?></p>
            </article>
        <?php endforeach; ?>
    </div>
</section>
