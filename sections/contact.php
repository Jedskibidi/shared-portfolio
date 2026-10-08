<?php /** @var array $data */ ?>
<?php
$formEndpoint = $data['contact']['form_endpoint'] ?? '';
$emailLink = $formEndpoint !== ''
    ? 'email.php' . (current_user() !== DEFAULT_USER ? '?user=' . current_user() : '')
    : 'mailto:' . $data['contact']['email'] . '?subject=' . rawurlencode('Hello from your portfolio');

$facebook  = $data['contact']['facebook']  ?? '';
$instagram = $data['contact']['instagram'] ?? '';
?>
<section id="contact">
    <h2>Contact</h2>
    <div class="contact-buttons">
        <a class="contact-btn" href="<?= e($emailLink) ?>"><i class="fa-solid fa-envelope" aria-hidden="true" style="margin-right:12px"></i>Email</a>
        <a class="contact-btn" href="<?= e($data['contact']['github']) ?>" target="_blank" rel="noopener"><i class="fa-brands fa-github" aria-hidden="true" style="margin-right:12px"></i>GitHub</a>
        <a class="contact-btn" href="<?= e($data['contact']['linkedin']) ?>" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin-in" aria-hidden="true" style="margin-right:12px"></i>LinkedIn</a>
        <?php if ($facebook !== ''): ?>
        <a class="contact-btn" href="<?= e($facebook) ?>" target="_blank" rel="noopener"><i class="fa-brands fa-facebook-f" aria-hidden="true" style="margin-right:12px"></i>Facebook</a>
        <?php endif; ?>
        <?php if ($instagram !== ''): ?>
        <a class="contact-btn" href="<?= e($instagram) ?>" target="_blank" rel="noopener"><i class="fa-brands fa-instagram" aria-hidden="true" style="margin-right:12px"></i>Instagram</a>
        <?php endif; ?>
    </div>
</section>