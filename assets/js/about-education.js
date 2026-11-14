/**
 * @file about-education.js
 * @path assets/js/about-education.js
 * @summary Education section behavior in the About section: 3D tilt on the cards, details popups for each school, and a full screen view of the diploma image.
 *
 * Tilt: on devices with a mouse, each card (.about-education-card) tilts toward the pointer and shows a light glare, and resets when the pointer leaves. It is skipped when reduced motion is requested.
 * Opening: buttons with data-education-open open the dialog whose id matches their value.
 * Closing: the close button (data-education-close), a click on the backdrop, or Esc closes the dialog.
 * Full screen image: clicking the image (data-education-lightbox) shows it full screen in the shared lightbox dialog.
 * Closing the lightbox: the X button (data-lightbox-close), a click outside the image, or Esc returns to the details popup.
 */

var lightbox = document.getElementById("education-lightbox");
var lightboxImage = lightbox
  ? lightbox.querySelector(".about-education-lightbox-image")
  : null;

document.querySelectorAll("[data-education-open]").forEach(function (button) {
  button.addEventListener("click", function () {
    var modal = document.getElementById(button.dataset.educationOpen);
    if (modal && modal.showModal) {
      modal.showModal();
    }
  });
});

document.querySelectorAll(".about-education-modal").forEach(function (modal) {
  modal.addEventListener("click", function (event) {
    if (
      event.target === modal ||
      event.target.closest("[data-education-close]")
    ) {
      modal.close();
    }
  });
});

if (lightbox && lightboxImage) {
  document
    .querySelectorAll("[data-education-lightbox]")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        var image = button.querySelector("img");
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.showModal();
      });
    });

  lightbox.addEventListener("click", function (event) {
    if (
      event.target === lightbox ||
      event.target.closest("[data-lightbox-close]")
    ) {
      lightbox.close();
    }
  });
}

if (
  window.matchMedia(
    "(hover: hover) and (prefers-reduced-motion: no-preference)",
  ).matches
) {
  document.querySelectorAll(".about-education-card").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      var rect = card.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width;
      var y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--tilt-y", (x - 0.5) * 12 + "deg");
      card.style.setProperty("--tilt-x", (0.5 - y) * 10 + "deg");
      card.style.setProperty("--glare-x", x * 100 + "%");
      card.style.setProperty("--glare-y", y * 100 + "%");
    });

    card.addEventListener("pointerleave", function () {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.removeProperty("--glare-x");
      card.style.removeProperty("--glare-y");
    });
  });
}
