/* ── I18N ── */
const T = {
  es: {
    app_sub:'Reserva de sala', st1:'Términos', st2:'Datos personales', st3:'Reserva', st4:'Confirmación y pago',
    p1_title:'Términos y condiciones', p1_intro:'Antes de reservar la sala, revisa y acepta nuestros términos y condiciones.', p1_scroll:'Desplázate hasta el final del texto para poder marcar las casillas.',
    tos_leido:'He leído los términos y condiciones', tos_acuerdo:'Acepto los términos y condiciones', p1_needs:'Falta marcar las dos casillas para continuar.',
    term_text:`<h4>1. Objeto del contrato</h4><p>Mediante este formulario se realiza la reserva del alquiler puntual de la sala de eventos de Atelier dels Somnis (Carrer dels Velers, 50, 43205 Reus) para la celebración de un evento o actividad. La reserva queda condicionada a la aceptación de estas condiciones y al pago correspondiente.</p><h4>2. Reserva y pago</h4><ul><li>Al confirmar la reserva se genera el cargo automático del importe del alquiler mediante la pasarela de pago integrada.</li><li>La fianza de 100 € se podrá pagar el mismo día de la reserva o, como máximo, el día del evento, antes del acceso a la sala.</li><li>La reserva se considerará firme una vez completado el pago y recibida la confirmación.</li></ul><h4>3. Precios y horas adicionales</h4><ul><li>Paquete de 5 horas: 180 €.</li><li>Paquete de 8 horas: 350 €.</li><li>Horas adicionales: 30 € por cada hora comenzada antes de la medianoche (00:00) y 35 € por cada hora comenzada de madrugada (desde las 00:00).</li></ul><h4>4. Cancelaciones y devoluciones</h4><ul><li>Todas aquellas anulaciones que se realicen con dos semanas de antelación recibirán la devolución íntegra del importe de la reserva.</li><li>Todas aquellas que se anulen una semana antes recibirán la devolución del 50%.</li></ul><h4>5. Responsabilidad por daños</h4><p>El inquilino de la sala se hará responsable de cualquier daño o defecto en la sala y en los elementos comunes, en el que se integra el mobiliario y las instalaciones de que está dotado el espacio, respondiendo de la falta de algún elemento o parte integrante de la misma.</p><h4>6. Sistema de videovigilancia</h4><p>La sala está equipada con un sistema de grabación de seguridad.</p><h4>7. Uso y estado de la sala</h4><p>Los usuarios tienen que dejar la sala en las mismas condiciones en que la han encontrado, llevándose todo lo que han traído para la fiesta y tirando la basura. Todo recogido, mesas y sillas en su lugar y los juguetes en condiciones.</p><h4>8. Prohibiciones</h4><ul><li>Queda totalmente prohibida la entrada a la sala de armas, artefactos pirotécnicos, materias explosivas, inflamables o insalubres, así como la entrada de ningún tipo de animales.</li><li>Se prohíbe fumar en el interior de la sala, así como el consumo de sustancias estupefacientes o psicotrópicas.</li></ul><h4>9. Menores de edad</h4><p>La entrada de menores en la sala deberá ser supervisada por adultos mayores de edad que se responsabilicen de la vigilancia de los mismos.</p><h4>10. Exención de responsabilidad</h4><ul><li>Atelier dels Somnis no se hace responsable de los accidentes que se produzcan en el interior del espacio causados por el inquilino.</li><li>El inquilino responderá, eximiendo de toda responsabilidad a Atelier dels Somnis, de los daños y perjuicios ocasionados a terceros como consecuencia del uso de la sala.</li></ul><h4>11. Actividades ilícitas y orden público</h4><p>Queda prohibida la realización de actividades ilícitas, contrarias al orden público, la moral, los usos o costumbres del lugar. El inquilino se obliga a respetar y hacer cumplir las normas de seguridad, las órdenes municipales y las normas de la comunidad en que se integra el local, respondiendo de los daños que los incumplimientos de tales preceptos ocasionen.</p><h4>12. Incumplimiento</h4><p>El incumplimiento por parte del usuario o de cualquier persona que accede a la sala de las normas de utilización de la misma faculta a Atelier dels Somnis a suspender el evento o la fiesta, exigiendo la restitución de la posesión de la sala y haciendo suyas las cantidades entregadas en concepto de garantía, sin perjuicio del derecho a exigir el resarcimiento de los daños que se hubieran podido ocasionar.</p><h4>13. Protección de datos (RGPD)</h4><p>Responsable del tratamiento: Atelier dels Somnis, Carrer dels Velers, 50, 43205 Reus (Tarragona).</p><ul><li>Finalidad: gestionar la reserva, el cobro del alquiler y la comunicación relacionada con el evento contratado.</li><li>Base legal: la ejecución del contrato de alquiler.</li><li>Los datos no se ceden a terceros, salvo obligación legal o proveedores necesarios para la prestación del servicio (por ejemplo, la pasarela de pago o el alojamiento web).</li><li>Conservación: mientras dure la relación contractual y, después, durante los plazos legales aplicables.</li><li>Derechos: puedes ejercer los derechos de acceso, rectificación, supresión, portabilidad y oposición, a través del <a href="index.html#contact">formulario de contacto de la página web</a>. También puedes reclamar ante la Agencia Española de Protección de Datos.</li></ul>`,
    continuar:'Continuar →', siguiente:'Siguiente →', anterior:'← Anterior',
    p2_title:'Datos del arrendatario', p2_aviso:'Introduce los datos de la persona responsable del alquiler. Será quien firme la reserva y responda del estado de la sala.',
    nombre:'Nombre', apellidos:'Apellidos', email:'Correo electrónico', telefono:'Teléfono', dni:'Documento de identidad (DNI/NIE)', ciudad:'Ciudad',
    ph_nombre:'Tu nombre', ph_apellidos:'Tus apellidos', ph_email:'tu@correo.com', ph_telefono:'600 000 000', ph_dni:'12345678A', ph_ciudad:'Reus',
    err_required:'Completa todos los campos.', err_email:'Introduce un correo electrónico válido.',
    p3_title:'Detalles de la reserva', p3_desc:'Elige la duración del alquiler. El importe se calcula automáticamente.',
    p3_tipo:'¿Qué tipo de evento vas a celebrar?', p3_evento:'Tipo de evento',
    ev_cumple:'Cumpleaños', ev_aniv:'Aniversario', ev_informal:'Fiesta informal', ev_despedida:'Despedida', ev_taller:'Taller / Actividad', ev_empresa:'Reunión / evento de empresa', ev_otro:'Otro',
    p3_duracion:'Duración del alquiler', opt_5h:'Paquete 5 horas', opt_5h_desc:'Alquiler de la sala durante 5 horas.',
    opt_8h:'Paquete 8 horas', opt_8h_desc:'Alquiler de la sala durante 8 horas.',
    p3_horario:'Horario de la reserva', p3_fecha:'Fecha', p3_hinicio:'Hora de inicio',
    p3_extra:'Horas adicionales (opcional)',     p3_extra_aviso:'Si necesitas más horas de las incluidas en el paquete, cada hora extra se cobra: 30 € por hora comenzada antes de la medianoche (00:00) y 35 € por hora comenzada de madrugada (a partir de las 00:00).',
    p3_numextra:'Nº de horas extra',
    conexion_vacia:'Selecciona un paquete de horas y una hora de inicio.',
    p4_title:'Confirmación y pago', p4_desc:'Revisa los datos de tu reserva antes de confirmar.',
    resumen_datos:'Tus datos', resumen_reserva:'Tu reserva', resumen_importe:'Importe', resumen_acciones:'Puedes volver con «Anterior» para corregir cualquier dato.',
    k_duracion:'Duración', k_evento:'Tipo de evento', k_fecha:'Fecha', k_inicio:'Inicio', k_numextra:'Horas extra', k_alquiler:'Alquiler', k_extras:'Horas adicionales', k_fianza:'Fianza (100 €)', k_total:'Total reserva', k_a_pagar:'A pagar en el formulario',
    hora_antes:'hora extra · antes de la medianoche', hora_despues:'hora extra · de madrugada (00:00-)',
    paquete:'Paquete', horas:' horas',
    btn_reservar:'Reservar y pagar', err_robot:'Marca la casilla de verificación «No soy un robot» para continuar.',
    done_title:'¡Reserva enviada!', done_ok:'Recibiremos tu solicitud de reserva y te confirmaremos por correo.',
    done_note:'El pago se procesará a través de la pasarela de pago que se conectará próximamente. Te contactaremos para finalizarlo.',
    submit_fail:'No se ha podido enviar la reserva. Inténtalo de nuevo.',
    pago_pend:'Configuración de pago: la pasarela aún no está conectada. Por ahora se registrará la reserva sin cargo automático.'
  },
  ca: {
    app_sub:'Reserva de sala', st1:'Termes', st2:'Dades personals', st3:'Reserva', st4:'Confirmació i pagament',
    p1_title:'Termes i condicions', p1_intro:'Abans de reservar la sala, revisa i accepta els nostres termes i condicions.', p1_scroll:'Desplaça\'t fins al final del text per poder marcar les caselles.',
    tos_leido:'He llegit els termes i condicions', tos_acuerdo:'Accepto els termes i condicions', p1_needs:'Falten marcar les dues caselles per continuar.',
    term_text:`<h4>1. Objecte del contracte</h4><p>Mitjançant aquest formulari es realitza la reserva del lloguer puntual de la sala d'esdeveniments d'Atelier dels Somnis (Carrer dels Velers, 50, 43205 Reus) per a la celebració d'un esdeveniment o activitat. La reserva queda condicionada a l'acceptació d'aquestes condicions i al pagament corresponent.</p><h4>2. Reserva i pagament</h4><ul><li>En confirmar la reserva es genera el càrrec automàtic de l'import del lloguer mitjançant la passarel·la de pagament integrada.</li><li>La fiança de 100 € es podrà pagar el mateix dia de la reserva o, com a màxim, el dia de l'esdeveniment, abans de l'accés a la sala.</li><li>La reserva es considerarà ferma un cop completat el pagament i rebuda la confirmació.</li></ul><h4>3. Preus i hores addicionals</h4><ul><li>Paquet de 5 hores: 180 €.</li><li>Paquet de 8 hores: 350 €.</li><li>Hores addicionals: 30 € per cada hora començada abans de la mitjanit (00:00) i 35 € per cada hora començada de matinada (des de les 00:00).</li></ul><h4>4. Cancel·lacions i devolucions</h4><ul><li>Totes aquelles anul·lacions que es realitzin amb dues setmanes d'antelació rebran la devolució íntegra de l'import de la reserva.</li><li>Totes aquelles que s'anul·lin una setmana abans rebran la devolució del 50%.</li></ul><h4>5. Responsabilitat pels danys</h4><p>L'inquilí de la sala es farà responsable de qualsevol dany o defecte a la sala i als elements comuns, on s'integra el mobiliari i les instal·lacions de què està dotat l'espai, responent de la falta d'algun element o part integrant d'aquesta.</p><h4>6. Sistema de videovigilància</h4><p>La sala està equipada amb un sistema de gravació de seguretat.</p><h4>7. Ús i estat de la sala</h4><p>Els usuaris han de deixar la sala en les mateixes condicions en què l'han trobada, emportant-se tot el que han portat per a la festa i llençant la brossa. Tot recollit, taules i cadires al seu lloc i les joguines en condicions.</p><h4>8. Prohibicions</h4><ul><li>Queda totalment prohibida l'entrada a la sala d'armes, artefactes pirotècnics, matèries explosives, inflamables o insalubres, així com l'entrada de cap tipus d'animals.</li><li>Es prohibeix fumar a l'interior de la sala, així com el consum de substàncies estupefaents o psicotròpiques.</li></ul><h4>9. Menors d'edat</h4><p>L'entrada de menors a la sala haurà de ser supervisada per adults majors d'edat que es responsabilitzin de la vigilància dels mateixos.</p><h4>10. Exempció de responsabilitat</h4><ul><li>Atelier dels Somnis no es fa responsable dels accidents que es produeixin a l'interior de l'espai causats per l'inquilí.</li><li>L'inquilí respondrà, eximint de tota responsabilitat a Atelier dels Somnis, dels danys i perjudicis ocasionats a tercers com a conseqüència de l'ús de la sala.</li></ul><h4>11. Activitats il·lícites i ordre públic</h4><p>Queda prohibida la realització d'activitats il·lícites, contràries a l'ordre públic, la moral, els usos o costums del lloc. L'inquilí s'obliga a respectar i fer complir les normes de seguretat, les ordres municipals i les normes de la comunitat on s'integra el local, responent dels danys que els incompliments d'aquests preceptes ocasionin.</p><h4>12. Incompliment</h4><p>L'incompliment per part de l'usuari o de qualsevol persona que accedeix a la sala de les normes d'utilització d'aquesta faculta Atelier dels Somnis a suspendre l'esdeveniment o la festa, exigint la restitució de la possessió de la sala i fent seves les quantitats lliurades en concepte de garantia, sense perjudici del dret a exigir la indemnització dels danys que s'hagin pogut ocasionar.</p><h4>13. Protecció de dades (RGPD)</h4><p>Responsable del tractament: Atelier dels Somnis, Carrer dels Velers, 50, 43205 Reus (Tarragona).</p><ul><li>Finalitat: gestionar la reserva, el cobrament del lloguer i la comunicació relacionada amb l'esdeveniment contractat.</li><li>Base legal: l'execució del contracte de lloguer.</li><li>Les dades no es cedeixen a tercers, llevat d'obligació legal o proveïdors necessaris per a la prestació del servei (per exemple, la passarel·la de pagament o l'allotjament web).</li><li>Conservació: mentre duri la relació contractual i, després, durant els terminis legals aplicables.</li><li>Drets: pots exercir els drets d'accés, rectificació, supressió, portabilitat i oposició, mitjançant el <a href="index.html#contact">formulari de contacte de la pàgina web</a>. També pots reclamar davant l'Agència Espanyola de Protecció de Dades.</li></ul>`,
    continuar:'Continua →', siguiente:'Següent →', anterior:'← Enrere',
    p2_title:'Dades de l\'arrendatari', p2_aviso:'Introdueix les dades de la persona responsable del lloguer. Serà qui signi la reserva i respongui de l\'estat de la sala.',
    nombre:'Nom', apellidos:'Cognoms', email:'Correu electrònic', telefono:'Telèfon', dni:'Document d\'identitat (DNI/NIE)', ciudad:'Ciutat',
    ph_nombre:'El teu nom', ph_apellidos:'Els teus cognoms', ph_email:'tu@correu.com', ph_telefono:'600 000 000', ph_dni:'12345678A', ph_ciutat:'Reus', ph_cp:'43003',
    ph_ciudad:'Reus',
    err_required:'Completa tots els camps.', err_email:'Introdueix un correu electrònic vàlid.',
    p3_title:'Detalls de la reserva', p3_desc:'Tria la durada del lloguer. L\'import es calcula automàticament.',
    p3_tipo:'Quin tipus d\'esdeveniment celebraràs?', p3_evento:'Tipus d\'esdeveniment',
    ev_cumple:'Aniversari (edat)', ev_aniv:'Aniversari', ev_informal:'Festa informal', ev_despedida:'Comiat', ev_taller:'Taller / Activitat', ev_empresa:'Reunió / esdeveniment d\'empresa', ev_otro:'Altres',
    p3_duracion:'Durada del lloguer', opt_5h:'Paquet 5 hores', opt_5h_desc:'Lloguer de la sala durant 5 hores.',
    opt_8h:'Paquet 8 hores', opt_8h_desc:'Lloguer de la sala durant 8 hores.',
    p3_horario:'Horari de la reserva', p3_fecha:'Data', p3_hinicio:'Hora d\'inici',
    p3_extra:'Hores addicionals (opcional)',     p3_extra_aviso:'Si necessites més hores de les incloses al paquet, cada hora extra es cobra: 30 € per hora començada abans de la mitjanit (00:00) i 35 € per hora començada de matinada (a partir de les 00:00).',
    p3_numextra:'Núm. d\'hores extra',
    conexion_vacia:'Selecciona un paquet d\'hores i una hora d\'inici.',
    p4_title:'Confirmació i pagament', p4_desc:'Revisa les dades de la teva reserva abans de confirmar.',
    resumen_datos:'Les teves dades', resumen_reserva:'La teva reserva', resumen_importe:'Import', resumen_acciones:'Pots tornar amb «Enrere» per corregir qualsevol dada.',
    k_duracion:'Durada', k_evento:'Tipus d\'esdeveniment', k_fecha:'Data', k_inicio:'Inici', k_numextra:'Hores extra', k_alquiler:'Lloguer', k_extras:'Hores addicionals', k_fianza:'Fiança (100 €)', k_total:'Total reserva', k_a_pagar:'A pagar al formulari',
    hora_antes:'hora extra · abans de la mitjanit', hora_despues:'hora extra · de matinada (00:00-)',
    paquete:'Paquet', horas:' hores',
    btn_reservar:'Reservar i pagar', err_robot:'Marca la casella de verificació «No sóc un robot» per continuar.',
    done_title:'Reserva enviada!', done_ok:'Rebrem la teva sol·licitud de reserva i et confirmarem per correu.',
    done_note:'El pagament es processarà a través de la passarel·la de pagament que es connectarà properament. Et contactarem per finalitzar-lo.',
    submit_fail:'No s\'ha pogut enviar la reserva. Torna-ho a intentar.',
    pago_pend:'Configuració de pagament: la passarel·la encara no està connectada. De moment es registrarà la reserva sense càrrec automàtic.'
  }
};
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

/* ── ESTADO ── */
const $ = id => document.getElementById(id);
let paso = 1;
let datos = {};
let tos = { leido: false, acuerdo: false };
let reserva = { paquete: '5h', fecha: '', inicio: '', numextra: 0, evento: '' };

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
    dni: $('d-dni').value.trim(), ciudad: $('d-ciudad').value.trim()
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
}

$('opt-5h').addEventListener('click', () => seleccionarPaquete('5h'));
$('opt-8h').addEventListener('click', () => seleccionarPaquete('8h'));

$('r-numextra').addEventListener('input', () => {
  let v = parseInt($('r-numextra').value, 10);
  if (isNaN(v) || v < 0) v = 0;
  $('r-numextra').value = v;
});

$('p3-prev').addEventListener('click', () => { $('err-p3').style.display='none'; go(2); });
$('p3-next').addEventListener('click', () => {
  reserva.fecha = $('r-fecha').value;
  reserva.inicio = $('r-inicio').value;
  reserva.evento = $('r-evento').value;
  reserva.numextra = parseInt($('r-numextra').value, 10) || 0;
  if (!reserva.fecha || !reserva.inicio || !reserva.paquete) {
    $('err-p3').textContent = tt('conexion_vacia');
    $('err-p3').style.display='block';
    return;
  }
  $('err-p3').style.display='none';
  go(4);
});

/* Cálculo del desglose según la hora de inicio y las horas extra.
   Regla de precios: las horas extra que arrancan antes de la medianoche
   (00:00) cuestan 30 €/h; las que arrancan de madrugada (desde las 00:00)
   cuestan 35 €/h. Se considera "madrugada" la franja 00:00–06:00 del reloj. */
function calculoImporte() {
  const base = reserva.paquete === '8h' ? PRECIO_8H : PRECIO_5H;
  const horasBase = reserva.paquete === '8h' ? 8 : 5;
  const instart = reserva.inicio; // 'HH:MM'
  const [hh, mm] = (instart || '00:00').split(':').map(Number);
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
  return { base, horasBase, extras, totalAlquiler, totalConFianza, extrasRows };
}

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

  const baseHoras = reserva.paquete === '8h' ? 8 : 5;
  let hh = '';
  hh += kv(tt('k_duracion'), tt('paquete') + ' ' + baseHoras + tt('horas'));
  hh += kv(tt('k_evento'), reserva.evento);
  hh += kv(tt('k_fecha'), reserva.fecha);
  hh += kv(tt('k_inicio'), fmtHora(reserva.inicio));
  hh += kv(tt('k_numextra'), reserva.numextra);
  $('res-reserva').innerHTML = hh;

  const c = calculoImporte();
  let hi = '';
  hi += kv(tt('k_alquiler'), c.base + ' €');
  if (c.extras > 0) hi += kv(tt('k_extras') + ' (' + reserva.numextra + ')', c.extras + ' €');
  hi += kv(tt('k_fianza'), FIANZA + ' €');
  hi += '<div class="kv total"><span>'+tt('k_total')+'</span><b>'+c.totalConFianza+' €</b></div>';
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

/* ── ENVÍO (Make webhook) ── */
/* TODO: sustituir por tu webhook real de Make.com cuando lo crees */
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/TU_WEBHOOK_DE_ALQUILER';
/* TODO: conectar Stripe cuando se decida la pasarela.
   De momento la reserva se envía al webhook y el pago queda pendiente de conexión. */
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

function enviar() {
  $('p4-next').disabled = true;
  leerDatos();
  const c = calculoImporte();
  const payload = {
    lang: lng,
    arrendatario: {
      nombre: datos.nombre, apellidos: datos.apellidos, email: datos.email,
      telefono: datos.telefono, dni: datos.dni, ciudad: datos.ciudad
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
      fianza: FIANZA, total: c.totalConFianza
    },
    aceptaTos: !!tos.acuerdo,
    pago: {
      conectado: !!STRIPE_PUBLISHABLE_KEY,
      observacion: STRIPE_PUBLISHABLE_KEY ? 'cargo automatico pendiente de procesar' : tt('pago_pend')
    },
    captchaToken: (window.grecaptcha && grecaptcha.getResponse()) || ''
  };
  fetch(MAKE_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => { if (res.ok) terminar(false); else terminar(true); })
    .catch(() => terminar(true));
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
    note.textContent = STRIPE_PUBLISHABLE_KEY ? '' : tt('done_note');
  }
}

/* ── LANG ── */
$('lb-es').addEventListener('click', () => { lng = 'es'; applyT(); $('lb-es').classList.add('active'); $('lb-ca').classList.remove('active'); document.documentElement.lang='es'; });
$('lb-ca').addEventListener('click', () => { lng = 'ca'; applyT(); $('lb-ca').classList.add('active'); $('lb-es').classList.remove('active'); document.documentElement.lang='ca'; });

/* init */
seleccionarPaquete('5h');
applyT();