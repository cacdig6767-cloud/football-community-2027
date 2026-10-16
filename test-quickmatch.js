/* ══ Suite QUICKMATCH v1 (módulo + boot arena FutSal) ══
   Determinista: pool falso, sin red, sin timers largos. */
'use strict';
const fs = require('fs');

let ok = 0, failN = 0;
function assert(cond, msg) { if (cond) { ok++; console.log('  ✓ ' + msg); } else { failN++; console.log('  ✗ ' + msg); } }

/* ── entorno falso ── */
const mem = {};
global.localStorage = {
  getItem: k => (k in mem ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: k => { delete mem[k]; }
};
global.REAL_PLAYERS_POOL = [
  ['George Keeper', 'GK', 88, 30, 'Alpha FC'], ['Second Keeper', 'GK', 76, 24, 'Alpha FC'],
  ['Al Defo', 'DF', 84, 27, 'Alpha FC'], ['Bo Defo', 'DF', 83, 25, 'Alpha FC'],
  ['Cy Defo', 'DF', 82, 26, 'Alpha FC'], ['Di Defo', 'DF', 81, 24, 'Alpha FC'],
  ['Ed Defo', 'DF', 78, 22, 'Alpha FC'], ['Fa Defo', 'DF', 74, 23, 'Alpha FC'],
  ['Gi Mid', 'MF', 87, 26, 'Alpha FC'], ['Ho Mid', 'MF', 86, 25, 'Alpha FC'],
  ['Io Mid', 'MF', 85, 28, 'Alpha FC'], ['Jo Mid', 'MF', 80, 21, 'Alpha FC'],
  ['Ka Mid', 'MF', 76, 22, 'Alpha FC'], ['Le Mid', 'MF', 72, 20, 'Alpha FC'],
  ['Mu Wing', 'FW', 90, 24, 'Alpha FC'], ['Ni Wing', 'FW', 88, 23, 'Alpha FC'],
  ['Ox Nine', 'FW', 86, 27, 'Alpha FC'], ['Pi Wing', 'FW', 74, 19, 'Alpha FC']
].concat([
  ['Zeta Keeper', 'GK', 79, 31, 'Beta Club'], ['Zed One', 'DF', 70, 28, 'Beta Club'],
  ['Zed Two', 'MF', 69, 26, 'Beta Club'], ['Zed Three', 'FW', 68, 25, 'Beta Club']
]);
const QM = require('/home/user/quickmatch.js');

console.log('1) LISTA DE CLUBES');
const cl = QM.clubsList();
assert(cl.length === 2, '2 clubes dedup del pool falso (' + cl.length + ')');
assert(cl[0].n === 'Alpha FC' && cl[0].best === 90, 'Alpha FC primero por rating (★90)');
assert(cl[1].n === 'Beta Club', 'Beta Club segundo');

console.log('2) PLANTILLA + AUTO-XI');
const r = QM.rosterClub('Alpha FC');
assert(r.length === 15, '13 de campo + 2 porteros (' + r.length + ')');
const last2 = r.slice(-2);
assert(last2.every(f => f.p === 'POR'), 'los dos últimos son POR');
assert(last2[0].r >= last2[1].r, 'portero titular ≥ suplente');
const xi = r.slice(0, 10);
const nDEF = xi.filter(f => f.p === 'DEF').length, nDEL = xi.filter(f => f.p === 'DEL').length;
assert(nDEF === 4, '4 defensas en el auto-XI (' + nDEF + ')');
assert(nDEL === 3, '3 delanteros en el auto-XI (' + nDEL + ')');
assert(xi.some(f => f.n === 'Mu Wing'), 'la estrella entra al XI');
assert(!xi.some(f => f.n === 'Pi Wing'), 'el suplente débil no entra al XI');

console.log('3) AUTO-XI FutSal (3v3 → 2 de campo)');
const xi3 = QM.autoXI(r.slice(0, 10).concat(), 2);
assert(xi3.length === 2, '2 jugadores de campo para 3v3 (' + xi3.length + ')');

console.log('4) SELECCIONES');
const arg = QM.rosterNation('Argentina');
assert(arg && arg.length === 15, 'Argentina: 13 campo nominados + 2 POR (' + (arg ? arg.length : 0) + ')');
assert(arg.slice(-2).every(f => f.p === 'POR'), 'Argentina cierra con dos porteros');
assert(QM.rosterNation('Narnia') === null, 'selección inexistente → null');

console.log('5) URL F11 AMISTOSO');
const u1 = QM.buildURL({ mode: 'f11', home: 'Alpha FC', away: 'Beta Club', kindH: 'club', kindA: 'club', diff: 2, mt: 180, rules: 'x2', tie: 'gg', stad: 'wembley', arena: 'concreto', side: 5, event: '' });
assert(u1.err === '', 'sin error en amistoso válido');
assert(u1.url.indexOf('career=1') > 0 && u1.url.indexOf('bus=qr') > 0, 'career=1 + bus=qr');
assert(u1.url.indexOf('mt=180') > 0, 'mt=180 en URL');
assert(u1.url.indexOf('tie=gg') > 0, 'desempate gol de oro elegido');
assert(u1.url.indexOf('rules=x2') > 0, 'regla lejanos x2');
assert(u1.url.indexOf('stad=wembley') > 0, 'estadio Wembley');
assert(u1.url.indexOf('mustWin') < 0, 'amistoso NO es mustWin');
assert(u1.url.indexOf('futsal') < 0, 'amistoso F11 sin futsal');
assert(u1.url.indexOf('club=Alpha%20FC') > 0, 'club local cod');

console.log('6) URL FINAL OFICIAL');
const u2 = QM.buildURL({ mode: 'f11', home: 'Alpha FC', away: 'Beta Club', kindH: 'club', kindA: 'club', diff: 1, mt: 240, rules: 'normal', tie: 'et', stad: 'azteca', arena: 'pro', side: 5, event: 'ucl' });
assert(u2.url.indexOf('mustWin=1') > 0, 'final UCL es mustWin');
assert(u2.url.indexOf('tie=') < 0, 'final oficial no admite chooser de empate');
assert(/Champions/.test(decodeURIComponent(u2.url)), 'el parche nombra la Champions');

console.log('7) URL FUTSAL');
const u3 = QM.buildURL({ mode: 'futsal', home: 'Argentina', away: 'Brasil', kindH: 'nat', kindA: 'nat', diff: 3, mt: 120, rules: 'x2', tie: 'draw', stad: 'azteca', arena: 'favela', side: 4, event: '' });
assert(u3.url.indexOf('futsal=1') > 0, 'futsal=1');
assert(u3.url.indexOf('gg=1') > 0, 'gol de oro forzado en FutSal');
assert(u3.url.indexOf('music=larueda') > 0, '"La Rueda" en FutSal');
assert(u3.url.indexOf('n=3') > 0, '4v4 → 3 de campo + portero');
assert(u3.url.indexOf('rules=none') > 0, 'FutSal fuerza Modo Sin Reglas (x2 bloqueado)');
assert(u3.url.indexOf('walls=1') > 0, 'favela → paredes vivas');
assert(u3.url.indexOf('arena=favela') > 0, 'arena favela seleccionada');
const u3b = QM.buildURL({ mode: 'futsal', home: 'Argentina', away: 'España', kindH: 'nat', kindA: 'nat', diff: 0, mt: 240, rules: 'normal', tie: 'et', stad: 'azteca', arena: 'playa', side: 5, event: '' });
assert(u3b.url.indexOf('walls=1') < 0, 'playa NO trae paredes');
assert(u3b.url.indexOf('n=4') > 0, '5v5 → 4 de campo + portero');

console.log('8) VALIDACIONES');
assert(QM.buildURL({ mode: 'f11', home: 'Alpha FC', away: 'Alpha FC', kindH: 'club', kindA: 'club', diff: 1, mt: 240, rules: 'normal', tie: 'et', stad: 'azteca', arena: 'concreto', side: 5, event: '' }).err !== '', 'mismo equipo → error');
assert(QM.buildURL({ mode: 'f11', home: '', away: 'Alpha FC', kindH: 'club', kindA: 'club', diff: 1, mt: 240, rules: 'normal', tie: 'et', stad: 'azteca', arena: 'concreto', side: 5, event: '' }).err !== '', 'sin equipos → error');
const uClamp = QM.buildURL({ mode: 'futsal', home: 'Argentina', away: 'Brasil', kindH: 'nat', kindA: 'nat', diff: 0, mt: 60, rules: 'normal', tie: 'et', stad: 'azteca', arena: 'pro', side: 9, event: '' });
assert(uClamp.url.indexOf('n=4') > 0, 'side 9 clamp → n=4 (5v5 tope)');
const car = QM.colorsOf('Argentina');
assert(car[0] === '#7ac2ec', 'colores de Argentina desde NATIONS');

console.log('9) COLORES CLUB vía TEAM_COLORS');
global.TEAM_COLORS = { 'Alpha FC': '#112233' };
assert(QM.colorsOf('Alpha FC')[0] === '#112233', 'color del club desde TEAM_COLORS');

(async () => {
  console.log('10) BOOT ARENA FUTSAL (jsdom, sin carrera)');
  const { JSDOM, VirtualConsole } = require('jsdom');
  const html = fs.readFileSync('/home/user/haxball-fc27.html', 'utf-8');
  const vc = new VirtualConsole(); const errs = [];
  vc.on('jsdomError', e => errs.push(String(e && e.message || e)));
  const dom = new JSDOM(html, {
    url: 'http://localhost/?futsal=1&n=2&walls=1&mt=30&arena=pro&music=larueda&rules=none',
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(window) {
      window.__TEST__ = true; window.__NOREPLAY__ = true;
      window.HTMLCanvasElement.prototype.getContext = function () {
        return new Proxy({}, { get(t, p) {
          if (p === 'createLinearGradient' || p === 'createRadialGradient') return () => ({ addColorStop() {} });
          if (p === 'measureText') return () => ({ width: 0 });
          return () => {};
        }, set() { return true; } });
      };
    }
  });
  await new Promise(r => setTimeout(r, 700));
  const dbg = dom.window.__dbg;
  assert(!!dbg, 'hook __dbg expuesto en modo test');
  if (dbg) {
    assert(dbg.FUTSAL === true, 'FUTSAL detectado');
    assert(dbg.WALLS === true, 'paredes activas por URL');
    assert(dbg.GG === true, 'gol de oro forzado en FutSal');
    assert(dbg.SIDE === 2, 'SIDE=2 de campo (3v3)');
    assert(dbg.RULES === 'none', 'reglas none');
    assert(dbg.MT === 30, 'mt=30s por parte');
    assert(dbg.FIELD.w > 600 && dbg.FIELD.w < 900, 'cancha FutSal punto medio (w=' + dbg.FIELD.w + ')');
    assert(dbg.FIELD.h > 320 && dbg.FIELD.h < 460, 'cancha FutSal media (h=' + dbg.FIELD.h + ')');
    assert(dbg.GOAL.h === 116, 'arco FutSal a medida (' + dbg.GOAL.h + ')');
    assert(dbg.spotsN(4).length === 4, 'spotsN(4) dibuja cuatro puntos');
    assert(dbg.spotsN(1).length === 1, 'spotsN(1) dibuja un punto');
  }
  assert(errs.filter(e => /ReferenceError|SyntaxError|TypeError/.test(e)).length === 0, '0 errores jsdom fatales (' + errs.length + ' genéricos)');
  /* -- chooser estilo Classic Match (v5.2) ------------------------ */
  {
    const nats = QM.listFor('nat');
    assert(nats.length === 24 && nats[0] === 'Argentina', 'listFor nat: 24 selecciones ordenadas');
    const clubs = QM.listFor('club');
    assert(clubs.length >= 2 && typeof clubs[0] === 'string', 'listFor club: top pool (' + clubs[0] + ')');
    assert(QM.teamRate('Argentina', 'nat') === 90, 'teamRate Argentina = 90');
    assert(QM.teamRate('Alpha FC', 'club') === 90, 'teamRate Alpha FC = 90 (mejor ficha: Mu Wing)');
    const cNat = QM.crestOf('nat', 'Argentina');
    assert(/qm-flagbig|qm-shield/.test(cNat), 'crestOf nat da bandera o escudo');
    const cClub = QM.crestOf('club', 'Alpha FC');
    assert(/qm-crestimg|qm-shield/.test(cClub), 'crestOf club da crest o escudo');
    assert(cClub.indexOf('AF') >= 0, 'escudo fallback lleva iniciales AF');
    /* defaults clásico (v5.3): HOME = FC Barcelona · AWAY = Real Madrid */
    global.REAL_PLAYERS_POOL.push(['Lewa', 'FW', 89, 35, 'FC Barcelona'], ['Ter Stegen', 'GK', 88, 35, 'FC Barcelona'],
      ['Vinicius', 'FW', 92, 25, 'Real Madrid'], ['Courtois', 'GK', 89, 33, 'Real Madrid']);
    assert(QM.defPick(QM.listFor('club'), 'FC Barcelona') === 'FC Barcelona', 'defPick cae en FC Barcelona si existe');
    assert(QM.defPick(QM.listFor('club'), 'Real Madrid') === 'Real Madrid', 'defPick cae en Real Madrid si existe');
    assert(QM.defPick([], 'FC Barcelona') === '', 'defPick con lista vacia da cadena vacia');
  }
  /* overlay real: flechas carrusel + JUGAR (hotfix root→body) */
  {
    const QMSRC = fs.readFileSync('/home/user/quickmatch.js', 'utf8');
    const jsdom = new JSDOM('<!DOCTYPE html><body></body>', { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
    global.window = jsdom.window; global.document = jsdom.window.document; global.self = jsdom.window;
    jsdom.window.REAL_PLAYERS_POOL = global.REAL_PLAYERS_POOL;
    jsdom.window.eval(QMSRC);
    const qm = jsdom.window.QUICKMATCH;
    let openOk = false, cycled = false, goOk = false, errTxt = '';
    try {
      qm.open();
      openOk = !!jsdom.window.document.getElementById('qm-body');
      const tn = () => (jsdom.window.document.querySelector('.qm-panel .qm-teamname') || { textContent: '' }).textContent;
      const home1 = tn();
      const arr = jsdom.window.document.querySelector('.qm-arr.qm-r');
      if (arr) arr.click();
      const home2 = tn();
      cycled = openOk && home1 !== home2;
      errTxt = '(' + home1 + ' → ' + home2 + ')';
      const go = jsdom.window.document.getElementById('qm-go');
      if (go) { go.click(); goOk = !jsdom.window.document.querySelector('#qm-body .qm-tips'); }
      goOk = goOk && !!jsdom.window.document.querySelector('iframe');
    } catch (e) { errTxt = String((e && e.message) || e); goOk = false; }
    assert(openOk, 'overlay QM abre (qm-body presente) ' + errTxt);
    assert(cycled, 'flechas ‹ › CAMBIAN el equipo ' + errTxt);
    assert(goOk, 'botón JUGAR AHORA lanza la cancha (iframe creado) ' + errTxt);
  }
  console.log('\nRESULTADO QUICKMATCH: ' + ok + ' ok / ' + failN + ' fail');
  process.exit(failN ? 1 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
