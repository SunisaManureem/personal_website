console.log("Portfolio loaded");
// Dark Mode Toggle Logic
const themeToggleBtn = document.getElementById('themeToggle');
const htmlTag = document.documentElement;

// Check local storage for theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlTag.setAttribute('data-theme', savedTheme);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlTag.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            htmlTag.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            htmlTag.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}
// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Trigger reveal on load for elements already in view
window.addEventListener('load', () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('active');
        }
    });
});
// ===== Navbar Active Section =====

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

let scrollY = window.pageYOffset;

sections.forEach(section => {

const sectionHeight = section.offsetHeight;
const sectionTop = section.offsetTop - 150;
const sectionId = section.getAttribute("id");

if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){

navLinks.forEach(link => {
link.classList.remove("active");

if(link.getAttribute("href") === "#" + sectionId){
link.classList.add("active");
}

});

}

});

});
// ===== Navbar Active Page =====

const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {

const linkPage = link.getAttribute("href");

if(linkPage === currentPage){
link.classList.add("active");
}

});