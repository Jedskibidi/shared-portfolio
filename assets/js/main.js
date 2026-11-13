/**
 * @file main.js
 * @path assets/js/main.js
 * @summary Site-wide behavior: mobile menu toggle, active nav link tracking, certificate overlay, contact form submission without a page reload, and the circular wipe transition to email.php.
 */

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => nav.classList.toggle("open"));

  nav
    .querySelectorAll("a")
    .forEach((link) =>
      link.addEventListener("click", () => nav.classList.remove("open")),
    );
}

const sectionLinks = document.querySelectorAll('#nav a[href^="#"]');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      sectionLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + entry.target.id,
        );
      });
    });
  },
  {
    rootMargin: "-40% 0px -55% 0px",
  },
);

document
  .querySelectorAll("section[id]")
  .forEach((section) => activeObserver.observe(section));

window.addEventListener("scroll", () => {
  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;
  if (!atBottom) return;

  sectionLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#contact");
  });
});
const certOverlay = document.getElementById("certOverlay");
const certOverlayImg = document.getElementById("certOverlayImg");

if (certOverlay && certOverlayImg) {
  function closeCertOverlay() {
    certOverlay.classList.remove("open");
  }

  document.addEventListener("click", (event) => {
    const img = event.target.closest(".cert-img");
    if (!img) return;

    certOverlay.style.setProperty("--x", event.clientX + "px");
    certOverlay.style.setProperty("--y", event.clientY + "px");

    certOverlayImg.src = img.src;
    certOverlayImg.alt = img.alt;
    certOverlay.classList.add("open");
  });

  certOverlay.addEventListener("click", closeCertOverlay);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && certOverlay.classList.contains("open")) {
      closeCertOverlay();
    }
  });
}
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const formStatus = document.getElementById("formStatus");
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    formStatus.textContent = "Sending...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formStatus.textContent = "Thanks! Your message was sent.";
        contactForm.reset();
      } else {
        formStatus.textContent = "Something went wrong. Please try again.";
      }
    } catch (error) {
      formStatus.textContent = "Network error. Please try again.";
    }

    submitBtn.disabled = false;
  });
}
const emailBtn = document.querySelector('a.contact-btn[href^="email.php"]');

if (emailBtn) {
  emailBtn.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();

    let x = event.clientX;
    let y = event.clientY;
    if (x === 0 && y === 0) {
      const rect = emailBtn.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const wipe = document.createElement("div");
    wipe.className = "page-wipe";
    wipe.style.setProperty("--x", x + "px");
    wipe.style.setProperty("--y", y + "px");
    document.body.appendChild(wipe);

    wipe.getBoundingClientRect();
    wipe.classList.add("open");

    setTimeout(() => {
      window.location.href = emailBtn.href;
    }, 500);
  });
}

window.addEventListener("pageshow", () => {
  document.querySelectorAll(".page-wipe").forEach((el) => el.remove());
});
