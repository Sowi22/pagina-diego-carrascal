/* Dr. Diego Carrascal — interacciones del sitio */

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

const byId = Object.fromEntries(SERVICES.map(s => [s.id, s]));
const waLink = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Render: tarjetas de tratamientos ---------- */
$('#servicesTrack').innerHTML = SERVICES.map((s, i) => `
  <article class="svc">
    <div class="svc-img"><img src="assets/img/${s.img}" alt="${s.name}" loading="lazy"></div>
    <div class="svc-body">
      <span class="svc-n">${String(i + 1).padStart(2, '0')} / ${String(SERVICES.length).padStart(2, '0')}</span>
      <h3>${s.name}</h3>
      <ul>${s.points.map(p => `<li>${p}</li>`).join('')}</ul>
      <a href="${waLink(`Hola Dr. Diego, quiero más información sobre ${s.name}.`)}" target="_blank" rel="noopener">Obtén más información →</a>
    </div>
  </article>`).join('');

/* ---------- Buscador de tratamiento ---------- */
const finderResult = $('#finderResult');
function showNeed(key) {
  finderResult.innerHTML = NEEDS[key].map(id => {
    const s = byId[id];
    return `<div class="fr-card">
      <img src="assets/img/${s.img}" alt="">
      <div><h3>${s.name}</h3><p>${s.points[0]}</p>
      <a href="#agenda" data-proc="${s.id}">Quiero una valoración →</a></div>
    </div>`;
  }).join('');
}
$$('.chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.chip').forEach(c => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-selected', c === chip); });
  showNeed(chip.dataset.need);
}));
showNeed('arrugas');

/* ---------- Comparador antes / después ---------- */
const compare = $('#compare');
$('.compare-range', compare).addEventListener('input', e => compare.style.setProperty('--pos', e.target.value + '%'));

/* ---------- Menú móvil ---------- */
const burger = $('#burger');
function toggleMenu(open) {
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
}
burger.addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));
$$('#menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

/* ---------- Agenda por pasos → WhatsApp ---------- */
const wizard = $('#wizard');
const steps = $$('.wstep', wizard);
const dots = $$('.wizard-steps span', wizard);
const state = { proc: null, sede: null };
let stepIdx = 0;

$('#pickProc').innerHTML = [...SERVICES.map(s => [s.id, s.name]), ['valoracion', 'Aún no sé, quiero una valoración']]
  .map(([id, name]) => `<button type="button" class="pick-opt" data-v="${id}">${name}</button>`).join('');

function goStep(i) {
  stepIdx = i;
  steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
  dots.forEach((d, k) => d.classList.toggle('on', k <= i));
  if (i === 2) {
    const f = wizard.elements;
    $('#wSummary').textContent = `${f.nombre.value.trim()}, se abrirá WhatsApp con tu solicitud de ${procName(state.proc)} lista para enviar.`;
  }
}
const procName = id => id === 'valoracion' ? 'valoración general' : byId[id].name;

function selectProc(id) {
  state.proc = id;
  $$('#pickProc .pick-opt').forEach(b => b.classList.toggle('is-on', b.dataset.v === id));
  $('[data-step="1"] .w-next', wizard).disabled = false;
}
$('#pickProc').addEventListener('click', e => { const b = e.target.closest('.pick-opt'); if (b) selectProc(b.dataset.v); });
$('#pickSede').addEventListener('click', e => {
  const b = e.target.closest('.pick-opt'); if (!b) return;
  state.sede = b.dataset.v;
  $$('#pickSede .pick-opt').forEach(x => x.classList.toggle('is-on', x === b));
});

// Desde el buscador: preselecciona el tratamiento
document.addEventListener('click', e => {
  const a = e.target.closest('[data-proc]');
  if (a) { selectProc(a.dataset.proc); goStep(0); }
});

$$('.w-back', wizard).forEach(b => b.addEventListener('click', () => goStep(stepIdx - 1)));
$$('.w-next', wizard).forEach(b => b.addEventListener('click', () => {
  if (stepIdx === 1) {
    const req = ['nombre', 'whatsapp'].map(n => wizard.elements[n]);
    let ok = true;
    req.forEach(inp => { const bad = !inp.value.trim(); inp.classList.toggle('err', bad); if (bad) ok = false; });
    if (!ok) { req.find(i => i.classList.contains('err')).focus(); return; }
  }
  goStep(stepIdx + 1);
}));

wizard.addEventListener('submit', e => {
  e.preventDefault();
  const f = wizard.elements;
  const v = n => f[n].value.trim();
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

/* ---------- Loader ---------- */
const loader = $('#loader');
const minShow = new Promise(r => setTimeout(r, 1700));
const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r));
const ready = Promise.race([Promise.all([minShow, loaded]), new Promise(r => setTimeout(r, 4000))])
  .then(() => loader.classList.add('done'));

/* ---------- Spotlight en tarjetas ---------- */
$$('.spot').forEach(el => el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', e.clientX - r.left + 'px');
  el.style.setProperty('--y', e.clientY - r.top + 'px');
}));

/* ---------- Animaciones de scroll ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Manifiesto: separar palabras (también sirve sin GSAP)
const KEY = ['mejor', 'versión', 'natural', 'ciencia,', 'precisión', 'médica', 'sensibilidad', 'estética.'];
const mt = $('#manifestoText');
mt.innerHTML = mt.textContent.trim().split(/\s+/)
  .map(w => `<span class="mw${KEY.includes(w.toLowerCase()) ? ' key' : ''}">${w}</span>`).join(' ');
const mWords = $$('.mw', mt);

if (!window.gsap || reduce) {
  document.documentElement.classList.add('no-pin');
  mWords.forEach(w => (w.style.opacity = 1));
  $$('.step').forEach(s => s.classList.add('is-on'));
  $$('[data-count]').forEach(el => (el.textContent = Number(el.dataset.count).toLocaleString('es-CO')));
} else {
  initMotion();
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

function initMotion() {
  gsap.registerPlugin(ScrollTrigger);

  // Scroll suave (Lenis) sincronizado con ScrollTrigger
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      const target = $(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -20 }); }
    });
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

  // Link activo
  $$('.nav-links a').forEach(a => {
    ScrollTrigger.create({
      trigger: a.getAttribute('href'), start: 'top 50%', end: 'bottom 50%',
      onToggle: s => a.classList.toggle('is-active', s.isActive),
    });
  });

  // Títulos palabra por palabra
  $$('[data-split]').forEach(el => {
    const words = splitWords(el);
    if (el.classList.contains('hero-title')) {
      gsap.set(words, { yPercent: 110 });
      ready.then(() => gsap.to(words, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.07 }));
      return;
    }
    gsap.from(words, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  // Aparición suave de bloques
  $$('.reveal').forEach(el => {
    const inHero = el.closest('.hero');
    const tw = gsap.from(el, {
      y: 40, opacity: 0, duration: 1.1, ease: 'expo.out',
      paused: !!inHero,
      scrollTrigger: inHero ? null : { trigger: el, start: 'top 88%' },
    });
    if (inHero) ready.then(() => gsap.delayedCall(0.45, () => tw.play()));
  });

  // Hero: la imagen se expande hasta ocupar toda la pantalla
  const heroInner = $('.hero-media-inner');
  const inset = () => Math.max(parseFloat(getComputedStyle(document.body).getPropertyValue('--gutter')) || 16, (innerWidth - 1280) / 2 + 40);
  gsap.fromTo(heroInner,
    { clipPath: () => `inset(0px ${inset()}px 0px ${inset()}px round 28px)` },
    { clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'none',
      scrollTrigger: { trigger: '#heroMedia', start: 'top 85%', end: 'top top', scrub: true, invalidateOnRefresh: true } });
  gsap.to('.hero-media-inner > img', { scale: 1, ease: 'none',
    scrollTrigger: { trigger: '#heroMedia', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.hero-media-caption, .hero-badge', { y: 50, opacity: 0, stagger: 0.1, duration: 1,
    ease: 'expo.out', scrollTrigger: { trigger: '#heroMedia', start: 'top 30%' } });

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
  ScrollTrigger.create({
    trigger: '#manifesto', start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: s => {
      const lit = Math.round(s.progress * 1.15 * mWords.length);
      mWords.forEach((w, i) => (w.style.opacity = i < lit ? 1 : 0.14));
    },
  });

  // Parallax
  $$('.parallax').forEach(img => {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8 * (+img.dataset.speed / 0.12), ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.fromTo('.about-card', { y: 80, rotate: 8 }, { y: -40, rotate: 3, ease: 'none',
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Tratamientos: scroll horizontal fijado (solo escritorio)
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1001px)', () => {
    const track = $('#servicesTrack');
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
    const track = $('#servicesTrack');
    const onScroll = () => gsap.set('#servicesBar', { scaleX: track.scrollLeft / (track.scrollWidth - track.clientWidth || 1) });
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  });

  // Proceso: el paso visible se activa
  $$('.step').forEach(step => ScrollTrigger.create({
    trigger: step, start: 'top 65%', end: 'bottom 35%',
    onToggle: s => step.classList.toggle('is-on', s.isActive),
  }));
  gsap.to('#processBar', { scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: '.steps', start: 'top 65%', end: 'bottom 50%', scrub: true } });

  // Bento: entrada escalonada
  gsap.from('.tile', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
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
