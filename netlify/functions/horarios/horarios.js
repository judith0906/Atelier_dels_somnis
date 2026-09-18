/* ============================================================
   horarios.js — NETLIFY FUNCTION: endpoint público del horario
   Atelier dels Somnis · Reus

   Responde a /api/horarios (redirección definida en netlify.toml)
   devolviendo las filas de la tabla `horario` de Neon en JSON.
   Lo consume la función loadHorarios() de js/main.js.

   El pool de conexiones se guarda en `pool` fuera del handler para
   reaprovecharlo entre invocaciones y no abrir una conexión nueva
   en cada visita.

   Debe existir la variable DATABASE_URL en las variables de entorno
   de Netlify; si falta, la función devuelve un 500 explicándolo.
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

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (!process.env.DATABASE_URL) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'DATABASE_URL no configurada en Netlify' })
    };
  }

  try {
    const { rows } = await getPool().query(
      'SELECT dia, horas, clase, profe, lang, pendiente FROM horario ORDER BY id'
    );
    return { statusCode: 200, headers, body: JSON.stringify(rows) };
  } catch (err) {
    console.error('Error consultando horario:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'No se pudo cargar el horario' })
    };
  }
};