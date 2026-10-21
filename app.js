'use strict';
(function () {
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const L = VERSES.length;
const VMAP = Object.fromEntries(VERSES.map(v => [v[0], v[1]]));
const KEY = 'crosswords.v1';

// ---------- Saved progress ----------
function defaults() { return { unlocked: 1, levels: {}, collection: {}, favorites: [], daily: {}, stats: { guessRight: 0, guessTotal: 0, noHint: 0, swift: 0, seer: 0, bestStreak: 0 }, ach: [], settings: { sound: true } }; }
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const d = defaults(), o = JSON.parse(raw); return Object.assign(d, o, { stats: Object.assign(d.stats, o.stats || {}), settings: Object.assign(d.settings, o.settings || {}) }); } } catch (e) {}
  return defaults();
}
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

const dayKey = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
function streak() { const d = new Date(); if (!S.daily[dayKey(d)]) d.setDate(d.getDate() - 1); let n = 0; while (S.daily[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); } return n; }
const fmt = s => { s = Math.floor(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const totalScore = () => Object.values(S.levels).reduce((a, l) => a + (l.best || 0), 0) + Object.values(S.daily).reduce((a, b) => a + b, 0);
const completed = () => Object.keys(S.levels).length;
const collected = () => Object.keys(S.collection).length;

// ---------- Awards ----------
const ACH = [
  ['first', 'First light', 'Complete your first level', () => completed() >= 1],
  ['ten', 'Ten talents', 'Complete 10 levels', () => completed() >= 10],
  ['fifty', 'Fiftyfold', 'Complete 50 levels', () => completed() >= 50],
  ['hundred', 'Hundredfold', 'Complete 100 levels', () => completed() >= 100],
  ['all', 'The whole counsel', 'Collect every verse', () => collected() >= L],
  ['swift', 'Swift as eagles', 'Finish a level in under 60 seconds', () => S.stats.swift >= 1],
  ['prophet', 'A discerning heart', 'Guess 10 verses before they’re revealed', () => S.stats.guessRight >= 10],
  ['seer', 'Before they call', 'Guess a verse with three quarters still hidden', () => S.stats.seer >= 1],
  ['nohint', 'Hid in my heart', 'Finish 25 levels without hints', () => S.stats.noHint >= 25],
  ['stars', 'Morning stars', 'Earn three stars on 25 levels', () => Object.values(S.levels).filter(l => l.stars === 3).length >= 25],
  ['streak7', 'Seven days', 'Play the daily verse 7 days in a row', () => S.stats.bestStreak >= 7],
  ['streak30', 'Daily bread', 'Play the daily verse 30 days in a row', () => S.stats.bestStreak >= 30],
  ['psalms', 'Psalmist', 'Collect 25 verses from Psalms', () => Object.keys(S.collection).filter(r => r.startsWith('Psalm ')).length >= 25],
  ['proverbs', 'Virtuous woman', 'Collect every verse from Proverbs 31', () => VERSES.filter(v => v[0].startsWith('Proverbs 31')).every(v => S.collection[v[0]])],
];
function checkAch() { const got = []; ACH.forEach(a => { if (!S.ach.includes(a[0]) && a[3]()) { S.ach.push(a[0]); got.push(a); } }); return got; }

// ---------- Sound ----------
let actx;
function tone(freqs, dur = 0.12, gap = 0.07, type = 'sine') {
  if (!S.settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime + i * gap;
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.25);
      o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + 0.3);
    });
  } catch (e) {}
}

// ---------- Toast ----------
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); }

// ---------- Copy, share, save ----------
const verseText = ref => `“${VMAP[ref]}”\n— ${ref} (KJV)`;
function shareFooter() { return 'Unlocked in Cross-Words' + (/^https?:/.test(location.protocol) ? '\n' + location.origin + location.pathname : ''); }
async function copyText(t, msg) {
  try { await navigator.clipboard.writeText(t); toast(msg); }
  catch (e) {
    const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast(msg); } catch (_) { toast('Copy failed. Press and hold the verse to copy it.'); }
    ta.remove();
  }
}
const copyVerse = ref => copyText(verseText(ref), 'Verse copied');
async function shareVerse(ref) {
  const text = verseText(ref) + '\n\n' + shareFooter();
  if (navigator.share) { try { await navigator.share({ title: ref, text }); } catch (e) {} }
  else copyText(text, 'Copied, ready to paste and share');
}
function toggleFav(ref) { const i = S.favorites.indexOf(ref); if (i >= 0) S.favorites.splice(i, 1); else S.favorites.push(ref); save(); return i < 0; }

// ---------- Navigation ----------
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  if (id === 'home') renderHome();
  if (id === 'levels') renderLevels();
  if (id === 'verses') renderVerses();
  if (id === 'stats') renderStats();
}

function renderHome() {
  $('#playSub').textContent = `Level ${S.unlocked}`;
  const today = S.daily[dayKey()], st = streak();
  $('#dailySub').textContent = (today ? `Done today, ${today.toLocaleString()} pts` : 'A new verse awaits') + (st ? `. ${st}-day streak` : '');
  $('#levelsSub').textContent = `${completed()} completed`;
  $('#versesSub').textContent = `${collected()} of ${L}`;
  $('#statsSub').textContent = `${totalScore().toLocaleString()} pts`;
  const last = Object.entries(S.collection).sort((a, b) => b[1].ts - a[1].ts)[0];
  const box = $('#lastVerse');
  if (last && VMAP[last[0]]) { box.hidden = false; box.querySelector('blockquote').textContent = `“${VMAP[last[0]]}”`; box.querySelector('figcaption').textContent = last[0]; }
  else box.hidden = true;
}

function renderLevels() {
  const max = Math.max(L, Math.ceil((S.unlocked + 6) / 10) * 10);
  let h = '';
  for (let n = 1; n <= max; n++) {
    const r = S.levels[n], locked = n > S.unlocked;
    h += `<button class="lv${r ? ' done' : ''}${n === S.unlocked ? ' cur' : ''}" data-lv="${n}"${locked ? ' disabled' : ''} aria-label="Level ${n}${r ? ', ' + r.stars + ' stars' : locked ? ', locked' : ''}"><span>${n}</span><i>${r ? '★'.repeat(r.stars) : ''}</i></button>`;
    if (n === L) h += `<p class="endless">Endless rounds begin after level ${L}. Every verse returns with a bigger puzzle and no starter letters.</p>`;
  }
  $('#lvGrid').innerHTML = h;
  const cur = $('#lvGrid .cur'); if (cur) cur.scrollIntoView({ block: 'center' });
}

let vFilter = 'all';
function renderVerses() {
  const q = $('#vSearch').value.trim().toLowerCase();
  const items = Object.entries(S.collection).map(([ref, c]) => ({ ref, ...c, text: VMAP[ref] }))
    .filter(x => x.text && (vFilter === 'all' || S.favorites.includes(x.ref)) && (!q || (x.ref + ' ' + x.text).toLowerCase().includes(q)))
    .sort((a, b) => b.ts - a.ts);
  if (!items.length) {
    $('#vList').innerHTML = `<p class="empty">${!collected() ? 'Finish a level to collect your first verse.' : vFilter === 'fav' && !q ? 'Tap Save on any verse to keep it here.' : 'No verses match that search.'}</p>`;
    return;
  }
  $('#vList').innerHTML = items.map(x => {
    const fav = S.favorites.includes(x.ref);
    return `<article class="vcard"><h3>${esc(x.ref)}</h3><p>${esc(x.text)}</p><div class="vact">
      <button data-copy="${esc(x.ref)}">Copy</button><button data-share="${esc(x.ref)}">Share</button>
      <button class="fav${fav ? ' on' : ''}" data-fav="${esc(x.ref)}" aria-pressed="${fav}">${fav ? '♥ Saved' : '♡ Save'}</button>
      ${x.lvl && x.lvl <= S.unlocked ? `<button data-lv="${x.lvl}">Play level ${x.lvl}</button>` : ''}</div></article>`;
  }).join('');
}

function renderStats() {
  const three = Object.values(S.levels).filter(l => l.stars === 3).length;
  const rows = [['Total points', totalScore().toLocaleString()], ['Levels completed', completed()], ['Verses collected', `${collected()} of ${L}`],
    ['Three-star levels', three], ['Early guesses', `${S.stats.guessRight} of ${S.stats.guessTotal}`], ['Daily streak', `${streak()} days`], ['Best daily streak', `${S.stats.bestStreak} days`]];
  $('#statRows').innerHTML = rows.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');
  $('#achList').innerHTML = ACH.map(a => { const got = S.ach.includes(a[0]); return `<li class="${got ? 'got' : ''}"><span class="ai">${got ? '✦' : '○'}</span><div><b>${a[1]}</b><span>${a[2]}</span></div></li>`; }).join('');
  $('#sndToggle').checked = S.settings.sound;
}

// ---------- Game ----------
let G = null, timerId = null, lastT = 0, cellEl = [];

function startLevel(level, mode) {
  const params = mode === 'daily' ? dailyParams(dayKey()) : levelParams(level);
  const p = buildPuzzle(params);
  G = { p, mode, level, round: params.round, entries: p.grid.map(r => r.map(c => (c ? '' : null))), locked: new Set(), given: new Set(), solved: new Set(), solvedCells: new Set(),
    revealed: new Set(), justRevealed: null, dir: 'a', cur: { w: 0, k: 0 }, elapsed: 0, hints: 0, penalty: 0, ctxShown: new Set(), guess: null, done: false };
  p.given.forEach(([x, y]) => { G.entries[y][x] = p.grid[y][x]; G.locked.add(x + ',' + y); G.given.add(x + ',' + y); });
  $('#gTitle').textContent = mode === 'daily' ? 'Daily verse' : `Level ${level}${params.round ? ' (round ' + (params.round + 1) + ')' : ''}`;
  $('#gTime').textContent = '0:00';
  buildGridDom(); renderVerseStrip();
  show('game');
  selectWord(0);
  requestAnimationFrame(sizeGrid);
  startTimer();
}

function buildGridDom() {
  const p = G.p, grid = $('#grid'); grid.innerHTML = ''; cellEl = [];
  grid.style.gridTemplateColumns = `repeat(${p.w}, var(--cell))`;
  for (let y = 0; y < p.h; y++) {
    cellEl.push([]);
    for (let x = 0; x < p.w; x++) {
      const el = document.createElement('div');
      if (p.grid[y][x]) { el.className = 'cell'; el.dataset.x = x; el.dataset.y = y; el.innerHTML = (p.nums[y][x] ? `<span class="num">${p.nums[y][x]}</span>` : '') + '<span class="ch"></span>'; }
      else el.className = 'void';
      grid.appendChild(el); cellEl[y].push(p.grid[y][x] ? el : null);
    }
  }
}
function sizeGrid() {
  if (!G) return;
  const wrap = $('#gridWrap'), gap = 3;
  const W = wrap.clientWidth - 8, H = wrap.clientHeight - 8;
  const c = Math.floor(Math.min((W - (G.p.w - 1) * gap) / G.p.w, (H - (G.p.h - 1) * gap) / G.p.h, 50));
  $('#grid').style.setProperty('--cell', Math.max(c, 16) + 'px');
}
window.addEventListener('resize', sizeGrid);

function verseHTML() {
  return G.p.tokens.map(t => {
    const show = G.done || G.revealed.has(t.core);
    if (show) return `<span class="shown${t.core === G.justRevealed ? ' new' : ''}">${esc(t.raw)}</span>`;
    const lead = t.raw.match(/^[^A-Za-z]*/)[0], trail = t.raw.match(/[^A-Za-z’']*$/)[0];
    return `${esc(lead)}<span class="hid" style="--n:${Math.max(1, t.core.length)}"></span>${esc(trail)}`;
  }).join(' ');
}
function renderVerseStrip() { $('#verseStrip').innerHTML = verseHTML(); const n = $('#verseStrip .new'); if (n) n.scrollIntoView({ block: 'nearest' }); }
function hiddenFrac() {
  let tot = 0, hid = 0; G.p.tokens.forEach(t => { tot += t.core.length; if (!G.revealed.has(t.core)) hid += t.core.length; });
  return tot ? hid / tot : 0;
}

const curCell = () => G.p.words[G.cur.w].cells[G.cur.k];
const isLocked = (x, y) => G.locked.has(x + ',' + y);
function firstOpen(i) { const cells = G.p.words[i].cells; let k = cells.findIndex(([x, y]) => !isLocked(x, y) && !G.entries[y][x]); if (k < 0) k = cells.findIndex(([x, y]) => !isLocked(x, y)); return Math.max(0, k); }
function selectWord(i, k) { G.cur = { w: i, k: k ?? firstOpen(i) }; G.dir = G.p.words[i].dir; paint(); }

function paint() {
  const p = G.p, w = p.words[G.cur.w], inw = new Set(w.cells.map(c => c.join(','))), [cx, cy] = curCell();
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
    const el = cellEl[y][x]; if (!el) continue; const k = x + ',' + y;
    el.classList.toggle('inword', inw.has(k)); el.classList.toggle('sel', x === cx && y === cy);
    el.classList.toggle('solved', G.solvedCells.has(k)); el.classList.toggle('given', G.given.has(k) && !G.solvedCells.has(k));
    el.lastChild.textContent = G.entries[y][x] || '';
  }
  const solved = G.solved.has(G.cur.w);
  $('#clue').classList.toggle('done', solved);
  $('#clueNum').textContent = `${w.num} ${w.dir === 'a' ? 'Across' : 'Down'}${solved ? ', solved' : ''}`;
  $('#clueText').textContent = w.def ? `${w.def} (${w.ans.length})` : '';
  $('#clueCtx').textContent = !w.def ? `${w.ctx} (${w.ans.length})` : G.ctxShown.has(G.cur.w) ? w.ctx : '';
  $('#hCtx').disabled = G.done || !w.def || G.ctxShown.has(G.cur.w) || solved;
  $('#hLetter').disabled = G.done;
  const hg = $('#hGuess'); hg.disabled = G.done || !!G.guess;
  hg.textContent = G.guess ? (G.guess.correct ? `Guessed! +${G.guess.bonus}` : 'Guess missed') : 'Guess the verse';
}

function clickCell(x, y) {
  if (!G || G.done) return;
  const cw = G.p.cellWords[y][x], [cx, cy] = curCell();
  let dir = G.dir; if (cx === x && cy === y) dir = dir === 'a' ? 'd' : 'a';
  let i = cw[dir]; if (i == null) i = cw.a ?? cw.d;
  selectWord(i, G.p.words[i].cells.findIndex(c => c[0] === x && c[1] === y));
}
function nextOpen(i, k) { const cells = G.p.words[i].cells; for (let j = k + 1; j < cells.length; j++) if (!isLocked(...cells[j])) return j; return -1; }
function gotoWord(step) {
  const n = G.p.words.length;
  for (let s = 1; s <= n; s++) { const j = (G.cur.w + step * s + n * n) % n; if (!G.solved.has(j)) return selectWord(j); }
  selectWord((G.cur.w + step + n) % n);
}

function type(ch) {
  if (!G || G.done) return;
  const w = G.p.words[G.cur.w];
  let k = G.cur.k, [x, y] = w.cells[k];
  if (isLocked(x, y)) {
    const nk = nextOpen(G.cur.w, k);
    if (G.p.grid[y][x] === ch) { if (nk >= 0) G.cur.k = nk; else gotoWord(1); paint(); return; } // typed over a filled letter: step past it
    if (nk < 0) return gotoWord(1);
    k = nk; [x, y] = w.cells[k];
  }
  G.entries[y][x] = ch; G.cur.k = k;
  checkAt(x, y);
  if (G.done) return;
  if (G.solved.has(G.cur.w)) gotoWord(1);
  else { const nk = nextOpen(G.cur.w, k); if (nk >= 0) G.cur.k = nk; paint(); }
}
function backspace() {
  if (!G || G.done) return;
  const w = G.p.words[G.cur.w], [x, y] = curCell();
  if (!isLocked(x, y) && G.entries[y][x]) G.entries[y][x] = '';
  else for (let j = G.cur.k - 1; j >= 0; j--) { const [a, b] = w.cells[j]; if (!isLocked(a, b)) { G.cur.k = j; G.entries[b][a] = ''; break; } }
  paint();
}
function arrow(dx, dy) {
  if (!G || G.done) return;
  const [cx, cy] = curCell(), x = cx + dx, y = cy + dy;
  G.dir = dx ? 'a' : 'd';
  if (G.p.grid[y] && G.p.grid[y][x]) { const cw = G.p.cellWords[y][x]; const i = cw[G.dir] ?? cw.a ?? cw.d; selectWord(i, G.p.words[i].cells.findIndex(c => c[0] === x && c[1] === y)); }
  else { const cw = G.p.cellWords[cy][cx]; if (cw[G.dir] != null && cw[G.dir] !== G.cur.w) selectWord(cw[G.dir], G.p.words[cw[G.dir]].cells.findIndex(c => c[0] === cx && c[1] === cy)); }
}

const wordFull = i => G.p.words[i].cells.every(([x, y]) => G.entries[y][x]);
const wordRight = i => G.p.words[i].cells.every(([x, y]) => G.entries[y][x] === G.p.grid[y][x]);
function checkAt(x, y) {
  const cw = G.p.cellWords[y][x];
  ['a', 'd'].forEach(d => {
    const i = cw[d]; if (i == null || G.solved.has(i) || !wordFull(i)) return;
    if (wordRight(i)) solveWord(i); else shake(i);
  });
}
function solveWord(i) {
  if (G.solved.has(i)) return;
  const w = G.p.words[i];
  G.solved.add(i); w.cells.forEach(([x, y]) => { G.locked.add(x + ',' + y); G.solvedCells.add(x + ',' + y); });
  G.revealed.add(w.ans); G.justRevealed = w.ans; renderVerseStrip();
  tone([660, 880]);
  w.cells.forEach(([x, y]) => { const cw = G.p.cellWords[y][x]; ['a', 'd'].forEach(d => { const j = cw[d]; if (j != null && !G.solved.has(j) && wordFull(j) && wordRight(j)) solveWord(j); }); });
  if (G.solved.size === G.p.words.length) finish();
}
function shake(i) {
  const els = G.p.words[i].cells.map(([x, y]) => cellEl[y][x]);
  els.forEach(e => { e.classList.remove('bad'); void e.offsetWidth; e.classList.add('bad'); });
  setTimeout(() => els.forEach(e => e.classList.remove('bad')), 400);
  tone([180], 0.08, 0, 'triangle');
}

// Hints
function revealLetter() {
  if (!G || G.done) return;
  let [x, y] = curCell();
  if (isLocked(x, y)) {
    const nk = nextOpen(G.cur.w, G.cur.k);
    if (nk >= 0) { G.cur.k = nk; [x, y] = curCell(); }
    else { gotoWord(1); [x, y] = curCell(); if (isLocked(x, y)) return; }
  }
  G.entries[y][x] = G.p.grid[y][x]; G.locked.add(x + ',' + y); G.given.add(x + ',' + y);
  G.penalty += 40; G.hints++;
  checkAt(x, y);
  if (G.done) return;
  if (G.solved.has(G.cur.w)) gotoWord(1); else { const nk = nextOpen(G.cur.w, G.cur.k); if (nk >= 0) G.cur.k = nk; paint(); }
}
function showContext() {
  if (!G || G.done) return;
  const w = G.p.words[G.cur.w]; if (!w.def || G.ctxShown.has(G.cur.w)) return;
  G.ctxShown.add(G.cur.w); G.penalty += 25; G.hints++; paint();
}

// Guess
function openGuess() {
  if (!G || G.done || G.guess) return;
  const jr = G.justRevealed; G.justRevealed = null; $('#guessVerse').innerHTML = verseHTML(); G.justRevealed = jr;
  $('#guessOpts').innerHTML = G.p.options.map(r => `<button data-gref="${esc(r)}">${esc(r)}</button>`).join('');
  openSheet('#guessSheet');
}
function makeGuess(ref) {
  const frac = hiddenFrac(), correct = ref === G.p.ref;
  S.stats.guessTotal++;
  if (correct) {
    const bonus = Math.round(150 + 450 * frac);
    G.guess = { correct: true, bonus }; S.stats.guessRight++; if (frac >= 0.75) S.stats.seer++;
    tone([523, 659, 784]); toast(`Yes, it’s ${ref}! +${bonus} bonus`);
  } else {
    G.guess = { correct: false, bonus: 0 }; G.penalty += 100;
    tone([220, 180], 0.1, 0.1, 'triangle'); toast(`Not ${ref}. −100. Keep solving to reveal it.`);
  }
  save(); closeSheets(); paint();
}

// Timer
function startTimer() {
  stopTimer(); lastT = performance.now();
  timerId = setInterval(() => {
    const now = performance.now();
    if (G && !G.done && !document.hidden && $('#guessSheet').hidden) G.elapsed += now - lastT;
    lastT = now;
    if (G) $('#gTime').textContent = fmt(G.elapsed / 1000);
  }, 250);
}
function stopTimer() { clearInterval(timerId); timerId = null; }
document.addEventListener('visibilitychange', () => { lastT = performance.now(); });

// Finish and score
function finish() {
  if (G.done) return;
  G.done = true; stopTimer(); paint(); renderVerseStrip();
  const p = G.p, t = G.elapsed / 1000;
  const base = 300 + 60 * p.words.length;
  const speed = Math.max(0, Math.min(1, (2 * p.par - t) / (2 * p.par)));
  const timeB = Math.round(800 * speed);
  const guessB = G.guess && G.guess.correct ? G.guess.bonus : 0;
  const mult = G.mode === 'daily' ? 1.5 : 1 + 0.25 * (G.round || 0);
  const total = Math.max(50, Math.round((base + timeB + guessB - G.penalty) * mult));
  const stars = t <= p.par && G.hints === 0 ? 3 : t <= 2 * p.par ? 2 : 1;
  const newVerse = !S.collection[p.ref];
  if (newVerse) S.collection[p.ref] = { ts: Date.now(), lvl: G.mode === 'daily' ? p.verseIdx + 1 : ((G.level - 1) % L) + 1 };
  let isBest;
  if (G.mode === 'daily') {
    const k = dayKey(); isBest = !!S.daily[k] && total > S.daily[k];
    S.daily[k] = Math.max(total, S.daily[k] || 0); S.stats.bestStreak = Math.max(S.stats.bestStreak, streak());
  } else {
    const r = S.levels[G.level]; isBest = !!r && total > r.best;
    S.levels[G.level] = { best: Math.max(total, r ? r.best : 0), stars: Math.max(stars, r ? r.stars : 0), time: r && r.time ? Math.min(t, r.time) : t };
    if (G.level === S.unlocked) S.unlocked++;
  }
  if (G.hints === 0) S.stats.noHint++;
  if (t < 60) S.stats.swift++;
  const newAch = checkAch(); save();
  setTimeout(() => {
    tone([523, 659, 784, 1047], 0.16, 0.11);
    showResults({ t, stars, base, timeB, guessB, total, isBest, mult, newVerse });
    newAch.forEach((a, i) => setTimeout(() => toast(`Award earned: ${a[1]}`), 2600 + i * 2600));
  }, 450);
}

function showResults(r) {
  const p = G.p;
  $('#resTitle').textContent = G.mode === 'daily' ? 'Daily verse complete' : `Level ${G.level} complete`;
  $('#resStars').textContent = '★'.repeat(r.stars) + '☆'.repeat(3 - r.stars);
  $('#resStars').setAttribute('aria-label', `${r.stars} of 3 stars`);
  const rv = $('#resVerse');
  rv.style.setProperty('--d', Math.min(80, 2200 / p.tokens.length) + 'ms');
  rv.innerHTML = '“' + p.tokens.map((t, i) => `<span style="--i:${i}">${esc(t.raw)}</span>`).join(' ') + '”';
  $('#resRef').textContent = p.ref + (r.newVerse ? '  (new verse)' : '');
  const rows = [['Puzzle', r.base], [`Speed (${fmt(r.t)})`, r.timeB]];
  if (G.guess) rows.push([G.guess.correct ? 'Early guess bonus' : 'Early guess', r.guessB]);
  if (G.penalty) rows.push(['Hints and misses', -G.penalty]);
  if (r.mult !== 1) rows.push(['Multiplier', '×' + r.mult]);
  $('#resRows').innerHTML = rows.map(([a, b]) => `<div><dt>${a}</dt><dd>${typeof b === 'number' ? (b > 0 ? '+' : '') + b.toLocaleString() : b}</dd></div>`).join('') +
    `<div class="total"><dt>${r.isBest ? 'Total (new best)' : 'Total'}</dt><dd>${r.total.toLocaleString()}</dd></div>`;
  updateFavBtn();
  $('#rNext').textContent = G.mode === 'daily' ? 'Back to menu' : 'Next level';
  openSheet('#resSheet');
}
function updateFavBtn() { const on = S.favorites.includes(G.p.ref); const b = $('#rFav'); b.classList.toggle('on', on); b.textContent = on ? '♥ Saved' : '♡ Save'; b.setAttribute('aria-pressed', on); }

function openSheet(sel) { document.querySelector(sel).hidden = false; }
function closeSheets() { document.querySelectorAll('.overlay').forEach(o => (o.hidden = true)); }
const sheetOpen = () => [...document.querySelectorAll('.overlay')].some(o => !o.hidden);

// ---------- Keyboard ----------
(function buildKbd() {
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', '<ZXCVBNM>'];
  $('#kbd').innerHTML = rows.map(r => `<div class="krow">${[...r].map(c => c === '<' ? '<button class="key wide" data-k="back" aria-label="Delete">⌫</button>' : c === '>' ? '<button class="key wide" data-k="next">Next</button>' : `<button class="key" data-k="${c}">${c}</button>`).join('')}</div>`).join('');
})();
$('#kbd').addEventListener('click', e => {
  const k = e.target.closest('[data-k]'); if (!k) return;
  const v = k.dataset.k; if (v === 'back') backspace(); else if (v === 'next') gotoWord(1); else type(v);
});
document.addEventListener('keydown', e => {
  if (!$('#game').classList.contains('on') || !G || e.metaKey || e.ctrlKey || e.altKey) return;
  if (sheetOpen()) { if (e.key === 'Escape' && !$('#guessSheet').hidden) closeSheets(); return; }
  if (/^[a-z]$/i.test(e.key)) { type(e.key.toUpperCase()); e.preventDefault(); }
  else if (e.key === 'Backspace') { backspace(); e.preventDefault(); }
  else if (e.key === 'Enter' || e.key === 'Tab') { gotoWord(e.shiftKey ? -1 : 1); e.preventDefault(); }
  else if (e.key === 'ArrowLeft') arrow(-1, 0); else if (e.key === 'ArrowRight') arrow(1, 0);
  else if (e.key === 'ArrowUp') arrow(0, -1); else if (e.key === 'ArrowDown') arrow(0, 1);
  else if (e.key === ' ') { const [x, y] = curCell(); clickCell(x, y); e.preventDefault(); }
});

// ---------- Event wiring ----------
$('#grid').addEventListener('click', e => { const c = e.target.closest('.cell'); if (c) clickCell(+c.dataset.x, +c.dataset.y); });
$('#cPrev').onclick = () => G && gotoWord(-1);
$('#cNext').onclick = () => G && gotoWord(1);
$('#hLetter').onclick = revealLetter;
$('#hCtx').onclick = showContext;
$('#hGuess').onclick = openGuess;
$('#gBack').onclick = () => {
  if (G && !G.done && G.solved.size > 0 && !confirm('Leave this level? Your progress on it won’t be saved.')) return;
  stopTimer(); G = null; show('home');
};
$('#btnPlay').onclick = () => startLevel(S.unlocked, 'level');
$('#btnDaily').onclick = () => startLevel(0, 'daily');
$('#rNext').onclick = () => { closeSheets(); if (G.mode === 'daily') { G = null; show('home'); } else startLevel(G.level + 1, 'level'); };
$('#rReplay').onclick = () => { closeSheets(); startLevel(G.level, G.mode); };
$('#rCopy').onclick = () => copyVerse(G.p.ref);
$('#rShare').onclick = () => shareVerse(G.p.ref);
$('#rFav').onclick = () => { const on = toggleFav(G.p.ref); updateFavBtn(); toast(on ? 'Saved to My verses' : 'Removed from saved'); };
$('#guessOpts').addEventListener('click', e => { const b = e.target.closest('[data-gref]'); if (b) makeGuess(b.dataset.gref); });
$('#guessSheet').addEventListener('click', e => { if (e.target.id === 'guessSheet' || e.target.closest('[data-close]')) closeSheets(); });
$('#vSearch').addEventListener('input', renderVerses);
document.querySelectorAll('[data-vf]').forEach(b => b.onclick = () => { vFilter = b.dataset.vf; document.querySelectorAll('[data-vf]').forEach(x => x.classList.toggle('on', x === b)); renderVerses(); });
$('#sndToggle').onchange = e => { S.settings.sound = e.target.checked; save(); };
$('#btnReset').onclick = () => { if (confirm('Erase all levels, scores, awards and collected verses? This can’t be undone.')) { S = defaults(); save(); toast('Progress reset'); renderStats(); } };

document.addEventListener('click', e => {
  const go = e.target.closest('[data-go]'); if (go && go.id !== 'gBack') { show(go.dataset.go); return; }
  const lv = e.target.closest('[data-lv]'); if (lv && !lv.disabled) { startLevel(+lv.dataset.lv, 'level'); return; }
  const c = e.target.closest('[data-copy]'); if (c) return copyVerse(c.dataset.copy);
  const s = e.target.closest('[data-share]'); if (s) return shareVerse(s.dataset.share);
  const f = e.target.closest('[data-fav]'); if (f) { toggleFav(f.dataset.fav); renderVerses(); }
});

// ---------- Install (PWA) ----------
let deferred = null;
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('#installBar').hidden = false; });
$('#btnInstall').onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('#installBar').hidden = true; };
if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone()) {
  $('#installText').textContent = 'To install: tap the Share button, then Add to Home Screen.';
  $('#btnInstall').hidden = true; $('#installBar').hidden = false;
}
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

renderHome();
})();
