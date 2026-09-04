/* ==========================================================================
   PANTHEON DIVINO — Interazioni, particelle e discesa cinematografica
   ========================================================================== */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     0. LOADER
  --------------------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const loaderBar = document.querySelector('.loader-bar-fill');
  window.addEventListener('load', () => {
    requestAnimationFrame(() => { loaderBar.style.width = '100%'; });
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.style.overflow = '';
      revealOnLoad();
    }, 1500);
  });
  // Safety net in case 'load' is delayed by the video asset
  setTimeout(() => {
    if (!loader.classList.contains('is-hidden')) {
      loaderBar.style.width = '100%';
      loader.classList.add('is-hidden');
      revealOnLoad();
    }
  }, 3500);

  function revealOnLoad(){
    document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------------
     1. CUSTOM CURSOR
  --------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });
    (function animateRing(){
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    })();
    document.querySelectorAll('a, button, .deity-trigger').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  }

  /* ---------------------------------------------------------------------
     2. SCROLLSPY — side realm navigation + progress
  --------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.realm-nav a');
  const realmSections = document.querySelectorAll('.realm[id]');
  const progressBar = document.getElementById('realm-progress');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.5 });
  realmSections.forEach(section => spyObserver.observe(section));

  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
    progressBar.style.height = `${Math.min(Math.max(scrolled, 0), 1) * 100}%`;
  }, { passive: true });

  /* ---------------------------------------------------------------------
     3. REVEAL ON SCROLL
  --------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     4. SCROLL CUE — hide after first scroll
  --------------------------------------------------------------------- */
  const scrollCue = document.getElementById('scroll-cue');
  window.addEventListener('scroll', () => {
    scrollCue.classList.toggle('is-hidden', window.scrollY > 120);
  }, { passive: true });

  /* ---------------------------------------------------------------------
     5. PARALLAX CLOUDS / LAYERS
  --------------------------------------------------------------------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  function updateParallax(){
    const y = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      el.style.transform = `translateY(${y * speed * 0.15}px)`;
    });
  }
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => requestAnimationFrame(updateParallax), { passive: true });
  }

  /* ---------------------------------------------------------------------
     6. DEITY CARDS — luxury jewel showcase panel
  --------------------------------------------------------------------- */
  const backdrop = document.createElement('div');
  backdrop.className = 'card-backdrop';
  document.body.appendChild(backdrop);

  const triggers = document.querySelectorAll('.deity-trigger');
  const cards = document.querySelectorAll('.deity-card');
  // Reparent every card to <body> so it always sits in the root stacking
  // context, immune to any stacking context an ancestor section might gain.
  cards.forEach(card => document.body.appendChild(card));
  let activeCard = null;

  function openCard(card){
    if (activeCard) closeCard(activeCard);
    card.classList.add('is-open');
    backdrop.classList.add('is-open');
    activeCard = card;
  }
  function closeCard(card){
    card.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    activeCard = null;
  }

  triggers.forEach(trigger => {
    const targetId = trigger.dataset.target;
    const card = document.getElementById(targetId);
    if (!card) return;
    trigger.addEventListener('click', () => openCard(card));
  });

  cards.forEach(card => {
    card.querySelector('.card-close').addEventListener('click', () => closeCard(card));
  });
  backdrop.addEventListener('click', () => { if (activeCard) closeCard(activeCard); });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeCard) closeCard(activeCard);
  });

  /* ---------------------------------------------------------------------
     7. AMBIENT PARTICLE CANVAS — realm-aware floating dust
  --------------------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const REALM_COLORS = {
    hero: 'rgba(240,211,138,0.6)',
    olimpo: 'rgba(220,230,255,0.55)',
    tempio: 'rgba(255,180,190,0.5)',
    fucine: 'rgba(255,140,80,0.65)',
    albero: 'rgba(240,211,138,0.5)',
    oltretomba: 'rgba(140,170,255,0.6)'
  };
  let currentRealm = 'hero';

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function initParticles(){
    const count = window.innerWidth < 720 ? 30 : 60;
    particles = Array.from({ length: count }, () => spawnParticle());
  }
  function spawnParticle(){
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.6 + Math.random() * 1.8,
      vy: -0.15 - Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.25,
      drift: Math.random() * Math.PI * 2,
      alpha: 0.2 + Math.random() * 0.6
    };
  }
  function drawParticles(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = REALM_COLORS[currentRealm] || REALM_COLORS.hero;
    particles.forEach(p => {
      p.drift += 0.01;
      p.x += p.vx + Math.sin(p.drift) * 0.15;
      p.y += p.vy;
      if (p.y < -10) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
      if (p.x < -10) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${p.alpha})`);
      ctx.fill();
    });
    if (!prefersReducedMotion) requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  if (!prefersReducedMotion) drawParticles(); else drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); }, { passive: true });

  const realmColorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) currentRealm = entry.target.dataset.bg;
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-bg]').forEach(el => realmColorObserver.observe(el));

  /* ---------------------------------------------------------------------
     8. ROSE PETALS — Tempio di Ares e Afrodite
  --------------------------------------------------------------------- */
  const petalsLayer = document.getElementById('petals-layer');
  if (petalsLayer) {
    const petalCount = window.innerWidth < 720 ? 14 : 26;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      const left = Math.random() * 100;
      const duration = 8 + Math.random() * 10;
      const delay = Math.random() * 12;
      const size = 8 + Math.random() * 10;
      const drift = (Math.random() - 0.5) * 200;
      petal.style.left = `${left}%`;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `-${delay}s`;
      petal.style.setProperty('--drift', `${drift}px`);
      petalsLayer.appendChild(petal);
    }
  }

  /* ---------------------------------------------------------------------
     9. EMBER SPARKS — Fucine di Efesto
  --------------------------------------------------------------------- */
  const emberCanvas = document.getElementById('ember-canvas');
  if (emberCanvas) {
    const ectx = emberCanvas.getContext('2d');
    let embers = [];
    let emberVisible = false;

    function resizeEmber(){
      emberCanvas.width = emberCanvas.offsetWidth;
      emberCanvas.height = emberCanvas.offsetHeight;
    }
    function spawnEmber(){
      return {
        x: Math.random() * emberCanvas.width,
        y: emberCanvas.height + 10,
        r: 1 + Math.random() * 2.4,
        vy: -0.6 - Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.6,
        life: 0,
        maxLife: 100 + Math.random() * 120,
        flicker: Math.random() * Math.PI * 2
      };
    }
    function initEmbers(){
      resizeEmber();
      embers = Array.from({ length: 70 }, spawnEmber);
    }
    function drawEmbers(){
      if (!emberVisible) { requestAnimationFrame(drawEmbers); return; }
      ectx.clearRect(0, 0, emberCanvas.width, emberCanvas.height);
      embers.forEach((e, i) => {
        e.x += e.vx; e.y += e.vy; e.life++; e.flicker += 0.2;
        const fade = 1 - e.life / e.maxLife;
        if (fade <= 0 || e.y < -10) { embers[i] = spawnEmber(); return; }
        const glow = 0.5 + Math.sin(e.flicker) * 0.3;
        ectx.beginPath();
        ectx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ectx.fillStyle = `rgba(255, ${120 + Math.floor(glow * 80)}, 60, ${fade * glow})`;
        ectx.fill();
      });
      requestAnimationFrame(drawEmbers);
    }
    initEmbers();
    drawEmbers();
    window.addEventListener('resize', resizeEmber, { passive: true });
    new IntersectionObserver((entries) => {
      entries.forEach(entry => { emberVisible = entry.isIntersecting; });
    }, { threshold: 0.1 }).observe(document.getElementById('fucine'));
  }

  /* ---------------------------------------------------------------------
     10. FIREFLIES — Albero Sacro di Ermes
  --------------------------------------------------------------------- */
  const firefliesLayer = document.getElementById('fireflies-layer');
  if (firefliesLayer) {
    const count = window.innerWidth < 720 ? 10 : 20;
    for (let i = 0; i < count; i++) {
      const fly = document.createElement('span');
      fly.className = 'firefly';
      fly.style.left = `${Math.random() * 100}%`;
      fly.style.top = `${40 + Math.random() * 55}%`;
      fly.style.animationDuration = `${6 + Math.random() * 8}s`;
      fly.style.animationDelay = `-${Math.random() * 10}s`;
      fly.style.setProperty('--fx', `${(Math.random() - 0.5) * 120}px`);
      fly.style.setProperty('--fy', `${(Math.random() - 0.5) * 120}px`);
      fly.style.setProperty('--fx2', `${(Math.random() - 0.5) * 160}px`);
      fly.style.setProperty('--fy2', `${(Math.random() - 0.5) * 160}px`);
      firefliesLayer.appendChild(fly);
    }
  }

  /* ---------------------------------------------------------------------
     11. CRYSTALS — Oltretomba di Ade e Persefone
  --------------------------------------------------------------------- */
  const crystalLayer = document.getElementById('crystal-layer');
  if (crystalLayer) {
    const count = window.innerWidth < 720 ? 16 : 32;
    for (let i = 0; i < count; i++) {
      const crystal = document.createElement('span');
      crystal.className = 'crystal';
      crystal.style.left = `${Math.random() * 100}%`;
      crystal.style.top = `${20 + Math.random() * 75}%`;
      crystal.style.animationDuration = `${2.4 + Math.random() * 3}s`;
      crystal.style.animationDelay = `-${Math.random() * 4}s`;
      crystalLayer.appendChild(crystal);
    }
  }

  /* ---------------------------------------------------------------------
     12. Prevent body scroll while loader is up
  --------------------------------------------------------------------- */
  document.body.style.overflow = 'hidden';

})();
