// Projects row: auto-scroll na pwedeng i-drag, i-swipe, o i-scroll + zoom ng card
(function () {
    const row = document.querySelector('.nf-row');
    const track = row && row.querySelector('.nf-track');
    if (!row || !track) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SPEED = 0.6;            // px kada frame (mas mataas = mas mabilis)
    const RESUME_DELAY = 1500;    // ms bago tumuloy ang auto-scroll

    let pos = 0;
    let hovering = false;
    let dragging = false;
    let resumeAt = 0;
    let moved = 0;
    let startX = 0;
    let startScroll = 0;

    let pinned = null;            // card na pinindot (nananatiling zoomed)
    let hoverTimer;

    const half = () => track.scrollWidth / 2;

    // ===== Seamless loop =====
    function wrap() {
        const h = half();
        if (h <= 0) return;
        if (row.scrollLeft >= h) row.scrollLeft -= h;
        else if (row.scrollLeft <= 0) row.scrollLeft += h;
    }

    function pause() { resumeAt = performance.now() + RESUME_DELAY; }

    // Magsimula sa gitna para pwedeng pumunta sa magkabilang direksyon
    function init() {
        row.scrollLeft = half() / 2;
        pos = row.scrollLeft;
    }

    // ===== Zoom helpers =====
    function fullyVisible(card) {
        const c = card.getBoundingClientRect();
        const r = row.getBoundingClientRect();
        return c.left >= r.left + 8 && c.right <= r.right - 8;
    }

    function closeAll() {
        track.querySelectorAll('.is-open').forEach(function (c) {
            c.classList.remove('is-open');
        });
    }

    function unpin() {
        pinned = null;
        closeAll();
    }

    function centerCard(card) {
        const left = card.offsetLeft - (row.clientWidth - card.offsetWidth) / 2;
        row.scrollTo({ left: left, behavior: 'smooth' });
    }

    // ===== Mouse drag =====
    row.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;

        // Click sa labas ng card: isara ang pinned
        if (!e.target.closest('.nf-card')) unpin();

        // Huwag mag-drag kapag button/link ang pinindot
        if (e.target.closest('a, button')) return;

        dragging = true;
        moved = 0;
        startX = e.clientX;
        startScroll = row.scrollLeft;
        row.classList.add('is-dragging');
    });

    window.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        const dx = e.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        row.scrollLeft = startScroll - dx;
        wrap();
        startScroll = row.scrollLeft + dx;   // tamang offset pagkatapos mag-wrap
    });

    function endDrag() {
        if (!dragging) return;
        dragging = false;
        row.classList.remove('is-dragging');
        pause();
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Huwag mag-click ng link/button/card kapag drag ang ginawa
    row.addEventListener('click', function (e) {
        if (moved > 5) {
            e.preventDefault();
            e.stopPropagation();
            moved = 0;
        }
    }, true);

    // ===== Hover, touch, wheel: pause =====
    row.addEventListener('mouseenter', function () { hovering = true; });
    row.addEventListener('mouseleave', function () { hovering = false; pause(); });
    row.addEventListener('touchstart', pause, { passive: true });
    row.addEventListener('touchmove', pause, { passive: true });
    row.addEventListener('touchend', pause, { passive: true });

    row.addEventListener('wheel', function () {
        pause();
        unpin();
    }, { passive: true });

    // Habang nag-i-scroll ang user (touch/wheel), i-wrap
    row.addEventListener('scroll', function () {
        if (!dragging) wrap();
    }, { passive: true });

       // ===== Hover zoom (desktop) =====
    // Buo ang kita: zoom lang. Nasa gilid: dumulas muna sa gitna, tapos zoom (pinned).
    track.addEventListener('pointerover', function (e) {
        if (e.pointerType !== 'mouse' || pinned) return;
        const card = e.target.closest('.nf-card');
        if (!card || card.classList.contains('is-open')) return;

        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () {
            if (fullyVisible(card)) {
                closeAll();
                card.classList.add('is-open');
                return;
            }
            // Nasa gilid: pin, i-center, tapos zoom
            pinned = card;
            closeAll();
            centerCard(card);
            setTimeout(function () {
                if (pinned === card) card.classList.add('is-open');
            }, 450);
        }, 150);
    });

    track.addEventListener('pointerout', function (e) {
        if (e.pointerType !== 'mouse' || pinned) return;
        const card = e.target.closest('.nf-card');
        if (!card || card.contains(e.relatedTarget)) return;

        clearTimeout(hoverTimer);
        card.classList.remove('is-open');
    });

    // ===== Click/tap: i-center muna, tapos lumaki at manatili =====
    row.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;   // Play, Live Demo, GitHub: normal
        const card = e.target.closest('.nf-card');

        if (!card || card === pinned) {              // click ulit o sa labas: isara
            unpin();
            return;
        }

        pinned = card;
        clearTimeout(hoverTimer);
        track.querySelectorAll('.is-open').forEach(function (c) {
            if (c !== card) c.classList.remove('is-open');   // huwag isara ang mismong card (walang flicker)
        });

        centerCard(card);
        setTimeout(function () {
            if (pinned === card) card.classList.add('is-open');
        }, 350);                                      // hintayin matapos ang pag-center
        pause();
    });

    // Click sa labas ng projects row: isara ang pinned
    document.addEventListener('click', function (e) {
        if (pinned && !e.target.closest('.nf-row')) unpin();
    });

    // ===== Auto-scroll loop =====
    function frame(now) {
        const userBusy = hovering || dragging || now < resumeAt || track.querySelector('.is-open');

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

    window.addEventListener('load', init);
    init();
    requestAnimationFrame(frame);
})();