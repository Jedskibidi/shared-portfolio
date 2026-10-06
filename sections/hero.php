<?php /** @var array $data */ ?>
<section id="home" class="hero">
    <div class="hero-inner">

        <div class="hero-text">

            <h1>
                <span id="typewriter-prefix">Hi, I'm </span><span id="typewriter" class="tw-name"
                    data-texts="<?= e(json_encode([
                        ['prefix' => "Hi, I'm ", 'text' => $data['name'],  'cls' => 'tw-name'],
                        ['prefix' => '',         'text' => $data['title'], 'cls' => 'tw-role'],
                    ])) ?>"><?= e($data['name']) ?></span><span class="cursor"></span>
            </h1>

            <h3 class="hero-desc"><?= e($data['intro'] ?? $data['tagline'] ?? $data['about']) ?></h3>

            <div class="hero-buttons">
                <a class="btn" href="#projects">
                    <i class="fa-solid fa-folder-open"></i> View my projects
                </a>
                <button type="button" class="btn">
                    <i class="fa-solid fa-download"></i> Download Resume
                </button>
            </div>

        </div><!-- /.hero-text -->

        <div class="hero-image">
            <img src="<?= e($data['profile_image']) ?>" alt="Photo of <?= e($data['name']) ?>" class="profile-img">
        </div>

    </div><!-- /.hero-inner -->
</section>