require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const { ASSESSMENTS, HELPLINES, scoreAssessment } = require('./assessments');

const app = express();
app.use(cors()); // dev: allow any origin (file://, Live Server, other ports). Restrict before deploying.
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chetna',
  waitForConnections: true,
  connectionLimit: 10,
});

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// auth(true) = login required, auth(false) = optional (guests can still take tests)
const auth = (required) => (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return required ? res.status(401).json({ error: 'Login required' }) : next();
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ---------- Auth ----------
app.post('/api/auth/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Name, email and password (min 8 chars) required' });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const [r] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email.toLowerCase(), hash]
    );
    res.status(201).json({ token: sign(r.insertId), user: { id: r.insertId, name } });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already registered' });
    throw e;
  }
}));

app.post('/api/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [String(email || '').toLowerCase()]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(password || '', u.password_hash))) {
    return res.status(401).json({ error: 'Wrong email or password' });
  }
  res.json({ token: sign(u.id), user: { id: u.id, name: u.name } });
}));

// Anonymous mode: no email/password, still gets history via token
app.post('/api/auth/anonymous', wrap(async (req, res) => {
  const [r] = await pool.query('INSERT INTO users (name, is_anonymous) VALUES (?, TRUE)', ['Guest']);
  res.status(201).json({ token: sign(r.insertId), user: { id: r.insertId, name: 'Guest' } });
}));

// ---------- Assessments ----------
app.get('/api/assessments', (req, res) => {
  res.json(Object.entries(ASSESSMENTS).map(([type, a]) => ({
    type, title: a.title, about: a.about, questionCount: a.q.en.length,
  })));
});

app.get('/api/assessments/:type', (req, res) => {
  const a = ASSESSMENTS[req.params.type.toLowerCase()];
  if (!a) return res.status(404).json({ error: 'Unknown assessment type' });
  const { bands, safetyItem, rev, mult, ...pub } = a; // don't leak scoring internals
  res.json({ type: req.params.type.toLowerCase(), ...pub });
});

app.post('/api/assessments/:type/submit', auth(true), wrap(async (req, res) => {
  const result = scoreAssessment(req.params.type, req.body.answers);
  if (result.error) return res.status(400).json({ error: result.error });

  let saved = false;
  if (req.userId) {
    await pool.query(
      'INSERT INTO responses (user_id, type, answers, score, severity, safety_flag) VALUES (?, ?, ?, ?, ?, ?)',
      [req.userId, result.type, JSON.stringify(result.answers), result.score, result.severity, result.safety]
    );
    saved = true;
  }
  res.json({ ...result, saved });
}));

// Past results: rescored from the saved answers, so labels and messages always match the current scoring rules
const parse = (x) => (typeof x === 'string' ? JSON.parse(x) : x);
const summarize = (r) => ({ ...scoreAssessment(r.type, parse(r.answers)), id: r.id, title: ASSESSMENTS[r.type].title, created_at: r.created_at });

app.get('/api/results/history', auth(true), wrap(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, type, answers, created_at FROM responses WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
    [req.userId]
  );
  res.json(rows.filter((r) => ASSESSMENTS[r.type]).map(summarize).filter((x) => !x.error)
    .map(({ answers, message, helplines, ...lite }) => lite));
}));

app.get('/api/results/:id(\\d+)', auth(true), wrap(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, type, answers, created_at FROM responses WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId]
  );
  const out = rows[0] && ASSESSMENTS[rows[0].type] ? summarize(rows[0]) : null;
  if (!out || out.error) return res.status(404).json({ error: 'Result not found' });
  res.json({ ...out, saved: true });
}));

// ---------- Mood check-in ----------
app.post('/api/mood', auth(true), wrap(async (req, res) => {
  const { mood, note } = req.body;
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    return res.status(400).json({ error: 'mood must be an integer 1-5' });
  }
  await pool.query('INSERT INTO mood_logs (user_id, mood, note) VALUES (?, ?, ?)',
    [req.userId, mood, (note || '').slice(0, 500)]);
  res.status(201).json({ ok: true });
}));

app.get('/api/mood', auth(true), wrap(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, mood, note, created_at FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 60',
    [req.userId]
  );
  res.json(rows);
}));

app.get('/api/health', async (req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true, db: true }); }
  catch (e) { res.status(500).json({ ok: false, db: false, error: e.code || e.message }); }
});

app.get('/api/helplines', (req, res) => res.json(HELPLINES));

// Serve the frontend from the same server, so http://localhost:5000 just works (no CORS involved)
const FRONT = process.env.FRONTEND_DIR || path.join(__dirname, '..', '..', 'chetna-frontend');
if (fs.existsSync(FRONT)) app.use(express.static(FRONT));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`CHETNA API running on :${port}`);
  console.log(fs.existsSync(FRONT) ? `Open the app: http://localhost:${port}` : `Frontend folder not found at ${FRONT} (set FRONTEND_DIR in .env)`);
  if (!process.env.JWT_SECRET) console.warn('WARNING: JWT_SECRET missing in .env, login and guest mode will fail');
  pool.query('SELECT 1').then(() => console.log('MySQL connected'))
    .catch((e) => console.error('MySQL NOT connected:', e.code || e.message, '(check DB_* in .env and run schema.sql)'));
});
