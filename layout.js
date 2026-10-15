/* Cabecera, menú, pie y botón de WhatsApp compartidos por todas las páginas.
   Se carga al inicio del <body> para que no haya parpadeo. */
(function () {
  const page = document.body.dataset.page;
  const TABS = [
    ['inicio', 'index.html', 'Inicio'],
    ['quienes-somos', 'quienes-somos.html', 'Quiénes somos'],
    ['procedimientos', 'procedimientos.html', 'Procedimientos'],
    ['turismo', 'turismo.html', 'Turismo médico'],
    ['agenda', 'agenda.html', 'Contacto'],
  ];
  const tab = ([id, href, label]) =>
    `<a href="${href}"${id === page ? ' class="is-active" aria-current="page"' : ''}>${label}</a>`;

  let firstVisit = true;
  try { firstVisit = !sessionStorage.getItem('dc-visited'); sessionStorage.setItem('dc-visited', '1'); } catch (e) {}
  document.documentElement.classList.add(firstVisit ? 'first-visit' : 'return-visit');

  const header = `
  ${firstVisit ? `<div class="loader" id="loader" aria-hidden="true">
    <img src="assets/img/logo-firma.png" alt="" class="loader-sign">
    <div class="loader-bar"><span></span></div>
  </div>` : ''}
  <div class="curtain" id="curtain" aria-hidden="true"><img src="assets/img/logo-firma.png" alt=""></div>
  <div class="progress" id="progress" aria-hidden="true"></div>

  <header class="nav" id="nav">
    <a href="index.html" class="nav-logo" aria-label="Dr. Diego Carrascal, inicio">
      <img src="assets/img/logo-firma-alt.png" alt="Dr. Diego Carrascal, Medicina Estética">
    </a>
    <nav class="nav-links" aria-label="Principal">
      ${TABS.map(tab).join('')}
      <span class="nav-pill" aria-hidden="true"></span>
    </nav>
    <a href="agenda.html" class="btn btn-dark btn-sm magnetic nav-cta">Agendar cita</a>
    <button class="nav-burger" id="burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button>
  </header>

  <div class="menu" id="menu">
    <nav aria-label="Menú móvil">${TABS.map(tab).join('')}</nav>
    <div class="menu-foot">
      <a href="agenda.html" class="btn btn-gold">Agendar cita</a>
      <p>+57 324 324 5856 · Medellín · Apartadó</p>
    </div>
  </div>`;

  const footer = `
  <footer class="footer">
    <div class="wrap">
      <p class="footer-cta" data-split>¿Listo para realzar tu <em>mejor versión?</em></p>
      <a href="agenda.html" class="btn btn-gold btn-lg magnetic">Agenda tu cita hoy</a>
      <img src="assets/img/logo-firma.png" alt="Dr. Diego Carrascal, Medicina Estética" class="footer-sign">
      <div class="footer-cols">
        <div><span>Explora</span>${TABS.map(([, h, l]) => `<a href="${h}">${l}</a>`).join('')}</div>
        <div><span>Escríbenos</span><a href="https://wa.me/573243245856" target="_blank" rel="noopener">+57 324 324 5856</a><a href="mailto:carrascaldrdiego@gmail.com">carrascaldrdiego@gmail.com</a><a>Todos los días, 7:00 a. m. – 7:00 p. m.</a></div>
        <div><span>Visítanos</span><a href="https://www.google.com/maps/search/?api=1&query=Edificio+Xerox+Cra+43A+15+Sur+15+Medell%C3%ADn" target="_blank" rel="noopener">Edificio Xerox, Cra. 43A #15 Sur 15, piso 8, El Poblado, Medellín</a><a>Sede Apartadó, Urabá</a></div>
        <div><span>Síguenos</span><a href="https://www.instagram.com/drdiegocarrascal/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/share/1arLPPkcZk/" target="_blank" rel="noopener">Facebook</a></div>
      </div>
      <div class="footer-legal"><span>© 2026 Dr. Diego Carrascal. Todos los derechos reservados.</span><a href="#">Política de datos</a></div>
    </div>
  </footer>

  <a class="wa-float" href="https://wa.me/573243245856?text=Hola%20Dr.%20Diego%2C%20quiero%20agendar%20una%20valoraci%C3%B3n." target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>
  </a>`;

  document.currentScript.insertAdjacentHTML('beforebegin', header);
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('main').insertAdjacentHTML('afterend', footer);
  });
})();
