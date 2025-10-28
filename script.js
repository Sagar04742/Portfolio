// script.js
// Vanilla JS: sticky nav interactions, smooth scroll highlight, simple form validation,
// and small UI helpers. Folder: assets/js/script.js

// Immediately invoked to avoid globals
(() => {
  // Basic DOM refs
  const navList = document.getElementById('nav-list');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearEl = document.getElementById('year');

  // Mobile nav toggle
  navToggle && navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // smooth scroll handled by CSS "scroll-behavior"
      if (navList.classList.contains('open')) {
        navList.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  });

  // Active link highlight on scroll
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const offset = 80; // navbar height offset
  const setActiveLink = () => {
    const scrollPos = window.scrollY + offset;
    let currentId = sections[0].id;
    for (const sec of sections) {
      const top = sec.offsetTop;
      if (scrollPos >= top) currentId = sec.id;
    }
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${currentId}`));
  };
  window.addEventListener('scroll', setActiveLink);
  window.addEventListener('resize', setActiveLink);
  setActiveLink();

  // Add subtle "in-view" animation for elements with [data-animate]
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  // Populate current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------
     Contact form validation
     -------------------------*/
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const feedbackEl = document.getElementById('form-feedback');

  // Simple helpers
  const isEmail = (value) => {
    // Basic email pattern
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const showError = (input, message) => {
    const err = document.getElementById(`error-${input.id}`);
    if (err) err.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  };

  const clearError = (input) => {
    const err = document.getElementById(`error-${input.id}`);
    if (err) err.textContent = '';
    input.removeAttribute('aria-invalid');
  };

  // Validate single field
  const validateField = (input) => {
    const id = input.id;
    const value = (input.value || '').trim();
    clearError(input);
    if (!value) {
      showError(input, 'This field is required.');
      return false;
    }
    if (id === 'email' && !isEmail(value)) {
      showError(input, 'Please enter a valid email address.');
      return false;
    }
    if (id === 'message' && value.length < 10) {
      showError(input, 'Message should be at least 10 characters.');
      return false;
    }
    return true;
  };

  // Input handlers for live validation
  [nameInput, emailInput, messageInput].forEach(inp => {
    inp && inp.addEventListener('input', () => validateField(inp));
    inp && inp.addEventListener('blur', () => validateField(inp));
  });

  // Handle submit
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedbackEl.textContent = '';
    const validName = validateField(nameInput);
    const validEmail = validateField(emailInput);
    const validMessage = validateField(messageInput);

    if (!(validName && validEmail && validMessage)) {
      feedbackEl.textContent = 'Please fix the highlighted errors.';
      return;
    }

    // Provide optimistic UX while real backend is integrated
    feedbackEl.textContent = 'Sending message...';

    // NOTE: this is FRONT-END ONLY. Replace with your API or email service integration.
    // Example: use fetch() to call your server endpoint, EmailJS, Formspree, or Netlify forms.
    setTimeout(() => {
      feedbackEl.textContent = 'Message sent — thank you! I will respond soon.';
      form.reset();
    }, 900);
  });

  /* -------------------------
     Small accessibility helpers
     -------------------------*/
  // Close mobile nav with ESC
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (navList.classList.contains('open')) {
        navList.classList.remove('open');
        navToggle.classList.remove('open');
      }
    }
  });

  // Download resume analytics hook (optional)
  const resumeBtn = document.getElementById('download-resume');
  resumeBtn && resumeBtn.addEventListener('click', () => {
    // Placeholder: you can add analytics or tracking here
    // e.g., window.gtag && gtag('event', 'download_resume');
  });

})();
