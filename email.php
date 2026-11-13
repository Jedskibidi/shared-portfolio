<?php

/**
 * @file email.php
 * @path email.php
 * @summary Email page: message form posted to the configured form endpoint, with a fallback mailto link and a link back to the portfolio.
 */

require __DIR__ . '/includes/functions.php';

$user = current_user();
$data = load_content($user);

$homeLink = 'index.php' . ($user !== DEFAULT_USER ? '?user=' . $user : '');
$navBase = $homeLink;

$formEndpoint = $data['contact']['form_endpoint'] ?? '';

include __DIR__ . '/includes/header.php';
?>
<div class="page-wipe-in" aria-hidden="true"></div>

<section id="email-page">
    <h2>Send me a message</h2>

    <?php if ($formEndpoint !== ''): ?>
        <form class="contact-form" id="contactForm" action="<?= e($formEndpoint) ?>" method="POST">
            <label>Name
                <input type="text" name="name" required>
            </label>
            <label>Email
                <input type="email" name="email" required>
            </label>
            <label>Message
                <textarea name="message" rows="5" required></textarea>
            </label>
            <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">

            <button type="submit" class="contact-submit">Send message</button>
            <p class="form-status" id="formStatus" role="status"></p>
        </form>
    <?php else: ?>
        <p>The message form isn't set up yet. You can email me directly at
            <a href="mailto:<?= e($data['contact']['email']) ?>"><?= e($data['contact']['email']) ?></a>.
        </p>
    <?php endif; ?>

    <p>
        <a class="back-link" href="<?= e($homeLink) ?>#contact">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to portfolio
        </a>
    </p>
</section>
<?php include __DIR__ . '/includes/footer.php'; ?>