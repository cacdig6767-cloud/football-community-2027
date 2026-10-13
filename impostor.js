/* ═══════════════════════════════════════════════════════════════════════════
   MODO IMPOSTOR v1.0 · 🕵️ un jugador no sabe la palabra y finge que sí.
   ─────────────────────────────────────────────────────────────────────────
   Pasa-teléfono ORAL (no es online): el móvil reparte la palabra en privado,
   el grupo conversa por turnos diciendo pistas, corre el reloj y se vota.
   · 3–10 jugadores · 1–3 impostores · debate de 1–3 minutos.
   · Filtros: jugadores, equipos, títulos colectivos, individuales, posiciones.
   · Si atrapan al impostor, aún puede robar la victoria ADIVINANDO la palabra.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  var M = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = M;
  root.IMPOSTOR = M;
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

var CATS = [
  { k: 'jugadores',   n: '⚽ Jugadores (actuales y leyendas)' },
  { k: 'equipos',     n: '🏟️ Equipos y selecciones' },
  { k: 'colectivos',  n: '🏆 Títulos colectivos' },
  { k: 'individuales',n: '🎖️ Títulos individuales' },
  { k: 'posiciones',  n: '📍 Posiciones del campo' }
];
var ALL_ON = { jugadores: true, equipos: true, colectivos: true, individuales: true, posiciones: true };

function W() { return (typeof window !== 'undefined' && window.IMPOSTOR_WORDS) || (typeof IMPOSTOR_WORDS !== 'undefined' ? IMPOSTOR_WORDS : null); }

function pool(catsOn) {
  var DB = W(); if (!DB) return [];
  var on = catsOn || ALL_ON, out = [];
  if (on.jugadores) {
    (DB.jugadores || []).forEach(function (n) { out.push({ w: n, cat: 'jugadores', era: 'actual' }); });
    (DB.leyendas || []).forEach(function (L) { out.push({ w: L.n, cat: 'jugadores', era: L.era }); });
  }
  if (on.equipos)     (DB.equipos || []).forEach(function (n)     { out.push({ w: n, cat: 'equipos' }); });
  if (on.colectivos)  (DB.colectivos || []).forEach(function (n)  { out.push({ w: n, cat: 'colectivos' }); });
  if (on.individuales)(DB.individuales || []).forEach(function (n){ out.push({ w: n, cat: 'individuales' }); });
  if (on.posiciones)  (DB.posiciones || []).forEach(function (n)  { out.push({ w: n, cat: 'posiciones' }); });
  return out;
}
function wordsTotal() { return pool(ALL_ON).length; }
function pickWord(catsOn, rng) {
  var P = pool(catsOn); if (!P.length) return null;
  var R = rng || Math.random;
  return P[(R() * P.length) | 0];
}

function validCfg(c) {
  c = c || {};
  var players = Math.max(3, Math.min(10, (c.players | 0) || 4));
  var impostors = Math.max(1, Math.min(3, (c.impostors | 0) || 1));
  if (impostors > players - 2) impostors = Math.max(1, players - 2);
  var minutes = Math.max(1, Math.min(3, (c.minutes | 0) || 1));
  var cats = {}, any = false;
  CATS.forEach(function (t) { var v = !c.cats || c.cats[t.k] !== false; cats[t.k] = v; any = any || v; });
  if (!any) { CATS.forEach(function (t) { cats[t.k] = true; }); }
  return { players: players, impostors: impostors, minutes: minutes, seconds: minutes * 60, cats: cats };
}

function newGame(cfg, rng) {
  var R = rng || Math.random, word = pickWord(cfg.cats, R);
  if (!word) return null;
  var idx = [], i;
  while (idx.length < cfg.impostors) {
    var c = (R() * cfg.players) | 0;
    if (idx.indexOf(c) < 0) idx.push(c);
  }
  return {
    players: cfg.players, impostorsIdx: idx, word: word,
    seconds: cfg.seconds, eliminated: [], score: null,
    revealStep: 0, phase: 'pass', round: 1
  };
}

function aliveList(st) {
  var out = [];
  for (var i = 0; i < st.players; i++) if (st.eliminated.indexOf(i) < 0) out.push(i);
  return out;
}
function impostorsAlive(st) {
  return st.impostorsIdx.filter(function (i) { return st.eliminated.indexOf(i) < 0; });
}

/* el grupo vota a UN sospechoso: impostor atrapado → chance de adivinar;
   inocente expulsado → otra ronda de debate. Devuelve el destino de la mano. */
function resolveVote(st, suspectIdx) {
  var isImp = st.impostorsIdx.indexOf(suspectIdx) >= 0;
  if (isImp) {
    st.eliminated.push(suspectIdx);
    if (!impostorsAlive(st).length) {
      /* todos atrapados: último arrestado conserva la opción de robar adivinando */
      st.phase = 'caughtFinal';
      st.chanceOwner = suspectIdx;
      return { kind: 'impostorCaught', final: true, idx: suspectIdx };
    }
    st.phase = 'caught';
    st.chanceOwner = suspectIdx;
    return { kind: 'impostorCaught', final: false, idx: suspectIdx };
  }
  st.eliminated.push(suspectIdx);
  var alive = aliveList(st), imp = impostorsAlive(st);
  if (alive.length <= imp.length + 1) {
    st.phase = 'impostorsWin';
    return { kind: 'impostorsWin', idx: suspectIdx };
  }
  st.phase = 'pass'; st.round++;
  return { kind: 'innocentOut', idx: suspectIdx };
}

/* tras atrapar al impostor: ¿adivinó la palabra? (oral, el grupo lo decreta) */
function impostorGuess(st, guessed) {
  if (st.phase !== 'caught' && st.phase !== 'caughtFinal') return { kind: 'invalid' };
  if (guessed) { st.phase = 'impostorsWin'; return { kind: 'impostorSteals' }; }
  if (impostorsAlive(st).length) { st.phase = 'pass'; st.round++; return { kind: 'continue' }; }
  st.phase = 'innocentsWin';
  return { kind: 'innocentsWin' };
}

function catLabel(k) { var t = CATS.filter(function (x) { return x.k === k; })[0]; return t ? t.n : k; }
function eraBadge(era) {
  return era === 'fallecido' ? '🕊️ leyenda eterna' : era === 'retirado' ? '🏅 leyenda retirada' : era === 'por retirarse' ? '🌅 cuelga las botas pronto' : '⚽ en activo';
}

/* ══════════ UI (pantalla propia estilo Torneos/QR) ══════════ */
var CFG_KEY = 'fc27_imp_cfg', SCR_KEY = 'fc27_imp_score';
function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v || d; } catch (e) { return d; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function cfg() {
  var c = load(CFG_KEY, null);
  if (!c) { c = validCfg({}); } else { c = validCfg(c); }
  return c;
}
function esc(s) { return String(s || '').replace(/</g, '&lt;'); }

function open() {
  if (typeof document === 'undefined') return;
  ensureMenuBtn();
  var sc = document.getElementById('imp-screen');
  if (!sc) {
    sc = document.createElement('div');
    sc.id = 'imp-screen';
    sc.style.cssText = 'position:fixed;inset:0;z-index:9000;background:linear-gradient(180deg,#160a24,#07060f);overflow-y:auto;display:none';
    document.body.appendChild(sc);
  }
  sc.style.display = '';
  renderConfig(sc);
}
function close() {
  var sc = document.getElementById('imp-screen');
  if (sc) sc.style.display = 'none';
  stopTick();
}

/* ── estilos ── */
var CSS_ID = 'imp-css';
function css() {
  if (document.getElementById(CSS_ID)) return;
  var st = document.createElement('style'); st.id = CSS_ID;
  st.textContent =
    '#imp-screen{font-family:system-ui,-apple-system,sans-serif;color:#efe9ff}' +
    '.imp-top{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(10,7,18,.94);border-bottom:1px solid #2a1c4d;backdrop-filter:blur(6px)}' +
    '.imp-back{background:#241a3f;color:#d7c9ff;border:1px solid #46306e;border-radius:10px;padding:8px 14px;font:800 13px system-ui;cursor:pointer}' +
    '.imp-title{font:900 15px system-ui;color:#e9b3ff;letter-spacing:1px}' +
    '.imp-wrap{max-width:640px;margin:0 auto;padding:14px 12px 70px;display:flex;flex-direction:column;gap:14px}' +
    '.imp-card{background:linear-gradient(180deg,#1c1030,#120a20);border:1px solid #342253;border-radius:16px;padding:14px}' +
    '.imp-h{font-size:.72rem;letter-spacing:2px;color:#a78bfa;text-transform:uppercase;margin-bottom:10px;font-weight:800}' +
    '.imp-step{display:flex;align-items:center;justify-content:space-between;background:#160d28;border:1px solid #342253;border-radius:12px;padding:8px 10px;margin-bottom:8px}' +
    '.imp-step b{font-size:.85rem}' +
    '.imp-pm{display:flex;gap:8px;align-items:center}' +
    '.imp-pm button{width:46px;height:46px;border-radius:12px;border:1px solid #6d4bb0;background:#241a3f;color:#fff;font:900 20px system-ui;cursor:pointer}' +
    '.imp-num{width:44px;text-align:center;font:900 20px system-ui;color:#e9b3ff}' +
    '.imp-chip{border:1px solid #342253;border-radius:12px;padding:11px 10px;background:#160d28;cursor:pointer;font:800 12px system-ui;text-align:center;transition:.15s;margin-bottom:6px}' +
    '.imp-chip.on{border-color:#e9b3ff;background:#2c1a4e}' +
    '.imp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.imp-go{background:linear-gradient(180deg,#a855f7,#7c3aed);color:#fff;border:0;border-radius:14px;padding:16px;font:900 16px system-ui;cursor:pointer;width:100%;box-shadow:0 6px 20px rgba(168,85,247,.3)}' +
    '.imp-big{border:0;border-radius:16px;padding:20px 12px;font:900 16px system-ui;cursor:pointer;width:100%}' +
    '.imp-reveal{min-height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(160deg,#2c1a4e,#180c2e);border:2px dashed #6d4bb0;border-radius:18px;padding:22px;text-align:center;user-select:none}' +
    '.imp-word{font-size:2rem;font-weight:900;color:#ffd166;line-height:1.2;margin:8px 0}' +
    '.imp-small{font-size:.72rem;color:#b9a8e0}' +
    '.imp-timer{font-size:4.2rem;font-weight:900;color:#fff;text-align:center;letter-spacing:2px;text-shadow:0 0 24px rgba(233,179,255,.4)}' +
    '.imp-vote{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.imp-pb{border:2px solid #342253;border-radius:14px;padding:16px 8px;background:#160d28;cursor:pointer;font:900 14px system-ui;text-align:center;transition:.15s;color:#efe9ff}' +
    '.imp-pb:active{transform:scale(.96)}' +
    '.imp-out{opacity:.35;pointer-events:none}' +
    '@media(max-width:640px){.imp-word{font-size:1.6rem}.imp-timer{font-size:3.4rem}}';
  document.head.appendChild(st);
}

/* ── pitido de fin de debate ── */
function beep(times) {
  try {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    var ctx = beep._c || new AC(); beep._c = ctx;
    var t0 = ctx.currentTime;
    for (var i = 0; i < (times || 3); i++) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880 + (i % 2) * 160; o.type = 'square';
      g.gain.setValueAtTime(.0001, t0 + i * .28);
      g.gain.exponentialRampToValueAtTime(.22, t0 + i * .28 + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + i * .28 + .24);
      o.connect(g); g.connect(ctx.destination);
      o.start(t0 + i * .28); o.stop(t0 + i * .28 + .26);
    }
  } catch (e) {}
}

/* ── temporizador ── */
var tick = null, remain = 0;
function stopTick() { if (tick) { clearInterval(tick); tick = null; } }
function fmt(s) { return ((s / 60) | 0) + ':' + ('0' + (s % 60)).slice(-2); }

/* ══════════ PANTALLAS ══════════ */
function topBar(sc, title, backFn) {
  var t = document.createElement('div'); t.className = 'imp-top';
  var b = document.createElement('button'); b.className = 'imp-back'; b.textContent = '← Menú';
  b.onclick = backFn || close;
  var h = document.createElement('div'); h.className = 'imp-title'; h.textContent = title;
  t.appendChild(b); t.appendChild(h);
  sc.innerHTML = ''; sc.appendChild(t);
  var w = document.createElement('div'); w.className = 'imp-wrap'; sc.appendChild(w);
  return w;
}

function renderConfig(sc) {
  css(); stopTick();
  var c = cfg(), w = topBar(sc, '🕵️ MODO IMPOSTOR');
  var card = document.createElement('div'); card.className = 'imp-card';
  card.innerHTML =
    '<div class="imp-h">👥 Jugadores e impostores</div>' +
    '<div class="imp-step"><b>🧍 Jugadores (3–10)</b><div class="imp-pm"><button data-imp="players:-1">−</button><div class="imp-num" id="imp-np">' + c.players + '</div><button data-imp="players:1">+</button></div></div>' +
    '<div class="imp-step"><b>🕵️ Impostores (1–3)</b><div class="imp-pm"><button data-imp="impostors:-1">−</button><div class="imp-num" id="imp-ni">' + c.impostors + '</div><button data-imp="impostors:1">+</button></div></div>' +
    '<div class="imp-step"><b>⏱️ Debate (1–3 min)</b><div class="imp-pm"><button data-imp="minutes:-1">−</button><div class="imp-num" id="imp-nm">' + c.minutes + '</div><button data-imp="minutes:1">+</button></div></div>';
  card.querySelectorAll('[data-imp]').forEach(function (btn) {
    btn.onclick = function () {
      var kv = btn.getAttribute('data-imp').split(':'), k = kv[0], d = +kv[1];
      c[k] = c[k] + d;
      var v = validCfg(c); Object.assign(c, v);
      document.getElementById('imp-np').textContent = c.players;
      document.getElementById('imp-ni').textContent = c.impostors;
      document.getElementById('imp-nm').textContent = c.minutes;
      save(CFG_KEY, c);
    };
  });
  w.appendChild(card);

  var cats = document.createElement('div'); cats.className = 'imp-card';
  cats.innerHTML = '<div class="imp-h">🧲 Filtro de palabras (' + wordsTotal() + ' en juego)</div>';
  CATS.forEach(function (t) {
    var el = document.createElement('div');
    el.className = 'imp-chip' + (c.cats[t.k] ? ' on' : '');
    el.innerHTML = t.n + ' <span class="imp-small">· ' + ((W() || {})[t.k === 'jugadores' ? 'jugadores' : t.k] || []).length + '+</span>';
    el.onclick = function () {
      c.cats[t.k] = !c.cats[t.k];
      if (!CATS.some(function (x) { return c.cats[x.k]; })) { c.cats[t.k] = true; return; }
      el.classList.toggle('on', c.cats[t.k]); save(CFG_KEY, c);
    };
    cats.appendChild(el);
  });
  w.appendChild(cats);

  var help = document.createElement('div'); help.className = 'imp-card';
  help.innerHTML = '<div class="imp-h">📖 ¿Cómo se juega?</div>' +
    '<div class="imp-small" style="line-height:1.7;font-size:.82rem">1️⃣ El teléfono va pasando de mano en mano: cada quien ve <b>en secreto</b> su palabra… o descubre que es el <b>IMPOSTOR</b> (no sabe la palabra).<br>' +
    '2️⃣ <b>Hablen por turnos</b>: cada jugador dice una palabra-pista que describa la palabra secreta. El impostor finge y escucha.<br>' +
    '3️⃣ Al sonar el reloj, <b>voten a quién creen que es el impostor</b> y toquen su nombre.<br>' +
    '4️⃣ Si lo atrapan: aún puede <b>robar la victoria adivinando en voz alta</b> la palabra. Si votaron a un inocente, queda eliminado y la ronda sigue.<br>' +
    '5️⃣ Todo es <b>oral y local</b>: aquí no hay nada online, puro pasar-el-teléfono.</div>';
  w.appendChild(help);

  var go = document.createElement('button'); go.className = 'imp-go';
  go.textContent = '🕵️ REPARTIR PALABRAS';
  go.onclick = function () { startRound(sc); };
  w.appendChild(go);

  var sc5 = load(SCR_KEY, { inoc: 0, imp: 0 });
  if (sc5.inoc + sc5.imp > 0) {
    var s = document.createElement('div'); s.className = 'imp-card';
    s.innerHTML = '<div class="imp-h">📊 Marcador de la mesa</div>' +
      '<div class="imp-grid2"><div class="imp-chip on">😇 Inocentes: ' + sc5.inoc + '</div><div class="imp-chip on">🕵️ Impostores: ' + sc5.imp + '</div></div>' +
      '<button class="imp-chip" style="width:100%">🧹 Reiniciar marcador</button>';
    s.lastChild.onclick = function () { save(SCR_KEY, { inoc: 0, imp: 0 }); renderConfig(sc); };
    w.appendChild(s);
  }
}

var ST = null;
function startRound(sc) {
  var c = cfg(); save(CFG_KEY, c);
  ST = newGame(c);
  if (!ST) { alert('Sin palabras: activa al menos una categoría'); return; }
  ST.score = load(SCR_KEY, { inoc: 0, imp: 0 });
  ST.roundCfg = c;
  renderPass(sc, 0);
}

/* reparto privado */
function renderPass(sc, idx) {
  css();
  var w = topBar(sc, '🕵️ IMPOSTOR · Reparto');
  if (idx >= ST.players) { renderDebate(sc); return; }
  var card = document.createElement('div'); card.className = 'imp-card';
  card.style.textAlign = 'center';
  var isImp = ST.impostorsIdx.indexOf(idx) >= 0;
  card.innerHTML =
    '<div class="imp-h">Ronda ' + ST.round + ' · Jugador ' + (idx + 1) + ' de ' + ST.players + '</div>' +
    '<div class="imp-small" style="margin-bottom:10px">Solo el <b>jugador ' + (idx + 1) + '</b> mira la pantalla. Los demás, a voltear. 👀</div>' +
    '<div class="imp-reveal" id="imp-reveal"><span>🤫 TOCA PARA VER EN SECRETO</span></div>' +
    '<button class="imp-go" id="imp-next" style="margin-top:12px;display:none">✋ LA GUARDÉ · Pasa el teléfono →</button>';
  w.appendChild(card);
  var rv = document.getElementById('imp-reveal');
  rv.onclick = function () {
    if (isImp) {
      rv.innerHTML = '<span style="font-size:3rem">🕵️</span><div class="imp-word" style="color:#f472b6">ERES EL IMPOSTOR</div><div class="imp-small">No conoces la palabra. Finge, escucha y confunde. Si te atrapan, adivina para robar la victoria.</div>';
    } else {
      var badge = ST.word.cat === 'jugadores' ? ('<div class="imp-small">' + eraBadge(ST.word.era) + '</div>') : '';
      rv.innerHTML = '<div class="imp-small">' + esc(catLabel(ST.word.cat)) + '</div><div class="imp-word">«' + esc(ST.word.w) + '»</div>' + badge + '<div class="imp-small">Guárdala bien y no chivees. 😉</div>';
    }
    document.getElementById('imp-next').style.display = '';
    rv.onclick = null;
  };
  document.getElementById('imp-next').onclick = function () { renderPass(sc, idx + 1); };
}

/* debate con reloj */
function renderDebate(sc) {
  css(); stopTick();
  var w = topBar(sc, '🕵️ IMPOSTOR · Debate');
  var card = document.createElement('div'); card.className = 'imp-card'; card.style.textAlign = 'center';
  card.innerHTML =
    '<div class="imp-h">Hablen por turnos: una palabra-pista cada quien</div>' +
    '<div class="imp-small" style="margin-bottom:8px">El impostor no sabe la palabra… pero finge. Empieza quien quiera. 🗣️</div>' +
    '<div class="imp-timer" id="imp-clock">' + fmt(ST.seconds) + '</div>' +
    '<div class="imp-grid2" style="margin-top:12px">' +
    '<button class="imp-big" id="imp-start" style="background:linear-gradient(180deg,#22c55e,#15803d)">▶️ INICIAR</button>' +
    '<button class="imp-big" id="imp-skip" style="background:#241a3f;color:#d7c9ff">⏳ VOTAR YA</button></div>';
  w.appendChild(card);
  remain = ST.seconds;
  document.getElementById('imp-start').onclick = function () {
    var b = this;
    if (tick) { stopTick(); b.textContent = '▶️ SEGUIR'; return; }
    b.textContent = '⏸️ PAUSA';
    tick = setInterval(function () {
      remain--;
      var cl = document.getElementById('imp-clock');
      if (cl) { cl.textContent = fmt(Math.max(0, remain)); if (remain <= 10) cl.style.color = '#f472b6'; }
      if (remain <= 0) { stopTick(); beep(3); renderVote(sc); }
    }, 1000);
  };
  document.getElementById('imp-skip').onclick = function () { stopTick(); renderVote(sc); };
}

/* votación */
function renderVote(sc) {
  css();
  var w = topBar(sc, '🕵️ IMPOSTOR · ¡A votar!');
  var card = document.createElement('div'); card.className = 'imp-card';
  card.innerHTML = '<div class="imp-h">Voten en la mesa y toquen al sospechoso</div>' +
    '<div class="imp-small" style="margin-bottom:10px">La mayoría decide. El elegido se revela de inmediato. 👇</div>';
  var grid = document.createElement('div'); grid.className = 'imp-vote';
  for (var i = 0; i < ST.players; i++) {
    (function (p) {
      var el = document.createElement('div');
      var out = ST.eliminated.indexOf(p) >= 0;
      el.className = 'imp-pb' + (out ? ' imp-out' : '');
      el.textContent = (out ? '🚫 ' : '🧍 ') + 'Jugador ' + (p + 1);
      if (!out) el.onclick = function () { revealSuspect(sc, p); };
      grid.appendChild(el);
    })(i);
  }
  card.appendChild(grid);
  w.appendChild(card);
}

function revealSuspect(sc, p) {
  css();
  var res = resolveVote(ST, p);
  var w = topBar(sc, '🕵️ IMPOSTOR · Revelado');
  var card = document.createElement('div'); card.className = 'imp-card'; card.style.textAlign = 'center';
  if (res.kind === 'impostorCaught') {
    card.innerHTML =
      '<div style="font-size:3rem">🕵️</div><div class="imp-word" style="color:#f472b6">¡ATRAPADO! El Jugador ' + (p + 1) + ' era IMPOSTOR</div>' +
      '<div class="imp-small">Su última carta: si <b>adivina en voz alta</b> la palabra, ROBA la victoria. Grupo, decidan…</div>' +
      '<div class="imp-reveal" id="imp-spoiler" style="margin-top:10px;min-height:60px"><span class="imp-small">🔒 tocar para ver la palabra (spoiler)</span></div>' +
      '<div class="imp-grid2" style="margin-top:12px">' +
      '<button class="imp-big" id="imp-steal" style="background:linear-gradient(180deg,#f472b6,#be185d)">🎯 ADIVINÓ · gana el impostor</button>' +
      '<button class="imp-big" id="imp-fail" style="background:linear-gradient(180deg,#22c55e,#15803d)">🙅 NO ADIVINÓ · ganan inocentes</button></div>';
    var sp = document.getElementById('imp-spoiler') || card.querySelector('#imp-spoiler');
    w.appendChild(card);
    if (sp) sp.onclick = function () { this.innerHTML = '<div class="imp-word">«' + esc(ST.word.w) + '»</div>'; this.onclick = null; };
    document.getElementById('imp-steal').onclick = function () { finishGuess(sc, true); };
    document.getElementById('imp-fail').onclick = function () { finishGuess(sc, false); };
  } else if (res.kind === 'impostorsWin') {
    endScreen(sc, 'imp', 'El grupo expulsó a otro inocente… y ya no quedan suficientes para cazar impostores. 😈');
  } else {
    card.innerHTML =
      '<div style="font-size:3rem">😇</div><div class="imp-word">¡Error! El Jugador ' + (p + 1) + ' ERA INOCENTE</div>' +
      '<div class="imp-small">Queda eliminado y en silencio. El impostor sigue suelto… nueva ronda de debate. 🤐</div>' +
      '<button class="imp-go" id="imp-again" style="margin-top:12px">↻ OTRA RONDA DE DEBATE</button>';
    w.appendChild(card);
    document.getElementById('imp-again').onclick = function () { renderDebate(sc); };
  }
  return;
}

function finishGuess(sc, guessed) {
  var res = impostorGuess(ST, guessed);
  if (res.kind === 'impostorSteals') endScreen(sc, 'imp', 'El impostor adivinó la palabra después de ser atrapado. ¡Lobotomía perfecta! 🧠🕵️');
  else if (res.kind === 'innocentsWin') endScreen(sc, 'inoc', 'No la adivinó. La mesa dormirá tranquila. 😇🎉');
  else renderDebate(sc); /* quedan impostores: a otra ronda */
}

function endScreen(sc, winner, story) {
  css();
  ST.score[winner]++; save(SCR_KEY, ST.score);
  var w = topBar(sc, '🕵️ IMPOSTOR · Final de la ronda');
  var card = document.createElement('div'); card.className = 'imp-card'; card.style.textAlign = 'center';
  card.innerHTML =
    '<div style="font-size:3.2rem">' + (winner === 'imp' ? '🕵️' : '😇') + '</div>' +
    '<div class="imp-word">' + (winner === 'imp' ? '¡GANAN LOS IMPOSTORES!' : '¡GANAN LOS INOCENTES!') + '</div>' +
    '<div class="imp-small" style="margin-bottom:8px">' + esc(story) + '</div>' +
    '<div class="imp-reveal" style="min-height:70px"><div><div class="imp-small">La palabra era</div><div class="imp-word">«' + esc(ST.word.w) + '»</div><div class="imp-small">' + esc(catLabel(ST.word.cat)) + (ST.word.cat === 'jugadores' ? ' · ' + eraBadge(ST.word.era) : '') + '</div></div></div>' +
    '<div class="imp-grid2" style="margin-top:12px">' +
    '<button class="imp-big" id="imp-again2" style="background:linear-gradient(180deg,#a855f7,#7c3aed)">↻ OTRA RONDA</button>' +
    '<button class="imp-big" id="imp-cfg" style="background:#241a3f;color:#d7c9ff">⚙️ AJUSTES</button></div>' +
    '<div class="imp-card" style="margin-top:12px"><div class="imp-h">📊 Marcador de la mesa</div>' +
    '<div class="imp-grid2"><div class="imp-chip on">😇 Inocentes: ' + ST.score.inoc + '</div><div class="imp-chip on">🕵️ Impostores: ' + ST.score.imp + '</div></div></div>';
  w.appendChild(card);
  document.getElementById('imp-again2').onclick = function () { startRound(sc); };
  document.getElementById('imp-cfg').onclick = function () { renderConfig(sc); };
}

/* ── autoinyección del botón en el menú principal ── */
function ensureMenuBtn() {
  if (typeof document === 'undefined' || !document.querySelector) return;
  try {
    if (!document.getElementById('imp-menu-btn')) {
      var t = document.getElementById('qm-menu-btn') || document.querySelector('.fc-menu-grid button[onclick*="TorneosUI"]');
      if (t && t.parentNode) {
        var b = document.createElement('button');
        b.className = 'fc-btn fc-btn-wide'; b.id = 'imp-menu-btn';
        b.setAttribute('style', 'border-color:rgba(168,85,247,.65);background:linear-gradient(100deg,rgba(168,85,247,.16),rgba(244,114,182,.08));box-shadow:0 0 24px rgba(168,85,247,.14)');
        b.setAttribute('onclick', 'IMPOSTOR.open()');
        b.innerHTML = '🕵️ MODO IMPOSTOR<small>¡NUEVO JUEGO DE MESA! Una palabra para todos, menos para el impostor — pasa el teléfono y acusa en voz alta</small>';
        t.parentNode.insertBefore(b, t.nextSibling);
      }
    }
  } catch (e) {}
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureMenuBtn);
  else ensureMenuBtn();
}

return {
  CATS: CATS, pool: pool, wordsTotal: wordsTotal, pickWord: pickWord,
  validCfg: validCfg, newGame: newGame, resolveVote: resolveVote,
  impostorGuess: impostorGuess, aliveList: aliveList, impostorsAlive: impostorsAlive,
  open: open, close: close, ensureMenuBtn: ensureMenuBtn, catLabel: catLabel, eraBadge: eraBadge
};
});
