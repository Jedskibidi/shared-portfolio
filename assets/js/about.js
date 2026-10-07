// About section effects. Everything here is optional polish: the section works without any of it.
(() => {
  const section = document.getElementById("about");
  if (!section) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasHover = window.matchMedia("(hover: hover)").matches;
  const hasObserver = "IntersectionObserver" in window;

  /* 1. Fade-in on scroll (CSS does the animation, we just add .in) */
  if (!reduced && hasObserver) {
    document.documentElement.classList.add("js-reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    section.querySelectorAll(".reveal").forEach((el) => {
      // Small delay between siblings so they appear one by one
      const index = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty("--i", index);
      revealObserver.observe(el);
    });
  }

  /* 2. Cursor spotlight on every tile + 3D tilt on the fact and count tiles */
  if (hasHover && !reduced) {
    section.querySelectorAll(".about-tile").forEach((el) => {
      const tilt =
        el.classList.contains("about-fact") ||
        el.classList.contains("about-stat");

      el.addEventListener("pointermove", (event) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        el.style.setProperty("--mx", x + "px");
        el.style.setProperty("--my", y + "px");

        if (tilt) {
          el.style.setProperty(
            "--ry",
            ((x / rect.width - 0.5) * 10).toFixed(2) + "deg",
          );
          el.style.setProperty(
            "--rx",
            ((0.5 - y / rect.height) * 10).toFixed(2) + "deg",
          );
        }
      });

      el.addEventListener("pointerleave", () => {
        el.style.removeProperty("--rx");
        el.style.removeProperty("--ry");
      });
    });
  }

  /* 3. Count-up numbers (they start from 0 when scrolled into view) */
  if (!reduced && hasObserver) {
    const numbers = section.querySelectorAll(".about-num[data-count]");

    const countUp = (el) => {
      const end = parseInt(el.dataset.count, 10) || 0;
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 },
    );

    numbers.forEach((el) => {
      el.textContent = "0";
      countObserver.observe(el);
    });
  }

  /* 4. GSAP: heading letters, drifting tiles, magnetic avatar.
          Skipped when GSAP is not loaded or animations are turned off. */
  if (reduced || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Heading: letters slide in one by one
  const heading = section.querySelector("h2");
  if (heading) {
    const text = heading.textContent.trim();
    heading.setAttribute("aria-label", text);
    heading.textContent = "";

    Array.from(text).forEach((char) => {
      const span = document.createElement("span");
      span.className = "about-char";
      span.setAttribute("aria-hidden", "true");
      span.textContent = char === " " ? "\u00A0" : char;
      heading.appendChild(span);
    });

    gsap.from(heading.querySelectorAll(".about-char"), {
      y: 30,
      opacity: 0,
      rotate: 8,
      duration: 0.6,
      stagger: 0.05,
      ease: "back.out(2)",
      scrollTrigger: { trigger: heading, start: "top 88%", once: true },
    });
  }

  // Tiles drift at slightly different speeds while scrolling (small on purpose, so they never overlap)
  const drifts = [
    [".about-photo-tile", 10],
    [".about-bio", -6],
    [".about-skills-tile", 6],
    [".about-stats", -8],
  ];
  drifts.forEach(([selector, amount]) => {
    const el = section.querySelector(selector);
    if (!el) return;

    gsap.fromTo(
      el,
      { y: amount },
      {
        y: -amount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );
  });

  // Magnetic avatar: the ring leans toward the cursor, then springs back
  const photoTile = section.querySelector(".about-photo-tile");
  const ring = section.querySelector(".about-ring");
  if (photoTile && ring && hasHover) {
    photoTile.addEventListener("pointermove", (event) => {
      const rect = photoTile.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      gsap.to(ring, {
        x: dx * 0.12,
        y: dy * 0.12,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    photoTile.addEventListener("pointerleave", () => {
      gsap.to(ring, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    });
  }
})();
