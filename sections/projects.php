<?php /** @var array $data */ ?>
<section id="projects">
    <h2>Projects</h2>
    <div class="grid">
        <?php foreach ($data['projects'] as $project): ?>
            <article class="card">
                <img src="<?= e($project['image']) ?>" alt="<?= e($project['title']) ?>">
                <h3><?= e($project['title']) ?></h3>
                <p><?= e($project['description']) ?></p>
                <p class="tech"><?= e(implode(', ', $project['tech'])) ?></p>
                <?php if (!empty($project['link'])): ?>
                    <a href="<?= e($project['link']) ?>" target="_blank" rel="noopener">View project</a>
                <?php endif; ?>
            </article>
        <?php endforeach; ?>
    </div>
</section>
