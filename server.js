// Simple feedback API for Campus360
// Run: npm install && node server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'feedbacks.json');

app.use(cors());
app.use(express.json());

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify([]), { encoding: 'utf8' }); } catch (e) { console.error('Could not create data file:', e); }
}

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Demo users - in production use a database and hashed passwords
const demoUsers = [
  { id: 1, email: 'student@example.com', username: 'student1', password: 'student123', role: 'student' },
  { id: 2, email: 'faculty@example.com', username: 'faculty1', password: 'faculty123', role: 'faculty' }
];

// GET /api/user?email=...  (demo)
app.get('/api/user', (req, res) => {
  const email = String(req.query.email || '').toLowerCase();
  if (!email) return res.status(400).json({ error: 'email query required' });
  const user = demoUsers.find(u => u.email.toLowerCase() === email || u.username.toLowerCase() === email);
  if (!user) return res.status(404).json({ error: 'not found' });
  const { password, ...safe } = user;
  res.json({ user: safe });
});

// POST /api/login - simple demo authentication
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = demoUsers.find(u => (u.email === email || u.username === email) && u.password === password);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  // Optional: check role matches
  if (role && user.role !== role) return res.status(403).json({ error: 'role mismatch' });

  // Create a demo token (do NOT use this in production)
  const token = `demo-token-${user.id}-${Date.now()}`;

  // Return redirect target based on role
  const redirect = user.role === 'faculty' ? 'faculty-dashboard.html' : 'student-dashboard.html';

  return res.json({ success: true, token, redirect });
});

// POST /api/feedback
app.post('/api/feedback', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, message' });
  }

  const entry = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    receivedAt: new Date().toISOString()
  };

  // append to file (read -> push -> write). This is simple and acceptable for a small demo.
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8') || '[]';
    const arr = JSON.parse(raw);
    arr.push(entry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
    console.log('Saved feedback:', entry.id, entry.email);
    return res.json({ success: true, id: entry.id });
  } catch (err) {
    console.error('Failed to save feedback', err);
    return res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Serve static files (optional) so you can run API from repo root and serve static pages if desired
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Campus360 feedback API listening on http://localhost:${PORT}`);
});
