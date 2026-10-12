/* ================= FC27 · v4.0 MODO TORNEOS — motor puro (sin DOM) =================
   window.TOURNEOS: base de datos (clubes LEAGUES_DB + selecciones IntlCup),
   plantillas con nombres reales (PLAYERS_NAT), fixtures (liga/grupos/eliminatorias),
   simulación instantánea con eventos (goles, asistencias, tarjetas), ida y vuelta,
   gol de visita, prórroga, penales, mejores terceros, estadísticas, save/load.
   La UI vive inline en index.html (TorneosUI) y la cancha es haxball-fc27.html. */
(function(){
'use strict';
if (window.TOURNEOS) return;
var LS_KEY = 'fc27_torneos_v1';

/* ── helpers ── */
function clamp(v, a, b){ return v < a ? a : (v > b ? b : v); }
function shuffle(a){ for (var i = a.length - 1; i > 0; i--){ var j = (Math.random() * (i + 1)) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function poisson(lam){ var L = Math.exp(-lam), k = 0, p = 1; do { k++; p *= Math.random(); } while (p > L); return k - 1; }
function rid(){ return 'm' + Math.random().toString(36).slice(2, 9); }

/* ── BASE DE DATOS: clubes + selecciones ── */
var _DB = null;
function db(){
  if (_DB) return _DB;
  var clubs = [];
  try {
    if (typeof LEAGUES_DB !== 'undefined') Object.keys(LEAGUES_DB).forEach(function(k){
      var L = LEAGUES_DB[k] || {}; (L.teams || []).forEach(function(t){
        clubs.push({ id: 'c:' + k + ':' + t[0], kind: 'club', name: t[0], r: t[1], lg: k, lgName: L.name || k, reg: L.region || '', ucl: L.uclSlots || 0, uel: L.uelSlots || 0 });
      });
    });
  } catch (e) {}
  var sels = [];
  try {
    var NTp = (window.IntlCup && IntlCup.NT_POWER) || {};
    var NTn = (window.IntlCup && IntlCup.NT_NAME) || {};
    Object.keys(NTp).forEach(function(c){
      sels.push({ id: 's:' + c, kind: 'sel', name: NTn[c] || c.toUpperCase(), r: NTp[c], code: c });
    });
  } catch (e2) {}
  clubs.sort(function(a, b){ return b.r - a.r; });
  sels.sort(function(a, b){ return b.r - a.r; });
  _DB = { clubs: clubs, sels: sels };
  return _DB;
}
function teamById(id){
  var d = db(), i, all = d.clubs.concat(d.sels);
  for (i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
}

/* ── nombres reales (PLAYERS_NAT) + reserva ficticia ── */
var LGNAT = { esp: 'esp', eng: 'eng', ita: 'ita', ale: 'ale', fra: 'fra', por: 'por', ned: 'ned', bel: 'bel', tur: 'tur', aut: 'aut', nor: 'nor', mex: 'mex', usa: 'usa', arg: 'arg', uru: 'uru', col: 'col', bra: 'bra', sau: 'sau', hon: 'hon', crc: 'crc', per: 'per', nic: 'nic' };
function lgNat(lg){ return LGNAT[lg] || LGNAT[String(lg).replace(/2$/, '')] || 'esp'; }
var IMPORTS = ['arg', 'bra', 'fra', 'por', 'ned', 'uru'];
var APE = ['García','Fernández','López','Martínez','Sánchez','Pérez','Gómez','Ruiz','Díaz','Torres','Ramírez','Flores','Vargas','Castro','Ramos','Reyes','Cruz','Morales','Ortiz','Gutiérrez','Chávez','Rojas','Mendoza','Silva','Castillo','Herrera','Medina','Aguilar','Guerrero','Campos','Vega','Fuentes','Cabrera','Márquez','Soto','Delgado','Paredes','Sandoval','Núñez','Miranda','Escobar','Ferreira','Costa','Oliveira','Santos','Ribeiro','Almeida','Carvalho','Pereira','Rodrigues','Smith','Jones','Brown','Taylor','Wilson','Davies','Evans','Thomas','Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Rossi','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Dubois','Bernard','Moreau','Laurent','Simon','Michel','Lefebvre','Leroy','Jansen','Bakker','Visser','Smit','Meijer','Boer','Mulder','Berg','Larsen','Hansen','Johansen','Olsen','Nilsen','Andersen','Kovač','Novák','Svoboda','Kowalski','Nowak','Popescu','Ivanov','Santos','Duarte','Gomes','Caruso','Bianchi','Fontana','Costa','Brito','Barros','Cardoso','Teixeira','Moreno','Navarro','Romero','Gil','Serrano','Blanco','Molina','Suárez','Ortega','Rubio','Marín','Sanz','Iglesias','Cortés','Garrido','Soler','Vidal'];
var INI = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ'.split('');
var _poolCache = {};
function poolFor(code){
  if (_poolCache[code]) return _poolCache[code];
  var out = [], NN = window.PLAYERS_NAT || {}, k;
  for (k in NN) if (NN[k] === code && /[A-ZÁÉÍÓÚÑ]/.test((k.split(' ').slice(-1)[0] || '')[0] || '')) {
    var ap = k.split(' ').slice(-1)[0];
    if (ap.length >= 3 && ap.length <= 14) out.push(ap);
  }
  _poolCache[code] = out; return out;
}
function pickName(team, used){
  var tries = 0, nm = '';
  while (tries++ < 60){
    if (team.kind === 'sel') {
      var pl = poolFor(team.code);
      nm = pl.length ? pl[(Math.random() * pl.length) | 0] : '';
    } else {
      var mine = poolFor(lgNat(team.lg));
      var useImport = Math.random() < 0.45;
      var pl2 = useImport ? poolFor(IMPORTS[(Math.random() * IMPORTS.length) | 0]) : mine;
      nm = (pl2.length ? pl2 : mine)[(Math.random() * ((pl2.length ? pl2 : mine).length || 1)) | 0] || '';
    }
    if (!nm) nm = APE[(Math.random() * APE.length) | 0];
    if (!used[nm]) { used[nm] = 1; return nm; }
  }
  nm = nm + ' ' + INI[(Math.random() * INI.length) | 0] + '.'; used[nm] = 1; return nm;
}
/* plantilla 18: 2 POR + 6 DF + 6 MC + 4 DL, ratings alrededor del equipo */
function mkRoster(team){
  var used = {}, out = [], i,
      base = clamp(team.r || 80, 60, 99),
      spots = ['POR','POR','DF','DF','DF','DF','DF','DF','MC','MC','MC','MC','MC','MC','DL','DL','DL','DL'];
  for (i = 0; i < spots.length; i++){
    var p = spots[i], spread = (p === 'POR') ? 4 : 8,
        rr = clamp(Math.round(base + (Math.random() * 2 - 1) * spread), 55, 116);
    out.push({ n: pickName(team, used).slice(0, 14), r: rr, p: p });
  }
  return out;
}

/* ── colores (uniformes a la cancha) ── */
var PAL = [['#b03030','#1d1d2f'],['#2255aa','#f5f5f5'],['#1a7a3d','#f5f5f5'],['#d8a018','#16161e'],['#6b21a8','#f5f5f5'],['#0f766e','#f5f5f5'],['#c2410c','#16161e'],['#334155','#f5c451'],['#8e2f5c','#f5f5f5'],['#28506e','#f5c451']];
function teamColors(team){
  try {
    if (team.kind === 'sel') {
      var FL = (window.IntlCup && IntlCup.FL_SVG) || {}, d = FL[team.code];
      if (d) {
        var hex = d.split('|').slice(1).filter(function(x){ return /^[0-9A-Fa-f]{6}$/.test(x); });
        if (hex.length >= 2) return ['#' + hex[0], '#' + hex[1]];
      }
    }
  } catch (e) {}
  try {
    if (typeof pairColors === 'function') { var pc = pairColors(team.name); if (pc && pc[0]) return [pc[0], pc[1] || '#f5f5f5']; }
  } catch (e2) {}
  var h = 0; for (var i = 0; i < team.name.length; i++) h = (h * 31 + team.name.charCodeAt(i)) >>> 0;
  return PAL[h % PAL.length];
}

/* ── SIMULACIÓN ── */
function lambda(ra, rb, homeAdv){
  var diff = clamp((ra - rb) / 60, -0.55, 0.55);
  return clamp(1.32 * (1 + diff) + (homeAdv ? 0.28 : 0), 0.12, 3.6);
}
function pickScorer(team, roster){
  var bag = [];
  (roster || []).forEach(function(p){
    if (p.p === 'POR') return;
    var w = p.p === 'DL' ? 5 : (p.p === 'MC' ? 3 : 1);
    w *= (0.7 + (p.r - 60) / 50);
    for (var i = 0; i < Math.max(1, Math.round(w)); i++) bag.push(p.n);
  });
  return bag.length ? bag[(Math.random() * bag.length) | 0] : (team.name + ' (p.p.)');
}
var rosterCache = {};
function rosterOf(team){ if (!rosterCache[team.id]) rosterCache[team.id] = mkRoster(team); return rosterCache[team.id]; }
function genGoalEvents(team, n, roster, ev, minBase, minSpan){
  for (var i = 0; i < n; i++){
    var s = pickScorer(team, roster), a = null;
    if (Math.random() < 0.62){ var bag = roster.filter(function(p){ return p.n !== s && p.p !== 'POR'; }); a = bag.length ? bag[(Math.random() * bag.length) | 0].n : null; }
    ev.push({ min: (minBase || 1) + ((Math.random() * (minSpan || 90)) | 0), type: 'goal', team: team.id, sc: s, as: a });
  }
}
function genCards(hTeam, aTeam, rosterH, rosterA, ev){
  var tot = poisson(1.9), i;
  for (i = 0; i < tot; i++){
    var home = Math.random() < 0.5, tm = home ? hTeam : aTeam, rs = home ? rosterH : rosterA,
        p = rs[(Math.random() * rs.length) | 0];
    ev.push({ min: 1 + ((Math.random() * 90) | 0), type: 'yellow', team: tm.id, pl: p.n });
    if (Math.random() < 0.10) ev.push({ min: 30 + ((Math.random() * 60) | 0), type: 'red', team: tm.id, pl: p.n });
  }
}
/* un tiempo/leg simulado: marcador + eventos */
function simLeg(hTeam, aTeam, o){
  o = o || {};
  var rH = rosterOf(hTeam), rA = rosterOf(aTeam),
      lH = lambda(hTeam.r, aTeam.r, !o.neutral), lA = lambda(aTeam.r, hTeam.r, false) * 0.94,
      gh = poisson(o.lamH != null ? o.lamH : lH), ga = poisson(o.lamA != null ? o.lamA : lA),
      ev = [];
  genGoalEvents(hTeam, gh, rH, ev, 1, 90); genGoalEvents(aTeam, ga, rA, ev, 1, 90);
  if (!o.noCards) genCards(hTeam, aTeam, rH, rA, ev);
  ev.sort(function(x, y){ return x.min - y.min; });
  return { gh: gh, ga: ga, ev: ev, pens: null, et: false };
}
/* eventos procedurales consistentes con un marcador REAL (partido jugado en cancha) */
function eventsForPlayed(gh, ga, hTeam, aTeam){
  var rH = rosterOf(hTeam), rA = rosterOf(aTeam), ev = [];
  genGoalEvents(hTeam, gh, rH, ev, 1, 90); genGoalEvents(aTeam, ga, rA, ev, 1, 90);
  genCards(hTeam, aTeam, rH, rA, ev);
  ev.sort(function(x, y){ return x.min - y.min; });
  return ev;
}
function pensShootout(hTeam, aTeam){
  var sH = 0, sA = 0, turn = 0,
      edge = clamp((hTeam.r - aTeam.r) / 400, -0.06, 0.06);
  function one(p){ return Math.random() < p; }
  while (true){
    if (turn % 2 === 0) { if (one(0.74 + edge)) sH++; } else { if (one(0.74 - edge)) sA++; }
    turn++;
    var rh = Math.ceil(turn / 2), ra = Math.floor(turn / 2), maxK = 5;
    if (rh > maxK && Math.floor((turn) / 2) === ra && turn % 2 === 0){
      if (sH !== sA) break;
    }
    if (rh >= maxK && ra >= 0){
      var remH = Math.max(0, maxK - rh), remA = Math.max(0, maxK - ra);
      if (turn % 2 === 0 && rh <= maxK && sH > sA + maxK - ra) break;
      if (sA > sH + remH) break;
    }
    if (turn > 60) break; /* seguro anti-loop jamás alcanzable en la práctica */
  }
  return [sH, sA];
}

/* ── FIXTURES: round robin (círculo) ── */
function roundRobin(ids, twoLegs){
  var arr = ids.slice(); if (arr.length % 2) arr.push(null);
  var n = arr.length, rds = [], r, i;
  for (r = 0; r < n - 1; r++){
    var day = [];
    for (i = 0; i < n / 2; i++){
      var A = arr[i], B = arr[n - 1 - i];
      if (A && B) day.push((r % 2 === 0) ? { home: A, away: B } : { home: B, away: A });
    }
    rds.push(day);
    arr.splice(1, 0, arr.pop());
  }
  var out = rds.map(function(day){
    return { name: 'Jornada', matches: day.map(function(p){ return { id: rid(), home: p.home, away: p.away, played: false, gh: null, ga: null, ev: [] }; }) };
  });
  if (twoLegs){
    var vuelta = rds.map(function(day){
      return { name: 'Jornada (vuelta)', matches: day.map(function(p){ return { id: rid(), home: p.away, away: p.home, played: false, gh: null, ga: null, ev: [] }; }) };
    });
    out = out.concat(vuelta);
  }
  return out;
}

/* ── TORNEO: creación ── */
var KO_NAMES = { 32: '16avos de final', 16: 'Octavos de final', 8: 'Cuartos de final', 4: 'Semifinales', 2: 'FINAL' };
function nextPow2(n){ var p = 2; while (p < n) p *= 2; return p; }

function makeTournament(cfg){
  var d = db(), teams = cfg.teamIds.map(function(id){ return teamById(id); }).filter(Boolean);
  if (teams.length < 2) return null;
  var T = {
    v: 1, id: 'T' + Date.now().toString(36),
    cfg: {
      name: String(cfg.name || 'Torneo').slice(0, 40), icon: cfg.icon || '🏆',
      format: cfg.format,                       /* 'liga' | 'copa' | 'mixto' */
      twoLegLiga: !!cfg.twoLegLiga,
      twoLegKo: cfg.twoLegKo !== false,         /* KO a ida y vuelta por defecto */
      awayGoals: !!cfg.awayGoals,
      extraTime: cfg.extraTime !== false,
      pens: cfg.pens !== false,
      neutral: !!cfg.neutral,                   /* KO en sede neutral */
      groups: cfg.groups || null,               /* {n, advance, best3} */
      userTeam: cfg.userTeam || null
    },
    teams: teams.map(function(t){ return t.id; }),
    phase: cfg.format === 'copa' ? 'ko' : (cfg.format === 'mixto' ? 'grupos' : 'liga'),
    league: null, groups: null, ko: null,
    stats: { sc: {}, as: {}, yc: {}, rc: {} },
    champion: null, runnerUp: null, log: []
  };
  var ids = T.teams.slice();
  if (T.phase === 'liga'){
    T.league = { teams: ids, rounds: roundRobin(ids, T.cfg.twoLegLiga) };
    T.log.push('📋 ' + T.cfg.name + ': liga a ' + (T.cfg.twoLegLiga ? 'ida y vuelta' : 'sólo ida') + ' con ' + ids.length + ' equipos.');
  } else if (T.phase === 'grupos'){
    var g = T.cfg.groups, nG = clamp(g.n | 0, 2, Math.floor(ids.length / 2) || 2);
    var pots = ids.slice().sort(function(a, b){ return (teamById(b).r - teamById(a).r); });
    var gs = [], gi; for (gi = 0; gi < nG; gi++) gs.push([]);
    /* serpiente por rating */
    var dir = 1, ix = 0, cnt = 0;
    while (cnt < pots.length){
      gs[ix].push(pots[cnt]); cnt++;
      if (dir === 1 && ix === nG - 1) dir = -1;
      else if (dir === -1 && ix === 0) dir = 1;
      else ix += dir;
    }
    var letters = 'ABCDEFGHIJ';
    T.groups = gs.map(function(t2, i2){
      return { name: 'Grupo ' + letters[i2 % letters.length], teams: t2, rounds: roundRobin(t2, !!g.twoLegs) };
    });
    T.log.push('🎲 Sorteo realizado: ' + nG + ' grupos, ' + (g.best3 ? 'avanzan ' + g.advance + ' + ' + g.best3 + ' mejores terceros' : 'avanzan ' + g.advance + ' por grupo') + '.');
  } else {
    T.ko = { rounds: [buildKoRound(ids, null, T)] };
    T.log.push('🏆 ' + T.cfg.name + ': eliminación directa con ' + ids.length + ' equipos.');
  }
  save(T);
  return T;
}

function buildKoRound(seededIds, name, T){
  seededIds = seededIds.slice();
  var n = seededIds.length, size = nextPow2(n), byes = size - n;
  /* los mejores seeds descansan si hay byes */
  var ties = [], i;
  var playSeeds = seededIds.slice(byes), byeSeeds = seededIds.slice(0, byes);
  for (i = 0; i < playSeeds.length; i += 2)
    ties.push({ id: rid(), home: playSeeds[i], away: playSeeds[i + 1], l1: null, l2: null, winner: null, res: null });
  /* descansantes esperan: los metemos como ties resueltos más tarde (winner directo) */
  var hold = byeSeeds.map(function(b){ return { id: rid(), home: b, away: null, l1: null, l2: null, winner: b, res: 'BYE' }; });
  var label = name || KO_NAMES[size] || ('Llave de ' + size);
  return { name: label, size: size, ties: shuffle ? ties.concat(hold) : ties.concat(hold), bye: hold.length, cfg: { twoLeg: T.cfg.twoLegKo && size > 2, done: false } };
}

/* ── TABLAS ── */
function standings(teamIds, rounds){
  var tbl = {};
  teamIds.forEach(function(id){ tbl[id] = { id: id, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 }; });
  (rounds || []).forEach(function(rd){
    (rd.matches || []).forEach(function(m){
      if (!m.played) return;
      var H = tbl[m.home], A = tbl[m.away]; if (!H || !A) return;
      H.pj++; A.pj++; H.gf += m.gh; H.gc += m.ga; A.gf += m.ga; A.gc += m.gh;
      if (m.gh > m.ga){ H.g++; A.p++; H.pts += 3; }
      else if (m.gh < m.ga){ A.g++; H.p++; A.pts += 3; }
      else { H.e++; A.e++; H.pts++; A.pts++; }
    });
  });
  var out = Object.keys(tbl).map(function(k){ return tbl[k]; });
  out.sort(function(a, b){
    return (b.pts - a.pts) || ((b.gf - b.gc) - (a.gf - a.gc)) || (b.gf - a.gf) || (teamById(b.id).r - teamById(a.id).r);
  });
  return out;
}

/* ── transición grupos → KO ── */
function classifyFromGroups(T){
  var g = T.cfg.groups, rows = [];
  T.groups.forEach(function(gr){
    var st = standings(gr.teams, gr.rounds);
    st.forEach(function(rw, ix){
      rows.push({ id: rw.id, rank: ix + 1, pts: rw.pts, dg: rw.gf - rw.gc, gf: rw.gf, grp: gr.name });
    });
  });
  var firsts = rows.filter(function(r){ return r.rank === 1; }).sort(sortRow);
  var seconds = rows.filter(function(r){ return r.rank === 2; }).sort(sortRow);
  var thirds = rows.filter(function(r){ return r.rank === 3; }).sort(sortRow).slice(0, g.best3 | 0);
  function sortRow(a, b){ return (b.pts - a.pts) || (b.dg - a.dg) || (b.gf - a.gf) || (teamById(b.id).r - teamById(a.id).r); }
  var adv = g.advance | 0, seeds = [];
  /* seeds: primero cabezas (1°), luego 2°… hasta cubrir adv por grupo, luego los mejores terceros */
  for (var r = 1; r <= adv; r++)
    seeds = seeds.concat(rows.filter(function(x){ return x.rank === r; }).sort(sortRow));
  if (g.best3) seeds = seeds.concat(thirds);
  return seeds.map(function(s){ return s.id; });
}

/* ── avance/autopromoción tras cada resultado ── */
function allPlayed(rounds){
  for (var r = 0; r < rounds.length; r++) for (var i = 0; i < rounds[r].matches.length; i++) if (!rounds[r].matches[i].played) return false;
  return true;
}
function progress(T){
  if (T.phase === 'liga' && T.league && allPlayed(T.league.rounds)){
    var st = standings(T.league.teams, T.league.rounds);
    T.champion = st[0].id; T.runnerUp = st[1] ? st[1].id : null; T.phase = 'done';
    T.log.push('🏆 ¡' + teamById(T.champion).name + ' ES CAMPEÓN de ' + T.cfg.name + '!');
    save(T); return true;
  }
  if (T.phase === 'grupos'){
    for (var i = 0; i < T.groups.length; i++) if (!allPlayed(T.groups[i].rounds)) return false;
    var ids = classifyFromGroups(T);
    T.phase = 'ko';
    T.ko = { rounds: [buildKoRound(ids, null, T)] };
    T.log.push('⚔️ Eliminatorias listas: ' + ids.length + ' clasificados (' + T.ko.rounds[0].name + ').');
    save(T); return true;
  }
  if (T.phase === 'ko' && T.ko){
    var rd = T.ko.rounds[T.ko.rounds.length - 1];
    for (var t = 0; t < rd.ties.length; t++) if (!rd.ties[t].winner) return false;
    var winners = rd.ties.map(function(x){ return x.winner; }).filter(Boolean);
    if (winners.length === 1 && rd.size === 2 && rd.ties.length === 1){
      T.champion = winners[0];
      var tie = rd.ties[0]; T.runnerUp = tie.home === winners[0] ? tie.away : tie.home;
      T.phase = 'done';
      T.log.push('🏆 ¡' + teamById(T.champion).name + ' ES CAMPEÓN de ' + T.cfg.name + '!');
      save(T); return true;
    }
    var nxt = buildKoRound(winners, null, T);
    T.ko.rounds.push(nxt);
    T.log.push('➡️ Avanza la ronda: ' + nxt.name + ' (' + winners.length + ' equipos).');
    save(T); return true;
  }
  return false;
}

/* ── resolver UNA llave KO (ida/vuelta, gol visita, TE, penales) ── */
function resolveTie(T, tie){
  var home = teamById(tie.home), away = teamById(tie.away);
  if (!tie.l1 || !tie.l1.played) return false;
  if (tie.l2 && !tie.l2.played) { tie.l2 = null; } /* no puede venir marcada sin jugarse */
  var twoLeg = !!(T.ko.rounds[T.ko.rounds.length - 1] && tie.twoLeg);
  if (!twoLeg){
    var r = tie.l1;
    if (r.gh !== r.ga){ tie.winner = r.gh > r.ga ? tie.home : tie.away; tie.res = r.gh + '-' + r.ga; return true; }
    return finishLevel(T, tie, home, away, r.gh + '-' + r.ga);
  }
  if (!tie.l2){
    /* falta la vuelta: se crea al momento por scheduleTies() */
    return false;
  }
  var ah = tie.l1.gh + tie.l2.ga, aa = tie.l1.ga + tie.l2.gh; /* goles del "home" de la llave: l1 casa + l2 fuera */
  var base = 'Global ' + ah + '-' + aa;
  if (ah !== aa){ tie.winner = ah > aa ? tie.home : tie.away; tie.res = base; return true; }
  if (T.cfg.awayGoals){
    var hAway = tie.l2.ga, aAway = tie.l1.ga;
    if (hAway !== aAway){ tie.winner = hAway > aAway ? tie.home : tie.away; tie.res = base + ' (visita ' + hAway + '-' + aAway + ')'; T.log.push('🧳 Gol de visita: pasa ' + teamById(tie.winner).name + '.'); return true; }
  }
  return finishLevel(T, tie, home, away, base);
}
function finishLevel(T, tie, home, away, base){
  var note = base;
  if (T.cfg.extraTime){
    var et = simLeg(home, away, { neutral: T.cfg.neutral, lamH: lambda(home.r, away.r, !T.cfg.neutral) * 0.55, lamA: lambda(away.r, home.r, false) * 0.5 });
    if (et.gh !== et.ga){
      tie.winner = et.gh > et.ga ? tie.home : tie.away;
      tie.res = note + ' · TE ' + et.gh + '-' + et.ga;
      et.ev.forEach(function(e){ e.et = true; feedStats(T, e); });
      T.log.push('⏱️ Prórroga: ' + teamById(tie.winner).name + ' lo resuelve (' + et.gh + '-' + et.ga + ').');
      return true;
    }
    note += ' · TE 0-0';
  }
  var pen = pensShootout(home, away);
  tie.winner = pen[0] > pen[1] ? tie.home : tie.away;
  tie.res = note + ' · pen ' + pen[0] + '-' + pen[1];
  tie.pens = pen;
  T.log.push('🥅 Penales ' + pen[0] + '-' + pen[1] + ': pasa ' + teamById(tie.winner).name + '.');
  return true;
}

/* ── calendario KO: tras jugarse la ida, programar la vuelta ── */
function scheduleTies(T){
  if (!T.ko) return;
  T.ko.rounds.forEach(function(rd){
    rd.ties.forEach(function(tie){
      if (tie.winner || tie.away == null) return;
      tie.twoLeg = (rd.size > 2 && T.cfg.twoLegKo);
      if (tie.twoLeg && tie.l1 && tie.l1.played && !tie.l2)
        tie.l2 = { played: false, gh: null, ga: null, ev: [] };
      if (!tie.twoLeg && tie.l1 && tie.l1.played) resolveTie(T, tie);
      if (tie.twoLeg && tie.l1 && tie.l1.played && tie.l2 && tie.l2.played) resolveTie(T, tie);
    });
  });
}

/* ── estadísticas ── */
function bump(map, team, player, d){
  if (!player) return;
  var k = team + '|' + player;
  if (!map[k]) map[k] = { team: team, name: player, n: 0 };
  map[k].n += (d || 1);
}
function feedStats(T, e){
  if (e.type === 'goal'){ bump(T.stats.sc, e.team, e.sc); bump(T.stats.as, e.team, e.as); }
  else if (e.type === 'yellow') bump(T.stats.yc, e.team, e.pl);
  else if (e.type === 'red') bump(T.stats.rc, e.team, e.pl);
}
function topStats(T, cat, n){
  var map = T.stats[cat] || {}, arr = Object.keys(map).map(function(k){ return map[k]; });
  arr.sort(function(a, b){ return (b.n - a.n) || (teamById(b.team).r - teamById(a.team).r); });
  return arr.slice(0, n || 10);
}

/* ── registrar resultado (SIM o JUGADO) ── */
function findMatch(T, mid){
  var i, j;
  function scan(rounds, ctx){
    for (i = 0; i < rounds.length; i++)
      for (j = 0; j < rounds[i].matches.length; j++)
        if (rounds[i].matches[j].id === mid) return { m: rounds[i].matches[j], day: i, ctx: ctx };
    return null;
  }
  if (T.league){ var f = scan(T.league.rounds, { kind: 'liga' }); if (f) return f; }
  if (T.groups) for (var g = 0; g < T.groups.length; g++){ var f2 = scan(T.groups[g].rounds, { kind: 'grupo', gi: g }); if (f2) return f2; }
  if (T.ko) for (var r = 0; r < T.ko.rounds.length; r++){
    var ties = T.ko.rounds[r].ties;
    for (var t = 0; t < ties.length; t++){
      if (ties[t].id === mid) return { tie: ties[t], leg: 1, ctx: { kind: 'ko', rd: r, ti: t } };
    }
  }
  return null;
}
function playResult(T, mid, gh, ga, realPlayed){
  var f = findMatch(T, mid); if (!f) return null;
  if (f.m){
    if (f.m.played) return null;
    f.m.gh = gh; f.m.ga = ga; f.m.played = true;
    f.m.ev = realPlayed ? eventsForPlayed(gh, ga, teamById(f.m.home), teamById(f.m.away)) : f.m.ev;
    (f.m.ev || []).forEach(function(e){ feedStats(T, e); });
  } else if (f.tie){
    var tie = f.tie, res = tie.twoLeg ? 'l1' : 'l1';
    if (tie[res] && tie[res].played) return null;
    var hT = teamById(tie.home), aT = teamById(tie.away);
    var ev = realPlayed ? eventsForPlayed(gh, ga, hT, aT) : simLeg(hT, aT, { neutral: T.cfg.neutral }).ev;
    tie.l1 = { played: true, gh: gh, ga: ga, ev: ev };
    ev.forEach(function(e){ feedStats(T, e); });
    scheduleTies(T);
    if (T.phase === 'ko') progress(T);
    save(T);
    return tie.l1;
  }
  progress(T); save(T);
  return f.m || null;
}
function simMatch(T, mid){
  var f = findMatch(T, mid); if (!f) return null;
  if (f.m){
    if (f.m.played) return null;
    var r = simLeg(teamById(f.m.home), teamById(f.m.away), { neutral: false });
    return playResult(T, mid, r.gh, r.ga, false);
  }
  if (f.tie && !f.tie.l1){
    var tie = f.tie, r2 = simLeg(teamById(tie.home), teamById(tie.away), { neutral: T.cfg.neutral });
    return playResult(T, mid, r2.gh, r2.ga, false);
  }
  return null;
}
/* ── simular la ronda/jornada ACTUAL sin saltarse al final ── */
function simTieLeg(T, tie){
  if (tie.winner || tie.away == null) return null;
  if (!tie.l1){
    var r0 = simLeg(teamById(tie.home), teamById(tie.away), { neutral: T.cfg.neutral });
    return playResult(T, tie.id, r0.gh, r0.ga, false);
  }
  if (tie.twoLeg && tie.l1.played && tie.l2 && !tie.l2.played){
    var r2 = simLeg(teamById(tie.away), teamById(tie.home), { neutral: T.cfg.neutral });
    tie.l2 = { played: true, gh: r2.gh, ga: r2.ga, ev: r2.ev };
    tie.l2.ev.forEach(function(e){ feedStats(T, e); });
    resolveTie(T, tie);
    progress(T); save(T);
    return tie.l2;
  }
  return null;
}
function simAll(T, dayFilter){
  var done = 0, guard = 20000;
  function tryScan(rounds){
    rounds.forEach(function(rd, di){
      if (dayFilter && dayFilter.kind === 'day' && dayFilter.day !== di) return;
      rd.matches.forEach(function(m){ if (!m.played && guard-- > 0){ if (simMatch(T, m.id)) done++; } });
    });
  }
  if (T.league) tryScan(T.league.rounds);
  if (T.groups) T.groups.forEach(function(g, gi){ tryScan(g.rounds); });
  if (T.ko && !dayFilter){
    var loop = 0;
    while (T.phase === 'ko' && loop++ < 12 && guard > 0){
      var rd = T.ko.rounds[T.ko.rounds.length - 1], acted = false;
      rd.ties.forEach(function(tie){
        if (simTieLeg(T, tie)) { done++; acted = true; }
        var fx = findMatch(T, tie.id);
        if (fx && fx.tie && simTieLeg(T, fx.tie)) { done++; acted = true; }
      });
      if (!acted) break;
      progress(T);
    }
  }
  save(T);
  return done;
}

/* ── siguiente partido del usuario ── */
function nextUserMatch(T){
  if (!T.cfg.userTeam) return null;
  var uid = T.cfg.userTeam, i, j;
  function scan(rounds, label, gi){
    for (i = 0; i < rounds.length; i++)
      for (j = 0; j < rounds[i].matches.length; j++){
        var m = rounds[i].matches[j];
        if (!m.played && (m.home === uid || m.away === uid)) return { id: m.id, home: m.home, away: m.away, label: label + ' · J' + (i + 1) };
      }
    return null;
  }
  if (T.league){ var r = scan(T.league.rounds, 'Liga'); if (r) return r; }
  if (T.groups) for (var g = 0; g < T.groups.length; g++){ var r2 = scan(T.groups[g].rounds, T.groups[g].name, g); if (r2) return r2; }
  if (T.ko){
    var rd = T.ko.rounds[T.ko.rounds.length - 1];
    for (var t = 0; t < rd.ties.length; t++){
      var tie = rd.ties[t];
      if (tie.winner || tie.away == null) continue;
      if (tie.home !== uid && tie.away !== uid) continue;
      if (!tie.l1) return { id: tie.id, home: tie.home, away: tie.away, label: rd.name + (tie.twoLeg ? ' · Ida' : ''), ko: true };
      if (tie.twoLeg && tie.l2 && !tie.l2.played) return { id: tie.id, home: tie.away, away: tie.home, label: rd.name + ' · Vuelta', ko: true, secondLeg: true };
    }
  }
  return null;
}

/* ── metadata de UN partido para la cancha ── */
function matchMeta(T, mid){
  var f = findMatch(T, mid); if (!f) return null;
  var home, away, label, secondLeg = false;
  if (f.m){ home = f.m.home; away = f.m.away; label = (f.ctx.kind === 'grupo' ? T.groups[f.ctx.gi].name : 'Liga') + ' · Jornada ' + (f.day + 1); }
  else {
    var tie = f.tie; secondLeg = !!(tie.twoLeg && tie.l1 && tie.l1.played);
    home = secondLeg ? tie.away : tie.home; away = secondLeg ? tie.home : tie.away;
    label = T.ko.rounds[f.ctx.rd].name + (tie.twoLeg ? (secondLeg ? ' · Vuelta' : ' · Ida') : ' · Partido único');
  }
  var hT = teamById(home), aT = teamById(away), hc = teamColors(hT), ac = teamColors(aT);
  return {
    id: mid, home: home, away: away, hName: hT.name, aName: aT.name, label: label,
    secondLeg: secondLeg, hColors: hc, aColors: ac,
    roster: rosterOf(hT), rosterA: rosterOf(aT)
  };
}

/* ── partido JUGADO en cancha: aplicar y resolver lo que falte ── */
function applyPlayed(T, mid, gh, ga){
  var f = findMatch(T, mid); if (!f) return null;
  if (f.m) return playResult(T, mid, gh, ga, true);
  if (f.tie){
    var tie = f.tie;
    if (tie.twoLeg && tie.l1 && tie.l1.played && tie.l2 && !tie.l2.played){
      /* la cancha jugó la VUELTA: home de cancha = tie.away */
      var hT = teamById(tie.away), aT = teamById(tie.home);
      tie.l2 = { played: true, gh: gh, ga: ga, ev: eventsForPlayed(gh, ga, hT, aT) };
      tie.l2.ev.forEach(function(e){ feedStats(T, e); });
      resolveTie(T, tie);
    } else {
      playResult(T, mid, gh, ga, true);
    }
    progress(T); save(T);
    return tie;
  }
  return null;
}

/* ── persistencia ── */
function save(T){ try { localStorage.setItem(LS_KEY, JSON.stringify(T)); } catch (e) {} }
function loadLast(){
  try {
    var raw = localStorage.getItem(LS_KEY); if (!raw) return null;
    var T = JSON.parse(raw);
    if (!T || T.v !== 1 || !T.teams) return null;
    return T;
  } catch (e) { return null; }
}
function clearSave(){ try { localStorage.removeItem(LS_KEY); } catch (e) {} }

/* ── COMPETICIONES LICENCIADAS (datos reales del LEAGUES_DB + IntlCup) ── */
function topByRating(list, n){ return list.slice().sort(function(a, b){ return b.r - a.r; }).slice(0, n); }
function idsOf(list){ return list.map(function(t){ return t.id; }); }
function uclQualifiers(){
  var out = [];
  try {
    Object.keys(LEAGUES_DB).forEach(function(k){
      var L = LEAGUES_DB[k];
      if (!L || L.region !== 'europa' || !L.uclSlots) return;
      (L.teams || []).slice().sort(function(a, b){ return b[1] - a[1]; }).slice(0, L.uclSlots)
        .forEach(function(t){ out.push('c:' + k + ':' + t[0]); });
    });
  } catch (e) {}
  return out;
}
function uelQualifiers(ex){
  var out = [], skip = {}; (ex || []).forEach(function(x){ skip[x] = 1; });
  try {
    Object.keys(LEAGUES_DB).forEach(function(k){
      var L = LEAGUES_DB[k];
      if (!L || L.region !== 'europa') return;
      var from = L.uclSlots || 0, to = from + (L.uelSlots || 0);
      (L.teams || []).slice().sort(function(a, b){ return b[1] - a[1]; }).slice(from, to)
        .forEach(function(t){ var id = 'c:' + k + ':' + t[0]; if (!skip[id]) out.push(id); });
    });
  } catch (e) {}
  return out;
}
function PRESETS(){
  var out = [], d = db();

  /* 🌟 UEFA CHAMPIONS LEAGUE — 32 clubs: 8 grupos de 4, mata-mata a doble partido
        (sin gol de visita, como la regla UEFA vigente), final a partido único. */
  var ucl = uclQualifiers().map(teamById).filter(Boolean);
  if (ucl.length < 32){
    var have = {}; ucl.forEach(function(t){ have[t.id] = 1; });
    ucl = ucl.concat(topByRating(d.clubs.filter(function(t){ return t.reg === 'europa' && !have[t.id]; }), 32 - ucl.length));
  }
  if (ucl.length >= 32){
    var chIds = idsOf(topByRating(ucl, 32));
    out.push({ key: 'ucl', name: 'UEFA Champions League', icon: '🌟',
      desc: 'Los 32 mejores de Europa por cupos reales de cada liga. 8 grupos de 4, octavos a ida y vuelta (sin gol de visita), prórroga y penales, final única.',
      cfg: { name: 'UEFA Champions League', icon: '🌟', format: 'mixto', teamIds: chIds,
             groups: { n: 8, advance: 2, best3: 0, twoLegs: false },
             twoLegKo: true, awayGoals: false, extraTime: true, pens: true, neutral: false } });
  }

  /* 🟠 UEFA EUROPA LEAGUE — los 32 que siguen */
  var uel = uelQualifiers(ucl.map(function(t){ return t.id; })).map(teamById).filter(Boolean);
  if (uel.length < 32){
    var have2 = {}; ucl.concat(uel).forEach(function(t){ have2[t.id] = 1; });
    uel = uel.concat(topByRating(d.clubs.filter(function(t){ return t.reg === 'europa' && !have2[t.id]; }), 32 - uel.length));
  }
  if (uel.length >= 32){
    var euIds = idsOf(topByRating(uel, 32));
    out.push({ key: 'uel', name: 'UEFA Europa League', icon: '🟠',
      desc: 'La segunda vitrina de Europa con 32 clubs. Mismo camino: 8 grupos y doble partido sin gol de visita hasta la final única.',
      cfg: { name: 'UEFA Europa League', icon: '🟠', format: 'mixto', teamIds: euIds,
             groups: { n: 8, advance: 2, best3: 0, twoLegs: false },
             twoLegKo: true, awayGoals: false, extraTime: true, pens: true, neutral: false } });
  }

  /* 🌎 COPA LIBERTADORES — 32 sudamericanos, CON regla de gol de visita (como manda CONMEBOL) */
  var SUDA = ['bra', 'arg', 'col', 'per', 'uru'];
  var lib = d.clubs.filter(function(t){ return SUDA.indexOf(t.lg) >= 0; });
  if (lib.length >= 32){
    var lbIds = idsOf(topByRating(lib, 32));
    out.push({ key: 'libertadores', name: 'Copa Libertadores', icon: '🌎',
      desc: 'Los 32 mejores de Brasil, Argentina, Colombia, Perú y Uruguay. Grupos, ida y vuelta con gol de visita, final única.',
      cfg: { name: 'Copa Libertadores', icon: '🌎', format: 'mixto', teamIds: lbIds,
             groups: { n: 8, advance: 2, best3: 0, twoLegs: false },
             twoLegKo: true, awayGoals: true, extraTime: true, pens: true, neutral: false } });
  }

  /* 🦅 CONCACAF COPA DE CAMPEONES — clubes mex/usa/hon/crc/nic, eliminatoria directa ida y vuelta */
  var C3 = ['mex', 'usa', 'hon', 'crc', 'nic'];
  var ccc = topByRating(d.clubs.filter(function(t){ return C3.indexOf(t.lg) >= 0; }), 16);
  if (ccc.length >= 8){
    out.push({ key: 'concachampions', name: 'CONCACAF Copa de Campeones', icon: '🦅',
      desc: 'Los 16 grandes del área: Liga MX, MLS, Honduras, Costa Rica y Nicaragua. Cruces directos a ida y vuelta con gol de visita.',
      cfg: { name: 'CONCACAF Copa de Campeones', icon: '🦅', format: 'copa', teamIds: idsOf(ccc),
             twoLegKo: true, awayGoals: true, extraTime: true, pens: true, neutral: false } });
  }

  /* 🌐 COPA MUNDIAL DE CLUBES FIFA — campeones de cada liga + gigantes, 8 grupos de 4 */
  var champs = [];
  try {
    Object.keys(LEAGUES_DB).forEach(function(k){
      var L = LEAGUES_DB[k];
      if (!L || /2$/.test(k)) return; /* solo primeras divisiones */
      var top = (L.teams || []).slice().sort(function(a, b){ return b[1] - a[1]; })[0];
      if (top){ var tt = teamById('c:' + k + ':' + top[0]); if (tt) champs.push(tt); }
    });
  } catch (e2) {}
  var have3 = {}; champs.forEach(function(t){ have3[t.id] = 1; });
  var wcPool = champs.concat(topByRating(d.clubs.filter(function(t){ return !have3[t.id]; }), Math.max(0, 32 - champs.length)));
  if (wcPool.length >= 32){
    out.push({ key: 'clubwc', name: 'Copa Mundial de Clubes FIFA', icon: '🌐',
      desc: 'Campeón de cada liga + los gigantes del ranking hasta 32. 8 grupos de 4, cruces a partido único en sede neutral.',
      cfg: { name: 'Copa Mundial de Clubes FIFA', icon: '🌐', format: 'mixto', teamIds: idsOf(wcPool).slice(0, 32),
             groups: { n: 8, advance: 2, best3: 0, twoLegs: false },
             twoLegKo: false, awayGoals: false, extraTime: true, pens: true, neutral: true } });
  }

  /* 🌍 COPA MUNDIAL FIFA — 48 selecciones, formato real 2026: 12×4, avanzan 2 + 8 mejores terceros */
  var nts = idsOf(d.sels.slice(0, 48));
  if (nts.length >= 48) out.push({ key: 'worldcup', name: 'Copa Mundial FIFA', icon: '🌍',
    desc: '¡EL grande! 48 selecciones, 12 grupos de 4: avanzan 2 y los 8 mejores terceros, y desde 16avos es a vida o muerte con prórroga y penales.',
    cfg: { name: 'Copa Mundial FIFA', icon: '🌍', format: 'mixto', teamIds: nts,
           groups: { n: 12, advance: 2, best3: 8, twoLegs: false },
           twoLegKo: false, awayGoals: false, extraTime: true, pens: true, neutral: true } });

  /* 🏆 CONCACAF COPA ORO — selecciones del área (con tu Honduras) */
  var oro = [];
  try { (IntlCup.CONCAC || []).forEach(function(c){ var t = teamById('s:' + c); if (t) oro.push(t.id); }); } catch (e3) {}
  if (oro.length >= 8) out.push({ key: 'coporo', name: 'CONCACAF Copa Oro', icon: '🏆',
    desc: 'Las selecciones de Norteamérica, Centroamérica y el Caribe. Grupos y semifinales a vida o muerte.',
    cfg: { name: 'CONCACAF Copa Oro', icon: '🏆', format: 'mixto', teamIds: oro,
           groups: { n: 2, advance: 2, best3: 0, twoLegs: false },
           twoLegKo: false, awayGoals: false, extraTime: true, pens: true, neutral: true } });

  /* 🏟️ COPA AMÉRICA — 10 CONMEBOL: 2 grupos de 5, avanzan 4, cuartos */
  var sud = [];
  try { (IntlCup.COMBOL || []).forEach(function(c){ var t = teamById('s:' + c); if (t) sud.push(t.id); }); } catch (e4) {}
  if (sud.length >= 8) out.push({ key: 'copaamerica', name: 'Copa América', icon: '🏟️',
    desc: 'Las 10 selecciones sudamericanas: 2 grupos de 5, avanzan 4 por grupo y cuartos definitorios.',
    cfg: { name: 'Copa América', icon: '🏟️', format: 'mixto', teamIds: sud,
           groups: { n: 2, advance: 4, best3: 0, twoLegs: false },
           twoLegKo: false, awayGoals: false, extraTime: true, pens: true, neutral: true } });

  /* 🦅 COPA CENTROAMERICANA — clubes hon/crc/nic */
  var CCA = ['hon', 'crc', 'nic'];
  var cca = topByRating(d.clubs.filter(function(t){ return CCA.indexOf(t.lg) >= 0; }), 8);
  if (cca.length >= 8){
    out.push({ key: 'centro', name: 'Copa Centroamericana', icon: '🦅',
      desc: 'El orgullo del área: 8 clubs de Honduras, Costa Rica y Nicaragua. 2 grupos de 4 y semifinales.',
      cfg: { name: 'Copa Centroamericana', icon: '🦅', format: 'mixto', teamIds: idsOf(cca),
             groups: { n: 2, advance: 2, best3: 0, twoLegs: false },
             twoLegKo: false, awayGoals: false, extraTime: true, pens: true, neutral: false } });
  }

  return out;
}

/* ── export ── */
window.TOURNEOS = {
  LS_KEY: LS_KEY,
  db: db, teamById: teamById, teamColors: teamColors, rosterOf: rosterOf, mkRoster: mkRoster,
  roundRobin: roundRobin, standings: standings,
  makeTournament: makeTournament, playResult: playResult, applyPlayed: applyPlayed,
  simMatch: simMatch, simAll: simAll, simTieLeg: simTieLeg, simLeg: simLeg, pensShootout: pensShootout,
  resolveTie: resolveTie, scheduleTies: scheduleTies, progress: progress,
  classifyFromGroups: classifyFromGroups, nextUserMatch: nextUserMatch, matchMeta: matchMeta,
  findMatch: findMatch, topStats: topStats, lambda: lambda,
  save: save, loadLast: loadLast, clearSave: clearSave,
  PRESETS: PRESETS, KO_NAMES: KO_NAMES
};
})();
