<?php /** @var array $data */ ?>
<section id="projects">
    <h2>Projects</h2>

    <?php
    $projects = $data['projects'] ?? [];
    if ($projects):
        $items = $projects;
        while (count($items) < 6) { $items = array_merge($items, $projects); }
    ?>
    <div class="film">
    <div class="nf-row">
        <div class="nf-track">
            <?php foreach ([0, 1] as $copy): /* dalawang kopya para seamless ang loop */ ?>
                <?php foreach ($items as $i => $p):
                    $demo   = $p['demo'] ?? $p['link'] ?? '';
                    $github = $p['github'] ?? '';
                    $tab    = $copy === 1 ? ' tabindex="-1"' : '';
                ?>
                <article class="nf-card" data-i="<?= $i ?>"<?= $copy === 1 ? ' aria-hidden="true"' : '' ?>>
                    <div class="nf-thumb">
    <img src="<?= e($p['image'] ?? '') ?>" alt="<?= e($p['title'] ?? '') ?>" loading="lazy">
    <?php if ($demo): ?>
        <a class="nf-play" href="<?= e($demo) ?>" target="_blank" rel="noopener" aria-label="Watch demo: <?= e($p['title'] ?? '') ?>"<?= $tab ?>>
            <i class="fa-solid fa-play"></i>
        </a>
    <?php endif; ?>
</div>
                    <div class="nf-info">
                        <h3><?= e($p['title'] ?? '') ?></h3>
                        <p><?= e($p['description'] ?? '') ?></p>

                        <?php if (!empty($p['tech'])): ?>
                        <ul class="nf-tags">
                            <?php foreach ($p['tech'] as $t): ?>
                                <li><?= e($t) ?></li>
                            <?php endforeach; ?>
                        </ul>
                        <?php endif; ?>

                        <?php if ($demo || $github): ?>
                        <div class="nf-actions">
                            <?php if ($demo): ?>
                                <a class="nf-btn nf-btn-main" href="<?= e($demo) ?>" target="_blank" rel="noopener"<?= $tab ?>>Live Demo</a>
                            <?php endif; ?>
                            <?php if ($github): ?>
                                <a class="nf-btn" href="<?= e($github) ?>" target="_blank" rel="noopener"<?= $tab ?>><i class="fa-brands fa-github"></i> GitHub</a>
                            <?php endif; ?>
                        </div>
                        <?php endif; ?>
                    </div>
                </article>
                <?php endforeach; ?>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endif; ?>
    </div>
</section>