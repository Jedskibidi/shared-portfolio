/**
 * File: scroll-replay.js
 * Path: assets/js/scroll-replay.js
 *
 * Purpose: Replays scroll-reveal animations every time an element comes back
 * into view (scrolling down or up) instead of only once. Handles the About
 * section and any element tagged with a data-replay attribute
 * (values: fade, zoom, left, right; no value slides up). New sections are
 * added as one entry in REPLAY_SECTIONS. Pairs with assets/css/scroll-replay.css.
 */
const REPLAY_MODE = "both";

const THRESHOLD = 0.15;
const STAGGER_STEP = 40;
const STAGGER_MAX = 440;
const SETTLE_MS = 1500;

const REPLAY_SECTIONS = [
  {
    section: "#about",
    targets:
      ".about-heading, .about-copy > *, .about-profile, .about-fact, " +
      ".about-stack-heading, .about-skill, .about-actions",
    enter: "about-enter",
    delayVar: "--about-reveal-delay",
  },
  {
    section: "body",
    targets: "[data-replay]",
    enter: "sr-enter",
    delayVar: "--sr-delay",
  },
];

(() => {
  if (!("IntersectionObserver" in window)) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  let lastY = window.scrollY;
  let direction = "down";
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? "down" : "up";
      lastY = y;
    },
    { passive: true },
  );

  function allowed(dir) {
    return REPLAY_MODE === "both" || REPLAY_MODE === dir;
  }

  REPLAY_SECTIONS.forEach((cfg) => {
    const section = document.querySelector(cfg.section);
    if (!section) return;

    const seen = new WeakSet();
    const visibleNow = new WeakMap();
    const enteredAt = new WeakMap();

    function reset(el) {
      el.classList.remove(cfg.enter);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const siblingDelays = new Map();

        for (const { isIntersecting, intersectionRatio, target } of entries) {
          visibleNow.set(target, isIntersecting);

          if (!isIntersecting) {
            const wait =
              SETTLE_MS -
              (performance.now() - (enteredAt.get(target) ?? -Infinity));
            if (wait <= 0) reset(target);
            else
              setTimeout(() => {
                if (!visibleNow.get(target)) reset(target);
              }, wait);
            continue;
          }

          if (intersectionRatio < THRESHOLD) continue;
          if (target.classList.contains(cfg.enter)) continue;

          const firstTime = !seen.has(target);
          if (!firstTime && !allowed(direction)) continue;
          seen.add(target);

          if (cfg.delayVar) {
            const parent = target.parentElement;
            const delay = siblingDelays.get(parent) ?? 0;
            siblingDelays.set(
              parent,
              Math.min(delay + STAGGER_STEP, STAGGER_MAX),
            );
            target.style.setProperty(cfg.delayVar, `${delay}ms`);
          }

          target.classList.remove(cfg.enter);
          void target.offsetWidth;
          target.classList.add(cfg.enter);
          enteredAt.set(target, performance.now());
        }
      },
      { threshold: [0, THRESHOLD] },
    );

    section.querySelectorAll(cfg.targets).forEach((el) => observer.observe(el));
  });
})();
