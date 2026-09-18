/* Textos de la página. Viven en js/i18n.js; */
const T = I18N.proximamente;

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