// Toogle sa mobile menu
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => nav.classList.toggle("open"));

  // Close the mobile menu when a link is clicked
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
// Certificate viewer: click an image to see it full screen
const certOverlay = document.getElementById("certOverlay");
const certOverlayImg = document.getElementById("certOverlayImg");

if (certOverlay && certOverlayImg) {
  function closeCertOverlay() {
    certOverlay.classList.remove("open");
  }

  // Works for every certificate image, including ones added later
  document.addEventListener("click", (event) => {
    const img = event.target.closest(".cert-img");
    if (!img) return;

    // The circle grows from where the image was clicked
    certOverlay.style.setProperty("--x", event.clientX + "px");
    certOverlay.style.setProperty("--y", event.clientY + "px");

    certOverlayImg.src = img.src;
    certOverlayImg.alt = img.alt;
    certOverlay.classList.add("open");
  });

  // Close on click anywhere
  certOverlay.addEventListener("click", closeCertOverlay);

  // Close with Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && certOverlay.classList.contains("open")) {
      closeCertOverlay();
    }
  });
} // Contact form (email.php): send without leaving the page
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
// Email button: play a circular wipe, then go to email.php
const emailBtn = document.querySelector('a.contact-btn[href^="email.php"]');

if (emailBtn) {
  emailBtn.addEventListener("click", (event) => {
    // Let ctrl/cmd/shift-click still open in a new tab or window
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    // Skip the animation for people who turned animations off
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();

    // Keyboard clicks have no mouse position, so start from the button's center
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

    wipe.getBoundingClientRect(); // let the browser register the start state
    wipe.classList.add("open");

    setTimeout(() => {
      window.location.href = emailBtn.href;
    }, 500);
  });
}

window.addEventListener("pageshow", () => {
  document.querySelectorAll(".page-wipe").forEach((el) => el.remove());
});
