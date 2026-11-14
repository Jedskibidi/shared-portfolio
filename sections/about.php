<?php

/**
 * @file about.php
 * @path sections/about.php
 * @summary About section: intro headline and copy, profile portrait, quick facts, skill chips and action links, built from the user's JSON content.
 */

/** @var array $data */
$name = $data['name'];
$role = $data['title'] ?? '';
$tagline = $data['tagline'] ?? '';
$skills = $data['skills'] ?? [];
$facts = $data['facts'] ?? [];
$education = $data['education'] ?? [];

$aboutIntro = $data['about_intro'] ?? [];
$compactAbout = !empty($aboutIntro['headline']);
$aboutLead = trim($compactAbout ? $aboutIntro['headline'] : ($data['about'] ?? ''));
$aboutRest = '';
if ($compactAbout) {
    $aboutRest = trim($aboutIntro['description'] ?? '');
} elseif (preg_match('/^(.+?[.!?])\s+(.+)$/su', $aboutLead, $sentences)) {
    $aboutLead = $sentences[1];
    $aboutRest = $sentences[2];
}

$photo = $data['profile_image'] ?? '';
$hasPhoto = $photo !== '' && is_file($photo);
$gifDir = rtrim($data['profile_gifs'] ?? '', '/');

$nameParts = preg_split('/\s+/u', trim($name), -1, PREG_SPLIT_NO_EMPTY);
$initials = mb_substr($nameParts[0] ?? '', 0, 1);
if (count($nameParts) > 1) {
    $initials .= mb_substr(end($nameParts), 0, 1);
}

$devicons = [
    'html' => 'html5-plain',
    'css' => 'css3-plain',
    'javascript' => 'javascript-plain',
    'php' => 'php-plain',
    'mysql' => 'mysql-plain',
    'sqlite' => 'sqlite-plain',
    'react' => 'react-original',
    'node.js' => 'nodejs-plain',
    'express.js' => 'express-original',
    'git' => 'git-plain',
    'laravel' => 'laravel-plain',
    'c++' => 'cplusplus-plain',
    'java' => 'java-plain',
    'python' => 'python-plain',
];
$skillIcons = [
    'sql' => 'fa-solid fa-database',
    'responsive design' => 'fa-solid fa-mobile-screen-button',
];

$hasProjects = !empty($data['projects']);
$hasCertificates = !empty($data['certificates']);
?>
<section id="about" class="about<?= $compactAbout ? ' about--compact' : '' ?>" aria-labelledby="about-heading">
    <h2 id="about-heading" class="about-heading">About me</h2>

    <div class="about-intro" data-about-reveal>
        <div class="about-copy">
            <?php if ($compactAbout): ?>
                <p class="about-headline"><?= e($aboutLead) ?></p>
            <?php else: ?>
                <h3 class="about-name"><?= e($name) ?></h3>
                <?php if ($role !== ''): ?>
                    <p class="about-role"><?= e($role) ?></p>
                <?php endif; ?>
                <?php if ($aboutLead !== ''): ?>
                    <p class="about-lead"><?= e($aboutLead) ?></p>
                <?php endif; ?>
            <?php endif; ?>

            <?php if ($aboutRest !== ''): ?>
                <p class="about-rest"><?= e($aboutRest) ?></p>
            <?php endif; ?>
            <?php if ($compactAbout && !empty($aboutIntro['availability'])): ?>
                <p class="about-availability"><?= e($aboutIntro['availability']) ?></p>
            <?php endif; ?>
        </div>

        <figure class="about-profile">
            <div class="about-portrait">
                <?php if ($hasPhoto): ?>
                    <img class="about-photo" src="<?= e($photo) ?>" alt="Photo of <?= e($name) ?>" loading="lazy" decoding="async">
                    <?php if ($gifDir !== ''): ?>
                        <img class="about-photo about-photo-alt" alt="" aria-hidden="true" draggable="false"
                            loading="lazy" decoding="async" data-gif-dir="<?= e($gifDir) ?>">
                    <?php endif; ?>
                <?php else: ?>
                    <span class="about-initials" aria-hidden="true"><?= e($initials) ?></span>
                <?php endif; ?>
            </div>
            <?php if (!$compactAbout && $tagline !== ''): ?>
                <figcaption><?= e($tagline) ?></figcaption>
            <?php endif; ?>
        </figure>
    </div>

    <?php if (!$compactAbout && $facts): ?>
        <ul class="about-facts" data-about-reveal>
            <?php foreach ($facts as $fact): ?>
                <li class="about-fact">
                    <span class="about-fact-icon" aria-hidden="true"><i class="<?= e($fact['icon'] ?? 'fa-solid fa-star') ?>"></i></span>
                    <div>
                        <strong><?= e($fact['title']) ?></strong>
                        <?php if (!empty($fact['text'])): ?>
                            <span class="about-fact-description"><?= e($fact['text']) ?></span>
                        <?php endif; ?>
                    </div>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>

    <?php if ($skills): ?>
        <div class="about-stack" data-about-reveal>
            <h3 class="about-stack-heading">Tech stack</h3>
            <ul class="about-skills">
                <?php foreach ($skills as $skill): ?>
                    <?php
                    $key = mb_strtolower($skill);
                    $icon = isset($devicons[$key])
                        ? 'devicon-' . $devicons[$key] . ' colored'
                        : ($skillIcons[$key] ?? 'fa-solid fa-code');
                    $label = $key === 'express.js' ? 'Express.js' : $skill;
                    ?>
                    <li class="about-skill"><i class="<?= e($icon) ?>" aria-hidden="true"></i><?= e($label) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <?php if ($education): ?>
        <div class="about-education" data-about-reveal>
            <h3 class="about-stack-heading">Education</h3>
            <ul class="about-education-list">
                <?php foreach ($education as $i => $item): ?>
                    <li class="about-education-card">
                        <?php if (!empty($item['logo']) && is_file($item['logo'])): ?>
                            <img class="about-education-logo" src="<?= e($item['logo']) ?>" alt="" loading="lazy" decoding="async">
                        <?php endif; ?>
                        <?php if (!empty($item['years'])): ?>
                            <span class="about-education-years"><?= e($item['years']) ?></span>
                        <?php endif; ?>
                        <strong class="about-education-program"><?= e($item['program'] ?? '') ?></strong>
                        <span class="about-education-school"><?= e($item['school'] ?? '') ?></span>
                        <button type="button" class="about-education-button" data-education-open="education-modal-<?= (int) $i ?>">
                            <span>Show details</span>
                            <i class="fa-solid fa-eye" aria-hidden="true"></i>
                        </button>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <?php foreach ($education as $i => $item): ?>
            <?php
            $eduImage = $item['image'] ?? '';
            $hasEduImage = $eduImage !== '' && is_file($eduImage);
            $eduHighlights = $item['highlights'] ?? [];
            ?>
            <dialog class="about-education-modal" id="education-modal-<?= (int) $i ?>" aria-labelledby="education-modal-title-<?= (int) $i ?>">
                <div class="about-education-modal-inner<?= $hasEduImage ? ' has-image' : '' ?>">
                    <button type="button" class="about-education-close" data-education-close aria-label="Close details">
                        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                    <?php if ($hasEduImage): ?>
                        <div class="about-education-viewer">
                            <button type="button" class="about-education-image-button" data-education-lightbox aria-label="View image full screen">
                                <img class="about-education-image" src="<?= e($eduImage) ?>" alt="<?= e($item['school'] ?? '') ?>" loading="lazy" decoding="async">
                                <span class="about-education-expand" aria-hidden="true"><i class="fa-solid fa-expand"></i></span>
                            </button>
                        </div>
                    <?php endif; ?>
                    <div class="about-education-modal-body">
                        <?php if (!empty($item['years'])): ?>
                            <span class="about-education-years"><?= e($item['years']) ?></span>
                        <?php endif; ?>
                        <h4 class="about-education-modal-title" id="education-modal-title-<?= (int) $i ?>"><?= e($item['program'] ?? '') ?></h4>
                        <p class="about-education-modal-school">
                            <?= e($item['school'] ?? '') ?>
                            <?php if (!empty($item['location'])): ?>
                                <span class="about-education-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i><?= e($item['location']) ?></span>
                            <?php endif; ?>
                        </p>
                        <?php if (!empty($item['summary'])): ?>
                            <p class="about-education-summary"><?= e($item['summary']) ?></p>
                        <?php endif; ?>
                        <?php if ($eduHighlights): ?>
                            <ul class="about-education-highlights">
                                <?php foreach ($eduHighlights as $highlight): ?>
                                    <li><?= e($highlight) ?></li>
                                <?php endforeach; ?>
                            </ul>
                        <?php endif; ?>
                    </div>
                </div>
            </dialog>
        <?php endforeach; ?>

        <dialog class="about-education-lightbox" id="education-lightbox" aria-label="Full screen image">
            <button type="button" class="about-education-lightbox-close" data-lightbox-close aria-label="Close full screen image">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
            <img class="about-education-lightbox-image" alt="">
        </dialog>

        <script src="assets/js/about-education.js" defer></script>
    <?php endif; ?>

    <?php if (!$compactAbout && ($hasProjects || $hasCertificates)): ?>
        <nav class="about-actions" aria-label="Explore the portfolio" data-about-reveal>
            <?php if ($hasProjects): ?>
                <a class="about-action" href="#projects">
                    <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
                    <span>View projects</span>
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
            <?php endif; ?>
            <?php if ($hasCertificates): ?>
                <a class="about-action" href="#certificates">
                    <i class="fa-solid fa-certificate" aria-hidden="true"></i>
                    <span>View certificates</span>
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
            <?php endif; ?>
        </nav>
    <?php endif; ?>
</section>