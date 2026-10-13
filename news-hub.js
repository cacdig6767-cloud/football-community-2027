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
function tplTransfer(hub, mode, s) {
  /* FICHAJE REAL: rumor primero, y al resolver el efecto SÍ ocurre. */
  var ctx = ctxOf(mode, s);
  var buscan = pick(LEAGUES.filter(function (L) { return L.clubes.length > 2 && L.k !== leagueByClub(ctx.myClub) || R(4) === 0; }));
  var destino = pick(buscan.clubes);
  if (destino === ctx.myClub) destino = pick(buscan.clubes.filter(function (c) { return c !== ctx.myClub; })) || destino;
  var candidatos = starPool().filter(function (st) { return st.c !== destino; });
  var st = pick(candidatos);
  var truth = Math.random() < 0.62;
  var sobreMiClub = (st.c === ctx.myClub) || (destino === ctx.myClub);
  var tanto = sobreMiClub ? 'tuyo' : 'mundo';
  var rum = { id: ++hub.idn, truth: truth, type: 'out', star: st.n, from: st.c, to: destino, fee: st.v, eaten: false };
  var tit = ['🔥 BOMBAZO en cocción: ', '📡 EXCLUSIVA: ', '💣 Mercado caliente: ', '🗞️ Se dice en los pasillos: '][R(4)];
  return {
    tag: 'FICHAJE', cat: tanto, title: tit + st.n + ' → ' + destino,
    body: st.n + ' (' + st.c + ') estaría a un FIRME de ' + destino + ' por unos ' + st.v + 'M€. Fuentes del vestuario ' + (truth ? 'confirman los contactos: el acuerdo avanza.' : 'piden calma: todavía no hay nada formal… o eso dicen.'),
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
function dialog(title, body, cb) {
  if (popBusy) { setTimeout(function () { dialog(title, body, cb); }, 450); return; }
  popBusy = true;
  try {
    if (typeof GameDialog !== 'undefined' && GameDialog.show) {
      GameDialog.show('📰 NEWS HUB — ' + title + '<div style="margin-top:8px;color:#c7d3ea;font-size:.92rem">' + body + '</div>', [{ label: 'Leído porque soy el patrón 📰', cb: function () { popBusy = false; if (cb) cb(); } }]);
      return;
    }
  } catch (e) {}
  try {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(6,8,16,.82);z-index:99998;display:flex;align-items:center;justify-content:center;padding:18px';
    ov.innerHTML = '<div style="max-width:520px;background:#0f1424;border:1px solid #33406b;border-radius:16px;padding:18px;color:#eef2ff;box-shadow:0 18px 60px rgba(0,0,0,.5);font-family:system-ui">' +
      '<div style="font:800 15px system-ui;margin-bottom:8px">📰 NEWS HUB</div>' +
      '<div style="font-weight:800;color:#f5c451;margin-bottom:6px">' + esc(title) + '</div>' +
      '<div style="color:#c7d3ea;font-size:.92rem;line-height:1.45">' + esc(body) + '</div>' +
      '<div style="margin-top:14px;text-align:center"><button id="nh-ok" style="background:#f5c451;color:#161307;border:0;border-radius:10px;padding:9px 16px;font:800 13px system-ui;cursor:pointer">Entendido 📰</button></div></div>';
    document.body.appendChild(ov);
    ov.querySelector('#nh-ok').onclick = function () { ov.remove(); popBusy = false; if (cb) cb(); };
  } catch (e2) { popBusy = false; }
}

/* ════ API ════ */
var API = {
  LEAGUES: LEAGUES,
  ensure: ensure,
  leagueByClub: leagueByClub,
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
    /* inyecta en la rueda de prensa del MÁNAGER una pregunta por el rumor vivo */
    var hub = ensure(s); if (!hub) return null;
    var live = API.rumorLive(s); if (!live || live.type !== 'mgr') return null;
    var um = live.item.rum;
    return {
      ctx: 'RUMOR', q: '🗞️ En la sala de prensa todos tienen el móvil en la mano: ¿Es cierto lo que dice el News Hub de ' + um.star + ' y el ' + um.to + '?',
      opts: [
        { t: 'Confirmarlo con una sonrisa', morale: 2, conf: -2, fb: (um.truth ? 'La sala te cree. Detrás del telón asienten: acertaste.' : 'Cuidado, míster… eso era humo y la redacción lo publicará mañana ("¿sabe algo que nadie sabe?").') },
        { t: 'Negarlo tajante', morale: 1, conf: 0, fb: (um.truth ? 'Los periodistas fruncen el ceño… y tres semanas después pondrán tu foto en la oficial ("nos mintió").' : 'Desmentida oficial que le hizo ganar ' + 4 + ' puntos con la prensa seria. Bien dicho.') },
        { t: 'Bromear y no contestar', morale: -1, conf: -1, fb: 'Risas flacas en la sala. El titular de mañana: "El míster ni confirma ni desmiente".' }
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
      var nota = s.lastRating || 6.8;
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
      /* modal encadenado con el modal nativo del jugador */
      var html = '<div style="text-align:center"><div style="font-size:1.1rem;font-weight:800;color:#f5c451">🎙️ RUEDA DE PRENSA</div>' +
        '<div style="font-size:.78rem;color:#aeb8d8;margin:4px 0 12px">Sala mixta · micrófondos de 6 medios · ' + esc(me) + '</div></div>';
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
  togglePopups: function (s, on) { var hub = ensure(s); if (hub) hub.popups = !!on; },
  setLeagues: function (s, arr) { var hub = ensure(s); if (!hub) return; hub.leagues = (arr || []).slice(0, 5); hub.chosen = true; },
  /* ── UI pantalla ── */
  open: function (mode, s) {
    var hub = ensure(s); if (!hub) return;
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
    var done = function () {
      var cols = []; document.querySelectorAll('.nh-lg').forEach(function (c) { if (c.checked && cols.length < 5) cols.push(c.getAttribute('data-k')); });
      API.setLeagues(s, cols); if (cb) cb();
    };
    if (typeof GameDialog !== 'undefined' && GameDialog.show && mode === 'mgr') {
      GameDialog.show(h, [{ label: 'Guardar mi redacción ✍️', cb: done }]);
    } else {
      try { UI.modal(h, [{ t: 'Guardar mi redacción ✍️', c: 'btn', fn: done }]); } catch (e) { done(); }
    }
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

/* ════════════ AUTOENGANCHE ════════════ */
(function wireLater() {
  function decide(s) { return s && s.newsHub ? s : null; }
  document.addEventListener('DOMContentLoaded', function () {
    try {
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
