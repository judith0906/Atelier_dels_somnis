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