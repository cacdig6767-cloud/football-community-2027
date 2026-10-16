/* ═══════════════════════════════════════════════════════════════════════════
   📰 NEWS HUB FC27 — la redacción del juego (v1 · 12-oct)
   Motor ÚNICO compartido: Modo Manager (index.html) + Carrera Jugador (carrera-jugador.html).
   · Feed con portadas coherentes por liga (12 redacciones), jugadores REALES del planeta.
   · Rumores V/F VERIFICABLES: si el News Hub anuncia "Pau Cubarsí al United", el United
     lo REGISTRA (efecto real: el rival cambia de rating/presupuesto; si es tuyo, se vende con pasta).
   · Portadas absurdas 🛸 sazonadas (nunca más del ~14%).
   · Pop-ups regulados: misma jornada máx 1 mundana + SIEMPRE las tuyas; se apagan en Ajustes.
   · Líneas de premsa: la rueda de prensa pregunta por los rumores vivos (V/F) → más vivo.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ── Las 12 redacciones del planeta ── */
var LEAGUES = [
  { k: 'esp', n: '🇪🇸 LaLiga', clubes: ['Real Madrid', 'FC Barcelona', 'Atlético de Madrid', 'Sevilla', 'Girona', 'Athletic Club'] },
  { k: 'eng', n: '🏴 Premier League', clubes: ['Manchester City', 'Arsenal', 'Liverpool', 'Manchester United', 'Chelsea', 'Tottenham', 'Newcastle'] },
  { k: 'ita', n: '🇮🇹 Serie A', clubes: ['Inter', 'Juventus', 'Milan', 'Napoli', 'Roma', 'Atalanta'] },
  { k: 'ale', n: '🇩🇪 Bundesliga', clubes: ['Bayern Múnich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig'] },
  { k: 'fra', n: '🇫🇷 Ligue 1', clubes: ['PSG', 'Mónaco', 'Marsella', 'Lyon'] },
  { k: 'por', n: '🇵🇹 Liga Portugal', clubes: ['Benfica', 'Porto', 'Sporting CP'] },
  { k: 'hol', n: '🇳🇱 Eredivisie', clubes: ['Ajax', 'PSV', 'Feyenoord'] },
  { k: 'arg', n: '🇦🇷 Liga Profesional', clubes: ['Boca Juniors', 'River Plate', 'Racing'] },
  { k: 'bra', n: '🇧🇷 Brasileirão', clubes: ['Palmeiras', 'Flamengo', 'Botafogo'] },
  { k: 'mex', n: '🇲🇽 Liga MX', clubes: ['América', 'Chivas', 'Tigres'] },
  { k: 'usa', n: '🇺🇸 MLS', clubes: ['Inter Miami', 'LAFC', 'LA Galaxy'] },
  { k: 'hon', n: '🇭🇳 Liga Nacional', clubes: ['Olimpia', 'Motagua', 'Marathón'] }
];
function leagueByClub(club) {
  for (var i = 0; i < LEAGUES.length; i++) if (LEAGUES[i].clubes.indexOf(club) >= 0) return LEAGUES[i].k;
  return null;
}
var LKEY = {}; LEAGUES.forEach(function (L) { LKEY[L.k] = L; });

/* ── Jugadores mediáticos REALES (roster del News Hub, tiene precio y club) ── */
var STARS = [
  { n: 'Lamine Yamal', c: 'FC Barcelona', pos: 'DEL', v: 120 },
  { n: 'Pau Cubarsí', c: 'FC Barcelona', pos: 'DEF', v: 46 },
  { n: 'Pedri', c: 'FC Barcelona', pos: 'MED', v: 95 },
  { n: 'Gavi', c: 'FC Barcelona', pos: 'MED', v: 85 },
  { n: 'Jude Bellingham', c: 'Real Madrid', pos: 'MED', v: 130 },
  { n: 'Vinícius Jr', c: 'Real Madrid', pos: 'DEL', v: 140 },
  { n: 'Rodrygo', c: 'Real Madrid', pos: 'DEL', v: 90 },
  { n: 'Antoine Griezmann', c: 'Atlético de Madrid', pos: 'DEL', v: 38 },
  { n: 'Erling Haaland', c: 'Manchester City', pos: 'DEL', v: 150 },
  { n: 'Phil Foden', c: 'Manchester City', pos: 'MED', v: 105 },
  { n: 'Bukayo Saka', c: 'Arsenal', pos: 'DEL', v: 98 },
  { n: 'Declan Rice', c: 'Arsenal', pos: 'MED', v: 88 },
  { n: 'Mohamed Salah', c: 'Liverpool', pos: 'DEL', v: 75 },
  { n: 'Virgil van Dijk', c: 'Liverpool', pos: 'DEF', v: 55 },
  { n: 'Bruno Fernandes', c: 'Manchester United', pos: 'MED', v: 70 },
  { n: 'Kobbie Mainoo', c: 'Manchester United', pos: 'MED', v: 50 },
  { n: 'Cole Palmer', c: 'Chelsea', pos: 'MED', v: 100 },
  { n: 'Lautaro Martínez', c: 'Inter', pos: 'DEL', v: 95 },
  { n: 'Nicolò Barella', c: 'Inter', pos: 'MED', v: 80 },
  { n: 'Dušan Vlahović', c: 'Juventus', pos: 'DEL', v: 70 },
  { n: 'Rafael Leão', c: 'Milan', pos: 'DEL', v: 75 },
  { n: 'Khvicha Kvaratskhelia', c: 'Napoli', pos: 'DEL', v: 85 },
  { n: 'Harry Kane', c: 'Bayern Múnich', pos: 'DEL', v: 80 },
  { n: 'Jamal Musiala', c: 'Bayern Múnich', pos: 'MED', v: 115 },
  { n: 'Florian Wirtz', c: 'Bayer Leverkusen', pos: 'MED', v: 105 },
  { n: 'Ousmane Dembélé', c: 'PSG', pos: 'DEL', v: 70 },
  { n: 'Zaire-Emery', c: 'PSG', pos: 'MED', v: 75 },
  { n: 'Lionel Messi', c: 'Inter Miami', pos: 'DEL', v: 45 },
  { n: 'Anthony Santos', c: 'River Plate', pos: 'MED', v: 30 },
  { n: 'André Addai', c: 'Flamengo', pos: 'DEL', v: 28 }
];
function starPool(club) {
  var out = STARS.filter(function (s) { return club ? s.c === club : true; });
  return out;
}

/* ── Estado ── */
function ensure(s) {
  if (!s) return null;
  if (!s.newsHub) s.newsHub = { feed: [], queue: [], leagues: [], chosen: false, popups: true, cd: 0, tick: 0, idn: 0, pressCd: 0 };
  return s.newsHub;
}
function R(n) { return Math.floor(Math.random() * n); }
function pick(arr) { return arr[R(arr.length)]; }
function esc(x) { return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

/* ── Adaptadores: cómo cada modo "hace real" lo que se publica ── */
function ctxOf(mode, s) {
  /* devuelve {me, myClub, myPlayers:[nombres], fee(x), moveTeamShift(club, delta), sellMine(name,fee), note(t,b), save()} */
  if (mode === 'mgr') {
    return {
      me: (s && s.myTeam) || 'mi club',
      myClub: (s && s.myTeam) || '',
      myPlayers: (s && s.squad ? s.squad : []).map(function (p) { return p.name; }),
      moveTeamShift: function (club, delta) {
        try { (s.teams || []).forEach(function (t) { if (t.name === club) t.rating = Math.max(50, Math.min(99, (t.rating || 80) + delta)); }); } catch (e) {}
      },
      sellMine: function (name, fee) {
        try {
          var ix = (s.squad || []).findIndex(function (p) { return name.indexOf(p.name.split(' ').slice(-1)[0]) >= 0; });
          if (ix < 0) return false;
          var pl = s.squad[ix];
          s.squad.splice(ix, 1);
          s.budget = Math.round(((s.budget || 0) + fee) * 10) / 10;
          if (typeof ManagerCareer !== 'undefined') ManagerCareer.pushNews('💸 Venta oficial: ' + pl.name, 'El News Hub lo firmó: ' + pl.name + ' sale por ' + fee + 'M€. El dinero ya está en caja.');
          (s.startingXI || []).forEach(function (pid, i) { if (pid === pl.id) s.startingXI.splice(i, 1); });
          return true;
        } catch (e) { return false; }
      },
      addMine: function (star) {
        try {
          var NP = { id: 'nk' + Date.now().toString(36) + R(99), name: star.n, pos: star.pos, rating: Math.min(99, 80 + R(8)), wage: 120, value: star.v, morale: 78, form: 74, goals: 0 };
          (s.squad = s.squad || []).push(NP);
          if (typeof ManagerCareer !== 'undefined') ManagerCareer.pushNews('✍️ ¡' + star.n + ' ES TUYO!', 'El News Hub no fallaba: ' + star.n + ' viste ya tu escudo. Valor: ' + star.v + 'M€.');
          return true;
        } catch (e) { return false; }
      },
      note: function (t, b) { try { if (typeof ManagerCareer !== 'undefined') ManagerCareer.pushNews(t, b); } catch (e) {} }
    };
  }
  return { /* 'pl' — Carrera jugador: mundo narrativo + tu situación personal */
    me: (s && (s.name || (s.player && s.player.name))) || 'tu crack',
    myClub: (s && s.club) || '',
    myPlayers: [],
    moveTeamShift: function () {},
    sellMine: function () { return false; },
    addMine: function () { return false; },
    note: function () {}
  };
}

/* ════ PLANTILLAS DE PORTADA ════ */
/* ── niveles de mercado: con QUIÉN puede hablar cada estrella (adiós "Musiala al Motagua") ── */
var CLUB_TIER = {};
(function () {
  var T3 = ['Real Madrid', 'FC Barcelona', 'Manchester City', 'Arsenal', 'Liverpool', 'Bayern Múnich', 'PSG', 'Inter'];
  var T2 = ['Atlético de Madrid', 'Manchester United', 'Chelsea', 'Juventus', 'Milan', 'Napoli', 'Borussia Dortmund', 'Bayer Leverkusen', 'Sevilla', 'Roma', 'Atalanta', 'Newcastle', 'Tottenham'];
  var T1 = ['Girona', 'Athletic Club', 'RB Leipzig', 'Mónaco', 'Marsella', 'Lyon'];
  T3.forEach(function (c) { CLUB_TIER[c] = 3; });
  T2.forEach(function (c) { CLUB_TIER[c] = 2; });
  T1.forEach(function (c) { CLUB_TIER[c] = 1; });
})();
function clubTier(c) { return CLUB_TIER[c] != null ? CLUB_TIER[c] : 0; }   /* resto: ligas emergentes/locales = 0 */
function starTier(st) { return st.v >= 100 ? 3 : (st.v >= 55 ? 2 : 1); }
function canMove(st, to, tipo) {
  /* coherencia pura · se usa para FILTRAR cualquier rumor (catálogo y generado) */
  var lg = leagueByClub(to), tC = clubTier(to);
  if (tipo === 'petro') return st.v >= 38 && (lg === 'usa' || lg === 'mex');           /* maletín MLS/MX solo para veteranos/grandes */
  if (tipo === 'prestamo') return st.v < 90 && (tC >= 1 || st.v < 35);                 /* cedidos: jóvenes baratos sí llegan a ligas humildes */
  var tS = starTier(st);
  if (tS === 3) return tC >= 2;                                                        /* élite solo élite/grandes */
  if (tS === 2) return tC >= 1;                                                        /* estrellas: grandes o medios de top-5 */
  return st.v >= 35 ? tC >= 1 : tC <= 2;                                               /* promesas baratas: mercado amplio no-élite */
}

/* ── CATÁLOGO · 104 nubes de mercado coherentes (star|destino|tipo) ── */
var MOVES = [
  /* 💣 BOMBAZOS élite ↔ élite */ 'Vinícius Jr|Manchester City|bombazo','Jude Bellingham|PSG|bombazo','Lamine Yamal|PSG|bombazo','Erling Haaland|Real Madrid|bombazo','Jamal Musiala|Real Madrid|bombazo','Florian Wirtz|Bayern Múnich|bombazo','Phil Foden|FC Barcelona|bombazo','Cole Palmer|Real Madrid|bombazo','Erling Haaland|FC Barcelona|bombazo','Vinícius Jr|PSG|bombazo','Jude Bellingham|Liverpool|bombazo','Lamine Yamal|Manchester City|bombazo','Jamal Musiala|Manchester City|bombazo','Cole Palmer|PSG|bombazo','Florian Wirtz|Real Madrid|bombazo','Phil Foden|Arsenal|bombazo',
  /* 👀 interés élite → grande */ 'Vinícius Jr|Manchester United|interes','Jude Bellingham|Juventus|interes','Lamine Yamal|Chelsea|interes','Erling Haaland|Atlético de Madrid|interes','Florian Wirtz|Manchester United|interes','Cole Palmer|Napoli|interes','Phil Foden|Milan|interes',
  /* ⭐ estrellas → élite */ 'Bukayo Saka|Real Madrid|interes','Pedri|Manchester City|subasta','Gavi|Bayern Múnich|interes','Lautaro Martínez|FC Barcelona|clausula','Rodrygo|Arsenal|subasta','Khvicha Kvaratskhelia|Liverpool|interes','Declan Rice|Bayern Múnich|interes','Nicolò Barella|Manchester City|interes','Rafael Leão|PSG|interes','Dušan Vlahović|Arsenal|interes','Harry Kane|Real Madrid|interes','Zaire-Emery|Manchester City|interes','Ousmane Dembélé|Liverpool|interes',
  /* ⭐ estrellas → grande/media */ 'Mohamed Salah|Juventus|interes','Bruno Fernandes|Napoli|interes','Rodrygo|Chelsea|clausula','Dušan Vlahović|Manchester United|subasta','Nicolò Barella|Atlético de Madrid|interes','Rafael Leão|Chelsea|interes','Khvicha Kvaratskhelia|Manchester United|subasta','Lautaro Martínez|Atlético de Madrid|interes','Ousmane Dembélé|Borussia Dortmund|vuelta','Mohamed Salah|Roma|vuelta','Harry Kane|Tottenham|vuelta','Zaire-Emery|Mónaco|interes','Declan Rice|Newcastle|interes','Virgil van Dijk|Newcastle|interes','Nicolò Barella|RB Leipzig|interes','Rafael Leão|Tottenham|interes','Dušan Vlahović|Tottenham|interes',
  /* 🤑 maletín MLS/MX (veteranos y grandes figuras) */ 'Mohamed Salah|Inter Miami|petro','Harry Kane|LA Galaxy|petro','Bruno Fernandes|Inter Miami|petro','Antoine Griezmann|LA Galaxy|petro','Virgil van Dijk|LAFC|petro','Ousmane Dembélé|Inter Miami|petro','Lautaro Martínez|Inter Miami|petro','Antoine Griezmann|América|petro','Bruno Fernandes|LA Galaxy|petro','Lautaro Martínez|LAFC|petro',
  /* 💎 promesas (jóvenes/cañería sudamericana) */ 'Anthony Santos|Benfica|promesa','André Addai|Sporting CP|promesa','Anthony Santos|Ajax|promesa','André Addai|Porto|promesa','Anthony Santos|Marsella|promesa','André Addai|Sevilla|promesa','Anthony Santos|Atalanta|promesa','André Addai|RB Leipzig|promesa','Anthony Santos|Tigres|promesa','André Addai|Inter Miami|promesa','Anthony Santos|América|promesa','André Addai|Palmeiras|promesa','Pau Cubarsí|Inter|promesa','Kobbie Mainoo|Borussia Dortmund|promesa','Kobbie Mainoo|RB Leipzig|promesa','Gavi|Bayer Leverkusen|promesa',
  /* 🔄 préstamos (jóvenes cedidos, sabor CONCACAF incluido) */ 'Pau Cubarsí|Sevilla|prestamo','Kobbie Mainoo|Girona|prestamo','Zaire-Emery|Lyon|prestamo','André Addai|Botafogo|prestamo','Anthony Santos|Racing|prestamo','André Addai|Feyenoord|prestamo','Anthony Santos|PSV|prestamo','Kobbie Mainoo|Mónaco|prestamo','Pau Cubarsí|RB Leipzig|prestamo','Anthony Santos|Olimpia|prestamo','André Addai|Motagua|prestamo',
  /* ⚔️ subastas */ 'Florian Wirtz|Manchester City|subasta','Lautaro Martínez|Chelsea|subasta','Khvicha Kvaratskhelia|Arsenal|subasta','Nicolò Barella|Liverpool|subasta','Rafael Leão|Manchester City|subasta','Bukayo Saka|Manchester City|subasta','Gavi|Manchester City|subasta','Rodrygo|Liverpool|subasta',
  /* 📝 cláusulas */ 'Pedri|Bayern Múnich|clausula','Jude Bellingham|Manchester City|clausula','Dušan Vlahović|Milan|clausula','Pau Cubarsí|Manchester City|clausula','Kobbie Mainoo|Tottenham|clausula','Gavi|PSG|clausula','Harry Kane|Manchester United|clausula','Declan Rice|Chelsea|clausula'
];
var TIPO_TXT = {
  bombazo:  { tit: ['🔥 BOMBAZO MUNDIAL: ', '💣 TERREMOTO DE MERCADO: ', '🚨 EXCLUSIVA GLOBAL: '], bd: 'El mercado tiembla: %STAR% (%FROM%) tiene una oferta descomunal del %TO% por unos %FEE%M€. En el despacho no cuelga nadie el teléfono' },
  interes:  { tit: ['📡 RADAR ACTIVADO: ', '👀 SEGUIMIENTO SERIO: ', '🕵️ INTERÉS CONFIRMADO: '], bd: 'El %TO% siguió a %STAR% en directo tres veces este mes. Contactos iniciales con su entorno; el %FROM% pide calma' },
  petro:    { tit: ['🤑 MALETÍN AMERICANO: ', '💰 LA MLS MUEVE FICHA: '], bd: 'Oferta económica imposible de rechazar: %TO% pone sobre la mesa un contrato de leyenda para %STAR% (%FROM%). El entorno no lo descarta' },
  promesa:  { tit: ['💎 JAULA DE TALENTOS: ', '🌱 PROMESA EN ÓRBITA: '], bd: 'El %TO% quiere atar YA a %STAR% (%FROM%) antes de que explote: proyectíl deportivo y minutos garantizados por ~%FEE%M€' },
  prestamo: { tit: ['🔄 PRÉSTAMO CON OPCIÓN: ', '🧳 CEDIDO A PUNTO: '], bd: '%STAR% llegaría cedido al %TO% desde %FROM% con opción de compra y minutos asegurados. Las partes lo ven con buenos ojos' },
  subasta:  { tit: ['⚔️ GUERRA DE OFERTAS: ', '🔨 SUBASTA ABIERTA: '], bd: 'Tres clubes pujan por %STAR% (%FROM%), pero el %TO% ha subido la apuesta a %FEE%M€. La subasta puede irse de madre este fin de semana' },
  clausula: { tit: ['📝 CLÁUSULA EN LA MIRA: ', '💼 CLÁUSULA DE RESCISIÓN: '], bd: 'El %TO% estudia pagar la cláusula de %STAR% (%FROM%) de un plumazo: son %FEE%M€ sin negociación. En el club vendedor cruzan los dedos' },
  vuelta:   { tit: ['🏠 REGRESO A CASA: ', '💛 VUELVE AL NIDO: '], bd: '%STAR% quiere volver a casa: el %TO% ya habló con el %FROM% para vestirle de nuevo con sus colores. La grada sueña con el anuncio' }
};
function starByName(n) { for (var i = 0; i < STARS.length; i++) if (STARS[i].n === n) return STARS[i]; return null; }

function tplTransfer(hub, mode, s) {
  /* FICHAJE REAL: rumor primero, y al resolver el efecto SÍ ocurre. AHORA CON COHERENCIA DE MERCADO. */
  var ctx = ctxOf(mode, s);
  var st = null, to = null, tipo = 'interes', tries = 0;
  while (tries < 24 && !st) {
    tries++;
    var mv = pick(MOVES).split('|');
    var cand = starByName(mv[0]);
    if (!cand) continue;
    if (mv[1] === cand.c || mv[1] === ctx.myClub && cand.c === ctx.myClub) continue;
    if (mv[1] === cand.c) continue;
    if (!canMove(cand, mv[1], mv[2])) continue;
    st = cand; to = mv[1]; tipo = mv[2];
  }
  if (!st) { /* plan B generado, también filtrado por coherencia */
    tipo = 'prestamo';
    var cheap = starPool().filter(function (x) { return x.v < 35; });
    st = pick(cheap.length ? cheap : STARS);
    to = pick(LEAGUES.filter(function (L) { return L.k !== leagueByClub(st.c); }).flatMap(function (L) { return L.clubes; }).filter(function (c) { return canMove(st, c, 'prestamo') && c !== st.c; }) || ['Benfica']);
    if (!to) to = 'Benfica';
  }
  var truth = Math.random() < 0.62;
  var sobreMiClub = (st.c === ctx.myClub) || (to === ctx.myClub);
  var tanto = sobreMiClub ? 'tuyo' : 'mundo';
  var fee = Math.max(5, Math.round(st.v * (85 + R(31)) / 100));
  var rum = { id: ++hub.idn, truth: truth, type: 'out', star: st.n, from: st.c, to: to, fee: fee, eaten: false, tipo: tipo };
  var T = TIPO_TXT[tipo] || TIPO_TXT.interes;
  var tit = pick(T.tit);
  var body = T.bd.replace(/%STAR%/g, st.n).replace(/%FROM%/g, st.c).replace(/%TO%/g, to).replace(/%FEE%/g, fee) +
    '. Fuentes del vestuario ' + (truth ? 'lo dan por casi hecho.' : 'lo niegan con una sonrisa rara…');
  return {
    tag: 'FICHAJE', cat: tanto, title: tit + st.n + ' → ' + to,
    body: body,
    rum: rum, truth: null, real: truth
  };
}
function tplRenewal(hub, mode, s) {
  var st = pick(STARS);
  return { tag: 'CONTRATO', cat: 'mundo', title: '✍️ ' + st.n + ' renueva con el ' + st.c,
    body: 'El ' + st.c + ' esquiva un terremoto: ' + st.n + ' firma hasta 20' + (29 + R(3)) + ' con cláusula de ' + (300 + R(400)) + 'M€. "Aquí soy feliz", firmó sonriente.', truth: true, real: true };
}
function tplInjury(hub, mode, s) {
  var ctx = ctxOf(mode, s);
  var pool = ctx.myPlayers.slice();
  if (pool.length && Math.random() < 0.5) {
    var pn = pick(pool);
    hub.queue.push({ type: 'injury', name: pn, games: 1 + R(3) });
    return { tag: 'LESION', cat: 'tuyo', title: '🤕 ' + pn + ', tocado',
      body: pn + ' se retira entre algodones: parte médico definitivo en el portal. El News Hub puede adelantar: ' + (1 + R(2)) + ' semanas fuera. Fuerza.', truth: true, real: true };
  }
  var st = pick(STARS);
  return { tag: 'LESION', cat: 'mundo', title: '🏥 Parte médico en el ' + st.c,
    body: st.n + ' sufrió una sobrecarga y será duda hasta última hora. El ' + st.c + ' no arriesga con su estrella.', truth: true, real: true };
}
function tplStreak(hub, mode, s) {
  var ctx = ctxOf(mode, s);
  var rival = pick(LEAGUES.filter(function (L) { return true; }).reduce(function (o, L) { return o.concat(L.clubes); }, []).filter(function (c) { return c !== ctx.myClub; }));
  var good = R(2) === 0;
  return { tag: 'RACHA', cat: 'mundo', title: (good ? '🚀 Nadie frena al ' : '📉 Crisis en el ') + rival,
    body: good ? ('El ' + rival + ' hilvana ' + (4 + R(4)) + ' triunfos seguidos y ya le miden para el título. La afición sueña despierta.') : ('El ' + rival + ' lleva ' + (3 + R(3)) + ' sin ganar y el banquillo arde. Los directivos guardan silencio: mala señal.'), truth: true, real: true };
}
function tplManager(hub, mode, s) {
  var cl = pick(LEAGUES.reduce(function (o, L) { return o.concat(L.clubes); }, []));
  return { tag: 'BANQUILLO', cat: 'mundo', title: '🪓 El banquillo del ' + cl + ' tiembla',
    body: 'Los resultados no acompañan y en el entorno se habla de "plan B". Los agentes de dos entrenadores libres ya se frotan las manos.', truth: true, real: true };
}
function tplAbsurd(hub, mode, s) {
  var abs = [
    { t: '🛸 OVNI sobre la ciudad deportiva', b: 'Seguridad del club lo grabó sobrevolando el verde a las 3:33 AM. El preparador físico: "Eso explica las conos desaparecidos."' },
    { t: '🐐 Una cabra se comió las camisetas de calentamiento', b: 'La plantilla salió con ropa de calle. La tienda del club batió récord de ventas en 20 minutos. Casualidad?' },
    { t: '🍔 El delantero estrella confecciona su propia hamburguesa pre-partido', b: 'La llama "el 4-4-2 doble queso". El chef del club la incluirá en el menú oficial del estadio.' },
    { t: '🕯️ El mister ordenó encender velas en el banquillo por "la mala racha"', b: 'La liga estudia si es publicidad encubierta de la marca de velas. La racha, de momento, sigue sin voltear.' },
    { t: '🎮 Los suplentes montaron un torneo secreto de videojuegos', b: 'El capitán ganó y se lo toma como "entrenamiento de toma de decisiones bajo presión". Ciencia.' },
    { t: '🧊 El nuevo césped híbrido llega congelado literalmente', b: 'El operario asegura que siguió las instrucciones de "césped cool" al pie de la letra.' },
    { t: '🦜 Un loro robó el silbato del cuarto árbitro', b: 'Lo devolvió mordido y con mejores decisiones que su dueño, según testigos presenciales del estado.' },
    { t: '🧲 Los vestuarios quedaron imantados tras la "terapia magnética"', b: 'Las botas se pegaban a los cajones. La plantilla llama al elevador "el campo de juego dos".' }
  ];
  var a = pick(abs);
  return { tag: 'INSÓLITO', cat: 'mundo', title: a.t, body: a.b, truth: true, real: true, absurd: true };
}
function tplSocial(hub, mode, s) {
  var soc = [
    { t: '📱 La estrella del equipo rival borró sus publicaciones con el club', b: 'En lanza directa: red social en llamas. "No significa nada", dice su entorno. Significa todo, leen los álbumes.' },
    { t: '👕 La nueva tercera equipación se agotó en 48 horas', b: 'Hasta los madridistas admiten que está hermosa. Los revendedores piden perdón por escrito.' },
    { t: '🎤 El capitán hizo dueto con un cantante famoso', b: 'Los críticos lo califican de "mejor mediocentro que tenor, sin duda".' },
    { t: '🎥 Documental del club: el acceso total ya tiene fecha', b: 'Ocho episodios incluyendo la famosa bronca que nadie debió ver. Los memes se preparan desde febrero.' }
  ];
  var a = pick(soc);
  return { tag: 'SOCIAL', cat: 'mundo', title: a.t, body: a.b, truth: true, real: true };
}
/* Jugador-carrera: la portada gira en torno a TI */
function tplAboutYou(hub, mode, s) {
  var ctx = ctxOf(mode, s);
  var me = ctx.me, cl = ctx.myClub || 'tu club';
  var rival = pick(['Real Madrid', 'FC Barcelona', 'Manchester City', 'PSG', 'Bayern Múnich', 'Liverpool']);
  var ops = [
    function () {
      hub.queue.push({ type: 'compare', rival: rival });
      return { tag: 'TI', cat: 'tuyo', title: '⚖️ ¿' + me + ' o la estrella del ' + rival + '?',
        body: 'El debate de barra favorito del planeta. Los números tuyos hablan solos esta campaña; los suyos también. Sigue así y la respuesta será obvia.', truth: true, real: true };
    },
    function () {
      var truth = Math.random() < 0.5;
      hub.queue.push({ type: 'youRumor', club: rival, truth: truth, eaten: false });
      return { tag: 'RUMOR', cat: 'tuyo', title: '📡 ' + rival + ' te tiene en el radar',
        body: 'Ojeadores del ' + rival + ' siguieron cada minuto tuyo el último fin de semana. ' + (truth ? 'Tu agente no desmiente: hay interés formal.' : 'Tu entorno lo niega… pero la foto del director deportivo ya es viral.'), truth: null, real: truth, rumYou: { club: rival, truth: truth } };
    },
    function () {
      return { tag: 'TI', cat: 'tuyo', title: '🗣️ El ex-jugador de la casa te compara con leyendas',
        body: '"Me recuerda a mí con 20 años… pero con mejor primera toma", declaró, y la sala hundió el aplausómetro. ' + me + ', memeable hoy, leyenda pronto.', truth: true, real: true };
    },
    function () {
      return { tag: 'TI', cat: 'tuyo', title: '🧤 La crítica carga contra tu último partido',
        body: '"Zona gris: le falta continuidad", titularon con saña. La respuesta correcta solo se puede dar en el césped, no en Twitter, campeón.', truth: true, real: true };
    }
  ];
  return ops[R(ops.length)]();
}
function tplBoard(hub, mode, s) {
  var ctx = ctxOf(mode, s);
  return { tag: 'DIRECTIVA', cat: 'tuyo', title: '🏛️ La junta del ' + (ctx.myClub || 'club') + ' se reúne a puerta cerrada',
    body: 'Agenda oficial: "revisión deportiva". Agenda real: tu banquillo, tus fichajes y el presupuesto de fichaje estrella que pidieron por cartón. Saldrá humo blanco… o no.', truth: true, real: true };
}

/* ── Fabriquitas por modo ── */
var FACTORY_MGR = [
  { f: tplTransfer, w: 26, pop: true },
  { f: tplRenewal, w: 12, pop: true },
  { f: tplInjury, w: 12, pop: true },
  { f: tplStreak, w: 16, pop: false },
  { f: tplManager, w: 9, pop: false },
  { f: tplAbsurd, w: 10, pop: false },
  { f: tplSocial, w: 8, pop: false },
  { f: tplBoard, w: 7, pop: true }
];
var FACTORY_PL = [
  { f: tplAboutYou, w: 30, pop: true },
  { f: tplTransfer, w: 20, pop: true },
  { f: tplRenewal, w: 10, pop: true },
  { f: tplInjury, w: 10, pop: true },
  { f: tplStreak, w: 10, pop: false },
  { f: tplAbsurd, w: 12, pop: false },
  { f: tplSocial, w: 8, pop: false }
];
function spin(mode, hub, s) {
  var F = (mode === 'pl') ? FACTORY_PL : FACTORY_MGR;
  var tot = F.reduce(function (o, x) { return o + x.w; }, 0), r = Math.random() * tot;
  for (var i = 0; i < F.length; i++) { r -= F[i].w; if (r <= 0) { var it = F[i].f(hub, mode, s); it.pop = F[i].pop; return it; } }
  return tplStreak(hub, mode, s);
}

/* ── Resolución: lo publicado SE CUMPLE (o se desmiente oficialmente) ── */
function resolveQueue(hub, mode, s) {
  var ctx = ctxOf(mode, s), novedades = [];
  for (var i = hub.queue.length - 1; i >= 0; i--) {
    var q = hub.queue[i];
    q.ttl = (q.ttl == null ? (1 + R(2)) : q.ttl) - 1;
    if (q.ttl > 0) continue;
    hub.queue.splice(i, 1);
    if (q.type === 'injury') {
      novedades.push({ tag: 'LESION', cat: 'tuyo', title: '🤕 Confirmado: ' + q.name + ', ' + q.games + ' partido(s) de baja', body: 'El parte médico lo firma: ' + q.name + ' se pierde ' + q.games + ' compromiso(s). El News Hub se lo contó primero.', truth: true });
      try { if (mode === 'mgr' && typeof ManagerCareer !== 'undefined') { var pl = (s.squad || []).find(function (p) { return q.name.indexOf(p.name.split(' ').slice(-1)[0]) >= 0; }); if (pl && !s.injuries) s.injuries = {}; if (pl) s.injuries[pl.id] = Math.max(s.injuries[pl.id] || 0, q.games); } } catch (e) {}
    } else if (q.type === 'compare') {
      novedades.push({ tag: 'TI', cat: 'tuyo', title: '📊 Panel de expertos: tú vas por delante', body: 'Tres de cuatro exjugadores te eligen sobre la estrella del ' + q.rival + '. El cuarto pidió revisar el VAR mental.', truth: true });
    } else if (q.type === 'youRumor') {
      if (q.truth) {
        novedades.push({ tag: 'RUMOR', cat: 'tuyo', title: '✅ OFICIAL: el ' + q.club + ' prepara una oferta por ti', value: true, body: 'El News Hub no fallaba: el ' + q.club + ' llamará a tu agente. Decide en frío y con alguien que te quiera cerca.', truth: true });
        try { if (typeof window.S !== 'undefined') window.S.demand = (window.S.demand || 0) + 1; } catch (e) {}
      } else {
        novedades.push({ tag: 'RUMOR', cat: 'tuyo', title: '❌ DESMENTIDA de raíz: ni llamada ni oferta del ' + q.club, body: 'Fuentes oficiales zanjan el ruido: puro humo de agosto. El periodista ya cambió de foto de perfil.', truth: true });
      }
    }
  }
  /* Rumores FICHAJE (feed con rum activo) */
  for (var j = hub.feed.length - 1; j >= 0; j--) {
    var it = hub.feed[j];
    if (!it.rum || it.rum.eaten) continue;
    it.rum.ttl = (it.rum.ttl == null ? (1 + R(2)) : it.rum.ttl) - 1;
    if (it.rum.ttl > 0) continue;
    it.rum.eaten = true;
    var rum = it.rum;
    if (rum.truth) {
      /* SE HIZO REAL — el fútbol del juego lo registra */
      var src = rum.from, dst = rum.to, fee = rum.fee || 40;
      if (dst === ctx.myClub) { ctx.addMine({ n: rum.star, pos: 'MED', v: fee }); }
      else if (src === ctx.myClub) { ctx.sellMine(rum.star, fee); }
      ctx.moveTeamShift(dst, +2); ctx.moveTeamShift(src, -1);
      novedades.push({ tag: 'FICHAJE', cat: (dst === ctx.myClub || src === ctx.myClub) ? 'tuyo' : 'mundo', title: '✅ HECHO OFICIAL: ' + rum.star + ' ficha por el ' + dst,
        body: rum.star + ' firma por ' + fee + 'M€. Fotos, sonrisa y balón bajo el brazo. El News Hub lo contó ' + (2 + R(3)) + ' jornada(s) antes que nadie. Guárdate este titular.', truth: true });
    } else {
      novedades.push({ tag: 'FICHAJE', cat: rum.cat, title: '❌ Humo confirmado: ' + rum.star + ' NO se mueve del ' + rum.from,
        body: 'El ' + rum.from + ' lo desmiente con comunicado y foto de familia: "Aquí no pasa nada". El ' + rum.to + ' mira hacia otro lado. Habrá que creer… de momento.', truth: true });
    }
  }
  return novedades;
}

/* ── Pop-up único, regulado ── */
var popBusy = false;
/* 🪟 modal propio del News Hub — el GameDialog del hub mánager ESCAPA el HTML (se veía crudo) */
function nhModal(html, buttons) {
  try {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(6,8,16,.86);z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px';
    ov.innerHTML = '<div style="max-width:600px;width:100%;max-height:88vh;overflow:auto;background:#0f1424;border:1px solid #33406b;border-radius:16px;padding:16px 18px;color:#eef2ff;box-shadow:0 18px 60px rgba(0,0,0,.55);font-family:system-ui,-apple-system,sans-serif">' +
      html + '<div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap" data-btns></div></div>';
    var bb = ov.querySelector('[data-btns]');
    (buttons || []).forEach(function (b, i) {
      var el = document.createElement('button');
      el.innerHTML = b.label || 'OK';
      el.style.cssText = (b.ghost ? 'background:#1b2138;color:#cfd8ff;border:1px solid #2c3760;' : 'background:#f5c451;color:#161307;border:0;') + 'border-radius:10px;padding:9px 16px;font:800 13px system-ui;cursor:pointer';
      el.onclick = function () { ov.remove(); if (b.cb) b.cb(); };
      bb.appendChild(el);
    });
    document.body.appendChild(ov);
    return ov;
  } catch (e) { return null; }
}
function dialog(title, body, cb) {
  if (popBusy) { setTimeout(function () { dialog(title, body, cb); }, 450); return; }
  popBusy = true;
  nhModal('<div style="font:800 15px system-ui;margin-bottom:8px">📰 NEWS HUB</div>' +
      '<div style="font-weight:800;color:#f5c451;margin-bottom:6px">' + esc(title) + '</div>' +
      '<div style="color:#c7d3ea;font-size:.92rem;line-height:1.45">' + esc(body) + '</div>',
    [{ label: 'Leído porque soy el patrón 📰', cb: function () { popBusy = false; if (cb) cb(); } }]);
}

/* ════ API ════ */
var API = {
  LEAGUES: LEAGUES,
  ensure: ensure,
  leagueByClub: leagueByClub,
  clubTier: clubTier,
  starTier: starTier,
  canMove: canMove,
  _MOVES: MOVES,
  _STARS: STARS,
  afterJornada: function (s, opts) {
    var hub = ensure(s); if (!hub) return;
    opts = opts || {};
    var mode = opts.mode || 'mgr';
    hub.tick = (hub.tick || 0) + 1;
    if (hub.cd > 0) hub.cd--;
    /* 1: resolver lo vencido — SIEMPRE aparece (son confirmaciones de lo ya anunciado) */
    var list = resolveQueue(hub, mode, s).map(function (x) { x.pop = (x.cat === 'tuyo'); return x; });
    /* 2: portada nueva (uno; a veces dos si una es azul-personal ligera) */
    var n = (Math.random() < 0.72) ? 1 : 0;
    for (var i = 0; i < n; i++) { var it = spin(mode, hub, s); if (it) list.push(it); }
    list.forEach(function (it) {
      if (!it.id) it.id = ++hub.idn;
      it.day = 'J' + hub.tick;
      hub.feed.unshift(it);
      if (hub.feed.length > 60) hub.feed.pop();
      /* pop-up: TUYO siempre; mundo solo si liga seguida + popups on + cooldown */
      var lk = null;
      if (it.rum) { lk = leagueByClub(it.rum.to) || leagueByClub(it.rum.from); }
      var wantWorld = hub.popups && hub.cd <= 0 && (it.cat !== 'tuyo') && (lk ? (hub.leagues.length === 0 || hub.leagues.indexOf(lk) >= 0) : true) && it.pop && !it.absurd;
      var wantMine = (it.cat === 'tuyo' && it.pop !== false && hub.popups !== false);
      if ((wantMine || wantWorld) && hub.popups !== false) {
        if (!wantMine && wantWorld) hub.cd = 2;
        dialog(it.title, it.body);
      }
      try { if (mode === 'mgr') API.renderHomeCard(s); } catch (e) {}
    });
  },
  rumorLive: function (s) {
    var hub = ensure(s), ctxClubs = null;
    if (!hub) return null;
    for (var i = 0; i < hub.feed.length; i++) {
      var it = hub.feed[i];
      if (it.rum && !it.rum.eaten) return { type: 'mgr', item: it };
    }
    for (var j = 0; j < hub.queue.length; j++) {
      if (hub.queue[j].type === 'youRumor' && !hub.queue[j].eaten) return { type: 'pl', q: hub.queue[j] };
    }
    return null;
  },
  pressQuestion: function (s) {
    /* pregunta de rumor SOLO si toca TU club — nunca humo de estrellas ajenas (fix "¿Rüdiger al Barça?") */
    var hub = ensure(s); if (!hub) return null;
    var live = API.rumorLive(s); if (!live || live.type !== 'mgr') return null;
    var um = live.item.rum, mine = (s && s.myTeam) || '';
    if (!mine || (um.from !== mine && um.to !== mine)) return null;
    var q = (um.to === mine)
      ? '🗞️ En la sala todos tienen el móvil en la mano: el News Hub asegura que «' + um.star + '» ficharía por tu ' + mine + '. ¿Lo confirmas?'
      : '🗞️ La sala arde: el News Hub dice que «' + um.star + '» saldría de tu ' + mine + ' rumbo al ' + um.to + '. ¿Qué respondes?';
    return {
      ctx: 'RUMOR', q: q,
      opts: [
        { t: 'Confirmarlo con una sonrisa', morale: 2, conf: -2, fb: (um.truth ? 'La sala te cree. Detrás del telón asienten: acertaste.' : 'Cuidado, míster… era humo y mañana publicarán "¿sabe algo que nadie sabe?".') },
        { t: 'Negarlo tajante', morale: 1, conf: 0, fb: (um.truth ? 'Los periodistas fruncen el ceño… y cuando salga la oficial te colgarán el cartel de "nos mintió".' : 'Desmentida oficial que le hace ganar puntos a tu club con la prensa seria. Bien dicho.') },
        { t: 'Bromear y no contestar', morale: -1, conf: -1, fb: 'Risas flacas en la sala. Titular de mañana: "El míster ni confirma ni desmiente".' }
      ]
    };
  },
  pressPlayer: function (s, left, force) {
    /* rueda de prensa del JUGADOR — MUY: cada jornada · INTENSO: mín. 3 por temporada · desactivable (S.pressOff) */
    try {
      var hub = ensure(s); if (!hub) return;
      if (s && s.pressOff) return;
      left = (left == null ? 1 : left);
      if (!force) {
        var md = s.rhythm || s.speed || '1';
        if (md === 'MUY') { /* cada jornada */ }
        else if (md === '1' || md === 1) { if (hub.pressCd > 0) { hub.pressCd--; return; } hub.pressCd = 1; }
        else { if (hub.pressCd > 0) { hub.pressCd--; return; } hub.pressCd = 2; }
      }
      var me = (s.name || (s.player && s.player.name) || 'tu crack');
      var qs = [];
      var live = API.rumorLive(s);
      if (live && live.type === 'pl') {
        var cl = live.q.club;
        qs.push({
          q: '🗞️ Periodista: "La gente lo comparte con fuego… ¿Es cierto que te quieres ir al ' + cl + '?"',
          opts: [
            { t: '"Estoy contento aquí. Punto."', fb: 'Titular sobrio. ' + (live.q.truth ? 'El fax del ' + cl + ' sin embargo ya existe…' : 'Y era verdad: era humo. Bien jugado.'), mo: 2 },
            { t: '"Nunca diré no a soñar en grande."', fb: 'Ambición que le gusta a los directivos… y a tu presidente, que lo escucha diferente.', mo: 1 },
            { t: '"Mi lugar lo decide el campo."', fb: 'La sala anota: "misterio total". El grupo de WhatsApp del vestuario explota igual.', mo: 0 }
          ]
        });
      }
      /* 🎙️ press-bank.js — banco contextual del JUGADOR: miles de preguntas, siempre sobre TI y tu club */
      var nota = s.lastRating || 6.8;
      var bankN = 0;
      if (typeof PRESSBANK !== 'undefined') {
        try {
          var ctxP = ctxOf('pl', s);
          var rawClub = ctxP.myClub;
          var clubN = (typeof rawClub === 'string' && rawClub) ? rawClub : ((rawClub && rawClub.name) || ((s.club && s.club.name) || 'tu club'));
          var rivalP = 'el próximo rival';
          try {
            var LD = (typeof LEAGUES_DB !== 'undefined') ? LEAGUES_DB : null;
            var lk = (s.club && s.club.lk) || s.lk || null;
            var tmArr = (LD && lk && LD[lk] && (LD[lk].teams || LD[lk].clubs)) || null;
            if (tmArr && tmArr.length > 1) {
              for (var tr = 0; tr < 10; tr++) {
                var cand = tmArr[R(tmArr.length)];
                var cname = (typeof cand === 'string') ? cand : (cand.name || cand[0] || '');
                if (cname && cname !== clubN) { rivalP = cname; break; }
              }
            }
          } catch (eRv) {}
          var want = nota >= 7 ? 'glory' : (nota < 6 ? 'crisis' : 'routine');
          var dP = { me: me, club: clubN, rival: rivalP, pos: (s.pos || 'futbolista'), edad: (s.age != null ? s.age : '19'), liga: 'la liga', nota: nota };
          var bQS = PRESSBANK.plQS(dP);
          var poolMain = bQS.filter(function (q) { return q.ctx === want; });
          var poolRou  = bQS.filter(function (q) { return q.ctx === 'routine'; });
          if (poolMain.length) { qs.push(poolMain[R(poolMain.length)]); bankN++; }
          if (poolRou.length) {
            var p1 = poolRou[R(poolRou.length)];
            qs.push(p1); bankN++;
            if (poolRou.length > 1) {
              var p2 = p1, g2 = 0;
              while (p2 === p1 && g2 < 10) { p2 = poolRou[R(poolRou.length)]; g2++; }
              if (p2 !== p1) { qs.push(p2); bankN++; }
            }
          }
        } catch (ePB) {}
      }
      if (!bankN) {
        /* fallback legado (si press-bank.js no cargó) */
        qs.push({
          q: nota >= 7 ? '🎙️ "Hoy fuiste de lo mejor del partido. ¿Te sientes en tu mejor momento?"' : '🎙️ "El rendimiento de esta semana… ¿te preocupa?"',
          opts: nota >= 7 ? [
            { t: '"Mejor que nunca… y va a más."', fb: 'Sonrisa del capitán. Confianza y foco, campeón.', mo: 3 },
            { t: '"Sin fiesta hasta el título."', fb: 'Seriedad de líder. La afición repite la frase en TikTok.', mo: 2 }
          ] : [
            { t: '"Trabajo doble esta semana. Prometido."', fb: 'Respuesta de profesional. El míster asiente en la sala.', mo: 2 },
            { t: '"Es un bache. Volveré mejor."', fb: 'Honesto, sin drama. La crítica baja un punto la metralla.', mo: 1 }
          ]
        });
        qs.push({ q: '🎙️ "¿Cómo está el vestuario estas semanas?"', opts: [
          { t: '"Unidos. Como una familia."', fb: 'Puño con la prensa incluido. El grupo agradece la foto.', mo: 2 },
          { t: '"Hay que exigirse más."', fb: 'Exigencia sana. El capitán ladea la ceja, con cariño.', mo: 1 }
        ] });
      }
      /* modal encadenado con el modal nativo del jugador */
      var html = '<div style="text-align:center"><div style="font-size:1.1rem;font-weight:800;color:#f5c451">🎙️ RUEDA DE PRENSA</div>' +
        '<div style="font-size:.78rem;color:#aeb8d8;margin:4px 0 12px">Sala mixta · micrófonos de 6 medios · ' + esc(me) + '</div></div>';
      var ask = function (ix) {
        if (ix >= qs.length) {
          if (left > 1) setTimeout(function () { API.pressPlayer(s, left - 1, true); }, 420);   /* 🎙️ sesión siguiente en cadena */
          return;
        }
        var cur = qs[ix];
        var h = html + '<div style="padding:10px;border:1px solid #33406b;border-radius:12px;background:#101732">' + cur.q + '</div><div style="display:grid;gap:6px;margin-top:10px">' +
          cur.opts.map(function (o, i) { return '<div class="nh-opt" data-i="' + i + '" style="cursor:pointer;padding:10px;border-radius:10px;background:#1b2440;border:1px solid #2c3760;font-size:.85rem">' + esc(o.t) + '</div>'; }).join('') + '</div><div id="nh-fb" style="margin-top:8px;color:#7dd3fc;font-size:.8rem;min-height:18px"></div>';
        try { UI.modal(h, []); } catch (e) { return; }
        setTimeout(function () {
          var root = document.getElementById('mon-body'); if (!root) return;
          root.querySelectorAll('.nh-opt').forEach(function (el) {
            el.onclick = function () {
              var o = cur.opts[el.getAttribute('data-i') | 0];
              s.morale = Math.max(0, Math.min(100, (s.morale || 60) + (o.mo || 0)));
              try { slog(s, '🎙️ <b>Prensa</b>: ' + o.t + ' → <i>' + o.fb + '</i>'); } catch (e) {}
              var fb = document.getElementById('nh-fb'); if (fb) fb.innerHTML = '💬 ' + o.fb;
              root.querySelectorAll('.nh-opt').forEach(function (x) { x.style.pointerEvents = 'none'; x.style.opacity = (x === el) ? '1' : '.45'; });
              setTimeout(function () { ask(ix + 1); }, 1100);
            };
          });
        }, 80);
      };
      ask(0);
    } catch (e) {}
  },
  renderHomeCard: function (s) {
    var hub = ensure(s), el = document.getElementById('nh-home-feed');
    if (!el || !hub) return;
    var h3 = hub.feed.slice(0, 3);
    el.innerHTML = h3.length ? h3.map(function (it) {
      return '<div style="padding:6px 0;border-bottom:1px dashed #2c3760"><div style="font-weight:700;font-size:.84rem">' + esc(it.title) + '</div>' +
        '<div style="color:#7b87ad;font-size:.74rem">' + esc((it.body || '').slice(0, 110)) + '…</div></div>';
    }).join('') : '<div class="fc27-dim">La redacción abre en la primera jornada… 📰</div>';
  },
  togglePopups: function (s, on) { var hub = ensure(s); if (hub) hub.popups = !!on; },
  setLeagues: function (s, arr) { var hub = ensure(s); if (!hub) return; hub.leagues = (arr || []).slice(0, 5); hub.chosen = true; },
  /* ── UI pantalla ── */
  open: function (mode, s) {
    var hub = ensure(s); if (!hub) return;
    try { if (mode === 'mgr' && typeof Dashboard !== 'undefined' && Dashboard.switchTab) { if (window.__nhEnsureMgrTab) window.__nhEnsureMgrTab(); try { Dashboard.switchTab('newshub'); } catch (e0) {} } } catch (e1) {}
    if (!hub.chosen) { API.chooser(mode, s, function () { API.render(mode, s); }); return; }
    API.render(mode, s);
  },
  chooser: function (mode, s, cb) {
    var hub = ensure(s);
    var ctx = ctxOf(mode, s);
    var h = '<div style="text-align:center"><div style="font:800 18px system-ui;color:#f5c451">📰 NEWS HUB</div>' +
      '<div style="font-size:.82rem;color:#aeb8d8;margin:6px 0 10px">Elige hasta <b>5 ligas</b> de las que quieras titulares emergentes entre jornada y jornada.<br>(Las noticias de TU club y de TI siempre te llegan.)</div></div>' +
      LEAGUES.map(function (L) {
        var pre = LKEY[leagueByClub(ctx.myClub)] && leagueByClub(ctx.myClub) === L.k;
        return '<label style="display:flex;align-items:center;gap:8px;padding:8px 10px;margin:4px 0;background:#101731;border:1px solid #2c3760;border-radius:10px;cursor:pointer">' +
          '<input type="checkbox" class="nh-lg" data-k="' + L.k + '"' + (pre ? ' checked' : '') + '> <b>' + L.n + '</b><span style="color:#7b87ad;font-size:.75rem"> · ' + L.clubes.slice(0, 3).join(' · ') + '…</span></label>';
      }).join('');
    if (document.getElementById('nh-chooser-ov')) return;   /* 🛡️ no apilar redacciones */
    var done = function () {
      var cols = []; document.querySelectorAll('.nh-lg').forEach(function (c) { if (c.checked && cols.length < 5) cols.push(c.getAttribute('data-k')); });
      API.setLeagues(s, cols); if (cb) cb();
    };
    var ovm = nhModal(h, [{ label: 'Guardar mi redacción ✍️', cb: done }]);
    if (ovm) ovm.id = 'nh-chooser-ov'; else done();
  },
  render: function (mode, s) {
    var hub = ensure(s); if (!hub) return;
    var feed = hub.feed.map(function (it) {
      var col = { 'FICHAJE': '#ff9d42', 'RUMOR': '#e879f9', 'LESION': '#f87171', 'RACHA': '#38bdf8', 'BANQUILLO': '#c084fc', 'INSÓLITO': '#a3e635', 'SOCIAL': '#f472b6', 'CONTRATO': '#facc15', 'DIRECTIVA': '#94a3b8', 'TI': '#f5c451' }[it.tag] || '#8fa2cf';
      return '<div style="border:1px solid #223;background:#101732;border-radius:12px;padding:10px 12px;margin:8px 0">' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:4px">' +
          '<span style="font:800 10px system-ui;color:#0b0d17;background:' + col + ';border-radius:6px;padding:2px 7px">' + it.tag + '</span>' +
          (it.cat === 'tuyo' ? '<span style="font:800 10px system-ui;color:#f5c451">· DE TU GENTE</span>' : '') +
          '<span style="margin-left:auto;color:#566089;font-size:.72rem">' + esc(it.day || '') + '</span></div>' +
        '<div style="font-weight:700;color:#eef2ff">' + esc(it.title) + '</div>' +
        '<div style="color:#9fb0d8;font-size:.86rem;margin-top:3px;line-height:1.4">' + esc(it.body) + '</div>' +
        (it.rum && !it.rum.eaten ? '<div style="margin-top:6px;font-size:.74rem;color:#e879f9">⏳ Rumor en curso… el News Hub lo vigila.</div>' : '') +
      '</div>';
    }).join('');
    if (!feed) feed = '<div style="color:#7b87ad;padding:18px;text-align:center">Aún no se imprime la primera edición.<br>Juega unas jornadas y la rotativa arranca sola. 📰</div>';
    var head = '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px">' +
      '<button class="btn-ghost" style="padding:6px 12px" onclick="NEWSHUB.chooser(\"' + mode + '\", ' + (mode === 'mgr' ? 'ManagerCareer.state' : 'S') + ', function(){NEWSHUB.render(\"' + mode + '\", ' + (mode === 'mgr' ? 'ManagerCareer.state' : 'S') + ')})">🌍 Mis 5 ligas (' + hub.leagues.length + ')</button>' +
      '<label style="display:flex;gap:6px;align-items:center;font-size:.8rem;color:#aeb8d8"><input type="checkbox" ' + (hub.popups ? 'checked' : '') + ' onchange="NEWSHUB.togglePopups(' + (mode === 'mgr' ? 'ManagerCareer.state' : 'S') + ', this.checked)"> Pop-ups</label>' +
      (mode === 'pl' ? '<label style="display:flex;gap:6px;align-items:center;font-size:.8rem;color:#aeb8d8"><input type="checkbox" ' + ((s && !s.pressOff) ? 'checked' : '') + ' onchange="S.pressOff=!this.checked"> 🎙️ Ruedas de prensa</label>' : '') +
      '</div>';
    if (mode === 'mgr') {
      var el = document.getElementById('newshub-body');
      if (el) el.innerHTML = head + feed;
    } else {
      try { UI.modal('<div style="font:800 16px system-ui;color:#f5c451;margin-bottom:6px">📰 NEWS HUB</div>' + head + '<div style="max-height:52vh;overflow:auto">' + feed + '</div>', [{ t: 'Cerrar', c: 'sec' }]); } catch (e) {}
    }
  }
};
window.NEWSHUB = API;
window.__nhEnsureMgrTab = null; /* la asigna wireLater */

/* ════════════ AUTOENGANCHE ════════════ */
(function wireLater() {
  function decide(s) { return s && s.newsHub ? s : null; }
  /* 🛡️ AUTOSUFICIENCIA: si el HTML del mánager está cacheado y la pestaña no existe, se INYECTA */
  var _nhChooseTries = 0;
  function nhEnsureMgrTab() {
    try {
      if (typeof Dashboard === 'undefined') return;
      /* 📰 si hay carrera viva y aún no eligió ligas → abrir el chooser (aun con HTML cacheado) */
      try {
        var _st = (typeof ManagerCareer !== 'undefined') ? ManagerCareer.state : null;
        if (_st && _st.myTeam && (!_st.newsHub || !_st.newsHub.chosen) && _nhChooseTries < 4 && !document.getElementById('nh-chooser-ov')) {
          _nhChooseTries++;
          setTimeout(function () { try { API.chooser('mgr', _st, function () { try { API.render('mgr', _st); } catch (e) {} }); } catch (e) {} }, 700);
        }
      } catch (eC) {}
      if (document.querySelector('[data-tab="newshub"]')) { nhPatchSwitchTab(); return; }
      var side = document.querySelector('.fc27-side'), top = document.querySelector('.fc27-topbar');
      var main = document.querySelector('.fc27-main');
      if (main && !document.getElementById('tab-newshub'))
        main.insertAdjacentHTML('afterbegin', '<div id="tab-newshub" class="hidden"><section class="fc27-card"><h3 class="fc27-h">📰 NEWS HUB — la portada del mundo</h3><div id="newshub-body"></div></section></div>');
      if (side) {
        var sys = side.querySelector('[data-tab="system"]');
        var btn = '<button class="pes-tab fc27-item" data-tab="newshub" onclick="Dashboard.switchTab(\'newshub\')" style="outline:1px solid rgba(245,196,81,.45)"><i>📰</i><span>News Hub</span></button>';
        if (sys) sys.insertAdjacentHTML('afterend', btn); else side.insertAdjacentHTML('afterbegin', btn);
      }
      if (top && !top.querySelector('[data-tab="newshub"]')) {
        var sys2 = top.querySelector('[data-tab="system"]');
        var btn2 = '<button class="pes-tab fc27-topitem" data-tab="newshub" onclick="Dashboard.switchTab(\'newshub\')" style="border-color:rgba(245,196,81,.5)">📰 News Hub</button>';
        if (sys2) sys2.insertAdjacentHTML('afterend', btn2);
      }
      nhPatchSwitchTab();
    } catch (e) {}
  }
  function nhPatchSwitchTab() {
    if (Dashboard.switchTab._nh) return;
    var _stb = Dashboard.switchTab;
    var f = function (tab) {
      if (tab === 'newshub') {
        document.querySelectorAll('.pes-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.pes-tab[data-tab="newshub"]').forEach(function (t) { t.classList.add('active'); });
        ['home','partidos','squad','youth','starting-xi','transfer','tactics','database','cups','system','newshub'].forEach(function (t) {
          var el = document.getElementById('tab-' + t); if (el) el.classList.toggle('hidden', t !== 'newshub');
        });
        try { API.render('mgr', ManagerCareer.state); } catch (e) {}
        return;
      }
      return _stb.apply(this, arguments);
    };
    f._nh = true; Dashboard.switchTab = f;
  }
  window.__nhEnsureMgrTab = nhEnsureMgrTab;
  document.addEventListener('DOMContentLoaded', function () {
    try {
      setTimeout(nhEnsureMgrTab, 600); setTimeout(nhEnsureMgrTab, 2500);
      try { nhEnsureMgrTab(); } catch (e0) {}
      /* Manager: noticias al sumar jornada + 🎙️ rueda de prensa cada 3 jornadas o más */
      if (typeof ManagerCareer !== 'undefined' && ManagerCareer.playNextMatch && !ManagerCareer.playNextMatch._nh) {
        var _op = ManagerCareer.playNextMatch.bind(ManagerCareer);
        var f = function () {
          var r = _op.apply(this, arguments);
          try {
            var st = ManagerCareer.state;
            API.afterJornada(st, { mode: 'mgr' });
            var hub = st && st.newsHub;
            if (hub && (hub.tick - (hub.lastPressTick || -3)) >= 3 && typeof Press !== 'undefined' && Press.lastResult) {
              var lr = Press.lastResult(st);
              if (lr) { hub.lastPressTick = hub.tick; setTimeout(function () { try { Press.queue('routine', lr, 0); } catch (e) {} }, 350); }
            }
          } catch (e) {}
          return r;
        };
        f._nh = true; ManagerCareer.playNextMatch = f;
      }
      /* Manager: al crear carrera → eliges tus 5 ligas para pop-ups 📰 */
      if (typeof ManagerCareer !== 'undefined' && ManagerCareer.selectTeam && !ManagerCareer.selectTeam._nh) {
        var _st = ManagerCareer.selectTeam.bind(ManagerCareer);
        var fst = function () { var r = _st.apply(this, arguments); setTimeout(function () { try { var s2 = ManagerCareer.state; if (s2 && (!s2.newsHub || !s2.newsHub.chosen)) API.chooser('mgr', s2); } catch (e) {} }, 900); return r; };
        fst._nh = true; ManagerCareer.selectTeam = fst;
      }
      /* Jugador: al debutar también eliges ligas del planeta 📰 */
      if (typeof UI !== 'undefined' && UI.startCareer && !UI.startCareer._nh) {
        var _sc = UI.startCareer.bind(UI);
        var fsc = function () { var r = _sc.apply(this, arguments); setTimeout(function () { try { var st2 = (typeof S !== 'undefined') ? S : null; if (st2 && st2.club && (!st2.newsHub || !st2.newsHub.chosen)) API.chooser('pl', st2); } catch (e) {} }, 1500); return r; };
        fsc._nh = true; UI.startCareer = fsc;
      }
      /* Jugador: sim de temporada / bloque → noticia por temporada + 🎙️ mínimo 3 ruedas por campaña */
      if (typeof UI !== 'undefined' && UI.sim && !UI.sim._nh) {
        var _sim = UI.sim.bind(UI);
        var fs2 = function () {
          var r = _sim.apply(this, arguments);
          try {
            var st = (typeof S !== 'undefined') ? S : null;
            if (st) {
              var nb = st.rhythm === 'MUY' ? 0 : (st.rhythm | 0) || 1;
              for (var i = 0; i < nb; i++) API.afterJornada(st, { mode: 'pl' });
              if (nb > 0) setTimeout(function () { try { API.pressPlayer(st, Math.max(3, nb), true); } catch (e) {} }, 900);
            }
          } catch (e) {}
          return r;
        };
        fs2._nh = true; UI.sim = fs2;
      }
      /* Jugador MUY INTENSO: cada fin de partido = jornada cerrada */
      if (typeof liveMatchEnd === 'function' && !liveMatchEnd._nh) {
        var _lme = liveMatchEnd;
        var fl = function (s) { var out = _lme(s); try { API.afterJornada(s, { mode: 'pl' }); setTimeout(function () { API.pressPlayer(s); }, 1400); } catch (e) {} return out; };
        fl._nh = true;
        try { liveMatchEnd = fl; } catch (e) {}
      }
    } catch (e) {}
  }, false);
})();
})();
