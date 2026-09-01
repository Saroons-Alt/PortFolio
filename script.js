/* ===================================================================
   SAROON — PORTFOLIO
   Vanilla JS: loader, scroll reveals, nav state, cursor glow,
   subtle parallax, scroll progress, mobile menu.
   Made with ❤️ and occasional rage
=================================================================== */

(() => {
  'use strict';

  // Console Easter Egg
  console.log('👋 Hey! If you\'re reading this, you\'re cool.');
  console.log('🚀 Check out my GitHub: github.com/Saroons-Alt');
  console.log('🥤 Fueled by diet coke');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 1. LOADING SCREEN ---------------- */
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  const loaderPct = document.getElementById('loaderPct');

  function runLoader() {
    let progress = 0;
    const duration = prefersReducedMotion ? 200 : 1400;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      progress = Math.min(100, Math.round((1 - Math.pow(1 - elapsed / duration, 3)) * 100));
      loaderFill.style.width = progress + '%';
      loaderPct.textContent = progress;

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        loaderFill.style.width = '100%';
        loaderPct.textContent = '100';
        setTimeout(hideLoader, 250);
      }
    }

    requestAnimationFrame(tick);
  }

  function hideLoader() {
    loader.classList.add('is-hidden');
    document.body.style.overflow = '';
    playHeroEntrance();
    setTimeout(() => loader.remove(), 800);
  }

  // Lock scroll while loading
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', runLoader);
  // Fallback in case load event already fired or is delayed
  setTimeout(() => {
    if (loader && !loader.classList.contains('is-hidden')) runLoader();
  }, 600);

  /* ---------------- 2. HERO ENTRANCE ---------------- */
  function playHeroEntrance() {
    const lines = document.querySelectorAll('.reveal-line');
    lines.forEach((el, i) => {
      el.style.transition = `transform 0.9s var(--ease-out) ${i * 0.09}s, opacity 0.9s var(--ease-out) ${i * 0.09}s`;
      requestAnimationFrame(() => {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    });

    // Reveal the rest of the hero's reveal-up items in their own stagger
    const heroExtras = document.querySelectorAll('.hero .reveal-up');
    heroExtras.forEach((el, i) => {
      el.style.transitionDelay = `${0.25 + i * 0.08}s`;
      requestAnimationFrame(() => el.classList.add('is-visible'));
    });
  }

  /* ---------------- 3. SCROLL-TRIGGERED REVEALS ---------------- */
  const revealTargets = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------------- 4. NAV: scroll state + smooth anchors ---------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function handleNavScroll() {
    if (window.scrollY > 24) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth anchor scrolling with offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------------- 5. SCROLL PROGRESS BAR ---------------- */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ---------------- 6. SCROLL HINT: hide after first scroll ---------------- */
  const scrollHint = document.getElementById('scrollHint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        const navHeight = nav.offsetHeight;
        const top = aboutEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });

    window.addEventListener('scroll', () => {
      scrollHint.style.opacity = window.scrollY > 80 ? '0' : '';
    }, { passive: true });
  }

  /* ---------------- 7. CURSOR GLOW (desktop only, mouse-based) ---------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (cursorGlow && isFinePointer && !prefersReducedMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = null;

    function animateGlow() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateGlow);
    }

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorGlow.classList.add('is-active');
    });

    window.addEventListener('mouseleave', () => cursorGlow.classList.remove('is-active'));

    rafId = requestAnimationFrame(animateGlow);
  }

  /* ---------------- 8. SUBTLE PARALLAX ON HERO ---------------- */
  const heroInner = document.querySelector('.hero-inner');

  if (heroInner && isFinePointer && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 2;
      const y = (e.clientY / h - 0.5) * 2;

      heroInner.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
    });

    window.addEventListener('mouseleave', () => {
      heroInner.style.transform = 'translate(0, 0)';
    });
  }

  /* ---------------- 9. PROJECT VISUAL TILT (subtle, on hover) ---------------- */
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('.project-visual').forEach((visual) => {
      visual.addEventListener('mousemove', (e) => {
        const rect = visual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const inner = visual.querySelector('.project-visual-inner');
        if (inner) {
          inner.style.transform = `scale(1.04) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
        }
      });

      visual.addEventListener('mouseleave', () => {
        const inner = visual.querySelector('.project-visual-inner');
        if (inner) inner.style.transform = '';
      });
    });
  }

  /* ---------------- 10. SET ACTIVE NAV LINK ON SCROLL ---------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));

})();