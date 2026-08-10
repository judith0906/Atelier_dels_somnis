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

app.use((req, res, next) => {
  const blocked = ['/server.js', '/package.json', '/package-lock.json', '/node_modules'];
  if (blocked.some(p => req.path === p || req.path.startsWith(p))) {
    return res.status(404).end();
  }
  next();
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Atelier dels Somnis en http://localhost:${PORT}`);
});
