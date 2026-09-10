(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    document.querySelectorAll('svg').forEach(svg => {
      if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
    });
  }

  /* ---------------------------------------------------------------------
     Language — IT/EN toggle. All static copy lives in I18N; dynamic
     strings (toasts, validation, the order-confirmation popup) are
     assembled with t() at the moment they're needed, so they always
     reflect the language active when the user acts.
  --------------------------------------------------------------------- */
  const LANG_KEY = 'pantheon-divino-lang';
  let currentLang = 'it';
  try { currentLang = localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'it'; } catch (e) {}

  const I18N = {
    it: {
      'curtain.subtitle': "Una discesa dall'Olimpo agli Inferi, in oro, marmo e ombra.",
      'curtain.enter': 'Varca la Soglia',
      'nav.cart': 'Teca',
      'nav.cartAria': 'Apri la teca',
      'thread.olympus': 'Olimpo', 'thread.temple': 'Tempio', 'thread.forge': 'Fucine',
      'thread.grove': 'Ulivo Sacro', 'thread.underworld': 'Oltretomba',
      'cart.title': 'La Tua Teca Sacra',
      'cart.empty': 'La teca è vuota. Nessuna offerta è stata ancora scelta.',
      'cart.checkoutBtn': "Consacra l'Acquisto",
      'cart.emptyToast': 'La teca è vuota.',
      'cart.addedSuffix': ' è stata posta nella teca',
      'cart.removeAria': 'Rimuovi ',
      'checkout.shippingLabel': 'Spedizione', 'checkout.shippingFree': 'Gratuita',
      'checkout.totalLabel': 'Totale',
      'btn.addToCart': 'Aggiungi alla Teca',
      'btn.added': 'Aggiunto ✦',
      'realm.olympus.chapter': 'Capitolo I', 'realm.olympus.title': "L'Olimpo Celeste",
      'realm.olympus.lede': "Sopra le nubi, dove il cielo si piega in cobalto e i troni sono d'oro battuto, Zeus ed Era dettano il principio di ogni cosa. Qui nasce l'ornamento che non conosce tramonto.",
      'realm.olympus.btnZeus': 'Il Dono di Zeus', 'realm.olympus.btnEra': 'Il Dono di Era',
      'realm.temple.chapter': 'Capitolo II', 'realm.temple.title': 'Il Tempio di Ares e Afrodite',
      'realm.temple.lede': "Tra colonne di marmo antico, dove petali di rosa cadono come sangue e desiderio, guerra e bellezza si fondono in un solo giuramento d'argento e rubino.",
      'realm.temple.btnAres': 'Il Dono di Ares', 'realm.temple.btnAfrodite': 'Il Dono di Afrodite',
      'realm.forge.chapter': 'Capitolo III', 'realm.forge.title': 'Le Fucine di Efesto',
      'realm.forge.lede': "Nel ventre della montagna, dove il metallo canta e la scintilla danza come una preghiera, Efesto piega la materia grezza alla volontà dell'arte.",
      'realm.forge.btnEfesto': 'Il Dono di Efesto',
      'realm.grove.chapter': 'Capitolo IV', 'realm.grove.title': "L'Albero Sacro di Ermes",
      'realm.grove.lede': 'Ai confini del mondo noto, sotto un ulivo millenario che ha visto mille crepuscoli, il messaggero degli dèi cesella ornamenti leggeri come un pensiero in volo.',
      'realm.grove.btnErmes': 'Il Dono di Ermes',
      'realm.underworld.chapter': 'Capitolo V', 'realm.underworld.title': "L'Oltretomba di Ade e Persefone",
      'realm.underworld.lede': "La terra si spacca e rivela fiotti di luce eterea, blu e oro contro l'ossidiana. Qui il regno più oscuro custodisce la collezione più preziosa: dove la fine ritorna, sempre, principio.",
      'realm.underworld.btnAde': 'Il Dono di Ade', 'realm.underworld.btnPersefone': 'Il Dono di Persefone',
      'finale.eyebrow': 'Epilogo',
      'finale.text': '"La fine diventa principio." Il tuo viaggio attraverso il Pantheon si chiude qui — ma ogni gioiello scelto porta con sé il seme di un nuovo inizio.',
      'finale.button': "Risali all'Olimpo",
      'footer.text': "Pantheon Divino — un'esperienza immersiva. Ogni pezzo è forgiato su ordinazione, come un mito che si racconta una sola volta.",
      'product.zeus.eyebrow': "Collezione dell'Olimpo — Zeus", 'product.zeus.title': 'Folgore Regale',
      'product.zeus.setname': 'Bracciale rigido in oro 18k con fulmine in zaffiro',
      'product.zeus.desc': "Un bracciale rigido in oro 18 carati, aperto come un abbraccio regale, che racchiude uno zaffiro tagliato a forma di fulmine. Il metallo conserva il calore del tuono; la pietra, la sua luce trattenuta.",
      'product.era.eyebrow': "Collezione dell'Olimpo — Era", 'product.era.title': 'Corona di Giunone',
      'product.era.setname': 'Diadema in oro con perle e pietra verde-pavone',
      'product.era.desc': "Un diadema in oro con perle candide e uno smeraldo dai riflessi di pavone incastonato al centro, ispirato alle piume che vegliano su ogni segreto dell'Olimpo. Regalità che non chiede permesso.",
      'product.ares.eyebrow': 'Collezione del Tempio — Ares', 'product.ares.title': 'Lama Ardente',
      'product.ares.setname': 'Anello in argento brunito con rubino',
      'product.ares.desc': 'Un anello in argento brunito, teso come una lama in tensione, incastonato con un rubino sfaccettato che arde come una ferita di guerra mai del tutto rimarginata.',
      'product.afrodite.eyebrow': 'Collezione del Tempio — Afrodite', 'product.afrodite.title': 'Cuore di Rose',
      'product.afrodite.setname': 'Collana in oro rosa con pendente rubino',
      'product.afrodite.desc': 'Una collana in oro rosa con pendente a forma di petalo, incastonato con un rubino che pulsa come una rosa appena recisa. Desiderio reso eterno nel metallo.',
      'product.efesto.eyebrow': 'Collezione delle Fucine — Efesto', 'product.efesto.title': 'Morso della Forgia',
      'product.efesto.setname': 'Anello in metallo grezzo con pietra lavica',
      'product.efesto.desc': "Un anello massiccio in metallo grezzo, martellato a caldo, che porta ancora i segni dell'incudine. Al centro, una pietra lavica cattura l'ultimo bagliore della fiamma.",
      'product.ermes.eyebrow': "Collezione dell'Ulivo Sacro — Ermes", 'product.ermes.title': 'Ali Veloci',
      'product.ermes.setname': 'Bracciale in oro bianco con diamanti',
      'product.ermes.desc': 'Un bracciale in oro bianco, alato su entrambi i lati, tempestato di piccoli diamanti che scintillano come pensieri in volo. Leggero, veloce, irrequieto.',
      'product.ade.eyebrow': "Collezione dell'Oltretomba — Ade", 'product.ade.title': "Sigillo dell'Abisso",
      'product.ade.setname': 'Anello in oro antico con onice',
      'product.ade.desc': 'Un anello in oro antico ossidato, che custodisce un onice sfaccettato dai riflessi viola. Il sigillo di chi regna dove la luce non osa scendere.',
      'product.persefone.eyebrow': "Collezione dell'Oltretomba — Persefone", 'product.persefone.title': 'Semi di Melagrana',
      'product.persefone.setname': 'Collana in oro antico con granati · orecchini in cristallo scuro',
      'product.persefone.desc': 'Una collana in oro antico con pendente a grappolo di granati, come semi di melagrana appena schiusi, abbinata a orecchini in cristallo scuro che catturano la luce eterea degli Inferi.',
      'translit.Principioefinediogni': 'Principio e fine di ogni cosa',
      'translit.Amore,vincitorenella': 'Amore, vincitore nella battaglia',
      'translit.Lartedominalanatura': "L'arte domina la natura",
      'translit.Lingegnotrovalavia': "L'ingegno trova la via",
      'translit.Lafinediventaprincip': 'La fine diventa principio',
      'persOpt.set': 'Set completo — Collana e Orecchini',
      'persOpt.necklace': 'Solo la Collana',
      'persOpt.earrings': 'Solo gli Orecchini',
      'checkout.demoBadge': 'Ambiente dimostrativo · nessun pagamento reale · nessun dato viene inviato o conservato',
      'checkout.summaryEyebrow': "Riepilogo dell'Offerta", 'checkout.summaryTitle': 'La Tua Teca',
      'checkout.codFeeLabel': 'Contrassegno',
      'checkout.dataEyebrow': 'Dati del Devoto',
      'checkout.firstName': 'Nome', 'checkout.lastName': 'Cognome', 'checkout.email': 'Email',
      'checkout.newsletter': 'Desidero iscrivermi alla newsletter del Pantheon, per ricevere in anteprima nuove collezioni e offerte.',
      'checkout.address': 'Indirizzo', 'checkout.zip': 'CAP', 'checkout.city': 'Città',
      'checkout.country': 'Paese', 'checkout.region': 'Regione', 'checkout.province': 'Provincia',
      'checkout.paymentEyebrow': 'Modalità di Pagamento', 'checkout.chooseMethod': 'Scegli come pagare',
      'checkout.payCard': 'Carta di credito / debito', 'checkout.payCod': 'Contrassegno — paga alla consegna',
      'checkout.payBank': 'Bonifico bancario',
      'checkout.cardName': 'Titolare della carta', 'checkout.cardNumber': 'Numero carta',
      'checkout.cardExpiry': 'Scadenza (MM/AA)', 'checkout.cardCvv': 'CVV',
      'checkout.codNote': 'Pagherai in contanti o con carta direttamente al corriere alla consegna. Il contrassegno prevede un supplemento di €5.',
      'checkout.bankNote': 'Riceverai le coordinate bancarie via email per completare il bonifico (simulazione).',
      'checkout.submitPrefix': 'Consacra il Rito —',
      'checkout.successEyebrow': 'Il Rito è Compiuto',
      'checkout.successSub': 'Salve — il tuo omaggio è stato accolto',
      'checkout.popupNote': "Abbiamo aperto anche una scheda separata con il riepilogo completo dell'ordine.",
      'checkout.backBtn': 'Torna al Pantheon',
      'checkout.selectRegion': 'Seleziona la regione', 'checkout.selectProvince': 'Seleziona la provincia',
      'checkout.selectProvinceFirst': 'Seleziona prima la regione', 'checkout.countryItaly': 'Italia',
      'checkout.errorCardDigits': 'Il numero della carta deve avere 16 cifre.',
      'checkout.errorExpiryFormat': 'Inserisci la scadenza nel formato MM/AA.',
      'checkout.errorExpiryMonth': 'Il mese di scadenza non è valido.',
      'checkout.errorExpired': 'La carta risulta scaduta.',
      'checkout.errorCvv': 'Il CVV deve avere 3 o 4 cifre.',
      'checkout.payLabelCard': 'Carta di credito/debito', 'checkout.payLabelCod': 'Contrassegno alla consegna',
      'checkout.payLabelBank': 'Bonifico bancario',
      'checkout.itemSingular': 'oggetto', 'checkout.itemPlural': 'oggetti',
      'checkout.thanksPrefix': 'Grazie, ',
      'checkout.thanksToastSuffix': '! Controlla la nuova scheda per la conferma del tuo Rito.',
      'checkout.emailNotePrefix': "Ti abbiamo inviato un'email di conferma a ",
      'checkout.emailNoteSuffix': '. (Simulazione — nessuna email reale è stata inviata.)',
      'checkout.newsletterNote': ' Ti sei iscritto/a anche alla newsletter del Pantheon. (Simulazione.)',
      'checkout.noteCard': 'Hai consacrato {count} {word} per un totale di {total}, spedizione gratuita inclusa. (Simulazione — nessun addebito reale è stato effettuato.)',
      'checkout.noteCod': 'Hai consacrato {count} {word} per un totale di {total} (spedizione gratuita, supplemento contrassegno di {fee} incluso): pagherai al corriere alla consegna. (Simulazione — nessuna spedizione reale verrà effettuata.)',
      'checkout.noteBank': 'Hai consacrato {count} {word} per un totale di {total}, spedizione gratuita inclusa, da completare tramite bonifico. (Simulazione — nessuna email reale viene inviata.)',
      'audio.enable': 'Attiva audio ambientale', 'audio.disable': 'Disattiva audio ambientale',
      'lang.switchAria': 'Switch language / Cambia lingua',
      'popup.title': 'Pantheon Divino — Conferma del Rito',
      'popup.demoBadge': 'Ambiente dimostrativo — nessun addebito reale',
      'popup.h1': 'Χαῖρε',
      'popup.msg': 'Hai consacrato {count} {word} per un totale di {total}, con spedizione gratuita.',
      'popup.orderLabel': 'Ordine:', 'popup.trackingLabel': 'Tracciamento:',
      'popup.addrLine': 'Spedizione a: {addr}<br>Pagamento: {payment}',
      'popup.newsletterNote': 'Ti sei iscritto/a anche alla newsletter del Pantheon. (Simulazione — nessuna iscrizione reale è stata effettuata.)',
      'popup.closeBtn': 'Chiudi questa finestra',
    },
    en: {
      'curtain.subtitle': 'A descent from Olympus to the Underworld, in gold, marble and shadow.',
      'curtain.enter': 'Cross the Threshold',
      'nav.cart': 'Case',
      'nav.cartAria': 'Open the case',
      'thread.olympus': 'Olympus', 'thread.temple': 'Temple', 'thread.forge': 'Forge',
      'thread.grove': 'Sacred Grove', 'thread.underworld': 'Underworld',
      'cart.title': 'Your Sacred Case',
      'cart.empty': 'The case is empty. No offering has been chosen yet.',
      'cart.checkoutBtn': 'Consecrate the Purchase',
      'cart.emptyToast': 'The case is empty.',
      'cart.addedSuffix': ' has been placed in the case',
      'cart.removeAria': 'Remove ',
      'checkout.shippingLabel': 'Shipping', 'checkout.shippingFree': 'Free',
      'checkout.totalLabel': 'Total',
      'btn.addToCart': 'Add to the Case',
      'btn.added': 'Added ✦',
      'realm.olympus.chapter': 'Chapter I', 'realm.olympus.title': 'Celestial Olympus',
      'realm.olympus.lede': 'Above the clouds, where the sky bends to cobalt and the thrones are of beaten gold, Zeus and Hera decree the principle of all things. Here is born the ornament that knows no dusk.',
      'realm.olympus.btnZeus': 'The Gift of Zeus', 'realm.olympus.btnEra': 'The Gift of Hera',
      'realm.temple.chapter': 'Chapter II', 'realm.temple.title': 'The Temple of Ares and Aphrodite',
      'realm.temple.lede': 'Among columns of ancient marble, where rose petals fall like blood and desire, war and beauty merge into a single oath of silver and ruby.',
      'realm.temple.btnAres': 'The Gift of Ares', 'realm.temple.btnAfrodite': 'The Gift of Aphrodite',
      'realm.forge.chapter': 'Chapter III', 'realm.forge.title': 'The Forge of Hephaestus',
      'realm.forge.lede': "In the mountain's belly, where metal sings and sparks dance like a prayer, Hephaestus bends raw matter to the will of art.",
      'realm.forge.btnEfesto': 'The Gift of Hephaestus',
      'realm.grove.chapter': 'Chapter IV', 'realm.grove.title': "Hermes' Sacred Tree",
      'realm.grove.lede': "At the edge of the known world, beneath a thousand-year olive tree that has seen a thousand dusks, the messenger of the gods carves ornaments as light as a thought in flight.",
      'realm.grove.btnErmes': 'The Gift of Hermes',
      'realm.underworld.chapter': 'Chapter V', 'realm.underworld.title': 'The Underworld of Hades and Persephone',
      'realm.underworld.lede': 'The earth splits and reveals streams of ethereal light, blue and gold against obsidian. Here the darkest realm guards the most precious collection: where the end returns, always, to the beginning.',
      'realm.underworld.btnAde': 'The Gift of Hades', 'realm.underworld.btnPersefone': 'The Gift of Persephone',
      'finale.eyebrow': 'Epilogue',
      'finale.text': '"The end becomes the beginning." Your journey through the Pantheon closes here — but every jewel chosen carries within it the seed of a new start.',
      'finale.button': 'Return to Olympus',
      'footer.text': 'Pantheon Divino — an immersive experience. Every piece is forged to order, like a myth told only once.',
      'product.zeus.eyebrow': 'Olympus Collection — Zeus', 'product.zeus.title': 'Regal Thunderbolt',
      'product.zeus.setname': 'Rigid 18k gold bracelet with sapphire lightning bolt',
      'product.zeus.desc': "A rigid 18-karat gold bracelet, open like a regal embrace, cradling a sapphire cut into the shape of a lightning bolt. The metal keeps the warmth of thunder; the stone, its captured light.",
      'product.era.eyebrow': 'Olympus Collection — Hera', 'product.era.title': "Juno's Crown",
      'product.era.setname': 'Gold diadem with pearls and a peacock-green stone',
      'product.era.desc': "A gold diadem with candid pearls and a peacock-hued emerald set at its centre, inspired by the feathers that watch over every secret of Olympus. Regality that asks no permission.",
      'product.ares.eyebrow': 'Temple Collection — Ares', 'product.ares.title': 'Burning Blade',
      'product.ares.setname': 'Burnished silver ring with ruby',
      'product.ares.desc': 'A burnished silver ring, taut as a blade under tension, set with a faceted ruby that burns like a wound of war never quite healed.',
      'product.afrodite.eyebrow': 'Temple Collection — Aphrodite', 'product.afrodite.title': 'Heart of Roses',
      'product.afrodite.setname': 'Rose gold necklace with ruby pendant',
      'product.afrodite.desc': 'A rose gold necklace with a petal-shaped pendant, set with a ruby that pulses like a freshly cut rose. Desire made eternal in metal.',
      'product.efesto.eyebrow': 'Forge Collection — Hephaestus', 'product.efesto.title': "The Forge's Bite",
      'product.efesto.setname': 'Raw metal ring with volcanic stone',
      'product.efesto.desc': "A massive ring of raw metal, hot-hammered, still bearing the marks of the anvil. At its centre, a volcanic stone captures the flame's last glow.",
      'product.ermes.eyebrow': 'Sacred Grove Collection — Hermes', 'product.ermes.title': 'Swift Wings',
      'product.ermes.setname': 'White gold bracelet with diamonds',
      'product.ermes.desc': 'A white gold bracelet, winged on both sides, studded with small diamonds that sparkle like thoughts in flight. Light, swift, restless.',
      'product.ade.eyebrow': 'Underworld Collection — Hades', 'product.ade.title': 'Seal of the Abyss',
      'product.ade.setname': 'Antique gold ring with onyx',
      'product.ade.desc': 'An oxidized antique gold ring, cradling a faceted onyx with violet glints. The seal of one who reigns where light dares not descend.',
      'product.persefone.eyebrow': 'Underworld Collection — Persephone', 'product.persefone.title': 'Pomegranate Seeds',
      'product.persefone.setname': 'Antique gold necklace with garnets · dark crystal earrings',
      'product.persefone.desc': 'An antique gold necklace with a cluster pendant of garnets, like freshly opened pomegranate seeds, paired with dark crystal earrings that catch the ethereal light of the Underworld.',
      'translit.Principioefinediogni': 'Beginning and end of all things',
      'translit.Amore,vincitorenella': 'Love, victor in battle',
      'translit.Lartedominalanatura': 'Art masters nature',
      'translit.Lingegnotrovalavia': 'Ingenuity finds the way',
      'translit.Lafinediventaprincip': 'The end becomes the beginning',
      'persOpt.set': 'Full Set — Necklace and Earrings',
      'persOpt.necklace': 'Necklace Only',
      'persOpt.earrings': 'Earrings Only',
      'checkout.demoBadge': 'Demo environment · no real payment · no data is sent or stored',
      'checkout.summaryEyebrow': 'Order Summary', 'checkout.summaryTitle': 'Your Case',
      'checkout.codFeeLabel': 'Cash on delivery',
      'checkout.dataEyebrow': 'Devotee Details',
      'checkout.firstName': 'First name', 'checkout.lastName': 'Last name', 'checkout.email': 'Email',
      'checkout.newsletter': "I'd like to subscribe to the Pantheon newsletter, to get an early look at new collections and offers.",
      'checkout.address': 'Address', 'checkout.zip': 'ZIP / Postal code', 'checkout.city': 'City',
      'checkout.country': 'Country', 'checkout.region': 'Region', 'checkout.province': 'Province',
      'checkout.paymentEyebrow': 'Payment Method', 'checkout.chooseMethod': 'Choose how to pay',
      'checkout.payCard': 'Credit / debit card', 'checkout.payCod': 'Cash on delivery',
      'checkout.payBank': 'Bank transfer',
      'checkout.cardName': 'Cardholder name', 'checkout.cardNumber': 'Card number',
      'checkout.cardExpiry': 'Expiry (MM/YY)', 'checkout.cardCvv': 'CVV',
      'checkout.codNote': 'You will pay in cash or by card directly to the courier on delivery. Cash on delivery carries a €5 surcharge.',
      'checkout.bankNote': "You'll receive the bank details by email to complete the transfer (simulation).",
      'checkout.submitPrefix': 'Consecrate the Rite —',
      'checkout.successEyebrow': 'The Rite is Complete',
      'checkout.successSub': 'Hail — your offering has been received',
      'checkout.popupNote': 'We also opened a separate tab with the full order summary.',
      'checkout.backBtn': 'Return to the Pantheon',
      'checkout.selectRegion': 'Select region', 'checkout.selectProvince': 'Select province',
      'checkout.selectProvinceFirst': 'Select a region first', 'checkout.countryItaly': 'Italy',
      'checkout.errorCardDigits': 'The card number must have 16 digits.',
      'checkout.errorExpiryFormat': 'Enter the expiry date in MM/YY format.',
      'checkout.errorExpiryMonth': 'The expiry month is not valid.',
      'checkout.errorExpired': 'The card has expired.',
      'checkout.errorCvv': 'The CVV must have 3 or 4 digits.',
      'checkout.payLabelCard': 'Credit/debit card', 'checkout.payLabelCod': 'Cash on delivery',
      'checkout.payLabelBank': 'Bank transfer',
      'checkout.itemSingular': 'item', 'checkout.itemPlural': 'items',
      'checkout.thanksPrefix': 'Thank you, ',
      'checkout.thanksToastSuffix': '! Check the new tab for confirmation of your Rite.',
      'checkout.emailNotePrefix': 'We sent a confirmation email to ',
      'checkout.emailNoteSuffix': '. (Simulation — no real email was sent.)',
      'checkout.newsletterNote': " You've also subscribed to the Pantheon newsletter. (Simulation.)",
      'checkout.noteCard': 'You consecrated {count} {word} for a total of {total}, free shipping included. (Simulation — no real charge was made.)',
      'checkout.noteCod': 'You consecrated {count} {word} for a total of {total} (free shipping, {fee} cash-on-delivery surcharge included): you will pay the courier on delivery. (Simulation — no real shipment will occur.)',
      'checkout.noteBank': 'You consecrated {count} {word} for a total of {total}, free shipping included, to complete via bank transfer. (Simulation — no real email is sent.)',
      'audio.enable': 'Enable ambient audio', 'audio.disable': 'Disable ambient audio',
      'lang.switchAria': 'Switch language / Cambia lingua',
      'popup.title': 'Pantheon Divino — Rite Confirmation',
      'popup.demoBadge': 'Demo environment — no real charge',
      'popup.h1': 'Χαῖρε',
      'popup.msg': 'You consecrated {count} {word} for a total of {total}, with free shipping.',
      'popup.orderLabel': 'Order:', 'popup.trackingLabel': 'Tracking:',
      'popup.addrLine': 'Shipping to: {addr}<br>Payment: {payment}',
      'popup.newsletterNote': "You've also subscribed to the Pantheon newsletter. (Simulation — no real subscription was made.)",
      'popup.closeBtn': 'Close this window',
    },
  };

  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || I18N.it[key] || key;
  }
  function tf(key, vars) {
    return t(key).replace(/\{(\w+)\}/g, (m, name) => (vars && vars[name] !== undefined) ? vars[name] : m);
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
    let wantsAudio = false;
    try { wantsAudio = localStorage.getItem('pantheon-divino-audio') === '1'; } catch (e) {}
    if (wantsAudio) setAudioEnabled(true);
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
        setRealmAudio(id);
      }
    });
  }, { threshold: 0.35 });
  realms.forEach(r => sectionObserver.observe(r));

  /* ---------------------------------------------------------------------
     Ambient soundscape — synthesized via Web Audio API, not licensed
     music. A soft drone + harmonic pair per realm, crossfading as you
     scroll. Muted by default until the visitor opts in.
  --------------------------------------------------------------------- */
  const AUDIO_PREF_KEY = 'pantheon-divino-audio';
  const REALM_AUDIO = {
    olympus:    { f1: 220,   f2: 330,   filter: 1800, lfoRate: .07, lfoDepth: 300 },
    temple:     { f1: 196,   f2: 294,   filter: 1200, lfoRate: .12, lfoDepth: 250 },
    forge:      { f1: 98,    f2: 146.8, filter: 700,  lfoRate: .55, lfoDepth: 220 },
    grove:      { f1: 261.6, f2: 392,   filter: 2400, lfoRate: .05, lfoDepth: 350 },
    underworld: { f1: 65.4,  f2: 98,    filter: 380,  lfoRate: .035,lfoDepth: 120 },
  };
  const audioToggleBtn = document.getElementById('audioToggle');
  let audioCtx, masterGain, filterNode, osc1, osc2, lfoOsc, lfoGain;
  let audioInitialized = false;
  let audioEnabled = false;

  function initAudio() {
    if (audioInitialized) return;
    audioInitialized = true;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0;
      masterGain.connect(audioCtx.destination);

      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.Q.value = 0.7;
      filterNode.frequency.value = REALM_AUDIO.olympus.filter;
      filterNode.connect(masterGain);

      const osc1Gain = audioCtx.createGain();
      osc1Gain.gain.value = 0.6;
      osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = REALM_AUDIO.olympus.f1;
      osc1.connect(osc1Gain);
      osc1Gain.connect(filterNode);

      const osc2Gain = audioCtx.createGain();
      osc2Gain.gain.value = 0.28;
      osc2 = audioCtx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = REALM_AUDIO.olympus.f2;
      osc2.connect(osc2Gain);
      osc2Gain.connect(filterNode);

      lfoOsc = audioCtx.createOscillator();
      lfoOsc.frequency.value = REALM_AUDIO.olympus.lfoRate;
      lfoGain = audioCtx.createGain();
      lfoGain.gain.value = REALM_AUDIO.olympus.lfoDepth;
      lfoOsc.connect(lfoGain);
      lfoGain.connect(filterNode.frequency);

      osc1.start(); osc2.start(); lfoOsc.start();
    } catch (e) { audioInitialized = false; }
  }

  function setRealmAudio(realmId) {
    if (!audioCtx || !audioEnabled) return;
    const preset = REALM_AUDIO[realmId];
    if (!preset) return;
    const now = audioCtx.currentTime;
    osc1.frequency.setTargetAtTime(preset.f1, now, 1);
    osc2.frequency.setTargetAtTime(preset.f2, now, 1);
    filterNode.frequency.setTargetAtTime(preset.filter, now, 1);
    lfoOsc.frequency.setTargetAtTime(preset.lfoRate, now, 1);
    lfoGain.gain.setTargetAtTime(preset.lfoDepth, now, 1);
  }

  function setAudioEnabled(enabled) {
    audioEnabled = enabled;
    try { localStorage.setItem(AUDIO_PREF_KEY, enabled ? '1' : '0'); } catch (e) {}
    if (enabled) initAudio();
    if (audioCtx) {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(enabled ? 0.1 : 0, now, 1.2);
      if (enabled) {
        const activeDot = threadDots.find(d => d.classList.contains('active'));
        setRealmAudio(activeDot ? activeDot.dataset.target : 'olympus');
      }
    }
    audioToggleBtn.classList.toggle('muted', !enabled);
    audioToggleBtn.setAttribute('aria-label', enabled ? t('audio.disable') : t('audio.enable'));
  }

  audioToggleBtn.addEventListener('click', () => setAudioEnabled(!audioEnabled));

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
      cartItemsEl.innerHTML = `<p class="cart-empty">${escapeHtml(t('cart.empty'))}</p>`;
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
        <button class="remove-btn" data-remove="${idx}" aria-label="${escapeHtml(t('cart.removeAria'))}${escapeHtml(item.name)}">&times;</button>
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
      btn.textContent = t('btn.added');
      showToast(`${btn.dataset.name}${t('cart.addedSuffix')}`);
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
    if (cart.length === 0) { showToast(t('cart.emptyToast')); return; }
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
  const checkoutCodFeeRow = document.getElementById('checkoutCodFeeRow');
  const cardOnlyInputs = ['ckCardName', 'ckCardNumber', 'ckCardExpiry', 'ckCardCvv'].map(id => document.getElementById(id));
  const COD_FEE = 5;
  function cartSubtotal() { return cart.reduce((sum, i) => sum + i.price, 0); }
  function checkoutTotal() { return cartSubtotal() + (ckPaymentMethodEl.value === 'cod' ? COD_FEE : 0); }

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

  /* -- English display names for the country selector (values stay Italian & stable) -- */
  const COUNTRY_EN = {
    'Albania':'Albania','Andorra':'Andorra','Austria':'Austria','Belgio':'Belgium','Bielorussia':'Belarus',
    'Bosnia ed Erzegovina':'Bosnia and Herzegovina','Bulgaria':'Bulgaria','Cipro':'Cyprus','Città del Vaticano':'Vatican City',
    'Croazia':'Croatia','Danimarca':'Denmark','Estonia':'Estonia','Finlandia':'Finland','Francia':'France','Germania':'Germany',
    'Grecia':'Greece','Irlanda':'Ireland','Islanda':'Iceland','Kosovo':'Kosovo','Lettonia':'Latvia','Liechtenstein':'Liechtenstein',
    'Lituania':'Lithuania','Lussemburgo':'Luxembourg','Macedonia del Nord':'North Macedonia','Malta':'Malta','Moldavia':'Moldova',
    'Monaco':'Monaco','Montenegro':'Montenegro','Norvegia':'Norway','Paesi Bassi':'Netherlands','Polonia':'Poland',
    'Portogallo':'Portugal','Regno Unito':'United Kingdom','Repubblica Ceca':'Czech Republic','Romania':'Romania',
    'San Marino':'San Marino','Serbia':'Serbia','Slovacchia':'Slovakia','Slovenia':'Slovenia','Spagna':'Spain','Svezia':'Sweden',
    'Svizzera':'Switzerland','Ucraina':'Ukraine','Ungheria':'Hungary',
    'Argentina':'Argentina','Bolivia':'Bolivia','Brasile':'Brazil','Canada':'Canada','Cile':'Chile','Colombia':'Colombia',
    'Costa Rica':'Costa Rica','Cuba':'Cuba','Ecuador':'Ecuador','El Salvador':'El Salvador','Giamaica':'Jamaica',
    'Guatemala':'Guatemala','Guyana':'Guyana','Honduras':'Honduras','Messico':'Mexico','Nicaragua':'Nicaragua','Panama':'Panama',
    'Paraguay':'Paraguay','Perù':'Peru','Repubblica Dominicana':'Dominican Republic','Stati Uniti':'United States',
    'Uruguay':'Uruguay','Venezuela':'Venezuela',
    'Arabia Saudita':'Saudi Arabia','Armenia':'Armenia','Azerbaigian':'Azerbaijan','Bahrein':'Bahrain','Bangladesh':'Bangladesh',
    'Cina':'China','Corea del Sud':'South Korea','Emirati Arabi Uniti':'United Arab Emirates','Filippine':'Philippines',
    'Georgia':'Georgia','Giappone':'Japan','Giordania':'Jordan','India':'India','Indonesia':'Indonesia','Iran':'Iran',
    'Iraq':'Iraq','Israele':'Israel','Kazakistan':'Kazakhstan','Kuwait':'Kuwait','Libano':'Lebanon','Malesia':'Malaysia',
    'Mongolia':'Mongolia','Nepal':'Nepal','Oman':'Oman','Pakistan':'Pakistan','Qatar':'Qatar','Singapore':'Singapore',
    'Siria':'Syria','Sri Lanka':'Sri Lanka','Tailandia':'Thailand','Taiwan':'Taiwan','Turchia':'Turkey','Vietnam':'Vietnam',
    'Yemen':'Yemen',
    'Algeria':'Algeria','Angola':'Angola','Camerun':'Cameroon',"Costa d'Avorio":'Ivory Coast','Egitto':'Egypt',
    'Etiopia':'Ethiopia','Ghana':'Ghana','Kenya':'Kenya','Libia':'Libya','Marocco':'Morocco','Mozambico':'Mozambique',
    'Nigeria':'Nigeria','Repubblica Democratica del Congo':'Democratic Republic of the Congo','Senegal':'Senegal',
    'Sudafrica':'South Africa','Tanzania':'Tanzania','Tunisia':'Tunisia','Uganda':'Uganda',
    'Australia':'Australia','Nuova Zelanda':'New Zealand',
  };
  const GROUP_LABELS_EN = { 'Europa':'Europe', 'Americhe':'Americas', 'Asia':'Asia', 'Africa':'Africa', 'Oceania':'Oceania' };

  function populateSelectOptions() {
    // countries: Italia pinned first, then grouped by continent
    const italiaOpt = new Option('Italia', 'Italia', true, true);
    ckCountryEl.appendChild(italiaOpt);
    Object.keys(COUNTRY_GROUPS).forEach(groupName => {
      const group = document.createElement('optgroup');
      group.label = groupName;
      group.dataset.itLabel = groupName;
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

  function applyCountryLanguage(lang) {
    const italiaOpt = ckCountryEl.querySelector('option[value="Italia"]');
    if (italiaOpt) italiaOpt.textContent = lang === 'en' ? 'Italy' : 'Italia';
    ckCountryEl.querySelectorAll('optgroup').forEach(group => {
      const itLabel = group.dataset.itLabel;
      group.label = lang === 'en' ? (GROUP_LABELS_EN[itLabel] || itLabel) : itLabel;
      Array.from(group.children).forEach(opt => {
        opt.textContent = lang === 'en' ? (COUNTRY_EN[opt.value] || opt.value) : opt.value;
      });
    });
  }

  function applyRegionProvincePlaceholders() {
    if (ckRegionEl.options[0] && ckRegionEl.options[0].value === '') ckRegionEl.options[0].textContent = t('checkout.selectRegion');
    if (ckProvinceEl.options[0] && ckProvinceEl.options[0].value === '') {
      const hasRegion = ckRegionEl.value && ITALY_REGIONS[ckRegionEl.value];
      ckProvinceEl.options[0].textContent = hasRegion ? t('checkout.selectProvince') : t('checkout.selectProvinceFirst');
    }
  }

  function updateProvinceOptions(region, selectedProvince) {
    ckProvinceEl.innerHTML = '';
    const provinces = ITALY_REGIONS[region];
    if (!provinces) {
      ckProvinceEl.appendChild(new Option(t('checkout.selectProvinceFirst'), '', true, true));
      return;
    }
    ckProvinceEl.appendChild(new Option(t('checkout.selectProvince'), '', true, true));
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
    checkoutCodFeeRow.hidden = method !== 'cod';
    const total = checkoutTotal();
    checkoutSummaryTotal.textContent = formatEUR(total);
    checkoutSubmitTotal.textContent = formatEUR(total);
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
    const lang = currentLang;
    const itemsHtml = data.items.map(i => `
      <div class="conf-item"><span>${escapeHtml(i.name)}<br><em>${escapeHtml(i.realm)}</em></span><span>${formatEUR(i.price)}</span></div>
    `).join('');
    const itemWord = data.itemCount === 1 ? t('checkout.itemSingular') : t('checkout.itemPlural');
    const html = `<!doctype html>
<html lang="${lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(t('popup.title'))}</title>
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
    <div class="badge">${escapeHtml(t('popup.demoBadge'))}</div>
    <div class="ring">✦</div>
    <span class="eyebrow">${escapeHtml(t('checkout.successEyebrow'))}</span>
    <h1>${t('popup.h1')}</h1>
    <p class="sub">${escapeHtml(t('checkout.successSub'))}</p>
    <h2>${escapeHtml(t('checkout.thanksPrefix'))}${escapeHtml(data.firstName)}</h2>
    <p class="msg">${escapeHtml(tf('popup.msg', { count: data.itemCount, word: itemWord, total: formatEUR(data.total) }))}</p>
    <div class="items">
      ${itemsHtml}
      <div class="row"><span>${escapeHtml(t('checkout.shippingLabel'))}</span><span style="color:#7fe0a6;font-style:italic;">${escapeHtml(t('checkout.shippingFree'))}</span></div>
      ${data.codFee ? `<div class="row"><span>${escapeHtml(t('checkout.codFeeLabel'))}</span><span>+${formatEUR(data.codFee)}</span></div>` : ''}
      <div class="row total-row"><span>${escapeHtml(t('checkout.totalLabel'))}</span><span>${formatEUR(data.total)}</span></div>
    </div>
    <div class="codes">
      <div class="code-pill">${escapeHtml(t('popup.orderLabel'))} ${escapeHtml(data.orderId)}</div>
      <div class="code-pill">${escapeHtml(t('popup.trackingLabel'))} ${escapeHtml(data.trackingNumber)}</div>
    </div>
    <p class="addr">${tf('popup.addrLine', { addr: escapeHtml(data.shippingAddress), payment: escapeHtml(data.paymentLabel) })}</p>
    <p class="email-note">${escapeHtml(t('checkout.emailNotePrefix'))}<strong>${escapeHtml(data.email)}</strong>${escapeHtml(t('checkout.emailNoteSuffix'))}</p>
    ${data.newsletter ? `<p class="email-note">${escapeHtml(t('popup.newsletterNote'))}</p>` : ''}
    <button onclick="window.close()">${escapeHtml(t('popup.closeBtn'))}</button>
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
        showCheckoutError(t('checkout.errorCardDigits'));
        return;
      }
      const expiryMatch = document.getElementById('ckCardExpiry').value.match(/^(\d{2})\/(\d{2})$/);
      if (!expiryMatch) {
        showCheckoutError(t('checkout.errorExpiryFormat'));
        return;
      }
      const month = parseInt(expiryMatch[1], 10);
      const year = 2000 + parseInt(expiryMatch[2], 10);
      if (month < 1 || month > 12) {
        showCheckoutError(t('checkout.errorExpiryMonth'));
        return;
      }
      const now = new Date();
      const expiryDate = new Date(year, month, 0);
      if (expiryDate < now) {
        showCheckoutError(t('checkout.errorExpired'));
        return;
      }
      if (!/^\d{3,4}$/.test(document.getElementById('ckCardCvv').value)) {
        showCheckoutError(t('checkout.errorCvv'));
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
    const newsletter = document.getElementById('ckNewsletter').checked;
    const itemCount = cart.length;
    const codFee = paymentMethod === 'cod' ? COD_FEE : 0;
    const total = cartSubtotal() + codFee;
    const orderId = 'PTH-' + Date.now().toString(36).toUpperCase().slice(-6);
    const trackingNumber = randomTrackingCode();
    const itemWord = itemCount === 1 ? t('checkout.itemSingular') : t('checkout.itemPlural');
    const paymentLabels = { card: t('checkout.payLabelCard'), cod: t('checkout.payLabelCod'), bank: t('checkout.payLabelBank') };
    const paymentLabel = paymentLabels[paymentMethod] || paymentLabels.card;
    const shippingAddress = `${address}, ${zip} ${city}${province ? ' (' + province + ')' : ''}, ${country}`;
    const orderItemsSnapshot = cart.map(i => ({ name: i.name, realm: i.realm, price: i.price }));

    // Keep a light history for the optional suggestions only — the form
    // itself never prefills, and card details are never stored anywhere.
    addToCustomerHistory({ firstName, lastName, email, address, city });
    populateSuggestionDatalists();

    const noteVars = { count: itemCount, word: itemWord, total: formatEUR(total), fee: formatEUR(codFee) };
    const paymentNotes = {
      card: tf('checkout.noteCard', noteVars),
      cod: tf('checkout.noteCod', noteVars),
      bank: tf('checkout.noteBank', noteVars),
    };

    const popup = openConfirmationWindow({
      firstName, email, orderId, trackingNumber, itemCount, total, codFee,
      items: orderItemsSnapshot, shippingAddress, paymentLabel, newsletter,
    });

    if (popup) {
      // The full confirmation lives in the new tab — no need to duplicate
      // it here too, so just close the checkout and let the tab speak.
      closeCheckout();
      showToast(`${t('checkout.thanksPrefix')}${firstName}${t('checkout.thanksToastSuffix')}`);
    } else {
      // Popup blocked by the browser — show the full confirmation inline
      // so nothing is lost.
      checkoutSuccessName.textContent = `${t('checkout.thanksPrefix')}${firstName}`;
      checkoutSuccessMsg.textContent = paymentNotes[paymentMethod] || paymentNotes.card;
      checkoutOrderId.textContent = orderId;
      checkoutTrackingId.textContent = trackingNumber;
      checkoutEmailNote.textContent = `${t('checkout.emailNotePrefix')}${email}${t('checkout.emailNoteSuffix')}`
        + (newsletter ? t('checkout.newsletterNote') : '');
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

  /* ---------------------------------------------------------------------
     Language toggle
  --------------------------------------------------------------------- */
  const langToggleBtn = document.getElementById('langToggle');

  function applyLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'it';
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) {}
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });

    langToggleBtn.setAttribute('aria-label', t('lang.switchAria'));
    const langCur = langToggleBtn.querySelector('.lang-cur');
    const langOther = langToggleBtn.querySelector('.lang-other');
    if (langCur && langOther) {
      langCur.textContent = currentLang === 'en' ? 'EN' : 'IT';
      langOther.textContent = currentLang === 'en' ? 'IT' : 'EN';
    }

    audioToggleBtn.setAttribute('aria-label', audioEnabled ? t('audio.disable') : t('audio.enable'));

    applyCountryLanguage(currentLang);
    applyRegionProvincePlaceholders();

    renderCart();
  }

  langToggleBtn.addEventListener('click', () => applyLanguage(currentLang === 'en' ? 'it' : 'en'));

  applyLanguage(currentLang);

})();
