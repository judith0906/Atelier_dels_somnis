/* ── I18N ── */
const T = {
  es: {
    app_title:'Inscripciones', st1:'Términos', st2:'Datos personales', st3:'Detalles', st4:'Confirmación',
    p1_title:'Términos y condiciones', p1_intro:'Antes de inscribirte, revisa y acepta nuestros términos y condiciones.', p1_scroll:'Desplázate hasta el final del texto para poder marcar las casillas.',
    tos_leido:'He leído los términos y condiciones', tos_acuerdo:'Acepto los términos y condiciones', p1_needs:'Falta marcar las dos casillas para continuar.',
    term_text:`<h4>1. Inscripción y pago</h4><p>La inscripción da acceso a la actividad o actividades elegidas en este formulario. No genera ningún cargo automático: una vez recibida, una persona de Atelier dels Somnis revisará tu solicitud y se pondrá en contacto contigo para concretar días, horarios y condiciones de la actividad.</p><ul><li>El importe de cada actividad, la forma de pago y su calendario se acordarán e informarán personalmente (por correo, por teléfono o en el centro) antes del inicio de la actividad.</li><li>La reserva de plaza queda condicionada a que confirmes y aceptes las condiciones comunicadas.</li><li>En caso de inscripción de menores, el padre, la madre o el tutor legal acepta estos términos en nombre del menor.</li></ul><h4>2. Bajas y cancelaciones</h4><ul><li>Para darse de baja hay que comunicarlo por escrito, a través del <a href="index.html#contact">formulario de contacto de la página web</a>.</li><li>Atelier dels Somnis podrá cancelar una actividad por causas justificadas (por ejemplo, número insuficiente de alumnos), avisando con antelación.</li><li>Los importes ya abonados y cualquier compromiso de permanencia se regirán por lo acordado en el momento de la contratación.</li></ul><h4>3. Protección de datos (RGPD)</h4><p>Responsable del tratamiento: Atelier dels Somnis, Carrer dels Velers, 50, 43205 Reus (Tarragona).</p><ul><li>Finalidad: gestionar la inscripción, la facturación y la comunicación relacionada con la actividad contratada.</li><li>Base legal: la ejecución del contrato de inscripción.</li><li>Los datos no se ceden a terceros, salvo obligación legal o proveedores necesarios para la prestación del servicio (por ejemplo, alojamiento web).</li><li>Conservación: mientras dure la relación contractual y, después, durante los plazos legales aplicables.</li><li>Derechos: puedes ejercer los derechos de acceso, rectificación, supresión, portabilidad y oposición, a través del <a href="index.html#contact">formulario de contacto de la página web</a>.</li><li>Reclamación: puedes dirigir cualquier reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).</li></ul>`,
    continuar:'Continuar →', siguiente:'Siguiente →', anterior:'← Anterior',
    p2_title:'Datos personales', p2_aviso:'Importante: introduce TUS datos personales. Si vas a inscribir a otra persona, los datos de esa persona se piden en el siguiente paso.',
    nombre:'Nombre', apellidos:'Apellidos', email:'Correo electrónico', telefono:'Teléfono', fechaNac:'Fecha de nacimiento', cp:'Código postal', ciudad:'Ciudad', dni:'Documento de identidad (DNI/NIE)',
    ph_nombre:'Tu nombre', ph_apellidos:'Tus apellidos', ph_email:'tu@correo.com', ph_telefono:'600 000 000', ph_cp:'43003', ph_ciudad:'Reus', ph_dni:'12345678A',
    err_required:'Completa todos los campos.', err_email:'Introduce un correo electrónico válido.',
    p3_title:'Detalles de la inscripción', p3_desc:'Elige qué alumno se inscribe y selecciona sus clases. Puedes inscribir hasta 5 personas.',
    opt_a:'Inscribirme a mí mismo', opt_a_desc:'Te selecciono como alumno con tus datos personales y eliges tus clases.',
    opt_b:'Inscribir a un familiar', opt_b_desc:'Introduzco los datos de un familiar y luego elijo sus clases.',
    opt_c:'Continuar inscripción', opt_c_desc:'He terminado de añadir alumnas y alumnos.',
    alumnos_title:'Alumnos inscritos', alumnos_vacio:'Aún no hay alumnos inscritos.', alumnos_max:'Has llegado al máximo de 5 alumnos.',
    tipo_yo:'Alumno principal', tipo_fam:'Familiar', nac:'Nacimiento:',
    btn_editar_clases:'Editar clases', btn_editar_datos:'Editar datos', btn_eliminar:'Eliminar',
    label_clases:'Clases:', sin_clases:'sin clases seleccionadas',
    modal_clases_title:'Selecciona sus clases', modal_categoria:'Categoría:', modal_dias:'Días:', modal_lista:'Marca las clases para este alumno:',
    modal_cancelar:'Cancelar', modal_aceptar:'Aceptar', err_clases:'Selecciona al menos una clase.',
    modal_alumno_title:'Datos del familiar', btn_inscribir_alumno:'Inscribir alumno', btn_guardar:'Guardar',
    p4_title:'Confirmación', p4_desc:'Revisa todos los datos antes de finalizar la inscripción.',
    resumen_persona:'Tus datos', resumen_alumnos:'Inscripciones', resumen_acciones:'Puedes volver con «Anterior» para corregir cualquier dato.',
    robot:'No soy un robot', btn_inscribir:'Finalizar inscripción', err_robot:'Marca la casilla de verificación «No soy un robot» para continuar.',
    done_title:'¡Inscripción enviada!', done_ok:'Recibiremos tu solicitud y te confirmaremos por correo.',
    reopen_form:'Continuar con mi inscripción',
    submit_fail:'No se ha podido enviar la inscripción. Inténtalo de nuevo.'
  },
  ca: {
    app_title:'Inscripcions', st1:'Termes', st2:'Dades personals', st3:'Detalls', st4:'Confirmació',
    p1_title:'Termes i condicions', p1_intro:'Abans d\'inscriure\'t, revisa i accepta els nostres termes i condicions.', p1_scroll:'Desplaça\'t fins al final del text per poder marcar les caselles.',
    tos_leido:'He llegit els termes i condicions', tos_acuerdo:'Accepto els termes i condicions', p1_needs:'Falten marcar les dues caselles per continuar.',
    term_text:`<h4>1. Inscripció i pagament</h4><p>La inscripció dóna accés a l'activitat o activitats triades en aquest formulari. No genera cap càrrec automàtic: un cop rebuda, una persona d'Atelier dels Somnis revisarà la teva sol·licitud i es posarà en contacte amb tu per concretar dies, horaris i condicions de l'activitat.</p><ul><li>L'import de cada activitat, la forma de pagament i el seu calendari s'acordaran i s'informaran personalment (per correu, per telèfon o al centre) abans de l'inici de l'activitat.</li><li>La reserva de plaça queda condicionada que confirminis i acceptis les condicions comunicades.</li><li>En cas d'inscripció de menors, el pare, la mare o el tutor legal accepta aquests termes en nom del menor.</li></ul><h4>2. Baixes i cancel·lacions</h4><ul><li>Per donar-se de baixa cal comunicar-ho per escrit, mitjançant el <a href="index.html#contact">formulari de contacte de la pàgina web</a>.</li><li>Atelier dels Somnis podrà cancel·lar una activitat per causes justificades (per exemple, nombre insuficient d'alumnes), avisant amb antelació.</li><li>Els imports ja abonats i qualsevol compromís de permanència es regiran pel que s'acordi en el moment de la contractació.</li></ul><h4>3. Protecció de dades (RGPD)</h4><p>Responsable del tractament: Atelier dels Somnis, Carrer dels Velers, 50, 43205 Reus (Tarragona).</p><ul><li>Finalitat: gestionar la inscripció, la facturació i la comunicació relacionada amb l'activitat contractada.</li><li>Base legal: l'execució del contracte d'inscripció.</li><li>Les dades no es cedeixen a tercers, llevat d'obligació legal o proveïdors necessaris per a la prestació del servei (per exemple, allotjament web).</li><li>Conservació: mentre duri la relació contractual i, després, durant els terminis legals aplicables.</li><li>Drets: pots exercir els drets d'accés, rectificació, supressió, portabilitat i oposició, mitjançant el <a href="index.html#contact">formulari de contacte de la pàgina web</a>.</li><li>Reclamació: pots adreçar qualsevol reclamació davant l'Agència Espanyola de Protecció de Dades (www.aepd.es).</li></ul>`,
    continuar:'Continua →', siguiente:'Següent →', anterior:'← Enrere',
    p2_title:'Dades personals', p2_aviso:'Important: introdueix LES TEVES dades personals. Si inscrius una altra persona, les dades d\'aquesta persona es demanen al pas següent.',
    nombre:'Nom', apellidos:'Cognoms', email:'Correu electrònic', telefono:'Telèfon', fechaNac:'Data de naixement', cp:'Codi postal', ciudad:'Ciutat', dni:'Document d\'identitat (DNI/NIE)',
    ph_nombre:'El teu nom', ph_apellidos:'Els teus cognoms', ph_email:'tu@correu.com', ph_telefono:'600 000 000', ph_cp:'43003', ph_ciudad:'Reus', ph_dni:'12345678A',
    err_required:'Completa tots els camps.', err_email:'Introdueix un correu electrònic vàlid.',
    p3_title:'Detalls de la inscripció', p3_desc:'Tria quin alumne s\'inscriu i selecciona les seves classes. Pots inscriure fins a 5 persones.',
    opt_a:'Inscriure\'m a mi mateix', opt_a_desc:'Et selecciono com a alumne amb les teves dades personals i tries les teves classes.',
    opt_b:'Inscriure un familiar', opt_b_desc:'Introdueixo les dades d\'un familiar i després trio les seves classes.',
    opt_c:'Continuar inscripció', opt_c_desc:'He acabat d\'afegir alumnes.',
    alumnos_title:'Alumnes inscrits', alumnos_vacio:'Encara no hi ha alumnes inscrits.', alumnos_max:'Has arribat al màxim de 5 alumnes.',
    tipo_yo:'Alumne principal', tipo_fam:'Familiar', nac:'Naixement:',
    btn_editar_clases:'Editar classes', btn_editar_datos:'Editar dades', btn_eliminar:'Eliminar',
    label_clases:'Classes:', sin_clases:'sense classes seleccionades',
    modal_clases_title:'Selecciona les seves classes', modal_categoria:'Categoria:', modal_dias:'Dies:', modal_lista:'Marca les classes per a aquest alumne:',
    modal_cancelar:'Cancel·lar', modal_aceptar:'Acceptar', err_clases:'Selecciona com a mínim una classe.',
    modal_alumno_title:'Dades del familiar', btn_inscribir_alumno:'Inscriure alumne', btn_guardar:'Desar',
    p4_title:'Confirmació', p4_desc:'Revisa totes les dades abans de finalitzar la inscripció.',
    resumen_persona:'Les teves dades', resumen_alumnos:'Inscripcions', resumen_acciones:'Pots tornar amb «Enrere» per corregir qualsevol dada.',
    robot:'No sóc un robot', btn_inscribir:'Finalitzar inscripció', err_robot:'Marca la casella de verificació «No sóc un robot» per continuar.',
    done_title:'Inscripció enviada!', done_ok:'Rebrem la teva sol·licitud i et confirmarem per correu.',
    reopen_form:'Continuar amb la meva inscripció',
    submit_fail:'No s\'ha pogut enviar la inscripció. Torna-ho a intentar.'
  }
};
let lng = 'es';
function applyT() {
  const d = T[lng];
  document.querySelectorAll('[data-t]').forEach(el => { const k = el.getAttribute('data-t'); if (d[k]) el.textContent = d[k]; });
  document.querySelectorAll('[data-tph]').forEach(el => { const k = el.getAttribute('data-tph'); if (d[k]) el.placeholder = d[k]; });
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
}
function tt(k){ return T[lng][k] || k; }

/* ── HORARIO (catálogo de clases) ── */
const HORARIO_ES = [{"day":"Lunes","classes":[{"time":"09:30 – 10:30","activity":"Yoga","teacher":"Elisabet"},{"time":"10:30 – 11:30","activity":"Toning + Gap","teacher":"Gaby"},{"time":"15:30 – 16:30","activity":"Pilates","teacher":"Gaby"},{"time":"17:30 – 18:30","activity":"Danza 5-7"},{"time":"17:30 – 18:30","activity":"Danza 3-5"},{"time":"18:30 – 19:30","activity":"Danza 8-11"},{"time":"18:30 – 19:30","activity":"Bachata inicio","teacher":"Sara","pending":true},{"time":"19:30 – 20:30","activity":"Bachata inicio","teacher":"Sara","pending":true},{"time":"20:00 – 22:00","activity":"Salsa y bachata","teacher":"Por confirmar","pending":true},{"time":"20:30 – 21:30","activity":"Bachata básico","teacher":"Sara"},{"time":"21:30 – 22:30","activity":"Salsa","teacher":"Sara"}]},{"day":"Martes","classes":[{"time":"09:30 – 10:30","activity":"Pilates","teacher":"Gaby"},{"time":"10:30 – 11:30","activity":"Zumba","teacher":"Gaby"},{"time":"15:30 – 16:30","activity":"Zumba","teacher":"Gaby"},{"time":"17:30 – 18:30","activity":"Danzas urbanas +11","teacher":"Marina"},{"time":"18:00 – 19:00","activity":"Yogalates","teacher":"Elisabet"},{"time":"18:00 – 19:00","activity":"Flamenco peques","teacher":"Mónica"},{"time":"19:00 – 20:00","activity":"Flamenco nivel medio","teacher":"Mónica"},{"time":"20:00 – 21:00","activity":"Sevillanas perfeccionamiento","teacher":"Mónica"},{"time":"21:00 – 22:00","activity":"Sevillanas iniciación","teacher":"Mónica"}]},{"day":"Miércoles","classes":[{"time":"09:30 – 10:30","activity":"Yoga","teacher":"Elisabet"},{"time":"10:30 – 11:30","activity":"Toning + Gap","teacher":"Gaby"},{"time":"15:30 – 16:30","activity":"Pilates","teacher":"Gaby"},{"time":"17:30 – 18:30","activity":"Danza 5-7"},{"time":"17:30 – 18:30","activity":"Danza 3-5"},{"time":"18:30 – 19:30","activity":"Danza 8-11"},{"time":"18:30 – 19:30","activity":"Bachata parejas","teacher":"Sara Luna"},{"time":"19:30 – 20:30","activity":"Estilo chica (bachata/salsa alternando)","teacher":"Sara Luna"},{"time":"19:30 – 20:30","activity":"Estilo chico bachata","teacher":"Sara Luna"},{"time":"20:30 – 21:30","activity":"Estilo chica","teacher":"Sara"},{"time":"21:30 – 22:30","activity":"Bachata pre-avanzado","teacher":"Sara","pending":true}]},{"day":"Jueves","classes":[{"time":"09:30 – 10:30","activity":"Pilates","teacher":"Gaby"},{"time":"10:30 – 11:30","activity":"Zumba","teacher":"Gaby"},{"time":"15:30 – 16:30","activity":"Zumba","teacher":"Gaby"},{"time":"17:30 – 18:30","activity":"Danzas urbanas +11","teacher":"Marina"},{"time":"18:00 – 19:00","activity":"Yogalates","teacher":"Elisabet"},{"time":"18:00 – 19:00","activity":"Flamenco peques","teacher":"Mónica"},{"time":"19:00 – 20:00","activity":"Flamenco nivel medio","teacher":"Mónica"},{"time":"20:00 – 21:00","activity":"Flamenco iniciación","teacher":"Mónica"},{"time":"21:30 – 22:30","activity":"Bachata inicio","teacher":"Sara"}]},{"day":"Viernes","classes":[{"time":"09:30 – 10:30","activity":"Yoga","teacher":"Elisabet"},{"time":"19:30 – 21:00","activity":"Flamenco profesional","teacher":"Mónica"},{"time":"19:30 – 20:30","activity":"Bachata inicio","teacher":"Sara","pending":true}]}];

/* Categorías: títulos de los apartados de la web (Clases & Talleres) */
const CATS_ORDEN = ['Artes Plásticas', 'Música', 'Danza', 'Yoga · Pilates · Entrenamiento'];
const CATALOGO = [];
const CLAVE = {};
/* Clases del horario, cada una solo una vez (sin días ni horas) */
HORARIO_ES.forEach(d => d.classes.forEach(c => {
  if (CLAVE[c.activity]) return;
  const a = c.activity.toLowerCase();
  let cat = 'Otras';
  if (/(yoga|pilates|yogalates|toning|gap|entrenamiento)/.test(a)) cat = 'Yoga · Pilates · Entrenamiento';
  else if (/(danza|bachata|salsa|sevillanas|flamenco|zumba|broadway|urban|puntas|estilo)/.test(a)) cat = 'Danza';
  else if (/(canto|guitarra|percusi|bater|teclado|ukelele|bajo|coro)/.test(a)) cat = 'Música';
  else if (/(dibujo|pintura|acuarela|manualidades|manga|resina|collage)/.test(a)) cat = 'Artes Plásticas';
  CLAVE[c.activity] = 1;
  CATALOGO.push({ clase: c.activity, cat: cat });
}));
/* Clases de la web no presentes en el horario (dança: los puntos del apartado) */
[
  ['Dibujo a Lápiz','Artes Plásticas'],
  ['Pintura Acrílica y Acuarela','Artes Plásticas'],
  ['Manualidades Creativas','Artes Plásticas'],
  ['Manga & Ilustración','Artes Plásticas'],
  ['Canto','Música'],
  ['Cante Flamenco','Música'],
  ['Percusión & Batería','Música'],
  ['Guitarra & Más','Música'],
  ['Broadway','Danza'],
  ['Danza del Vientre','Danza'],
  ['Danzas Polinesias','Danza'],
  ['Bollywood','Danza'],
  ['Bailes Individuales','Danza'],
  ['Entrenamiento','Yoga · Pilates · Entrenamiento']
].forEach(x => {
  if (CLAVE[x[0]]) return;
  CLAVE[x[0]] = 1;
  CATALOGO.push({ clase: x[0], cat: x[1] });
});
const CATS = [];
CATS_ORDEN.forEach(cat => { if (CATALOGO.some(x => x.cat === cat)) CATS.push(cat); });

/* ── ESTADO ── */
const $ = id => document.getElementById(id);
let paso = 1;
let datos = {};
let tos = { leido: false, acuerdo: false };
let alumnos = [];   // { tipo:'yo'|'familiar', nombre, apellidos, fechaNac, clases:[{clase}] }
let selKeys = new Set();
let editandoIdx = -1;
let modalCat = null;
let alumnoModal = { nombre:'', apellidos:'', fechaNac:'' };
let editDatosIdx = -1;

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
    fechaNac: $('d-fechaNac').value, cp: $('d-cp').value.trim(),
    ciudad: $('d-ciudad').value.trim(), dni: $('d-dni').value.trim()
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
function renderAlumnos() {
  const list = $('alumnos-list');
  if (alumnos.length === 0) { list.innerHTML = '<p class="empty">'+tt('alumnos_vacio')+'</p>'; }
  else {
    list.innerHTML = '';
    alumnos.forEach((a, i) => {
      const card = document.createElement('div');
      card.className = 'alumno-card';
      const chips = a.clases.length ? a.clases.map(c => '<span class="chip">'+c.clase+'</span>').join('') : '<span class="chip none">'+tt('sin_clases')+'</span>';
      card.innerHTML =
        '<div class="alumno-head"><span class="alumno-name">'+a.nombre+' '+a.apellidos+'</span><span class="alumno-type">'+(a.tipo==='yo'?tt('tipo_yo'):tt('tipo_fam'))+'</span></div>'+
        '<div class="alumno-fn">'+tt('nac')+' '+a.fechaNac+'</div>'+
        '<div class="chips">'+chips+'</div>'+
        '<div class="alumno-actions">'+
          '<button class="mini" data-edc="'+i+'">'+tt('btn_editar_clases')+'</button>'+
          '<button class="mini" data-edd="'+i+'">'+tt('btn_editar_datos')+'</button>'+
          '<button class="mini danger" data-del="'+i+'">'+tt('btn_eliminar')+'</button>'+
        '</div>';
      list.appendChild(card);
    });
    list.querySelectorAll('[data-edc]').forEach(b => b.addEventListener('click', () => abrirModalClases(+b.dataset.edc)));
    list.querySelectorAll('[data-edd]').forEach(b => b.addEventListener('click', () => abrirModalAlumno(+b.dataset.edd)));
    list.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      alumnos.splice(+b.dataset.del, 1);
      renderAlumnos();
      renderOpciones();
    }));
  }
  renderOpciones();
}
function renderOpciones() {
  $('alumnos-max').style.display = alumnos.length >= 5 ? 'block' : 'none';
  $('opt-a').style.display = alumnos.length >= 5 ? 'none' : 'block';
  $('opt-b').style.display = alumnos.length >= 5 ? 'none' : 'block';
  $('opt-c').style.display = alumnos.length >= 1 ? 'block' : 'none';
  $('p3-next').disabled = alumnos.length === 0;
}

$('opt-a').addEventListener('click', () => {
  if (alumnos.length >= 5) return;
  alumnos.push({ tipo:'yo', nombre: datos.nombre, apellidos: datos.apellidos, fechaNac: datos.fechaNac, clases: [] });
  renderAlumnos();
  abrirModalClases(alumnos.length - 1);
});
$('opt-b').addEventListener('click', () => {
  if (alumnos.length >= 5) return;
  editDatosIdx = -1;
  abrirModalAlumno(-1);
});
$('opt-c').addEventListener('click', () => { if (alumnos.length>0) go(4); });
$('p3-prev').addEventListener('click', () => { $('err-p3').style.display='none'; go(2); });
$('p3-next').addEventListener('click', () => { if (alumnos.length>0) go(4); });

/* ── MODAL ALUMNO ── */
function abrirModalAlumno(idx) {
  editDatosIdx = idx;
  if (idx >= 0) {
    const a = alumnos[idx];
    $('a-nombre').value = a.nombre; $('a-apellidos').value = a.apellidos; $('a-fechaNac').value = a.fechaNac;
    $('malumno-title').textContent = tt('btn_editar_datos');
    $('a-aceptar').textContent = tt('btn_guardar');
  } else {
    $('a-nombre').value = ''; $('a-apellidos').value = ''; $('a-fechaNac').value = '';
    $('malumno-title').textContent = tt('modal_alumno_title');
    $('a-aceptar').textContent = tt('btn_inscribir_alumno');
  }
  $('err-malumno').style.display='none';
  $('malumno').classList.add('open');
}
$('a-cancelar').addEventListener('click', () => $('malumno').classList.remove('open'));
$('a-aceptar').addEventListener('click', () => {
  const nom = $('a-nombre').value.trim(), ap = $('a-apellidos').value.trim(), fn = $('a-fechaNac').value;
  if (!nom || !ap || !fn) { $('err-malumno').style.display='block'; return; }
  if (editDatosIdx >= 0) {
    const a = alumnos[editDatosIdx];
    a.nombre = nom; a.apellidos = ap; a.fechaNac = fn;
    $('malumno').classList.remove('open');
    renderAlumnos();
  } else {
    alumnos.push({ tipo:'familiar', nombre: nom, apellidos: ap, fechaNac: fn, clases: [] });
    $('malumno').classList.remove('open');
    renderAlumnos();
    abrirModalClases(alumnos.length - 1);
  }
});

/* ── MODAL CLASES ── */
function abrirModalClases(idx) {
  editandoIdx = idx;
  selKeys = new Set();
  (alumnos[idx].clases||[]).forEach(c => {
    const i = CATALOGO.findIndex(x => x.clase===c.clase);
    if (i>=0) selKeys.add(i);
  });
  modalCat = CATS[0];
  $('m-cats').innerHTML = '';
  CATS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'pill' + (c===modalCat ? ' on' : '');
    b.textContent = c;
    b.addEventListener('click', () => { modalCat = c; $('m-cats').querySelectorAll('.pill').forEach(x => x.classList.remove('on')); b.classList.add('on'); renderLista(); });
    $('m-cats').appendChild(b);
  });
  $('err-mclases').style.display='none';
  $('mclases').classList.add('open');
  renderLista();
}
function renderLista() {
  const list = $('m-list');
  list.innerHTML = '';
  const items = [];
  CATALOGO.forEach((c, i) => {
    if (c.cat !== modalCat) return;
    items.push({ i, c });
  });
  items.sort((a,b) => a.c.clase.localeCompare(b.c.clase));
  if (items.length === 0) { list.innerHTML = '<p class="empty">—</p>'; return; }
  items.forEach(({ i, c }) => {
    const row = document.createElement('label');
    row.className = 'lrow';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = selKeys.has(i);
    box.addEventListener('change', () => { if (box.checked) selKeys.add(i); else selKeys.delete(i); });
    const info = document.createElement('div');
    info.innerHTML = '<div class="tt">'+c.clase+'</div>';
    row.appendChild(box); row.appendChild(info);
    list.appendChild(row);
  });
}
$('m-cancelar').addEventListener('click', () => { if (alumnos[editandoIdx] && alumnos[editandoIdx].clases.length===0 && alumnos[editandoIdx].tipo==='familiar') alumnos.splice(editandoIdx,1); $('mclases').classList.remove('open'); renderAlumnos(); });
$('m-aceptar').addEventListener('click', () => {
  if (selKeys.size === 0) { $('err-mclases').style.display='block'; return; }
  const a = alumnos[editandoIdx];
  a.clases = [...selKeys].map(i => ({ clase: CATALOGO[i].clase }));
  $('mclases').classList.remove('open');
  renderAlumnos();
});

/* ── PASO 4 ── */
function renderResumen() {
  leerDatos();
  let hp = '';
  hp += kv('Nombre', datos.nombre + ' ' + datos.apellidos);
  hp += kv(tt('email'), datos.email);
  hp += kv(tt('telefono'), datos.telefono);
  hp += kv(tt('fechaNac'), datos.fechaNac);
  hp += kv(tt('cp')+' / '+tt('ciudad'), datos.cp + ' · ' + datos.ciudad);
  hp += kv(tt('dni'), datos.dni);
  $('res-persona').innerHTML = hp;

  let ha = '';
  if (alumnos.length === 0) ha = '<p class="empty">'+tt('alumnos_vacio')+'</p>';
  alumnos.forEach((a, i) => {
    ha += '<div class="kv"><span>'+(a.tipo==='yo'?tt('tipo_yo'):tt('tipo_fam'))+' · '+(i+1)+'</span><b>'+a.nombre+' '+a.apellidos+' ('+a.fechaNac+')</b></div>';
    a.clases.forEach(c => { ha += '<div class="kv"><span>'+tt('label_clases')+'</span><b>'+c.clase+'</b></div>'; });
  });
  $('res-alumnos').innerHTML = ha;
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

const GFORM = {
  base: 'https://docs.google.com/forms/d/e/1FAIpQLSfRRkrLXf1F7xE4avY4n5dUcsifQot8xVdAAkReC8jg1lP7fw/viewform?usp=pp_url',
  entries: {
    nombre: 'entry.240952209', apellidos: 'entry.1212354002', email: 'entry.1216231430',
    telefono: 'entry.1480325778', fechaNac: 'entry.1804051934', cp: 'entry.107514898',
    ciudad: 'entry.1979438284', dni: 'entry.1134366163',
    aceptaTos: 'entry.287404523', alumnos: 'entry.2097961158'
  }
};
let lastFormUrl = '';

function buildFormUrl() {
  leerDatos();
  const a = GFORM.entries;
  const lista = alumnos.map(x => {
    let s = '• ' + x.nombre + ' ' + x.apellidos + ' (Nac.: ' + x.fechaNac + ')';
    if (!x.clases.length) s += ' — ' + tt('sin_clases');
    x.clases.forEach(c => { s += '\n   · ' + c.clase; });
    return s;
  }).join('\n');
  const q = new URLSearchParams();
  q.set(a.nombre, datos.nombre);
  q.set(a.apellidos, datos.apellidos);
  q.set(a.email, datos.email);
  q.set(a.telefono, datos.telefono);
  q.set(a.fechaNac, datos.fechaNac);
  q.set(a.cp, datos.cp);
  q.set(a.ciudad, datos.ciudad);
  q.set(a.dni, datos.dni);
  q.set(a.aceptaTos, tos.acuerdo ? 'Sí' : 'No');
  q.set(a.alumnos, lista);
  return GFORM.base + '&' + q.toString();
}

/* ── ENVÍO ──
   Enviamos a nuestra propia función de Netlify. Esa función valida el token del
   captcha contra los servidores de Google y, solo si Google confirma que es legítimo,
   reenvía los datos a Make. La URL de Make ya no aparece en ningún sitio del navegador. */
function enviar() {
  $('p4-next').disabled = true;
  leerDatos();

  const payload = {
    /* Indica a la función qué webhook debe usar (inscripciones o alquiler) */
    tipoFormulario: 'inscripciones',
    lang: lng,
    nombre: datos.nombre, apellidos: datos.apellidos, email: datos.email,
    telefono: datos.telefono, fechaNac: datos.fechaNac, codigoPostal: datos.cp,
    ciudad: datos.ciudad, dni: datos.dni,
    aceptaTos: !!tos.acuerdo,
    captchaToken: (window.grecaptcha && grecaptcha.getResponse()) || '',
    alumnos: alumnos.map(x => {
      let s = '• ' + x.nombre + ' ' + x.apellidos + ' (Nac.: ' + x.fechaNac + ')';
      if (!x.clases.length) s += ' — ' + tt('sin_clases');
      x.clases.forEach(c => { s += '\n   · ' + c.clase; });
      return s;
    }).join('\n')
  };

  /* La ruta empieza por "/" así que se resuelve desde la raíz del dominio,
     sin importar que este archivo esté dentro de la carpeta js/ */
  fetch('/.netlify/functions/submit-formulario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json().catch(() => ({})))  // Si la respuesta no fuese JSON válido, no reventamos
    .then(data => {
      if (data && data.success) {
        terminar(tt('done_ok'), false);
      } else {
        /* Error controlado: reactivamos el botón y reiniciamos el captcha
           para que la persona pueda volver a intentarlo sin recargar la página */
        $('p4-next').disabled = false;
        if (window.grecaptcha) grecaptcha.reset();
        terminar(tt('submit_fail'), true);
      }
    })
    .catch(() => {
      /* Error de red o de conexión */
      $('p4-next').disabled = false;
      if (window.grecaptcha) grecaptcha.reset();
      terminar(tt('submit_fail'), true);
    });
}

/* ── PANTALLA FINAL ──
   Esta era la función que faltaba. Oculta el paso 4 y muestra el bloque "ok-box":
   si esError es true, pinta un aviso (⚠) con el mensaje de fallo; si es false,
   pinta la confirmación (✦) de que la inscripción se ha enviado correctamente. */
function terminar(msg, esError, title) {
  $('paso4').classList.remove('active');
  $('chip4').classList.remove('active');
  $('ok-box').style.display = 'block';
  const ico = document.querySelector('.ok .ico');
  const h3 = document.querySelector('.ok h3');
  const p = document.querySelector('.ok p');
  if (esError) {
    ico.textContent = '⚠';
    h3.textContent = title || msg;
    p.textContent = '';
  } else {
    ico.textContent = '✦';
    h3.textContent = title || tt('done_title');
    p.textContent = msg;
  }
}

$('ok-reopen').addEventListener('click', () => { if (lastFormUrl) window.open(lastFormUrl, '_blank'); });

/* ── LANG ── */
$('lb-es').addEventListener('click', () => { lng = 'es'; applyT(); $('lb-es').classList.add('active'); $('lb-ca').classList.remove('active'); document.documentElement.lang='es'; });
$('lb-ca').addEventListener('click', () => { lng = 'ca'; applyT(); $('lb-ca').classList.add('active'); $('lb-es').classList.remove('active'); document.documentElement.lang='ca'; });

applyT();