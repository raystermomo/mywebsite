const STORAGE_KEY = "raystermomo-photo";
const photoBox = document.getElementById("photo-box");
const photo = document.getElementById("photo");
const photoHint = document.getElementById("photo-hint");
const photoInput = document.getElementById("photo-input");
const copyEmailBtn = document.getElementById("copy-email");
const emailText = document.getElementById("email-text");
const topnav = document.getElementById("topnav");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
function showPhoto(dataUrl) {
    photo.src = dataUrl;
    photo.hidden = false;
    photoHint.hidden = true;
    photoBox.classList.add("has-image");
    try {
        localStorage.setItem(STORAGE_KEY, dataUrl);
    }
    catch {
        /* image too large for localStorage; still displayed */
    }
}
function loadImageFile(file) {
    if (!file.type.startsWith("image/"))
        return;
    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result === "string")
            showPhoto(reader.result);
    };
    reader.readAsDataURL(file);
}
photoBox.addEventListener("click", () => photoInput.click());
photoBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        photoInput.click();
    }
});
photoInput.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (file)
        loadImageFile(file);
    photoInput.value = "";
});
document.addEventListener("paste", (e) => {
    const items = e.clipboardData?.items;
    if (!items)
        return;
    for (const item of items) {
        if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
                loadImageFile(file);
                e.preventDefault();
                break;
            }
        }
    }
});
photoBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    photoBox.classList.add("dragover");
});
photoBox.addEventListener("dragleave", () => {
    photoBox.classList.remove("dragover");
});
photoBox.addEventListener("drop", (e) => {
    e.preventDefault();
    photoBox.classList.remove("dragover");
    const file = e.dataTransfer?.files[0];
    if (file)
        loadImageFile(file);
});
copyEmailBtn.addEventListener("click", async () => {
    const email = emailText.textContent ?? "";
    try {
        await navigator.clipboard.writeText(email);
        copyEmailBtn.textContent = "Copied!";
    }
    catch {
        copyEmailBtn.textContent = "Failed";
    }
    setTimeout(() => {
        copyEmailBtn.textContent = "Copy";
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
