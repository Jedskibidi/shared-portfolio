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