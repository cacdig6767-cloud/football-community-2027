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
"linear-gradient(114deg,"
+"rgba(255,255,255,0) 58%,"
+"rgba(64,242,207,.13) 63%,"
+"rgba(185,255,232,.30) 66.5%,"
+"rgba(185,255,232,.10) 68%,"
+"rgba(255,255,255,0) 74%),"
"linear-gradient(100deg,"
+"rgba(255,255,255,0) 84%,"
+"rgba(37,214,185,.12) 87.5%,"
+"rgba(255,255,255,0) 92%),"
"linear-gradient(121deg,"
+"#04111f 0%,#052033 26%,#07384a 46%,#0a5a5e 60%,#0d7d72 68%,#0b5259 76%,#062640 88%,#04101d 100%)";

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

window.FC27SKIN = { version: '1.1' };
})();
