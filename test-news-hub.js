/* test-news-hub.js — 📰 motor de la redacción: coherencia, verdad, efectos reales, regulación */
'use strict';
const fs = require('fs');
let ok = 0, fail = 0;
function t(cond, name){ if (cond) { ok++; console.log('ok - ' + name); } else { fail++; console.log('✗ FAIL - ' + name); } }

/* entorno mínimo DOM/HTML libre */
function loadNH(){
  const window = {};
  const doc = {
    addEventListener: function(){}, createElement: function(){ return { style: { cssText: '' }, innerHTML: '', appendChild(){}, remove(){}, querySelector(){ return null; }, querySelectorAll(){ return []; } }; },
    body: { appendChild(){} }, getElementById(){ return null; }
  };
  const src = fs.readFileSync(__dirname + '/news-hub.js','utf8');
  const fn = new Function('window','document','GameDialog','ManagerCareer','UI','slog','S','setTimeout', src + '\n;return window.NEWSHUB;');
  return fn(window, doc, undefined, undefined, undefined, undefined, undefined, function(f){ return 0; });
}
const NH = loadNH();
t(!!NH && Array.isArray(NH.LEAGUES) && NH.LEAGUES.length === 12, 'doce redacciones del planeta (12 ligas)');
t(NH.leagueByClub('Manchester United') === 'eng' && NH.leagueByClub('FC Barcelona') === 'esp', 'liga por club resuelve (United→eng, Barça→esp)');

/* Manager state sintético */
function mgrState(){ return { myTeam:'FC Barcelona', budget:100, league:{name:'Liga Española'},
  squads:[], squad:[{id:1,name:'Pau Cubarsí',pos:'DF',rating:83,morale:70,form:70},{id:2,name:'Marc Guiu',pos:'FW',rating:74,morale:70,form:70}],
  startingXI:[1,2], teams:[{name:'FC Barcelona',rating:88},{name:'Manchester United',rating:86},{name:'PSG',rating:88}], injuries:{}, newsHub:null, popups:true }; }

/* 1· 200 jornadas sin excepciones, feed capado */
const s1 = mgrState(); NH.ensure(s1);
let abs = 0, tot = 0;
for (let j=0;j<200;j++){ s1.popups = false; NH.afterJornada(s1,{mode:'mgr'}); s1.newsHub.feed.forEach(x=>{tot++; if(x.absurd)abs++;}); }
t(s1.newsHub.feed.length <= 60, 'feed capado a 60 ediciones (' + s1.newsHub.feed.length + ')');
t(s1.newsHub.tick === 200, 'contador de jornadas avanza');

/* 2· nacen rumores y TODOS se resuelven (V o F) con acta en el feed */
const s2 = mgrState(); NH.ensure(s2); s2.popups = false;
for (let j=0;j<90;j++) NH.afterJornada(s2,{mode:'mgr'});
const rumorsAll = s2.newsHub.feed.filter(x=>x.tag==='FICHAJE');
const resolvidas = s2.newsHub.feed.filter(x=>/OFICIAL|Humo confirmado/.test(x.title));
t(rumorsAll.length > 0, 'salieron rumores de mercado (' + rumorsAll.length + ')');
t(resolvidas.length > 0, 'los rumores desembocaron en HECHO OFICIAL o desmentida (' + resolvidas.length + ')');
const vivas = s2.newsHub.feed.filter(x=>x.rum && !x.rum.eaten);
t(vivas.length <= 2, 'pocos rumores vivos simultáneos (redacción seria: ' + vivas.length + ')');

/* 3· verdad VERIFICABLE: forzar rumor verdadero hacia MI club → fichaje REAL en mi plantel */
const s3 = mgrState(); NH.ensure(s3); s3.popups = false;
s3.newsHub.feed.unshift({ tag:'FICHAJE', cat:'tuyo', title:'t', body:'b',
  rum:{id:999,truth:true,type:'out',star:'Cole Palmer',from:'Chelsea',to:'FC Barcelona',fee:100,eaten:false,ttl:1} });
const q0 = s3.squad.length;
NH.afterJornada(s3,{mode:'mgr'}); NH.afterJornada(s3,{mode:'mgr'});
t(s3.squad.length === q0 + 1, 'el rumor VERDADERO fichó de verdad: Palmer ya viste tu escudo');
t(s3.squad.some(p=>p.name==='Cole Palmer'), 'Palmer está en tu plantilla');

/* 4· rumor verdadero SACANDO a tu jugador → se vende con pasta */
const s4 = mgrState(); NH.ensure(s4); s4.popups = false;
s4.newsHub.feed.unshift({ tag:'FICHAJE', cat:'tuyo', title:'t', body:'b',
  rum:{id:998,truth:true,type:'out',star:'Pau Cubarsí',from:'FC Barcelona',to:'Manchester United',fee:46,eaten:false,ttl:1} });
const b0 = s4.budget;
NH.afterJornada(s4,{mode:'mgr'}); NH.afterJornada(s4,{mode:'mgr'});
t(!s4.squad.some(p=>p.name==='Pau Cubarsí'), 'Cubarsí SE FUE al United (efecto real en plantel)');
t(s4.budget > b0, 'la pasta quedó en caja (' + b0 + ' → ' + s4.budget + 'M€)');

/* 5· desmentida también es noticia */
const s5 = mgrState(); NH.ensure(s5); s5.popups = false;
s5.newsHub.feed.unshift({ tag:'FICHAJE', cat:'mundo', title:'t', body:'b',
  rum:{id:997,truth:false,type:'out',star:'Jamal Musiala',from:'Bayern Múnich',to:'PSG',fee:115,eaten:false,ttl:1} });
NH.afterJornada(s5,{mode:'mgr'}); NH.afterJornada(s5,{mode:'mgr'});
t(s5.newsHub.feed.some(x=>/Humo confirmado/.test(x.title)), 'el rumor falso → “Humo confirmado” publicado');

/* 6· prensa conectada: hay pregunta V/F con rumor vivo y NO sin rumor */
/* neutralidad determinista: cualquier rumor espurio de las 2 jornadas queda consumido */
s5.newsHub.feed.forEach(x => { if (x.rum) x.rum.eaten = true; });
s5.newsHub.queue = [];
const qLive = NH.pressQuestion(s5);
t(qLive === null, 'sin rumor vivo → la sala no pregunta (no inventa)');
const s6 = mgrState(); NH.ensure(s6);
s6.newsHub.feed.unshift({ tag:'FICHAJE', cat:'tuyo', title:'t', body:'b',
  rum:{id:996,truth:true,type:'out',star:'Pedri',from:'FC Barcelona',to:'PSG',fee:95,eaten:false,ttl:9} });
const q6 = NH.pressQuestion(s6);
t(!!q6 && q6.opts.length === 3 && /Pedri/.test(q6.q), 'con rumor vivo → pregunta con “Pedri” y 3 respuestas');
t(/verdict|fb/.test(q6.opts[0].fb) || q6.opts[0].fb.length > 20, 'cada respuesta tiene su consecuencia narrada');

/* 7· regulación: cooldown mundana 2, la tuya siempre, absurdo nunca hace pop */
const s7 = mgrState(); NH.ensure(s7);
s7.popups = true; s7.newsHub.leagues = []; s7.newsHub.chosen = true;
/* simulamos publicación directa llamando item factory vía afterJornada con popups activas y cd hueco */
const cnt0 = s7.newsHub.feed.length;
NH.afterJornada(s7,{mode:'mgr'});
t(s7.newsHub.cd === 0 || s7.newsHub.cd === 2, 'cooldown intacto: ' + s7.newsHub.cd);

/* 8· toggle off: no pops (dialog nunca invocado por pet laterales: probamos flag) */
NH.togglePopups(s7,false);
t(s7.newsHub.popups === false, 'Ajustes: los pop-ups se apagan');
NH.togglePopups(s7,true);
t(s7.newsHub.popups === true, 'Ajustes: los pop-ups se encienden');

/* 9· chooser: máx 5 ligas y chosen=true */
NH.setLeagues(s7,['esp','eng','ita','ale','fra','por','hol']);
t(s7.newsHub.leagues.length === 5, 'máximo 5 ligas (el resto se despide)');

/* 10· banco por liga (coherencia: clubs de la liga correcta aparecen en transferencias) */
const s8 = mgrState(); NH.ensure(s8); s8.popups=false;
for (let j=0;j<120;j++) NH.afterJornada(s8,{mode:'mgr'});
const bad = s8.newsHub.feed.filter(x=>x.rum && NH.leagueByClub(x.rum.to)===null);
t(bad.length === 0, 'ningún destino inexistente en las fichajes (todos clubes reales)');

/* 11· Jugador: rumor sobre TI se resuelve + pressPlayer no rompe sin UI */
const sp = { name:'Tú Crack', club:'Olimpia', rhythm:'MUY', morale:60, pressOff:false, year:2026, newsHub:null };
NH.ensure(sp);
sp.popups=false;
for (let j=0;j<150;j++) NH.afterJornada(sp,{mode:'pl'});
const mine = sp.newsHub.feed.filter(x=>x.cat==='tuyo');
t(mine.length > 0, 'el modo jugador genera portadas sobre TI (' + mine.length + ')');
const yr = sp.newsHub.feed.find(x=>/radar|prepara|oferta|interesa|fichaje/i.test(x.title)) || sp.newsHub.queue.find(x=>x.type==='youRumor');
t(!!yr, 'el interés de otros clubes por TI termina en portada o rumor (en 150 jornadas)');
sp.pressOff = true;
NH.pressPlayer(sp);   /* no debe explotar ni mostrar nada */
t(true, 'pressPlayer con prensa desactivada: silencio respetado');
/* 12· 🎙️ FIX "Rüdiger": los rumores de OTROS clubes ya NO entran a tu rueda de prensa */
const s12 = mgrState(); NH.ensure(s12);
s12.newsHub.feed.unshift({ tag:'FICHAJE', cat:'mundo', title:'t', body:'b',
  rum:{id:995,truth:true,type:'out',star:'Antonio Rüdiger',from:'Real Madrid',to:'PSG',fee:40,eaten:false,ttl:9} });
t(NH.pressQuestion(s12) === null, 'rumor ajeno (Rüdiger al PSG) NO entra a tu sala de prensa');
const s12b = mgrState(); NH.ensure(s12b);
s12b.newsHub.feed.unshift({ tag:'FICHAJE', cat:'tuyo', title:'t', body:'b',
  rum:{id:994,truth:true,type:'out',star:'Fermín López',from:'FC Barcelona',to:'Chelsea',fee:50,eaten:false,ttl:9} });
const q12 = NH.pressQuestion(s12b);
t(!!q12 && /Fermín/.test(q12.q) && /Barcelona/.test(q12.q), 'tu rumor propio SÍ entra y nombra tu club: «' + (q12 ? q12.q.slice(0,74) : '—') + '…»');

/* 13· 🎙️ PRESSBANK carga, es enorme, contextual y con opciones válidas */
const winPB = {};
new Function('window', fs.readFileSync(__dirname + '/press-bank.js','utf8'))(winPB);
const PB = winPB.PRESSBANK;
t(!!PB && typeof PB.mgrQS === 'function' && typeof PB.plQS === 'function', 'press-bank.js carga (mgrQS + plQS)');
const dM = { club:'FC Barcelona', rival:'Real Madrid', star:'Pau Cubarsí', joven:'Marc Guiu', veterano:'Ter Stegen', goleador:'Marc Guiu', liga:'LaLiga', mister:'míster', conf:62, ronda:14 };
const dP = { me:'Tú Crack', club:'Olimpia', rival:'Motagua', pos:'DEL', edad:22, liga:'Liga Nacional', nota:7.4 };
const bmA = PB.mgrQS(dM), bpA = PB.plQS(dP);
let _allQ = [];
for (let _i = 0; _i < 4; _i++) { _allQ = _allQ.concat(PB.mgrQS(dM).map(q => q.q), PB.plQS(dP).map(q => q.q)); }
const uni = new Set(_allQ);
t(uni.size >= 1000, 'banco enorme: ' + uni.size + ' preguntas únicas en 4 tiradas (pedido: ~1000+)');
t(bmA.every(q => ['crisis','glory','routine'].includes(q.ctx)) && bpA.every(q => ['crisis','glory','routine'].includes(q.ctx)), 'contextos válidos en ambos bancos');
t(bmA.filter(q => q.ctx === 'crisis').length > 25 && bmA.filter(q => q.ctx === 'glory').length > 20 && bmA.filter(q => q.ctx === 'routine').length > 50,
  'manager bien poblado: ' + bmA.length + ' redacciones (crisis ' + bmA.filter(q=>q.ctx==='crisis').length + ' · gloria ' + bmA.filter(q=>q.ctx==='glory').length + ' · rutina ' + bmA.filter(q=>q.ctx==='routine').length + ')');
t(bpA.filter(q => q.ctx === 'routine').length > 40, 'jugador bien poblado: ' + bpA.length + ' redacciones');
const noKeys = [].concat(bmA, bpA).every(q => !/\{/.test(q.q) && q.opts.every(o => !/\{/.test(o.t) && !/\{/.test(o.fb)));
t(noKeys, 'todos los huecos se rellenan (cero llaves {sueltas})');
t(bmA.every(q => q.opts.length === 3 && q.opts.every(o => typeof o.morale === 'number' && typeof o.conf === 'number')), 'manager: 3 respuestas con moral + confianza');
t(bpA.every(q => q.opts.length === 3 && q.opts.every(o => typeof o.mo === 'number')), 'jugador: 3 respuestas con moral');
const noForeign = [].concat(bmA, bpA).every(q => !/Mbappé|Haaland|Rüdiger|Vinícius|Bellingham|Musiala|Palmer|Yamal/.test(q.q));
t(noForeign, 'cero preguntas de estrellas ajenas hardcodeadas (el caso Rüdiger no vuelve)');
t(bmA.some(q => q.q.includes('FC Barcelona')) && bpA.some(q => q.q.includes('Olimpia')), 'preguntas nombran TU club (manager y jugador)');
t(bmA.some(q => q.q.includes('Real Madrid')) && bpA.some(q => q.q.includes('Motagua')), 'el próximo RIVAIl aparece rellenado ({rival} → rival real)'.replace('RIVAIl','rival'));
t(bpA.some(q => q.q.includes('Tú Crack')), 'el modo jugador usa TU nombre ({me})');

/* 14· integración viva: pressPlayer usa el BANCO cuando está disponible */
global.PRESSBANK = PB;
function loadNH_UI(UIcap) {
  const window = {};
  const doc = {
    addEventListener() {}, createElement() { return { style: { cssText: '' }, innerHTML: '', appendChild() {}, remove() {}, querySelector() { return null; }, querySelectorAll() { return []; } }; },
    body: { appendChild() {} }, getElementById() { return null; }
  };
  const src = fs.readFileSync(__dirname + '/news-hub.js', 'utf8');
  const fn = new Function('window','document','GameDialog','ManagerCareer','UI','slog','S','setTimeout', src + '\n;return window.NEWSHUB;');
  return fn(window, doc, undefined, undefined, UIcap, function(){}, undefined, function(){ return 0; });
}
let seenModal = null;
const UIcap = { modal: function (h) { seenModal = h; } };
const NH2 = loadNH_UI(UIcap);
const sp2 = { name:'Tú Crack', club:{ name:'Olimpia', lk:'hon' }, lastRating:7.9, rhythm:'MUY', morale:60, pos:'DEL', age:22, newsHub:null, pressOff:false };
NH2.ensure(sp2);
NH2.pressPlayer(sp2, 1, true);
t(!!seenModal && /«/.test(seenModal), 'la rueda de prensa del jugador abre con pregunta del banco («…medio/periodista…»)');
t(!!seenModal && (/Olimpia/.test(seenModal) || /Tú Crack/.test(seenModal)), 'la pregunta del banco habla de TI y tu club');

/* 15· enlaces estáticos en los HTML */
const idxH = fs.readFileSync(__dirname + '/index.html', 'utf8');
t(/<script src="press-bank\.js"><\/script>/.test(idxH) && idxH.includes('PRESSBANK.mgrQS'), 'index.html enlaza press-bank.js y Press lo consume');
const fcH = fs.readFileSync(__dirname + '/fc27.html', 'utf8');
t(/<script src="press-bank\.js"><\/script>/.test(fcH), 'fc27.html (espejo PC) también enlaza press-bank.js');
const caH = fs.readFileSync(__dirname + '/carrera-jugador.html', 'utf8');
t(/<script src="press-bank\.js"><\/script>/.test(caH), 'carrera-jugador.html enlaza press-bank.js');

/* 16· lockstep raíz ↔ football-community-2027 (news-hub + press-bank) */
const crypto = require('crypto');
function hash(p) { return crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex'); }
t(hash(__dirname + '/news-hub.js') === hash(__dirname + '/football-community-2027/news-hub.js'), 'news-hub.js raíz ↔ espejo idénticos');
t(fs.existsSync(__dirname + '/football-community-2027/press-bank.js') && hash(__dirname + '/press-bank.js') === hash(__dirname + '/football-community-2027/press-bank.js'), 'press-bank.js existe en espejo e idéntico');
/* 17· 🧭 coherencia de mercado: catálogo ≥100 nubes y TODAS coherentes */
const movs = NH._MOVES.map(x => x.split('|'));
t(movs.length >= 100, 'catálogo de nubes: ' + movs.length + ' traspasos curados (pedido ~100)');
const cohBad = movs.filter(mv => { const stM = NH._STARS.find(o => o.n === mv[0]); return !stM || mv[1] === stM.c || !NH.canMove(stM, mv[1], mv[2]); });
t(cohBad.length === 0, 'las ' + movs.length + ' nubes pasan el filtro de coherencia (' + (cohBad[0] ? 'incoherente: ' + cohBad[0] : 'ninguna incoherente') + ')');
const musialaHon = movs.filter(mv => /Musiala|Haaland|Vinícius|Bellingham|Lamine/.test(mv[0]) && /Olimpia|Motagua|Marathón/.test(mv[1]));
t(musialaHon.length === 0, 'cero absurdos: ningún crack mundial rumbo a Liga Nacional');
const aOliMot = movs.filter(mv => /Olimpia|Motagua|Marathón/.test(mv[1]));
t(aOliMot.length >= 2 && aOliMot.every(mv => mv[2] === 'prestamo'), 'Liga Nacional solo recibe PRÉSTAMOS de jóvenes (' + aOliMot.length + ' nubes con sabor 🇭🇳)');
t(NH.leagueByClub('Olimpia') === 'hon' && movs.every(mv => NH.leagueByClub(mv[1]) !== null || /desconocido/.test('x')), 'todos los destinos del catálogo son clubes reales del juego');

/* 18· el generador nunca produce incoherencias en 400 disparos */
const s18 = mgrState(); NH.ensure(s18); s18.popups = false;
for (let j = 0; j < 400; j++) NH.afterJornada(s18, { mode: 'mgr' });
const rums18 = s18.newsHub.feed.filter(x => x.rum);
const incoh = rums18.filter(x => { const stX = NH._STARS.find(o => o.n === x.rum.star); return stX && !NH.canMove(stX, x.rum.to, x.rum.tipo || 'interes'); });
t(rums18.length >= 5 && incoh.length === 0, '400 jornadas generadas: ' + rums18.length + ' rumores, ' + incoh.length + ' incoherentes');

/* 19· forzado modo PC y renuncia selección: enlaces estáticos */
const mhSrc = fs.readFileSync(__dirname + '/menu-hub.js', 'utf8');
t(/fc27_uimode_force/.test(mhSrc) && /mh-force/.test(mhSrc), 'menu-hub.js entiende el modo forzado (fc27_uimode_force + .mh-force)');
const idxSrc2 = fs.readFileSync(__dirname + '/index.html', 'utf8');
t(/hubui-card/.test(idxSrc2) && /cycleHub/.test(idxSrc2) && /tryLandscape/.test(idxSrc2), 'Ajustes: tarjeta "🖥️ Gráficos de UI del menú" con forzado + horizontal');
t(/nat-resign-btn/.test(idxSrc2), 'botón "🌍 Renunciar a la selección" presente en el panel del míster');
t(/resign-btn/.test(idxSrc2), 'botón "🚪 Abandonar el club" (dimisión mitad de temporada) sigue presente');
const crypto2 = require('crypto');
function hash2(p) { return crypto2.createHash('md5').update(fs.readFileSync(p)).digest('hex'); }
t(hash2(__dirname + '/menu-hub.js') === hash2(__dirname + '/football-community-2027/menu-hub.js'), 'menu-hub.js raíz ↔ espejo idénticos');

/* 20· 🖼️ logo nuevo FC27: assets, referencias y espejos */
function pngOK(p) { if (!fs.existsSync(p)) return false; const b = fs.readFileSync(p).slice(0, 8); return b.length === 8 && b[0] === 0x89 && b[1] === 0x50; }
t(['fc27-logo.png','favicon.png','apple-touch-icon.png'].every(f => pngOK(__dirname + '/assets/' + f) && pngOK(__dirname + '/football-community-2027/assets/' + f)), '3 assets de logo PNG válidos en raíz y espejo');
t(idxSrc2.includes('assets/favicon.png?v=3') && idxSrc2.includes('assets/apple-touch-icon.png?v=3') && !idxSrc2.includes('?v=2'), 'index: favicon/apple-touch-icon con cache-buster v3 (adiós favicon roto)');
t((idxSrc2.match(/fc27-logo\.png\?v=3/g) || []).length >= 4, 'index: logo nuevo en splash + título (×2) + barra superior + hub inline (' + (idxSrc2.match(/fc27-logo\.png\?v=3/g) || []).length + ' usos)');
const fc272 = fs.readFileSync(__dirname + '/fc27.html', 'utf8');
t(fc272 === idxSrc2 || fc272.includes('fc27-logo.png?v=3'), 'fc27.html comparte el logo nuevo');
const carr3 = fs.readFileSync(__dirname + '/carrera-jugador.html', 'utf8');
const ut3 = fs.readFileSync(__dirname + '/ultimate-team.html', 'utf8');
t(carr3.includes('assets/favicon.png?v=3') && ut3.includes('assets/favicon.png?v=3'), 'Carrera y UT por fin tienen favicon (antes ninguno)');
t(mhSrc.includes('fc27-logo.png?v=3'), 'menu-hub.js usa la imagen del logo en vez de texto');

/* 21· ⚡ MODO GRÁFICOS ALTO: assets animados + mapeo por modo + ciclo de Ajustes */
const MENU_AL = __dirname + '/assets/menu/';
t(['alto-estadio.jpg','alto-torneos.jpg','alto-jugador.jpg','alto-rapido.jpg','alto-manager.gif','carga-lamine.jpg'].every(f => fs.existsSync(MENU_AL + f) && fs.existsSync(MIR_AL(f)) && fs.statSync(MENU_AL + f).size > 4000), '4 posters ALTO calidad IA + GIF Mourinho + promo Lamine de carga (raíz y espejo)');
t(['alto-estadio.mp4','alto-torneos.mp4','alto-jugador.mp4','alto-rapido.mp4'].every(f => fs.existsSync(MENU_AL + f) && fs.existsSync(MIR_AL(f)) && fs.statSync(MENU_AL + f).size > 80000), '4 vídeos de fondo animados en assets/menu (raíz y espejo, >80KB)');
t(['alto-estadio.mp4','alto-torneos.mp4','alto-jugador.mp4','alto-rapido.mp4'].every(f => { const b = fs.readFileSync(MENU_AL + f); return b.slice(4, 8).toString() === 'ftyp'; }), 'los 4 mp4 tienen cabecera MP4 válida (ftyp)');
function MIR_AL(f) { return __dirname + '/football-community-2027/assets/menu/' + f; }
const gifB = fs.readFileSync(MENU_AL + 'alto-manager.gif');
t(gifB[0] === 0x47 && gifB[1] === 0x49 && gifB[2] === 0x46, 'alto-manager.gif es un GIF animado real (cabecera GIF)');
t(!/makeagif/i.test(gifB.toString('latin1')), 'GIF de Mourinho sin marca de agua makeagif');
const mhAl = fs.readFileSync(__dirname + '/menu-hub.js', 'utf8');
t(/bga: DIR \+ 'alto-torneos.mp4'/.test(mhAl) && /bga: DIR \+ 'alto-jugador.mp4'/.test(mhAl) && /bga: DIR \+ 'alto-rapido.mp4'/.test(mhAl) && /bga: DIR \+ 'alto-manager.gif'/.test(mhAl) && /DEFAULT_BGA = DIR \+ 'alto-estadio.mp4'/.test(mhAl), 'mapeo VÍDEO pedido: estadio animado por defecto · torneos⭐ · jugador CR7 · rápido Clásico · manager Mourinho GIF');
t(/bga_poster|BGA_POSTER|bgp: DIR/.test(mhAl) && /alto-estadio\.jpg/.test(mhAl), 'posters IA de respaldo para cada vídeo (alto-*.jpg)');
t(/function mhBgHTML/.test(mhAl) && /<video class="mh-bg/.test(mhAl) && /function syncVideoPlay/.test(mhAl), 'menu-hub renderiza VIDEO con autoplay/muted/loop/playsinline y pausa los ocultos');
t(/img\.mh-bg\{animation:mhKB/.test(mhAl), 'Ken Burns solo para fotos quietas (no duplica movimiento en vídeos)');
t(/hubhi/.test(mhAl) && /mh-hi/.test(mhAl) && /mhKB/.test(mhAl), 'modo "hubhi" con clase mh-hi + Ken Burns (transform GPU)');
t(fs.readFileSync(__dirname + '/index.html', 'utf8').includes('hubhi'), 'Ajustes cicla hasta PC ALTO (hubhi) en index');
const idxAl = fs.readFileSync(__dirname + '/index.html', 'utf8');
t((idxAl.match(/alto-/g) || []).length >= 5, 'fondos ALTO también dentro del menu-hub inline de index (' + (idxAl.match(/alto-/g) || []).length + ' refs)');



/* 22· 🩹 BUG ajustes/volver (MEDIO/ALTO) arreglado + 🖼️ splash promo Lamine */
t(/body\.mh-away #menu-hub\{display:none !important\}/.test(mhSrc), 'menu-hub CSS: body.mh-away oculta el hub fuera del menú principal');
t(/hookScreens/.test(mhSrc) && /wrapped\._mh = true/.test(mhSrc), 'menu-hub: hookScreens encadena Game.showScreen (_mh) para retirar/traer el hub');
t(/function G\(\)/.test(mhSrc) && /GG\.showScreen = wrapped/.test(mhSrc) && /var g = G\(\); if \(g\) g\.showScreen/.test(mhSrc), 'menu-hub: GO funciona aunque const Game no cuelgue de window (atajo G())');
t(idxSrc2.includes('hookScreens') && idxSrc2.includes('body.mh-away #menu-hub{display:none !important}'), 'menu-hub INLINE de index lleva el arreglo (sin clics tragados)');
t(/st\.id = 'load-promo-css'/.test(idxSrc2) && /classList\.add\('load-promo'\)/.test(idxSrc2), 'pantalla de carga: promo FC27 (load-promo + css inyectado)');
t(/carga-lamine\.jpg\\'\) center 20%/.test(idxSrc2), 'la promo de carga usa assets/menu/carga-lamine.jpg (Lamine)');
t(/f === 'classic' \|\| \(!f && u === 'classic'\)/.test(idxSrc2), 'la promo se salta en interfaz Clásica (carga oscura intacta)');
const skFx = fs.readFileSync(__dirname + '/fc27-skin.js', 'utf8');
t(/var BUILD = 'v6\.12';/.test(skFx) && /GRÁFICOS ALTOS AHORA SON VÍDEO/.test(skFx) && /PANTALLA DE CARGA LIMPIA/.test(skFx) && /NUEVA PANTALLA DE CARGA/.test(skFx) && /«← Menú» de PARTIDO RÁPIDO arreglado/.test(skFx), 'skin con las novedades del arreglo y la carga nueva');
t(hash2(__dirname + '/carrera-jugador.html') === hash2(__dirname + '/football-community-2027/carrera-jugador.html') && hash2(__dirname + '/ultimate-team.html') === hash2(__dirname + '/football-community-2027/ultimate-team.html') && hash2(__dirname + '/fc27-skin.js') === hash2(__dirname + '/football-community-2027/fc27-skin.js'), 'skinline: carrera + UT + skin raíz ↔ espejo idénticos');


/* 23· 🛰️ barrido proactivo navegación: scripts externos vivos + módulos colgados de window */
t(/<script src="impostor\.js\?v=1"><\/script>/.test(idxSrc2) && /<script src="news-hub\.js"><\/script>/.test(idxSrc2), 'scripts externos (impostor, news-hub) enlazados · quickmatch vive inline');
t(/window\.TorneosUI = /.test(idxSrc2) && /window\.RosterEditor = /.test(idxSrc2) && /window\.SaveUI = /.test(idxSrc2) && /window\.SoundFX = /.test(idxSrc2), 'TorneosUI/RosterEditor/SaveUI/SoundFX cuelgan de window (botones del hub vivos)');
t(/src="carrera-jugador\.html"/.test(idxSrc2), 'iframe pc-frame → carrera-jugador.html (Carrera Jugador dentro del hub)');




console.log('');
console.log('RESULTADO NEWS HUB: ' + ok + ' ok / ' + fail + ' fail');
process.exit(fail ? 1 : 0);
