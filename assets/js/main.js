// Toogle sa mobile menu
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (navToggle && nav) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));

    // Close the mobile menu when a link is clicked
    nav.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', () => nav.classList.remove('open'))
    );
}

const sectionLinks = document.querySelectorAll('#nav a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        sectionLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
    });
}, {
    rootMargin: '-40% 0px -55% 0px'
});

document.querySelectorAll('section[id]').forEach((section) => activeObserver.observe(section));

window.addEventListener('scroll', () => {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (!atBottom) return;

    sectionLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#contact');
    });
});
// Certificate viewer: click an image to see it full screen
const certOverlay = document.getElementById('certOverlay');
const certOverlayImg = document.getElementById('certOverlayImg');

if (certOverlay && certOverlayImg) {
    function closeCertOverlay() {
        certOverlay.classList.remove('open');
    }

    // Works for every certificate image, including ones added later
    document.addEventListener('click', (event) => {
        const img = event.target.closest('.cert-img');
        if (!img) return;

        // The circle grows from where the image was clicked
        certOverlay.style.setProperty('--x', event.clientX + 'px');
        certOverlay.style.setProperty('--y', event.clientY + 'px');

        certOverlayImg.src = img.src;
        certOverlayImg.alt = img.alt;
        certOverlay.classList.add('open');
    });

    // Close on click anywhere
    certOverlay.addEventListener('click', closeCertOverlay);

    // Close with Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && certOverlay.classList.contains('open')) {
            closeCertOverlay();
        }
    });
}