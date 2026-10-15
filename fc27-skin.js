/* ═══════════════════════════════════════════════════════════════════════════
   FC27 SKIN v1.0 · el juego se viste de TEAL & NAVY (estilo EA FC27)
   ─────────────────────────────────────────────────────────────────────────
   Solo estilo: gradientes océano profundo → menta, botones tipo cristal
   con bordes bien redondeados, tipografía italiana condensada. La
   organización/pantallas/flujo NO se toca. Se aplica solo al DOM visible.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
if (typeof document === 'undefined') return;
if (document.getElementById('fc27-skin-css')) return;

var CSS = [

'/* ── lienzo global: noche de estadio con halógenos menta ── */',
'body{',
'  background:radial-gradient(1200px 700px at 78% -12%,#123f45 0%,#0a2133 38%,#061222 62%,#040b16 100%) !important;',
'}',
'::selection{background:rgba(37,246,201,.32)}',
'::-webkit-scrollbar-thumb{background:linear-gradient(#25f6c9,#0aa3d8) !important;border-radius:99px}',

'/* ── tarjetas y paneles: vidrio marino, bordes 100% redondeados (nada cuadrado) ── */',
'.pes-panel,.cup-card,.trn-card,.qm-card,.imp-card,.fc27-card,.slc-card,.rst-tablewrap,.c27-card,.card{',
'  background:linear-gradient(165deg,rgba(18,50,66,.66),rgba(8,22,38,.72)) !important;',
'  border:1px solid rgba(64,220,200,.24) !important;',
'  border-radius:20px !important;',
'  box-shadow:0 14px 34px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.05) !important;',
'}',
'.imp-reveal{',
'  background:linear-gradient(160deg,rgba(32,70,90,.7),rgba(14,32,52,.8)) !important;',
'  border:2px dashed rgba(64,220,200,.45) !important;border-radius:24px !important;',
'}',
'.trn-m,.qm-sel,.imp-sel,.trn-inp,.trn-sel,.rst-sel,input[type=text],input[type=number],select,textarea{',
'  background:rgba(6,20,32,.65) !important;',
'  border:1px solid rgba(64,220,200,.22) !important;',
'  color:#eafffb !important;',
'  border-radius:12px !important;',
'}',
'select:focus,input:focus,textarea:focus{border-color:#25f6c9 !important;outline:none;box-shadow:0 0 0 3px rgba(37,246,201,.14)}',

'/* ── botones: cristal translúcido que se funde con el fondo, shape de pastilla ── */',
'.fc-btn,.rst-btn,.btn-primary,.btn-secondary,.btn-ghost,.trn-btn,.trn-ktab,.trn-x,.imp-back,.imp-big,.imp-go,.imp-pb,.imp-pm button,.thi-c,.thi-back,.slc-btn{',
'  background:rgba(255,255,255,.09) !important;',
'  background-image:linear-gradient(120deg,rgba(255,255,255,.14),rgba(255,255,255,.03)) !important;',
'  color:#eafffb !important;',
'  border:1px solid rgba(140,240,220,.34) !important;',
'  border-radius:999px !important;',
'  backdrop-filter:blur(8px) !important;',
'  -webkit-backdrop-filter:blur(8px) !important;',
'  box-shadow:0 8px 22px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.10) !important;',
'  text-shadow:0 1px 2px rgba(0,0,0,.4) !important;',
'}',
'.fc-btn:hover,.rst-btn:hover,.btn-primary:hover,.trn-btn:hover,.trn-ktab:hover,.imp-big:hover,.imp-go:hover,.imp-pb:hover,.thi-c:hover,.slc-btn:hover{',
'  transform:translateY(-2px) !important;',
'  border-color:#25f6c9 !important;',
'  box-shadow:0 12px 30px rgba(37,246,201,.22), inset 0 1px 0 rgba(255,255,255,.14) !important;',
'}',
'.qm-btn,.imp-go{',
'  background:linear-gradient(180deg,#25f6c9,#0ec2a0) !important;',
'  color:#04241c !important;font-weight:900 !important;border-radius:999px !important;',
'}',
'.qm-btn:hover,.imp-go:hover{box-shadow:0 14px 34px rgba(37,246,201,.35) !important}',
'.btn-primary{color:#04241c !important}',
'.imp-mode.on,.qm-mode.on,.qm-ven.on,.imp-chip.on,.qm-chip.on,.thi-c.on,.trn-ktab.on,.imp-chip.on{',
'  border-color:#25f6c9 !important;',
'  background:linear-gradient(160deg,rgba(37,246,201,.20),rgba(16,58,66,.55)) !important;',
'}',
'.fc-btn small{color:rgba(234,255,251,.72) !important;font-weight:600 !important}',

'/* ── pantallas principales: fondo océano→menta como el póster ── */',
'.fc-menu-screen{',
'  background:linear-gradient(118deg,rgba(3,14,26,.82) 0%,rgba(6,32,44,.55) 38%,rgba(12,70,80,.45) 72%,rgba(4,16,28,.85) 100%),radial-gradient(1000px 620px at 72% -8%,rgba(32,214,190,.34),rgba(0,0,0,0) 60%),radial-gradient(900px 700px at 6% 110%,rgba(14,90,120,.40),rgba(0,0,0,0) 62%) !important;',
'}',
'.fc-menu-screen::before{background:radial-gradient(ellipse at 34% 38%,rgba(37,246,201,.12) 0%,transparent 55%) !important}',
'.fc-menu-screen::after{background:radial-gradient(ellipse at center,transparent 42%,rgba(1,8,14,.62) 100%) !important}',
'.fc-hero-glow{background:radial-gradient(ellipse at center,rgba(37,246,201,.30) 0%,transparent 60%) !important}',
'.fc-hero-player{filter:drop-shadow(0 0 40px rgba(37,246,201,.30)) drop-shadow(0 10px 30px rgba(0,0,0,.6)) !important}',

'/* ── MARCA: FC 27 gigante itálica con degradado mar a hielo ── */',
'.fc-title,:root{font-family:inherit}',
'.fc-title{font-family:\'Barlow Condensed\',\'Arial Black\',sans-serif;font-style:italic;font-weight:900;letter-spacing:1px}',
'.fc-title .fc-title-big{',
'  display:block;font-size:clamp(3.4rem,10vw,6.8rem);line-height:.92;',
'  background:linear-gradient(135deg,#eafffb 8%,#7efcd9 42%,#19c9b4 68%,#0aa3d8 100%);',
'  -webkit-background-clip:text;background-clip:text;color:transparent;',
'  filter:drop-shadow(0 6px 22px rgba(12,58,66,.65));',
'  transform:skewX(-3deg);',
'}',
'.fc-title .fc-title-big i{font-style:italic;padding-left:.04em}',
'.fc-title-sub{',
'  display:block;margin:10px 0 2px;font-size:clamp(.68rem,1.6vw,.85rem);font-weight:700;',
'  letter-spacing:6px;color:rgba(190,255,238,.72);text-transform:uppercase;font-style:italic',
'}',
'.fc-year{display:none !important}',

'/* ── barras de encendido y títulos de pantalla ── */',
'#loading-screen{background:radial-gradient(1200px 800px at 70% 15%,#0d3a44 0%,#071a26 55%,#03090f 100%) !important}',
'.load-name{color:#8ffce4 !important}',
'.load-logo span,.load-pct{color:#25f6c9 !important}',
'.load-logo{text-shadow:0 0 34px rgba(37,246,201,.42) !important}',
'.load-bar>div{background:linear-gradient(90deg,#0aa3d8,#25f6c9) !important}',

'/* ── cabecera global y grilletes ── */',
'.fc-top,.pes-nav-top,.fc27-topbar{background:linear-gradient(180deg,rgba(8,26,40,.92),rgba(6,17,29,.92)) !important;border-bottom:1px solid rgba(64,220,200,.18) !important}',
'.pes-tab{background:rgba(255,255,255,.05) !important;border-radius:14px !important;border:1px solid rgba(255,255,255,.10) !important}',
'.pes-tab.active{background:linear-gradient(160deg,rgba(37,246,201,.22),rgba(14,52,60,.5)) !important;border-color:#25f6c9 !important}',

'/* ── texto menta de marca en títulos de módulos ── */',
'.trn-top h1,.imp-title,.qm-h,.imp-h,.thi-h{color:#8ffce4 !important}',
'.trn-btn{border-radius:999px !important}',

'/* el acento oro del club vive; solo su halo se vuelve marino */',
'.gold,#set-nav .sn-gold,.sn-gold{color:#ffd166 !important}'
].join('\n');

var st = document.createElement('style');
st.id = 'fc27-skin-css';
st.textContent = CSS;
(document.head || document.documentElement).appendChild(st);

/* marca del menú: FC 27 gigante + subtítitulo pequeño (solo si el HTML viejo no lo trae) */
function brandMenu(){
  var t = document.querySelector('.fc-menu-right .fc-title');
  if (!t || t.querySelector('.fc-title-big')) return;
  t.innerHTML = '<span class="fc-title-big">FC <i>27</i></span>';
  if (!t.parentNode.querySelector('.fc-title-sub')){
    var sub = document.createElement('span');
    sub.className = 'fc-title-sub';
    sub.textContent = 'Football Community 2027';
    t.parentNode.insertBefore(sub, t.nextSibling);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brandMenu);
else brandMenu();

window.FC27SKIN = { version: '1.0' };
})();
