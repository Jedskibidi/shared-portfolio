/**
 * @file loader.js
 * @path assets/js/loader.js
 * @summary Runs the page loader: counts 0 to 100% over about 2.4 seconds (fast to 30%, a pause, then a quick finish) with a progress bar, shows a waiting indicator (spinner and shimmering bar) whenever the count pauses, holds at 99% until the page has fully loaded, then fades the loader out while the header and hero drop into place (is-revealing class on html). Gives up waiting after a maximum time so nobody gets stuck. Fires a page-loader:done event on document when finished.
 */

const STEPS = [
  [0, 0],
  [800, 30],
  [1800, 30],
  [2400, 100],
];
const HOLD_MS = 250;
const WAIT_LOOKAHEAD_MS = 80;
const MAX_WAIT_MS = 7000;
const FADE_MS = 600;
const REVEAL_MS = 1800;

(() => {
  const root = document.documentElement;
  const loader = document.getElementById("pageLoader");
  if (!loader || !root.classList.contains("is-loading")) return;

  const count = loader.querySelector(".page-loader-count");
  const start = performance.now();
  let loaded = document.readyState === "complete";
  let finished = false;

  function render(value) {
    loader.style.setProperty("--progress", value / 100);
    count.textContent = value + "%";
  }

  function finish() {
    if (finished) return;
    finished = true;
    loader.classList.add("is-hiding");
    root.classList.add("is-revealing");
    setTimeout(() => root.classList.remove("is-revealing"), REVEAL_MS);
    setTimeout(() => {
      root.classList.remove("is-loading");
      loader.remove();
      document.dispatchEvent(new CustomEvent("page-loader:done"));
    }, FADE_MS);
  }

  function progressAt(elapsed) {
    for (let i = 1; i < STEPS.length; i++) {
      const [t1, v1] = STEPS[i];
      if (elapsed < t1) {
        const [t0, v0] = STEPS[i - 1];
        return Math.floor(v0 + ((v1 - v0) * (elapsed - t0)) / (t1 - t0));
      }
    }
    return 100;
  }

  function tick(now) {
    if (finished) return;
    const elapsed = now - start;
    const raw = progressAt(elapsed);
    const value = loaded ? raw : Math.min(raw, 99);
    const waiting =
      value < 100 &&
      (progressAt(elapsed + WAIT_LOOKAHEAD_MS) === raw ||
        (!loaded && raw >= 99));
    loader.classList.toggle("is-waiting", waiting);
    render(value);
    if (value >= 100) setTimeout(finish, HOLD_MS);
    else requestAnimationFrame(tick);
  }

  window.addEventListener(
    "load",
    () => {
      loaded = true;
    },
    { once: true },
  );
  requestAnimationFrame(tick);

  setTimeout(() => {
    render(100);
    finish();
  }, MAX_WAIT_MS);
})();
