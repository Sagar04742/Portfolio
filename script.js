/* ═══════════════════════════════════
   PRELOADER — RANDOMIZED BAR SWEEP
═══════════════════════════════════ */
(function () {
  const fill = document.getElementById("preloader-fill");
  const pctText = document.getElementById("preloader-percentage");
  const statusText = document.getElementById("loader-status");
  const preloader = document.getElementById("preloader");

  /* ── Build bars and attach to BODY (not #preloader)
        so they survive when preloader bg is hidden    ── */
  const BAR_COUNT = 40;
  const bars = [];
  let cursorTop = 0;

  for (let i = 0; i < BAR_COUNT; i++) {
    // Variable thickness per bar — some thin, some thick, randomized order
    const h = 1.6 + Math.random() * 3.6; // vh, ranges roughly 1.6vh–5.2vh
    if (cursorTop >= 100) break;

    const bar = document.createElement("div");
    const goRight = Math.random() < 0.5; // fully random direction, not even/odd
    const w = 100 + Math.random() * 10;
    const shade = Math.random() < 0.5 ? "#0a0a0a" : "#0d0d0d";

    bar.style.cssText = `
      position: fixed;
      top: ${cursorTop.toFixed(4)}vh;
      left: 0;
      width: ${w}vw;
      height: ${(h + 0.15).toFixed(4)}vh;
      background: ${shade};
      border-top: ${Math.random() < 0.18 ? "1px solid rgba(245,166,35,0.15)" : "none"};
      z-index: 9998;
      will-change: left;
    `;
    bar._goRight = goRight;
    // Randomized, non-uniform timing so the sweep doesn't read as a synchronized wave
    bar._delay = Math.random() * 420;
    bar._duration = 0.35 + Math.random() * 0.45;

    document.body.appendChild(bar);
    bars.push(bar);
    cursorTop += h;
  }

  /* ── Loading messages & counter — full-stack dev themed ── */
  const loadingMessages = [
    "Booting dev environment",
    "Spinning up the server",
    "Resolving dependencies",
    "Compiling components",
    "Linting the codebase",
    "Connecting to database",
    "Bundling assets",
    "Optimizing build",
    "Running final checks",
    "System ready",
  ];

  let progress = 0;
  document.body.style.overflow = "hidden";

  const progressInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 4.5 + 1.5, 100);
    if (fill) fill.style.width = progress + "%";
    if (pctText) pctText.textContent = String(Math.floor(progress)).padStart(2, "0");

    const msgIndex = Math.min(
      loadingMessages.length - 1,
      Math.floor((progress / 100) * (loadingMessages.length - 1))
    );
    if (statusText) statusText.textContent = loadingMessages[msgIndex];

    if (progress >= 100) {
      clearInterval(progressInterval);

      /* ── Fade counter, hide preloader bg, sweep bars ── */
      setTimeout(() => {
        const content = preloader ? preloader.querySelector(".preloader-content") : null;
        if (content) content.style.opacity = "0";

        setTimeout(() => {
          // Kill the black preloader background — bars are on body so still visible
          if (preloader) preloader.style.display = "none";

          // Sweep each bar with its own randomized delay/duration/direction —
          // deliberately non-uniform so it reads as scattered, not a wave.
          let maxFinish = 0;
          bars.forEach((bar) => {
            const delay = bar._delay;
            const duration = bar._duration;
            maxFinish = Math.max(maxFinish, delay + duration * 1000);
            setTimeout(() => {
              bar.style.transition = `left ${duration}s cubic-bezier(0.76, 0, 0.24, 1)`;
              bar.style.left = bar._goRight ? "110vw" : "-110vw";
            }, delay);
          });

          // Clean up bars + restore scroll after the slowest bar finishes
          setTimeout(() => {
            bars.forEach((b) => b.remove());
            document.body.style.overflow = "";
            if (typeof startHeroAnimation === "function") startHeroAnimation();
            if (typeof startCounters === "function") startCounters();
          }, maxFinish + 150);
        }, 280);
      }, 350);
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

    const trailSize = 38 - i * 5;
    const opacity = 1 - i * 0.12;

    if (trails[i - 1]) {
      trails[i - 1].style.width = `${trailSize}px`;
      trails[i - 1].style.height = `${trailSize}px`;
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
        const rect = e.currentTarget.getBoundingClientRect();
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