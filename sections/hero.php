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
                <div class="theme-picker">
                    <button type="button" class="btn" id="themeBtn"
                            aria-haspopup="true" aria-expanded="false" aria-controls="themeMenu">
                        <i class="fa-solid fa-palette"></i> Choose theme
                    </button>
                    <div class="theme-menu" id="themeMenu" hidden></div>
                </div>
                <button type="button" class="btn" id="viewResumeBtn">
                    <i class="fa-solid fa-eye"></i> View Resume
                </button>
            </div>

        </div><!-- /.hero-text -->

        <div class="hero-image">
            <img src="<?= e($data['profile_image']) ?>" alt="Photo of <?= e($data['name']) ?>" class="profile-img">
        </div>

    </div><!-- /.hero-inner -->
</section>
<?php include __DIR__ . '/resume-modal.php'; ?>