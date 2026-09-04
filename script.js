/* ═══════════════════════════════════
   ALWAYS START AT THE TOP (HOME)
   — prevents the browser's automatic
     scroll restoration from landing
     mid-page (e.g. in About) on load
═══════════════════════════════════ */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

/* ═══════════════════════════════════
   PRELOADER — HORIZONTAL LINE FILL + SPLIT-SCREEN REVEAL
═══════════════════════════════════ */
(function () {
  const line = document.getElementById("preloader-line");
  const pctText = document.getElementById("preloader-percentage");
  const preloader = document.getElementById("preloader");
  const siteContent = document.getElementById("site-content");

  let progress = 0;
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);

  const progressInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 4.5 + 1.5, 100);
    if (line) line.style.width = progress + "%";
    if (pctText) pctText.textContent = String(Math.floor(progress)).padStart(2, "0");

    if (progress >= 100) {
      clearInterval(progressInterval);

      setTimeout(() => {
        const content = preloader ? preloader.querySelector(".preloader-content") : null;
        if (content) content.style.opacity = "0";

        setTimeout(() => {
          // Split the black overlay into two halves that slide apart,
          // revealing the site underneath.
          if (preloader) preloader.classList.add("split");

          setTimeout(() => {
            if (preloader) preloader.style.display = "none";
            window.scrollTo(0, 0);
            document.body.style.overflow = "";

            // Reveal the whole site zooming in from slightly-out to full size.
            if (siteContent) siteContent.classList.add("revealed");

            if (typeof startHeroAnimation === "function") startHeroAnimation();
            if (typeof startCounters === "function") startCounters();
            const heroPhoto = document.querySelector(".hero-photo-wrap");
            if (heroPhoto) heroPhoto.classList.add("photo-in");
          }, 900);
        }, 250);
      }, 250);
    }
  }, 35);
})();


/* ═══════════════════════════════════
   DEVICE DETECTION — used to fully gate
   all custom-cursor logic off touch devices
═══════════════════════════════════ */
const isTouchDevice =
  window.matchMedia("(pointer: coarse)").matches ||
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0;
const isDesktop = window.innerWidth > 768 && !isTouchDevice;

if (isTouchDevice) {
  document.documentElement.classList.add("is-touch");
}

/* ═══════════════════════════════════
   BACKGROUND AMBIENT ORB
═══════════════════════════════════ */
const bgOrb = document.getElementById("bgOrb");
let tickingOrb = false;
window.addEventListener("mousemove", (e) => {
  if (isDesktop && !tickingOrb && bgOrb) {
    requestAnimationFrame(() => {
      bgOrb.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      tickingOrb = false;
    });
    tickingOrb = true;
  }
});

/* ═══════════════════════════════════
   FLUID WATER CURSOR & CORE LOGIC
═══════════════════════════════════ */
const cursorCore = document.getElementById("fluidCursorCore");
const cursor = document.getElementById("fluidCursor");
const trails = document.querySelectorAll(".trail-dot");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

const positions = [];
const numTrails = trails.length;
for (let i = 0; i < numTrails + 1; i++) {
  positions.push({ x: mouseX, y: mouseY });
}

// Trail dot size is constant per-index — set once instead of every
// animation frame (was causing needless layout work at 60fps).
for (let i = 1; i <= numTrails; i++) {
  const trailSize = 38 - i * 5;
  if (trails[i - 1]) {
    trails[i - 1].style.width = `${trailSize}px`;
    trails[i - 1].style.height = `${trailSize}px`;
  }
}

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateFluidCursor() {
  if (cursorCore) {
    cursorCore.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }

  positions[0].x += (mouseX - positions[0].x) * 0.15;
  positions[0].y += (mouseY - positions[0].y) * 0.15;

  let dx = mouseX - positions[0].x;
  let dy = mouseY - positions[0].y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  let scaleX = 1 + Math.min(distance * 0.005, 0.6);
  let scaleY = 1 - Math.min(distance * 0.002, 0.4);

  if (cursor) {
    cursor.style.transform = `translate(${positions[0].x}px, ${positions[0].y}px) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
  }

  for (let i = 1; i <= numTrails; i++) {
    positions[i].x += (positions[i - 1].x - positions[i].x) * 0.15;
    positions[i].y += (positions[i - 1].y - positions[i].y) * 0.15;

    const opacity = 1 - i * 0.12;

    if (trails[i - 1]) {
      if (!trails[i - 1].classList.contains("hover-active")) {
        trails[i - 1].style.opacity = opacity;
      }
      trails[i - 1].style.transform =
        `translate(${positions[i].x}px, ${positions[i].y}px) translate(-50%, -50%)`;
    }
  }
  requestAnimationFrame(animateFluidCursor);
}

if (isDesktop) {
  animateFluidCursor();
}

/* ═══════════════════════════════════
   CROSSHAIR RETICLE CURSOR
   — Appears only on clickable elements
   — 4 corner brackets + pulsing dot
═══════════════════════════════════ */
(function () {
  if (!isDesktop) return;

  // Create the reticle element
  const reticle = document.createElement("div");
  reticle.id = "cursor-reticle";
  reticle.innerHTML = `
    <div class="reticle-corner rc-tl"></div>
    <div class="reticle-corner rc-tr"></div>
    <div class="reticle-corner rc-bl"></div>
    <div class="reticle-corner rc-br"></div>
    <div class="reticle-center-dot"></div>
  `;
  document.body.appendChild(reticle);

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #cursor-reticle {
      position: fixed;
      top: 0; left: 0;
      width: 36px; height: 36px;
      pointer-events: none;
      z-index: 10000;
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.4);
      transition: opacity 0.18s ease, transform 0.18s ease;
      will-change: transform, opacity;
    }
    #cursor-reticle.visible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
    }
    .reticle-corner {
      position: absolute;
      width: 9px; height: 9px;
      border-color: var(--amber);
      border-style: solid;
      border-width: 0;
    }
    .rc-tl { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; }
    .rc-tr { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; }
    .rc-bl { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; }
    .rc-br { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; }
    .reticle-center-dot {
      position: absolute;
      top: 50%; left: 50%;
      width: 4px; height: 4px;
      background: var(--amber);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: reticlePulse 1.2s ease-in-out infinite;
    }
    @keyframes reticlePulse {
      0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
      50% { transform: translate(-50%,-50%) scale(1.8); opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);

  // Follow the mouse precisely (no lag — same as core dot)
  window.addEventListener("mousemove", (e) => {
    reticle.style.left = e.clientX + "px";
    reticle.style.top = e.clientY + "px";
  });

  // Show on interactive elements
  const clickableSelectors = "a, button, .skill-chip, .project-card, .service-card, .cert-item, .contact-link-item, .work-item, .hero-arrow, .hero-cta, .hero-cv-btn, .magnetic-btn, .nav-item-wrap, .dot-nav-item, .acb, .freelance-cta, .contact-big-cta, .project-link, .ui-project-card, .timeline-item, .tilt-card, .looking-for-badge, .footer-col ul a";

  document.querySelectorAll(clickableSelectors).forEach((el) => {
    el.addEventListener("mouseenter", () => reticle.classList.add("visible"));
    el.addEventListener("mouseleave", () => reticle.classList.remove("visible"));
  });
})();

/* ═══════════════════════════════════
   HOVER STATES FOR FLUID CURSOR
   — only registered on real desktop pointers,
     never on touch (taps fire synthetic mouseenter
     events and would otherwise leave the cursor
     stuck in a hover-active state on mobile)
═══════════════════════════════════ */
if (isDesktop) {
  const hoverElements = document.querySelectorAll(
    "h1, h2, h3, h4, p, span, a, button, img, .skill-chip, .project-card, .service-card, .cert-item, .contact-link-item, .work-item, .contact-item, .hero-deco, .timeline-item, .nav-item-wrap",
  );

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (cursorCore) cursorCore.classList.add("hover-active");
      if (cursor) cursor.classList.add("hover-active");
      trails.forEach((t) => t.classList.add("hover-active"));
    });
    el.addEventListener("mouseleave", () => {
      if (cursorCore) cursorCore.classList.remove("hover-active");
      if (cursor) cursor.classList.remove("hover-active");
      trails.forEach((t) => t.classList.remove("hover-active"));
    });
  });
}

/* ═══════════════════════════════════
   MAGNETIC BUTTONS (Optimized)
═══════════════════════════════════ */
document.querySelectorAll(".magnetic-btn").forEach((btn) => {
  let tickingMag = false;
  btn.addEventListener("mousemove", (e) => {
    if (!isDesktop) return;
    if (!tickingMag) {
      requestAnimationFrame(() => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        tickingMag = false;
      });
      tickingMag = true;
    }
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = `translate(0px, 0px)`;
  });
});

/* ═══════════════════════════════════
   3D TILT CARDS (Optimized)
═══════════════════════════════════ */
document.querySelectorAll(".tilt-card").forEach((card) => {
  let tickingTilt = false;
  card.addEventListener("mousemove", (e) => {
    if (!isDesktop) return;
    if (!tickingTilt) {
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        tickingTilt = false;
      });
      tickingTilt = true;
    }
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});

/* ═══════════════════════════════════
   HERO TITLE CHARACTER ANIMATION
═══════════════════════════════════ */
function startHeroAnimation() {
  const title = document.querySelector(".hero-title");
  if (!title) return;
  const html = title.innerHTML;
  let newHtml = "";
  let delay = 0;
  for (let i = 0; i < html.length; i++) {
    const ch = html[i];
    if (ch === "<") {
      const close = html.indexOf(">", i);
      newHtml += html.slice(i, close + 1);
      i = close;
    } else if (ch === " " || ch === "\n") {
      newHtml += ch;
    } else {
      newHtml += `<span style="transition-delay:${delay}ms" class="char">${ch}</span>`;
      delay += 40;
    }
  }
  title.innerHTML = newHtml;
  setTimeout(() => {
    title.querySelectorAll(".char").forEach((s) => s.classList.add("char-visible"));
  }, 80);
}

/* ═══════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════ */
function startCounters() {
  document.querySelectorAll("[data-target]").forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    el.textContent = isDecimal ? target.toFixed(2) : target;
    let current = 0;
    const step = target / 60;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
    }, 25);
  });
}

/* ═══════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("active");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(".reveal, .reveal-left, .reveal-right, .timeline-item")
  .forEach((el) => revealObserver.observe(el));

/* ═══════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════ */
let tickingScroll = false;
window.addEventListener("scroll", () => {
  if (!tickingScroll) {
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const pct = (scrolled / maxScroll) * 100;
      const scrollProgress = document.getElementById("scroll-progress");
      if (scrollProgress) scrollProgress.style.width = pct + "%";
      tickingScroll = false;
    });
    tickingScroll = true;
  }
});

/* ═══════════════════════════════════
   FLOATING PARTICLES
═══════════════════════════════════ */
function createParticles() {
  const colors = [
    "rgba(245,166,35,0.3)",
    "rgba(245,166,35,0.15)",
    "rgba(26,26,26,0.08)",
  ];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 14 + 10}s;
      animation-delay:${Math.random() * 10}s;
    `;
    document.body.appendChild(p);
  }
}
createParticles();

/* ═══════════════════════════════════
   PROJECT CARD GLOW ON HOVER
═══════════════════════════════════ */
document.querySelectorAll(".project-card").forEach((card) => {
  let tickingGlow = false;
  card.addEventListener("mousemove", (e) => {
    if (!tickingGlow) {
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
        tickingGlow = false;
      });
      tickingGlow = true;
    }
  });
});

/* ═══════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ═══════════════════════════════════
   PAGE TRANSITION ON EXTERNAL LINKS
═══════════════════════════════════ */
document.querySelectorAll('a[href^="http"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    if (a.getAttribute("target") === "_blank") return;
    const overlay = document.getElementById("pageTransition");
    if (overlay) {
      overlay.style.transition = "transform 0.3s ease";
      overlay.style.transform = "scaleX(0.05)";
      setTimeout(() => {
        overlay.style.transform = "scaleX(0)";
      }, 350);
    }
  });
});

/* ═══════════════════════════════════
   HERO DECO PARALLAX ON MOUSEMOVE
═══════════════════════════════════ */
let tickingDeco = false;
const heroEl = document.getElementById("hero");
if (heroEl) {
  heroEl.addEventListener("mousemove", (e) => {
    if (!tickingDeco) {
      requestAnimationFrame(() => {
        const rect = heroEl.getBoundingClientRect();
        const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
        const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
        document.querySelectorAll(".hero-deco").forEach((d, i) => {
          const speed = (i + 1) * 12;
          d.style.transform = `translate(${xRatio * speed}px, ${yRatio * speed}px)`;
        });
        tickingDeco = false;
      });
      tickingDeco = true;
    }
  });
}

/* ═══════════════════════════════════
   UI PROJECTS — FLOATING PREVIEW
═══════════════════════════════════ */
(function () {
  const float = document.getElementById("uiPreviewFloat");
  const floatImg = document.getElementById("uiPreviewImg");
  const floatPlaceholder = document.getElementById("uiPreviewPlaceholder");
  const floatLabel = document.getElementById("uiPreviewLabel");
  let raf;
  if (!float) return;

  function moveFloat(e) {
    const x = e.clientX;
    const y = e.clientY;
    const fw = 320, fh = 210;
    const vw = window.innerWidth, vh = window.innerHeight;
    let left = x + 22;
    let top = y - fh / 2;
    if (left + fw > vw - 12) left = x - fw - 22;
    if (top < 10) top = 10;
    if (top + fh > vh - 10) top = vh - fh - 10;
    float.style.left = left + "px";
    float.style.top = top + "px";
  }

  document.querySelectorAll(".ui-project-card").forEach((card) => {
    const imgSrc = card.dataset.preview;
    const name = card.dataset.name;

    card.addEventListener("mouseenter", (e) => {
      if (floatLabel) floatLabel.textContent = name;
      if (imgSrc) {
        if (floatImg) { floatImg.src = imgSrc; floatImg.style.display = "block"; }
        if (floatPlaceholder) floatPlaceholder.style.display = "none";
      } else {
        if (floatImg) floatImg.style.display = "none";
        if (floatPlaceholder) floatPlaceholder.style.display = "flex";
      }
      moveFloat(e);
      float.classList.add("visible");
    });

    card.addEventListener("mousemove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => moveFloat(e));
    });

    card.addEventListener("mouseleave", () => {
      float.classList.remove("visible");
    });
  });
})();

/* ═══════════════════════════════════
   CERTIFICATIONS — FLOATING PREVIEW
═══════════════════════════════════ */
(function () {
  const float = document.getElementById("certPreviewFloat");
  const floatImg = document.getElementById("certPreviewImg");
  const floatPlaceholder = document.getElementById("certPreviewPlaceholder");
  const floatName = document.getElementById("certPreviewName");
  if (!float) return;
  let raf;

  function moveCertFloat(e) {
    const x = e.clientX;
    const y = e.clientY;
    const fw = 320, fh = 200;
    const vw = window.innerWidth, vh = window.innerHeight;
    let left = x + 24;
    let top = y - fh / 2;
    if (left + fw > vw - 12) left = x - fw - 24;
    if (top < 10) top = 10;
    if (top + fh > vh - 10) top = vh - fh - 10;
    float.style.left = left + "px";
    float.style.top = top + "px";
  }

  document.querySelectorAll(".cert-item").forEach((card) => {
    card.addEventListener("mouseenter", (e) => {
      if (!isDesktop) return;
      const imgSrc = card.dataset.certImg;
      const name = card.dataset.certName || "";
      if (floatName) floatName.textContent = name;
      if (imgSrc) {
        if (floatImg) { floatImg.src = imgSrc; floatImg.style.display = "block"; }
        if (floatPlaceholder) floatPlaceholder.style.display = "none";
      } else {
        if (floatImg) floatImg.style.display = "none";
        if (floatPlaceholder) floatPlaceholder.style.display = "flex";
      }
      moveCertFloat(e);
      float.classList.add("visible");
    });

    card.addEventListener("mousemove", (e) => {
      if (!isDesktop) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => moveCertFloat(e));
    });

    card.addEventListener("mouseleave", () => {
      float.classList.remove("visible");
    });
  });
})();

/* ═══════════════════════════════════
   STICKY NAVBAR — hide on scroll down
═══════════════════════════════════ */
(function () {
  const nav = document.getElementById("site-nav");
  const mobileMenu = document.getElementById("navMobileMenu");
  const hamburger = document.getElementById("navHamburger");
  if (!nav) return;

  let lastY = 0;
  let tickingNav = false;

  window.addEventListener("scroll", () => {
    if (!tickingNav) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y <= 10) {
          nav.classList.remove("nav-hidden");
        } else if (y > lastY) {
          nav.classList.add("nav-hidden");
          if (mobileMenu) mobileMenu.classList.remove("open");
          if (hamburger) hamburger.classList.remove("open");
        } else {
          nav.classList.remove("nav-hidden");
        }
        lastY = y;
        tickingNav = false;
      });
      tickingNav = true;
    }
  });

  /* — Hamburger toggle — */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });

    /* Close mobile menu when a link is clicked */
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
      });
    });
  }

  /* — Active nav link highlighting — */
  const sections = ["hero", "about", "services", "projects", "certs", "contact"];
  const navLinks = document.querySelectorAll(".nav-link");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.closest("a")?.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.add("nav-active");
            } else {
              link.classList.remove("nav-active");
            }
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) navObserver.observe(el);
  });
})();

/* ═══════════════════════════════════
   DOT NAV — click to scroll + active
═══════════════════════════════════ */
(function () {
  const dotItems = document.querySelectorAll(".dot-nav-item");

  dotItems.forEach((item) => {
    const sectionId = item.dataset.section;

    item.addEventListener("click", () => {
      const target = document.getElementById(sectionId);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const dotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          dotItems.forEach((item) => {
            item.classList.toggle("active", item.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  ["hero", "about", "services", "projects", "certs", "contact"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) dotObserver.observe(el);
  });
})();