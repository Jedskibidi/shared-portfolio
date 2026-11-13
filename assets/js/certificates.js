/* Certificates section: 3D coverflow carousel, issuer filter, tilt, lightbox, confetti.
   Waits for DOMContentLoaded because gsap / ScrollTrigger / VanillaTilt / confetti load with `defer`. */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("certificates");
  const stage = document.getElementById("cxStage");
  if (!section || !stage) return;

  const allItems = [...stage.querySelectorAll(".cx-item")];
  const cards = [...stage.querySelectorAll(".cx-card")];
  const pipsEl = document.getElementById("cxPips");
  const countEl = document.getElementById("certsCount");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";

  stage.classList.add("cx-js");

  /* ---------- per-card state (multi-image certificates) ---------- */
  const state = new Map();
  cards.forEach((card) => {
    let images = [];
    try {
      images = JSON.parse(card.dataset.images || "[]");
    } catch (e) {}
    state.set(card, { images, idx: 0 });
  });

  function setSlide(card, k) {
    const s = state.get(card);
    const img = card.querySelector(".cx-media img");
    if (!s || !img || !s.images.length) return;
    s.idx = (k + s.images.length) % s.images.length;
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = s.images[s.idx];
      img.style.opacity = 1;
    }, 160);
    card
      .querySelectorAll(".cx-dots i")
      .forEach((d, i) => d.classList.toggle("on", i === s.idx));
  }

  /* ---------- coverflow ---------- */
  let visible = allItems.slice();
  const mid = () => Math.floor((visible.length - 1) / 2);
  let idx = mid();
  let ready = false;

  function syncTilt() {
    if (typeof VanillaTilt === "undefined" || reduce) return;
    cards.forEach((c) => {
      const active = c.closest(".cx-item").classList.contains("is-active");
      if (active && !c.vanillaTilt) {
        VanillaTilt.init(c, {
          max: 7,
          speed: 400,
          scale: 1.01,
          perspective: 1000,
        });
      } else if (!active && c.vanillaTilt) {
        c.vanillaTilt.destroy();
        c.style.transform = "";
      }
    });
  }

  function syncPips() {
    [...pipsEl.children].forEach((p, i) => p.classList.toggle("on", i === idx));
  }

  function buildPips() {
    pipsEl.innerHTML = "";
    visible.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cx-pip";
      b.setAttribute("aria-label", "Show certificate " + (i + 1));
      b.addEventListener("click", () => go(i));
      pipsEl.append(b);
    });
  }

  /* animation that plays on the card that just moved to the front */
  let lastActive = null,
    prevIdx = idx;
  function pulse(item, dir) {
    if (reduce) return;
    item.style.setProperty("--cx-dir", dir);
    item.classList.remove("cx-pulse", "cx-swept");
    void item.offsetWidth;
    item.classList.add("cx-pulse", "cx-swept");
    clearTimeout(item._pulseTimer);
    item._pulseTimer = setTimeout(
      () => item.classList.remove("cx-pulse"),
      1000,
    );
  }

  function layout() {
    const n = visible.length;
    if (!n) return;
    const w = visible[0].offsetWidth;
    visible.forEach((item, i) => {
      let o = i - idx;
      if (o > n / 2) o -= n;
      else if (o < -n / 2) o += n;
      const a = Math.abs(o);
      item.classList.toggle("is-active", o === 0);
      item.style.zIndex = 100 - a;
      item.style.pointerEvents = a > 2 ? "none" : "";
      item.style.opacity = a > 2 ? 0 : 1 - a * 0.22;
      item.style.transform =
        "translateX(" +
        o * w * 0.6 +
        "px) translateZ(" +
        -a * 130 +
        "px) rotateY(" +
        -o * 32 +
        "deg) scale(" +
        (1 - a * 0.04) +
        ")";
    });
    const act = visible[idx];
    if (lastActive && act !== lastActive) {
      let delta = idx - prevIdx;
      if (delta > n / 2) delta -= n;
      else if (delta < -n / 2) delta += n;
      pulse(act, delta >= 0 ? 1 : -1);
    }
    lastActive = act;
    prevIdx = idx;
    syncTilt();
    syncPips();
  }

  function go(i) {
    idx = i;
    if (ready) {
      layout();
      if (timer) startAuto();
    }
  }
  function step(d) {
    const n = visible.length;
    if (n > 1) go((idx + d + n) % n);
  }

  /* ---------- autoplay (pauses on hover/focus, off-screen, lightbox, or via the pause button) ---------- */
  const DELAY = 1500;
  const playBtn = document.getElementById("cxPlay");
  let timer = null,
    inView = false,
    hovering = false,
    userPaused = false;
  pipsEl.style.setProperty("--cx-delay", DELAY + "ms");

  function stopAuto() {
    clearInterval(timer);
    timer = null;
    pipsEl.classList.remove("playing");
  }
  function startAuto() {
    stopAuto();
    if (reduce || visible.length < 2) return;
    pipsEl.classList.add("playing");
    timer = setInterval(() => {
      const lbOpen = document.getElementById("cxLb").classList.contains("open");
      if (!document.hidden && !lbOpen) step(1);
    }, DELAY);
  }
  function resumeAuto() {
    if (ready && inView && !hovering && !userPaused) startAuto();
    else stopAuto();
  }

  [stage, document.querySelector(".cx-controls")].forEach((el) => {
    el.addEventListener("mouseenter", () => {
      hovering = true;
      resumeAuto();
    });
    el.addEventListener("mouseleave", () => {
      hovering = false;
      resumeAuto();
    });
    el.addEventListener("focusin", () => {
      hovering = true;
      resumeAuto();
    });
    el.addEventListener("focusout", () => {
      hovering = false;
      resumeAuto();
    });
  });
  stage.addEventListener("pointerup", (e) => {
    if (e.pointerType === "touch") {
      hovering = true;
      resumeAuto();
      setTimeout(() => {
        hovering = false;
        resumeAuto();
      }, 6000);
    }
  });
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      userPaused = !userPaused;
      playBtn.setAttribute(
        "aria-label",
        userPaused ? "Resume autoplay" : "Pause autoplay",
      );
      playBtn.firstElementChild.className = userPaused
        ? "fa-solid fa-play"
        : "fa-solid fa-pause";
      resumeAuto();
    });
    if (reduce) playBtn.style.display = "none";
  }

  document.getElementById("cxPrev").addEventListener("click", () => step(-1));
  document.getElementById("cxNext").addEventListener("click", () => step(1));
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
  });
  window.addEventListener("resize", () => {
    if (ready) layout();
  });

  /* swipe / drag */
  let startX = null,
    suppress = false;
  stage.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
  });
  stage.addEventListener("pointercancel", () => {
    startX = null;
  });
  stage.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) {
      step(dx < 0 ? 1 : -1);
      suppress = true;
      setTimeout(() => (suppress = false), 60);
    }
  });

  /* ---------- count-up ---------- */
  function animateCount(n) {
    if (!countEl) return;
    if (!hasGsap || reduce) {
      countEl.textContent = n;
      return;
    }
    const o = { v: Number(countEl.textContent) || 0 };
    gsap.to(o, {
      v: n,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => (countEl.textContent = Math.round(o.v)),
    });
  }
  if (countEl && hasGsap && !reduce) countEl.textContent = 0;

  /* ---------- reveal: cards fan out from the middle when scrolled into view ---------- */
  let sweepTimers = [];
  function makeReady() {
    if (ready) return;
    ready = true;
    stage.classList.add("is-ready");
    layout();
    sweepTimers = visible.map((it, i) =>
      setTimeout(() => it.classList.add("cx-swept"), 600 + i * 150),
    );
    animateCount(visible.length);
  }

  /* replay: when the section fully leaves the screen, reset so the fan-out plays again */
  function resetReveal() {
    if (!ready) return;
    ready = false;
    stopAuto();
    sweepTimers.forEach(clearTimeout);
    sweepTimers = [];
    stage.classList.remove("is-ready");
    allItems.forEach((it) => {
      it.classList.remove("cx-swept", "cx-pulse");
      it.style.opacity = "";
      it.style.transform = "";
    });
    idx = mid();
    lastActive = null;
    if (countEl && hasGsap && !reduce) countEl.textContent = 0;
  }
  buildPips();
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        if (inView) makeReady();
        resumeAuto();
      },
      { threshold: 0.25 },
    );
    io.observe(stage);
    new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) resetReveal();
      },
      { threshold: 0 },
    ).observe(stage);
  } else {
    inView = true;
    makeReady();
    resumeAuto();
  }

  /* ---------- cursor spotlight / glare / holo ---------- */
  stage.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".cx-card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    card.style.setProperty("--mx", x + "px");
    card.style.setProperty("--my", y + "px");
    card.style.setProperty("--px", (x / r.width) * 100 + "%");
    card.style.setProperty("--py", (y / r.height) * 100 + "%");
  });

  /* ---------- clicks: centre a side card, otherwise pager / lightbox ---------- */
  stage.addEventListener("click", (e) => {
    if (suppress) return;
    const item = e.target.closest(".cx-item");
    if (!item) return;
    const vi = visible.indexOf(item);
    if (vi !== idx) {
      go(vi);
      return;
    }
    const card = item.querySelector(".cx-card");
    const pager = e.target.closest(".cx-pager button");
    if (pager) {
      setSlide(card, state.get(card).idx + Number(pager.dataset.dir));
      return;
    }
    if (e.target.closest(".cx-media") && state.get(card).images.length)
      openLb(card);
  });

  /* ---------- filter ---------- */
  section.querySelectorAll(".certs-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      section
        .querySelectorAll(".certs-chip")
        .forEach((c) => c.classList.toggle("is-active", c === chip));
      const f = chip.dataset.filter;
      allItems.forEach((item) => {
        item.hidden = !(f === "all" || item.dataset.issuer === f);
      });
      visible = allItems.filter((i) => !i.hidden);
      idx = mid();
      buildPips();
      if (ready) layout();
      animateCount(visible.length);
    });
  });

  /* ---------- heading: split into letters ---------- */
  const h2 = section.querySelector("h2");
  const chars = [];
  if (h2 && hasGsap && !reduce) {
    const text = h2.textContent.trim();
    h2.setAttribute("aria-label", text);
    h2.textContent = "";
    [...text].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "cx-ch";
      s.setAttribute("aria-hidden", "true");
      s.textContent = ch === " " ? "\u00A0" : ch;
      h2.append(s);
      chars.push(s);
    });
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(chars, {
        yPercent: 110,
        rotate: 8,
        opacity: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: h2, start: "top 90%", once: true },
      });
    }
  }

  /* ---------- confetti (current theme colours) ---------- */
  let lastBurst = 0;
  function burst() {
    if (typeof confetti === "undefined" || reduce) return;
    const now = Date.now();
    if (now - lastBurst < 4000) return;
    lastBurst = now;
    const cs = getComputedStyle(document.documentElement);
    const colors = ["--color-accent", "--color-primary", "--color-accent-hover"]
      .map((v) => cs.getPropertyValue(v).trim())
      .filter(Boolean);
    confetti({
      particleCount: 80,
      spread: 75,
      startVelocity: 38,
      origin: { y: 0.7 },
      colors,
      zIndex: 1100,
      ticks: 180,
    });
  }

  /* ---------- lightbox ---------- */
  const lb = document.getElementById("cxLb");
  const lbImg = document.getElementById("cxLbImg");
  const lbCap = document.getElementById("cxLbCap");
  const lbPrev = document.getElementById("cxLbPrev");
  const lbNext = document.getElementById("cxLbNext");
  let lbCard = null,
    lbIdx = 0,
    lastFocus = null;

  function renderLb() {
    const s = state.get(lbCard);
    const c = lbCard.dataset;
    lbImg.src = s.images[lbIdx];
    lbImg.alt = c.title;
    lbCap.innerHTML = "";
    lbCap.append(c.title);
    const small = document.createElement("small");
    small.textContent =
      `${c.issuer} · ${c.date}` +
      (s.images.length > 1 ? ` · ${lbIdx + 1}/${s.images.length}` : "");
    lbCap.append(small);
    lbPrev.style.display = lbNext.style.display =
      s.images.length > 1 ? "" : "none";
  }
  function openLb(card) {
    lbCard = card;
    lbIdx = state.get(card).idx;
    lastFocus = document.activeElement;
    renderLb();
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("cxLbClose").focus();
    burst();
  }
  function closeLb() {
    if (!lb.classList.contains("open")) return;
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lbCard) setSlide(lbCard, lbIdx);
    if (lastFocus) lastFocus.focus();
  }
  function stepLb(d) {
    const n = state.get(lbCard).images.length;
    if (n < 2) return;
    lbIdx = (lbIdx + d + n) % n;
    renderLb();
  }
  lbPrev.addEventListener("click", () => stepLb(-1));
  lbNext.addEventListener("click", () => stepLb(1));
  document.getElementById("cxLbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") stepLb(-1);
    if (e.key === "ArrowRight") stepLb(1);
  });
});
