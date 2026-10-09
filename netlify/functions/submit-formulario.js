/* ============================================================
   submit-formulario.js — NETLIFY FUNCTION: recepción de formularios
   Atelier dels Somnis · Reus

   Punto único de entrada de los formularios del sitio. Su motivo de
   existir es de seguridad: valida el token de reCAPTCHA contra Google
   y solo entonces reenvía los datos al webhook de Make, de forma que
   la URL de Make nunca aparece en el código del navegador.

   El campo `tipoFormulario` del payload decide a qué webhook va
   ('inscripciones' o 'alquiler').

   Para 'alquiler' además bloqueamos el hueco en la tabla `reserva_sala`
   de Neon antes de reenviar a Make (ver bloquearReservaSala más abajo),
   así dos personas no pueden reservar el mismo horario a la vez.

   Variables de entorno necesarias en Netlify:
     RECAPTCHA_SECRET_KEY · DATABASE_URL · MAKE_WEBHOOK_* (ver el propio código)
   ============================================================ */

// Módulo 'https' nativo de Node.js. No hace falta instalar nada en package.json.
const https = require('https');
const { Pool } = require('pg');

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

/** 'HH:MM' -> minutos desde medianoche */
function minutosDesde(horaStr) {
  const [h, m] = String(horaStr).slice(0, 5).split(':').map(Number);
  return h * 60 + m;
}

/** ¿Se solapan la reserva pedida y una fila ya guardada? Misma lógica
    de intervalos que usa disponibilidad-sala.js. */
function solapan(fechaBase, horaInicio, horasTotales, fila) {
  const MIN_DIA = 24 * 60;
  const diffDias = Math.round((new Date(fila.fecha) - new Date(fechaBase)) / 86400000);
  const inicioFila = diffDias * MIN_DIA + minutosDesde(fila.hora_inicio);
  const finFila = inicioFila + Math.round(Number(fila.horas_totales) * 60);
  const inicioReq = minutosDesde(horaInicio);
  const finReq = inicioReq + Math.round(horasTotales * 60);
  return inicioFila < finReq && finFila > inicioReq;
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
 * Bloquea el hueco de la sala en Neon antes de reenviar a Make.
 * Usa un bloqueo consultivo (advisory lock) por fecha para que dos
 * peticiones simultáneas del mismo día se sirvan en orden, no a la vez.
 * La reserva se guarda como "pendiente_pago" con 30 minutos de margen:
 * si en ese tiempo no llega el pago de Stripe (todavía por conectar),
 * el hueco vuelve a quedar libre solo por caducar, sin borrar nada a mano.
 */
async function bloquearReservaSala(reserva) {
  const horasTotales =
  Number(reserva.paqueteHoras || 0) +
  Number(reserva.horasExtra || 0) +
  Number(reserva.horasExtraMadrugada || 0);
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [reserva.fecha]);

    const { rows } = await client.query(
      `SELECT fecha, hora_inicio, horas_totales FROM reserva_sala
       WHERE (estado = 'confirmada' OR (estado = 'pendiente_pago' AND expira_en > now()))
         AND fecha BETWEEN $1::date - INTERVAL '1 day' AND $1::date + INTERVAL '1 day'`,
      [reserva.fecha]
    );

    if (rows.some(r => solapan(reserva.fecha, reserva.inicio, horasTotales, r))) {
      await client.query('ROLLBACK');
      return { ok: false };
    }

    await client.query(
      `INSERT INTO reserva_sala (fecha, hora_inicio, horas_totales, evento, estado, expira_en)
       VALUES ($1, $2, $3, $4, 'pendiente_pago', now() + INTERVAL '30 minutes')`,
      [reserva.fecha, reserva.inicio, horasTotales, reserva.evento || null]
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

/**
 * Función auxiliar para hacer peticiones POST a servicios externos (Google y Make).
 * @param {string} url - Dirección de destino.
 * @param {object|string} data - Datos a enviar.
 * @param {boolean} isFormUrlEncoded - true para Google (formato formulario), false para Make (JSON).
 */
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

/**
 * Handler principal. Netlify lo ejecuta al recibir una petición
 * en /.netlify/functions/submit-formulario
 */
exports.handler = async (event) => {

  // 1. Solo aceptamos POST. Cualquier otro método se rechaza.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Método no permitido. Solo POST.' })
    };
  }

  try {
    // 2. Leemos lo que ha enviado el navegador.
    const payload = JSON.parse(event.body || '{}');

    /* El formulario de la web envía la clave "captchaToken".
       Aceptamos también "recaptchaToken" por si en el futuro cambia el nombre. */
    const { captchaToken, recaptchaToken, tipoFormulario, ...formData } = payload;
    const token = captchaToken || recaptchaToken;

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Falta el token de reCAPTCHA.' })
      };
    }

    // 3. Validamos el token contra los servidores de Google (servidor a servidor).
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      throw new Error('RECAPTCHA_SECRET_KEY no está definida en las variables de entorno de Netlify.');
    }

    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verifyParams =
      `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(token)}`;

    const captchaRes = await postData(verifyUrl, verifyParams, true);
    const captchaResult = JSON.parse(captchaRes.body || '{}');

    // Si Google dice que el token es falso, manipulado, reutilizado o ha caducado
    if (!captchaResult.success) {
      console.warn('reCAPTCHA rechazado por Google:', captchaResult['error-codes']);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Verificación de reCAPTCHA no válida o expirada.' })
      };
    }

    /* 4. Elegimos el webhook según el formulario de origen.
       Así esta misma función sirve para inscripciones y para alquiler. */
    let makeWebhookUrl = '';

    if (tipoFormulario === 'inscripciones') {
      makeWebhookUrl = process.env.MAKE_INSCRIPCIONES_WEBHOOK_URL;
    } else if (tipoFormulario === 'alquiler') {
      makeWebhookUrl = process.env.MAKE_ALQUILER_WEBHOOK_URL;
            if (!fechaReservaValida((formData.reserva || {}).fecha)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, message: 'Fecha de reserva no válida.' })
        };
      }

      // Bloqueamos el hueco en Neon antes de seguir. Si ya no está libre
      // (alguien se ha adelantado), avisamos con un 409 para que el
      // navegador mande a la persona de vuelta al paso 3.
      const bloqueo = await bloquearReservaSala(formData.reserva || {});
      if (!bloqueo.ok) {
        return {
          statusCode: 409,
          body: JSON.stringify({ success: false, conflicto: true, message: 'Ese horario ya no está disponible.' })
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Tipo de formulario no válido.' })
      };
    }

    if (!makeWebhookUrl) {
      throw new Error(`El webhook para "${tipoFormulario}" no está configurado en Netlify.`);
    }

    /* 5. Reenviamos los datos a Make.
       Fíjate en que "formData" ya NO incluye el token del captcha ni el tipoFormulario:
       los hemos separado arriba porque a Make no le hacen falta. */
    const makeRes = await postData(makeWebhookUrl, formData);

    /* Comprobamos de verdad que Make aceptó la petición.
       La versión anterior respondía "éxito" aunque Make devolviese un error,
       con lo que una inscripción podía perderse sin que nadie se enterase. */
    if (makeRes.statusCode < 200 || makeRes.statusCode >= 300) {
      console.error('Make rechazó la petición. Código:', makeRes.statusCode, 'Respuesta:', makeRes.body);
      return {
        statusCode: 502,
        body: JSON.stringify({ success: false, message: 'No se pudo registrar la solicitud. Inténtalo de nuevo.' })
      };
    }

    // 6. Todo correcto.
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Formulario verificado y enviado con éxito.' })
    };

  } catch (error) {
    /* Registramos el detalle en los logs de Netlify (solo tú los ves)
       pero al navegador le devolvemos un mensaje genérico, para no revelar
       información interna del servidor a posibles atacantes. */
    console.error('Error procesando la solicitud:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error interno del servidor al procesar la solicitud.' })
    };
  }
};