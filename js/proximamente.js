/* ────────────────────────────────────────────────────────────
   Lógica de idioma (ES/CA) de la página "Inscripciones próximamente"
   Atelier dels Somnis - Reus
   ──────────────────────────────────────────────────────────── */

/* Textos de la página en cada idioma. Las claves (titulo, texto, etc.)
   coinciden con el atributo data-t="..." de cada elemento en el HTML. */
const T = {
  es: {
    titulo: 'Inscripciones próximamente',
    texto: 'Por el momento no se pueden realizar inscripciones a través de este formulario.',
    pronto: 'Esta funcionalidad estará disponible muy pronto. Mientras tanto, para solicitar tu inscripción utiliza el formulario de contacto y te responderemos lo antes posible.',
    btn_contacto: 'Solicitar inscripción vía formulario de contacto',
    volver: '← Volver a la página principal'
  },
  ca: {
    titulo: 'Inscripcions ben aviat',
    texto: 'De moment no es poden fer inscripcions a través d\'aquest formulari.',
    pronto: 'Aquesta funcionalitat estarà disponible molt aviat. Mentrestant, per sol·licitar la teva inscripció utilitza el formulari de contacte i et respondrem el més aviat possible.',
    btn_contacto: 'Sol·licitar inscripció mitjançant el formulari de contacte',
    volver: '← Tornar a la pàgina principal'
  }
};

let lng = 'es';

/* Recorre todos los elementos con data-t="clave" y les pone el texto
   correspondiente al idioma actual (lng) */
function applyT() {
  const d = T[lng];
  document.querySelectorAll('[data-t]').forEach(el => {
    const k = el.getAttribute('data-t');
    if (d[k]) el.textContent = d[k];
  });
}

/* Cambia el idioma activo, vuelve a pintar los textos y actualiza
   qué botón del selector (ES/CA) aparece resaltado */
function setLng(l) {
  lng = l;
  applyT();
  document.getElementById('lb-es').classList.toggle('active', l === 'es');
  document.getElementById('lb-ca').classList.toggle('active', l === 'ca');
  document.documentElement.lang = l;
}

document.getElementById('lb-es').addEventListener('click', () => setLng('es'));
document.getElementById('lb-ca').addEventListener('click', () => setLng('ca'));

/* Pintamos los textos en español al cargar la página */
applyT();