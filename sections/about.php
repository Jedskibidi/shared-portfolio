<?php

/** @var array $data */ ?>
<?php
$firstName = explode(' ', $data['name'])[0];
$role      = $data['title'] ?? '';
$facts     = $data['facts'] ?? [];   // optional: [{ "icon", "title", "text" }]
$tagline   = $data['tagline'] ?? ''; // optional: short line shown under the photo

// Bio: the first sentence becomes a bigger "lead", the rest stays as normal text
$aboutText = trim($data['about'] ?? '');
$aboutLead = $aboutText;
$aboutRest = '';
if (preg_match('/^(.+?[.!?])\s+(.+)$/su', $aboutText, $m)) {
    $aboutLead = $m[1];
    $aboutRest = $m[2];
}

// Photo (+ hover gif: theme.js loads <profile_gifs>/<theme>.gif into the data-gif-dir image, same as the hero)
$photo    = $data['profile_image'] ?? '';
$hasPhoto = $photo !== '' && is_file($photo);
$gifDir   = rtrim($data['profile_gifs'] ?? '', '/');

// Skill name => icon class (Devicon needs the extra "colored" class). Unknown skills get a generic icon.
$devicon = [
    'html' => 'html5-plain',
    'css' => 'css3-plain',
    'javascript' => 'javascript-plain',
    'php' => 'php-plain',
    'mysql' => 'mysql-plain',
    'react' => 'react-original',
    'node.js' => 'nodejs-plain',
    'git' => 'git-plain',
    'laravel' => 'laravel-plain',
    'c++' => 'cplusplus-plain',
    'java' => 'java-plain',
    'python' => 'python-plain',
];
$faIcons = [
    'sql' => 'fa-solid fa-database',
    'responsive design' => 'fa-solid fa-mobile-screen-button',
];
if (!function_exists('about_skill_icon')) {
    function about_skill_icon(string $skill, array $devicon, array $faIcons): string
    {
        $key = mb_strtolower($skill);
        if (isset($devicon[$key])) return 'devicon-' . $devicon[$key] . ' colored';
        return $faIcons[$key] ?? 'fa-solid fa-code';
    }
}

// Numbers + a small preview come straight from the JSON, so they update when items are added
$skillList   = array_values($data['skills'] ?? []);
$projectList = array_column($data['projects'] ?? [], 'title');
$certList    = array_column($data['certificates'] ?? [], 'title');

$stats = [
    // type "logos" = overlapping skill logos, type "list" = first titles. "show" = how many to preview.
    ['label' => 'Skill',       'items' => $skillList,   'icon' => 'fa-solid fa-code',        'type' => 'logos', 'show' => 4],
    ['label' => 'Project',     'items' => $projectList, 'icon' => 'fa-solid fa-laptop-code', 'type' => 'list',  'show' => 2, 'bullet' => 'number'],
    ['label' => 'Certificate', 'items' => $certList,    'icon' => 'fa-solid fa-certificate', 'type' => 'list',  'show' => 2, 'bullet' => 'check'],
];
?>
<section id="about" class="about">
    <h2>About me</h2>

    <div class="about-bento">

        <!-- Photo -->
        <div class="about-tile about-photo-tile reveal">
            <div class="about-ring">
                <div class="about-media">
                    <?php if ($hasPhoto): ?>
                        <img class="about-photo" src="<?= e($photo) ?>" alt="Photo of <?= e($data['name']) ?>" loading="lazy">
                        <?php if ($gifDir !== ''): ?>
                            <img class="about-photo-alt" alt="" draggable="false" aria-hidden="true" data-gif-dir="<?= e($gifDir) ?>">
                        <?php endif; ?>
                    <?php else: ?>
                        <span class="about-initial" aria-hidden="true"><?= e(mb_substr($firstName, 0, 1)) ?></span>
                    <?php endif; ?>
                </div>
            </div>

            <?php if ($tagline !== ''): ?>
                <div class="about-tagline">
                    <span class="about-tagline-icon"><i class="fa-solid fa-quote-left" aria-hidden="true"></i></span>
                    <p><?= e($tagline) ?></p>
                </div>
            <?php endif; ?>
        </div>

        <!-- Bio (animated gradient border) -->
        <div class="about-tile about-bio reveal">
            <i class="about-bio-bg fa-solid fa-code" aria-hidden="true"></i>

            <p class="about-eyebrow"><i class="fa-solid fa-hand" aria-hidden="true"></i> Hello, I'm</p>

            <div class="about-head">
                <h3 class="about-name"><?= e($data['name']) ?></h3>
                <?php if ($role !== ''): ?>
                    <span class="about-role"><i class="fa-solid fa-laptop-code" aria-hidden="true"></i><?= e($role) ?></span>
                <?php endif; ?>
            </div>

            <p class="about-lead"><?= e($aboutLead) ?></p>
            <?php if ($aboutRest !== ''): ?>
                <p class="about-rest"><?= e($aboutRest) ?></p>
            <?php endif; ?>
        </div>

        <!-- Skills with logos -->
        <div class="about-tile about-skills-tile reveal">
            <h4 class="about-label">Skills</h4>
            <ul class="about-skills">
                <?php foreach ($data['skills'] as $i => $skill): ?>
                    <li style="--i: <?= (int) $i ?>"><i class="<?= e(about_skill_icon($skill, $devicon, $faIcons)) ?>" aria-hidden="true"></i><?= e($skill) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>

        <!-- Count-up numbers -->
        <div class="about-stats">
            <?php foreach ($stats as $stat): ?>
                <?php
                $count   = count($stat['items']);
                $label   = $stat['label'] . ($count === 1 ? '' : 's');
                $shown   = array_slice($stat['items'], 0, $stat['show']);
                $extra   = $count - count($shown);
                ?>
                <div class="about-tile about-stat reveal">
                    <i class="about-stat-bg <?= e($stat['icon']) ?>" aria-hidden="true"></i>

                    <div class="about-stat-top">
                        <div class="about-num" data-count="<?= (int) $count ?>"><?= (int) $count ?></div>
                        <span class="about-stat-label"><?= e($label) ?></span>
                    </div>

                    <?php if ($shown): ?>
                        <?php if ($stat['type'] === 'logos'): ?>
                            <!-- Overlapping skill logos, they spread out on hover -->
                            <ul class="about-stat-preview about-stat-logos" aria-hidden="true">
                                <?php foreach ($shown as $name): ?>
                                    <li><i class="<?= e(about_skill_icon($name, $devicon, $faIcons)) ?>"></i></li>
                                <?php endforeach; ?>
                                <?php if ($extra > 0): ?>
                                    <li class="about-stat-extra">+<?= (int) $extra ?></li>
                                <?php endif; ?>
                            </ul>
                        <?php else: ?>
                            <!-- First titles from the JSON -->
                            <ul class="about-stat-preview about-stat-list">
                                <?php foreach ($shown as $i => $name): ?>
                                    <li>
                                        <?php if (($stat['bullet'] ?? '') === 'check'): ?>
                                            <i class="about-stat-dot fa-solid fa-circle-check"></i>
                                        <?php else: ?>
                                            <span class="about-stat-dot"><?= sprintf('%02d', $i + 1) ?></span>
                                        <?php endif; ?>
                                        <span class="about-stat-text"><?= e($name) ?></span>
                                    </li>
                                <?php endforeach; ?>
                                <?php if ($extra > 0): ?>
                                    <li class="about-stat-more">+<?= (int) $extra ?> more</li>
                                <?php endif; ?>
                            </ul>
                        <?php endif; ?>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Fact tiles: the first one sits beside the numbers, the rest are wide -->
        <?php foreach ($facts as $n => $fact): ?>
            <article class="about-tile about-fact reveal<?= $n > 0 ? ' about-fact--wide' : '' ?>">
                <span class="about-fact-icon"><i class="<?= e($fact['icon'] ?? 'fa-solid fa-star') ?>" aria-hidden="true"></i></span>
                <div class="about-fact-text">
                    <b><?= e($fact['title']) ?></b>
                    <span><?= e($fact['text'] ?? '') ?></span>
                </div>
            </article>
        <?php endforeach; ?>

    </div>
</section>