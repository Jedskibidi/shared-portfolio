(function () {
  var STORAGE_KEY = "theme";
  var DEFAULT = "light";

  var THEMES = [
    { id: "light", label: "Daybreak", colors: ["#FFF9E6", "#99C3E4"] },
    { id: "dark", label: "Nightfall", colors: ["#0F1A2A", "#99C3E4"] },
    {
      id: "strawberry",
      label: "Strawberry",
      colors: ["#FBF4DB", "#F06C78", "#8E9A5A"],
    },
    {
      id: "lavender",
      label: "Lavender",
      colors: ["#F4ECF6", "#7F5D93", "#D9C4DD"],
    },
    {
      id: "sunset",
      label: "Sunset",
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
  function reduceMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  // Changes the theme. `animate` is true only for user clicks (not for first load).
  function apply(id, animate) {
    if (!isValid(id)) id = DEFAULT;

    function commit() {
      if (id === DEFAULT) delete root.dataset.theme;
      else root.dataset.theme = id;
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch (e) {}
      markActive(id);
    }

    if (!animate || reduceMotion()) {
      commit();
      return;
    }

    if (document.startViewTransition) {
      // Circular reveal that starts from the Choose theme button (see themes.css)
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
      // Fallback: fade colours smoothly
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

  // Build the menu from THEMES
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

  // Sync with whatever the early <head> script applied (and repair a bad saved value)
  if (isValid(current())) markActive(current());
  else apply(DEFAULT, false);

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
