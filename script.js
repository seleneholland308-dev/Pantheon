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
      if (checkoutOverlay.classList.contains('open')) closeCheckout();
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

  /* ---------------------------------------------------------------------
     Persefone — choose set / necklace only / earrings only
  --------------------------------------------------------------------- */
  const persOptions = document.getElementById('persOptions');
  if (persOptions) {
    const persAddBtn = document.querySelector('#scheda-persefone .add-cart-btn');
    const persTotalPrice = document.getElementById('persTotalPrice');
    const persNecklaceVisual = document.getElementById('persNecklaceVisual');
    const persEarringsVisual = document.getElementById('persEarringsVisual');

    function applyPersOption(radio) {
      persAddBtn.dataset.name = radio.dataset.name;
      persAddBtn.dataset.price = radio.dataset.price;
      persTotalPrice.textContent = formatEUR(parseInt(radio.dataset.price, 10));
      persOptions.querySelectorAll('.option-card').forEach(card => card.classList.remove('active'));
      radio.closest('.option-card').classList.add('active');

      const showNecklace = radio.value === 'set' || radio.value === 'necklace';
      const showEarrings = radio.value === 'set' || radio.value === 'earrings';
      persNecklaceVisual.classList.toggle('dimmed', !showNecklace);
      persEarringsVisual.classList.toggle('dimmed', !showEarrings);
    }

    persOptions.querySelectorAll('input[name="persOption"]').forEach(radio => {
      radio.addEventListener('change', () => applyPersOption(radio));
    });
    applyPersOption(persOptions.querySelector('input[name="persOption"]:checked'));
  }

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
    closeCartDrawer();
    openCheckout();
  });

  renderCart();

  /* ---------------------------------------------------------------------
     Checkout — demo-only payment page.
     Pure client-side simulation: nothing here is ever sent over the
     network or persisted. Card fields are read only long enough to
     check their shape, then discarded.
  --------------------------------------------------------------------- */
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutFormView = document.getElementById('checkoutFormView');
  const checkoutSuccessView = document.getElementById('checkoutSuccessView');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutSummaryItems = document.getElementById('checkoutSummaryItems');
  const checkoutSummaryTotal = document.getElementById('checkoutSummaryTotal');
  const checkoutSubmitTotal = document.getElementById('checkoutSubmitTotal');
  const checkoutError = document.getElementById('checkoutError');
  const checkoutOrderId = document.getElementById('checkoutOrderId');
  const checkoutTrackingId = document.getElementById('checkoutTrackingId');
  const checkoutEmailNote = document.getElementById('checkoutEmailNote');
  const checkoutPopupNote = document.getElementById('checkoutPopupNote');
  const checkoutSuccessMsg = document.getElementById('checkoutSuccessMsg');
  const checkoutSuccessName = document.getElementById('checkoutSuccessName');
  const ckItalyFields = document.getElementById('ckItalyFields');
  const ckRegionEl = document.getElementById('ckRegion');
  const ckProvinceEl = document.getElementById('ckProvince');
  const ckCountryEl = document.getElementById('ckCountry');
  const ckPaymentMethodEl = document.getElementById('ckPaymentMethod');
  const ckCardFields = document.getElementById('ckCardFields');
  const checkoutCodNote = document.getElementById('checkoutCodNote');
  const checkoutBankNote = document.getElementById('checkoutBankNote');
  const cardOnlyInputs = ['ckCardName', 'ckCardNumber', 'ckCardExpiry', 'ckCardCvv'].map(id => document.getElementById(id));

  /* -- countries, grouped by region -- */
  const COUNTRY_GROUPS = {
    'Europa': ['Albania','Andorra','Austria','Belgio','Bielorussia','Bosnia ed Erzegovina','Bulgaria','Cipro','Città del Vaticano','Croazia','Danimarca','Estonia','Finlandia','Francia','Germania','Grecia','Irlanda','Islanda','Kosovo','Lettonia','Liechtenstein','Lituania','Lussemburgo','Macedonia del Nord','Malta','Moldavia','Monaco','Montenegro','Norvegia','Paesi Bassi','Polonia','Portogallo','Regno Unito','Repubblica Ceca','Romania','San Marino','Serbia','Slovacchia','Slovenia','Spagna','Svezia','Svizzera','Ucraina','Ungheria'],
    'Americhe': ['Argentina','Bolivia','Brasile','Canada','Cile','Colombia','Costa Rica','Cuba','Ecuador','El Salvador','Giamaica','Guatemala','Guyana','Honduras','Messico','Nicaragua','Panama','Paraguay','Perù','Repubblica Dominicana','Stati Uniti','Uruguay','Venezuela'],
    'Asia': ['Arabia Saudita','Armenia','Azerbaigian','Bahrein','Bangladesh','Cina','Corea del Sud','Emirati Arabi Uniti','Filippine','Georgia','Giappone','Giordania','India','Indonesia','Iran','Iraq','Israele','Kazakistan','Kuwait','Libano','Malesia','Mongolia','Nepal','Oman','Pakistan','Qatar','Singapore','Siria','Sri Lanka','Tailandia','Taiwan','Turchia','Vietnam','Yemen'],
    'Africa': ['Algeria','Angola','Camerun','Costa d\'Avorio','Egitto','Etiopia','Ghana','Kenya','Libia','Marocco','Mozambico','Nigeria','Repubblica Democratica del Congo','Senegal','Sudafrica','Tanzania','Tunisia','Uganda'],
    'Oceania': ['Australia','Nuova Zelanda'],
  };

  /* -- Italian regions and their provinces -- */
  const ITALY_REGIONS = {
    'Abruzzo': ['Chieti','L\'Aquila','Pescara','Teramo'],
    'Basilicata': ['Matera','Potenza'],
    'Calabria': ['Catanzaro','Cosenza','Crotone','Reggio Calabria','Vibo Valentia'],
    'Campania': ['Avellino','Benevento','Caserta','Napoli','Salerno'],
    'Emilia-Romagna': ['Bologna','Ferrara','Forlì-Cesena','Modena','Parma','Piacenza','Ravenna','Reggio Emilia','Rimini'],
    'Friuli-Venezia Giulia': ['Gorizia','Pordenone','Trieste','Udine'],
    'Lazio': ['Frosinone','Latina','Rieti','Roma','Viterbo'],
    'Liguria': ['Genova','Imperia','La Spezia','Savona'],
    'Lombardia': ['Bergamo','Brescia','Como','Cremona','Lecco','Lodi','Mantova','Milano','Monza e Brianza','Pavia','Sondrio','Varese'],
    'Marche': ['Ancona','Ascoli Piceno','Fermo','Macerata','Pesaro e Urbino'],
    'Molise': ['Campobasso','Isernia'],
    'Piemonte': ['Alessandria','Asti','Biella','Cuneo','Novara','Torino','Verbano-Cusio-Ossola','Vercelli'],
    'Puglia': ['Bari','Barletta-Andria-Trani','Brindisi','Foggia','Lecce','Taranto'],
    'Sardegna': ['Cagliari','Nuoro','Oristano','Sassari','Sud Sardegna'],
    'Sicilia': ['Agrigento','Caltanissetta','Catania','Enna','Messina','Palermo','Ragusa','Siracusa','Trapani'],
    'Toscana': ['Arezzo','Firenze','Grosseto','Livorno','Lucca','Massa-Carrara','Pisa','Pistoia','Prato','Siena'],
    'Trentino-Alto Adige': ['Bolzano','Trento'],
    'Umbria': ['Perugia','Terni'],
    "Valle d'Aosta": ['Aosta'],
    'Veneto': ['Belluno','Padova','Rovigo','Treviso','Venezia','Verona','Vicenza'],
  };

  function populateSelectOptions() {
    // countries: Italia pinned first, then grouped by continent
    const italiaOpt = new Option('Italia', 'Italia', true, true);
    ckCountryEl.appendChild(italiaOpt);
    Object.keys(COUNTRY_GROUPS).forEach(groupName => {
      const group = document.createElement('optgroup');
      group.label = groupName;
      COUNTRY_GROUPS[groupName].forEach(name => group.appendChild(new Option(name, name)));
      ckCountryEl.appendChild(group);
    });

    // regions
    ckRegionEl.appendChild(new Option('Seleziona la regione', '', true, true));
    Object.keys(ITALY_REGIONS).sort().forEach(region => {
      ckRegionEl.appendChild(new Option(region, region));
    });
    ckProvinceEl.appendChild(new Option('Seleziona prima la regione', '', true, true));
  }
  populateSelectOptions();

  function updateProvinceOptions(region, selectedProvince) {
    ckProvinceEl.innerHTML = '';
    const provinces = ITALY_REGIONS[region];
    if (!provinces) {
      ckProvinceEl.appendChild(new Option('Seleziona prima la regione', '', true, true));
      return;
    }
    ckProvinceEl.appendChild(new Option('Seleziona la provincia', '', true, true));
    provinces.forEach(p => ckProvinceEl.appendChild(new Option(p, p, false, p === selectedProvince)));
  }
  ckRegionEl.addEventListener('change', () => updateProvinceOptions(ckRegionEl.value));

  function toggleItalyFields() {
    ckItalyFields.hidden = ckCountryEl.value !== 'Italia';
  }
  ckCountryEl.addEventListener('change', toggleItalyFields);

  function togglePaymentMethod() {
    const method = ckPaymentMethodEl.value;
    const isCard = method === 'card';
    ckCardFields.hidden = !isCard;
    cardOnlyInputs.forEach(input => { input.required = isCard; });
    checkoutCodNote.hidden = method !== 'cod';
    checkoutBankNote.hidden = method !== 'bank';
  }
  ckPaymentMethodEl.addEventListener('change', togglePaymentMethod);

  // A short history of past devotees, used only to power the optional
  // <datalist> suggestions on the checkout form — never enforced.
  const CUSTOMER_HISTORY_KEY = 'pantheon-divino-customer-history';
  const HISTORY_FIELDS = [
    ['ckFirstName', 'dlFirstName', 'firstName'],
    ['ckLastName', 'dlLastName', 'lastName'],
    ['ckEmail', 'dlEmail', 'email'],
    ['ckAddress', 'dlAddress', 'address'],
    ['ckCity', 'dlCity', 'city'],
  ];

  function loadCustomerHistory() {
    try { return JSON.parse(localStorage.getItem(CUSTOMER_HISTORY_KEY)) || []; } catch (e) { return []; }
  }
  function addToCustomerHistory(entry) {
    const history = loadCustomerHistory().filter(h =>
      !(h.firstName === entry.firstName && h.lastName === entry.lastName && h.email === entry.email)
    );
    history.unshift(entry);
    try { localStorage.setItem(CUSTOMER_HISTORY_KEY, JSON.stringify(history.slice(0, 8))); } catch (e) {}
  }
  function populateSuggestionDatalists() {
    const history = loadCustomerHistory();
    HISTORY_FIELDS.forEach(([, datalistId, key]) => {
      const seen = new Set();
      const options = [];
      history.forEach(entry => {
        const value = entry[key];
        if (value && !seen.has(value)) { seen.add(value); options.push(value); }
      });
      document.getElementById(datalistId).innerHTML = options.map(v => `<option value="${escapeHtml(v)}"></option>`).join('');
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  populateSuggestionDatalists();

  function randomTrackingCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 10; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return 'TRK-' + code;
  }

  // Opens the order confirmation as its own browser tab, styled like the
  // rest of the site. Pure client-side: built from a template string and
  // written into a blank tab, nothing is ever sent anywhere. All
  // user-typed fields are HTML-escaped before insertion.
  function openConfirmationWindow(data) {
    const itemsHtml = data.items.map(i => `
      <div class="conf-item"><span>${escapeHtml(i.name)}<br><em>${escapeHtml(i.realm)}</em></span><span>${formatEUR(i.price)}</span></div>
    `).join('');
    const html = `<!doctype html>
<html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pantheon Divino — Conferma del Rito</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
  *{box-sizing:border-box;}
  body{ margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px 20px;
    background: radial-gradient(ellipse at 50% 20%, #140f22, #050408 70%);
    font-family:'Cormorant Garamond', serif; color:#efe9db; }
  .card{ max-width:560px; width:100%; background: linear-gradient(160deg,#100d16,#050408);
    border:1px solid rgba(217,184,120,.4); border-radius:6px; padding:44px 38px; text-align:center;
    box-shadow: 0 30px 90px rgba(0,0,0,.6); }
  .badge{ display:inline-block; font-family:'Cinzel',serif; font-size:.6rem; letter-spacing:.1em; text-transform:uppercase;
    color:#f4dfa3; background:rgba(217,184,120,.1); border:1px solid rgba(217,184,120,.4); border-radius:999px; padding:7px 16px; margin-bottom:24px; }
  .ring{ width:80px; height:80px; border-radius:50%; border:1px solid #d9b878; margin:0 auto 20px;
    display:flex; align-items:center; justify-content:center; color:#f4dfa3; font-size:1.3rem; }
  .eyebrow{ font-family:'Cinzel',serif; font-size:.68rem; letter-spacing:.3em; text-transform:uppercase; color:#d9b878; opacity:.85; }
  h1{ font-family:'Cinzel',serif; font-size:2rem; color:#f4dfa3; margin:14px 0 2px; }
  .sub{ font-style:italic; color:rgba(239,233,219,.6); margin:0 0 6px; }
  h2{ font-family:'Cinzel',serif; font-size:1.3rem; color:#f4dfa3; margin:0 0 20px; }
  .msg{ color:rgba(239,233,219,.85); margin-bottom:22px; }
  .items{ text-align:left; margin:0 0 16px; }
  .conf-item{ display:flex; justify-content:space-between; gap:10px; font-size:.92rem; padding:10px 0; border-bottom:1px dashed rgba(217,184,120,.2); }
  .conf-item em{ font-style:italic; color:#d9b878; opacity:.8; font-size:.82rem; }
  .row{ display:flex; justify-content:space-between; font-family:'Cinzel',serif; font-size:.85rem; padding:10px 0; }
  .total-row{ border-top:1px solid rgba(217,184,120,.3); color:#f4dfa3; font-size:1.05rem; }
  .codes{ display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin:26px 0; }
  .code-pill{ font-family:'Cinzel',serif; font-size:.75rem; color:#f4dfa3; border:1px dashed rgba(217,184,120,.4); border-radius:999px; padding:9px 18px; }
  .email-note{ font-style:italic; color:rgba(239,233,219,.65); font-size:.9rem; margin-bottom:26px; }
  .addr{ font-size:.88rem; color:rgba(239,233,219,.75); margin-bottom:26px; }
  button{ font-family:'Cinzel',serif; font-size:.7rem; letter-spacing:.2em; text-transform:uppercase; color:#f4dfa3;
    background:transparent; border:1px solid #d9b878; padding:13px 32px; border-radius:4px; cursor:pointer; }
  button:hover{ background:#d9b878; color:#1a1408; }
</style></head>
<body>
  <div class="card">
    <div class="badge">Ambiente dimostrativo — nessun addebito reale</div>
    <div class="ring">✦</div>
    <span class="eyebrow">Il Rito è Compiuto</span>
    <h1>Χαῖρε</h1>
    <p class="sub">Salve — il tuo omaggio è stato accolto</p>
    <h2>Grazie, ${escapeHtml(data.firstName)}</h2>
    <p class="msg">Hai consacrato ${data.itemCount} ${data.itemCount === 1 ? 'oggetto' : 'oggetti'} per un totale di ${formatEUR(data.total)}, con spedizione gratuita.</p>
    <div class="items">
      ${itemsHtml}
      <div class="row"><span>Spedizione</span><span style="color:#7fe0a6;font-style:italic;">Gratuita</span></div>
      <div class="row total-row"><span>Totale</span><span>${formatEUR(data.total)}</span></div>
    </div>
    <div class="codes">
      <div class="code-pill">Ordine: ${escapeHtml(data.orderId)}</div>
      <div class="code-pill">Tracciamento: ${escapeHtml(data.trackingNumber)}</div>
    </div>
    <p class="addr">Spedizione a: ${escapeHtml(data.shippingAddress)}<br>Pagamento: ${escapeHtml(data.paymentLabel)}</p>
    <p class="email-note">Ti abbiamo inviato un'email di conferma a <strong>${escapeHtml(data.email)}</strong>. (Simulazione — nessuna email reale è stata inviata.)</p>
    <button onclick="window.close()">Chiudi questa finestra</button>
  </div>
</body></html>`;
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
    }
    return win;
  }

  function openCheckout() {
    checkoutSummaryItems.innerHTML = cart.map(item => `
      <div class="checkout-summary-item">
        <span>
          <span class="csi-name">${item.name}</span><br>
          <span class="csi-realm">${item.realm}</span>
        </span>
        <span class="csi-price">${formatEUR(item.price)}</span>
      </div>
    `).join('');
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    checkoutSummaryTotal.textContent = formatEUR(total);
    checkoutSubmitTotal.textContent = formatEUR(total);
    checkoutError.hidden = true;
    checkoutForm.reset();
    ckPaymentMethodEl.value = 'card';
    togglePaymentMethod();
    toggleItalyFields();
    checkoutFormView.hidden = false;
    checkoutSuccessView.hidden = true;
    checkoutOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    checkoutOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-checkout-close]').forEach(el => {
    el.addEventListener('click', closeCheckout);
  });
  document.getElementById('checkoutBackBtn').addEventListener('click', closeCheckout);

  // cosmetic input formatting — purely visual, nothing is stored
  const ckCardNumber = document.getElementById('ckCardNumber');
  ckCardNumber.addEventListener('input', () => {
    const digits = ckCardNumber.value.replace(/\D/g, '').slice(0, 16);
    ckCardNumber.value = digits.replace(/(.{4})/g, '$1 ').trim();
  });
  const ckCardExpiry = document.getElementById('ckCardExpiry');
  ckCardExpiry.addEventListener('input', () => {
    const digits = ckCardExpiry.value.replace(/\D/g, '').slice(0, 4);
    ckCardExpiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });
  const ckCardCvv = document.getElementById('ckCardCvv');
  ckCardCvv.addEventListener('input', () => {
    ckCardCvv.value = ckCardCvv.value.replace(/\D/g, '').slice(0, 4);
  });
  const ckZip = document.getElementById('ckZip');
  ckZip.addEventListener('input', () => {
    ckZip.value = ckZip.value.replace(/\D/g, '').slice(0, 5);
  });

  function showCheckoutError(msg) {
    checkoutError.textContent = msg;
    checkoutError.hidden = false;
  }

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    checkoutError.hidden = true;

    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    const paymentMethod = ckPaymentMethodEl.value;
    if (paymentMethod === 'card') {
      const cardDigits = document.getElementById('ckCardNumber').value.replace(/\D/g, '');
      if (cardDigits.length !== 16) {
        showCheckoutError('Il numero della carta deve avere 16 cifre.');
        return;
      }
      const expiryMatch = document.getElementById('ckCardExpiry').value.match(/^(\d{2})\/(\d{2})$/);
      if (!expiryMatch) {
        showCheckoutError('Inserisci la scadenza nel formato MM/AA.');
        return;
      }
      const month = parseInt(expiryMatch[1], 10);
      const year = 2000 + parseInt(expiryMatch[2], 10);
      if (month < 1 || month > 12) {
        showCheckoutError('Il mese di scadenza non è valido.');
        return;
      }
      const now = new Date();
      const expiryDate = new Date(year, month, 0);
      if (expiryDate < now) {
        showCheckoutError('La carta risulta scaduta.');
        return;
      }
      if (!/^\d{3,4}$/.test(document.getElementById('ckCardCvv').value)) {
        showCheckoutError('Il CVV deve avere 3 o 4 cifre.');
        return;
      }
    }

    const firstName = document.getElementById('ckFirstName').value.trim();
    const lastName = document.getElementById('ckLastName').value.trim();
    const email = document.getElementById('ckEmail').value.trim();
    const address = document.getElementById('ckAddress').value.trim();
    const zip = document.getElementById('ckZip').value.trim();
    const city = document.getElementById('ckCity').value.trim();
    const country = ckCountryEl.value;
    const region = ckRegionEl.value;
    const province = ckProvinceEl.value;
    const itemCount = cart.length;
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    const orderId = 'PTH-' + Date.now().toString(36).toUpperCase().slice(-6);
    const trackingNumber = randomTrackingCode();
    const itemWord = itemCount === 1 ? 'oggetto' : 'oggetti';
    const paymentLabels = { card: 'Carta di credito/debito', cod: 'Contrassegno alla consegna', bank: 'Bonifico bancario' };
    const paymentLabel = paymentLabels[paymentMethod] || paymentLabels.card;
    const shippingAddress = `${address}, ${zip} ${city}${province ? ' (' + province + ')' : ''}, ${country}`;
    const orderItemsSnapshot = cart.map(i => ({ name: i.name, realm: i.realm, price: i.price }));

    // Keep a light history for the optional suggestions only — the form
    // itself never prefills, and card details are never stored anywhere.
    addToCustomerHistory({ firstName, lastName, email, address, city });
    populateSuggestionDatalists();

    const paymentNotes = {
      card: `Hai consacrato ${itemCount} ${itemWord} per un totale di ${formatEUR(total)}, spedizione gratuita inclusa. (Simulazione — nessun addebito reale è stato effettuato.)`,
      cod: `Hai consacrato ${itemCount} ${itemWord} per un totale di ${formatEUR(total)}, spedizione gratuita inclusa: pagherai al corriere alla consegna. (Simulazione — nessuna spedizione reale verrà effettuata.)`,
      bank: `Hai consacrato ${itemCount} ${itemWord} per un totale di ${formatEUR(total)}, spedizione gratuita inclusa, da completare tramite bonifico. (Simulazione — nessuna email reale viene inviata.)`,
    };

    const popup = openConfirmationWindow({
      firstName, email, orderId, trackingNumber, itemCount, total,
      items: orderItemsSnapshot, shippingAddress, paymentLabel,
    });

    if (popup) {
      // The full confirmation lives in the new tab — no need to duplicate
      // it here too, so just close the checkout and let the tab speak.
      closeCheckout();
      showToast(`Grazie, ${firstName}! Controlla la nuova scheda per la conferma del tuo Rito.`);
    } else {
      // Popup blocked by the browser — show the full confirmation inline
      // so nothing is lost.
      checkoutSuccessName.textContent = `Grazie, ${firstName}`;
      checkoutSuccessMsg.textContent = paymentNotes[paymentMethod] || paymentNotes.card;
      checkoutOrderId.textContent = orderId;
      checkoutTrackingId.textContent = trackingNumber;
      checkoutEmailNote.textContent = `Ti abbiamo inviato un'email di conferma a ${email}. (Simulazione — nessuna email reale è stata inviata.)`;
      checkoutPopupNote.hidden = true;
      checkoutFormView.hidden = true;
      checkoutSuccessView.hidden = false;
    }

    cart = [];
    saveCart();
    renderCart();
  });

  /* ---------------------------------------------------------------------
     Back to top
  --------------------------------------------------------------------- */
  document.getElementById('backToTop').addEventListener('click', () => {
    document.getElementById('olympus').scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
  });

})();
