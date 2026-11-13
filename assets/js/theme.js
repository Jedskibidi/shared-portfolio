/**
 * @file theme.js
 * @path assets/js/theme.js
 * @summary Theme picker: stores the chosen theme, applies it to the page, runs the circular reveal transition, and loads the matching profile gifs for the current theme.
 */

(function () {
  var STORAGE_KEY = "theme";
  var DEFAULT = "light";

  var THEMES = [
    {
      id: "light",
      label: "Daybreak",
      gif: "daybreak.gif",
      colors: ["#FFF9E6", "#99C3E4"],
    },
    {
      id: "dark",
      label: "Nightfall",
      gif: "nightfall.gif",
      colors: ["#0F1A2A", "#99C3E4"],
    },
    {
      id: "strawberry",
      label: "Strawberry",
      gif: "strawberry.gif",
      colors: ["#FBF4DB", "#F06C78", "#8E9A5A"],
    },
    {
      id: "lavender",
      label: "Lavender",
      gif: "lavender.gif",
      colors: ["#F4ECF6", "#7F5D93", "#D9C4DD"],
    },
    {
      id: "sunset",
      label: "Sunset",
      gif: "sunset.gif",
      colors: ["#FFF3E6", "#F2913D", "#BF3604"],
    },
  ];

  var root = document.documentElement;
  var btn = document.getElementById("themeBtn");
  var menu = document.getElementById("themeMenu");
  if (!btn || !menu) return;

  function isValid(id) {
    return THEMES.some(function (t) {
      return t.id === id;
    });
  }
  function current() {
    return root.dataset.theme || DEFAULT;
  }
  function markActive(id) {
    menu.querySelectorAll(".theme-option").forEach(function (el) {
      var on = el.dataset.themeId === id;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-pressed", on);
    });
  }
  var gifEls = Array.prototype.slice.call(
    document.querySelectorAll("[data-gif-dir]"),
  );
  function updateGif(id) {
    var t = THEMES.filter(function (x) {
      return x.id === id;
    })[0];
    if (!t || !t.gif) return;
    gifEls.forEach(function (el) {
      var next = el.dataset.gifDir + "/" + t.gif;
      if (el.getAttribute("src") !== next) el.src = next;
    });
  }
  gifEls.forEach(function (el) {
    el.addEventListener("error", function () {
      var failed = el.getAttribute("src");
      var fallback = el.dataset.gifDir + "/" + THEMES[0].gif;
      console.warn("Theme gif not found: " + failed);
      if (failed !== fallback) el.src = fallback;
      else el.removeAttribute("src");
    });
  });
  function reduceMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function apply(id, animate) {
    if (!isValid(id)) id = DEFAULT;

    function commit() {
      if (id === DEFAULT) delete root.dataset.theme;
      else root.dataset.theme = id;
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch (e) {}
      markActive(id);
      updateGif(id);
    }

    if (!animate || reduceMotion()) {
      commit();
      return;
    }

    if (document.startViewTransition) {
      var r = btn.getBoundingClientRect();
      var x = r.left + r.width / 2;
      var y = r.top + r.height / 2;
      var radius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      );
      root.style.setProperty("--theme-x", x + "px");
      root.style.setProperty("--theme-y", y + "px");
      root.style.setProperty("--theme-r", radius + "px");
      document.startViewTransition(commit);
    } else {
      root.classList.add("theme-switching");
      commit();
      setTimeout(function () {
        root.classList.remove("theme-switching");
      }, 500);
    }
  }
  function setOpen(open) {
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", open);
  }

  THEMES.forEach(function (t) {
    var opt = document.createElement("button");
    opt.type = "button";
    opt.className = "theme-option";
    opt.dataset.themeId = t.id;

    var sw = document.createElement("span");
    sw.className = "theme-swatch";
    (t.colors || []).forEach(function (c) {
      var dot = document.createElement("i");
      dot.style.background = c;
      sw.appendChild(dot);
    });

    var label = document.createElement("span");
    label.textContent = t.label;

    var check = document.createElement("i");
    check.className = "fa-solid fa-check";
    check.setAttribute("aria-hidden", "true");

    opt.append(sw, label, check);
    opt.addEventListener("click", function () {
      setOpen(false);
      btn.focus();
      if (t.id !== current()) apply(t.id, true);
    });
    menu.appendChild(opt);
  });

  if (isValid(current())) {
    markActive(current());
    updateGif(current());
  } else apply(DEFAULT, false);

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(menu.hidden);
  });
  document.addEventListener("click", function (e) {
    if (!menu.hidden && !menu.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) {
      setOpen(false);
      btn.focus();
    }
  });
})();
