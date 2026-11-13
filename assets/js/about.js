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

  const skillList = section.querySelector(".about-skills");
  if (skillList) {
    const ROLL_START = 250; 
    const ROLL_STEP = 140; 
    const rand = (min, max) => min + Math.random() * (max - min);
    const sign = () => (Math.random() < 0.5 ? -1 : 1);

    const rollObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        rollObserver.disconnect();
        if (reducedMotion.matches) return;

        skillList.querySelectorAll(".about-skill").forEach((chip, index) => {
          chip.style.setProperty(
            "--about-roll-delay",
            `${ROLL_START + index * ROLL_STEP}ms`,
          );
          chip.style.setProperty(
            "--roll-x",
            `${Math.round(rand(30, 90)) * sign()}px`,
          );
          chip.style.setProperty(
            "--roll-y",
            `${Math.round(rand(-120, -60))}px`,
          );
          chip.style.setProperty("--roll-rx", sign());
          chip.style.setProperty("--roll-ry", sign());
          chip.style.setProperty("--roll-rz", sign());
          chip.classList.add("about-roll");
          chip.addEventListener(
            "animationend",
            () => chip.classList.remove("about-roll"),
            { once: true },
          );
        });
      },
      { threshold: 0.2 },
    );
    rollObserver.observe(skillList);
  }
})();
