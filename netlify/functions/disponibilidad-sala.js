/* ============================================================
   disponibilidad-sala.js — NETLIFY FUNCTION: disponibilidad de la sala
   Atelier dels Somnis · Reus

   Responde a /api/disponibilidad-sala?fecha=YYYY-MM-DD&inicio=HH:MM&horas=N
   (redirección definida en netlify.toml, igual que /api/horarios).

   Comprueba si el horario pedido choca con alguna reserva ya guardada
   en la tabla `reserva_sala` (confirmadas, o pendientes de pago que
   todavía no han caducado) y, si choca, devuelve los 5 huecos libres
   más cercanos a la hora pedida dentro del mismo día.

   Trabajamos en minutos desde las 00:00 del día consultado para poder
   comparar sin líos reservas que empiezan el día anterior y acaban
   entrada la fecha pedida, o que la propia reserva pedida se alargue
   de madrugada.

   Debe existir la variable DATABASE_URL en las variables de entorno
   de Netlify (la misma que usa horarios.js).
   ============================================================ */
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

const MIN_DIA = 24 * 60;
const VENTANA_DIAS = 2; // día pedido + margen, por si el hueco cae de madrugada

/** 'HH:MM' -> minutos desde medianoche */
function minutosDesde(horaStr) {
  const [h, m] = String(horaStr).slice(0, 5).split(':').map(Number);
  return h * 60 + m;
}

/** Convierte una reserva (su propia fecha + hora + duración) a un intervalo
    de minutos en el eje de la fecha consultada (fechaBase), para poder
    comparar reservas de días distintos sin líos. */
function aIntervalo(fechaBase, fechaFila, horaInicio, horasTotales) {
  const diffDias = Math.round((new Date(fechaFila) - new Date(fechaBase)) / 86400000);
  const inicio = diffDias * MIN_DIA + minutosDesde(horaInicio);
  const fin = inicio + Math.round(horasTotales * 60);
  return { inicio, fin };
}

/** minutos -> 'HH:MM' (admite pasarse de 24h = día siguiente) */
function aHora(minutos) {
  const m = ((minutos % MIN_DIA) + MIN_DIA) % MIN_DIA;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return String(h).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

  if (!process.env.DATABASE_URL) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'DATABASE_URL no configurada en Netlify' }) };
  }

  const { fecha, inicio, horas } = event.queryStringParameters || {};
  const horasTotales = parseFloat(horas);
  if (!fecha || !inicio || !horasTotales || horasTotales <= 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Faltan parámetros: fecha, inicio, horas' }) };
  }

  try {
    // Reservas "vivas" (confirmadas, o pendientes de pago sin caducar)
    // del día pedido, el anterior y el siguiente, por si alguna se solapa.
    const { rows } = await getPool().query(
      `SELECT fecha, hora_inicio, horas_totales
       FROM reserva_sala
       WHERE (estado = 'confirmada' OR (estado = 'pendiente_pago' AND expira_en > now()))
         AND fecha BETWEEN $1::date - INTERVAL '1 day' AND $1::date + INTERVAL '1 day'`,
      [fecha]
    );

    const ocupados = rows
      .map(r => aIntervalo(fecha, r.fecha, r.hora_inicio, Number(r.horas_totales)))
      .sort((a, b) => a.inicio - b.inicio);

    const reqInicio = minutosDesde(inicio);
    const reqFin = reqInicio + Math.round(horasTotales * 60);

    const hayChoque = ocupados.some(o => o.inicio < reqFin && o.fin > reqInicio);
    if (!hayChoque) {
      return { statusCode: 200, headers, body: JSON.stringify({ disponible: true }) };
    }

    // Huecos libres en la ventana (0h–48h) que quepan la duración pedida.
    const LIMITE = VENTANA_DIAS * MIN_DIA;
    const puntos = [0, ...ocupados.flatMap(o => [o.inicio, o.fin]), LIMITE].sort((a, b) => a - b);
    const duracionMin = Math.round(horasTotales * 60);
    const huecos = [];
    for (let i = 0; i < puntos.length - 1; i++) {
      const desde = puntos[i], hasta = puntos[i + 1];
      const ocupado = ocupados.some(o => o.inicio < hasta && o.fin > desde);
      if (!ocupado && hasta - desde >= duracionMin) huecos.push({ desde, hasta });
    }

    // De cada hueco, el punto de inicio más cercano a lo que pidió el cliente.
    const candidatos = huecos
      .map(h => {
        const ini = Math.min(Math.max(reqInicio, h.desde), h.hasta - duracionMin);
        return { inicio: ini, distancia: Math.abs(ini - reqInicio) };
      })
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, 5)
      .sort((a, b) => a.inicio - b.inicio);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ disponible: false, sugerencias: candidatos.map(c => aHora(c.inicio)) })
    };
  } catch (err) {
    console.error('Error consultando disponibilidad de sala:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'No se pudo comprobar la disponibilidad' }) };
  }
};