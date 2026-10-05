<?php /** @var array $data */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($data['site_title']) ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<header class="site-header">
    <a class="logo" href="#home"><?= e($data['name']) ?></a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">Menu</button>
    <nav id="nav">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#certificates">Certificates</a>
        <a href="#contact">Contact</a>
    </nav>
</header>
<main>
