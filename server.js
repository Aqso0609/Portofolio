
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();


app.use(express.json());
app.use(express.static(__dirname));

// Koneksi ke Neon PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_lYZ3RIkK1CPj@ep-sparkling-wind-a1s2kny0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});


// GET semua komentar dari database
app.get('/api/comments', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, comment, created_at FROM comments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json([]);
  }
});


// POST komentar baru ke database
app.post('/api/comments', async (req, res) => {
  const { name, comment } = req.body;
  if (!name || !comment) return res.status(400).json({ error: 'Nama dan komentar wajib diisi.' });
  try {
    const result = await pool.query(
      'INSERT INTO comments (name, comment) VALUES ($1, $2) RETURNING name, comment, created_at',
      [name, comment]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menyimpan komentar.' });
  }
});


// DELETE komentar by id (admin only)
app.delete('/api/comments/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const result = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Komentar tidak ditemukan.' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus komentar.' });
  }
});

// Fallback: serve index.html for any unknown route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
