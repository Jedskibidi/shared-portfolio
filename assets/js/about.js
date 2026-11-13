(() => {
  const section = document.getElementById("about");
  if (
    !section ||
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        entry.target.classList.add("about-enter");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );

  section.querySelectorAll("[data-about-reveal]").forEach((block) => {
    observer.observe(block);
  });
})();
