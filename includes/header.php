<?php /** @var array $data */ ?>
<?php $navBase = $navBase ?? ''; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($data['site_title']) ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&family=Quicksand:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<header class="site-header">
    <a class="logo" href="<?= e($navBase) ?>#home">Home</a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">Menu</button>
    <nav id="nav">
        <a href="<?= e($navBase) ?>#about">About</a>
        <a href="<?= e($navBase) ?>#projects">Projects</a>
        <a href="<?= e($navBase) ?>#certificates">Certificates</a>
        <a href="<?= e($navBase) ?>#contact">Contact</a>
    </nav>
</header>
<main>