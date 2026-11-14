<?php

/**
 * @file about-spotify.php
 * @path sections/about-spotify.php
 * @summary Spotify playlist card for the About section: glass panel with a short intro and an open button beside the embedded public playlist from spotify_playlist (optional spotify_intro: headline, accent, text, button). No autoplay, loads lazily, compact on mobile. Hidden when the key is missing or invalid. Included by about.php.
 */

/** @var array $data */
$spotifyUrl = trim((string) ($data['spotify_playlist'] ?? ''));
if (!preg_match('~^https://open\.spotify\.com/(?:intl-[a-z]{2}/)?playlist/([A-Za-z0-9]+)~', $spotifyUrl, $spotifyMatch)) {
    return;
}
$spotifyId = $spotifyMatch[1];

$spotifyIntro = $data['spotify_intro'] ?? [];
$spotifyHeadline = trim((string) ($spotifyIntro['headline'] ?? ''));
$spotifyAccent = trim((string) ($spotifyIntro['accent'] ?? ''));
$spotifyText = trim((string) ($spotifyIntro['text'] ?? ''));
$spotifyButton = trim((string) ($spotifyIntro['button'] ?? '')) ?: 'Open on Spotify';
?>
<div class="about-spotify" data-about-reveal>
    <h3 class="about-stack-heading">Playlist</h3>
    <div class="about-spotify-card">
        <div class="about-spotify-copy">
            <?php if ($spotifyHeadline !== '' || $spotifyAccent !== ''): ?>
                <p class="about-spotify-title">
                    <?= e($spotifyHeadline) ?>
                    <?php if ($spotifyAccent !== ''): ?>
                        <span><?= e($spotifyAccent) ?></span>
                    <?php endif; ?>
                </p>
            <?php endif; ?>
            <?php if ($spotifyText !== ''): ?>
                <p class="about-spotify-text"><?= e($spotifyText) ?></p>
            <?php endif; ?>
            <a class="about-spotify-button" href="https://open.spotify.com/playlist/<?= e($spotifyId) ?>" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-spotify" aria-hidden="true"></i>
                <span><?= e($spotifyButton) ?></span>
                <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
        </div>
        <iframe class="about-spotify-embed" src="https://open.spotify.com/embed/playlist/<?= e($spotifyId) ?>?utm_source=generator" title="Spotify playlist" loading="lazy" allow="encrypted-media; clipboard-write; fullscreen; picture-in-picture"></iframe>
    </div>
</div>