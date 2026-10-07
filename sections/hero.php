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
    <div class="avatar" id="avatar" tabindex="0" role="button" aria-label="Toggle profile image">
        <img src="<?= e($data['profile_image']) ?>" alt="Photo of <?= e($data['name']) ?>" class="avatar-photo" draggable="false">
        <?php if (!empty($data['profile_gifs'])): ?>
            <?php /* Folder of per-theme gifs for this person; theme.js sets the src (daybreak.gif, nightfall.gif, ...) */ ?>
            <img alt="" class="avatar-alt" draggable="false" data-gif-dir="<?= e(rtrim($data['profile_gifs'], '/')) ?>">
        <?php elseif (!empty($data['profile_image_alt'])): ?>
            <img src="<?= e($data['profile_image_alt']) ?>" alt="" class="avatar-alt" draggable="false">
        <?php endif; ?>
    </div>
</div>

    </div><!-- /.hero-inner -->
</section>
<?php include __DIR__ . '/resume-modal.php'; ?>