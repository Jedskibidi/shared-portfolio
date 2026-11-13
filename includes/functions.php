<?php

/**
 * @file functions.php
 * @path includes/functions.php
 * @summary Shared helpers and constants: allowed portfolio users, default user, HTML escaping with e(), current user from the query string, and loading a user's JSON content.
 */

const ALLOWED_USERS = ['jed', 'christine'];
const DEFAULT_USER  = 'jed';

function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function current_user(): string
{
    $user = strtolower($_GET['user'] ?? DEFAULT_USER);

    return in_array($user, ALLOWED_USERS, true) ? $user : DEFAULT_USER;
}

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
