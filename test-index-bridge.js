/* ── E2E headless: Football Community 2027 (7.9.0 parcheado) ↔ haxball FC27 ──
   Arranca index.html REAL en jsdom, inyecta estado de carrera, oprime el botón,
   simula el pitazo de la cancha y verifica que la jornada queda apuntada.
   Corre con: node test-index-bridge.js                                     */
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const FILE = process.argv[2] || '/home/user/index.html';
const html = fs.readFileSync(FILE, 'utf-8');

let ok = 0, bad = 0, errors = [];
const A = (c, m) => { if (c) { ok++; console.log('  ✓ ' + m); } else { bad++; console.log('  ✗ ' + m); } };

const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + (e.detail && e.detail.message || e.message)));
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
  console.log('── boot FC2027 ' + (errors.length ? '(errores: ' + errors.length + ')' : '(limpio)') + ' ──');
  errors.slice(0, 4).forEach(e => console.log('   ! ' + e.slice(0, 160)));

  A(window.eval("typeof ManagerCareer==='object'"), 'ManagerCareer vivo');
  A(window.eval("typeof FC27Bridge==='object'&&typeof FC27Bridge.launch==='function'"), 'FC27Bridge montado en window');

  /* ─ estado de carrera mínimo completo (Real Madrid en Liga de 4) ─ */
  window.eval(`(function(){
    var s=ManagerCareer.state;
    s.managerName='Test';s.myTeam='Real Madrid';s.formation='4-3-3';s.season='2026-27';s.currentRound=0;s.diff=2;s.diffPct=125;
    var mk=function(nombre,r){return {name:nombre,rating:r,played:0,won:0,drawn:0,lost:0,goalsFor:0,goalsAgainst:0,points:0};};
    s.teams=[mk('Real Madrid',95),mk('Barcelona B',88),mk('Motagua',80),mk('Olimpia',79)];
    s.league={name:'Liga Test',teams:s.teams.map(function(t){return [t.name,t.rating];})};
    s.squads={};s.squad=[];s.startingXI=[];
    var POS=['GK','DF','DF','DF','DF','MF','MF','MF','FW','FW','FW'];
    for(var i=0;i<11;i++){var p={id:'p'+i,name:'Crack '+(i+1),pos:POS[i],rating:85+i%8,age:24,form:80,morale:80};s.squad.push(p);s.startingXI.push(p.id);}
    for(var j=11;j<18;j++){var p2={id:'b'+j,name:'Suplente '+j,pos:(j%3===0?'DF':j%3===1?'MF':'FW'),rating:70+j-11,age:22,form:75,morale:75};s.squad.push(p2);}
    function r(a,b){return {home:a,away:b,played:false,homeGoals:null,awayGoals:null};}
    s.fixtures=[[r('Real Madrid','Motagua'),r('Barcelona B','Olimpia')],
                [r('Olimpia','Real Madrid'),r('Motagua','Barcelona B')],
                [r('Motagua','Olimpia'),r('Barcelona B','Real Madrid')]];
  })()`);
  A(window.eval("ManagerCareer.state.squad.length===18&&ManagerCareer.state.startingXI.length===11"), 'estado semilla: 18 fichas + XI');

  /* ─ la tarjeta JORNADA trae el botón CANCHA ─ */
  const evHero = window.eval("(function(){try{return nextEvent();}catch(e){return 'EXC '+e.message;}})()");
  console.log('   nextEvent →', JSON.stringify(evHero).slice(0, 120));
  A(evHero && evHero.act === 'league' && evHero.home === 'Real Madrid' && evHero.away === 'Motagua', 'nextEvent: mi cruce de liga (RM vs Motagua)');
  const heroHTML = window.eval("HUB2.heroHTML(" + JSON.stringify(evHero) + ")");
  A(heroHTML.indexOf('id="hub2-cancha"') > 0, '🎮 botón CANCHA inyectado en la tarjeta');
  A(heroHTML.indexOf('hub2-simseason') > 0, '…convive con el de Simular Temporada');

  /* ─ click: overlay + URL correcta a la cancha ─ */
  window.eval("FC27Bridge.launch()");
  const src = window.eval("(function(){var all=document.querySelectorAll('iframe'),f=null;for(var i=0;i<all.length;i++){if((all[i].src||'').indexOf('career=1')>=0){f=all[i];break;}}return f?f.src:'NOFRAME';})()");
  A(src !== 'NOFRAME' && src.indexOf('career=1') > 0 && src.indexOf('club=Real%20Madrid') > 0 && src.indexOf('rival=Motagua') > 0, 'cancha abierta: RM vs Motagua en URL');
  A(src.indexOf('roster=') > 0 && src.indexOf('rosterA=') > 0, 'lleva plantel propio y visitante');
  A(src.indexOf('diff=2') > 0 && src.indexOf('dpc=125') > 0, '🎚️ la dificultad del manager VIAJA a la cancha (diff=2 · dpc=125)');
  A(src.indexOf('comp=liga') > 0 && src.indexOf('compx=') > 0, '🏆 la COMPETICIÓN viaja a la cancha (comp=liga · compx con su nombre)');
  const cont = window.eval("decodeURIComponent(" + JSON.stringify(src) + ")");
  const myRoster = JSON.parse(cont.split('roster=')[1].split('&rosterA=')[0]);
  A(myRoster.length === 18 && myRoster.filter(f => f.p === 'POR').length === 1 && myRoster[0].n === 'Crack 2' && myRoster.some(f => f.r === 85), 'mi plantel: 18 fichas, 1 POR, rating pasa (85)');
  A(myRoster[0].p === 'DEF' && myRoster[9].p === 'DEL', 'posiciones traducidas (DF→DEF, FW→DEL)');

  /* ─ pitazo de la cancha: 2-0 mío ─ */
  window.eval("window.dispatchEvent(new MessageEvent('message',{data:{type:'FC27_RESULT',gh:2,ga:0}}))");
  const post = window.eval(`(function(){
    var s=ManagerCareer.state,f=s.fixtures[0][0],yo=s.teams[0];
    return JSON.stringify({hg:f.homeGoals,ag:f.awayGoals,p:f.played,pts:yo.points,gf:yo.goalsFor,round:s.currentRound,
      otros:s.fixtures[0][1].played,pend:FC27Bridge.pending,ov:(function(){var all=document.querySelectorAll('iframe');for(var i=0;i<all.length;i++){if((all[i].src||'').indexOf('career=1')>=0)return true;}return false;})()});})()`);
  console.log('   tras pitazo →', post);
  const P = JSON.parse(post);
  A(P.hg === 2 && P.ag === 0 && P.p === true, '✍️ mi marcador REAL quedó en el fixture (2-0)');
  A(P.pts === 3 && P.gf === 2, 'tabla: 3 pts y 2 GF para mí');
  A(P.otros === true && P.round === 1, 'el resto de la jornada se simuló y avanzó');
  A(P.pend === null, 'pending consumido (nada fumado dos veces)');
  A(P.ov === false, 'overlay cerrado tras el resultado');

  /* ─ SEGUNDA jornada: fuera de casa, marcan el flip ─ */
  window.eval("FC27Bridge.launch()");
  window.eval("window.dispatchEvent(new MessageEvent('message',{data:{type:'FC27_RESULT',gh:1,ga:0}}))");
  const post2 = window.eval(`(function(){var s=ManagerCareer.state,f=s.fixtures[1][0],yo=s.teams[2];
    return JSON.stringify({hg:f.homeGoals,ag:f.awayGoals,p:f.played,yoPts:s.teams[0].points,yoPerd:s.teams[0].lost,motP:yo.points});})()`);
  console.log('   tras 2ª fecha →', post2);
  const P2 = JSON.parse(post2);
  A(P2.hg === 0 && P2.ag === 1 && P2.p === true, '✍️ flip visita: Olimpia 0 - RM 1 (gané fuera)');
  A(P2.yoPts === 6, 'mis puntos: 6 tras 2 jornadas');

  /* ─ SUPERCOPA de Europa: también a cancha ─ */
  window.eval(`(function(){var s=ManagerCareer.state;
    s.budget=100;s.boardConfidence=55;
    s.cups={};                                    /* como en la vida real: las copas YA nacieron con la temporada */
    s.supercup={ucl:'Barcelona B',uel:'Real Madrid',played:false};
  })()`);
  const evSc = JSON.parse(window.eval("JSON.stringify(nextEvent())"));
  A(evSc.act === 'supercup' && evSc.home === 'Barcelona B' && evSc.away === 'Real Madrid', 'nextEvent me da la Supercopa (RM invitado)');
  const heroSc = window.eval("HUB2.heroHTML(nextEvent()).indexOf('hub2-cancha') >= 0");
  A(heroSc === true, 'tarjeta de Supercopa lleva 🎮 CANCHA');
  window.eval("FC27Bridge.launchEvent(nextEvent())");
  const pendSc = JSON.parse(window.eval("JSON.stringify(FC27Bridge.pending)"));
  A(pendSc.kind === 'supercup' && pendSc.home === 'Barcelona B' && pendSc.away === 'Real Madrid', 'pendiente tipo supercup armado');
  window.eval("window.dispatchEvent(new MessageEvent('message',{data:{type:'FC27_RESULT',gh:3,ga:0}}))");
  const postSc = JSON.parse(window.eval(`(function(){var s=ManagerCareer.state,sc=s.supercup;
    return JSON.stringify({p:sc.played,w:sc.winner,sc2:sc.score,b:s.budget,pend:FC27Bridge.pending});})()`));
  console.log('   tras pitazo 🏅 →', postSc);
  A(postSc.p === true && postSc.sc2 === '0-3' && postSc.w === 'Real Madrid', '🏅 Supercopa apuntada con FLIP y ganada en cancha (0-3)');
  A(postSc.b === 105 && postSc.pend === null, 'premio €5M cobrado y pending consumido');

  /* ─ COPA Nacional: la FINAL también se juega ─ */
  window.eval(`(function(){var s=ManagerCareer.state;
    s.cups={nat:{kind:'nat',name:'Copa Nacional',icon:'🏆',color:'#ffd600',prize:8,
      rounds:[{name:'Final',unlock:0,notified:false,matches:[
        {h:'Motagua',a:'Real Madrid',hr:80,ar:95,hg:null,ag:null,played:false,winner:null,wRating:0,pens:false}]}],
      idx:0,alive:true,done:false,champion:null,totalRounds:1,pendingByes:[]},intl:null,cwc:null};
  })()`);
  const evCup = JSON.parse(window.eval("JSON.stringify(nextEvent())"));
  A(evCup.act === 'cup' && evCup.ci === 0 && evCup.home === 'Motagua' && evCup.away === 'Real Madrid', 'nextEvent me da la Final de copa (ci:0)');
  const heroCup = window.eval("HUB2.heroHTML(nextEvent()).indexOf('hub2-cancha') >= 0");
  A(heroCup === true, 'tarjeta de copa lleva 🎮 CANCHA');
  window.eval("FC27Bridge.launchEvent(nextEvent())");
  const srcCup = window.eval("(function(){var all=document.querySelectorAll('iframe'),f=null;for(var i=0;i<all.length;i++){if((all[i].src||'').indexOf('career=1')>=0){f=all[i];break;}}return f?f.src:'NOFRAME';})()");
  A(srcCup.indexOf('rival=Motagua') > 0 && window.eval("FC27Bridge.pending.kind==='cup'&&FC27Bridge.pending.ci===0"), 'cancha copa abierta vs Motagua, pendiente cup/ci:0');
  window.eval("window.dispatchEvent(new MessageEvent('message',{data:{type:'FC27_RESULT',gh:2,ga:1}}))");
  const postCup = JSON.parse(window.eval(`(function(){var s=ManagerCareer.state,c=s.cups.nat,m=c.rounds[0].matches[0];
    return JSON.stringify({hg:m.hg,ag:m.ag,p:m.played,w:m.winner,done:c.done,champ:c.champion,b:s.budget});})()`));
  console.log('   tras pitazo 🏆 →', postCup);
  A(postCup.p === true && postCup.hg === 1 && postCup.ag === 2, '✍️ final de copa apuntada con FLIP: Motagua 1 - RM 2');
  A(postCup.w === 'Real Madrid' && postCup.done === true && postCup.champ === 'Real Madrid' && postCup.b === 113, '🏆 campeón de copa en cancha + premio cobrado');

  /* ─ la liga sigue intacta: otra fecha más, sin tongo ─ */
  window.eval("FC27Bridge.launch()");
  window.eval("window.dispatchEvent(new MessageEvent('message',{data:{type:'FC27_RESULT',gh:1,ga:1}}))");
  const post9 = JSON.parse(window.eval(`(function(){var s=ManagerCareer.state,f=s.fixtures[2][1],yo=s.teams[0];
    return JSON.stringify({hg:f.homeGoals,ag:f.awayGoals,p:f.played,pts:yo.points});})()`));
  A(post9.p === true && post9.hg === 1 && post9.ag === 1, '✍️ fecha 3 flip: Barcelona B 1 - RM 1');
  A(post9.pts === 7, 'tabla coherente: 7 puntos');

  /* ─ 🎛️ gustos de cancha Ajustes: la tarjeta firma la URL de TODOS los partidos ─ */
  A(src.indexOf('pop=0') < 0 && src.indexOf('pad=') < 0 && src.indexOf('cmt=0') < 0, '🎛️ por defecto: NINGÚN gusto forzado (legado)');
  /* ─ 🎵 la banda sonora se agacha mientras hay partido ─ */
  window.eval(`(function(){
    Music.audio={volume:1,paused:false,play:function(){return {catch:function(){return this;}};},pause:function(){this.paused=true;},addEventListener:function(){},src:''};
    Music.unlocked=true;Music.muted=false;Music.volume=.82;
  })()`);
  window.eval("FC27Bridge.launchComp('league','Real Madrid','Motagua',null)");
  /* drenaje determinista: ejecuta la MISMA matemática del fadeTo (jsdom congela su rAF bajo carga) */
  function drainVol(target){
    window.eval(`(function(){for(let i=0;i<70;i++){const a=Music.audio;if(!a||a.paused)break;const cur=a.volume;if(Math.abs(cur-${target})<0.05){a.volume=${target};break;}a.volume=cur+(${target}-cur)*.25;}})()`);
    return window.eval("Music.audio.volume");
  }
  A(window.eval("typeof Music.duck==='function'&&typeof Music.restore==='function'"), '🎵 Music sabe agacharse y restaurarse (duck/restore)');
  A(window.eval("Music._ducked") === true, '🎵 entra la cancha → música AGACHADA (_ducked)');
  const duckV = drainVol(0);
  A(Math.abs(duckV) < 0.07, '🎵 …y FUNDE al silencio (vol '+duckV.toFixed(3)+')');
  const src2 = window.eval(`(function(){
    localStorage.setItem('fc27_cancha', JSON.stringify({pad:'l',bsz:'l',pop:0,cmt:0}));
    FC27Bridge.launchComp('league','Real Madrid','Motagua',null,'Test Liga');   /* directo: no depende de la agenda */
    var all=document.querySelectorAll('iframe'),url='';
    for(var i=all.length-1;i>=0;i--){var s2=all[i].src||'';if(s2.indexOf('career=1')>0){url=s2;break;}}
    localStorage.removeItem('fc27_cancha');
    return url;
  })()`);
  A(src2.indexOf('pop=0') > 0 && src2.indexOf('cmt=0') > 0 && src2.indexOf('pad=l') > 0 && src2.indexOf('bsz=l') > 0, '🎛️ los gustos de Ajustes VIAJAN (zurdo · grandes · pop-ups y relato OFF)');
  window.eval("FC27Bridge.close()");
  A(window.eval("Music._ducked") === false, '🎵 termina el partido → bandera restaurada (close funciona)');
  const backV = drainVol(0.82);
  A(Math.abs(backV-0.82) < 0.07, '🎵 …y la música VUELVE a su volumen (vol '+backV.toFixed(3)+' ≈ 0.82)');
  /* ─ renovaciones con freno (Talks) — cola final ─ */
  const talkRes = JSON.parse(window.eval("(function(){var s=ManagerCareer.state;s.talks=[];s.askCD={};s.currentRound=7;s.injuries={};s.squad[0].contract=1;var old=Math.random;Math.random=function(){return 0;};Talks.maybeNew();var t1=s.talks[0]||null;var cd=t1&&t1.type==='contract'?(s.askCD[t1.playerId]-s.currentRound):null;s.talks=[];Talks.maybeNew();var t2=s.talks[0]||null;Math.random=old;return JSON.stringify({n1:t1?t1.type:null,n2:t2?t2.type:null,cd:cd});})()"));
  A(talkRes.n1 === 'contract' && talkRes.cd === 8, '⏳ renovación: llama UNA vez y muerde freno de 8 jornadas');
  A(talkRes.n2 !== 'contract', '⏳ mientras muerde el freno NO hay segunda pedrada de contrato');
  /* el motor TOURNEOS vive en torneos.js (script externo): se inyecta igual que en el navegador */
  window.eval(fs.readFileSync('/home/user/torneos.js', 'utf8'));
  A(window.eval("typeof TOURNEOS==='object' && typeof TOURNEOS.dbFull==='function'"), '🛠️ motor TOURNEOS presente (bloque inyectado)');

  /* v6.4.2 · popup de novedades que sale una vez por versión desplegada */
  const nwRes = JSON.parse(window.eval(`(function(){
    var r = { shown: false, seen: false, idem: true };
    try {
      var ls = document.getElementById('loading-screen');
      if (ls && ls.parentNode) ls.parentNode.removeChild(ls); /* headless: simula "ENTRAR AL JUEGO" */
      if (window.FC27SKIN && FC27SKIN.showNews) FC27SKIN.showNews();
      var n = document.getElementById('fc27-news');
      r.shown = !!n;
      var go = document.getElementById('fc27-news-go');
      if (go) go.click();
      r.seen = (function(){ try { return localStorage.getItem('fc27_seen_build') || ''; } catch (e) { return ''; } })() !== '';
      if (window.FC27SKIN && FC27SKIN.build) r.build = FC27SKIN.build;
    } catch (e) { r.err = String((e && e.message) || e); }
    return JSON.stringify(r);
  })()`));
  A(nwRes.shown === true, '📣 popup de novedades aparece (build no visto)' + (nwRes.err ? ' (err: ' + nwRes.err + ')' : ''));
  A(nwRes.seen === true, '📣 al cerrarlo queda visto en localStorage (build ' + (nwRes.build || '?') + ')' + (nwRes.err ? ' (err: ' + nwRes.err + ')' : ''));

  /* v6.5 · MENU HUB: gráficos MEDIO tipo EA (PC) con fondos por modo */
  const mhRes = JSON.parse(window.eval(`(function(){
    var r = { obj:false, hub:false, on:false, img:'', cta:'', img2:'', cycle:false, off:false, saved:'', err:'' };
    try {
      window.__MH_PC__ = true;
      r.obj = typeof MENUHUB === 'object' && !!document.getElementById('menu-hub');
      r.hub = !!document.getElementById('mh-toggle');
      MENUHUB.apply('hub');
      r.on = document.body.classList.contains('hub-on');
      MENUHUB.hoverKey('trn');
      var on1 = document.querySelector('#menu-hub .mh-bg.on');
      r.img = on1 ? on1.getAttribute('data-k') : '';
      var cta = document.getElementById('mh-cta');
      r.cta = cta ? cta.textContent : '';
      MENUHUB.hoverKey('imp');
      on1 = document.querySelector('#menu-hub .mh-bg.on');
      r.img2 = on1 ? on1.getAttribute('data-k') : '';
      r.cycle = (r.img === 'trn' && r.img2 === 'imp');
      MENUHUB.apply('classic');
      r.off = !document.body.classList.contains('hub-on');
      r.saved = localStorage.getItem('fc27_uimode') || '';
      window.__MH_PC__ = false;
    } catch (e) { r.err = String((e && e.message) || e); }
    return JSON.stringify(r);
  })()`));
  A(mhRes.obj === true && !mhRes.err, '🖥️ MENUHUB construido (nav+panel+capas foto)' + (mhRes.err ? ' (err: ' + mhRes.err + ')' : ''));
  A(mhRes.hub === true && mhRes.on === true, '🖥️ toggle "UI: EA HUB" live y activación pone body.hub-on' + (mhRes.err ? ' (err: ' + mhRes.err + ')' : ''));
  A(mhRes.cycle === true && mhRes.cta.indexOf('TORNEOS') >= 0, '🖱️ hover cambia fondo (🏆→🕵️) con CTA del modo ' + (mhRes.err ? '(' + mhRes.err + ')' : ''));
  A(mhRes.off === true && mhRes.saved === 'classic', '↩️ volver a UI clásica restaura y persiste ' + (mhRes.err ? '(' + mhRes.err + ')' : ''));

  /* v6.4 · creador de torneos: autocompletar con filtro (club/sel) + criterio (aleatorio/ranking) */
  const afRes = JSON.parse(window.eval(`(function(){
    var r = { m:false, cnt:0, allSel:true, cnt2:0, allClub:true, rankDesc:true };
    try {
      r.m = (typeof TorneosUI === 'object') && typeof TorneosUI.autoFill === 'function'
         && typeof TorneosUI.autoKindSet === 'function' && typeof TorneosUI.autoModeSet === 'function';
      TorneosUI.open(); TorneosUI.newBuilder();
      TorneosUI.clearIds();
      TorneosUI.autoKindSet('sel'); TorneosUI.autoModeSet('rank'); TorneosUI.autoFill(8);
      var chips = Array.prototype.slice.call(document.querySelectorAll('.trn-chip')).map(function(el){
        var oc = el.getAttribute('onclick') || '',
            i1 = oc.indexOf("toggle('"), i2 = oc.indexOf("')", i1 + 8);
        return (i1 >= 0 && i2 > i1) ? oc.slice(i1 + 8, i2) : null;
      }).filter(Boolean);
      r.cnt = chips.length;
      r.allSel = chips.every(function(id){ return id.indexOf('s:') === 0; });
      TorneosUI.clearIds();
      TorneosUI.autoKindSet('club'); TorneosUI.autoModeSet('rand'); TorneosUI.autoFill(4);
      var chips2 = Array.prototype.slice.call(document.querySelectorAll('.trn-chip')).map(function(el){
        var oc = el.getAttribute('onclick') || '',
            i1 = oc.indexOf("toggle('"), i2 = oc.indexOf("')", i1 + 8);
        return (i1 >= 0 && i2 > i1) ? oc.slice(i1 + 8, i2) : null;
      }).filter(Boolean);
      r.cnt2 = chips2.length;
      r.allClub = chips2.every(function(id){ return id.indexOf('c:') === 0; });
      TorneosUI.clearIds();
      TorneosUI.viewHub(); TorneosUI.close();
    } catch(e) { r.err = String((e && e.message) || e); }
    return JSON.stringify(r);
  })()`));
  A(afRes.m === true, '🛠️ TorneosUI.autoFill/autoKindSet/autoModeSet existen' + (afRes.err ? ' (err: ' + afRes.err + ')' : ''));
  A(afRes.cnt === 8 && afRes.allSel === true, '🛠️ autocompletar ✨+8 filtro 🌍 selecciones → 8 fichas selección y ningún club' + (afRes.err ? ' (err: ' + afRes.err + ')' : ''));
  A(afRes.cnt2 === 4 && afRes.allClub === true, '🛠️ autocompletar ✨+4 filtro 🏟️ clubes → 4 fichas club y ninguna selección' + (afRes.err ? ' (err: ' + afRes.err + ')' : ''));

  const errs = errors.filter(e => !/audio|AudioContext|getBufferById|iOS|user gesture/i.test(e));
  A(errs.length === 0, 'sin errores JS relevantes (' + (errs[0] || 'ninguno') + ')');
  console.log('\nRESULTADO E2E: ' + ok + ' ok / ' + bad + ' fail');
  process.exit(bad ? 1 : 0);
}, 3500);
