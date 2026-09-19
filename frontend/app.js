// Served by the backend (http://localhost:5000)? use same-origin. Otherwise call the backend directly.
const API = window.CHETNA_API || (location.port === '5000' ? '/api' : 'http://localhost:5000/api');
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const MAX = { phq9: 27, gad7: 21, pss10: 40, who5: 100 };
const COLOR = { phq9: '#1f8a5b', gad7: '#7cb518', pss10: '#e8912d', who5: '#2f7fc1' };
const NAME = { phq9: 'PHQ-9', gad7: 'GAD-7', pss10: 'PSS-10', who5: 'WHO-5' };
const ICON = { phq9: ['☁️', '#e3f1ea'], gad7: ['🍃', '#e6f5d3'], pss10: ['⚡', '#fff0d9'], who5: ['☀️', '#fdf3c8'] };
const MOODS = ['😞', '😕', '😐', '🙂', '😊'];

const T = {
  en: {
    nav_tests: 'Tests', nav_journey: 'My journey',
    hero_h: 'Check in with yourself, one honest step at a time.',
    hero_p: 'CHETNA helps students and professionals reflect on their mental wellbeing through short, structured self-assessments. Awareness first, then compassion, then action.',
    cta: 'Start a check-in', chip1: 'About 2 minutes each', chip2: 'Private by design', chip3: 'Screening, not diagnosis',
    tests_h: 'Choose a check-in', qcount: '{n} questions', start: 'Start',
    vals_h: 'What we stand for',
    v1: 'Empathy', v1p: 'No judgement, ever. Every result is written to be kind.',
    v2: 'Transparency', v2p: 'We use standard, published scales and tell you how your data is used.',
    v3: 'Innovation', v3p: 'Small tools, like a guided breath, that make reflection easier.',
    back: 'Back', qof: 'Question {i} of {n}',
    sf_h: 'Before your result, one important thing',
    sf_p: 'You mentioned thoughts of harming yourself. Saying that takes courage. Please consider talking to someone right now. These lines are free and are there to listen:',
    sf_btn: 'Show my result', of: 'out of {m}',
    tips_h: 'Small steps that can help', breathe: 'Breathe with me', stop: 'Stop',
    cue: ['Breathe in', 'Hold', 'Breathe out slowly'],
    to_journey: 'View my journey', another: 'Take another check-in',
    saved: 'This result is saved to your journey.',
    disc: 'This is a screening tool, not a diagnosis. Please speak to a professional for advice.',
    auth_h: 'Log in to CHETNA', auth_p: 'Your check-ins are saved to your account, so you can come back later and see your past results in My journey.',
    auth_need: 'Please log in first to take a check-in.',
    name: 'Name', email: 'Email', pass: 'Password (min 8 characters)',
    login: 'Log in', register: 'Create account', to_reg: 'New here? Create an account', to_login: 'Have an account? Log in',
    mood_h: 'How is your mood right now?', mood_none: 'No mood logged yet. Pick one above.', mood_prev: 'Recent moods:',
    moods: ['Very low', 'Low', 'Okay', 'Good', 'Great'], mood_saved: 'Mood saved',
    hello: 'Hi {name}, here is your journey so far.', hist_p: 'Every check-in you take is saved here. Tap one to see the full result.',
    hist_none: 'No check-ins yet. Take your first one and it will show up here.',
    trend_h: 'Your trend', trend_empty: 'Take two or more check-ins to see your trend here.',
    chart_note: 'Share of the maximum score. For WHO-5, higher is better.', logout: 'Log out',
    err_server: 'Cannot reach the server ({api}). Start the backend, or open the app from http://localhost:5000 and refresh.',
    foot: 'CHETNA is a screening tool, not a diagnosis. Need to talk now? Tele-MANAS 14416 (24x7, free).',
    tips: [
      ['Keep your sleep and movement routine going.', 'Stay in touch with people you like.', 'Write down one good thing each day.'],
      ['Take short breaks between study or work blocks.', 'Talk to a friend, mentor or family member you trust.', 'Try 5 minutes of slow breathing daily.'],
      ['Please talk to a counsellor or doctor soon.', 'Tell one trusted person how you have been feeling.', 'Keep the basics steady: sleep, food, water, sunlight.'],
    ],
  },
  hi: {
    nav_tests: 'Tests', nav_journey: 'Meri journey',
    hero_h: 'Apne aap se check-in karo, ek honest kadam me.',
    hero_p: 'CHETNA students aur professionals ko chhote, structured self-assessments se apne mental wellbeing par sochne me madad karta hai. Pehle awareness, phir compassion, phir action.',
    cta: 'Check-in shuru karo', chip1: 'Har test lagbhag 2 minute', chip2: 'Privacy pehle', chip3: 'Screening hai, diagnosis nahi',
    tests_h: 'Ek check-in chuno', qcount: '{n} sawal', start: 'Shuru karo',
    vals_h: 'Hum kis par believe karte hain',
    v1: 'Empathy', v1p: 'Kabhi judgement nahi. Har result kindness ke saath likha gaya hai.',
    v2: 'Transparency', v2p: 'Hum standard, published scales use karte hain aur batate hain ki data kaise use hota hai.',
    v3: 'Innovation', v3p: 'Chhote tools, jaise guided breathing, jo reflection aasaan banate hain.',
    back: 'Peeche jao', qof: 'Sawal {i} / {n}',
    sf_h: 'Result se pehle ek zaroori baat',
    sf_p: 'Tumne khud ko nuksaan pahunchane ke khayalon ke baare me bataya. Ye batana himmat ka kaam hai. Abhi kisi se baat karna madad kar sakta hai. Ye lines free hain aur sunne ke liye hain:',
    sf_btn: 'Mera result dikhao', of: '{m} me se',
    tips_h: 'Chhote kadam jo madad kar sakte hain', breathe: 'Mere saath saans lo', stop: 'Ruko',
    cue: ['Saans andar lo', 'Roko', 'Dheere bahar chhodo'],
    to_journey: 'Meri journey dekho', another: 'Ek aur check-in karo',
    saved: 'Ye result tumhari journey me save ho gaya.',
    disc: 'Ye screening tool hai, diagnosis nahi. Sahi salah ke liye professional se baat karo.',
    auth_h: 'CHETNA me login karo', auth_p: 'Tumhare check-ins account me save hote hain, taaki baad me My journey me purane results dekh sako.',
    auth_need: 'Check-in dene se pehle please login karo.',
    name: 'Naam', email: 'Email', pass: 'Password (kam se kam 8 akshar)',
    login: 'Login karo', register: 'Account banao', to_reg: 'Naye ho? Account banao', to_login: 'Account hai? Login karo',
    mood_h: 'Abhi mood kaisa hai?', mood_none: 'Abhi tak koi mood log nahi hua. Upar se ek chuno.', mood_prev: 'Pichle mood:',
    moods: ['Bahut low', 'Low', 'Theek-thaak', 'Achha', 'Bahut achha'], mood_saved: 'Mood save ho gaya',
    hello: 'Hi {name}, ye hai ab tak ki tumhari journey.', hist_p: 'Tumhare har check-in yaha save hote hain. Poora result dekhne ke liye kisi par tap karo.',
    hist_none: 'Abhi tak koi check-in nahi hua. Pehla check-in karo, wo yaha dikhega.',
    trend_h: 'Tumhara trend', trend_empty: 'Do ya zyada check-in karne ke baad yaha trend dikhega.',
    chart_note: 'Maximum score ka hissa. WHO-5 me zyada score behtar hota hai.', logout: 'Logout',
    err_server: 'Server se connect nahi ho paa raha ({api}). Backend chalao, ya app ko http://localhost:5000 se kholo aur refresh karo.',
    foot: 'CHETNA screening tool hai, diagnosis nahi. Abhi baat karni hai? Tele-MANAS 14416 (24x7, free).',
    tips: [
      ['Neend aur movement ki routine banaye rakho.', 'Jin logon ko pasand karte ho unse jude raho.', 'Roz ek achhi baat likho.'],
      ['Padhai ya kaam ke beech chhote breaks lo.', 'Kisi trusted dost, mentor ya family member se baat karo.', 'Roz 5 minute dheeri saans lene ki practice karo.'],
      ['Please jaldi kisi counsellor ya doctor se baat karo.', 'Kisi ek trusted insaan ko batao ki kaisa feel ho raha hai.', 'Basics steady rakho: neend, khana, paani, dhoop.'],
    ],
  },
};

let lang = localStorage.getItem('chetna_lang') || 'en'; // English is the default
let token = localStorage.getItem('chetna_token');
let view = 'home', st = { tests: [] }, registerMode = false, toastTimer;

const t = (k, v = {}) => String(T[lang][k] ?? T.en[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x]);
const el = (tag, cls = '', text = '') => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };

async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

function toast(msg) {
  const x = $('#toast');
  x.textContent = msg;
  x.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => x.classList.remove('show'), 2600);
}

/* ---------- language ---------- */
function applyLang() {
  document.documentElement.lang = lang === 'hi' ? 'hi-Latn' : 'en';
  $$('[data-t]').forEach((e) => (e.textContent = t(e.dataset.t)));
  $$('[data-tp]').forEach((e) => (e.placeholder = t(e.dataset.tp)));
  $$('[data-lang]').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
  $('#breathe').textContent = st.breathT ? t('stop') : t('breathe');
  $('#fSubmit').textContent = t(registerMode ? 'register' : 'login');
  $('#fToggle').textContent = t(registerMode ? 'to_login' : 'to_reg');
  if (!$('#homeErr').hidden) $('#homeErr').textContent = t('err_server', { api: API });
  renderTests(); renderMoods();
  if (view === 'test') renderQ();
  if (view === 'safety') renderSafety();
  if (view === 'result') renderResult(false);
  if (view === 'journey') loadJourney();
}
$$('[data-lang]').forEach((b) => (b.onclick = () => { lang = b.dataset.lang; localStorage.setItem('chetna_lang', lang); applyLang(); }));

/* ---------- navigation ---------- */
function show(v) {
  stopBreathing();
  view = v;
  $$('.view').forEach((s) => (s.hidden = s.id !== 'v-' + v));
  window.scrollTo(0, 0);
  if (v === 'journey') loadJourney();
}
document.addEventListener('click', (e) => {
  const g = e.target.closest('[data-go]');
  if (g) { st.pending = null; show(g.dataset.go); }
  const s = e.target.closest('[data-scroll]');
  if (s) setTimeout(() => document.getElementById(s.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' }), 30);
});

/* ---------- home ---------- */
async function loadTests() {
  try { st.tests = await api('/assessments'); $('#homeErr').hidden = true; renderTests(); }
  catch (e) { console.error('CHETNA API error:', e); $('#homeErr').hidden = false; $('#homeErr').textContent = t('err_server', { api: API }); }
}
function renderTests() {
  const seen = $('#grid').children.length > 0;
  $('#grid').replaceChildren(...st.tests.map((a, n) => {
    const c = el('article', 'tcard rv' + (seen ? ' in' : '')), ic = el('div', 'ticon', ICON[a.type]?.[0] || '🧠');
    ic.style.background = ICON[a.type]?.[1] || '#eee';
    c.style.setProperty('--dl', n * 0.1 + 's');
    const b = el('button', 'btn', t('start'));
    b.onclick = () => startTest(a.type);
    c.append(ic, el('h3', '', a.title), el('p', '', a.about[lang]), el('p', 'meta', t('qcount', { n: a.questionCount })), b);
    return c;
  }));
  reveal();
}

/* ---------- test flow ---------- */
async function startTest(type) {
  if (!token) { st.pending = type; show('journey'); return; } // login first, then the test opens automatically
  try {
    st.a = await api('/assessments/' + type);
    Object.assign(st, { type, i: 0, ans: [], lock: false });
    show('test');
    renderQ();
  } catch (e) { toast(e.message); }
}
function renderQ() {
  const { a, i, ans } = st, n = a.q.en.length;
  $('#tname').textContent = a.title;
  $('#qcount').textContent = t('qof', { i: i + 1, n });
  $('#bar').style.width = (i / n) * 100 + '%';
  $('#qhint').textContent = a.intro[lang];
  const qe = $('#q');
  qe.textContent = a.q[lang][i];
  qe.classList.remove('swap'); void qe.offsetWidth; qe.classList.add('swap');
  $('#opts').replaceChildren(...a.opts.map((o, k) => {
    const b = el('button', 'opt' + (ans[i] === o.v ? ' on' : ''), o[lang]);
    b.style.setProperty('--i', k);
    b.onclick = () => pick(o.v);
    return b;
  }));
  $('#back').hidden = i === 0;
  st.lock = false;
}
function pick(v) {
  if (st.lock) return;
  st.lock = true;
  st.ans[st.i] = v;
  renderOpts();
  if (st.i < st.a.q.en.length - 1) { st.i++; setTimeout(renderQ, 260); } else finish();
}
function renderOpts() { $$('.opt').forEach((b, k) => b.classList.toggle('on', st.a.opts[k].v === st.ans[st.i])); }
$('#back').onclick = () => { if (st.i > 0) { st.i--; renderQ(); } };

async function finish() {
  $('#bar').style.width = '100%';
  try {
    st.res = await api(`/assessments/${st.type}/submit`, { method: 'POST', body: { answers: st.ans } });
    if (st.res.safety) { show('safety'); renderSafety(); } else { show('result'); renderResult(true); }
  } catch (e) { toast(e.message); st.lock = false; if (/token|login/i.test(e.message)) { logout(); show('journey'); } }
}

/* ---------- safety + result ---------- */
function renderLines(ul, lines) {
  ul.replaceChildren(...lines.map((h) => {
    const li = el('li', '', h.name), a = el('a', '', h.number);
    a.href = 'tel:' + h.number.replace(/-/g, '');
    li.append(a);
    return li;
  }));
}
function renderSafety() { renderLines($('#safetyLines'), st.res.helplines); }
$('#toResult').onclick = () => { show('result'); renderResult(true); };

function renderResult(animate) {
  const r = st.res, C = 326.7;
  $('#rname').textContent = st.a.title;
  countUp($('#sc'), r.score, animate);
  $('#sm').textContent = t('of', { m: r.maxScore });
  $('#rlabel').textContent = r.label;
  $('#rmsg').textContent = r.message[lang];
  $('#gauge').style.setProperty('--tone', r.load < 0.34 ? 'var(--pri)' : r.load < 0.67 ? 'var(--warn)' : 'var(--coral)');
  const off = C * (1 - r.score / r.maxScore);
  const arc = $('#arc');
  if (animate) { arc.style.strokeDashoffset = C; requestAnimationFrame(() => requestAnimationFrame(() => (arc.style.strokeDashoffset = off))); }
  else arc.style.strokeDashoffset = off;
  renderLines($('#rlines'), r.helplines);
  $('#tips').replaceChildren(...T[lang].tips[r.load < 0.34 ? 0 : r.load < 0.67 ? 1 : 2].map((x) => el('li', '', x)));
  $('#rsave').textContent = t('saved');
  if (animate && r.load < 0.34 && !r.safety && !r.past) celebrate();
}

/* guided breathing: 4 in, 3 hold, 6 out */
function stopBreathing() {
  clearTimeout(st.breathT);
  st.breathT = null;
  const o = $('#borb');
  o.style.removeProperty('--s');
  o.style.removeProperty('--d');
  $('#cue').textContent = '';
  $('#breathe').textContent = t('breathe');
}
$('#breathe').onclick = () => {
  if (st.breathT) return stopBreathing();
  $('#breathe').textContent = t('stop');
  const steps = [[4, 1.4], [3, 1.4], [6, 1]];
  let k = 0;
  (function loop() {
    const [sec, scale] = steps[k % 3];
    $('#cue').textContent = T[lang].cue[k % 3];
    $('#borb').style.setProperty('--d', sec + 's');
    $('#borb').style.setProperty('--s', scale);
    k++;
    st.breathT = setTimeout(loop, sec * 1000);
  })();
};

/* ---------- journey ---------- */
function setToken(res) {
  token = res.token;
  localStorage.setItem('chetna_token', token);
  localStorage.setItem('chetna_name', res.user?.name || '');
  const p = st.pending;
  st.pending = null;
  if (p) startTest(p); else loadJourney();
}
function logout() { token = null; localStorage.removeItem('chetna_token'); localStorage.removeItem('chetna_name'); loadJourney(); }
$('#logout').onclick = logout;
$('#fToggle').onclick = () => {
  registerMode = !registerMode;
  $('#fName').hidden = !registerMode;
  $('#fName').required = registerMode;
  applyLang();
};
$('#authForm').onsubmit = async (e) => {
  e.preventDefault();
  try {
    const body = { email: $('#fEmail').value, password: $('#fPass').value };
    if (registerMode) body.name = $('#fName').value;
    setToken(await api(registerMode ? '/auth/register' : '/auth/login', { method: 'POST', body }));
  } catch (err) { toast(err.message); }
};

function renderMoods() {
  $('#moods').replaceChildren(...MOODS.map((emoji, k) => {
    const b = el('button', '', emoji);
    b.title = b.ariaLabel = T[lang].moods[k];
    b.onclick = async () => {
      try { await api('/mood', { method: 'POST', body: { mood: k + 1 } }); toast(t('mood_saved')); loadJourney(); }
      catch (e) { toast(e.message); }
    };
    return b;
  }));
}

async function loadJourney() {
  $('#auth').hidden = !!token;
  $('#dash').hidden = !token;
  $('#authNote').hidden = !st.pending;
  if (!token) return;
  $('#hello').textContent = t('hello', { name: localStorage.getItem('chetna_name') || (lang === 'hi' ? 'dost' : 'there') });
  try {
    const [hist, moods] = await Promise.all([api('/results/history'), api('/mood')]);
    renderHistory(hist);
    drawChart([...hist].reverse());
    $('#moodLog').textContent = moods.length ? t('mood_prev') + ' ' + moods.slice(0, 14).reverse().map((m) => MOODS[m.mood - 1]).join(' ') : t('mood_none');
  } catch (e) { if (/token|login/i.test(e.message)) logout(); else toast(e.message); }
}

function renderHistory(hist) {
  const box = $('#hist');
  if (!hist.length) { box.replaceChildren(el('p', 'hint', t('hist_none'))); return; }
  box.replaceChildren(...hist.map((r, n) => {
    const b = el('button', 'hrow'), ic = el('span', 'hicon', ICON[r.type]?.[0] || '🧠');
    ic.style.background = ICON[r.type]?.[1] || '#eee';
    const mid = el('span', 'hmid'), end = el('span', 'hend');
    mid.append(el('b', '', r.title), el('small', '', new Date(r.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })));
    end.append(el('b', '', `${r.score}/${r.maxScore}`), el('em', 'chip tone' + (r.load < 0.34 ? 0 : r.load < 0.67 ? 1 : 2), r.label));
    b.style.setProperty('--i', Math.min(n, 10));
    b.append(ic, mid, end);
    b.onclick = () => openResult(r.id);
    return b;
  }));
}

async function openResult(id) {
  try {
    st.res = { ...(await api('/results/' + id)), past: true };
    st.a = { title: st.res.title };
    show('result');
    renderResult(true);
  } catch (e) { toast(e.message); }
}

function drawChart(h) {
  const box = $('#chart');
  if (h.length < 2) { box.textContent = t('trend_empty'); return; }
  const W = 600, H = 230, P = 38;
  const ts = h.map((r) => +new Date(r.created_at)), t0 = Math.min(...ts), span = Math.max(...ts) - t0 || 1;
  const X = (r) => P + ((+new Date(r.created_at) - t0) / span) * (W - P - 14);
  const Y = (r) => H - 24 - (r.score / MAX[r.type]) * (H - 48);
  const grid = [0, 0.5, 1].map((f) => { const y = H - 24 - f * (H - 48); return `<line x1="${P}" x2="${W - 8}" y1="${y}" y2="${y}" stroke="#dfe6ec"/><text x="0" y="${y + 4}" font-size="11" fill="#5b6b78">${f * 100}%</text>`; }).join('');
  const types = [...new Set(h.map((r) => r.type))];
  const series = types.map((k) => {
    const pts = h.filter((r) => r.type === k);
    const line = pts.length > 1 ? `<polyline fill="none" stroke="${COLOR[k]}" stroke-width="3" stroke-linejoin="round" points="${pts.map((r) => `${X(r).toFixed(1)},${Y(r).toFixed(1)}`).join(' ')}"/>` : '';
    return line + pts.map((r) => `<circle cx="${X(r).toFixed(1)}" cy="${Y(r).toFixed(1)}" r="5" fill="${COLOR[k]}"/>`).join('');
  }).join('');
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('trend_h')}">${grid}${series}</svg>
    <div class="legend">${types.map((k) => `<span><i style="background:${COLOR[k]}"></i>${NAME[k]}</span>`).join('')}</div>
    <p class="hint">${t('chart_note')}</p>`;
}

/* ---------- motion helpers ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15 });
function reveal() { $$('.rv:not(.in)').forEach((n) => io.observe(n)); }

function countUp(node, to, animate) {
  if (!animate) { node.textContent = to; return; }
  const t0 = performance.now();
  (function f(now) {
    const p = Math.min((now - t0) / 900, 1);
    node.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}

// a small burst of leaves when the result is on the lighter side
function celebrate() {
  const box = $('#gauge'), cols = ['#1f8a5b', '#7cb518', '#f5c542', '#63c48a'];
  for (let k = 0; k < 18; k++) {
    const p = el('i', 'spark');
    p.style.setProperty('--x', Math.random() * 200 - 100 + 'px');
    p.style.setProperty('--y', -(50 + Math.random() * 110) + 'px');
    p.style.setProperty('--c', cols[k % 4]);
    p.style.animationDelay = Math.random() * 0.35 + 's';
    box.append(p);
    setTimeout(() => p.remove(), 2000);
  }
}

loadTests();
applyLang();
reveal();
