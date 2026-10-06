// Typewriter effect na may glow na dumadaan sa bawat letra
const typewriterEl = document.getElementById('typewriter');
const prefixEl = document.getElementById('typewriter-prefix');
const cursorEl = document.querySelector('.cursor');

const GLOW_DURATION = 2;   // seconds, dapat tugma sa CSS
const GLOW_STEP = 0.12;    // delay kada letra (mas malaki = mas mabagal ang alon)

// Gumagawa/nag-aalis ng letter spans nang hindi ni-re-render ang mga existing,
// para tuloy-tuloy ang animation nila
function renderLetters(el, str, offset) {
    while (el.children.length > str.length) {
        el.lastElementChild.remove();
    }
    for (let k = el.children.length; k < str.length; k++) {
        const span = document.createElement('span');
        span.className = 'glow-letter';
        span.textContent = str[k];

        // i-sync ang phase para tuloy-tuloy ang alon kahit bagong letra
        const t = performance.now() / 1000;
        const phase = (((t - (offset + k) * GLOW_STEP) % GLOW_DURATION) + GLOW_DURATION) % GLOW_DURATION;
        span.style.animationDelay = (-phase) + 's';

        el.appendChild(span);
    }
}

if (typewriterEl && prefixEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

        if (cursorEl) cursorEl.style.animation = (charIndex === full.length) ? '' : 'none';

        setTimeout(typeTick, delay);
    }

    prefixEl.textContent = '';
    typewriterEl.textContent = '';
    typeTick();
}