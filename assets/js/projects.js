/**
 * @file projects.js
 * @path assets/js/projects.js
 * @summary Projects film row: auto-scroll, drag, loop wrap, and zoom/centering of the card under the cursor or tap.
 */

(function () {
  const row = document.querySelector(".nf-row");
  const track = row && row.querySelector(".nf-track");
  if (!row || !track) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SPEED = 0.6;
  const RESUME_DELAY = 1200;
  const OPEN_DELAY = 120;
  const CLOSE_DELAY = 150;
  const EDGE_MARGIN = window.innerWidth < 600 ? 8 : 32;

  let pos = 0;
  let dragging = false;
  let centering = false;
  let resumeAt = 0;
  let moved = 0;
  let startX = 0;
  let startScroll = 0;

  let mouseIn = false;
  let mx = 0,
    my = 0;
  let target = null;
  let openTimer, closeTimer;

  let pinned = null;
  let lastType = "mouse";

  const half = () => track.scrollWidth / 2;

  function wrap() {
    const h = half();
    if (h <= 0) return;
    if (row.scrollLeft >= h) row.scrollLeft -= h;
    else if (row.scrollLeft <= 0) row.scrollLeft += h;
  }

  function pause(ms) {
    resumeAt = performance.now() + (ms || RESUME_DELAY);
  }

  function init() {
    row.scrollLeft = half() / 2;
    pos = row.scrollLeft;
  }

  function closeAll() {
    track.querySelectorAll(".is-open").forEach(function (c) {
      c.classList.remove("is-open");
    });
  }

  function cardAtPoint() {
    const el = document.elementFromPoint(mx, my);
    if (!el || !row.contains(el)) return null;
    return el.closest(".nf-card");
  }

  function nudgeIntoView(card) {
    const c = card.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    let delta = 0;
    if (c.left < r.left + EDGE_MARGIN) delta = c.left - (r.left + EDGE_MARGIN);
    else if (c.right > r.right - EDGE_MARGIN)
      delta = c.right - (r.right - EDGE_MARGIN);
    if (delta)
      row.scrollTo({ left: row.scrollLeft + delta, behavior: "smooth" });
  }

  function centerCard(card, done) {
    const h = half();
    const maxLeft = track.scrollWidth - row.clientWidth;
    let dest = card.offsetLeft - (row.clientWidth - card.offsetWidth) / 2;

    if (dest < 40) {
      row.scrollLeft += h;
      dest += h;
    } else if (dest > maxLeft - 40) {
      row.scrollLeft -= h;
      dest -= h;
    }

    centering = true;
    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      centering = false;
      row.removeEventListener("scrollend", finish);
      if (done) done();
    }
    row.addEventListener("scrollend", finish);
    setTimeout(finish, 800);
    row.scrollTo({ left: dest, behavior: "smooth" });
  }

  function openCard(card) {
    closeAll();
    nudgeIntoView(card);
    card.classList.add("is-open");
  }

  function sync() {
    if (!mouseIn || dragging || pinned || lastType !== "mouse") return;

    const c = cardAtPoint();
    if (c === target) return;
    target = c;

    clearTimeout(openTimer);
    clearTimeout(closeTimer);

    if (c) {
      if (c.classList.contains("is-open")) return;
      openTimer = setTimeout(function () {
        if (cardAtPoint() === c) openCard(c);
      }, OPEN_DELAY);
    } else {
      closeTimer = setTimeout(function () {
        if (!cardAtPoint()) {
          closeAll();
          pause(300);
        }
      }, CLOSE_DELAY);
    }
  }

  row.addEventListener("pointerenter", function (e) {
    if (e.pointerType === "mouse") mouseIn = true;
  });

  row.addEventListener("pointermove", function (e) {
    lastType = e.pointerType;
    if (e.pointerType !== "mouse") return;
    mouseIn = true;
    mx = e.clientX;
    my = e.clientY;
    sync();
  });

  row.addEventListener("pointerleave", function (e) {
    if (e.pointerType !== "mouse") return;
    mouseIn = false;
    target = null;
    clearTimeout(openTimer);
    if (!pinned) closeAll();
    pause(300);
  });

  row.addEventListener("pointerdown", function (e) {
    lastType = e.pointerType;
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (e.target.closest("a, button")) return;

    dragging = true;
    moved = 0;
    startX = e.clientX;
    startScroll = row.scrollLeft;
    row.classList.add("is-dragging");
  });

  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 5) {
      closeAll();
      target = null;
    }
    row.scrollLeft = startScroll - dx;
    wrap();
    startScroll = row.scrollLeft + dx;
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    row.classList.remove("is-dragging");
    pause();
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  row.addEventListener(
    "click",
    function (e) {
      if (moved > 5) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    },
    true,
  );

  ["touchstart", "touchmove", "touchend"].forEach(function (t) {
    row.addEventListener(
      t,
      function () {
        pause();
      },
      { passive: true },
    );
  });

  row.addEventListener(
    "wheel",
    function () {
      pause();
      pinned = null;
      closeAll();
      target = null;
    },
    { passive: true },
  );

  row.addEventListener(
    "scroll",
    function () {
      if (!dragging && !centering) wrap();
    },
    { passive: true },
  );

  row.addEventListener("click", function (e) {
    if (e.target.closest("a, button")) return;
    const card = e.target.closest(".nf-card");

    if (lastType === "mouse") {
      if (card && !card.classList.contains("is-open")) openCard(card);
      return;
    }

    if (!card || card === pinned) {
      pinned = null;
      closeAll();
      return;
    }
    pinned = card;
    closeAll();
    centerCard(card, function () {
      if (pinned === card) card.classList.add("is-open");
    });
    pause(3000);
  });

  document.addEventListener("click", function (e) {
    if (pinned && !e.target.closest(".nf-row")) {
      pinned = null;
      closeAll();
    }
  });

  function frame(now) {
    if (mouseIn) sync();

    const userBusy =
      target ||
      dragging ||
      centering ||
      pinned ||
      now < resumeAt ||
      track.querySelector(".is-open");

    if (userBusy || reduce) {
      pos = row.scrollLeft;
    } else {
      pos += SPEED;
      row.scrollLeft = pos;
      wrap();
      pos = row.scrollLeft;
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("load", init);
  init();
  requestAnimationFrame(frame);
})();
