/* Dr. Diego Carrascal — interacciones del sitio (todas las páginas) */

const WA = '573243245856';

const SERVICES = [
  { id: 'botox', name: 'Toxina botulínica (Botox)', img: 'srv-botox.jpg', points: [
    'Suaviza arrugas y líneas de expresión en frente, entrecejo y contorno de ojos.',
    'Resultados naturales y armónicos, sin perder la expresión facial.',
    'Efecto rejuvenecedor, con un rostro más fresco y descansado.'] },
  { id: 'rino', name: 'Rinomodelación sin cirugía', img: 'srv-rinomodelacion.jpg', points: [
    'Mejora el perfil nasal sin cirugía ni anestesia general.',
    'Corrige imperfecciones como la giba y define la punta nasal con ácido hialurónico.',
    'Resultados inmediatos y naturales, con mayor armonía facial.'] },
  { id: 'armonizacion', name: 'Armonización facial', img: 'srv-armonizacion.jpg', points: [
    'Enfoque integral y personalizado, adaptado a la estructura de tu rostro.',
    'Equilibrio y simetría facial, respetando tus rasgos naturales.',
    'Combinación de técnicas avanzadas para resultados armónicos.'] },
  { id: 'ojeras', name: 'Relleno de ojeras', img: 'srv-ojeras.jpg', points: [
    'Corrige el hundimiento de las ojeras, devolviendo volumen al contorno de ojos.',
    'Mejora la coloración oscura, aportando luminosidad a la mirada.',
    'Aspecto más fresco y descansado, sin perder naturalidad.'] },
  { id: 'alectomia', name: 'Alectomía', img: 'srv-alectomia.jpg', points: [
    'Mejora la proporción entre la nariz y el resto del rostro.',
    'Reduce el ancho de las alas nasales para un contorno más refinado.',
    'Procedimiento quirúrgico con cambios permanentes y visibles.'] },
  { id: 'crio', name: 'Criolipólisis', img: 'srv-criolipolisis.jpg', points: [
    'Elimina grasa localizada mediante frío controlado, sin cirugía.',
    'Define la silueta en abdomen, flancos, espalda y muslos.',
    'Tratamiento no invasivo y seguro, con mínima molestia.'] },
  { id: 'capilar', name: 'Terapias capilares', img: 'srv-capilar.jpg', points: [
    'Frena la caída del cabello y fortalece desde la raíz.',
    'Estimula el crecimiento capilar, mejorando densidad y vitalidad.',
    'Mejora la salud del cuero cabelludo con terapias especializadas.'] },
  { id: 'laser', name: 'Láser CO₂', img: 'srv-laser.jpg', points: [
    'Renueva la piel en profundidad y mejora su luminosidad.',
    'Estimula la producción natural de colágeno para una piel más firme.',
    'Mejora manchas, cicatrices y líneas finas.'] },
];

const NEEDS = {
  arrugas: ['botox', 'armonizacion'],
  nariz: ['rino', 'alectomia'],
  ojeras: ['ojeras'],
  armonia: ['armonizacion', 'botox'],
  piel: ['laser'],
  grasa: ['crio'],
  cabello: ['capilar'],
};

// Turismo: lvl 1 = suave, 2 = moderado, 3 = activo
const TOURS = [
  { name: 'Comuna 13 · Graffitour', img: 'comuna-13.jpg', cats: ['cultura'], lvl: 2, time: '≈ 30 min desde El Poblado',
    text: 'Arte urbano, escaleras eléctricas al aire libre, música y la historia de transformación de uno de los barrios más emblemáticos de la ciudad.' },
  { name: 'Metrocable y Parque Arví', img: 'metrocable.jpg', cats: ['naturaleza'], lvl: 2, time: '≈ 1 h en Metro y Metrocable',
    text: 'Sube en teleférico sobre las montañas del valle y llega a un parque natural con senderos, bosque y mercados campesinos.' },
  { name: 'Plaza Botero', img: 'plaza-botero.jpg', cats: ['cultura', 'suave'], lvl: 1, time: '≈ 25 min en Metro',
    text: 'Esculturas monumentales de Fernando Botero al aire libre, frente al Palacio de la Cultura y junto al Museo de Antioquia.' },
  { name: 'Jardín Botánico', img: 'flores.jpg', cats: ['naturaleza', 'suave'], lvl: 1, time: '≈ 30 min desde El Poblado',
    text: 'Orquideorama, lagos y senderos tranquilos. Al lado, Parque Explora con su acuario y museo interactivo.' },
  { name: 'El Poblado y Provenza', img: 'poblado-verde.jpg', cats: ['suave', 'cultura'], lvl: 1, time: 'A minutos del consultorio',
    text: 'Cafés de especialidad, restaurantes y diseño local en las calles arboladas alrededor del consultorio.' },
  { name: 'Miradores de noche', img: 'medellin-noche.jpg', cats: ['suave'], lvl: 1, time: '≈ 20 min por Las Palmas',
    text: 'Medellín iluminada desde las montañas. Un plan tranquilo para ver el atardecer y la ciudad encendida.' },
  { name: 'Guatapé', img: 'guatape-calles.jpg', cats: ['escapada', 'suave'], lvl: 1, time: '≈ 2 h por carretera',
    text: 'Pueblo de zócalos coloridos a orillas del embalse más famoso de Antioquia. Paseos en lancha y gastronomía local.' },
  { name: 'Piedra del Peñol', img: 'piedra-penol.jpg', cats: ['escapada', 'naturaleza'], lvl: 3, time: '≈ 2 h por carretera',
    text: 'Más de 700 escalones hasta la cima para una de las vistas más impresionantes de Colombia. Mejor cuando ya estés recuperado.' },
  { name: 'Santa Elena', img: 'santa-elena.jpg', cats: ['escapada', 'naturaleza', 'suave'], lvl: 1, time: '≈ 45 min desde El Poblado',
    text: 'Tierra de silleteros: fincas de flores, tradición paisa y aire de montaña para un día tranquilo.' },
  { name: 'Ruta del café', img: 'cafe.jpg', cats: ['escapada', 'suave'], lvl: 1, time: 'Día completo',
    text: 'Visita una finca cafetera de Antioquia y descubre el recorrido del grano a la taza, con paisaje de montaña.' },
];
const LVL = ['', 'Suave', 'Moderado', 'Activo'];

const DAYS = [
  { t: 'Llegada', img: 'medellin-poblado.jpg', items: ['Aterriza en el aeropuerto José María Córdova.', 'Instálate en El Poblado, cerca del consultorio.', 'Cena tranquila en Provenza.'] },
  { t: 'Valoración y tratamiento', img: 'poblado-verde.jpg', items: ['Valoración médica especializada con el doctor.', 'Tu procedimiento, si es el indicado para ti.', 'Tarde de descanso en tu hotel.'] },
  { t: 'Un plan suave', img: 'plaza-botero.jpg', items: ['Jardín Botánico o Plaza Botero a tu ritmo.', 'Café de especialidad en El Poblado.', 'Siempre según las indicaciones del doctor.'] },
  { t: 'Control y ciudad', img: 'metrocable.jpg', items: ['Control con el doctor, si aplica a tu tratamiento.', 'Comuna 13 o Metrocable si ya te sientes bien.', 'Atardecer en un mirador.'] },
  { t: 'Escapada', img: 'guatape-embalse.jpg', items: ['Día en Guatapé y su embalse.', 'Últimas compras y recomendaciones de cuidado.', 'Regreso a casa con tu mejor versión.'] },
];

const byId = Object.fromEntries(SERVICES.map(s => [s.id, s]));
const waLink = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// El pie se inserta en DOMContentLoaded (layout.js); se inicia después.
document.addEventListener('DOMContentLoaded', init);

function init() {
  renderServices();
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
    $$('[data-count]').forEach(el => (el.textContent = Number(el.dataset.count).toLocaleString('es-CO')));
    placePill();
  } else {
    initMotion(ready, mWords);
  }
}

/* ---------- Tratamientos ---------- */
function renderServices() {
  const track = $('#servicesTrack');
  if (!track) return;
  track.innerHTML = SERVICES.map((s, i) => `
  <article class="svc" id="srv-${s.id}">
    <div class="svc-img"><img src="assets/img/${s.img}" alt="${s.name}" loading="lazy"></div>
    <div class="svc-body">
      <span class="svc-n">${String(i + 1).padStart(2, '0')} / ${String(SERVICES.length).padStart(2, '0')}</span>
      <h3>${s.name}</h3>
      <ul>${s.points.map(p => `<li>${p}</li>`).join('')}</ul>
      <div class="svc-actions">
        <a href="agenda.html?proc=${s.id}">Agendar</a>
        <a href="${waLink(`Hola Dr. Diego, quiero más información sobre ${s.name}.`)}" target="_blank" rel="noopener">Más información →</a>
      </div>
    </div>
  </article>`).join('');
}

/* ---------- Buscador ---------- */
function initFinder() {
  const out = $('#finderResult');
  if (!out) return;
  const show = key => {
    out.innerHTML = NEEDS[key].map(id => {
      const s = byId[id];
      return `<div class="fr-card">
        <img src="assets/img/${s.img}" alt="">
        <div><h3>${s.name}</h3><p>${s.points[0]}</p>
        <a href="agenda.html?proc=${s.id}">Quiero una valoración →</a></div>
      </div>`;
    }).join('');
  };
  chipGroup($$('#finder .chip'), c => show(c.dataset.need));
  show('arrugas');
}

function chipGroup(chips, onPick) {
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-selected', c === chip); });
    onPick(chip);
  }));
}

/* ---------- Turismo: planes ---------- */
function initTours() {
  const grid = $('#todoGrid');
  if (!grid) return;
  const show = cat => {
    const list = TOURS.filter(t => cat === 'todos' || t.cats.includes(cat));
    grid.innerHTML = list.map((t, i) => `
      <article class="tour" style="animation-delay:${i * 0.05}s">
        <div class="tour-img"><img src="assets/img/turismo/${t.img}" alt="${t.name}" loading="lazy"><b class="lvl lvl-${t.lvl}">${LVL[t.lvl]}</b></div>
        <div class="tour-body"><h3>${t.name}</h3><p>${t.text}</p><span class="tour-time">${t.time}</span></div>
      </article>`).join('');
    window.ScrollTrigger && ScrollTrigger.refresh();
  };
  chipGroup($$('.todo-filter .chip'), c => show(c.dataset.cat));
  show('todos');
}

/* ---------- Turismo: itinerario ---------- */
function initDays() {
  const tabs = $('#days'), card = $('#dayCard');
  if (!tabs) return;
  tabs.innerHTML = DAYS.map((d, i) =>
    `<button class="day${i ? '' : ' is-on'}" role="tab" aria-selected="${!i}"><span>Día ${i + 1}</span>${d.t}</button>`).join('');
  const show = i => {
    const d = DAYS[i];
    card.innerHTML = `<img src="assets/img/turismo/${d.img}" alt="">
      <div class="day-body"><span class="day-k">Día ${i + 1}</span><h3>${d.t}</h3>
      <ul>${d.items.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
    card.classList.remove('flip'); void card.offsetWidth; card.classList.add('flip');
  };
  const btns = $$('.day', tabs);
  btns.forEach((b, i) => b.addEventListener('click', () => {
    btns.forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
    show(i);
  }));
  show(0);
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

  $('#pickProc').innerHTML = [...SERVICES.map(s => [s.id, s.name]), ['valoracion', 'Aún no sé, quiero una valoración']]
    .map(([id, name]) => `<button type="button" class="pick-opt" data-v="${id}">${name}</button>`).join('');
  const procName = id => id === 'valoracion' ? 'valoración general' : byId[id].name;

  const go = i => {
    idx = i;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    dots.forEach((d, k) => d.classList.toggle('on', k <= i));
    if (i === 2) $('#wSummary').textContent =
      `${wizard.elements.nombre.value.trim()}, se abrirá WhatsApp con tu solicitud de ${procName(state.proc)} lista para enviar.`;
  };
  const selectProc = id => {
    if (id !== 'valoracion' && !byId[id]) return;
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

  // Viene desde un tratamiento: agenda.html?proc=rino
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
  const loader = $('#loader');
  const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r));
  if (!loader) {
    // rAF no corre en pestañas ocultas: el temporizador garantiza que la cortina siempre se abra
    const open = () => document.documentElement.classList.add('curtain-out');
    requestAnimationFrame(() => requestAnimationFrame(open));
    setTimeout(open, 60);
    return new Promise(r => setTimeout(r, 350));
  }
  const minShow = new Promise(r => setTimeout(r, 1700));
  return Promise.race([Promise.all([minShow, loaded]), new Promise(r => setTimeout(r, 4000))])
    .then(() => loader.classList.add('done'));
}

function initTransitions() {
  // Volver con el botón atrás desde la caché del navegador
  addEventListener('pageshow', e => { if (e.persisted) document.documentElement.classList.remove('leaving'); });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
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
  const nav = $('.nav-links'), pill = $('.nav-pill');
  if (!nav || !pill) return;
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
    // Llegó con ancla desde otra pestaña (p. ej. procedimientos.html#resultados)
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
    gsap.to('.hero-media-inner > img', { scale: 1, ease: 'none',
      scrollTrigger: { trigger: '#heroMedia', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.hero-media-caption, .hero-badge', { y: 50, opacity: 0, stagger: 0.1, duration: 1,
      ease: 'expo.out', scrollTrigger: { trigger: '#heroMedia', start: 'top 30%' } });
  }

  // Contadores
  $$('[data-count]').forEach(el => {
    const obj = { v: 0 };
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
