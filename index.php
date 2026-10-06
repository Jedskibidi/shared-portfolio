<?php
require __DIR__ . '/includes/functions.php';

$user = current_user();
$data = load_content($user);

include __DIR__ . '/includes/header.php';
include __DIR__ . '/sections/hero.php';
include __DIR__ . '/sections/about.php';
include __DIR__ . '/sections/projects.php';
include __DIR__ . '/sections/certificates.php';
?>
<script src="assets/js/certificates.js"></script>
<?php
include __DIR__ . '/sections/contact.php';
include __DIR__ . '/includes/footer.php';
