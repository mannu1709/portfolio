// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .hero-section .badge, .display-3').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// for Form 
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const statusDiv = document.getElementById("formStatus");

    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const data = new FormData(form);

            statusDiv.innerHTML = "Sending...";

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    statusDiv.innerHTML = "<span class='text-success'>Thank you! Your message has been sent.</span>";
                    form.reset();
                } else {
                    statusDiv.innerHTML = "<span class='text-danger'>Failed to send. Try again.</span>";
                }
            } catch (error) {
                statusDiv.innerHTML = "<span class='text-danger'>Something went wrong.</span>";
            }
        });
    }

});

// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});