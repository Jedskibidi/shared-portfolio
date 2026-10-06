<?php /** @var array $data */ ?>
<section id="home" class="hero">
    <div class="hero-inner">

        <div class="hero-text">
            <span class="hero-badge"><?= e($data['title']) ?></span>

            <h1>
                Hi, I'm <span class="accent-text"><?= e($data['name']) ?></span>
                <span class="hero-subheading"><?= e($data['tagline'] ?? '') ?></span>
            </h1>

          <p class="hero-desc"><?= e($data['intro'] ?? $data['about']) ?></p>

            <div class="hero-buttons">
                <a class="btn" href="#projects">
                    <i class="fa-solid fa-folder-open"></i> View my projects
                </a>
                <button type="button" class="btn btn-outline">
                    <i class="fa-solid fa-download"></i> Download CV
                </button>
            </div>
        </div>

        <div class="hero-image">
            <img src="<?= e($data['profile_image']) ?>" alt="Photo of <?= e($data['name']) ?>" class="profile-img">
        </div>

    </div>
</section>