<?php /** @var array $data */ ?>
<section id="home" class="hero">
    <img src="<?= e($data['profile_image']) ?>" alt="Photo of <?= e($data['name']) ?>" class="profile-img">
    <h1><?= e($data['name']) ?></h1>
    <p class="tagline"><?= e($data['title']) ?></p>
    <a class="btn" href="#projects">View my projects</a>
</section>
