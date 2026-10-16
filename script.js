/* Dr. Diego Carrascal — interacciones del sitio.
   El contenido viene en el HTML (lo genera tools/build.mjs); aquí solo se anima y se filtra. */

const WA = '573243245856';

// Buscador "¿Qué te gustaría mejorar?" → ids de las tarjetas #srv-<id>
const NEEDS = {
  arrugas: ['botox', 'armonizacion'],
  flacidez: ['bio', 'armonizacion'],
  nariz: ['rino', 'alectomia'],
  labios: ['labios'],
  ojeras: ['ojeras'],
  armonia: ['armonizacion', 'botox'],
  piel: ['laser', 'bio'],
  grasa: ['crio'],
  cabello: ['capilar'],
};

const waLink = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', init);

function init() {
  initHeroVideo();
  initVideos();
  initFinder();
  initTours();
  initDays();
  initCompare();
  initMenu();
  initWizard();
  initSpotlight();
  initTransitions();

  const ready = initLoader();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mWords = splitManifesto();

  if (!window.gsap || reduce) {
    document.documentElement.classList.add('no-pin');
    mWords.forEach(w => (w.style.opacity = 1));
    $$('.step').forEach(s => s.classList.add('is-on'));
    placePill();
  } else {
    initMotion(ready, mWords);
  }
}

function chipGroup(chips, onPick) {
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-selected', c === chip); });
    onPick(chip);
  }));
}

/* ---------- Portada: video vertical (data-video="/assets/video/archivo.mp4") ---------- */
function initHeroVideo() {
  const box = $('.hero-reel');
  const src = box && box.dataset.video.trim();
  if (!src) return; // sin archivo: la portada abre el reel de Instagram (initVideos)
  const v = document.createElement('video');
  Object.assign(v, { muted: true, loop: true, autoplay: true, playsInline: true, preload: 'metadata',
    poster: $('.hero-reel-poster', box).getAttribute('src') });
  v.className = 'hero-reel-poster';
  v.setAttribute('aria-label', box.dataset.label || 'Video');
  v.src = src;
  $('.hero-reel-poster', box).replaceWith(v);
  $('.hero-reel-play', box).remove();
  box.removeAttribute('data-reel');
  v.play().catch(() => {});
}

/* ---------- Videos de Instagram en ventana emergente (se cargan solo al hacer clic) ---------- */
function initVideos() {
  const modal = $('#vmodal');
  if (!modal) return;
  const frame = $('.vmodal-frame', modal);
  const close = () => { modal.close(); frame.innerHTML = ''; };
  $$('[data-reel]').forEach(card => card.addEventListener('click', () => {
    frame.innerHTML = `<iframe src="https://www.instagram.com/reel/${card.dataset.reel}/embed/" title="${card.getAttribute('aria-label') || card.dataset.label || 'Video'}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    modal.showModal();
  }));
  $('.vmodal-close', modal).addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  modal.addEventListener('cancel', () => (frame.innerHTML = ''));
}

/* ---------- Buscador de tratamiento ---------- */
function initFinder() {
  const out = $('#finderResult');
  if (!out) return;
  const show = key => {
    out.innerHTML = NEEDS[key].map(id => {
      const card = $(`#srv-${id}`);
      if (!card) return '';
      const name = $('h3', card).textContent;
      const page = $('h3 a', card).getAttribute('href');
      return `<div class="fr-card">
        <img src="${$('img', card).getAttribute('src')}" alt="">
        <div><h3>${name}</h3><p>${$('li', card).textContent}</p>
        <a href="${page}">Ver procedimiento →</a></div>
      </div>`;
    }).join('');
  };
  chipGroup($$('#finder .chip'), c => show(c.dataset.need));
  show('arrugas');
}

/* ---------- Turismo: filtro de planes ---------- */
function initTours() {
  const grid = $('#todoGrid');
  if (!grid) return;
  const cards = $$('.tour', grid);
  chipGroup($$('.todo-filter .chip'), c => {
    const cat = c.dataset.cat;
    let k = 0;
    cards.forEach(t => {
      const on = cat === 'todos' || t.dataset.cats.split(' ').includes(cat);
      t.hidden = !on;
      if (on) { t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; t.style.animationDelay = (k++ * 0.05) + 's'; }
    });
    window.ScrollTrigger && ScrollTrigger.refresh();
  });
}

/* ---------- Turismo: itinerario ---------- */
function initDays() {
  const btns = $$('.day');
  if (!btns.length) return;
  const cards = $$('.day-card');
  btns.forEach((b, i) => b.addEventListener('click', () => {
    btns.forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
    cards.forEach((c, k) => c.classList.toggle('is-on', k === i));
  }));
}

/* ---------- Comparador antes / después ---------- */
function initCompare() {
  $$('.compare').forEach(c => {
    $('.compare-range', c).addEventListener('input', e => c.style.setProperty('--pos', e.target.value + '%'));
  });
}

/* ---------- Menú móvil ---------- */
function initMenu() {
  const burger = $('#burger');
  if (!burger) return;
  const toggle = open => { document.body.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => toggle(!document.body.classList.contains('menu-open')));
  $$('#menu a').forEach(a => a.addEventListener('click', () => toggle(false)));
}

/* ---------- Agenda por pasos → WhatsApp ---------- */
function initWizard() {
  const wizard = $('#wizard');
  if (!wizard) return;
  const steps = $$('.wstep', wizard);
  const dots = $$('.wizard-steps span', wizard);
  const state = { proc: null, sede: null };
  let idx = 0;

  const procBtn = id => $(`#pickProc [data-v="${id}"]`);
  const procName = id => id === 'valoracion' ? 'valoración general' : procBtn(id).textContent.trim();

  const go = i => {
    idx = i;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    dots.forEach((d, k) => d.classList.toggle('on', k <= i));
    if (i === 2) $('#wSummary').textContent =
      `${wizard.elements.nombre.value.trim()}, se abrirá WhatsApp con tu solicitud de ${procName(state.proc)} lista para enviar.`;
  };
  const selectProc = id => {
    if (!procBtn(id)) return;
    state.proc = id;
    $$('#pickProc .pick-opt').forEach(b => b.classList.toggle('is-on', b.dataset.v === id));
    $('[data-step="1"] .w-next', wizard).disabled = false;
  };
  $('#pickProc').addEventListener('click', e => { const b = e.target.closest('.pick-opt'); if (b) selectProc(b.dataset.v); });
  $('#pickSede').addEventListener('click', e => {
    const b = e.target.closest('.pick-opt'); if (!b) return;
    state.sede = b.dataset.v;
    $$('#pickSede .pick-opt').forEach(x => x.classList.toggle('is-on', x === b));
  });

  // Viene desde un procedimiento: /contacto?proc=rino
  const pre = new URLSearchParams(location.search).get('proc');
  if (pre) selectProc(pre);

  $$('.w-back', wizard).forEach(b => b.addEventListener('click', () => go(idx - 1)));
  $$('.w-next', wizard).forEach(b => b.addEventListener('click', () => {
    if (idx === 1) {
      const req = ['nombre', 'whatsapp'].map(n => wizard.elements[n]);
      req.forEach(inp => inp.classList.toggle('err', !inp.value.trim()));
      const bad = req.find(i => i.classList.contains('err'));
      if (bad) { bad.focus(); return; }
    }
    go(idx + 1);
  }));

  wizard.addEventListener('submit', e => {
    e.preventDefault();
    const v = n => wizard.elements[n].value.trim();
    const lines = [
      'Hola Dr. Diego, quiero agendar una cita.',
      `• Procedimiento: ${procName(state.proc)}`,
      `• Nombre: ${v('nombre')} ${v('apellidos')}`.trim(),
      `• WhatsApp: ${v('whatsapp')}`,
      v('correo') && `• Correo: ${v('correo')}`,
      v('ciudad') && `• Ciudad: ${v('ciudad')}`,
      v('edad') && `• Edad: ${v('edad')}`,
      v('patologia') && `• Patología: ${v('patologia')}`,
      state.sede && `• Sede: ${state.sede}`,
    ].filter(Boolean);
    window.open(waLink(lines.join('\n')), '_blank', 'noopener');
  });
}

/* ---------- Spotlight en tarjetas ---------- */
function initSpotlight() {
  $$('.spot').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', e.clientX - r.left + 'px');
    el.style.setProperty('--y', e.clientY - r.top + 'px');
  }));
}

/* ---------- Loader (solo primera visita) y cortina entre pestañas ---------- */
function initLoader() {
  const html = document.documentElement;
  if (!html.classList.contains('first-visit')) {
    // rAF no corre en pestañas ocultas: el temporizador garantiza que la cortina siempre se abra
    const open = () => html.classList.add('curtain-out');
    requestAnimationFrame(() => requestAnimationFrame(open));
    setTimeout(open, 60);
    return new Promise(r => setTimeout(r, 350));
  }
  const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r));
  const minShow = new Promise(r => setTimeout(r, 1700));
  return Promise.race([Promise.all([minShow, loaded]), new Promise(r => setTimeout(r, 4000))])
    .then(() => $('#loader').classList.add('done'));
}

function initTransitions() {
  // Volver con el botón atrás desde la caché del navegador
  addEventListener('pageshow', e => { if (e.persisted) document.documentElement.classList.remove('leaving'); });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || /\.[a-z0-9]+$/i.test(url.pathname) && !/\.html$/.test(url.pathname)) return;
    if (url.pathname === location.pathname) return; // mismo documento: lo maneja el scroll suave
    e.preventDefault();
    document.documentElement.classList.add('leaving');
    setTimeout(() => (location.href = url.href), 520);
  });
}

/* ---------- Manifiesto ---------- */
function splitManifesto() {
  const mt = $('#manifestoText');
  if (!mt) return [];
  const KEY = ['mejor', 'versión', 'natural', 'ciencia,', 'precisión', 'médica', 'sensibilidad', 'estética.',
    'esencia', 'elegantes,', 'armónicos', 'atemporales.'];
  mt.innerHTML = mt.textContent.trim().split(/\s+/)
    .map(w => `<span class="mw${KEY.includes(w.toLowerCase()) ? ' key' : ''}">${w}</span>`).join(' ');
  return $$('.mw', mt);
}

/* ---------- Pestaña activa (indicador deslizante) ---------- */
function placePill(target) {
  const pill = $('.nav-pill');
  if (!pill) return;
  const a = target || $('.nav-links a.is-active');
  if (!a) { pill.style.opacity = 0; return; }
  pill.style.opacity = 1;
  pill.style.width = a.offsetWidth + 'px';
  pill.style.transform = `translateX(${a.offsetLeft}px)`;
}

function splitWords(el) {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.textContent = part;
          w.append(i); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
  return $$('.w > span', el);
}

function initMotion(ready, mWords) {
  gsap.registerPlugin(ScrollTrigger);

  // Indicador de pestaña: se mueve al pasar el mouse
  placePill();
  addEventListener('resize', () => placePill());
  document.fonts && document.fonts.ready.then(() => placePill());
  $$('.nav-links a').forEach(a => a.addEventListener('mouseenter', () => placePill(a)));
  $('.nav-links').addEventListener('mouseleave', () => placePill());

  // Scroll suave (Lenis) sincronizado con ScrollTrigger
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || url.hash.length < 2) return;
      const target = $(url.hash);
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -90 }); }
    });
    // Llegó con ancla desde otra pestaña (p. ej. /procedimientos#resultados)
    if (location.hash && $(location.hash)) ready.then(() => setTimeout(() => lenis.scrollTo($(location.hash), { offset: -90 }), 200));
  }

  // Barra de progreso + nav que se oculta al bajar
  const nav = $('#nav');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => {
      gsap.set('#progress', { scaleX: self.progress });
      nav.classList.toggle('hide', self.direction === 1 && self.scroll() > 400 && !document.body.classList.contains('menu-open'));
    },
  });

  // Títulos palabra por palabra (el primero de la página entra al cargar)
  const firstTitle = $('main h1[data-split]');
  $$('[data-split]').forEach(el => {
    const words = splitWords(el);
    if (el === firstTitle) {
      gsap.set(words, { yPercent: 110 });
      ready.then(() => gsap.to(words, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.07 }));
      return;
    }
    gsap.from(words, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  // Aparición suave de bloques (los de la primera pantalla esperan al loader)
  $$('.reveal').forEach(el => {
    const above = el.getBoundingClientRect().top < innerHeight;
    const tw = gsap.from(el, {
      y: 40, opacity: 0, duration: 1.1, ease: 'expo.out',
      paused: above,
      scrollTrigger: above ? null : { trigger: el, start: 'top 88%' },
    });
    if (above) ready.then(() => gsap.delayedCall(0.4, () => tw.play()));
  });

  // Inicio: la imagen se expande hasta ocupar toda la pantalla
  if ($('#heroMedia')) {
    const inset = () => Math.max(16, (innerWidth - 1280) / 2 + 40);
    gsap.fromTo('.hero-media-inner',
      { clipPath: () => `inset(0px ${inset()}px 0px ${inset()}px round 28px)` },
      { clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'none',
        scrollTrigger: { trigger: '#heroMedia', start: 'top 85%', end: 'top top', scrub: true, invalidateOnRefresh: true } });
    gsap.to('.hero-bg', { scale: 1, ease: 'none',
      scrollTrigger: { trigger: '#heroMedia', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.hero-media-caption, .hero-badge', { y: 50, opacity: 0, stagger: 0.1, duration: 1,
      ease: 'expo.out', scrollTrigger: { trigger: '#heroMedia', start: 'top 30%' } });
  }

  // Contadores (el número real está en el HTML para buscadores; aquí se anima desde 0)
  $$('[data-count]').forEach(el => {
    const obj = { v: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      v: +el.dataset.count, duration: 2.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString('es-CO')),
    });
  });

  // Manifiesto: las palabras se iluminan
  if (mWords.length) ScrollTrigger.create({
    trigger: '#manifesto', start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: s => {
      const lit = Math.round(s.progress * 1.15 * mWords.length);
      mWords.forEach((w, i) => (w.style.opacity = i < lit ? 1 : 0.14));
    },
  });

  // Parallax
  $$('.parallax').forEach(img => {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  if ($('.about-card')) gsap.fromTo('.about-card', { y: 80, rotate: 8 }, { y: -40, rotate: 3, ease: 'none',
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Tratamientos: scroll horizontal fijado (solo escritorio)
  const track = $('#servicesTrack');
  if (track) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1001px)', () => {
      const dist = () => track.scrollWidth - innerWidth;
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.services-pin', pin: true, start: 'top top', end: () => '+=' + dist(),
          scrub: 0.8, invalidateOnRefresh: true,
          onUpdate: s => gsap.set('#servicesBar', { scaleX: s.progress }),
        },
      });
    });
    mm.add('(max-width: 1000px)', () => {
      const onScroll = () => gsap.set('#servicesBar', { scaleX: track.scrollLeft / (track.scrollWidth - track.clientWidth || 1) });
      track.addEventListener('scroll', onScroll, { passive: true });
      return () => track.removeEventListener('scroll', onScroll);
    });
  }

  // Proceso: el paso visible se activa
  $$('.step').forEach(step => ScrollTrigger.create({
    trigger: step, start: 'top 65%', end: 'bottom 35%',
    onToggle: s => step.classList.toggle('is-on', s.isActive),
  }));
  if ($('#processBar')) gsap.to('#processBar', { scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: '.steps', start: 'top 65%', end: 'bottom 50%', scrub: true } });

  // Bento: entrada escalonada
  if ($('.bento')) gsap.from('.tile', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
    scrollTrigger: { trigger: '.bento', start: 'top 80%' } });

  // Botones magnéticos
  if (matchMedia('(pointer: fine)').matches) {
    $$('.magnetic').forEach(btn => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  ready.then(() => ScrollTrigger.refresh());
}
