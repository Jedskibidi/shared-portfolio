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
