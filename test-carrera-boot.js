/* ── E2E: carrera-jugador.html REAL en jsdom — boot limpio + rueda de prensa viva ══
   Arranca el HTML del modo Jugador, inyecta news-hub/press-bank si el loader externo
   no corrió en el sandbox, dispara NEWSHUB.pressPlayer contra el DOM real y verifica:
   pregunta del BANCO (con «firma»), click en opción y efecto en S.morale.
   Corre con: node test-carrera-boot.js                                       */
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const FILE = process.argv[2] || '/home/user/carrera-jugador.html';
const html = fs.readFileSync(FILE, 'utf-8');

let ok = 0, bad = 0;
const errors = [];
const A = (c, m) => { if (c) { ok++; console.log('  ✓ ' + m); } else { bad++; console.log('  ✗ ' + m); } };

const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + ((e.detail && e.detail.message) || e.message)));
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

const dom = new JSDOM(html, {
  url: 'http://localhost/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(window) {
    const mem = {};
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); },
      removeItem: k => { delete mem[k]; }, clear: () => { Object.keys(mem).forEach(k => delete mem[k]); },
      key: i => Object.keys(mem)[i] ?? null, get length() { return Object.keys(mem).length; } } });
    window.HTMLCanvasElement.prototype.getContext = function () {
      return new Proxy({}, { get: (t, p) => p === 'canvas' ? null : (p === 'measureText' ? () => ({ width: 0 }) : () => ({})) });
    };
    window.AudioContext = window.webkitAudioContext = function () { return { createGain: () => ({ connect() {}, gain: {} }), createOscillator: () => ({ connect() {}, start() {}, stop() {}, frequency: {} }), createBufferSource: () => ({ connect() {}, start() {} }), createBuffer: () => ({}), resume() { return Promise.resolve(); }, destination: {} }; };
  }
});
const window = dom.window;
global.window = window; global.document = window.document;

setTimeout(() => {
  console.log('── boot Carrera Jugador ' + (errors.length ? '(avisos: ' + errors.length + ')' : '(limpio)') + ' ──');
  errors.slice(0, 4).forEach(e => console.log('   ! ' + e.slice(0, 160)));

  /* los <script src> externos no los trae jsdom en sandbox: inyección manual = lo que hace el navegador */
  if (typeof window.PRESSBANK === 'undefined') {
    try { window.eval(fs.readFileSync('/home/user/press-bank.js', 'utf-8')); } catch (e) { errors.push('press-bank eval: ' + e.message); }
  }
  if (typeof window.NEWSHUB === 'undefined') {
    try { window.eval(fs.readFileSync('/home/user/news-hub.js', 'utf-8')); } catch (e) { errors.push('news-hub eval: ' + e.message); }
  }

  A(errors.filter(e => /jsdomError/.test(e)).length === 0, 'boot sin excepciones JS (' + errors.length + ' avisos)');
  A(typeof window.PRESSBANK === 'object' && typeof window.PRESSBANK.plQS === 'function', 'PRESSBANK vivo en la ventana real');
  A(typeof window.NEWSHUB === 'object' && typeof window.NEWSHUB.pressPlayer === 'function', 'NEWSHUB.pressPlayer disponible');
  A(typeof window.slog === 'function' || typeof window.S === 'object', 'runtime del modo Jugador presente (S/slog)');

  /* documento real: lazy imgs + reduced-motion + enlace al banco */
  A(document.querySelectorAll('img[loading="lazy"]').length >= 2, 'imágenes lazy en el DOM (' + document.querySelectorAll('img[loading="lazy"]').length + ')');
  A(/prefers-reduced-motion/.test(document.head.innerHTML), 'CSS prefers-reduced-motion inyectado en el <head>');
  A(/src="press-bank\.js"/.test(document.documentElement.outerHTML), '<script src="press-bank.js"> enlazado');

  /* 🎙️ rueda de prensa REAL contra el DOM del juego */
  const S2 = { name: 'Tú Crack', club: { name: 'Olimpia', lk: 'hon' }, morale: 60, lastRating: 8.1, rhythm: 'MUY', newsHub: null, pressOff: false, pos: 'DEL', age: 22 };
  let threw = null;
  try { window.NEWSHUB.ensure(S2); window.NEWSHUB.pressPlayer(S2, 1, true); } catch (e) { threw = e; }
  A(!threw, 'pressPlayer no lanza excepción' + (threw ? ': ' + threw.message : ''));

  setTimeout(() => { /* el juego enlaza los onlick ~80ms tras abrir el modal: espera como un dedo humano */
    const qBox = document.querySelector('#mon-body');
    const qTxt = qBox ? qBox.textContent : '';
    A(!!qBox && /«/.test(qTxt), 'la sala muestra pregunta del BANCO (firma medio/periodista «…»)');
    A(/Olimpia|Tú Crack/.test(qTxt), 'la pregunta habla de TI / tu club: «' + qTxt.replace(/\s+/g, ' ').slice(9, 96) + '…»');

    const opt = document.querySelector('#mon-body .nh-opt');
    A(!!opt, 'opciones renderizadas en el modal nativo');
    const m0 = S2.morale;
    if (opt) opt.click();
    A(opt ? S2.morale >= 0 && S2.morale <= 100 && S2.morale !== m0 : S2.morale === m0,
        'click en respuesta → moral aplicada (' + m0 + ' → ' + S2.morale + ')');

    setTimeout(() => { /* feedback +1.1s → siguiente pregunta encadenada */
      const body2 = document.querySelector('#mon-body');
      const q2 = body2 ? body2.textContent : '';
      A(!opt || q2 !== qTxt, 'la sala avanza tras responder (siguiente pregunta)');

      console.log('');
      console.log('RESULTADO CARRERA-BOOT: ' + ok + ' ok / ' + bad + ' fail');
      process.exit(bad ? 1 : 0);
    }, 1500);
  }, 450);
}, 1500);
