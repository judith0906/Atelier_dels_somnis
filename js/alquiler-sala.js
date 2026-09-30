/* ────────────────────────────────────────────────────────────
   alquiler-sala.js — Formulario de reserva de la sala (4 pasos)
   Atelier dels Somnis · Reus

   Textos ES/CA en js/i18n.js (debe cargarse antes que este archivo).

   Reglas de negocio añadidas en esta versión:
   - El pack de 5h admite como máximo 2 horas extra (7h en total). A
     partir de ahí, se pasa automáticamente al pack de 8h restando 3
     horas extra (ver normalizarPaqueteExtra). El pack de 8h no tiene tope.
   - Antes de pasar al paso 4 se comprueba la disponibilidad real de la
     sala contra /api/disponibilidad-sala; si el hueco choca, se ofrecen
     los huecos libres más cercanos ese mismo día.
   - La fianza se puede pagar ahora o dejarla pendiente hasta el día
     del evento (ver reserva.fianzaMomento).
   - El envío ya no va directo al webhook de Make: pasa por nuestra
     función de Netlify /.netlify/functions/submit-formulario, que es
     quien de verdad "bloquea" el horario en la base de datos.
   ──────────────────────────────────────────────────────────── */

const T = I18N.alquiler;

let lng = 'es';
function applyT() {
  const d = T[lng];
  document.querySelectorAll('[data-t]').forEach(el => { const k = el.getAttribute('data-t'); if (d[k]) el.textContent = d[k]; });
  document.querySelectorAll('[data-tph]').forEach(el => { const k = el.getAttribute('data-tph'); if (d[k]) el.textContent = d[k]; });
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
  renderOpciones();
  actualizarTotales();
}
function tt(k){ return T[lng][k] || k; }

/* ── PRECIOS ── */
const PRECIO_5H = 180;
const PRECIO_8H = 350;
const FIANZA = 100;
const EXTRA_NOCHE = 30;      // por hora antes de la medianoche (00:00)
const EXTRA_MADRUGADA = 35;  // por hora de madrugada (desde las 00:00)
const MAX_EXTRA_5H = 2;      // tope de horas extra en el pack de 5h; a partir de aquí, salto a 8h

/* ── ESTADO ── */
const $ = id => document.getElementById(id);
let paso = 1;
let datos = {};
let tos = { leido: false, acuerdo: false };
let reserva = { paquete: '5h', fecha: '', inicio: '', numextra: 0, evento: '', fianzaMomento: 'ahora' };

/* ── NAVEGACIÓN ── */
function go(n) {
  paso = n;
  document.querySelectorAll('.step').forEach((s,i) => s.id === ('paso'+n) ? s.classList.add('active') : s.classList.remove('active'));
  for (let i=1;i<=4;i++) $('chip'+i).classList.toggle('active', i===n);
  if (n === 4) { renderRecaptcha(); renderResumen(); }
  $('paso'+n).scrollIntoView({ block:'start', behavior:'smooth' });
}

function leerDatos() {
  datos = {
    nombre: $('d-nombre').value.trim(), apellidos: $('d-apellidos').value.trim(),
    email: $('d-email').value.trim(), telefono: $('d-telefono').value.trim(),
    dni: $('d-dni').value.trim(), ciudad: $('d-ciudad').value.trim(),
    direccion: $('d-direccion').value.trim(), cp: $('d-cp').value.trim()
  };
}
function validarDatos() {
  leerDatos();
  const v = Object.values(datos);
  if (v.some(x => !x)) { $('err-p2').textContent = tt('err_required'); $('err-p2').style.display='block'; return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) { $('err-p2').textContent = tt('err_email'); $('err-p2').style.display='block'; return false; }
  $('err-p2').style.display='none';
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
  if (tos.leido && tos.acuerdo) { $('err-p1').style.display='none'; return true; }
  return false;
}
$('p1-next').addEventListener('click', () => {
  if (!p1Check()) { $('err-p1').style.display='block'; return; }
  go(2);
});

/* ── PASO 2 ── */
$('p2-prev').addEventListener('click', () => { $('err-p2').style.display='none'; go(1); });
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
  $('opt-'+tipo).classList.add('sel');
  normalizarPaqueteExtra();
}

$('opt-5h').addEventListener('click', () => seleccionarPaquete('5h'));
$('opt-8h').addEventListener('click', () => seleccionarPaquete('8h'));

/* Si con el pack de 5h se piden 3 horas extra o más, es más barato el
   pack de 8h (5+3=8+0), así que saltamos automáticamente a 8h restando
   3 horas extra (5+5 → 8+2, etc.). El pack de 8h no tiene tope.
   Se llama en cada cambio del campo y del pack, así que si alguien
   fuerza otra vez 5h con 3+ horas extra, se vuelve a recalcular. */
function normalizarPaqueteExtra() {
  let v = parseInt($('r-numextra').value, 10);
  if (isNaN(v) || v < 0) v = 0;
  let auto = false;
  if (reserva.paquete === '5h' && v > MAX_EXTRA_5H) {
    reserva.paquete = '8h';
    v = v - (MAX_EXTRA_5H + 1);
    document.querySelectorAll('#opciones .opt').forEach(o => o.classList.remove('sel'));
    $('opt-8h').classList.add('sel');
    auto = true;
  }
  $('r-numextra').value = v;
  reserva.numextra = v;
  $('aviso-8h-auto').style.display = auto ? 'block' : 'none';
}

$('r-numextra').addEventListener('input', normalizarPaqueteExtra);

$('p3-prev').addEventListener('click', () => { $('err-p3').style.display='none'; go(2); });

/* Cálculo del desglose según la hora de inicio y las horas extra.
   Regla de precios: las horas extra que arrancan antes de la medianoche
   (00:00) cuestan 30 €/h; las que arrancan de madrugada (desde las 00:00)
   cuestan 35 €/h. Se considera "madrugada" la franja 00:00–06:00 del reloj. */
function calculoImporte() {
  const base = reserva.paquete === '8h' ? PRECIO_8H : PRECIO_5H;
  const horasBase = reserva.paquete === '8h' ? 8 : 5;
  const instart = reserva.inicio || '00:00'; // 'HH:MM'
  const [hh, mm] = instart.split(':').map(Number);
  const minutosInicio = hh * 60 + mm;
  const MIN_MADRUGADA = 0 * 60;              // 00:00
  const MAX_MADRUGADA = 6 * 60;              // 06:00
  let extras = 0;
  let extrasRows = [];
  if (reserva.numextra > 0) {
    for (let i = 0; i < reserva.numextra; i++) {
      const reloj = (minutosInicio + (horasBase + i) * 60) % (24 * 60);
      const esMadrugada = reloj >= MIN_MADRUGADA && reloj < MAX_MADRUGADA;
      const precio = esMadrugada ? EXTRA_MADRUGADA : EXTRA_NOCHE;
      extras += precio;
      extrasRows.push({ precio });
    }
  }
  const totalAlquiler = base + extras;
  const totalConFianza = totalAlquiler + FIANZA;

  /* Horario total declarado por el cliente (base + horas extra contratadas):
     si acaba a partir de las 00:00, queda constancia de ello en el resumen
     y en el envío — ver cláusula 14 de los términos sobre el incumplimiento
     de este horario declarado. */
  const finMinutos = minutosInicio + (horasBase + reserva.numextra) * 60;
  const cruzaMedianoche = finMinutos >= 24 * 60;

  // Importe a pagar AHORA en el formulario: si la fianza se deja para
  // más adelante, no entra en este total (ver reserva.fianzaMomento).
  const totalAPagarAhora = reserva.fianzaMomento === 'despues' ? totalAlquiler : totalConFianza;

  return { base, horasBase, extras, totalAlquiler, totalConFianza, totalAPagarAhora, extrasRows, cruzaMedianoche };
}

/* ── Disponibilidad de la sala (comprobación antes de pasar al paso 4) ── */
async function comprobarDisponibilidad() {
  const horasTotales = (reserva.paquete === '8h' ? 8 : 5) + reserva.numextra;
  const params = new URLSearchParams({ fecha: reserva.fecha, inicio: reserva.inicio, horas: horasTotales });
  const res = await fetch('/api/disponibilidad-sala?' + params.toString());
  if (!res.ok) throw new Error('disponibilidad no ok');
  return res.json();
}

function mostrarSugerencias(horas) {
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
      $('p3-next').click();
    });
  });
}

$('p3-next').addEventListener('click', async () => {
  normalizarPaqueteExtra();
  reserva.fecha = $('r-fecha').value;
  reserva.inicio = $('r-inicio').value;
  reserva.evento = $('r-evento').value;
  reserva.fianzaMomento = $('r-fianza-despues').checked ? 'despues' : 'ahora';

  if (!reserva.fecha || !reserva.inicio || !reserva.paquete) {
    $('err-p3').textContent = tt('conexion_vacia');
    $('err-p3').style.display = 'block';
    return;
  }
  $('err-p3').style.display = 'none';
  $('disp-sugerencias').style.display = 'none';

  $('p3-next').disabled = true;
  const textoOriginal = $('p3-next').textContent;
  $('p3-next').textContent = tt('comprobando_disp');

  try {
    const data = await comprobarDisponibilidad();
    if (data.disponible) {
      go(4);
    } else if (data.sugerencias && data.sugerencias.length) {
      mostrarSugerencias(data.sugerencias);
    } else {
      $('err-p3').textContent = tt('sin_disponibilidad');
      $('err-p3').style.display = 'block';
    }
  } catch (e) {
    $('err-p3').textContent = tt('err_disponibilidad');
    $('err-p3').style.display = 'block';
  } finally {
    $('p3-next').disabled = false;
    $('p3-next').textContent = textoOriginal;
  }
});

/* ── PASO 4 ── */
function fmtHora(t) {
  if (!t) return '—';
  const [h, m] = t.split(':');
  return h + ':' + m;
}
function renderResumen() {
  leerDatos();
  let hd = '';
  hd += kv('Nombre', datos.nombre + ' ' + datos.apellidos);
  hd += kv(tt('email'), datos.email);
  hd += kv(tt('telefono'), datos.telefono);
  hd += kv(tt('dni'), datos.dni);
  hd += kv(tt('ciudad'), datos.ciudad);
  $('res-datos').innerHTML = hd;

  const c = calculoImporte();

  const baseHoras = reserva.paquete === '8h' ? 8 : 5;
  let hh = '';
  hh += kv(tt('k_duracion'), tt('paquete') + ' ' + baseHoras + tt('horas'));
  hh += kv(tt('k_evento'), reserva.evento);
  hh += kv(tt('k_fecha'), reserva.fecha);
  hh += kv(tt('k_inicio'), fmtHora(reserva.inicio));
  hh += kv(tt('k_numextra'), reserva.numextra);
  hh += kv(tt('k_horario_decl'), c.cruzaMedianoche ? tt('horario_despues_medianoche') : tt('horario_antes_medianoche'));
  $('res-reserva').innerHTML = hh;

  let hi = '';
  hi += kv(tt('k_alquiler'), c.base + ' €');
  if (c.extras > 0) hi += kv(tt('k_extras') + ' (' + reserva.numextra + ')', c.extras + ' €');
  if (reserva.fianzaMomento === 'despues') {
    hi += kv(tt('k_fianza_pendiente'), tt('fianza_pendiente_valor'));
  } else {
    hi += kv(tt('k_fianza'), FIANZA + ' €');
  }
  hi += '<div class="kv total"><span>'+tt('k_total')+'</span><b>'+c.totalAPagarAhora+' €</b></div>';
  $('res-importe').innerHTML = hi;
}
function kv(k, v) { return '<div class="kv"><span>'+k+'</span><b>'+v+'</b></div>'; }

$('p4-prev').addEventListener('click', () => { $('err-p4').style.display='none'; go(3); });

$('p4-next').addEventListener('click', () => {
  const token = (window.grecaptcha && grecaptcha.getResponse()) || '';
  if (!token) { $('err-p4').textContent = tt('err_robot'); $('err-p4').style.display='block'; return; }
  $('err-p4').style.display='none';
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
   entonces reenvía los datos a Make. La URL de Make ya no aparece en el navegador. */
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
      horasExtra: reserva.numextra
    },
    importe: {
      base: c.base, extras: c.extras, totalAlquiler: c.totalAlquiler,
      fianza: FIANZA, fianzaMomento: reserva.fianzaMomento, total: c.totalAPagarAhora
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
        $('err-p4').textContent = tt('err_conflicto_horario');
        $('err-p4').style.display = 'block';
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

function terminar(esError) {
  $('paso4').classList.remove('active');
  $('chip4').classList.remove('active');
  $('ok-box').style.display = 'block';
  const ico = document.querySelector('.ok .ico');
  const h3 = $('ok-title');
  const p = $('ok-msg');
  const note = $('ok-note');
  if (esError) {
    ico.textContent = '⚠';
    h3.textContent = tt('submit_fail');
    p.textContent = '';
    note.textContent = '';
  } else {
    ico.textContent = '✦';
    h3.textContent = tt('done_title');
    p.textContent = tt('done_ok');
    note.textContent = reserva.fianzaMomento === 'despues'
      ? tt('done_note_fianza_pend')
      : (STRIPE_PUBLISHABLE_KEY ? '' : tt('done_note'));
  }
}

/* ── LANG ── */
$('lb-es').addEventListener('click', () => { lng = 'es'; applyT(); $('lb-es').classList.add('active'); $('lb-ca').classList.remove('active'); document.documentElement.lang='es'; });
$('lb-ca').addEventListener('click', () => { lng = 'ca'; applyT(); $('lb-ca').classList.add('active'); $('lb-es').classList.remove('active'); document.documentElement.lang='ca'; });

/* init */
seleccionarPaquete('5h');
applyT();