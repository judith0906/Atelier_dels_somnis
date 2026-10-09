/* ────────────────────────────────────────────────────────────
   alquiler-sala.js — Formulario de reserva de la sala (4 pasos)
   Atelier dels Somnis · Reus

   Textos ES/CA en js/i18n.js (debe cargarse antes que este archivo).

   Reglas de negocio:
   - El pack de 5h admite como máximo 2 horas extra en total (7h). Si se
     piden más, se pasa automáticamente al pack de 8h restando 3 horas
     extra (ver normalizarPaqueteExtra). El pack de 8h no tiene tope.
   - Las horas extra se indican en dos campos: antes de las 00:00
     (30 €/h) y después de las 00:00 (35 €/h).
   - Antes de pasar al paso 4 se comprueba la disponibilidad real de la
     sala contra /api/disponibilidad-sala; si el hueco choca, se ofrecen
     los huecos libres más cercanos ese mismo día.
   - Servicios extra opcionales (limpieza, hinchable) que se suman al total.
   - El envío pasa por nuestra función de Netlify
     /.netlify/functions/submit-formulario, que es quien de verdad
     "bloquea" el horario en la base de datos.
   - Al cambiar de idioma se vuelve a pintar todo el contenido dinámico
     (resumen, errores, sugerencias y pantalla final).
   ──────────────────────────────────────────────────────────── */

const T = I18N.alquiler;
const $ = id => document.getElementById(id);

let lng = 'es';

/* ── PRECIOS ── */
const PRECIO_5H = 180;
const PRECIO_8H = 350;
const EXTRA_NOCHE = 30;      // por hora antes de la medianoche (00:00)
const EXTRA_MADRUGADA = 35;  // por hora de madrugada (desde las 00:00)
const MAX_EXTRA_5H = 2;      // tope de horas extra en el pack de 5h; a partir de aquí, salto a 8h

/* ── SERVICIOS EXTRA ── */
const SERVICIOS = {
  limpieza:  { precio: 45 },
  hinchable: { precio: 160 }
};

function serviciosSeleccionados() {
  return Object.keys(SERVICIOS)
    .filter(id => $('x-' + id) && $('x-' + id).checked)
    .map(id => ({ id, precio: SERVICIOS[id].precio }));
}

/* ── ESTADO ── */
let paso = 1;
let datos = {};
let tos = { leido: false, acuerdo: false };
let reserva = { paquete: '5h', fecha: '', inicio: '', numextra: 0, numextraMad: 0, evento: '' };
let sugerenciasActuales = null;   // horas libres que se están mostrando (o null)
let estadoFinal = null;           // null | 'ok' | 'error' (pantalla final)
const errores = {};               // id de caja de error -> función que devuelve su texto

/* ── TRADUCCIÓN ── */
function tt(k) { return T[lng][k] || k; }

function applyT() {
  const d = T[lng];
  document.querySelectorAll('[data-t]').forEach(el => {
    const k = el.getAttribute('data-t');
    if (d[k]) el.textContent = d[k];
  });
  document.querySelectorAll('[data-tph]').forEach(el => {
    const k = el.getAttribute('data-tph');
    if (!d[k]) return;
    if (el.tagName === 'INPUT') el.placeholder = d[k];
    else el.textContent = d[k];
  });
  const tb = $('terms-box');
  if (tb) {
    tb.innerHTML = d.term_text;
    $('tos-leido').disabled = true;
    $('tos-acuerdo').disabled = true;
    $('tos-leido').checked = false;
    $('tos-acuerdo').checked = false;
    $('p1-next').disabled = true;
    p1InitLeido();
  }
  actualizarTotales();

  // Contenido dinámico que hay que volver a pintar en el idioma nuevo
  repintarErrores();
  if (sugerenciasActuales) mostrarSugerencias(sugerenciasActuales);
  if (paso === 4) renderResumen();
  pintarFinal();
}

function cambiarIdioma(nuevo) {
  lng = nuevo;
  document.documentElement.lang = nuevo;
  $('lb-es').classList.toggle('active', nuevo === 'es');
  $('lb-ca').classList.toggle('active', nuevo === 'ca');
  applyT();
}

/* ── ERRORES (se guardan como función para poder traducirlos al cambiar de idioma) ── */
function mostrarError(id, fn) {
  errores[id] = fn;
  const el = $(id);
  el.textContent = fn();
  el.style.display = 'block';
}
function ocultarError(id) {
  delete errores[id];
  $(id).style.display = 'none';
}
function repintarErrores() {
  Object.keys(errores).forEach(id => { $(id).textContent = errores[id](); });
}

/* ── NAVEGACIÓN ── */
function go(n) {
  paso = n;
  document.querySelectorAll('.step').forEach(s => s.id === ('paso' + n) ? s.classList.add('active') : s.classList.remove('active'));
  for (let i = 1; i <= 4; i++) $('chip' + i).classList.toggle('active', i === n);
  if (n === 4) { renderRecaptcha(); renderResumen(); }
  $('paso' + n).scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function leerDatos() {
  datos = {
    nombre: $('d-nombre').value.trim(), apellidos: $('d-apellidos').value.trim(),
    email: $('d-email').value.trim(), telefono: $('d-telefono').value.trim(),
    dni: $('d-dni').value.trim(), ciudad: $('d-ciudad').value.trim(),
    direccion: $('d-direccion').value.trim(), cp: $('d-cp').value.trim()
  };
}

/* ── VALIDACIÓN DE CAMPOS (paso 2) ── */
const LETRAS = "A-Za-zÀ-ÖØ-öø-ÿ";
const SOLO_LETRAS = new RegExp(`^[${LETRAS}·' \\-]+$`);
const contarLetras = s => (s.match(new RegExp(`[${LETRAS}]`, "g")) || []).length;

const MSG = {
  es: {
    nombre: "El nombre debe tener al menos 2 letras y no puede contener números.",
    apellidos: "Los apellidos deben tener al menos 5 letras y no pueden contener números.",
    email: "Introduce un correo válido (por ejemplo, tu@correo.com).",
    telefono: "El teléfono debe tener 9 números.",
    dni: "Introduce un DNI (8 números y una letra) o un NIE (letra, 7 números y letra).",
    direccion: "La dirección debe tener al menos 20 caracteres.",
    cp: "El código postal debe tener 5 números.",
    ciudad: "La ciudad solo puede contener letras."
  },
  ca: {
    nombre: "El nom ha de tenir almenys 2 lletres i no pot contenir números.",
    apellidos: "Els cognoms han de tenir almenys 5 lletres i no poden contenir números.",
    email: "Introdueix un correu vàlid (per exemple, tu@correu.com).",
    telefono: "El telèfon ha de tenir 9 números.",
    dni: "Introdueix un DNI (8 números i una lletra) o un NIE (lletra, 7 números i lletra).",
    direccion: "L'adreça ha de tenir almenys 20 caràcters.",
    cp: "El codi postal ha de tenir 5 números.",
    ciudad: "La ciutat només pot contenir lletres."
  }
};

const REGLAS = {
  "d-nombre":    v => SOLO_LETRAS.test(v) && contarLetras(v) >= 2,
  "d-apellidos": v => SOLO_LETRAS.test(v) && contarLetras(v) >= 5,
  "d-email":     v => /^[^\s@]*[A-Za-z][^\s@]*@[^\s@.]*[A-Za-z][^\s@.]*(\.[^\s@.]+)*\.[A-Za-z]{2,}$/.test(v),
  "d-telefono":  v => /^\d{9}$/.test(v.replace(/\s/g, "")),
  "d-dni":       v => /^\d{8}[A-Z]$/.test(v.toUpperCase()) || /^[A-Z]\d{7}[A-Z]$/.test(v.toUpperCase()),
  "d-direccion": v => v.trim().length >= 20,
  "d-cp":        v => /^\d{5}$/.test(v),
  "d-ciudad":    v => SOLO_LETRAS.test(v.trim())
};

function validarCampo(id) {
  const el = $(id);
  const ok = REGLAS[id](el.value.trim());
  el.classList.toggle('invalid', !ok);
  return ok;
}

Object.keys(REGLAS).forEach(id => {
  const el = $(id);
  el.addEventListener('blur', () => validarCampo(id));
  el.addEventListener('input', () => { if (el.classList.contains('invalid')) validarCampo(id); });
});

// Bloquear caracteres no válidos al teclear
$('d-cp').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });
$('d-telefono').addEventListener('input', e => { e.target.value = e.target.value.replace(/[^\d\s]/g, ''); });
$('d-dni').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase(); });

function validarDatos() {
  leerDatos();
  let primerError = null;
  for (const id of Object.keys(REGLAS)) {
    if (!validarCampo(id) && !primerError) primerError = $(id);
  }
  if (primerError) {
    const clave = primerError.id.replace('d-', '');
    mostrarError('err-p2', () => MSG[lng][clave]);
    primerError.focus();
    return false;
  }
  ocultarError('err-p2');
  return true;
}

/* ── PASO 1 ── */
function p1InitLeido() {
  const t = $('terms-box');
  if (t.scrollTop + t.clientHeight >= t.scrollHeight - 4) $('tos-leido').disabled = false;
}
function p1Actualizar() {
  const leido = $('tos-leido').checked;
  const acuerdo = $('tos-acuerdo').checked;
  $('tos-acuerdo').disabled = !leido;
  $('p1-next').disabled = !(leido && acuerdo);
  if (leido && acuerdo) $('err-p1').style.display = 'none';
}
$('terms-box').addEventListener('scroll', p1InitLeido);
$('tos-leido').addEventListener('change', () => {
  if (!$('tos-leido').checked) $('tos-acuerdo').checked = false;
  p1Actualizar();
});
$('tos-acuerdo').addEventListener('change', p1Actualizar);
function p1Check() {
  tos.leido = $('tos-leido').checked;
  tos.acuerdo = $('tos-acuerdo').checked;
  if (tos.leido && tos.acuerdo) { $('err-p1').style.display = 'none'; return true; }
  return false;
}
$('p1-next').addEventListener('click', () => {
  if (!p1Check()) { $('err-p1').style.display = 'block'; return; }
  go(2);
});

/* ── PASO 2 ── */
$('p2-prev').addEventListener('click', () => { ocultarError('err-p2'); go(1); });
$('p2-next').addEventListener('click', () => { if (validarDatos()) go(3); });

/* ── PASO 3 ── */
function actualizarTotales() {
  const p5 = $('precio-5h'), p8 = $('precio-8h');
  if (p5) p5.textContent = PRECIO_5H + ' €';
  if (p8) p8.textContent = PRECIO_8H + ' €';
}

function seleccionarPaquete(tipo) {
  reserva.paquete = tipo;
  document.querySelectorAll('#opciones .opt').forEach(o => o.classList.remove('sel'));
  $('opt-' + tipo).classList.add('sel');
  normalizarPaqueteExtra();
}

$('opt-5h').addEventListener('click', () => seleccionarPaquete('5h'));
$('opt-8h').addEventListener('click', () => seleccionarPaquete('8h'));

/* Con el pack de 5h solo se admiten MAX_EXTRA_5H horas extra en total
   (las de antes de las 00:00 más las de después). Si se piden más, se
   pasa automáticamente al pack de 8h y se restan 3 horas extra: primero
   de las de antes de las 00:00 y, si faltan, de las de madrugada.
   El pack de 8h no tiene tope. Se llama en cada cambio de los campos y
   del pack, así que si alguien vuelve a elegir 5h con demasiadas horas
   extra, se recalcula. */
function normalizarPaqueteExtra() {
  let a = parseInt($('r-numextra').value, 10);      // antes de las 00:00
  let b = parseInt($('r-numextra-mad').value, 10);  // después de las 00:00
  if (isNaN(a) || a < 0) a = 0;
  if (isNaN(b) || b < 0) b = 0;
  let auto = false;
  if (reserva.paquete === '5h' && a + b > MAX_EXTRA_5H) {
    reserva.paquete = '8h';
    let quitar = MAX_EXTRA_5H + 1;
    const qa = Math.min(a, quitar); a -= qa; quitar -= qa;
    b = Math.max(0, b - quitar);
    document.querySelectorAll('#opciones .opt').forEach(o => o.classList.remove('sel'));
    $('opt-8h').classList.add('sel');
    auto = true;
  }
  $('r-numextra').value = a;
  $('r-numextra-mad').value = b;
  reserva.numextra = a;
  reserva.numextraMad = b;
  $('aviso-8h-auto').style.display = auto ? 'block' : 'none';
}

$('r-numextra').addEventListener('input', normalizarPaqueteExtra);
$('r-numextra-mad').addEventListener('input', normalizarPaqueteExtra);

$('p3-prev').addEventListener('click', () => { ocultarError('err-p3'); go(2); });

/* Cálculo del importe. Las horas extra se cobran según el campo en el
   que se hayan indicado: las de antes de las 00:00 a 30 €/h y las de
   después de las 00:00 (madrugada) a 35 €/h. A esto se suman el pack
   elegido y los servicios extra marcados. */
function calculoImporte() {
  const base = reserva.paquete === '8h' ? PRECIO_8H : PRECIO_5H;
  const horasBase = reserva.paquete === '8h' ? 8 : 5;
  const instart = reserva.inicio || '00:00'; // 'HH:MM'
  const [hh, mm] = instart.split(':').map(Number);
  const minutosInicio = hh * 60 + mm;
  const extras = reserva.numextra * EXTRA_NOCHE + reserva.numextraMad * EXTRA_MADRUGADA;

  const servicios = serviciosSeleccionados();
  const totalServicios = servicios.reduce((s, x) => s + x.precio, 0);
  const totalAlquiler = base + extras + totalServicios;

  /* Horario total declarado por el cliente (pack + horas extra): si acaba
     a partir de las 00:00 queda constancia en el resumen y en el envío
     (ver cláusula 14 de los términos). */
  const finMinutos = minutosInicio + (horasBase + reserva.numextra + reserva.numextraMad) * 60;
  const cruzaMedianoche = finMinutos >= 24 * 60 || reserva.numextraMad > 0;

  return { base, horasBase, extras, servicios, totalServicios, totalAlquiler, cruzaMedianoche };
}

/* ── Disponibilidad de la sala (comprobación antes de pasar al paso 4) ── */
async function comprobarDisponibilidad() {
  const horasTotales = (reserva.paquete === '8h' ? 8 : 5) + reserva.numextra + reserva.numextraMad;
  const params = new URLSearchParams({ fecha: reserva.fecha, inicio: reserva.inicio, horas: horasTotales });
  const res = await fetch('/api/disponibilidad-sala?' + params.toString());
  if (!res.ok) throw new Error('disponibilidad no ok');
  return res.json();
}

function mostrarSugerencias(horas) {
  sugerenciasActuales = horas;
  const box = $('disp-sugerencias');
  let html = '<p class="aviso">' + tt('sugerencias_intro') + '</p><div class="chips">';
  horas.forEach(h => { html += '<button type="button" class="chip" data-hora="' + h + '">' + h + '</button>'; });
  html += '</div>';
  box.innerHTML = html;
  box.style.display = 'block';
  box.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      $('r-inicio').value = btn.getAttribute('data-hora');
      box.style.display = 'none';
      sugerenciasActuales = null;
      $('p3-next').click();
    });
  });
}

$('p3-next').addEventListener('click', async () => {
  normalizarPaqueteExtra();
  reserva.fecha = $('r-fecha').value;
  reserva.inicio = $('r-inicio').value;
  reserva.evento = $('r-evento').value;

  if (!reserva.fecha || !reserva.inicio || !reserva.paquete) {
    mostrarError('err-p3', () => tt('conexion_vacia'));
    return;
  }
  ocultarError('err-p3');
  $('disp-sugerencias').style.display = 'none';
  sugerenciasActuales = null;

  $('p3-next').disabled = true;
  $('p3-next').textContent = tt('comprobando_disp');

  try {
    const data = await comprobarDisponibilidad();
    if (data.disponible) {
      go(4);
    } else if (data.sugerencias && data.sugerencias.length) {
      mostrarSugerencias(data.sugerencias);
    } else {
      mostrarError('err-p3', () => tt('sin_disponibilidad'));
    }
  } catch (e) {
    mostrarError('err-p3', () => tt('err_disponibilidad'));
  } finally {
    $('p3-next').disabled = false;
    $('p3-next').textContent = tt('continuar');
  }
});

/* ── PASO 4 ── */
function fmtHora(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  return h + ':' + m;
}
function kv(k, v) { return '<div class="kv"><span>' + k + '</span><b>' + v + '</b></div>'; }

function renderResumen() {
  leerDatos();
  let hd = '';
  hd += kv(tt('nombre'), datos.nombre + ' ' + datos.apellidos);
  hd += kv(tt('email'), datos.email);
  hd += kv(tt('telefono'), datos.telefono);
  hd += kv(tt('dni'), datos.dni);
  hd += kv(tt('ciudad'), datos.ciudad);
  $('res-datos').innerHTML = hd;

  const c = calculoImporte();
  const baseHoras = reserva.paquete === '8h' ? 8 : 5;
  const optEvento = $('r-evento').selectedOptions[0];
  let hh = '';
  hh += kv(tt('k_duracion'), tt('paquete') + ' ' + baseHoras + tt('horas'));
  hh += kv(tt('k_evento'), optEvento ? optEvento.textContent : reserva.evento);
  hh += kv(tt('k_fecha'), reserva.fecha ? reserva.fecha.split('-').reverse().join('/') : '—');
  hh += kv(tt('k_inicio'), fmtHora(reserva.inicio));
  hh += kv(tt('k_numextra'), reserva.numextra + reserva.numextraMad);
  hh += kv(tt('k_horario_decl'), c.cruzaMedianoche ? tt('horario_despues_medianoche') : tt('horario_antes_medianoche'));
  $('res-reserva').innerHTML = hh;

  let hi = '';
  hi += kv(tt('k_alquiler'), c.base + ' €');
  if (c.extras > 0) hi += kv(tt('k_extras') + ' (' + (reserva.numextra + reserva.numextraMad) + ')', c.extras + ' €');
  c.servicios.forEach(s => { hi += kv(tt('svc_' + s.id), s.precio + ' €'); });
  hi += '<div class="kv total"><span>' + tt('k_total') + '</span><b>' + c.totalAlquiler + ' €</b></div>';
  $('res-importe').innerHTML = hi;
}

$('p4-prev').addEventListener('click', () => { ocultarError('err-p4'); go(3); });

$('p4-next').addEventListener('click', () => {
  const token = (window.grecaptcha && grecaptcha.getResponse()) || '';
  if (!token) { mostrarError('err-p4', () => tt('err_robot')); return; }
  ocultarError('err-p4');
  enviar();
});

/* ── PAGO ── */
/* TODO: conectar Stripe cuando se decida la pasarela.
   De momento la reserva se envía y el pago queda pendiente de conexión. */
const STRIPE_PUBLISHABLE_KEY = ''; // P.ej. pk_test_...
const RECAPTCHA_SITE_KEY = '6LcjXqEtAAAAAI1lk_D5zQJAvIZhXvaan0wnf5nl';

let recaptchaRendered = false;
function renderRecaptcha() {
  if (recaptchaRendered || !window.grecaptcha || !$('robot-box')) return;
  try {
    grecaptcha.render('robot-box', { sitekey: RECAPTCHA_SITE_KEY, theme: 'dark' });
    recaptchaRendered = true;
  } catch (e) { /* ya renderizado */ }
}
window.onRecaptchaLoad = function () { renderRecaptcha(); };

/* ── ENVÍO ──
   Enviamos a nuestra propia función de Netlify. Esa función valida el token del
   captcha contra Google, bloquea el horario en Neon (tabla reserva_sala) y solo
   entonces reenvía los datos a Make. La URL de Make no aparece en el navegador. */
function enviar() {
  $('p4-next').disabled = true;
  leerDatos();
  const c = calculoImporte();
  const payload = {
    tipoFormulario: 'alquiler',
    lang: lng,
    arrendatario: {
      nombre: datos.nombre, apellidos: datos.apellidos, email: datos.email,
      telefono: datos.telefono, dni: datos.dni, direccion: datos.direccion, cp: datos.cp, ciudad: datos.ciudad
    },
    reserva: {
      evento: reserva.evento,
      paqueteHoras: reserva.paquete === '8h' ? 8 : 5,
      fecha: reserva.fecha,
      inicio: reserva.inicio,
      horasExtra: reserva.numextra,
      horasExtraMadrugada: reserva.numextraMad
    },
    importe: {
      base: c.base,
      extras: c.extras,
      extrasAntesMedianoche: reserva.numextra * EXTRA_NOCHE,
      extrasMadrugada: reserva.numextraMad * EXTRA_MADRUGADA,
      servicios: c.servicios, totalServicios: c.totalServicios,
      totalAlquiler: c.totalAlquiler, total: c.totalAlquiler
    },
    aceptaTos: !!tos.acuerdo,
    pago: {
      conectado: !!STRIPE_PUBLISHABLE_KEY,
      observacion: STRIPE_PUBLISHABLE_KEY ? 'cargo automatico pendiente de procesar' : tt('pago_pend')
    },
    captchaToken: (window.grecaptcha && grecaptcha.getResponse()) || ''
  };

  fetch('/.netlify/functions/submit-formulario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json().catch(() => ({})).then(data => ({ status: res.status, data })))
    .then(({ status, data }) => {
      if (data && data.success) {
        terminar(false);
      } else if (status === 409) {
        // Alguien se ha adelantado y ha ocupado el horario mientras se rellenaba el formulario.
        $('p4-next').disabled = false;
        if (window.grecaptcha) grecaptcha.reset();
        mostrarError('err-p4', () => tt('err_conflicto_horario'));
      } else {
        $('p4-next').disabled = false;
        if (window.grecaptcha) grecaptcha.reset();
        terminar(true);
      }
    })
    .catch(() => {
      $('p4-next').disabled = false;
      if (window.grecaptcha) grecaptcha.reset();
      terminar(true);
    });
}

/* ── PANTALLA FINAL ── */
function pintarFinal() {
  if (!estadoFinal) return;
  const ico = document.querySelector('.ok .ico');
  const h3 = $('ok-title');
  const p = $('ok-msg');
  const note = $('ok-note');
  if (estadoFinal === 'error') {
    ico.textContent = '⚠';
    h3.textContent = tt('submit_fail');
    p.textContent = '';
    note.textContent = '';
  } else {
    ico.textContent = '✦';
    h3.textContent = tt('done_title');
    p.textContent = tt('done_ok');
    note.textContent = STRIPE_PUBLISHABLE_KEY ? '' : tt('done_note');
  }
}

function terminar(esError) {
  $('paso4').classList.remove('active');
  $('chip4').classList.remove('active');
  $('ok-box').style.display = 'block';
  estadoFinal = esError ? 'error' : 'ok';
  pintarFinal();
}

/* ── IDIOMA ── */
$('lb-es').addEventListener('click', () => cambiarIdioma('es'));
$('lb-ca').addEventListener('click', () => cambiarIdioma('ca'));

/* init */
seleccionarPaquete('5h');
applyT();