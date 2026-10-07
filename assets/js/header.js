
// Logo: letra na tinututukan ay lumalaki nang konti (mouse at touch)
(function () {
    const logo = document.querySelector('.site-header .logo');
    if (!logo) return;

    // Hatiin sa letter spans (kasama ang initial at ang tuldok)
    const letters = [];
    function wrap(node) {
        Array.from(node.childNodes).forEach(function (child) {
            if (child.nodeType === 3) {
                const frag = document.createDocumentFragment();
                child.textContent.split('').forEach(function (ch) {
                    const s = document.createElement('span');
                    s.className = 'logo-letter';
                    s.textContent = ch;
                    letters.push(s);
                    frag.appendChild(s);
                });
                node.replaceChild(frag, child);
            } else if (child.nodeType === 1) {
                wrap(child);
            }
        });
    }
    wrap(logo);

    const MAX = 1.55;      // laki ng letrang direktang tinututukan
    const RADIUS = 45;     // gaano kalayo (px) ang naaapektuhan

    function update(x) {
        letters.forEach(function (el) {
            const r = el.getBoundingClientRect();
            const d = Math.abs(x - (r.left + r.width / 2));
            const t = Math.max(0, 1 - d / RADIUS);
            const scale = 1 + (MAX - 1) * t * t;
            el.style.transform = 'translateY(' + (-6 * t) + 'px) scale(' + scale.toFixed(3) + ')';
        });
    }

    function reset() {
        letters.forEach(function (el) { el.style.transform = ''; });
    }

    logo.addEventListener('pointermove', function (e) { update(e.clientX); });
    logo.addEventListener('pointerdown', function (e) { update(e.clientX); });
    logo.addEventListener('pointerleave', reset);
    logo.addEventListener('pointerup', reset);
    logo.addEventListener('pointercancel', reset);
})();
// Habang nag-i-scroll galing sa click, guhit lang sa pinindot na link ang lalabas
(function () {
    const navEl = document.getElementById('nav');
    if (!navEl) return;

    const links = Array.from(navEl.querySelectorAll('a'));
    let timer;

    function unlock() {
        navEl.classList.remove('nav-locked');
        links.forEach(function (l) { l.classList.remove('nav-target'); });
    }

    links.forEach(function (link) {
        link.addEventListener('click', function () {
            links.forEach(function (l) { l.classList.toggle('nav-target', l === link); });
            navEl.classList.add('nav-locked');
            clearTimeout(timer);
            timer = setTimeout(unlock, 1200);   // dagdagan kung malayo ang scroll
        });
    });

    // Kapag tapos na ang scroll, mag-unlock agad
    window.addEventListener('scrollend', function () {
        clearTimeout(timer);
        timer = setTimeout(unlock, 100);
    });

    // Kapag nag-scroll ang user mismo (wheel/touch), mag-unlock
    ['wheel', 'touchstart'].forEach(function (ev) {
        window.addEventListener(ev, unlock, { passive: true });
    });
})();