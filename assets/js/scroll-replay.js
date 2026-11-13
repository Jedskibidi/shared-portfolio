/*
 * scroll-replay.js
 * Replays "enter" animations every time an element scrolls back into view,
 * instead of only once. Replaces the one-time observer in about.js.
 *
 * HOW TO ADD A NEW SECTION LATER:
 *   Add one object to REPLAY_SECTIONS below. That's it.
 *
 * Each entry:
 *   section : CSS selector of the section wrapper
 *   targets : CSS selector (inside the section) of the elements to animate
 *   enter   : class that triggers the CSS animation (must exist in your CSS)
 *   delayVar: CSS variable used for stagger delay (optional, set to null to skip)
 */

// "both" = replay on scroll down AND up
// "up"   = replay only when scrolling up (first reveal on the way down still plays)
// "down" = replay only when scrolling down
const REPLAY_MODE = "both";

const THRESHOLD = 0.15; // how much of the element must be visible
const STAGGER_STEP = 40; // ms between siblings
const STAGGER_MAX = 440; // ms cap
const SETTLE_MS = 1500; // an element can't reset until its animation has had this long

const REPLAY_SECTIONS = [
  {
    section: "#about",
    targets:
      ".about-heading, .about-copy > *, .about-profile, .about-fact, " +
      ".about-stack-heading, .about-skill, .about-actions",
    enter: "about-enter",
    delayVar: "--about-reveal-delay",
  },
  // Generic: any element with a data-replay attribute, anywhere on the page.
  // data-replay            -> slides up
  // data-replay="fade"     -> fades in
  // data-replay="zoom"     -> zooms in
  // data-replay="left" / "right" -> slides in from that side
  // New portfolio items only need the attribute in the PHP, no JS changes.
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

  // Track scroll direction
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

    const seen = new WeakSet(); // elements that already played once
    const visibleNow = new WeakMap(); // latest known "on screen" state per element
    const enteredAt = new WeakMap(); // when the animation was last started

    // The enter animation moves/scales the element, which changes how much of it
    // is visible. Without a guard, an element sitting at the screen edge would
    // flip between "entered" and "left" forever (flicker). So:
    //  - play when at least THRESHOLD of it is visible
    //  - only reset once it is completely off screen AND the animation has had
    //    time to finish (SETTLE_MS)
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

          // Visible, but not enough yet (or already playing): do nothing
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

          // Restart the animation
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
