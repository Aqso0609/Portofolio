const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// API Komentar
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

// GET semua komentar
app.get('/api/comments', (req, res) => {
  fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json([]);
    try {
      const comments = JSON.parse(data);
      res.json(comments);
    } catch {
      res.json([]);
    }
  });
});

// POST komentar baru
app.post('/api/comments', (req, res) => {
  const { name, comment } = req.body;
  if (!name || !comment) return res.status(400).json({ error: 'Nama dan komentar wajib diisi.' });
  fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
    let comments = [];
    if (!err) {
      try { comments = JSON.parse(data); } catch {}
    }
    const newComment = {
      name,
      comment,
      created_at: new Date().toISOString()
    };
    comments.unshift(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), err2 => {
      if (err2) return res.status(500).json({ error: 'Gagal menyimpan komentar.' });
      res.json(newComment);
    });
  });
});

// DELETE komentar by index (admin only)
app.delete('/api/comments/:idx', (req, res) => {
  const idx = parseInt(req.params.idx);
  fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
    let comments = [];
    if (!err) {
      try { comments = JSON.parse(data); } catch {}
    }
    if (isNaN(idx) || idx < 0 || idx >= comments.length) {
      return res.status(400).json({ error: 'Invalid index' });
    }
    comments.splice(idx, 1);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), err2 => {
      if (err2) return res.status(500).json({ error: 'Gagal menghapus komentar.' });
      res.json({ success: true });
    });
  });
});

// Fallback: serve index.html for any unknown route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
