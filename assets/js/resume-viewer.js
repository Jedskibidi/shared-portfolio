// View-only resume viewer (PDF.js) + "Request full resume" form.
// Note: this discourages casual saving/printing. It cannot stop screenshots.
(function () {
  const openBtn = document.getElementById("viewResumeBtn");
  const overlay = document.getElementById("resumeViewer");
  if (!openBtn || !overlay) return;

  const PDFJS_BASE = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";

  const src = overlay.dataset.src;
  const watermark = overlay.dataset.watermark || "";

  const pagesEl = document.getElementById("rvPages");
  const loadingEl = document.getElementById("rvLoading");
  const viewPanel = document.getElementById("rvViewPanel");
  const requestPanel = document.getElementById("rvRequestPanel");
  const requestBtn = document.getElementById("rvRequestBtn");
  const backBtn = document.getElementById("rvBackBtn");
  const closeBtn = document.getElementById("rvCloseBtn");

  let pdfDoc = null;
  let loadStarted = false;
  let renderToken = 0;
  let lastWidth = 0;
  let lastFocus = null;

  // ---- Load PDF.js only when someone actually opens the viewer ----
  let pdfLibPromise = null;
  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (!pdfLibPromise) {
      pdfLibPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = PDFJS_BASE + "pdf.min.js";
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            PDFJS_BASE + "pdf.worker.min.js";
          resolve(window.pdfjsLib);
        };
        script.onerror = () => {
          pdfLibPromise = null;
          reject(new Error("Could not load PDF.js"));
        };
        document.head.appendChild(script);
      });
    }
    return pdfLibPromise;
  }

  // Watermark is painted into the canvas pixels, so removing an element
  // in dev tools does not remove it.
  function drawWatermark(ctx, width, height, dpr) {
    if (!watermark) return;
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = "#1F2F46";
    ctx.font = "600 " + Math.round(18 * dpr) + "px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);

    const stepX = 340 * dpr;
    const stepY = 130 * dpr;
    const reach = Math.hypot(width, height);
    let row = 0;
    for (let y = -reach; y < reach; y += stepY, row++) {
      const shift = (row % 2) * (stepX / 2);
      for (let x = -reach; x < reach; x += stepX) {
        ctx.fillText(watermark, x + shift, y);
      }
    }
    ctx.restore();
  }

  async function renderPages() {
    if (!pdfDoc) return;
    const token = ++renderToken;
    const available = pagesEl.clientWidth || viewPanel.clientWidth;
    if (!available) return;
    lastWidth = available;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = Math.min(available, 820);
    pagesEl.textContent = "";

    for (let n = 1; n <= pdfDoc.numPages; n++) {
      const page = await pdfDoc.getPage(n);
      if (token !== renderToken) return;

      const base = page.getViewport({ scale: 1 });
      const scale = (cssWidth / base.width) * dpr;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.className = "rv-page";
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = viewport.width / dpr + "px";
      canvas.style.height = viewport.height / dpr + "px";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Resume page " + n);
      pagesEl.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;
      if (token !== renderToken) return;
      drawWatermark(ctx, canvas.width, canvas.height, dpr);
    }
  }

  async function loadResume() {
    if (loadStarted) return;
    loadStarted = true;
    loadingEl.hidden = false;
    loadingEl.textContent = "Loading resume...";

    try {
      const lib = await loadPdfJs();
      pdfDoc = await lib.getDocument({ url: src }).promise;
      loadingEl.hidden = true;
      await renderPages();
    } catch (error) {
      loadStarted = false;
      loadingEl.hidden = false;
      loadingEl.textContent =
        "Sorry, the preview could not be loaded. Please try again or request the full resume.";
    }
  }

  // ---- Panels ----
  function showPanel(name) {
    const request = name === "request";
    viewPanel.hidden = request;
    requestPanel.hidden = !request;
    requestBtn.hidden = request;
    backBtn.hidden = !request;
    if (
      !request &&
      pdfDoc &&
      pagesEl.clientWidth &&
      pagesEl.clientWidth !== lastWidth
    ) {
      renderPages();
    }
    (request ? requestPanel : viewPanel).scrollTop = 0;
  }

  // ---- Open / close ----
  function openViewer() {
    lastFocus = document.activeElement;
    showPanel("view");
    overlay.hidden = false;
    document.body.classList.add("rv-lock");
    closeBtn.focus();
    loadResume();
  }

  function closeViewer() {
    overlay.hidden = true;
    document.body.classList.remove("rv-lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  openBtn.addEventListener("click", openViewer);
  closeBtn.addEventListener("click", closeViewer);
  requestBtn.addEventListener("click", () => showPanel("request"));
  backBtn.addEventListener("click", () => showPanel("view"));

  // Click on the dark backdrop closes it
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeViewer();
  });

  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;

    if (event.key === "Escape") {
      closeViewer();
      return;
    }

    // Block save / print shortcuts while the viewer is open
    if (
      (event.ctrlKey || event.metaKey) &&
      ["s", "p"].includes(event.key.toLowerCase())
    ) {
      event.preventDefault();
      return;
    }

    // Keep keyboard focus inside the dialog
    if (event.key === "Tab") {
      const focusable = Array.from(
        overlay.querySelectorAll("button, input, textarea, a[href]"),
      ).filter(
        (el) => !el.hidden && !el.closest("[hidden]") && el.tabIndex !== -1,
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // No right-click / drag on the preview
  viewPanel.addEventListener("contextmenu", (event) => event.preventDefault());
  viewPanel.addEventListener("dragstart", (event) => event.preventDefault());

  // Re-draw pages if the window size changes
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (overlay.hidden || viewPanel.hidden || !pdfDoc) return;
      if (pagesEl.clientWidth !== lastWidth) renderPages();
    }, 250);
  });

  // ---- Request form: send without leaving the page (same flow as email.php) ----
  const requestForm = document.getElementById("rvRequestForm");

  if (requestForm) {
    const statusEl = document.getElementById("rvFormStatus");
    const submitBtn = requestForm.querySelector('button[type="submit"]');

    requestForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      submitBtn.disabled = true;
      statusEl.textContent = "Sending...";

      try {
        const response = await fetch(requestForm.action, {
          method: "POST",
          body: new FormData(requestForm),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          statusEl.textContent =
            "Request sent! You will hear back by email if it is approved.";
          requestForm.reset();
        } else {
          statusEl.textContent = "Something went wrong. Please try again.";
        }
      } catch (error) {
        statusEl.textContent = "Network error. Please try again.";
      }

      submitBtn.disabled = false;
    });
  }
})();
