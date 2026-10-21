/* ============================================================
   stripe-webhook.js — NETLIFY FUNCTION: avisos de Stripe
   Atelier dels Somnis · Reus

   Stripe llama aquí cuando un pago de Checkout se completa. La función:
   1. Comprueba la firma (así nadie puede inventarse un pago).
   2. Marca la reserva como "confirmada" en Neon.
   3. Envía la reserva a Make (una sola vez, aunque Stripe repita el aviso).

   Si algo falla, responde 500 y Stripe vuelve a intentarlo durante horas.

   Variables de entorno: STRIPE_SECRET_KEY · STRIPE_WEBHOOK_SECRET
                         DATABASE_URL · MAKE_ALQUILER_WEBHOOK_URL
   ============================================================ */
const https = require('https');
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

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const body = JSON.stringify(data);
    const req = https.request({
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let respuesta = '';
      res.on('data', (chunk) => respuesta += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: respuesta }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function confirmarReserva(sesion) {
  const token = sesion.client_reference_id;
  if (!token) {
    console.error('Sesión de Stripe sin client_reference_id:', sesion.id);
    return;
  }

  const client = await getPool().connect();
  let fila;
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'SELECT payload, make_enviado FROM reserva_sala WHERE token = $1 FOR UPDATE',
      [token]
    );
    if (!rows.length) {
      await client.query('ROLLBACK');
      console.error('PAGO SIN RESERVA. Sesión:', sesion.id, 'PaymentIntent:', sesion.payment_intent, '→ hay que devolver el importe desde Stripe.');
      return;
    }
    fila = rows[0];
    await client.query(
      `UPDATE reserva_sala SET estado = 'confirmada', stripe_session_id = $2 WHERE token = $1`,
      [token, sesion.id]
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }

  if (fila.make_enviado) return;   // Stripe repitió el aviso: ya está enviada

  const makeUrl = process.env.MAKE_ALQUILER_WEBHOOK_URL;
  if (!makeUrl) throw new Error('MAKE_ALQUILER_WEBHOOK_URL no está definida en Netlify.');

  const res = await postJson(makeUrl, {
    ...fila.payload,
    pago: {
      conectado: true,
      observacion: 'Pagado con Stripe',
      metodo: 'stripe',
      stripeSessionId: sesion.id,
      paymentIntent: sesion.payment_intent
    }
  });
  if (res.statusCode < 200 || res.statusCode >= 300) {
    throw new Error('Make rechazó la reserva. Código ' + res.statusCode + ': ' + res.body);
  }

  await getPool().query('UPDATE reserva_sala SET make_enviado = true WHERE token = $1', [token]);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Método no permitido' };

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Faltan STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET en Netlify.');
    return { statusCode: 500, body: 'Configuración incompleta' };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const firma = event.headers['stripe-signature'];
  const cuerpo = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;

  let evento;
  try {
    evento = stripe.webhooks.constructEvent(cuerpo, firma, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.warn('Firma de Stripe no válida:', e.message);
    return { statusCode: 400, body: 'Firma no válida' };
  }

  if (evento.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: 'Evento ignorado' };
  }

  const sesion = evento.data.object;
  if (sesion.payment_status !== 'paid') {
    return { statusCode: 200, body: 'Pago no completado' };
  }

  try {
    await confirmarReserva(sesion);
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    console.error('Error confirmando la reserva:', e);
    return { statusCode: 500, body: 'Error' };   // Stripe reintentará
  }
};