/* ═══════════════════════════════════════════════════════════════════════════
   FC27 SKIN v1.1 · el juego se viste de TEAL & NAVY (estilo EA FC27)
   ─────────────────────────────────────────────────────────────────────────
   v1.1: fondo de haz diagonal recreado (carga + menú), popups de cristal
   marino, chooser tipo Classic Match. Solo estilo; nada de organización.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
if (typeof document === 'undefined') return;
if (document.getElementById('fc27-skin-css')) document.getElementById('fc27-skin-css').remove();

/* haz diagonal del póster EA FC27, reconstruido 100% con gradientes */
var BEAMS =
"linear-gradient(118deg,"
+"rgba(255,255,255,0) 56.5%,"
+"rgba(196,255,236,.13) 59.5%,"
+"rgba(228,255,244,.40) 61.6%,"
+"rgba(255,255,255,.48) 62.2%,"
+"rgba(228,255,244,.40) 62.8%,"
+"rgba(196,255,236,.13) 64.5%,"
+"rgba(255,255,255,0) 68%),"
"linear-gradient(180deg,"
+"rgba(255,255,255,0) 60%,"
+"rgba(2,8,15,.5) 100%),"
"linear-gradient(121deg,"
+"#030d18 0%,#041520 16%,#052430 30%,#063d4e 42%,#0a6464 52%,#0f9d88 60%,"
+"#17c9a5 68%,#12a386 74%,#0a6a67 82%,#04222e 91%,#030d18 100%)";

var CSS = [
'body{background:radial-gradient(1200px 700px at 78% -12%,#123f45 0%,#0a2133 38%,#061222 62%,#040b16 100%) !important}',
'::selection{background:rgba(37,246,201,.32)}',
'::-webkit-scrollbar-thumb{background:linear-gradient(#25f6c9,#0aa3d8) !important;border-radius:99px}',

'/* pantallas madre: haz diagonal teal (carga y menú principal) */',
'#loading-screen,.fc-menu-screen{background:' + BEAMS + ' !important}',
'#loading-screen .load-aurora.a1{background:#0aa3d8 !important;opacity:.30 !important}',
'#loading-screen .load-aurora.a2{background:#25f6c9 !important;opacity:.26 !important}',
'.fc-menu-screen::before{background:radial-gradient(ellipse at 34% 38%,rgba(37,246,201,.10) 0%,transparent 55%) !important}',
'.fc-menu-screen::after{background:linear-gradient(180deg,rgba(2,10,17,.15) 0%,rgba(2,10,17,.55) 100%) !important}',

'/* marca gigante: itálica condensada con degradado mar→hielo */',
'.fc-title{font-family:\'Barlow Condensed\',\'Arial Black\',sans-serif;font-style:italic;font-weight:900;letter-spacing:1px}',
'.fc-title-big,.load-fc-big{',
'  display:block;font-family:\'Barlow Condensed\',\'Arial Black\',sans-serif;font-style:italic;font-weight:900;',
'  letter-spacing:1px;line-height:.9;',
'  background:linear-gradient(135deg,#eafffb 6%,#7efcd9 40%,#1fcbb6 66%,#0aa3d8 100%);',
'  -webkit-background-clip:text;background-clip:text;color:transparent;',
'  filter:drop-shadow(0 6px 22px rgba(10,60,70,.6));transform:skewX(-3deg);',
'}',
'.fc-title-big{font-size:clamp(3.4rem,10vw,6.8rem)}',
'.load-fc-big{font-size:clamp(3.6rem,17vw,7.6rem);margin:6px 0 2px}',
'.fc-title-big i,.load-fc-big i{font-style:italic;padding-left:.04em}',
'.fc-title-sub,.load-fc-sub{',
'  display:block;margin:8px 0 2px;font-size:clamp(.66rem,1.7vw,.85rem);font-weight:700;',
'  letter-spacing:6px;color:rgba(196,255,239,.74);text-transform:uppercase;font-style:italic',
'}',
'.fc-year{display:none !important}',

'/* ── tarjetas / popups: vidrio marino, radios generosos ── */',
'.pes-panel,.cup-card,.trn-card,.qm-card,.imp-card,.fc27-card,.slc-card,.rst-tablewrap,.c27-card,.card,',
'.gd-card{',
'  background:linear-gradient(165deg,rgba(17,48,64,.72),rgba(7,21,36,.78)) !important;',
'  border:1px solid rgba(64,220,200,.26) !important;',
'  border-radius:22px !important;',
'  box-shadow:0 16px 40px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.05) !important;',
'}',
'.gd-msg{color:#eafffb !important}',
'.imp-reveal{background:linear-gradient(160deg,rgba(32,70,90,.7),rgba(14,32,52,.8)) !important;border:2px dashed rgba(64,220,200,.45) !important;border-radius:24px !important}',
'.trn-m,.qm-sel,.imp-sel,.trn-inp,.trn-sel,.rst-sel,input[type=text],input[type=number],select,textarea{',
'  background:rgba(6,20,32,.65) !important;border:1px solid rgba(64,220,200,.22) !important;',
'  color:#eafffb !important;border-radius:12px !important;',
'}',
'select:focus,input:focus,textarea:focus{border-color:#25f6c9 !important;outline:none;box-shadow:0 0 0 3px rgba(37,246,201,.14)}',

'/* ── botones: cristal pastilla que se funde con el fondo ── */',
'.fc-btn,.rst-btn,.btn-primary,.btn-secondary,.btn-ghost,.trn-btn,.trn-ktab,.trn-x,.imp-back,.imp-big,.imp-pb,.imp-pm button,.thi-c,.thi-back,.slc-btn,',
'.gd-btns button,#loading-screen button,.imp-go{',
'  background:rgba(255,255,255,.09) !important;',
'  background-image:linear-gradient(120deg,rgba(255,255,255,.14),rgba(255,255,255,.03)) !important;',
'  color:#eafffb !important;border:1px solid rgba(140,240,220,.34) !important;',
'  border-radius:999px !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;',
'  box-shadow:0 8px 22px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.10) !important;',
'  text-shadow:0 1px 2px rgba(0,0,0,.4) !important;',
'}',
'.fc-btn:hover,.rst-btn:hover,.btn-primary:hover,.trn-btn:hover,.trn-ktab:hover,.imp-big:hover,.imp-pb:hover,.thi-c:hover,.slc-btn:hover,.gd-btns button:hover,#loading-screen button:hover{',
'  transform:translateY(-2px) !important;border-color:#25f6c9 !important;',
'  box-shadow:0 12px 30px rgba(37,246,201,.22), inset 0 1px 0 rgba(255,255,255,.14) !important;',
'}',
'.qm-btn,.imp-go,.gd-btns button.primary{',
'  background:linear-gradient(180deg,#25f6c9,#0ec2a0) !important;color:#04241c !important;font-weight:900 !important;',
'}',
'.qm-btn:hover,.imp-go:hover{box-shadow:0 14px 34px rgba(37,246,201,.35) !important}',
'.imp-mode.on,.qm-mode.on,.qm-ven.on,.imp-chip.on,.qm-chip.on,.thi-c.on{',
'  border-color:#25f6c9 !important;background:linear-gradient(160deg,rgba(37,246,201,.20),rgba(16,58,66,.55)) !important;',
'}',
'.fc-btn small{color:rgba(234,255,251,.72) !important;font-weight:600 !important}',

'/* ── feedback de cabecera y módulos ── */',
'#loading-screen{background:' + BEAMS + ' !important}',
'.load-tip,.load-pct{color:#8ffce4 !important}',
'.load-bar>div{background:linear-gradient(90deg,#0aa3d8,#25f6c9) !important}',
'.load-logo{display:none !important}',
'.load-ball{font-size:2.6rem !important}',
'.fc-top,.pes-nav-top,.fc27-topbar{background:linear-gradient(180deg,rgba(8,26,40,.92),rgba(6,17,29,.92)) !important;border-bottom:1px solid rgba(64,220,200,.18) !important}',
'.pes-tab{background:rgba(255,255,255,.05) !important;border-radius:14px !important;border:1px solid rgba(255,255,255,.10) !important}',
'.pes-tab.active{background:linear-gradient(160deg,rgba(37,246,201,.22),rgba(14,52,60,.5)) !important;border-color:#25f6c9 !important}',
'.trn-top h1,.imp-title,.qm-h,.imp-h,.thi-h{color:#8ffce4 !important}',
'.trn-btn{border-radius:999px !important}','.gold{color:#ffd166 !important}'
].join('\n');

var st = document.createElement('style');
st.id = 'fc27-skin-css';
st.textContent = CSS;
(document.head || document.documentElement).appendChild(st);

/* marca FC 27 (menú + carga), tolerante a HTML viejo en caché */
function brand(){
  var t = document.querySelector('.fc-menu-right .fc-title');
  if (t && !t.querySelector('.fc-title-big')) t.innerHTML = '<span class="fc-title-big">FC <i>27</i></span>';
  if (t && !t.parentNode.querySelector('.fc-title-sub')){
    var sub = document.createElement('span'); sub.className = 'fc-title-sub';
    sub.textContent = 'Football Community 2027';
    t.parentNode.insertBefore(sub, t.nextSibling);
  }
  var lb = document.querySelector('#loading-screen .load-bottom');
  if (lb && !lb.querySelector('.load-fc-big')){
    var logo = lb.querySelector('.load-logo'); if (logo) logo.style.display = 'none';
    var ball = lb.querySelector('.load-ball');
    var big = document.createElement('div'); big.className = 'load-fc-big'; big.innerHTML = 'FC <i>27</i>';
    var sub2 = document.createElement('div'); sub2.className = 'load-fc-sub'; sub2.textContent = 'Football Community 2027';
    lb.insertBefore(sub2, ball ? ball.nextSibling : lb.firstChild);
    lb.insertBefore(big, sub2);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brand);
else brand();

/* ── popup de novedades: aparece una vez por versión desplegada ─────────────
   Mantener: al soltar un deploy toca subir BUILD para que reaparezca. */
var BUILD = 'v6.12';
var NEWS = [  '🎬 <strong>GRÁFICOS ALTOS AHORA SON VÍDEO DE VERDAD</strong>: estadio nocturno respirando, la estrella UCL palpitando, CR7 celebrando entre confeti y el Clásico con vida propia — bucles de 8 segundos en calidad mejorada con IA, que solo se mueven cuando el fondo está visible (cero chupada de batería). El fondo por defecto del menú ALTO vuelve a ser el <b>estadio de siempre</b>… pero animado.',
  '🧹 <strong>PANTALLA DE CARGA LIMPIA</strong>: la foto de Lamine Yamal de fondo y solo la <b>barra de carga</b> y el botón <b>▶ ENTRAR AL JUEGO</b>. Sin pelota, sin textos — como la de un juego de verdad.',

  '🚪 <strong>«← Menú» de PARTIDO RÁPIDO arreglado</strong>: en el hub de amistosos/FutSal el botón de salir no hacía nada (solo cerraba partidos ya empezados). Ahora vuelve al menú de verdad — y con los gráficos MEDIO/ALTO el fondo animado te espera como debe ser.',
  '🩹 <strong>ARREGLADOS los botones de ⚙️ Ajustes y «← Volver al menú»</strong> con los gráficos de menú estilo EA (MEDIO/ALTO ⚡): la capa del hub se estaba tragando los clics — ahora se aparta solo cuando entras a una pantalla y regresa al salir.',
  '🖼️ <strong>NUEVA PANTALLA DE CARGA</strong>: la promo oficial de FC27 con Lamine Yamal de fondo tras el «▶ ENTRAR AL JUEGO» en gráficos MEDIO y ALTO (la interfaz Clásica conserva la carga oscura de siempre).',
  '🛠️ <strong>JUGADORES REALES DONDE TOCABA</strong>: en Torneos (¡Champions incluida!) los clubes reales salen con su plantilla auténtica — el Barça con Lamine y Pedri, el Madrid con Mbappé… — y las selecciones con nombres reales completos. Y al <b>CREAR TU CLUB</b> en Carrera Manager heredas la plantilla REAL del equipo sustituido (la vista previa del asistente también).',
  '🎙️ <strong>RUEDAS DE PRENSA RENOVADAS</strong> (Manager y Jugador): miles de preguntas distintas, siempre sobre <b>TU club</b> — tu próximo rival, tu estrella, tu cantera, tu racha… Se acabó eso de que te pregunten por fichajes de equipos que no son los tuyos. Y con respuestas que mueven moral y confianza.',
  '🧭 <strong>MERCADO COHERENTE</strong>: 106 nubes de traspaso nuevas y realistas — los cracks mundiales solo suenan para clubes a su altura (nada de Musiala al Motagua 😅), la MLS/MX mueve el maletín por veteranos y tu Liga Nacional recibe préstamos de promesas. Además: <b>RENUNCIA</b> a tu club o a tu selección cuando quieras, sin esperar al verano.',
  '🖥️ <strong>MODO PC EN TU CELULAR</strong>: ¿querías probar el hub estilo EA del menú? Ahora puedes forzarlo tú mismo: entra a <b>Ajustes → 🖥️ Gráficos de UI del menú → Estilo PC / EA Hub</b>. Pon el teléfono en horizontal para la experiencia completa.',
  '⚡ <strong>MODO GRÁFICOS ALTO</strong> (nuevo, en la misma tarjeta de Ajustes): el menú hub ahora tiene fondos <b>animados</b> por modo — CR7 en Carrera Jugador, Mourinho celebrando en Manager (¡sin marca de agua!, está en movimiento real), El Clásico en Partido Rápido y el estadio digital en Torneos. Con Ken Burns cinematográfico en el resto.',
  '⭐ <strong>EVENTO CHAMPIONS en Ultimate Team</strong>: 16 cartas con arte propio UCL 25/26 (99-108) y sobre propio en la tienda (12.000 💰).',
  '⛓️ <strong>EVENTO BLUE LOCK</strong>: Rin, Kaiser, Sae, Nagi, Bachira, Barou, Chigiri, Loki, Bunny y Gagamaru — 10 cartas prismáticas del anime (101-108).',
  '🌈 <strong>EMMANUEL 119</strong>: la carta del barrio — chase card arcoíris oculta en ambos sobres nuevos (1% por carta) y canjeable directa con el código <b>EMMANUEL119</b>. #22 Honduras 🇭🇳',
  '🎟️ Códigos nuevos del evento en UT: <b>CHAMPIONSX</b> (+2.500💰) y <b>EGOISTA</b> (+1.500💰).'
];
var Sfn = null;
function newsPopup(){
  try { if (typeof localStorage !== 'undefined' && localStorage.getItem('fc27_seen_build') === BUILD) return; } catch (e) {}
  function show(){
    Sfn = show;
    if (document.getElementById('fc27-news-go')) return;
    if (document.getElementById('loading-screen')) { setTimeout(show, 500); return; }
    var c = document.createElement('div');
    c.id = 'fc27-news';
    c.setAttribute('role', 'dialog');
    c.setAttribute('style', 'position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:99995;box-sizing:border-box;max-width:92vw;width:400px;background:linear-gradient(165deg,rgba(17,48,64,.94),rgba(7,21,36,.95));border:1px solid rgba(64,220,200,.4);border-radius:20px;padding:14px 16px;box-shadow:0 18px 50px rgba(0,0,0,.55);font-family:system-ui,sans-serif;color:#eafffb;backdrop-filter:blur(8px)');
    c.innerHTML = '<div style="font-weight:900;font-size:14px;letter-spacing:1px;color:#8ffce4;margin-bottom:8px">🎉 ACTUALIZACIÓN ' + BUILD + '</div>' +
      '<ul style="margin:0 0 10px;padding-left:18px;font-size:12.5px;line-height:1.65;color:#d6f4ea">' +
      NEWS.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      '<button id="fc27-news-go" style="background:linear-gradient(180deg,#25f6c9,#0ec2a0);border:none;border-radius:999px;color:#04241c;font-weight:900;font-size:13px;padding:10px 26px;cursor:pointer;box-shadow:0 8px 22px rgba(37,246,201,.3);width:100%">¡A JUGAR! ⚽</button>';
    (document.body || document.documentElement).appendChild(c);
    var go = document.getElementById('fc27-news-go');
    if (go) go.onclick = function () {
      try { localStorage.setItem('fc27_seen_build', BUILD); } catch (e) {}
      if (c.parentNode) c.parentNode.removeChild(c);
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(show, 900); });
  else setTimeout(show, 900);
}
newsPopup();

window.FC27SKIN = {
  version: '1.7', build: BUILD,
  /* pruebas/harness: forzar la tarjeta de novedades (showNews) */
  showNews: function () { try { if (Sfn) Sfn(); } catch (e) {} }
};
})();
