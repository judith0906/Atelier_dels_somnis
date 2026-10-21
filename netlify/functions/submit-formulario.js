/* ============================================================
   submit-formulario.js — NETLIFY FUNCTION: recepción de formularios
   Atelier dels Somnis · Reus

   Punto único de entrada de los formularios del sitio. Valida el token
   de reCAPTCHA contra Google y después:

   - 'inscripciones': reenvía los datos al webhook de Make.
   - 'alquiler': recalcula el precio en el servidor, bloquea el hueco en
     la tabla `reserva_sala` de Neon (como "pendiente_pago") y crea una
     sesión de Stripe Checkout. La respuesta lleva la URL de pago. La
     reserva solo se envía a Make cuando Stripe confirma el pago
     (ver stripe-webhook.js).

   Variables de entorno necesarias en Netlify:
     RECAPTCHA_SECRET_KEY · DATABASE_URL · MAKE_INSCRIPCIONES_WEBHOOK_URL
     STRIPE_SECRET_KEY · SITE_URL
   ============================================================ */

const https = require('https');
const { randomUUID } = require('crypto');
const { Pool } = require('pg');
const Stripe = require('stripe');

let pool = null;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

let stripeClient = null;
function getStripe() {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY no está definida en las variables de entorno de Netlify.');
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

/* ── PRECIOS (en céntimos) ──
   reg = lo que se registra en Make · pvp = lo que paga el cliente.
   Deben coincidir con los de js/alquiler-sala.js. */
const PRECIOS = {
  paquete: { 5: { reg: 18000, pvp: 18280 }, 8: { reg: 35000, pvp: 35539 } },
  extraAntes: { reg: 3000, pvp: 3051 },
  extraMadrugada: { reg: 3500, pvp: 3559 },
  servicios: {
    limpieza: { reg: 4500, pvp: 4574 },
    hinchable: { reg: 16000, pvp: 16249 }
  }
};
const MAX_EXTRA_5H = 2;   // con el pack de 5h, máximo 2 horas extra en total
const MAX_EXTRA = 12;     // tope de cordura por campo de horas extra

const NOMBRES = {
  es: {
    paquete: h => 'Alquiler de sala · paquete ' + h + ' horas',
    extraAntes: 'Hora extra antes de las 00:00',
    extraMadrugada: 'Hora extra de madrugada (desde las 00:00)',
    limpieza: 'Extra limpieza',
    hinchable: 'Extra hinchable'
  },
  ca: {
    paquete: h => 'Lloguer de sala · paquet ' + h + ' hores',
    extraAntes: 'Hora extra abans de les 00:00',
    extraMadrugada: 'Hora extra de matinada (a partir de les 00:00)',
    limpieza: 'Extra neteja',
    hinchable: 'Extra inflable'
  }
};

/** Valida la reserva y calcula líneas de cobro (PVP) e importes registrados.
    Devuelve null si los datos no son válidos. */
function calcularReserva(reserva, lang) {
  const nombres = NOMBRES[lang === 'ca' ? 'ca' : 'es'];
  const horasPack = Number(reserva.paqueteHoras);
  const antes = Number(reserva.horasExtra || 0);
  const mad = Number(reserva.horasExtraMadrugada || 0);

  if (!PRECIOS.paquete[horasPack]) return null;
  const extraOk = n => Number.isInteger(n) && n >= 0 && n <= MAX_EXTRA;
  if (!extraOk(antes) || !extraOk(mad)) return null;
  if (horasPack === 5 && antes + mad > MAX_EXTRA_5H) return null;

  const pack = PRECIOS.paquete[horasPack];
  const lineas = [{ nombre: nombres.paquete(horasPack), cantidad: 1, pvp: pack.pvp }];
  if (antes) lineas.push({ nombre: nombres.extraAntes, cantidad: antes, pvp: PRECIOS.extraAntes.pvp });
  if (mad) lineas.push({ nombre: nombres.extraMadrugada, cantidad: mad, pvp: PRECIOS.extraMadrugada.pvp });

  const servicios = [];
  const marcados = {};
  for (const id of Object.keys(PRECIOS.servicios)) {
    marcados[id] = reserva[id] === true;
    if (marcados[id]) {
      servicios.push({ id, precio: PRECIOS.servicios[id].reg / 100 });
      lineas.push({ nombre: nombres[id], cantidad: 1, pvp: PRECIOS.servicios[id].pvp });
    }
  }

  const extras = (antes * PRECIOS.extraAntes.reg + mad * PRECIOS.extraMadrugada.reg) / 100;
  const totalServicios = servicios.reduce((s, x) => s + x.precio, 0);
  const totalAlquiler = pack.reg / 100 + extras + totalServicios;

  return {
    lineas,
    reserva: {
      evento: String(reserva.evento || '').slice(0, 60),
      paqueteHoras: horasPack,
      fecha: reserva.fecha,
      inicio: reserva.inicio,
      horasExtra: antes,
      horasExtraMadrugada: mad,
      hinchable: marcados.hinchable,
      limpieza: marcados.limpieza
    },
    importe: {
      base: pack.reg / 100,
      extras,
      extrasAntesMedianoche: (antes * PRECIOS.extraAntes.reg) / 100,
      extrasMadrugada: (mad * PRECIOS.extraMadrugada.reg) / 100,
      servicios,
      totalServicios,
      totalAlquiler,
      total: totalAlquiler
    }
  };
}

/* ── REGLAS DE DISPONIBILIDAD (mismas que disponibilidad-sala.js) ── */

/** 'HH:MM' -> minutos desde medianoche */
function minutosDesde(horaStr) {
  const [h, m] = String(horaStr).slice(0, 5).split(':').map(Number);
  return h * 60 + m;
}

const MANANA_FIN = 17 * 60;     // un evento de mañana acaba como tarde a las 17:00
const TARDE_INICIO = 18 * 60;   // un evento de tarde empieza a las 18:00 o después

/** Días entre dos fechas 'YYYY-MM-DD' (hasta - desde) */
function diasEntre(desde, hasta) {
  return Math.round((Date.parse(hasta + 'T00:00:00Z') - Date.parse(desde + 'T00:00:00Z')) / 86400000);
}

/** Tipo de evento según su horario (minutos desde las 00:00 de su día) */
function clasificar(inicio, fin) {
  if (fin <= MANANA_FIN) return 'manana';
  if (inicio >= TARDE_INICIO) return 'tarde';
  return 'dia';
}

/** ¿Se puede colocar la reserva pedida en esa fecha, dadas las reservas vivas?
    Sin choque de horas y respetando el cupo del día (1 mañana + 1 tarde,
    o 1 de todo el día). */
function hayHueco(vivas, fecha, inicioMin, duracionMin) {
  const MIN_DIA = 24 * 60;
  const reqIni = inicioMin;
  const reqFin = inicioMin + duracionMin;
  const tipoReq = clasificar(reqIni, reqFin);

  for (const r of vivas) {
    const iniFila = minutosDesde(r.hora_inicio);
    const durFila = Math.round(Number(r.horas_totales) * 60);

    const offset = diasEntre(fecha, r.fecha) * MIN_DIA;
    if (offset + iniFila < reqFin && offset + iniFila + durFila > reqIni) return false;

    if (r.fecha === fecha) {
      const tipoFila = clasificar(iniFila, iniFila + durFila);
      if (tipoFila === 'dia' || tipoReq === 'dia' || tipoFila === tipoReq) return false;
    }
  }
  return true;
}

/** Fecha de hoy en Madrid, formato 'YYYY-MM-DD' */
function fechaHoyMadrid() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());
}

/** Suma un año a una fecha 'YYYY-MM-DD' */
function sumarUnAnio(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y + 1, m - 1, d)).toISOString().slice(0, 10);
}

/** La fecha debe ser de hoy en adelante y como máximo dentro de 1 año */
function fechaReservaValida(fecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || '')) return false;
  const hoy = fechaHoyMadrid();
  return fecha >= hoy && fecha <= sumarUnAnio(hoy);
}

/**
 * Bloquea el hueco de la sala en Neon.
 * Usa un bloqueo consultivo (advisory lock) por fecha para que dos
 * peticiones simultáneas del mismo día se sirvan en orden, no a la vez.
 * La reserva se guarda como "pendiente_pago" durante 35 minutos. La sesión
 * de Stripe caduca a los 31, así que nadie puede coger el hueco mientras el
 * cliente todavía puede pagarlo. Guardamos aquí el payload que se enviará
 * a Make cuando Stripe confirme el pago.
 */
async function bloquearReservaSala(reserva, token, payload) {
  const horasTotales = reserva.paqueteHoras + reserva.horasExtra + reserva.horasExtraMadrugada;
  const duracionMin = Math.round(horasTotales * 60);
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [reserva.fecha]);

    const { rows } = await client.query(
      `SELECT to_char(fecha, 'YYYY-MM-DD') AS fecha, hora_inicio, horas_totales
       FROM reserva_sala
       WHERE (estado = 'confirmada' OR (estado = 'pendiente_pago' AND expira_en > now()))
         AND fecha BETWEEN $1::date - INTERVAL '1 day' AND $1::date + INTERVAL '1 day'`,
      [reserva.fecha]
    );

    if (!hayHueco(rows, reserva.fecha, minutosDesde(reserva.inicio), duracionMin)) {
      await client.query('ROLLBACK');
      return { ok: false };
    }

    await client.query(
      `INSERT INTO reserva_sala (fecha, hora_inicio, horas_totales, evento, estado, expira_en, token, payload)
       VALUES ($1, $2, $3, $4, 'pendiente_pago', now() + INTERVAL '35 minutes', $5, $6::jsonb)`,
      [reserva.fecha, reserva.inicio, horasTotales, reserva.evento || null, token, JSON.stringify(payload)]
    );
    await client.query('COMMIT');
    return { ok: true };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

/** Intenta cerrar una sesión de Stripe. Devuelve true si ya no se puede pagar. */
async function cerrarSesionStripe(stripe, sessionId) {
  try {
    await stripe.checkout.sessions.expire(sessionId);
    return true;
  } catch (e) {
    try {
      const s = await stripe.checkout.sessions.retrieve(sessionId);
      return s.status === 'expired';
    } catch (e2) {
      return false;
    }
  }
}

/** Si la misma persona vuelve a intentarlo (por ejemplo, tras cancelar en
    Stripe), libera su reserva pendiente anterior para que no se bloquee a
    sí misma. Solo se borra si Stripe confirma que esa sesión ya no se puede
    pagar; si se pagó, la fila se queda. */
async function liberarPendientesDelCliente(stripe, email) {
  const { rows } = await getPool().query(
    `SELECT token, stripe_session_id FROM reserva_sala
     WHERE estado = 'pendiente_pago' AND stripe_session_id IS NOT NULL
       AND lower(payload->'arrendatario'->>'email') = $1`,
    [email.toLowerCase()]
  );
  for (const r of rows) {
    if (await cerrarSesionStripe(stripe, r.stripe_session_id)) {
      await getPool().query(
        `DELETE FROM reserva_sala WHERE token = $1 AND estado = 'pendiente_pago'`,
        [r.token]
      );
    }
  }
}

/** Petición POST a servicios externos (Google y Make). */
function postData(url, data, isFormUrlEncoded = false) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postDataString = isFormUrlEncoded ? data : JSON.stringify(data);

    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': isFormUrlEncoded
          ? 'application/x-www-form-urlencoded'
          : 'application/json',
        'Content-Length': Buffer.byteLength(postDataString)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });

    req.on('error', (e) => reject(e));
    req.write(postDataString);
    req.end();
  });
}

const respuesta = (statusCode, cuerpo) => ({ statusCode, body: JSON.stringify(cuerpo) });

/** Formulario de alquiler: valida, bloquea el hueco y crea el pago en Stripe. */
async function procesarAlquiler(formData) {
  const { arrendatario = {}, reserva = {}, lang, aceptaTos } = formData;

  if (aceptaTos !== true) {
    return respuesta(400, { success: false, message: 'Hay que aceptar los términos y condiciones.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(arrendatario.email || '')) {
    return respuesta(400, { success: false, message: 'Correo electrónico no válido.' });
  }
  if (!fechaReservaValida(reserva.fecha) || !/^\d{2}:\d{2}$/.test(reserva.inicio || '')) {
    return respuesta(400, { success: false, message: 'Fecha u hora de reserva no válidas.' });
  }
  const calculo = calcularReserva(reserva, lang);
  if (!calculo) {
    return respuesta(400, { success: false, message: 'Datos de la reserva no válidos.' });
  }

  const siteUrl = (process.env.SITE_URL || process.env.URL || '').replace(/\/$/, '');
  if (!siteUrl) throw new Error('Falta SITE_URL en las variables de entorno de Netlify.');

  const arr = {};
  ['nombre', 'apellidos', 'email', 'telefono', 'dni', 'direccion', 'cp', 'ciudad']
    .forEach(k => { arr[k] = String(arrendatario[k] || '').slice(0, 200); });

  // Esto es lo que recibirá Make cuando se confirme el pago (con los precios registrados)
  const payloadMake = {
    lang: lang === 'ca' ? 'ca' : 'es',
    arrendatario: arr,
    reserva: calculo.reserva,
    importe: calculo.importe,
    aceptaTos: true
  };

  const stripe = getStripe();
  await liberarPendientesDelCliente(stripe, arr.email);

  const token = randomUUID();
  const bloqueo = await bloquearReservaSala(calculo.reserva, token, payloadMake);
  if (!bloqueo.ok) {
    return respuesta(409, { success: false, conflicto: true, message: 'Ese horario ya no está disponible.' });
  }

  let session = null;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: calculo.lineas.map(l => ({
        quantity: l.cantidad,
        price_data: {
          currency: 'eur',
          unit_amount: l.pvp,
          product_data: { name: l.nombre }
        }
      })),
      customer_email: arr.email,
      client_reference_id: token,
      locale: 'es',
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      success_url: siteUrl + '/alquiler-sala.html?pago=ok',
      cancel_url: siteUrl + '/alquiler-sala.html?pago=cancelado',
      payment_intent_data: {
        description: 'Reserva sala ' + calculo.reserva.fecha + ' ' + calculo.reserva.inicio,
        metadata: { token }
      },
      metadata: { token }
    });
    await getPool().query('UPDATE reserva_sala SET stripe_session_id = $1 WHERE token = $2', [session.id, token]);
  } catch (e) {
    console.error('Error creando la sesión de pago:', e);
    if (session) await stripe.checkout.sessions.expire(session.id).catch(() => {});
    await getPool().query('DELETE FROM reserva_sala WHERE token = $1', [token]).catch(() => {});
    return respuesta(502, { success: false, message: 'No se pudo iniciar el pago. Inténtalo de nuevo.' });
  }

  return respuesta(200, { success: true, url: session.url });
}

/**
 * Handler principal. Netlify lo ejecuta al recibir una petición
 * en /.netlify/functions/submit-formulario
 */
exports.handler = async (event) => {

  // 1. Solo aceptamos POST.
  if (event.httpMethod !== 'POST') {
    return respuesta(405, { success: false, message: 'Método no permitido. Solo POST.' });
  }

  try {
    // 2. Leemos lo que ha enviado el navegador.
    const payload = JSON.parse(event.body || '{}');
    const { captchaToken, recaptchaToken, tipoFormulario, ...formData } = payload;
    const token = captchaToken || recaptchaToken;

    if (!token) {
      return respuesta(400, { success: false, message: 'Falta el token de reCAPTCHA.' });
    }

    // 3. Validamos el token contra los servidores de Google.
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      throw new Error('RECAPTCHA_SECRET_KEY no está definida en las variables de entorno de Netlify.');
    }

    const verifyParams =
      `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(token)}`;
    const captchaRes = await postData('https://www.google.com/recaptcha/api/siteverify', verifyParams, true);
    const captchaResult = JSON.parse(captchaRes.body || '{}');

    if (!captchaResult.success) {
      console.warn('reCAPTCHA rechazado por Google:', captchaResult['error-codes']);
      return respuesta(400, { success: false, message: 'Verificación de reCAPTCHA no válida o expirada.' });
    }

    // 4. Alquiler: se cobra con Stripe y la reserva va a Make cuando se pague.
    if (tipoFormulario === 'alquiler') {
      return await procesarAlquiler(formData);
    }

    // 5. Inscripciones: se reenvían directamente a Make.
    if (tipoFormulario !== 'inscripciones') {
      return respuesta(400, { success: false, message: 'Tipo de formulario no válido.' });
    }

    const makeWebhookUrl = process.env.MAKE_INSCRIPCIONES_WEBHOOK_URL;
    if (!makeWebhookUrl) {
      throw new Error('El webhook para "inscripciones" no está configurado en Netlify.');
    }

    const makeRes = await postData(makeWebhookUrl, formData);
    if (makeRes.statusCode < 200 || makeRes.statusCode >= 300) {
      console.error('Make rechazó la petición. Código:', makeRes.statusCode, 'Respuesta:', makeRes.body);
      return respuesta(502, { success: false, message: 'No se pudo registrar la solicitud. Inténtalo de nuevo.' });
    }

    return respuesta(200, { success: true, message: 'Formulario verificado y enviado con éxito.' });

  } catch (error) {
    console.error('Error procesando la solicitud:', error);
    return respuesta(500, { success: false, message: 'Error interno del servidor al procesar la solicitud.' });
  }
};