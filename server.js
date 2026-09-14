require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/api/horarios', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT dia, horas, clase, profe, lang, pendiente FROM "horario" ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error consultando horario:', err.message);
    res.status(500).json({ error: 'No se pudo cargar el horario' });
  }
});

// ── SEGURIDAD: bloquear el acceso a archivos que nunca deben verse desde el navegador ──
//  - Cualquier "dotfile" o carpeta oculta (empieza por "."), como .env o .git.
//  - Los mismos archivos de backend (server.js, package.json, etc).
app.use((req, res, next) => {
  const path = req.path;

  // Bloquea cualquier segmento de la ruta que empiece por "." (ej: /.env, /.git/config, /assets/.hidden)
  const hasDotfileSegment = path.split('/').some(segment => segment.startsWith('.') && segment !== '');
  if (hasDotfileSegment) {
    return res.status(404).end();
  }

  // Bloquea archivos y carpetas de backend que no forman parte del sitio público
  const blocked = ['/server.js', '/package.json', '/package-lock.json', '/node_modules'];
  if (blocked.some(p => path === p || path.startsWith(p + '/') || path.startsWith(p))) {
    return res.status(404).end();
  }

  next();
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Atelier dels Somnis en http://localhost:${PORT}`);
});