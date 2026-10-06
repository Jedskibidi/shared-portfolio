<?php /** @var array $data */ ?>
<?php
$formEndpoint = $data['contact']['form_endpoint'] ?? '';
$emailLink = $formEndpoint !== ''
    ? 'email.php' . (current_user() !== DEFAULT_USER ? '?user=' . current_user() : '')
    : 'mailto:' . $data['contact']['email'] . '?subject=' . rawurlencode('Hello from your portfolio');
?>
<section id="contact">
    <h2>Contact</h2>
    <div class="contact-buttons">
        <a class="contact-btn" href="<?= e($emailLink) ?>">Email</a>
        <a class="contact-btn" href="<?= e($data['contact']['github']) ?>" target="_blank" rel="noopener">GitHub</a>
        <a class="contact-btn" href="<?= e($data['contact']['linkedin']) ?>" target="_blank" rel="noopener">LinkedIn</a>
    </div>

</section>
