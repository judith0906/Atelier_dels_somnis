/* ============================================================
   disponibilidad-sala.js — NETLIFY FUNCTION: disponibilidad de la sala
   Atelier dels Somnis · Reus

   Responde a /api/disponibilidad-sala?fecha=YYYY-MM-DD&inicio=HH:MM&horas=N
   (redirección definida en netlify.toml, igual que /api/horarios).

   Reglas de la sala:
   - Un evento de MAÑANA acaba como tarde a las 17:00.
   - Un evento de TARDE empieza a las 18:00 o después.
   - Cualquier otro (toca la franja 17:00-18:00) es de TODO EL DÍA.
   - Cada día admite 1 evento de mañana y 1 de tarde, o 1 de todo el
     día en solitario. Además, nunca pueden solaparse en horas (eso
     incluye reservas que cruzan la medianoche).

   Si el hueco pedido no está libre, devuelve las 5 fechas libres más
   cercanas con el mismo horario y la misma duración (de hoy a 1 año).

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
const MANANA_FIN = 17 * 60;     // un evento de mañana acaba como tarde a las 17:00
const TARDE_INICIO = 18 * 60;   // un evento de tarde empieza a las 18:00 o después
const MAX_SUGERENCIAS = 5;

/** 'HH:MM' -> minutos desde medianoche */
function minutosDesde(horaStr) {
  const [h, m] = String(horaStr).slice(0, 5).split(':').map(Number);
  return h * 60 + m;
}

/** Días entre dos fechas 'YYYY-MM-DD' (hasta - desde) */
function diasEntre(desde, hasta) {
  return Math.round((Date.parse(hasta + 'T00:00:00Z') - Date.parse(desde + 'T00:00:00Z')) / 86400000);
}

/** Suma n días (puede ser negativo) a una fecha 'YYYY-MM-DD' */
function sumarDias(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
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

/** Tipo de evento según su horario (minutos desde las 00:00 de su día) */
function clasificar(inicio, fin) {
  if (fin <= MANANA_FIN) return 'manana';
  if (inicio >= TARDE_INICIO) return 'tarde';
  return 'dia';
}

/** ¿Se puede colocar la reserva pedida en esa fecha, dadas las reservas vivas?
    `vivas` son filas con fecha 'YYYY-MM-DD', hora_inicio y horas_totales. */
function hayHueco(vivas, fecha, inicioMin, duracionMin) {
  const reqIni = inicioMin;
  const reqFin = inicioMin + duracionMin;
  const tipoReq = clasificar(reqIni, reqFin);

  for (const r of vivas) {
    const iniFila = minutosDesde(r.hora_inicio);
    const durFila = Math.round(Number(r.horas_totales) * 60);

    // 1) Choque de horas (incluye reservas de días contiguos que cruzan la medianoche)
    const offset = diasEntre(fecha, r.fecha) * MIN_DIA;
    if (offset + iniFila < reqFin && offset + iniFila + durFila > reqIni) return false;

    // 2) Cupo del día: solo cuentan las reservas de esa misma fecha
    if (r.fecha === fecha) {
      const tipoFila = clasificar(iniFila, iniFila + durFila);
      if (tipoFila === 'dia' || tipoReq === 'dia' || tipoFila === tipoReq) return false;
    }
  }
  return true;
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
  const fechaOk = /^\d{4}-\d{2}-\d{2}$/.test(fecha || '') && !Number.isNaN(Date.parse(fecha + 'T00:00:00Z'));
  const inicioOk = /^\d{2}:\d{2}$/.test(inicio || '');
  if (!fechaOk || !inicioOk || !horasTotales || horasTotales <= 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Faltan parámetros: fecha, inicio, horas' }) };
  }

  const hoy = fechaHoyMadrid();
  const max = sumarUnAnio(hoy);
  if (fecha < hoy || fecha > max) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Fecha fuera del rango permitido' }) };
  }

  try {
    // Reservas "vivas" (confirmadas, o pendientes de pago sin caducar) de todo
    // el rango reservable, para poder buscar también fechas alternativas.
    const { rows } = await getPool().query(
      `SELECT to_char(fecha, 'YYYY-MM-DD') AS fecha, hora_inicio, horas_totales
       FROM reserva_sala
       WHERE (estado = 'confirmada' OR (estado = 'pendiente_pago' AND expira_en > now()))
         AND fecha BETWEEN $1::date AND $2::date`,
      [sumarDias(hoy, -1), sumarDias(max, 1)]
    );

    const inicioMin = minutosDesde(inicio);
    const duracionMin = Math.round(horasTotales * 60);

    if (hayHueco(rows, fecha, inicioMin, duracionMin)) {
      return { statusCode: 200, headers, body: JSON.stringify({ disponible: true }) };
    }

    // Fechas libres más cercanas (hacia atrás y hacia delante), mismo horario y duración.
    const sugerencias = [];
    const maxDias = diasEntre(hoy, max);
    for (let k = 1; k <= maxDias && sugerencias.length < MAX_SUGERENCIAS; k++) {
      for (const f of [sumarDias(fecha, -k), sumarDias(fecha, k)]) {
        if (f < hoy || f > max) continue;
        if (sugerencias.length < MAX_SUGERENCIAS && hayHueco(rows, f, inicioMin, duracionMin)) sugerencias.push(f);
      }
    }
    sugerencias.sort();

    return { statusCode: 200, headers, body: JSON.stringify({ disponible: false, sugerencias }) };
  } catch (err) {
    console.error('Error consultando disponibilidad de sala:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'No se pudo comprobar la disponibilidad' }) };
  }
};