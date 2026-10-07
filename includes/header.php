<?php /** @var array $data */ ?>
<?php $navBase = $navBase ?? ''; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
    // Apply saved theme before first paint (avoids a light flash). Keep in sync with assets/js/theme.js
    try {
        var t = localStorage.getItem('theme');
        if (t && t !== 'light') document.documentElement.dataset.theme = t;
    } catch (e) {}
    </script>
    <title><?= e($data['site_title']) ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&family=Quicksand:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/themes.css">
    <link rel="stylesheet" href="assets/css/resume-viewer.css">
    <script src="assets/js/theme.js" defer></script>
</head>
<body>
<header class="site-header">
  <?php $firstName = explode(' ', $data['name'])[0]; ?>
<div class="logo"><span class="logo-initial"><?= e(mb_substr($firstName, 0, 1)) ?></span><?= e(mb_substr($firstName, 1)) ?><span class="logo-dot">.</span></div>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
        <i class="fa-solid fa-bars"></i> Menu
    </button>

    <nav id="nav">
        <a href="<?= e($navBase) ?>#home"><i class="fa-solid fa-house"></i> Home</a>
        <a href="<?= e($navBase) ?>#about"><i class="fa-solid fa-user"></i> About</a>
        <a href="<?= e($navBase) ?>#projects"><i class="fa-solid fa-laptop-code"></i> Projects</a>
        <a href="<?= e($navBase) ?>#certificates"><i class="fa-solid fa-certificate"></i> Certificates</a>
        <a href="<?= e($navBase) ?>#contact"><i class="fa-solid fa-envelope"></i> Contact</a>
    </nav>
</header>
<main>