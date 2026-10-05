<?php /** @var array $data */ ?>
<section id="contact">
    <h2>Contact</h2>
    <p>Email: <a href="mailto:<?= e($data['contact']['email']) ?>"><?= e($data['contact']['email']) ?></a></p>
    <p>GitHub: <a href="<?= e($data['contact']['github']) ?>" target="_blank" rel="noopener"><?= e($data['contact']['github']) ?></a></p>
    <p>LinkedIn: <a href="<?= e($data['contact']['linkedin']) ?>" target="_blank" rel="noopener"><?= e($data['contact']['linkedin']) ?></a></p>
</section>
