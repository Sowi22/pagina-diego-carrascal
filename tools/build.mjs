// Genera las partes compartidas del sitio como HTML estático (SEO/GEO):
// <head> con metadatos y JSON-LD, cabecera, pie, tratamientos, planes de turismo,
// itinerario, preguntas frecuentes y sitemap.xml.
// Uso:  node tools/build.mjs   (reemplaza lo que esté entre <!-- @x --> y <!-- @/x -->)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { PROCS } from './procedimientos.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://pagina-diego-carrascal-7xmd.vercel.app';
const TODAY = new Date().toISOString().slice(0, 10);

const WA = '573243245856';
const PHONE = '+57 324 324 5856';
const EMAIL = 'carrascaldrdiego@gmail.com';
const SLOGAN = 'Tu salud y belleza en las mejores manos';
const IG = 'https://www.instagram.com/drdiegocarrascal/';
const FB = 'https://www.facebook.com/share/1arLPPkcZk/';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Edificio+Xerox+Cra+43A+15+Sur+15+Medell%C3%ADn';
const waLink = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------------- Contenido ---------------- */

export const SERVICES = [
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
  { id: 'labios', name: 'Relleno de labios', img: 'resultado-3.jpg', points: [
    'Volumen, definición e hidratación en un solo tratamiento.',
    'Diseño personalizado que respeta tus facciones.',
    'Labios armónicos y elegantes, sin exageraciones.'] },
  { id: 'bio', name: 'Bioestimulación (Radiesse y Sculptra)', img: 'instagram/ig-06.jpg', points: [
    'Bioestimuladores que activan la producción natural de colágeno.',
    'Mejoran la firmeza y la calidad de la piel de forma progresiva.',
    'Resultados sofisticados y naturales, sin cambiar tus rasgos.'] },
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

// lvl 1 = suave, 2 = moderado, 3 = activo
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

const FAQ_PROC = [
  ['¿Quién es el Dr. Diego Carrascal?',
   'Es médico de la Universidad del Sinú, con Máster en Medicina Estética de la Universidad de Alcalá (Madrid) y Diplomado en Medicina Estética de la FUCS (Bogotá). Se enfoca en armonización facial y resultados naturales, ha atendido a más de 5.000 pacientes y enseña técnicas a otros médicos.'],
  ['¿Dónde atiende el Dr. Diego Carrascal?',
   'En Medellín, en el Edificio Xerox, Cra. 43A #15 Sur 15, piso 8, El Poblado, y en Apartadó, en la región de Urabá. La atención es todos los días de 7:00 a. m. a 7:00 p. m.'],
  ['¿Qué tratamientos realiza?',
   'Toxina botulínica (botox), rinomodelación sin cirugía, armonización facial, relleno de labios, bioestimulación con Radiesse y Sculptra, relleno de ojeras, alectomía, criolipólisis, terapias capilares y láser CO₂.'],
  ['¿La rinomodelación requiere cirugía?',
   'No. La rinomodelación se realiza con ácido hialurónico, sin cirugía ni anestesia general. Permite corregir imperfecciones como la giba y definir la punta nasal, con resultados inmediatos y naturales.'],
  ['¿Qué diferencia hay entre rinomodelación y alectomía?',
   'La rinomodelación no es quirúrgica y mejora el perfil nasal con ácido hialurónico. La alectomía es un procedimiento quirúrgico que reduce el ancho de las alas nasales, con cambios permanentes.'],
  ['¿El botox deja el rostro sin expresión?',
   'El objetivo es suavizar arrugas y líneas de expresión con resultados naturales y armónicos, sin perder la expresión facial.'],
  ['¿Cómo agendo una valoración?',
   `Escribe por WhatsApp al ${PHONE} o usa el formulario de contacto del sitio. Cada tratamiento inicia con una valoración médica especializada, donde el doctor te indica únicamente lo que realmente necesitas.`],
];

const FAQ_HOME = [
  ['¿Qué tratamientos realiza el Dr. Diego Carrascal?',
   'Botox, rinomodelación sin cirugía, armonización facial, relleno de labios, bioestimulación con Radiesse y Sculptra, relleno de ojeras, alectomía, criolipólisis, terapias capilares y láser CO₂.'],
  ['¿Los resultados se ven naturales?',
   'Ese es el enfoque del doctor: resultados elegantes y armónicos que respetan tus rasgos. Cambios que se perciben, no se imponen.'],
  ['¿Cómo sé qué tratamiento necesito?',
   'Cada tratamiento inicia con una valoración médica especializada. El doctor analiza tu rostro y te indica únicamente lo que realmente necesitas.'],
  ['¿Cuánto cuestan los tratamientos?',
   'El valor depende del procedimiento y de tu caso, y se define en la valoración médica. Escríbenos por WhatsApp para agendarla.'],
  ['¿Dónde atiende el Dr. Diego Carrascal?',
   'En el Edificio Xerox, Cra. 43A #15 Sur 15, piso 8, El Poblado, Medellín, y en Apartadó (Urabá). Todos los días de 7:00 a. m. a 7:00 p. m.'],
];

const FAQ_TOUR = [
  ['¿Cuántos días debo quedarme en Medellín?',
   'Depende del procedimiento. Los tratamientos no quirúrgicos suelen requerir estancias más cortas que procedimientos quirúrgicos como la alectomía. En la valoración el doctor te recomienda un tiempo para tu caso.'],
  ['¿Puedo hacer la valoración antes de viajar?',
   'Sí. Si estás en otra ciudad o país, el doctor puede hacer una valoración virtual antes de tu llegada a Medellín. Escríbenos por WhatsApp con el tratamiento que te interesa y tus fechas.'],
  ['¿Dónde me conviene hospedarme?',
   'En El Poblado, la zona del consultorio. Tiene amplia oferta de hoteles y apartamentos, restaurantes y cafés, y es una de las zonas preferidas por los viajeros.'],
  ['¿Cómo llego desde el aeropuerto?',
   'El Aeropuerto Internacional José María Córdova está en Rionegro. Puedes tomar taxi, transporte por aplicación o bus hacia la ciudad; el trayecto toma entre 45 y 60 minutos aproximadamente.'],
  ['¿Puedo hacer turismo después de mi procedimiento?',
   'En muchos casos sí, con algunas precauciones como el sol directo o el ejercicio intenso. El doctor te indicará qué planes son seguros para ti y desde cuándo.'],
  ['¿Atienden fuera de Medellín?',
   'Sí. También atendemos en Apartadó, en la región de Urabá.'],
];

/* ---------------- Videos (reels de @drdiegocarrascal) ---------------- */

const REELS = {
  labios: { id: 'DWAdrnGADDP', img: 'labios-belotero.jpg', tag: 'Relleno de labios', text: 'Volumen, definición y naturalidad en un solo tratamiento.' },
  testimonio: { id: 'C9Q2A2KupSf', img: 'pacientes.jpg', tag: 'Testimonio', text: '“La satisfacción de mis pacientes me motiva a ser mejor cada día.”' },
  nexus: { id: 'DeiV9MBAcI1', img: 'nexus.jpg', tag: 'Nexus Estética Médica', text: 'Gracias a todos los que confían en nosotros para sus procedimientos.' },
  mitos: { id: 'Dekz9b2gikg', img: 'mitos.jpg', tag: 'Mitos de la medicina estética', text: 'El doctor responde lo que más se escucha sobre estos tratamientos.' },
  envejecimiento: { id: 'DevSE2cA614', img: 'envejecimiento.jpg', tag: 'Envejecer bien', text: 'Tratamientos y protocolos para que los años pasen con elegancia.' },
  puertorico: { id: 'Ddkcx0Igkd-', img: 'botox-puerto-rico.jpg', tag: 'Pacientes de Puerto Rico', text: 'Envejecer con dignidad es que te guste lo que ves en el espejo.' },
  ultraformer: { id: 'DdaJRZOAuK4', img: 'ultraformer-papada.jpg', tag: 'Ultraformer MPT', text: '¿Papada que te incomoda? Ultrasonido focalizado para definir el rostro.' },
  virtual: { id: 'DenWkv_gDDK', img: 'valoracion-virtual.jpg', tag: 'Valoración virtual', text: '¿Estás en otra ciudad o país? Te valoramos antes de tu llegada a Medellín.' },
  equipo: { id: 'De-nRYrFNJ5', img: 'equipo.jpg', tag: 'Nuestro equipo', text: 'Gracias a mi equipo por su apoyo en esta hermosa labor de cada día.' },
};

const vcard = k => { const r = REELS[k]; return `
      <button type="button" class="vcard reveal" data-reel="${r.id}" aria-label="Ver video: ${esc(r.tag)}">
        <img src="/assets/img/videos/${r.img}" alt="">
        <span class="vplay" aria-hidden="true">▶</span>
        <span class="vcap"><b>${r.tag}</b>${r.text}</span>
      </button>`; };

// Sección de videos; con "scroll" la fila se recorre en horizontal al bajar (escritorio)
const videoSection = (keys, { eyebrow = 'Videos', title, id = 'videos', scroll = false } = {}) => `
<section class="videos${scroll ? ' videos-scroll' : ''}" id="${id}" aria-labelledby="${id}Title"${scroll ? ' data-hscroll' : ''}>
  <div class="videos-pin">
    <div class="wrap sec-head">
      <div>
        <p class="eyebrow light">${eyebrow}</p>
        <h2 class="h2 light" id="${id}Title" data-split>${title}</h2>
      </div>
      <a href="${IG}" target="_blank" rel="noopener" class="btn btn-ghost light">Más en Instagram ↗</a>
    </div>
    <div class="vgrid${scroll ? ' hscroll-track' : ' wrap'}">${keys.map(vcard).join('')}
    </div>
  </div>
</section>`;

const VIDEO_PARTS = {
  'videos-home': () => videoSection(['labios', 'testimonio', 'mitos', 'envejecimiento', 'nexus', 'puertorico', 'ultraformer'],
    { title: 'Mira lo que viven <em>nuestros pacientes</em>', scroll: true }),
  'videos-about': () => videoSection(['equipo', 'nexus', 'testimonio'],
    { eyebrow: 'Detrás de cámaras', title: 'Un equipo que <em>te acompaña</em>' }),
  'videos-tour': () => videoSection(['virtual', 'puertorico', 'testimonio'],
    { eyebrow: 'Pacientes de todo el mundo', title: 'Tu valoración puede ser <em>virtual</em>' }),
  'videos-proc': () => videoSection(['mitos', 'envejecimiento', 'labios', 'ultraformer'],
    { eyebrow: 'Aprende con el doctor', title: 'Resolvemos los <em>mitos</em>' }),
};
const PROC_REELS = { botox: ['envejecimiento', 'puertorico'], bio: ['envejecimiento', 'mitos'], labios: ['labios', 'testimonio'],
  armonizacion: ['mitos', 'testimonio'], rino: ['testimonio', 'mitos'] };

/* ---------------- Páginas ---------------- */

const PAGES = {
  'index.html': { id: 'inicio', path: '/', label: 'Inicio', type: 'WebPage',
    title: 'Dr. Diego Carrascal | Medicina Estética en Medellín y Urabá',
    description: 'Medicina estética en Medellín con el Dr. Diego Carrascal: botox, rinomodelación sin cirugía, armonización facial, relleno de labios, Radiesse y Sculptra, láser CO₂, criolipólisis y más. Resultados naturales. Agenda tu valoración.',
  },
  'quienes-somos.html': { id: 'quienes-somos', path: '/quienes-somos', label: 'Quiénes somos', type: 'AboutPage',
    title: 'Quiénes somos | Dr. Diego Carrascal, médico estético en Medellín',
    description: 'Conoce al Dr. Diego Carrascal: médico de la Universidad del Sinú, Máster en Medicina Estética de la Universidad de Alcalá (Madrid), docente y con más de 5.000 pacientes atendidos en Medellín y Urabá.' },
  'procedimientos.html': { id: 'procedimientos', path: '/procedimientos', label: 'Procedimientos', type: 'MedicalWebPage',
    title: 'Procedimientos estéticos en Medellín | Botox, rinomodelación y más',
    description: 'Botox, rinomodelación sin cirugía, armonización facial, bioestimulación con Radiesse y Sculptra, relleno de ojeras, alectomía, criolipólisis, terapias capilares y láser CO₂ en Medellín y Apartadó.',
    faq: FAQ_PROC },
  'turismo.html': { id: 'turismo', path: '/turismo', label: 'Turismo médico', type: 'WebPage',
    title: 'Turismo médico en Medellín | Tratamientos estéticos y qué hacer',
    description: '¿Vienes de otra ciudad o país? Planea tu tratamiento estético en Medellín con el Dr. Diego Carrascal: qué hacer en la ciudad, dónde hospedarte, itinerario sugerido y preguntas frecuentes.',
    faq: FAQ_TOUR, theme: '#0B0D18' },
  'contacto.html': { id: 'contacto', path: '/contacto', label: 'Contacto', type: 'ContactPage',
    title: 'Contacto y citas | Dr. Diego Carrascal, Medicina Estética',
    description: `Agenda tu valoración con el Dr. Diego Carrascal en El Poblado, Medellín, o en Apartadó. WhatsApp ${PHONE}. Atención todos los días de 7:00 a. m. a 7:00 p. m.`, theme: '#0B0D18' },
};
const NAV = Object.values(PAGES);
const href = p => p.path === '/' ? '/' : p.path;
const procHref = id => `/procedimientos/${PROCS[id].slug}`;

/* ---------------- JSON-LD ---------------- */

const CLINIC_ID = `${SITE}/#clinica`;
const DOCTOR_ID = `${SITE}/#doctor`;

function schemaGraph(file, page) {
  const url = SITE + href(page);
  const clinic = {
    '@type': ['MedicalClinic', 'MedicalBusiness'], '@id': CLINIC_ID,
    name: 'Dr. Diego Carrascal · Medicina Estética', alternateName: 'Dr. Diego Carrascal',
    slogan: SLOGAN, url: SITE + '/',
    logo: `${SITE}/assets/img/marca/icono-dorado.png`,
    image: [`${SITE}/assets/img/og-dr-diego-carrascal.jpg`, `${SITE}/assets/img/dr-diego-carrascal-retrato.jpg`],
    description: 'Consultorio de medicina estética avanzada del Dr. Diego Carrascal en Medellín, con enfoque en armonización facial y resultados sofisticados y naturales.',
    telephone: PHONE, email: EMAIL,
    address: { '@type': 'PostalAddress', streetAddress: 'Cra. 43A #15 Sur 15, Edificio Xerox, piso 8',
      addressLocality: 'Medellín', addressRegion: 'Antioquia', postalCode: '050022', addressCountry: 'CO' },
    geo: { '@type': 'GeoCoordinates', latitude: 6.1912183, longitude: -75.5769333 },
    hasMap: MAPS,
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '07:00', closes: '19:00' }],
    areaServed: ['Medellín', 'El Poblado', 'Valle de Aburrá', 'Antioquia', 'Apartadó', 'Urabá', 'Colombia']
      .map(n => ({ '@type': 'Place', name: n })),
    availableService: SERVICES.map(s => ({ '@type': 'MedicalProcedure', name: s.name, description: s.points.join(' '),
      url: SITE + procHref(s.id) })),
    founder: { '@id': DOCTOR_ID }, employee: { '@id': DOCTOR_ID },
    sameAs: [IG, FB], knowsLanguage: 'es',
  };
  const doctor = {
    '@type': 'Person', '@id': DOCTOR_ID, name: 'Diego Carrascal', honorificPrefix: 'Dr.',
    jobTitle: 'Médico estético', description: 'Médico especializado en medicina estética avanzada en Medellín, con enfoque en armonización facial y resultados naturales. Docente en medicina estética.',
    image: `${SITE}/assets/img/dr-diego-carrascal-retrato.jpg`, url: `${SITE}/quienes-somos`,
    worksFor: { '@id': CLINIC_ID },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Universidad del Sinú' },
      { '@type': 'CollegeOrUniversity', name: 'Universidad de Alcalá' },
      { '@type': 'CollegeOrUniversity', name: 'Fundación Universitaria de Ciencias de la Salud (FUCS)' },
    ],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'Médico', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Universidad del Sinú' } },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'Máster en Medicina Estética', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Universidad de Alcalá' } },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'Diplomado en Medicina Estética', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Fundación Universitaria de Ciencias de la Salud (FUCS)' } },
    ],
    knowsAbout: ['Medicina estética', 'Armonización facial', 'Rinomodelación', 'Relleno de labios', 'Toxina botulínica', 'Bioestimulación con Radiesse', 'Bioestimulación con Sculptra', 'Láser CO2', 'Criolipólisis', 'Relleno de ojeras', 'Alectomía', 'Terapias capilares'],
    sameAs: [IG],
  };
  const website = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: SITE + '/', name: 'Dr. Diego Carrascal · Medicina Estética',
    inLanguage: 'es-CO', publisher: { '@id': CLINIC_ID } };
  const webpage = { '@type': page.type, '@id': `${url}#webpage`, url, name: page.title, description: page.description,
    inLanguage: 'es-CO', isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': page.id === 'quienes-somos' ? DOCTOR_ID : CLINIC_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/assets/img/og-dr-diego-carrascal.jpg` }, dateModified: TODAY };
  const graph = [website, clinic, doctor, webpage];
  if (page.path !== '/') {
    webpage.breadcrumb = { '@id': `${url}#breadcrumb` };
    const crumbs = page.crumbs || [['Inicio', '/'], [page.label, page.path]];
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: crumbs.map(([name, path], i) =>
      ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path })) });
  }
  if (page.extraWebPage) Object.assign(webpage, page.extraWebPage);
  if (page.extraGraph) graph.push(...page.extraGraph);
  if (page.faq) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: page.faq.map(([q, a]) =>
    ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 1);
}

/* ---------------- Parciales ---------------- */

const head = (file, p) => {
  const url = SITE + href(p);
  return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0B0D18">
<meta name="author" content="Dr. Diego Carrascal">
<meta name="geo.region" content="CO-ANT">
<meta name="geo.placename" content="Medellín">
<meta name="geo.position" content="6.1912183;-75.5769333">
<meta name="ICBM" content="6.1912183, -75.5769333">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_CO">
<meta property="og:site_name" content="Dr. Diego Carrascal · Medicina Estética">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/assets/img/og-dr-diego-carrascal.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Dr. Diego Carrascal, Medicina Estética. ${SLOGAN}.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${SITE}/assets/img/og-dr-diego-carrascal.jpg">
<link rel="icon" href="/assets/img/marca/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/img/marca/favicon-512.png" sizes="512x512" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/marca/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Belleza&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script>try{var v=sessionStorage.getItem('dc-visited');sessionStorage.setItem('dc-visited','1');document.documentElement.className+=v?' return-visit':' first-visit'}catch(e){}</script>
<script type="application/ld+json">
${schemaGraph(file, p)}
</script>
`;
};

const tabs = cur => NAV.map(p =>
  `<a href="${href(p)}"${p.id === cur ? ' class="is-active" aria-current="page"' : ''}>${p.label}</a>`).join('');

const header = (file, p) => `
<a class="skip" href="#main">Saltar al contenido</a>
<div class="loader" id="loader" aria-hidden="true">
  <img src="/assets/img/marca/logo-vertical-claro.png" alt="" class="loader-sign" width="700" height="765" loading="eager">
  <div class="loader-bar"><span></span></div>
</div>
<div class="curtain" id="curtain" aria-hidden="true"><img src="/assets/img/marca/icono-dorado.png" alt="" width="600" height="397" loading="eager"></div>
<div class="progress" id="progress" aria-hidden="true"></div>

<header class="nav" id="nav">
  <a href="/" class="nav-logo" aria-label="Dr. Diego Carrascal, inicio" translate="no">
    <img src="/assets/img/marca/logo-horizontal-claro.png" alt="Dr. Diego Carrascal" width="900" height="201" loading="eager">
  </a>
  <nav class="nav-links" aria-label="Principal">
    ${tabs(p.id)}
    <span class="nav-pill" aria-hidden="true"></span>
  </nav>
  <a href="/contacto" class="btn btn-dark btn-sm magnetic nav-cta">Agendar cita</a>
  <button class="nav-burger" id="burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
</header>

<div class="menu" id="menu" inert aria-hidden="true">
  <nav aria-label="Menú móvil">${tabs(p.id)}</nav>
  <div class="menu-foot">
    <a href="/contacto" class="btn btn-gold">Agendar cita</a>
    <p>${PHONE} · Medellín · Apartadó</p>
  </div>
</div>
`;

const footer = () => `
<footer class="footer">
  <div class="wrap">
    <p class="footer-cta" data-split>¿Listo para realzar tu <em>mejor versión?</em></p>
    <a href="/contacto" class="btn btn-gold btn-lg magnetic">Agenda tu cita hoy</a>
    <p class="footer-slogan">${SLOGAN}</p>
    <div class="footer-cols">
      <div><span>Procedimientos en Medellín</span>${SERVICES.map(s => `<a href="${procHref(s.id)}">${PROCS[s.id].h1}</a>`).join('')}</div>
      <div><span>Explora</span>${NAV.map(p => `<a href="${href(p)}">${p.label}</a>`).join('')}</div>
      <div><span>Escríbenos</span><a href="https://wa.me/${WA}" target="_blank" rel="noopener" translate="no">${PHONE}</a><a href="mailto:${EMAIL}">${EMAIL}</a><p>Todos los días, 7:00 a. m. – 7:00 p. m.</p></div>
      <address><span>Visítanos</span><a href="${MAPS}" target="_blank" rel="noopener">Edificio Xerox, Cra. 43A #15 Sur 15, piso 8, El Poblado, Medellín, Antioquia</a><p>Sede Apartadó, Urabá</p></address>
      <div><span>Síguenos</span><a href="${IG}" target="_blank" rel="noopener">Instagram</a><a href="${FB}" target="_blank" rel="noopener">Facebook</a></div>
    </div>
    <div class="footer-legal"><span>© 2026 <span translate="no">Dr. Diego Carrascal</span> · Medicina Estética. Todos los derechos reservados.</span><a href="#">Política de datos</a></div>
  </div>
</footer>

<dialog class="vmodal" id="vmodal" aria-label="Video">
  <button type="button" class="vmodal-close" aria-label="Cerrar video">×</button>
  <div class="vmodal-frame"></div>
</dialog>

<a class="wa-float" href="${waLink('Hola Dr. Diego, quiero agendar una valoración.')}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>
</a>
`;

const scripts = () => `
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="/script.js" defer></script>
`;

const pad = n => String(n).padStart(2, '0');

const services = () => SERVICES.map((s, i) => `
<article class="svc" id="srv-${s.id}" data-id="${s.id}">
  <div class="svc-img"><img src="/assets/img/${s.img}" alt="${esc(s.name)} en Medellín" loading="lazy"></div>
  <div class="svc-body">
    <span class="svc-n">${pad(i + 1)} / ${pad(SERVICES.length)}</span>
    <h3><a href="${procHref(s.id)}">${s.name}</a></h3>
    <ul>${s.points.map(p => `<li>${p}</li>`).join('')}</ul>
    <div class="svc-actions">
      <a href="/contacto?proc=${s.id}">Agendar</a>
      <a href="${procHref(s.id)}">Ver procedimiento →</a>
    </div>
  </div>
</article>`).join('');

const tours = () => TOURS.map(t => `
<article class="tour" data-cats="${t.cats.join(' ')}">
  <div class="tour-img"><img src="/assets/img/turismo/${t.img}" alt="${esc(t.name)}, Medellín" loading="lazy"><b class="lvl lvl-${t.lvl}">${LVL[t.lvl]}</b></div>
  <div class="tour-body"><h3>${t.name}</h3><p>${t.text}</p><span class="tour-time">${t.time}</span></div>
</article>`).join('');

const days = () => `
<div class="days" role="group" aria-label="Días del itinerario">
${DAYS.map((d, i) => `  <button type="button" class="day${i ? '' : ' is-on'}" aria-pressed="${!i}" aria-controls="day-${i + 1}" data-day="${i + 1}"><span>Día ${i + 1}</span>${d.t}</button>`).join('\n')}
</div>`;

const dayCards = () => DAYS.map((d, i) => `
<article class="day-card${i ? '' : ' is-on'}" id="day-${i + 1}" aria-label="Día ${i + 1}: ${d.t}"${i ? ' hidden' : ''}>
  <img src="/assets/img/turismo/${d.img}" alt="" loading="lazy">
  <div class="day-body"><span class="day-k">Día ${i + 1}</span><h3>${d.t}</h3>
  <ul>${d.items.map(x => `<li>${x}</li>`).join('')}</ul></div>
</article>`).join('');

const faq = list => list.map(([q, a]) => `
<details class="reveal">
  <summary>${q}</summary>
  <p>${a}</p>
</details>`).join('');

const procPick = () => [...SERVICES.map(s => [s.id, s.name]), ['valoracion', 'Aún no sé, quiero una valoración']]
  .map(([id, name]) => `<button type="button" class="pick-opt" data-v="${id}">${name}</button>`).join('\n');

/* ---------------- Escritura ---------------- */

const PARTS = {
  head, header, footer, scripts,
  services: () => services(), tours: () => tours(), days: () => days(), daycards: () => dayCards(),
  'home-procs': () => SERVICES.map(s => `
    <a href="${procHref(s.id)}" class="pcard reveal"><img src="/assets/img/${s.img}" alt="${esc(PROCS[s.id].h1)}" loading="lazy"><div><span>${PROCS[s.id].kind}</span><h3>${s.name.split(' (')[0]}</h3></div></a>`).join(''),
  'faq-proc': () => faq(FAQ_PROC), ...VIDEO_PARTS, 'faq-home': () => faq(FAQ_HOME), 'faq-tour': () => faq(FAQ_TOUR), procpick: () => procPick(),
};

/* ---------- Imágenes: width/height reales + carga diferida ---------- */
const dimCache = new Map();
function imgSize(src) {
  if (dimCache.has(src)) return dimCache.get(src);
  const fp = join(ROOT, src.replace(/^\//, ''));
  let d = null;
  if (existsSync(fp)) {
    const b = readFileSync(fp);
    if (b[0] === 0x89 && b[1] === 0x50) d = [b.readUInt32BE(16), b.readUInt32BE(20)];
    else if (b[0] === 0xff && b[1] === 0xd8) {
      let o = 2;
      while (o < b.length) {
        if (b[o] !== 0xff) { o++; continue; }
        const m = b[o + 1], len = b.readUInt16BE(o + 2);
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) { d = [b.readUInt16BE(o + 7), b.readUInt16BE(o + 5)]; break; }
        o += 2 + len;
      }
    }
  }
  dimCache.set(src, d);
  return d;
}
function polish(html) {
  html = html.replace(/<main>/, '<main id="main" tabindex="-1">');
  return html.replace(/<img\b([^>]*?)>/g, (tag, attrs) => {
    const src = (attrs.match(/\ssrc="([^"]+)"/) || [])[1];
    if (!src || !src.startsWith('/assets/')) return tag;
    let a = attrs;
    if (!/\swidth=/.test(a)) { const d = imgSize(src); if (d) a += ` width="${d[0]}" height="${d[1]}"`; }
    if (!/\sloading=/.test(a) && !/fetchpriority=/.test(a)) a += ' loading="lazy"';
    if (!/\sdecoding=/.test(a)) a += ' decoding="async"';
    return `<img${a}>`;
  });
}

for (const [file, page] of Object.entries(PAGES)) {
  const fp = join(ROOT, file);
  let html = readFileSync(fp, 'utf8');
  for (const [name, fn] of Object.entries(PARTS)) {
    const re = new RegExp(`(<!-- @${name} -->)[\\s\\S]*?(<!-- @/${name} -->)`, 'g');
    html = html.replace(re, (_, a, b) => `${a}${fn(file, page)}${b}`);
  }
  writeFileSync(fp, polish(html));
  console.log('✓', file);
}

/* ---------------- Páginas por procedimiento ---------------- */

const STEPS = [
  ['Valoración médica', 'Análisis detallado de tu rostro o de la zona a tratar. Nada se decide sin antes conocerte.'],
  ['Plan a tu medida', 'El doctor te indica únicamente lo que realmente necesitas.'],
  ['Procedimiento', 'Técnica segura y personalizada, realizada directamente por el médico.'],
  ['Acompañamiento', 'Indicaciones y seguimiento antes, durante y después.'],
];

function procPage(s) {
  const d = PROCS[s.id];
  const path = procHref(s.id);
  const url = SITE + path;
  const short = s.name.split(' (')[0];
  const page = { id: 'procedimientos', path, label: d.h1, type: 'MedicalWebPage', title: d.title, description: d.description,
    faq: d.faq, crumbs: [['Inicio', '/'], ['Procedimientos', '/procedimientos'], [d.h1, path]],
    extraWebPage: { reviewedBy: { '@id': DOCTOR_ID }, lastReviewed: TODAY, mainEntity: { '@id': `${url}#procedimiento` }, about: { '@id': `${url}#procedimiento` } },
    extraGraph: [
      { '@type': ['MedicalProcedure', d.procType], '@id': `${url}#procedimiento`, name: s.name, alternateName: d.alt,
        description: d.what, bodyLocation: d.body, url },
      { '@type': 'Service', '@id': `${url}#servicio`, name: d.h1, serviceType: s.name, description: d.description,
        provider: { '@id': CLINIC_ID }, areaServed: [{ '@type': 'City', name: 'Medellín' }, { '@type': 'City', name: 'Apartadó' }],
        url, image: `${SITE}/assets/img/${s.img}` },
    ] };
  const wa = waLink(`Hola Dr. Diego, quiero una valoración para ${s.name} en Medellín.`);
  const html = `<!DOCTYPE html>
<html lang="es-CO">
<head>${head(null, page)}</head>
<body data-page="procedimientos" class="proc-page">
${header(null, page)}
<main>

<section class="proc-hero wrap">
  <div class="proc-hero-copy">
    <nav class="crumbs reveal" aria-label="Ruta"><a href="/">Inicio</a><span>/</span><a href="/procedimientos">Procedimientos</a><span>/</span><span aria-current="page">${short}</span></nav>
    <p class="eyebrow reveal"><span class="dot"></span> ${d.kind} · El Poblado, Medellín</p>
    <h1 class="h1" data-split>${d.h1.replace(' en Medellín', ' en <em>Medellín</em>')}</h1>
    <p class="lead reveal">${d.intro}</p>
    <div class="hero-ctas reveal">
      <a href="/contacto?proc=${s.id}" class="btn btn-gold magnetic">Agendar valoración <span class="arr">→</span></a>
      <a href="${wa}" class="btn btn-ghost" target="_blank" rel="noopener">Preguntar por WhatsApp</a>
    </div>
  </div>
  <figure class="proc-hero-media reveal">
    <img src="/assets/img/${s.img}" alt="${esc(s.name)} con el Dr. Diego Carrascal en Medellín" fetchpriority="high" loading="eager">
    <figcaption><img src="/assets/img/dr-diego-carrascal-retrato.jpg" alt=""><span><strong>Dr. Diego Carrascal</strong>Máster en Medicina Estética · Madrid</span></figcaption>
  </figure>
</section>

<section class="proc-what wrap">
  <div>
    <p class="eyebrow">¿Qué es?</p>
    <h2 class="h2" data-split>${short}: <em>lo esencial</em></h2>
  </div>
  <div>
    <p class="lead reveal">${d.what}</p>
    <ul class="proc-facts reveal">
      <li><span>Tipo</span>${d.kind}</li>
      <li><span>Zona</span>${d.body}</li>
      <li><span>Dónde</span>El Poblado, Medellín · Apartadó</li>
      <li><span>Antes de empezar</span>Valoración médica especializada</li>
    </ul>
  </div>
</section>

<section class="proc-cols wrap">
  <div class="proc-card reveal">
    <p class="eyebrow">Beneficios</p>
    <ul class="ticks">${s.points.map(p => `<li>${p}</li>`).join('')}</ul>
  </div>
  <div class="proc-card proc-card-dark reveal">
    <p class="eyebrow light">¿Para quién es?</p>
    <ul class="ticks">${d.forWho.map(p => `<li>${p}</li>`).join('')}</ul>
  </div>
</section>

<section class="proc-steps wrap" aria-labelledby="pasos">
  <p class="eyebrow">Cómo es el proceso</p>
  <h2 class="h2" id="pasos" data-split>Paso a paso, <em>con el doctor</em></h2>
  <ol class="mini-steps">${STEPS.map(([t, x], k) => `
    <li class="reveal"><span>${pad(k + 1)}</span><h3>${t}</h3><p>${x}</p></li>`).join('')}
  </ol>
</section>

<section class="proc-doctor wrap">
  <div class="proc-doctor-card reveal">
    <img src="/assets/img/dr-diego-carrascal-retrato.jpg" alt="Dr. Diego Carrascal, médico estético en Medellín" loading="lazy">
    <div>
      <p class="eyebrow light">Quién realiza tu procedimiento</p>
      <h2 class="h2 light">Dr. Diego <em>Carrascal</em></h2>
      <p>Médico de la Universidad del Sinú, con Máster en Medicina Estética de la Universidad de Alcalá (Madrid) y Diplomado en Medicina Estética de la FUCS (Bogotá). Más de 5.000 pacientes atendidos y docente de otros médicos en técnicas de medicina estética.</p>
      <a href="/quienes-somos" class="btn btn-ghost light">Conocer al doctor →</a>
    </div>
  </div>
</section>

${PROC_REELS[s.id] ? videoSection(PROC_REELS[s.id], { eyebrow: 'Videos', title: `${short} en <em>video</em>`, id: 'videos' }) : ''}

<section class="proc-faq wrap" aria-labelledby="faqTitle">
  <div>
    <p class="eyebrow">Preguntas frecuentes</p>
    <h2 class="h2" id="faqTitle" data-split>${short} en Medellín: <em>tus dudas</em></h2>
  </div>
  <div class="faq">${faq(d.faq)}</div>
</section>

<section class="proc-related wrap" aria-labelledby="relTitle">
  <p class="eyebrow">También te puede interesar</p>
  <h2 class="h2" id="relTitle" data-split>Otros procedimientos <em>en Medellín</em></h2>
  <div class="rel-grid">${d.related.map(id => { const r = SERVICES.find(x => x.id === id); return `
    <a href="${procHref(id)}" class="rel reveal"><img src="/assets/img/${r.img}" alt="" loading="lazy"><span>${PROCS[id].h1}</span></a>`; }).join('')}
  </div>
  <a href="/turismo" class="proc-tour reveal">¿Vienes de otra ciudad o país? <b>Planea tu tratamiento en Medellín →</b></a>
</section>

</main>
${footer()}
${scripts()}
</body>
</html>
`;
  mkdirSync(join(ROOT, 'procedimientos'), { recursive: true });
  writeFileSync(join(ROOT, 'procedimientos', d.slug + '.html'), polish(html));
  console.log('✓ procedimientos/' + d.slug + '.html');
}
SERVICES.forEach(procPage);

writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${NAV.map(p => `  <url><loc>${SITE}${href(p)}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>${p.path === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
${SERVICES.map(s => `  <url><loc>${SITE}${procHref(s.id)}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>`).join('\n')}
</urlset>
`);
console.log('✓ sitemap.xml');

/* ---------------- llms.txt (GEO: resumen para asistentes de IA) ---------------- */

writeFileSync(join(ROOT, 'llms.txt'), `# Dr. Diego Carrascal · Medicina Estética

> Consultorio de medicina estética del Dr. Diego Carrascal en El Poblado, Medellín (Colombia), con sede también en Apartadó (Urabá). Enfoque en armonización facial y resultados naturales. Lema: "${SLOGAN}".

## Datos clave
- Médico: Dr. Diego Carrascal. Médico de la Universidad del Sinú; Máster en Medicina Estética, Universidad de Alcalá (Madrid, España); Diplomado en Medicina Estética, FUCS (Bogotá). Docente de técnicas de medicina estética.
- Experiencia: más de 10 años y más de 5.000 pacientes atendidos.
- Dirección en Medellín: Edificio Xerox, Cra. 43A #15 Sur 15, piso 8, El Poblado, Medellín, Antioquia, Colombia.
- Otra sede: Apartadó, región de Urabá (Antioquia).
- Horario: todos los días, 7:00 a. m. – 7:00 p. m.
- WhatsApp y teléfono: ${PHONE}
- Correo: ${EMAIL}
- Instagram: ${IG} (más de 22 mil seguidores)
- Cómo agendar: escribir por WhatsApp o usar el formulario en ${SITE}/contacto. Todo tratamiento inicia con una valoración médica especializada.

## Procedimientos en Medellín
${SERVICES.map(s => `- [${PROCS[s.id].h1}](${SITE}${procHref(s.id)}): ${PROCS[s.id].what}`).join('\n')}

## Páginas
${NAV.map(p => `- [${p.label}](${SITE}${href(p)}): ${p.description}`).join('\n')}

## Turismo médico
Pacientes de otras ciudades y países pueden coordinar su valoración por WhatsApp antes de viajar. La página ${SITE}/turismo incluye qué hacer en Medellín, dónde hospedarse (El Poblado), cómo llegar desde el aeropuerto José María Córdova (45–60 min) y un itinerario sugerido.

## Preguntas frecuentes
${[...FAQ_HOME, ...FAQ_PROC, ...FAQ_TOUR].map(([q, a]) => `- **${q}** ${a}`).join('\n')}
`);
console.log('✓ llms.txt');

