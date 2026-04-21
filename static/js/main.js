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

// ---- CONTACT FORM ----
async function sendContact() {
    const btn = document.getElementById('sendBtn');
    const status = document.getElementById('formStatus');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        status.innerHTML = `<div class="alert alert-danger py-2 small">Please fill in all fields.</div>`;
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Sending...`;
    status.innerHTML = '';

    try {
        const res = await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        const data = await res.json();

        if (data.success) {
            status.innerHTML = `<div class="alert alert-success py-2 small"><i class="bi bi-check-circle me-1"></i>${data.message}</div>`;
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
        } else {
            status.innerHTML = `<div class="alert alert-danger py-2 small">${data.error || 'Something went wrong.'}</div>`;
        }
    } catch {
        status.innerHTML = `<div class="alert alert-danger py-2 small">Network error. Please try again.</div>`;
    }

    btn.disabled = false;
    btn.innerHTML = `<i class="bi bi-send me-2"></i>Send Message`;
}

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