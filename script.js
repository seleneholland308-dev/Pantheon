(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    document.querySelectorAll('svg').forEach(svg => {
      if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
    });
  }

  /* ---------------------------------------------------------------------
     Intro curtain
  --------------------------------------------------------------------- */
  const curtain = document.getElementById('curtain');
  const enterBtn = document.getElementById('enterBtn');
  function dismissCurtain(){
    curtain.classList.add('hidden');
    curtain.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }
  document.body.style.overflow = 'hidden';
  enterBtn.addEventListener('click', dismissCurtain);
  window.addEventListener('scroll', () => {
    if (!curtain.classList.contains('hidden')) dismissCurtain();
  }, { once: true, passive: true });

  /* ---------------------------------------------------------------------
     Custom cursor glow
  --------------------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (!prefersReduced && matchMedia('(hover:hover)').matches) {
    window.addEventListener('pointermove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
    document.querySelectorAll('button, a, .thread-dot, .add-cart-btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover'));
    });
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  /* ---------------------------------------------------------------------
     Section thread nav + in-view reveal
  --------------------------------------------------------------------- */
  const realms = Array.from(document.querySelectorAll('.realm'));
  const threadDots = Array.from(document.querySelectorAll('.thread-dot'));

  threadDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const id = entry.target.id;
        threadDots.forEach(d => d.classList.toggle('active', d.dataset.target === id));
      }
    });
  }, { threshold: 0.35 });
  realms.forEach(r => sectionObserver.observe(r));

  /* ---------------------------------------------------------------------
     Parallax on figure stages + mouse drift
  --------------------------------------------------------------------- */
  const stages = Array.from(document.querySelectorAll('.figure-stage'));
  let mouseX = 0, mouseY = 0;
  if (!prefersReduced) {
    window.addEventListener('pointermove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let ticking = false;
    function updateParallax(){
      const vh = window.innerHeight;
      stages.forEach(stage => {
        const rect = stage.parentElement.getBoundingClientRect();
        const progress = (rect.top) / vh; // -1..1 roughly as it crosses viewport
        const depth = parseFloat(stage.dataset.depth || 20);
        const ySlide = progress * -depth;
        const xDrift = mouseX * (depth * 0.6);
        const rot = mouseX * 0.6;
        stage.style.transform = `translate(calc(-50% + ${xDrift}px), ${ySlide}px) rotate(${rot}deg)`;
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    window.addEventListener('pointermove', () => {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    });
    updateParallax();
  }

  /* ---------------------------------------------------------------------
     Ambient particle systems (motes, petals, sparkles, crystal dust)
  --------------------------------------------------------------------- */
  function spawnParticles(container, count, opts) {
    if (!container || prefersReduced) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = opts.minSize + Math.random() * (opts.maxSize - opts.minSize);
      const left = Math.random() * 100;
      const duration = opts.minDur + Math.random() * (opts.maxDur - opts.minDur);
      const delay = Math.random() * opts.maxDur;
      const drift = (Math.random() - 0.5) * opts.drift;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = left + '%';
      p.style.background = opts.color;
      p.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
      p.style.boxShadow = opts.glow ? `0 0 ${size * 2}px ${opts.color}` : 'none';
      p.style.setProperty('--drift', drift + 'px');
      p.style.setProperty('--dur', duration + 's');
      p.style.setProperty('--delay', -delay + 's');
      p.style.animation = `${opts.keyframe} var(--dur) linear var(--delay) infinite`;
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }

  // inject keyframes for particle motions
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes floatUp { from { transform: translate(0,110vh) translateX(0); } to { transform: translate(var(--drift), -10vh) translateX(var(--drift)); } }
    @keyframes fallDown { from { transform: translate(0,-10vh) rotate(0deg); } to { transform: translate(var(--drift), 110vh) rotate(340deg); } }
    @keyframes riseSpark { from { transform: translate(0,10vh) scale(1); opacity:.9; } to { transform: translate(var(--drift), -60vh) scale(.3); opacity:0; } }
    @keyframes driftDust { from { transform: translate(0,100vh); } to { transform: translate(var(--drift), -20vh); } }
  `;
  document.head.appendChild(styleTag);

  spawnParticles(document.getElementById('motes-olympus'), 26, { minSize: 2, maxSize: 5, minDur: 14, maxDur: 26, drift: 60, color: 'rgba(244,223,163,.8)', glow: true, keyframe: 'floatUp' });
  spawnParticles(document.getElementById('petals-temple'), 20, { minSize: 8, maxSize: 16, minDur: 10, maxDur: 20, drift: 120, color: '#c9788a', glow: false, keyframe: 'fallDown' });
  spawnParticles(document.getElementById('sparkles-forge'), 30, { minSize: 2, maxSize: 4, minDur: 3, maxDur: 7, drift: 80, color: '#ffb15c', glow: true, keyframe: 'riseSpark' });
  spawnParticles(document.getElementById('motes-grove'), 18, { minSize: 2, maxSize: 5, minDur: 16, maxDur: 28, drift: 50, color: 'rgba(205,216,255,.8)', glow: true, keyframe: 'floatUp' });
  spawnParticles(document.getElementById('dust-underworld'), 24, { minSize: 2, maxSize: 4, minDur: 12, maxDur: 22, drift: 40, color: 'rgba(127,168,255,.85)', glow: true, keyframe: 'driftDust' });

  document.querySelectorAll('.particle').forEach(p => {
    p.style.top = 0; p.style.left = p.style.left; // no-op keep left
  });

  /* ---------------------------------------------------------------------
     Olympus lightning flicker
  --------------------------------------------------------------------- */
  const lightning = document.getElementById('lightningFlash');
  if (lightning && !prefersReduced) {
    function flicker() {
      lightning.style.transition = 'none';
      lightning.style.background = 'rgba(220,230,255,.55)';
      requestAnimationFrame(() => {
        lightning.style.transition = 'background 0.6s ease-out';
        lightning.style.background = 'rgba(220,230,255,0)';
      });
      setTimeout(flicker, 6000 + Math.random() * 9000);
    }
    setTimeout(flicker, 3000);
  }

  /* ---------------------------------------------------------------------
     Scheda (product card) modals
  --------------------------------------------------------------------- */
  const openButtons = document.querySelectorAll('[data-open]');
  const overlays = document.querySelectorAll('.scheda-overlay');
  let lastFocused = null;

  function openScheda(id) {
    const el = document.getElementById(id);
    if (!el) return;
    lastFocused = document.activeElement;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    const closeBtn = el.querySelector('.scheda-close');
    if (closeBtn) closeBtn.focus();
  }
  function closeScheda(el) {
    el.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  openButtons.forEach(btn => {
    btn.addEventListener('click', () => openScheda(btn.dataset.open));
  });
  overlays.forEach(ov => {
    ov.querySelectorAll('[data-close]').forEach(closer => {
      closer.addEventListener('click', () => closeScheda(ov));
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(ov => { if (ov.classList.contains('open')) closeScheda(ov); });
      closeCartDrawer();
    }
  });

  /* ---------------------------------------------------------------------
     Cart
  --------------------------------------------------------------------- */
  const CART_KEY = 'pantheon-divino-cart';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }

  const cartCountEl = document.getElementById('cartCount');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartDrawer = document.getElementById('cartDrawer');
  const scrim = document.getElementById('scrim');
  const toast = document.getElementById('toast');

  function formatEUR(n) {
    return '€' + n.toLocaleString('it-IT');
  }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function renderCart() {
    cartCountEl.textContent = cart.length;
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">La teca è vuota. Nessuna offerta è stata ancora scelta.</p>';
      cartTotalEl.textContent = formatEUR(0);
      return;
    }
    cartItemsEl.innerHTML = cart.map((item, idx) => `
      <div class="cart-item">
        <div class="swatch" style="background:${item.color}"></div>
        <div class="meta">
          <div class="name">${item.name}</div>
          <div class="piece-realm">${item.realm}</div>
        </div>
        <div class="price">${formatEUR(item.price)}</div>
        <button class="remove-btn" data-remove="${idx}" aria-label="Rimuovi ${item.name}">&times;</button>
      </div>
    `).join('');
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    cartTotalEl.textContent = formatEUR(total);

    cartItemsEl.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.remove, 10), 1);
        saveCart();
        renderCart();
      });
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.push({
        name: btn.dataset.name,
        realm: btn.dataset.realm,
        price: parseInt(btn.dataset.price, 10),
        color: btn.dataset.color
      });
      saveCart();
      renderCart();
      btn.classList.add('added');
      const original = btn.textContent;
      btn.textContent = 'Aggiunto ✦';
      showToast(`${btn.dataset.name} è stata posta nella teca`);
      setTimeout(() => { btn.classList.remove('added'); btn.textContent = original; }, 1800);
    });
  });

  const cartToggle = document.getElementById('cartToggle');
  const closeCartBtn = document.getElementById('closeCart');
  function openCartDrawer() {
    cartDrawer.classList.add('open');
    scrim.classList.add('show');
  }
  function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    scrim.classList.remove('show');
  }
  cartToggle.addEventListener('click', openCartDrawer);
  closeCartBtn.addEventListener('click', closeCartDrawer);
  scrim.addEventListener('click', closeCartDrawer);

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) { showToast('La teca è vuota.'); return; }
    showToast('Il rito è consacrato. Gli dèi ricevono la tua offerta.');
    cart = [];
    saveCart();
    renderCart();
    setTimeout(closeCartDrawer, 1400);
  });

  renderCart();

  /* ---------------------------------------------------------------------
     Back to top
  --------------------------------------------------------------------- */
  document.getElementById('backToTop').addEventListener('click', () => {
    document.getElementById('olympus').scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
  });

})();
