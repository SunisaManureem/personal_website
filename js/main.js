//main.js
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
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
  revealElements.forEach(el => revealObserver.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('active'));
}
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      checkSkillSection();
      ticking = false;
    });
    ticking = true;
  }
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

        if(scrollY >= sectionTop && scrollY < sectionTop + sectionHeight){
            navLinks.forEach(link => {
                link.classList.remove("active");

                if(link.getAttribute("href") === "#" + sectionId){
                    link.classList.add("active");
                }
            });
        }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        const contactLink = document.querySelector('a[href="#contact"]');

        if (contactLink) {
            navLinks.forEach(link => link.classList.remove("active"));
            contactLink.classList.add("active");
        }
    }

});
// ===== SKILL PROGRESS (index.html) =====
const skillSection = document.querySelector("#skills");
const progressBars = document.querySelectorAll(".skill-progress");

let skillPlayed = false;

window.addEventListener("scroll", () => {

    if (skillSection) {
        const sectionTop = skillSection.offsetTop - 200;

        if (window.scrollY >= sectionTop && !skillPlayed) {

            progressBars.forEach(bar => {
                const value = bar.getAttribute("data-progress");
                bar.style.width = value + "%";
            });

            skillPlayed = true;
        }
    }

});

const animateSkills = () => {
    progressBars.forEach(bar => {
        const value = bar.getAttribute("data-progress");
        bar.style.width = value + "%";
    });
};

window.addEventListener("load", animateSkills);

// ===== CONTACT FORM HANDLER =====
const contactForm = document.getElementById("contactForm");

if(contactForm){
    contactForm.addEventListener("submit", function(e){
        e.preventDefault(); 

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        const subject = encodeURIComponent(`Message from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        );

        const mailtoLink = `mailto:66030292@kmitl.ac.th?subject=${subject}&body=${body}`;

        alert("✅ กำลังเปิด email client...");
        window.location.href = mailtoLink; 
    });
}

const toggle = document.getElementById("menuToggle") || document.getElementById("navToggle");
const menu = document.getElementById("navMenu");
const navToggle = document.querySelector(".nav-toggle");

const closeNavMenu = () => {
  if (menu && menu.classList.contains("active")) {
    menu.classList.remove("active");
    if (navToggle) {
      navToggle.classList.remove("active");
    }
  }
};

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
    if (navToggle) {
      navToggle.classList.toggle("active");
    }
  });
} else if (toggle && !menu) {
  toggle.addEventListener("click", () => {
    if (navToggle) {
      navToggle.classList.toggle("active");
    }
  });
}

const navLinksMenu = document.querySelectorAll(".nav-link");
navLinksMenu.forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      closeNavMenu();
    }
  });
});

// ===== CV SKILL BAR =====
const cvSkills = document.querySelectorAll(".cv-skill-fill");

cvSkills.forEach(bar => {
    const width = bar.getAttribute("data-width");
    bar.style.width = width + "%";
});
