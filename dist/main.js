const copyEmailBtn = document.getElementById("copy-email");
const emailText = document.getElementById("email-text");
const topnav = document.getElementById("topnav");
const copyEmailDefaultText = copyEmailBtn.dataset.defaultLabel ?? copyEmailBtn.textContent ?? "Copy";
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
copyEmailBtn.addEventListener("click", async () => {
    const email = emailText.textContent ?? "";
    try {
        await navigator.clipboard.writeText(email);
        copyEmailBtn.textContent = copyEmailBtn.dataset.copiedLabel ?? "Copied!";
    }
    catch {
        copyEmailBtn.textContent = copyEmailBtn.dataset.failedLabel ?? "Failed";
    }
    setTimeout(() => {
        copyEmailBtn.textContent = copyEmailDefaultText;
    }, 1500);
});
window.addEventListener("scroll", () => {
    topnav.classList.toggle("scrolled", window.scrollY > 10);
});
const sections = navLinks
    .map((link) => document.querySelector(link.hash))
    .filter((s) => s !== null);
function setActiveLink(id) {
    for (const link of navLinks) {
        link.classList.toggle("active", link.hash === `#${id}`);
    }
}
const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting)
            setActiveLink(entry.target.id);
    }
}, { rootMargin: "-40% 0px -55% 0px" });
for (const section of sections)
    sectionObserver.observe(section);
const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    }
}, { threshold: 0.15 });
for (const el of document.querySelectorAll(".reveal")) {
    revealObserver.observe(el);
}
export {};
