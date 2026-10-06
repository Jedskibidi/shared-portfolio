document.querySelectorAll(".certificate-card").forEach((card) => {
    const images = card.querySelectorAll(".cert-img");
    if (images.length < 2) return; // 0 or 1 image, no buttons needed

    const prevBtn = card.querySelector(".cert-prev");
    const nextBtn = card.querySelector(".cert-next");
    const counter = card.querySelector(".cert-counter");
    let current = 0;

    function show(index) {
        current = (index + images.length) % images.length; // loops around
        images.forEach((img, i) => {
            img.hidden = i !== current;
        });
        counter.textContent = `${current + 1} / ${images.length}`;
    }

    prevBtn.addEventListener("click", () => show(current - 1));
    nextBtn.addEventListener("click", () => show(current + 1));
});