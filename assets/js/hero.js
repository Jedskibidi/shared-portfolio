/**
 * @file hero.js
 * @path assets/js/hero.js
 * @summary Hero section: typewriter effect with a glow wave across the letters, and the hover/keyboard swap for the profile avatar.
 */

const typewriterEl = document.getElementById("typewriter");
const prefixEl = document.getElementById("typewriter-prefix");
const cursorEl = document.querySelector(".cursor");

const GLOW_DURATION = 2;
const GLOW_STEP = 0.12;

function renderLetters(el, str, offset) {
  while (el.children.length > str.length) {
    el.lastElementChild.remove();
  }
  for (let k = el.children.length; k < str.length; k++) {
    const span = document.createElement("span");
    span.className = "glow-letter";
    span.textContent = str[k];

    const t = performance.now() / 1000;
    const phase =
      (((t - (offset + k) * GLOW_STEP) % GLOW_DURATION) + GLOW_DURATION) %
      GLOW_DURATION;
    span.style.animationDelay = -phase + "s";

    el.appendChild(span);
  }
}

if (
  typewriterEl &&
  prefixEl &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const items = JSON.parse(typewriterEl.dataset.texts);
  let itemIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeTick() {
    const item = items[itemIndex];
    const full = item.prefix + item.text;

    charIndex += deleting ? -1 : 1;

    const prefixPart = full.slice(0, Math.min(charIndex, item.prefix.length));
    const textPart = full.slice(item.prefix.length, charIndex);

    prefixEl.textContent = prefixPart;
    typewriterEl.textContent = textPart;

    let delay = deleting ? 40 : 90;

    if (!deleting && charIndex === full.length) {
      delay = 4000;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      itemIndex = (itemIndex + 1) % items.length;
      delay = 400;
    }

    if (cursorEl)
      cursorEl.style.animation = charIndex === full.length ? "" : "none";

    setTimeout(typeTick, delay);
  }

  prefixEl.textContent = "";
  typewriterEl.textContent = "";
  typeTick();
}

const avatar = document.getElementById("avatar");

if (avatar && avatar.querySelector(".avatar-alt")) {
  const show = () => avatar.classList.add("is-alt");
  const hide = () => avatar.classList.remove("is-alt");
  const canHover = window.matchMedia("(hover: hover)").matches;

  if (canHover) {
    avatar.addEventListener("mouseenter", show);
    avatar.addEventListener("mouseleave", hide);
  } else {
    avatar.addEventListener("click", (e) => {
      e.stopPropagation();
      avatar.classList.toggle("is-alt");
    });
    document.addEventListener("click", hide);
  }

  avatar.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      avatar.classList.toggle("is-alt");
    }
  });
}
