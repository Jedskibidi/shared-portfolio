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
      ".about-stack-heading, .about-actions",
  );
  targets.forEach((target) => observer.observe(target));

  // Tech stack: chips are thrown in like dice, one after another.
  const skillList = section.querySelector(".about-skills");
  if (skillList) {
    const ROLL_START = 250; // ms, lets the "Tech stack" heading appear first
    const ROLL_STEP = 190; // ms between each chip starting its roll

    const rollObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        rollObserver.disconnect();
        if (reducedMotion.matches) return;

        skillList.querySelectorAll(".about-skill").forEach((chip, index) => {
          const height = chip.offsetHeight || 36;
          // A die rolls one side-length per 90deg flip: 4 flips = 4 heights.
          chip.style.setProperty("--roll-dist", `${height * 4}px`);
          chip.style.setProperty(
            "--roll-hop",
            `${Math.round(height * 0.45)}px`,
          );
          chip.style.setProperty(
            "--about-roll-delay",
            `${ROLL_START + index * ROLL_STEP}ms`,
          );
          chip.classList.add("about-roll");
          // Drop the helper class once the roll finishes (the chip rests at its normal style).
          chip.addEventListener(
            "animationend",
            (event) => {
              if (event.animationName === "about-skill-roll-fade")
                chip.classList.remove("about-roll");
            },
            { once: false },
          );
        });
      },
      { threshold: 0.2 },
    );
    rollObserver.observe(skillList);
  }
})();

