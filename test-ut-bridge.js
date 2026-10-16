/* ═══ E2E: 🃏 ULTIMATE TEAM ↔ CANCHA FC27 — real boot jsdom ═══
   Boot del ultimate-team.html real, semilla de club con 13 cartas,
   UTBridge.launchUT() → overlay con plantel → pitazo FC27_RESULT_UT →
   coins/record/modal exactos. Uso: node test-ut-bridge.js [/ruta/ultimate-team.html] */
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = process.argv[2] || '/home/user/ultimate-team.html';
const html = fs.readFileSync(path, 'utf-8');

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(e.detail && e.detail.message || e.message));
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

/* semilla: club con XI completo + 2 suplentes */
function seed() {
  const chars = [];
  const mk = (id, name, pos, rating) => ({ id, name, pos, rating, club: 'Test FC', sub: 0, nat: 'esp' });
  const cfg = [   /* pos = FAMILIA (POR/DEF/MED/DEL) — igual que las cartas reales del POOL UT */
    ['c0', 'Meta Primo', 'POR', 78],
    ['c1', 'Muro Izan', 'DEF', 82], ['c2', 'Bujía Lope', 'DEF', 81], ['c3', 'Carril Álex', 'DEF', 80], ['c4', 'Carril Oli', 'DEF', 80],
    ['c5', 'Brújula Pim', 'MED', 85], ['c6', 'Motor Inés', 'MED', 83], ['c7', 'Farol Javi', 'MED', 86],
    ['c8', 'Rayo Txemi', 'DEL', 84], ['c9', 'Gol Ander', 'DEL', 88], ['c10', 'Bala Víctor', 'DEL', 83],
    ['c11', 'Suplente Ural', 'MED', 70], ['c12', 'Suplente Brasa', 'DEL', 72]
  ];
  cfg.forEach(a => chars.push(mk(a[0], a[1], a[2], a[3])));
  return {
    version: 4, coins: 5000, cards: chars,
    xi: ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'],
    formation: '4-3-3', played: 0, wins: 0, draws: 0, seq: 99, history: [],
    obj: { wins: 0, goals: 0, packs: 0, ifs: 0, claimed: [] },
    market: null, sbcDone: [], codes: [], tp: 0, tierWins: {}, galacticKey: false,
    inv: { plata: 0, oro: 0, elite: 0 },
    starter: true, welcomed: true, tutorialDone: true, bdorAnn: 1, bdorNews: 1, bdorNews2: 1, evtNews1: 1
  };
}

const dom = new JSDOM(html, {
  url: 'http://localhost/ultimate-team.html', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(window) {
    try { window.sessionStorage && window.sessionStorage.setItem('fc27_ut_ok', '1'); } catch (e) {}   /* 🏠 pase legítimo: venimos del menú */
    const mem = { 'fc27_ultimate_proto_v1': JSON.stringify(seed()) };
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: k => mem[k] ?? null, setItem: (k, v) => { mem[k] = String(v); },
        removeItem: k => { delete mem[k]; }, clear: () => { Object.keys(mem).forEach(k => delete mem[k]); },
        key: i => null, get length() { return 0; }
      }
    });
    window.HTMLCanvasElement.prototype.getContext = function () { return new Proxy({}, { get: (t, p) => p === 'canvas' ? null : (p === 'measureText' ? () => ({ width: 0 }) : () => ({})) }); };
    window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  }
});
const window = dom.window;

let ok = 0, fail = 0;
function t(name, fn) { try { const r = fn(); if (r === false) { fail++; console.log('  ✗ ' + name); } else { ok++; console.log('  ✓ ' + name); } } catch (e) { fail++; console.log('  ✗ ' + name + ' — ' + e.message); } }

setTimeout(() => {
  console.log('── boot Ultimate Team (club semilla) ──');
  t('página arranca sin errores fatales', () => errors.length === 0);
  t('UTBridge montado en window', () => !!window.UTBridge && typeof window.UTBridge.launchUT === 'function');
  t('botón 🎮 b-cancha existente junto al ▶', () => !!window.document.getElementById('b-cancha') && !!window.document.getElementById('b-play'));
const st = window.eval('window.UT && window.UT.state');
  t('club semilla cargado (13 cartas, XI alineado)', () => st && st.cards.length === 13 && st.xi.filter(x => x).length === 11);
  const F = window.eval('UTBridge._fichas()');
  t('fichas UT: ≥11 unidades, 1 POR al final', () => {
    const por = F.filter(f => f.p === 'POR');
    return F.length >= 11 && por.length === 1 && F[F.length - 1].p === 'POR';
  });
  t('ratings UT pasan vivos (Gol Ander ⭐88)', () => F.some(f => f.n.indexOf('Gol Ander') === 0 && f.r >= 80));
  t('v8.1 decks evento montados (UCL 17 · BLK 11)', () => window.eval('UT.UCL_DECK.length') === 17 && window.eval('UT.BLU_DECK.length') === 11);
  t('v8.1 EMMANUEL 119 es chase en ambos decks', () => window.eval('UT.UCL_DECK.filter(function(d){return d.chase && d.rating===119 && d.name==="Emmanuel";}).length') === 1 && window.eval('UT.BLU_DECK.filter(function(d){return d.chase;}).length') === 1);
  t('v8.1 rollUcl/rollBlu generan 2 cartas con arte', () => { const r1 = window.eval('UT.rollUcl()'), r2 = window.eval('UT.rollBlu()'); return r1.length === 2 && r2.length === 2 && r1.every(c => !!c.art) && r2.every(c => !!c.art); });
  t('v8.1 código EMMANUEL119 entrega la carta 119', () => { const b4 = window.eval('UT.state.cards.length'); window.eval('UT.redeemCode(\'EMMANUEL119\')'); const cc = window.eval('UT.state.cards'); return cc.length === b4 + 1 && cc.some(c => c.name === 'Emmanuel' && c.rating === 119 && c.version === 'CRACK119'); });
  t('v8.1 sobres nuevos en tienda e inventario (b-c8/b-c9 + INV_DEFS)', () => !!window.document.getElementById('b-c8') && !!window.document.getElementById('b-c9') && window.eval('UT.INV_DEFS.some(function(d){return d[0]==="ucl";})') && window.eval('UT.INV_DEFS.some(function(d){return d[0]==="blk";})'));

  t('botón 🎮 cableado al puente (onclick=launchUT)', () => {
    return window.eval("typeof document.getElementById('b-cancha').onclick") === 'function';
  });
  window.eval("(function(){var _pm=window.UT.playMatch;window.UT.playMatch=function(){try{return _pm.apply(this,arguments);}catch(e){window.__exc=String(e.stack||e.message);var s=window.UT.state;window.__poses=s.xi.map(function(id,i){var c=s.cards.find(function(x){return x.id===id;});return i+i2x(c);}).join(' | ');function i2x(c){return String(c?c.pos+'/'+c.name:'NO-CARD');}throw e;}};})()");
  t('launchUT arma el partido en cancha', () => {
    const dbg = window.eval("(function(x){window.__errx='';try{UTBridge.launchUT();}catch(e2){window.__errx=e2.message;}return JSON.stringify({toast:(document.getElementById('toast')||{}).textContent,pend:UTBridge._pending()!==null,ifr:document.querySelectorAll('iframe').length,dis:document.getElementById('b-cancha').disabled,ex:window.__errx,pm:(window.__exc||'').split('\\n').slice(0,3).join('~')});})()");
    console.log('   tras launch →', dbg);
    const pes = window.eval("(function(){return (window.__poses||'').slice(0,400);})()");
    if (pes) console.log('   poses XI:', pes);
    return dbg.indexOf('"pend":true') > 0;
  });
  const src = window.eval("(function(){var all=document.querySelectorAll('iframe');for(var i=0;i<all.length;i++){var s=all[i].src||'';if(s.indexOf('bus=ut')>0)return s;}return 'NOFRAME';})()");
  t('overlay de cancha con bus=ut', () => src.indexOf('bus=ut') > 0);
  t('🎚️ ladder Amateur: su dificultad viaja (diff=0 · dpc=100)', () => src.indexOf('diff=0') > 0 && src.indexOf('dpc=100') > 0);
  t('🏆 ladder: el peldaño firma el marcador (comp=ut · compx Amateur)', () => src.indexOf('comp=ut') > 0 && src.indexOf('compx=') > 0);
  t('🎛️ sin gustos guardados: la URL sale limpia (sin pop/cmt/pad/bsz)', () => src.indexOf('pop=0') < 0 && src.indexOf('cmt=0') < 0 && src.indexOf('pad=') < 0 && src.indexOf('bsz=') < 0);
  t('lleva MI plantel UT (Gol Ander en roster)', () => {
    if (src === 'NOFRAME') return false;
    const roster = JSON.parse(decodeURIComponent(src.split('roster=')[1].split('&')[0]));
    return roster.some(f => f.n.indexOf('Gol Ander') === 0 && f.p === 'DEL');
  });
  t('plantel rival generado (11 unidades)', () => {
    if (src === 'NOFRAME') return false;
    const ra = JSON.parse(decodeURIComponent(src.split('rosterA=')[1]));
    return ra.length >= 11 && ra.filter(f => f.p === 'POR').length === 1;
  });
  t('partido pendiente capturado (para firmar el acta)', () => !!window.eval('UTBridge._pending()'));

  const coins0 = window.eval('window.UT.state.coins');
  window.eval("window.postMessage({type:'FC27_RESULT_UT',gh:3,ga:1},'*')");
  console.log('   pend justo tras pitazo:',window.eval('UTBridge._pending()!==null'));
  setTimeout(() => {
   const snap = window.eval('(function(){var s=window.UT.state;return {played:s.played,wins:s.wins,draws:s.draws,coins:s.coins,tw:(s.tierWins||{})[0]||0,ogoals:s.obj.goals,owins:s.obj.wins,modal:document.getElementById("mback").classList.contains("on"),body:document.getElementById("modal").innerHTML.slice(0,70),btn:document.getElementById("b-cancha").disabled};})()');
   snap.pend = window.eval('UTBridge._pending()');
   snap.ov = window.eval("(function(){var all=document.querySelectorAll('iframe');for(var i=0;i<all.length;i++){if((all[i].src||'').indexOf('bus=ut')>0)return true;}return false;})()");
   console.log('   tras pitazo 3-1 →', JSON.stringify(snap));
   t('un partido más jugado y GANADO', () => snap.played === 1 && snap.wins === 1);
   t('monedas justas (Amateur: 250 victoria + 3×30 goles = 340)', () => snap.coins === coins0 + 340);
   t('tierWins Amateur +1 (cuenta para el Portal 🛸)', () => snap.tw === 1);
   t('objetivos alimentan (3 GF, 1 W)', () => snap.ogoals === 3 && snap.owins === 1);
   t('modal de crónica «JUGADO EN CANCHA» visible', () => snap.modal === true && snap.body.indexOf('CANCHA') > 0);
   t('overlay cerrado, acta consumida, botón listo', () => snap.ov === false && snap.pend === null && snap.btn === false);

   /* segunda prueba: derrota en cancha no rompe nada y suma consuelo */
   window.eval("(function(){var b=document.getElementById('m-okut');if(b)b.click();})()");
   window.eval("document.getElementById('b-cancha').click()");
   const c1 = window.eval('window.UT.state.coins');
   window.eval("window.postMessage({type:'FC27_RESULT_UT',gh:0,ga:2},'*')");
   setTimeout(() => {
    const s2 = window.eval('(function(){var s=window.UT.state;return {played:s.played,wins:s.wins,draws:s.draws,coins:s.coins};})()');
    console.log('   tras 2º partido (0-2) →', JSON.stringify(s2));
    t('derrota: jugado +1, récord intacto, consuelo 60', () => s2.played === 2 && s2.wins === 1 && s2.draws === 0 && s2.coins === c1 + 60);

    /* ─ DRAFT jugable: 4 rondas reales y premio por verbena cancha ─ */
    window.eval(`(function(){
      var U=window.UT, s=U.state;
      var slots=U.FORMATION_SLOTS['4-3-3'];
      s.draft={fmt:'4-3-3',step:11,offer:[],results:[],w:0,over:false,free:true,claimed:false,squad:[]};
      var names=['Portero','Robles','Crespo','Ayala','Mena','Pozo','Ríos','Vega','Santos','Costa','Elías'];
      for(var i=0;i<11;i++){s.draft.squad.push({id:'dr'+i,name:names[i],pos:slots[i],rating:88+(i%5),club:'Draft CF',sub:'Sub',nat:'HON'});}
    })()`);
    const slot0 = window.eval("String(window.UT.FORMATION_SLOTS['4-3-3'][0])");
    t('draft semado: slot 0 es POR', () => slot0 === 'POR');
    window.eval("UTBridge.launchDraft()");
    const srcD = window.eval("(function(){var all=document.querySelectorAll('iframe'),f=null;for(var i=0;i<all.length;i++){if((all[i].src||'').indexOf('bus=ut')>=0){f=all[i];break;}}return f?f.src:'NOFRAME';})()");
    t('draft: cancha abierta con Tu Draft', () => srcD.indexOf('club=Tu%20Draft') > 0 && srcD.indexOf('form=4-3-3') > 0);
    t('🎚️ draft R1: dificultad de RONDA 1 viaja (diff=1 · dpc=100)', () => srcD.indexOf('diff=1') > 0 && srcD.indexOf('dpc=100') > 0);
    t('🎪 draft: la ronda firma el marcador (comp=draft · compx RONDA)', () => srcD.indexOf('comp=draft') > 0 && srcD.indexOf('compx=RONDA') > 0);
    const raD = srcD === 'NOFRAME' ? [] : JSON.parse(decodeURIComponent(srcD.split('roster=')[1].split('&')[0]));
    t('draft: XI del draft viaja entero (11 fichas, 1 POR y va última)', () => raD.length === 11 && raD.filter(f => f.p === 'POR').length === 1 && raD[raD.length - 1].p === 'POR');
    window.eval("window.postMessage({type:'FC27_RESULT_UT',gh:3,ga:1},'*')");
    setTimeout(() => {
      const d1 = JSON.parse(window.eval("(function(){var d=window.UT.state.draft;return JSON.stringify({r:d.results.length,w:d.w,gf:d.results[0].gf,ga:d.results[0].ga,tag:d.results[0].tag,riv:!!d.results[0].rival,over:d.over});})()"));
      console.log('   tras R1 draft 3-1 →', d1);
      t('R1 anotada: 3-1 victoria, w=1', () => d1.r === 1 && d1.w === 1 && d1.gf === 3 && d1.ga === 1 && d1.tag !== null && d1.riv);
      window.eval("(function(){var b=document.getElementById('m-okdr');if(b)b.click();})()");
      window.eval("UTBridge.launchDraft()");
      window.eval("window.postMessage({type:'FC27_RESULT_UT',gh:1,ga:1},'*')");
      setTimeout(() => {
        const d2 = JSON.parse(window.eval("(function(){var d=window.UT.state.draft;return JSON.stringify({r:d.results.length,w:d.w});})()"));
        t('R2 empate: juega y no suma (igual que en simulación)', () => d2.r === 2 && d2.w === 1);
        window.eval("UTBridge.launchDraft()");
        window.eval("window.postMessage({type:'FC27_RESULT_UT',gh:2,ga:0},'*')");
        setTimeout(() => {
          window.eval("UTBridge.launchDraft()");
          const coinsBefore = window.eval('window.UT.state.coins');
          window.eval("window.postMessage({type:'FC27_RESULT_UT',gh:1,ga:0},'*')");
          setTimeout(() => {
            const d4 = JSON.parse(window.eval("(function(){var d=window.UT.state.draft,s=window.UT.state;return JSON.stringify({r:d.results.length,w:d.w,over:d.over,coins:s.coins,inv:s.inv||{}});})()"));
            console.log('   tras R4 draft →', d4, '| coins antes:', coinsBefore);
            t('torneo cerrado con 3 victorias', () => d4.over === true && d4.w === 3 && d4.r === 4);
            t('premio 3 vic: +4.000💰 y pack ORO en inventario', () => d4.coins === coinsBefore + 4000 && (d4.inv['oro'] || 0) >= 1);
            t('modal de crónica del draft visible', () => window.eval("!!document.getElementById('m-okdr')") === true);
            console.log('\nRESULTADO E2E UT: ' + ok + ' ok / ' + fail + ' fail');
            if (errors.length) console.log('   errores de página:', errors.slice(0, 4));
            process.exit(fail ? 1 : 0);
          }, 700);
        }, 700);
      }, 700);
    }, 700);
   }, 700);
  }, 700);
}, 3800);
