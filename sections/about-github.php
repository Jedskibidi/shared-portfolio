<?php

/**
 * @file about-github.php
 * @path sections/about-github.php
 * @summary GitHub activity card for the About section: draws the contribution graph for the account in contact.github as an inline SVG (data from a public API, cached for 6 hours) with a total for the last year. Falls back to the ghchart image when no data is available, with an optional github_graph_color. Included by about.php.
 */

/** @var array $data */
$githubUrl = trim((string) ($data['contact']['github'] ?? ''));
$githubUser = basename((string) parse_url($githubUrl, PHP_URL_PATH));
if (!preg_match('/^[A-Za-z0-9-]+$/', $githubUser)) {
    return;
}

$githubColor = preg_replace('/[^0-9a-f]/i', '', (string) ($data['github_graph_color'] ?? ''));
if (strlen($githubColor) !== 6) {
    $githubColor = '40c463';
}
$githubColor = strtolower($githubColor);

$githubMix = static function (string $hex, string $to, float $amount): string {
    $out = '';
    for ($i = 0; $i < 6; $i += 2) {
        $from = hexdec(substr($hex, $i, 2));
        $target = hexdec(substr($to, $i, 2));
        $out .= str_pad(dechex((int) round($from + ($target - $from) * $amount)), 2, '0', STR_PAD_LEFT);
    }
    return $out;
};

$githubShades = ['eeeeee', '8dffb0', '73f796', '40c463', '339d4f'];
if ($githubColor !== '40c463') {
    $githubShades = [
        'eeeeee',
        $githubMix($githubColor, 'ffffff', 0.55),
        $githubMix($githubColor, 'ffffff', 0.3),
        $githubColor,
        $githubMix($githubColor, '000000', 0.2),
    ];
}
$githubShadeVars = '';
foreach ($githubShades as $level => $shade) {
    $githubShadeVars .= '--gh-l' . $level . ': #' . $shade . '; ';
}

$githubCacheFile = dirname(__DIR__) . '/cache/github-' . strtolower($githubUser) . '-last.json';
$githubCacheTtl = 6 * 3600;

$githubReadCache = static function (string $file): ?array {
    $raw = is_file($file) ? @file_get_contents($file) : false;
    $json = $raw === false ? null : json_decode($raw, true);
    return is_array($json) && !empty($json['contributions']) ? $json : null;
};

$githubFetch = static function (string $user): ?array {
    $url = 'https://github-contributions-api.jogruber.de/v4/' . rawurlencode($user) . '?y=last';
    $raw = false;
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_TIMEOUT => 4,
            CURLOPT_USERAGENT => 'portfolio-github-graph',
        ]);
        $raw = curl_exec($ch);
        curl_close($ch);
    }
    if ($raw === false && ini_get('allow_url_fopen')) {
        $raw = @file_get_contents($url, false, stream_context_create(['http' => ['timeout' => 4]]));
    }
    $json = $raw === false ? null : json_decode($raw, true);
    if (!is_array($json) || empty($json['contributions']) || !is_array($json['contributions'])) {
        return null;
    }
    $days = [];
    foreach ($json['contributions'] as $day) {
        if (!isset($day['date'], $day['count'], $day['level']) || !strtotime((string) $day['date'])) {
            return null;
        }
        $days[] = [
            'date' => (string) $day['date'],
            'count' => (int) $day['count'],
            'level' => max(0, min(4, (int) $day['level'])),
        ];
    }
    return ['contributions' => $days];
};

$githubData = $githubReadCache($githubCacheFile);
$githubFresh = $githubData !== null && (time() - (int) filemtime($githubCacheFile)) < $githubCacheTtl;
if (!$githubFresh) {
    $githubLive = $githubFetch($githubUser);
    if ($githubLive !== null) {
        if (!is_dir(dirname($githubCacheFile))) {
            @mkdir(dirname($githubCacheFile), 0755, true);
        }
        @file_put_contents($githubCacheFile, json_encode($githubLive), LOCK_EX);
        $githubData = $githubLive;
    } elseif ($githubData !== null) {
        @touch($githubCacheFile, time() - $githubCacheTtl + 600);
    }
}

$githubCells = [];
$githubMonths = [];
$githubTotal = null;
$githubWidth = 0;
$githubHeight = 0;
$githubSize = 10;
$githubStep = 12;
$githubLeft = 30;
$githubTop = 16;

if ($githubData !== null) {
    $githubDays = $githubData['contributions'];
    $githubTotal = 0;
    $githubOffset = (int) date('w', strtotime($githubDays[0]['date']));
    $githubLastMonth = '';
    foreach ($githubDays as $i => $day) {
        $index = $githubOffset + $i;
        $col = intdiv($index, 7);
        $row = $index % 7;
        $time = strtotime($day['date']);
        $githubTotal += $day['count'];
        $githubCells[] = [
            'x' => $githubLeft + $col * $githubStep,
            'y' => $githubTop + $row * $githubStep,
            'col' => $col,
            'row' => $row,
            'level' => $day['level'],
            'title' => $day['count'] . ($day['count'] === 1 ? ' contribution' : ' contributions') . ' on ' . date('M j, Y', $time),
        ];
        if ($row === 0 || $i === 0) {
            $month = date('M', $time);
            if ($month !== $githubLastMonth) {
                $githubMonths[] = ['x' => $githubLeft + $col * $githubStep, 'col' => $col, 'label' => $month];
                $githubLastMonth = $month;
            }
        }
        $githubWidth = max($githubWidth, $githubLeft + $col * $githubStep + $githubSize);
    }
    if (count($githubMonths) > 1 && $githubMonths[1]['col'] - $githubMonths[0]['col'] < 3) {
        array_shift($githubMonths);
    }
    $githubHeight = $githubTop + 6 * $githubStep + $githubSize;
}
?>
<div class="about-github" data-about-reveal style="<?= e(trim($githubShadeVars)) ?>">
    <h3 class="about-stack-heading">GitHub activity</h3>
    <a class="about-github-card" href="<?= e($githubUrl) ?>" target="_blank" rel="noopener noreferrer">
        <?php if ($githubTotal !== null): ?>
            <span class="about-github-total"><?= e(number_format($githubTotal)) ?> <?= $githubTotal === 1 ? 'contribution' : 'contributions' ?> in the last year</span>
        <?php endif; ?>
        <div class="about-github-scroll">
            <?php if ($githubCells): ?>
                <svg class="about-github-graph about-github-grid" viewBox="0 0 <?= (int) $githubWidth ?> <?= (int) $githubHeight ?>" role="img" aria-label="GitHub contributions in the last year: <?= e((string) $githubTotal) ?>">
                    <g aria-hidden="true">
                        <?php foreach ($githubMonths as $month): ?>
                            <text class="about-github-label" x="<?= (int) $month['x'] ?>" y="10"><?= e($month['label']) ?></text>
                        <?php endforeach; ?>
                        <?php foreach ([1 => 'Mon', 3 => 'Wed', 5 => 'Fri'] as $row => $day): ?>
                            <text class="about-github-label" x="0" y="<?= $githubTop + $row * $githubStep + 9 ?>"><?= e($day) ?></text>
                        <?php endforeach; ?>
                        <?php foreach ($githubCells as $cell): ?>
                            <rect class="about-github-cell" data-level="<?= (int) $cell['level'] ?>" x="<?= (int) $cell['x'] ?>" y="<?= (int) $cell['y'] ?>" width="<?= $githubSize ?>" height="<?= $githubSize ?>" style="--col: <?= (int) $cell['col'] ?>; --row: <?= (int) $cell['row'] ?>">
                                <title><?= e($cell['title']) ?></title>
                            </rect>
                        <?php endforeach; ?>
                    </g>
                </svg>
            <?php else: ?>
                <img class="about-github-graph" src="https://ghchart.rshah.org/<?= e($githubColor) ?>/<?= e($githubUser) ?>" alt="GitHub contribution graph for <?= e($githubUser) ?>" loading="lazy" decoding="async">
            <?php endif; ?>
        </div>
        <span class="about-github-link">
            <i class="fa-brands fa-github" aria-hidden="true"></i>
            <span>@<?= e($githubUser) ?></span>
            <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
        </span>
    </a>
</div>