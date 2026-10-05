<?php
// Portfolios
const ALLOWED_USERS = ['jed', 'christine'];
const DEFAULT_USER  = 'jed';

// Escape text before printing it in HTML
function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

// Kung anong portfolio ang mag sh-show depende sa query string na "user".
function current_user(): string
{
    $user = strtolower($_GET['user'] ?? DEFAULT_USER);

    return in_array($user, ALLOWED_USERS, true) ? $user : DEFAULT_USER;
}

// Load the person's data
function load_content(string $user): array
{
    $path = __DIR__ . '/../data/' . $user . '.json';

    if (!file_exists($path)) {
        die('Missing data/' . $user . '.json');
    }

    $data = json_decode(file_get_contents($path), true);

    if (!is_array($data)) {
        die('data/' . $user . '.json has invalid JSON: ' . json_last_error_msg());
    }

    return $data;
}
