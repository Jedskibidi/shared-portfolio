<?php

/**
 * @file resume-modal.php
 * @path sections/resume-modal.php
 * @summary Resume modal: view-only resume viewer panel and the request-full-resume form.
 */

/** @var array $data */

$rvEndpoint = $data['contact']['form_endpoint'] ?? '';
$rvEmail    = $data['contact']['email'] ?? '';
$rvSrc      = $data['resume'] ?? 'assets/files/resume-public.pdf';
?>
<div class="rv-overlay" id="resumeViewer" role="dialog" aria-modal="true" aria-labelledby="rvTitle"
    data-src="<?= e($rvSrc) ?>"
    data-watermark="<?= e($data['name'] . ' - Public copy') ?>" hidden>
    <div class="rv-panel">

        <div class="rv-bar">
            <h2 id="rvTitle">Resume preview</h2>
            <button type="button" class="rv-btn" id="rvRequestBtn">
                <i class="fa-solid fa-envelope"></i> Request full resume
            </button>
            <button type="button" class="rv-btn" id="rvBackBtn" hidden>
                <i class="fa-solid fa-arrow-left"></i> Back to preview
            </button>
            <button type="button" class="rv-close" id="rvCloseBtn" aria-label="Close resume preview">&times;</button>
        </div>

        <div class="rv-body rv-protected" id="rvViewPanel">
            <p class="rv-note" id="rvLoading" role="status">Loading resume...</p>
            <div class="rv-pages" id="rvPages"></div>
            <p class="rv-note rv-foot">
                This is a public, view-only preview. Personal details are hidden.
                Use <strong>Request full resume</strong> to ask for the complete version.
            </p>
        </div>

        <div class="rv-body" id="rvRequestPanel" hidden>
            <p class="rv-note">
                Tell me who you are and why you need the full resume. I'll review your request
                and reply to your email if approved.
            </p>

            <?php if ($rvEndpoint !== ''): ?>
                <form class="contact-form" id="rvRequestForm" action="<?= e($rvEndpoint) ?>" method="POST">
                    <label>Name
                        <input type="text" name="name" required autocomplete="name">
                    </label>
                    <label>Email
                        <input type="email" name="email" required autocomplete="email">
                    </label>
                    <label>Why do you need the full resume?
                        <textarea name="message" rows="4" required></textarea>
                    </label>
                    <input type="hidden" name="_subject" value="Full resume request - <?= e($data['name']) ?>">
                    <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">

                    <button type="submit" class="contact-submit">Send request</button>
                    <p class="form-status" id="rvFormStatus" role="status"></p>
                </form>
            <?php else: ?>
                <p class="rv-note">The request form isn't set up yet. You can email me at
                    <a href="mailto:<?= e($rvEmail) ?>?subject=<?= rawurlencode('Full resume request') ?>"><?= e($rvEmail) ?></a>.
                </p>
            <?php endif; ?>
        </div>

    </div>
</div>