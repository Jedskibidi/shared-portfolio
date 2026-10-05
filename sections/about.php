<?php /** @var array $data */ ?>
<section id="about">
    <h2>About me</h2>
    <p><?= e($data['about']) ?></p>

    <h3>Skills</h3>
    <ul class="skills">
        <?php foreach ($data['skills'] as $skill): ?>
            <li><?= e($skill) ?></li>
        <?php endforeach; ?>
    </ul>
</section>