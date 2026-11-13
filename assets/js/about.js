/**
 * @file about.js
 * @path assets/js/about.js
 * @summary One-time staggered scroll reveal for the About section elements, using an IntersectionObserver and the about-enter class.
 */

(() => {
  const section = document.getElementById("about");
  if (!section || !("IntersectionObserver" in window)) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const siblingDelays = new Map();

      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;

        observer.unobserve(target);
        if (reducedMotion.matches) continue;

        const parent = target.parentElement;
        const delay = siblingDelays.get(parent) ?? 0;
        siblingDelays.set(parent, Math.min(delay + 40, 440));

        target.style.setProperty("--about-reveal-delay", `${delay}ms`);
        target.classList.add("about-enter");
      }
    },
    { threshold: 0.15 },
  );

  const targets = section.querySelectorAll(
    ".about-heading, .about-copy > *, .about-profile, .about-fact, " +
      ".about-stack-heading, .about-skill, .about-actions",
  );
  targets.forEach((target) => observer.observe(target));
})();
