/* ═══════════════════════════════════════════════════════════════════════════
   MENU HUB v1.0 · gráficos MEDIO (solo PC) — hub vertical estilo "The World's Game"
   ─────────────────────────────────────────────────────────────────────────
   · Fondo por defecto: estadio nocturno. Al pasar el cursor por un modo, el
     fondo cambia con cross-fade suave a la foto de ese modo.
   · Los botones llaman a los MISMOS handlers del menú clásico (organización
     protegida: solo cambia el envoltorio visual).
   · Sin jugadores rotando ni letrero "rumbo a…". Se activa solo en pantallas
     de PC (≥900px) y puntero fino; persiste en localStorage fc27_uimode.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (root) {
'use strict';
var LS = 'fc27_uimode';
if (typeof document === 'undefined') return;

var DIR = 'assets/menu/';
var DEFAULT_BG = DIR + 'menu-default.jpg';

var ITEMS = [
  { k: 'pj',  t: 'CARRERA JUGADOR', d: 'Vive los momentos como futbolista — al retirarte pasas al banquillo', bg: DIR + 'menu-jugador.jpg' },
  { k: 'mgr', t: 'CARRERA MANAGER', d: 'Continúa tu partida, crea una nueva o importa un archivo', bg: DIR + 'menu-manager.jpg' },
  { k: 'ut',  t: 'ULTIMATE TEAM', d: 'Sobres, colección, gym sin techo y partidos vivos — hasta 🛸 Galáctica', bg: DIR + 'menu-ut.jpg' },
  { k: 'trn', t: 'TORNEOS', d: 'Champions, Libertadores, Copa Global, Centroamérica… y sandbox total', bg: DIR + 'menu-torneos.jpg' },
  { k: 'qr',  t: 'PARTIDO RÁPIDO', d: 'Amistosos, finales oficiales y FutSal con arenas y paredes', bg: DIR + 'menu-partido.jpg' },
  { k: 'imp', t: 'MODO IMPOSTOR', d: 'Juego de mesa local: una palabra para todos menos para el impostor', bg: DIR + 'menu-impostor.jpg' },
  { k: 'ed',  t: 'EDITOR', d: 'Plantillas · crea cracks · exporta / importa', bg: DIR + 'menu-editor.jpg' },
  { k: 'cfg', t: 'AJUSTES', d: 'Música, IA, cancha y opciones del juego', bg: DIR + 'menu-ajustes.jpg' }
];

var GO = {
  pj:  function () { root.Game.showScreen('screen-player-career'); },
  mgr: function () { root.SaveUI.openLoad(); },
  ut:  function () { root.open('ultimate-team.html', '_blank'); },
  trn: function () { root.TorneosUI.open(); },
  qr:  function () { root.QUICKMATCH.open(); },
  imp: function () { root.IMPOSTOR.open(); },
  ed:  function () { root.RosterEditor.open(); },
  cfg: function () { root.Game.showScreen('screen-settings'); }
};

var PANEL_BYKEY = {
  pj:  { h: '¿Vives tus momentos como futbolista de élite?', s: 'Crea tu jugador · Al retirarte: banquillo · Sueña un sueño' },
  mgr: { h: '¿Llevas a tu equipo a la gloria del banquillo?', s: '19 ligas · Mercado · Boots reales · Construye el legado' },
  ut:  { h: 'Arma tu once con sobres y colección', s: 'Gym sin techo · Partidos vivos · Dificultad 🛸 Galáctica' },
  trn: { h: 'Todos los trofeos del mundo te esperan', s: 'Champions · Libertadores · Históricos · Tu sandbox' },
  qr:  { h: 'Salta al campo en 10 segundos', s: 'Modos de juego · FutSal · IA de Aficionado a Leyenda' },
  imp: { h: 'Uno de ustedes miente ¿puedes descubrir quién?', s: 'Palabra secreta · Pasa el teléfono · Acusa en voz alta' },
  ed:  { h: 'El plantel lo diseñas tú', s: 'Crea cracks · Arregla plantillas · Exporta y comparte' },
  cfg: { h: 'El juego, finamente a toda tu medida', s: 'Música · IA · Cancha · Controles · Segundo ajuste' }
};

var CSS = [
'body.hub-on #screen-main-menu{display:none !important}',
'#menu-hub{position:fixed;inset:0;z-index:900;background:#060a12;overflow:hidden;display:none',
';font-family:\'Barlow Condensed\',sans-serif}',
'body.hub-on #menu-hub{display:block}',
'#menu-hub .mh-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;',
'  transition:opacity .8s ease;pointer-events:none}',
'#menu-hub .mh-bg.on{opacity:1}',
'#menu-hub .mh-scrim{position:absolute;inset:0;pointer-events:none;',
'  background:linear-gradient(90deg,rgba(3,10,18,.93) 0%,rgba(3,10,18,.72) 30%,rgba(3,10,18,.30) 58%,rgba(3,10,18,.22) 78%,rgba(3,10,18,.46) 100%),',
'  linear-gradient(0deg,rgba(3,10,18,.55) 0%,rgba(3,10,18,0) 30%)}',
'#menu-hub .mh-logo{position:absolute;top:26px;left:46px;font-style:italic;font-weight:900;font-size:2rem;letter-spacing:1px;',
'  background:linear-gradient(135deg,#eafffb,#25f6c9 60%,#0aa3d8);-webkit-background-clip:text;background-clip:text;color:transparent;',
'  filter:drop-shadow(0 4px 16px rgba(0,0,0,.6));z-index:3}',
'#menu-hub .mh-hubtag{position:absolute;top:30px;right:46px;font-size:.7rem;font-weight:800;letter-spacing:3px;color:rgba(180,255,232,.75);',
'  border:1px solid rgba(120,240,210,.35);border-radius:999px;padding:6px 14px;backdrop-filter:blur(4px);z-index:3}',
'#menu-hub .mh-nav{position:absolute;left:46px;top:110px;bottom:120px;display:flex;flex-direction:column;justify-content:center;',
'  gap:4px;width:34%;min-width:260px;max-width:340px;z-index:2}',
'#menu-hub .mh-item{position:relative;text-align:left;background:none;border:none;cursor:pointer;padding:7px 0 7px 18px;',
'  font-family:\'Barlow Condensed\',sans-serif;font-style:italic;font-weight:700;font-size:1.55rem;letter-spacing:1.5px;',
'  color:rgba(233,244,255,.78);text-transform:uppercase;text-shadow:0 2px 10px rgba(0,0,0,.65);transition:none}',
'#menu-hub .mh-item::before{content:\'\';position:absolute;left:0;top:50%;transform:translateY(-50%);width:7px;height:7px;border-radius:99px;',
'  background:#25f6c9;box-shadow:0 0 12px rgba(37,246,201,.8)}',
'#menu-hub .mh-item.on{color:#fff;font-weight:900;text-shadow:0 0 18px rgba(37,246,201,.35),0 2px 10px rgba(0,0,0,.7)}',
'#menu-hub .mh-panel{position:absolute;left:38%;right:6%;top:50%;transform:translateY(-50%);z-index:2;text-align:left}',
'#menu-hub .mh-h{font-style:italic;font-weight:900;font-size:clamp(1.6rem,2.6vw,2.6rem);line-height:1.12;color:#fff;',
'  text-shadow:0 4px 22px rgba(0,0,0,.75);letter-spacing:.5px;margin:0 0 10px}',
'#menu-hub .mh-sub{font-style:italic;font-weight:600;font-size:1rem;color:rgba(190,255,238,.85);text-shadow:0 2px 10px rgba(0,0,0,.7);margin-bottom:22px}',
'#menu-hub .mh-cta{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.10);',
'  background-image:linear-gradient(120deg,rgba(255,255,255,.16),rgba(255,255,255,.04));',
'  border:1px solid rgba(140,240,220,.45);border-radius:999px;padding:12px 28px;font-family:\'Barlow Condensed\',sans-serif;',
'  font-style:italic;font-weight:800;font-size:1.05rem;color:#eafffb;cursor:pointer;backdrop-filter:blur(8px);',
'  box-shadow:0 10px 28px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.12);text-shadow:0 1px 2px rgba(0,0,0,.4);transition:none}',
'#menu-hub .mh-cta:hover{border-color:#25f6c9;box-shadow:0 12px 32px rgba(37,246,201,.28), inset 0 1px 0 rgba(255,255,255,.14)}',
'#menu-hub .mh-grid-icon{position:absolute;left:1px;top:-2px;font-style:normal;font-size:1.1rem}',
'#menu-hub .mh-foot{position:absolute;left:46px;bottom:18px;font-size:.68rem;font-weight:600;letter-spacing:2px;color:rgba(196,255,239,.5);z-index:2}',
'#menu-hub .mh-back{position:absolute;right:46px;bottom:16px;z-index:2;background:rgba(255,255,255,.08);border:1px solid rgba(140,240,220,.3);',
'  border-radius:999px;color:rgba(233,244,255,.85);font-family:\'Barlow Condensed\',sans-serif;font-style:italic;font-weight:700;',
'  font-size:.8rem;letter-spacing:1px;padding:7px 16px;cursor:pointer;backdrop-filter:blur(6px)}',
'#menu-hub .mh-back:hover{border-color:#25f6c9}',
'.mh-toggle{position:absolute;top:12px;right:14px;z-index:5;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);',
'  border-radius:999px;color:rgba(233,240,255,.8);font:700 11px system-ui;padding:6px 12px;cursor:pointer;backdrop-filter:blur(4px)}',
'.mh-toggle:hover{border-color:#25f6c9;color:#fff}',
'@media (pointer:coarse),(max-width:899px){.mh-toggle{display:none !important}body.hub-on:not(.mh-force) #menu-hub{',
'  display:none !important}body.hub-on #screen-main-menu{display:flex !important;display:-webkit-flex !important}}'
].join('');

var hub = null, lastOn = null;

function forced() { try { return localStorage.getItem('fc27_uimode_force'); } catch (e) { return null; } }
function okPC() {
  if (root.__MH_PC__ === true) return true; /* bandera de pruebas/headless */
  if (forced() === 'hub') return true;      /* 📱 forzar desde Ajustes: "quiero probar el modo PC en mi cel" */
  if (forced() === 'classic') return false;
  try { return (typeof matchMedia === 'function') && matchMedia('(min-width:900px) and (pointer:fine)').matches; }
  catch (e) { return (typeof innerWidth === 'number') && innerWidth >= 900; }
}
function mode() { try { return localStorage.getItem(LS) || 'classic'; } catch (e) { return 'classic'; } }

function build() {
  if (hub || typeof document.body === 'undefined' || !document.body) return;
  hub = document.createElement('div');
  hub.id = 'menu-hub';
  var bgs = '<img class="mh-bg on" data-k="default" src="' + DEFAULT_BG + '" alt="" loading="eager" fetchpriority="high" decoding="async">';
  ITEMS.forEach(function (it) {
    bgs += '<img class="mh-bg" data-k="' + it.k + '" src="' + it.bg + '" alt="" loading="lazy" decoding="async">';
  });
  hub.innerHTML = bgs +
    '<div class="mh-scrim"></div>' +
    '<div class="mh-logo"><img src="assets/fc27-logo.png?v=3" alt="FC 27" style="height:34px;width:auto;filter:drop-shadow(0 4px 14px rgba(30,130,255,.45));"></div>' +
    '<div class="mh-hubtag">FC HUB · PC</div>' +
    '<div class="mh-nav"></div>' +
    '<div class="mh-panel">' +
    '<div class="mh-h" id="mh-h">El fútbol es de todos</div>' +
    '<div class="mh-sub" id="mh-sub">Football Community 2027 · Crea el legado · Vive el sueño</div>' +
    '<button class="mh-cta" id="mh-cta" type="button" style="display:none"></button></div>' +
    '<div class="mh-foot">⬆⬇ Selecciona · 🖱️ pasa el cursor · MODO GRÁFICOS: MEDIO</div>' +
    '<button class="mh-back" type="button" id="mh-back">🖥️ UI clásica ▸▸</button>';
  var nav = hub.querySelector('.mh-nav');
  ITEMS.forEach(function (it) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mh-item';
    b.setAttribute('data-key', it.k);
    b.textContent = it.t;
    b.addEventListener('pointerenter', function () { hover(it); });
    b.addEventListener('mouseover', function () { hover(it); }); /* fallback jsdom/viejos */
    b.addEventListener('focus', function () { hover(it); });
    b.addEventListener('click', function () { go(it.k); });
    nav.appendChild(b);
  });
  hub.addEventListener('mouseleave', function () { hover(null); });
  hub.querySelector('#mh-back').addEventListener('click', function () { apply('classic'); });
  var st = document.createElement('style');
  st.id = 'menu-hub-css';
  st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);
  document.body.appendChild(hub);
  hover(null);
}

function hover(it) {
  if (!hub) return;
  if (lastOn === (it ? it.k : 'default')) return;
  lastOn = it ? it.k : 'default';
  var imgs = hub.querySelectorAll('.mh-bg'), cur = it ? it.k : 'default', i;
  for (i = 0; i < imgs.length; i++) imgs[i].classList.toggle('on', imgs[i].getAttribute('data-k') === cur);
  var items = hub.querySelectorAll('.mh-item');
  for (i = 0; i < items.length; i++) items[i].classList.toggle('on', !!it && items[i].getAttribute('data-key') === it.k);
  var H = document.getElementById('mh-h'), S = document.getElementById('mh-sub'), C = document.getElementById('mh-cta');
  if (it) {
    var p = PANEL_BYKEY[it.k] || { h: it.t, s: it.d };
    if (H) H.textContent = p.h;
    if (S) S.textContent = p.s + ' · ' + it.d;
    if (C) { C.style.display = 'inline-flex'; C.textContent = '🎮 ENTRAR · ' + it.t; C.onclick = function () { go(it.k); }; }
  } else {
    if (H) H.textContent = 'El fútbol es de todos';
    if (S) S.textContent = 'Football Community 2027 · Crea el legado · Vive el sueño';
    if (C) C.style.display = 'none';
  }
}

function go(key) {
  var fn = GO[key];
  if (!fn) return;
  try { fn(); } catch (e) {}
}

function ensureToggle() {
  var scr = document.getElementById('screen-main-menu');
  if (!scr || document.getElementById('mh-toggle')) return;
  var b = document.createElement('button');
  b.type = 'button';
  b.id = 'mh-toggle';
  b.className = 'mh-toggle';
  b.textContent = '🖥️ UI: EA HUB ▸▸';
  b.title = 'Cambiar la interfaz del menú al hub estilo EA (solo PC)';
  b.addEventListener('click', function () { apply('hub'); });
  scr.appendChild(b);
}

function apply(force) {
  build();
  ensureToggle();
  var want = (force === 'classic' || force === 'hub') ? force : mode();
  try { localStorage.setItem(LS, want); } catch (e) {}
  if (force === 'classic') { try { localStorage.removeItem('fc27_uimode_force'); } catch (e2) {} }
  try { document.body.classList.toggle('mh-force', forced() === 'hub'); } catch (e3) {}
  if (okPC() && want === 'hub') document.body.classList.add('hub-on');
  else document.body.classList.remove('hub-on');
}

var MH = { apply: apply, go: go, hoverKey: function (k) { var it = ITEMS.filter(function (x) { return x.k === k; })[0]; hover(it || null); }, isPC: okPC, mode: mode, ITEMS: ITEMS, DIR: DIR };
root.MENUHUB = MH;
if (typeof module !== 'undefined' && module.exports) module.exports = MH;

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { apply(); });
else apply();

/* un solo estado por pestaña: si el usuario redimensiona el viewport, re-aplica */
if (typeof root.addEventListener === 'function') {
  var rt = null;
  root.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { apply(); }, 250);
  });
}
})(typeof self !== 'undefined' ? self : this);
