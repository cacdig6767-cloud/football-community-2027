/* ═══════════════════════════════════════════════════════════════════════════
   QUICKMATCH v1.0 · ⚡ PARTIDO RÁPIDO — hub de amistosos y FutSal (FC27)
   ─────────────────────────────────────────────────────────────────────────
   · Dos modalidades: Partido Normal (F11) y Modo FutSal (2v2 → 5v5).
   · Clubes reales del pool + Selecciones nacionales; auto-XI por posición.
   · Dificultad IA = la misma gradilla del Modo Carrera.
   · 6 estadios F11 y 6 arenas FutSal (3 sin paredes con banda/córner,
     3 con paredes de rebote vivo).
   · "La Rueda" bajito en FutSal; el gol la deja gritar junto a la grada.
   · Mitades de 2–5 minutos (compartido con el Modo Carrera), desempate
     amistoso a elección: tanda directa / clásico / gol de oro / empate.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  var QM = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = QM;
  root.QUICKMATCH = QM;
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

/* ── constantes públicas ─────────────────────────────────────────────── */
var DIFFS = ['Aficionado', 'Profesional', 'Clase Mundial', 'Leyenda', 'Ultimate 🛸'];

var STADS = [
  { k: 'azteca',  n: 'Coloso de Santa Úrsula',  d: 'La catedral azteca: hierba sagrada' },
  { k: 'maracan', n: 'Templo Carioca',          d: 'Río en noche de final' },
  { k: 'wembley', n: 'Arco Imperial',           d: 'Londres y su arco eterno' },
  { k: 'bernabu', n: 'Palacio Blanco',          d: 'Madrid: bombonera de lujo' },
  { k: 'campnou', n: 'Teatro Azulgrana',        d: 'La masía prende la grada' },
  { k: 'oasis',   n: 'Estadio Oasis',           d: 'Casa neutral: noche limpia de futbol' }
];

var ARENAS = [
  { k: 'parque',   n: 'Parque Improvisado',      d: 'Carpas y parlantes, pasto de barrio', wall: false },
  { k: 'playa',    n: 'Cancha de Playa',         d: 'Arena fina, parlantes, público en aro', wall: false },
  { k: 'concreto', n: 'Concreto Tradicional',    d: 'Piso azul y líneas blancas, techada', wall: false },
  { k: 'favela',   n: 'Favela Techada',          d: 'Gradas apretadas, paredes con rebote', wall: true },
  { k: 'pro',      n: 'Futsal Profesional',      d: 'Cristal y madera, gradas completas', wall: true },
  { k: 'escolar',  n: 'Cancha Escolar',          d: 'Gimnasio colegial, parlones al lado', wall: true }
];

var TIES = [
  { k: 'pen',  n: '🥅 Directo a la tanda de penales' },
  { k: 'et',   n: '⏱️ Clásico: prórroga completa + penales' },
  { k: 'gg',   n: '🥇 Gol de Oro (muerte súbita)' },
  { k: 'draw', n: '🤝 Terminar en empate' }
];

/* 8 finales/semifinales oficiales con parche y reglamento */
var FINALS = [
  { k: 'mundial',   n: '🌍 Final del Mundial' },
  { k: 'euro',      n: '🏆 Final de la Eurocopa' },
  { k: 'oro',       n: '🥇 Final Copa Oro' },
  { k: 'nations',   n: '🌎 Final Nations League' },
  { k: 'america',   n: '🌎 Final Copa América' },
  { k: 'ucl',       n: '⭐ Final de la Champions' },
  { k: 'liberta',   n: '🌟 Final de la Libertadores' },
  { k: 'conca',     n: '🌋 Final de la Concachampions' }
];

/* ── Selecciones: 24 combinados con nubes reales (c1/c2 + rating base) ── */
function squadGk(n)  { return n; }
var NATIONS = [
  { k: 'arg', n: 'Argentina', c1: '#7ac2ec', c2: '#123a63', r: 90, ps: ['E. Martínez|GK', 'Rulli|GK', 'Romero|DF', 'Otamendi|DF', 'Tagliafico|DF', 'Molilna|DF', 'Lisandro|DF', 'De Paul|MF', 'Enzo Fernández|MF', 'Mac Allister|MF', 'Paredes|MF', 'Lo Celso|MF', 'Messi|FW', 'Julián Álvarez|FW', 'Lautaro|FW', 'Garnacho|FW'] },
  { k: 'bra', n: 'Brasil', c1: '#ffdf00', c2: '#0a7f3f', r: 89, ps: ['Alisson|GK', 'Bento|GK', 'Marquinhos|DF', 'Gabriel|DF', 'Militão|DF', 'Danilo|DF', 'Wesley|DF', 'Casemiro|MF', 'Bruno G.|MF', 'Paquetá|MF', 'Gerson|MF', 'Rodrygo|FW', 'Vinícius|FW', 'Raphinha|FW', 'Estêvão|FW', 'Endrick|FW'] },
  { k: 'esp', n: 'España', c1: '#c60b1e', c2: '#ffc400', r: 90, ps: ['Unai Simón|GK', 'Raya|GK', 'Carvajal|DF', 'Le Normand|DF', 'Laporte|DF', 'Cucurella|DF', 'Balde|DF', 'Rodri|MF', 'Pedri|MF', 'Zubimendi|MF', 'Merino|MF', 'Olmo|MF', 'Yamal|FW', 'Nico Williams|FW', 'Oyarzabal|FW', 'Morata|FW'] },
  { k: 'fra', n: 'Francia', c1: '#0b3d91', c2: '#e11', r: 89, ps: ['Maignan|GK', 'Samba|GK', 'Saliba|DF', 'Upamecano|DF', 'Koundé|DF', 'Theo|DF', 'Konaté|DF', 'Tchouaméni|MF', 'Rabiot|MF', 'Camavinga|MF', 'Zaïre-Emery|MF', 'Mbappé|FW', 'Dembélé|FW', 'Barcola|FW', 'Théo L.|FW', 'Kolo Muani|FW'] },
  { k: 'eng', n: 'Inglaterra', c1: '#dfe4ea', c2: '#cf0a2c', r: 88, ps: ['Pickford|GK', 'Henderson|GK', 'Stones|DF', 'Maguire|DF', 'Trippier|DF', 'Shaw|DF', 'Walkker|DF', 'Rice|MF', 'Bellingham|MF', 'Foden|MF', 'Mainoo|MF', 'Palmer|MF', 'Kane|FW', 'Saka|FW', 'Gordon|FW', 'Watkins|FW'] },
  { k: 'por', n: 'Portugal', c1: '#006600', c2: '#c9070f', r: 88, ps: ['Diogo Costa|GK', 'Rui Silva|GK', 'Rúben Dias|DF', 'Inácio|DF', 'Cancelo|DF', 'Dalot|DF', 'Nuno Mendes|DF', 'Vitinha|MF', 'Bruno F.|MF', 'Bernardo|MF', 'Neves|MF', 'Félix|MF', 'Cristiano|FW', 'Leão|FW', 'Neto|FW', 'Ramos|FW'] },
  { k: 'ger', n: 'Alemania', c1: '#f0f0f0', c2: '#1a1a1a', r: 87, ps: ['ter Stegen|GK', 'Baumann|GK', 'Kimmimich|DF', 'Rüdiger|DF', 'Tah|DF', 'Mittelstädt|DF', 'Raum|DF', 'Kroos Jr|MF', 'Gündoğan|MF', 'Goretzka|MF', 'Musiala|MF', 'Wirtz|MF', 'Havertz|FW', 'Sané|FW', 'Füllkrug|FW', 'Gnabry|FW'] },
  { k: 'ita', n: 'Italia', c1: '#0064aa', c2: '#e9e9e9', r: 87, ps: ['Donnarumma|GK', 'Vicario|GK', 'Bastoni|DF', 'Calafiori|DF', 'Di Lorenzo|DF', 'Dimarco|DF', 'Mancini|DF', 'Barella|MF', 'Locatelli|MF', 'Tonali|MF', 'Pessina|MF', 'Baldanzi|MF', 'Chiesa|FW', 'Retegui|FW', 'Raspadori|FW', 'Kean|FW'] },
  { k: 'ned', n: 'Países Bajos', c1: '#ff6600', c2: '#21468b', r: 86, ps: ['Verbruggen|GK', 'Olij|GK', 'Van Dijk|DF', 'De Vrij|DF', 'Aké|DF', 'Dumfries|DF', 'Van de Ven|DF', 'De Jong|MF', 'Gravenberch|MF', 'Koopmeiners|MF', 'Reijnders|MF', 'Simons|MF', 'Gakpo|FW', 'Depay|FW', 'Weghorst|FW', 'Malen|FW'] },
  { k: 'uru', n: 'Uruguay', c1: '#5bc2e7', c2: '#0d3b66', r: 85, ps: ['Rochet|GK', 'Mele|GK', 'Araujo|DF', 'Giménez|DF', 'Nahitan|DF', 'Mathías O.|DF', 'Viña|DF', 'Valverde|MF', 'Bentancur|MF', 'Ugarte|MF', 'De Arrascaeta|MF', 'Pellistri|MF', 'Suárez II|FW', 'Darwin|FW', 'González|FW', 'Rodríguez|FW'] },
  { k: 'col', n: 'Colombia', c1: '#f2d518', c2: '#e51f27', r: 85, ps: ['Vargas|GK', 'Diego Marques|GK', 'Davinson|DF', 'Lucumí|DF', 'Yerry|DF', 'Muñoz|DF', 'Castaño|DF', 'Lezcano|MF', 'Lerma|MF', 'Uribe|MF', 'Richard|MF', 'James|MF', 'Díaz|FW', 'Jhon Córdoba|FW', 'Duran|FW', 'Arias|FW'] },
  { k: 'cro', n: 'Croacia', c1: '#e4002b', c2: '#f4f4f4', r: 84, ps: ['Livaković|GK', 'Kotarski|GK', 'Gvardiol|DF', 'Šutalo|DF', 'Ćaleta-Car|DF', 'Juranović|DF', 'Pongračić|DF', 'Modrić|MF', 'Kovačić|MF', 'Majer|MF', 'Baturina|MF', 'Sučić|MF', 'Kovačević|FW', 'Perišić|FW', 'Budimir|FW', 'Pasaalić|FW'] },
  { k: 'bel', n: 'Bélgica', c1: '#ec0c2c', c2: '#fbb503', r: 84, ps: ['Courtois|GK', 'Casteels|GK', 'Witsel|DF', 'Debast|DF', 'Castagne|DF', 'Meunier|DF', 'Faes|DF', 'Tielemans|MF', 'Onana|MF', 'Vermeeren|MF', 'De Bruyne|MF', 'Saelemaekers|MF', 'Lukaku|FW', 'Doku|FW', 'Openda|FW', 'De Wolf|FW'] },
  { k: 'mex', n: 'México', c1: '#006847', c2: '#ce1126', r: 80, ps: ['Malagón|GK', 'Acevedo|GK', 'Johan V.|DF', 'César M.|DF', 'Gallardoo|DF', 'Araujo J.|DF', 'Quiñones|DF', 'Álvarez|MF', 'Charly|MF', 'Orbelín|MF', 'Luis C.|MF', 'Mora|MF', 'Giménez|FW', 'Lozano H.|FW', 'Vega|FW', 'Sánchez|FW'] },
  { k: 'usa', n: 'Estados Unidos', c1: '#21396b', c2: '#b61736', r: 80, ps: ['Turner|GK', 'Freese|GK', 'Richards|DF', 'Robinson|DF', 'Dest|DF', 'Arfsten|DF', 'Tolkin|DF', 'McKennie|MF', 'Adams|MF', 'Musah|MF', 'Reyna|MF', 'Cardoso|MF', 'Pulisic|FW', 'Weah|FW', 'Pepi|FW', 'Balogun|FW'] },
  { k: 'hon', n: 'Honduras', c1: '#00549f', c2: '#f4f6f8', r: 74, ps: ['Cragwell|GK', 'Euda Borjas|GK', 'Gomes|DF', 'Márquez|DF', 'Población|DF', 'Erazo|DF', 'Pineda H.|DF', 'Flores|MF', 'Kervin|MF', 'Rosales|MF', 'Cragwell A.|MF', 'Alvarez K.|MF', 'Quioto|FW', 'Benguché|FW', 'Epps|FW', 'Puerto|FW'] },
  { k: 'jpn', n: 'Japón', c1: '#0a1a5c', c2: '#e3002b', r: 82, ps: ['Suzuki Z.|GK', 'Osako|GK', 'Mohger|DF', 'Tomiyasu|DF', 'Itakurra|DF', 'Matúzda|DF', 'Machida|DF', 'Endo|MF', 'Morita|MF', 'Kuboo|MF', 'Mitoma|MF', 'Mitoma H.|MF', 'Kubo|FW', 'Furuhashi|FW', 'Kamada D.|FW', 'Ueda|FW'] },
  { k: 'mar', n: 'Marruecos', c1: '#c1272d', c2: '#006233', r: 83, ps: ['Bounou|GK', 'Benabid|GK', 'Hakimi|DF', 'Aguerd|DF', 'El Kaouakibi|DF', 'Masina|DF', 'Mazraoui|DF', 'Amrabat|MF', 'Ounahi|MF', 'El Aynaoui|MF', 'Zonaln|MF', 'Harit|MF', 'En-Nesyri|FW', 'Díaz B.|FW', 'Abde|FW', 'Seghir|FW'] },
  { k: 'sen', n: 'Senegal', c1: '#00853f', c2: '#fdef42', r: 82, ps: ['Mendy É.|GK', 'Ngate|GK', 'Koulibaly|DF', 'Niakhaté|DF', 'Sonko|DF', 'Diallo K.|DF', 'Camara K.|DF', 'Gueye|MF', 'Sarr K.|MF', 'Kanté|MF', 'Camara L.|MF', 'Diatta|FW', 'Mané|FW', 'Simaa|FW', 'Jackson|FW', 'Ndiaye|FW'] },
  { k: 'sui', n: 'Suiza', c1: '#da291c', c2: '#f4f4f4', r: 81, ps: ['Kobel|GK', 'Gregor|GK', 'Schär|DF', 'Akanji|DF', 'Rodríguez R.|DF', 'Widmer|DF', 'Pereira|DF', 'Xhaka|MF', 'Zakariia|MF', 'Frei|MF', 'Sow|MF', 'Amdouni|MF', 'Shaqiri|FW', 'Vargas N.|FW', 'Rieder|FW', 'Embolo|FW'] },
  { k: 'pol', n: 'Polonia', c1: '#dc143c', c2: '#f4f4f4', r: 79, ps: ['Bułka|GK', 'Grabara|GK', 'Bednarek|DF', 'Kiwior|DF', 'Kądzior|DF', 'Zalewski|DF', 'Dawidowicz|DF', 'Zieliński|MF', 'Szymański|MF', 'Moder|MF', 'Jakemi|MF', 'Urbański|MF', 'Lewandowski|FW', 'Milikk|FW', 'Muza|FW', 'Piatek|FW'] },
  { k: 'kor', n: 'Corea del Sur', c1: '#cd2e3a', c2: '#0047a0', r: 78, ps: ['Kim S.|GK', 'Kang|GK', 'Kim Min-jae|DF', 'Jung S.|DF', 'Kim Moon|DF', 'Seol|DF', 'Yoo|DF', 'Hwang In|MF', 'Park Yong|MF', 'Lee Kang|MF', 'Hong Hyun|MF', 'Jens|MF', 'Son H.|FW', 'Hwang H.|FW', 'Oh H.|FW', 'Jeong W.|FW'] },
  { k: 'ecu', n: 'Ecuador', c1: '#ffd400', c2: '#0a2a6b', r: 79, ps: ['Galíndez|GK', 'Napoé|GK', 'Hincapié|DF', 'Pacho|DF', 'Torres F.|DF', 'Angulo|DF', 'Chávez|DF', 'Caicedo|MF', 'Zambrano|MF', 'Sarmiento|MF', 'Vite|MF', 'Gruezo|MF', 'Valencia|FW', 'Plata|FW', 'Mercado|FW', 'Parrales|FW'] },
  { k: 'par', n: 'Paraguay', c1: '#d9261c', c2: '#2b4d9b', r: 79, ps: ['Fernández R.|GK', 'Gilly|GK', 'Balbuena|DF', 'Gomez G.|DF', 'Viera|DF', 'Sandoval|DF', 'Cazáres|DF', 'Diego Gómez|MF', 'Diaz|MF', 'Rojas|MF', 'Duarte O.|MF', 'Vera|MF', 'Sanabria|FW', 'Sosa|FW', 'Oróz|FW', 'Dulce|FW'] }
];
/* parche interno: nombres con faltas de dedo humanas (los comentaristas hablan, no deletrean) */

var FALLBACK_CLUBS = ['Real Madrid', 'FC Barcelona', 'Manchester City', 'Bayern Múnich', 'PSG', 'Liverpool', 'Inter', 'AC Milan', 'Boca Juniors', 'River Plate', 'Olimpia', 'Selección Libre'];
var FIRST = ['Álex', 'Bruno', 'Dario', 'Ezra', 'Marek', 'Tilo', 'Juan', 'Santi', 'Iker', 'Nico'];
var LAST  = ['Vega', 'Ríos', 'Duarte', 'Falk', 'Silva', 'Monje', 'Reyes', 'Cruz', 'Perla', 'Sol'];

/* ── utilidades de base ──────────────────────────────────────────────── */
function pool() {
  try { if (typeof rootRealPool() !== 'undefined' && rootRealPool().length) return rootRealPool(); } catch (e) {}
  return [];
}
function rootRealPool() { return (typeof REAL_PLAYERS_POOL !== 'undefined') ? REAL_PLAYERS_POOL : (self.REAL_PLAYERS_POOL || []); }
function posMap(p) { return p === 'GK' ? 'POR' : p === 'DF' ? 'DEF' : p === 'MF' ? 'MED' : p === 'FW' ? 'DEL' : 'MED'; }
function ficha(name, rating, posTag) {
  return { n: String(name || 'Ficha').slice(0, 14), r: Math.max(40, Math.min(116, rating | 0)), p: posMap(posTag) };
}
function rnd(i) { return Math.floor(Math.random() * i); }
function genName(seed) {
  return FIRST[(seed * 7 + rnd(3)) % FIRST.length] + ' ' + LAST[(seed * 11 + rnd(5)) % LAST.length];
}

/* clubes disponibles: únicos del pool con su mejor rating (top 60 por poder) */
function clubsList() {
  var p = pool(), byClub = {}, order = [];
  if (p.length) {
    for (var i = 0; i < p.length; i++) {
      var row = p[i]; if (!row || !row[4]) continue;
      if (!byClub[row[4]]) { byClub[row[4]] = { n: row[4], best: 0, cnt: 0, rows: [] }; order.push(row[4]); }
      byClub[row[4]].rows.push(row); byClub[row[4]].cnt++;
      if ((row[2] | 0) > byClub[row[4]].best) byClub[row[4]].best = row[2] | 0;
    }
    return order.map(function (k) { return byClub[k]; }).sort(function (a, b) { return (b.best - a.best) || (b.cnt - a.cnt); });
  }
  return FALLBACK_CLUBS.map(function (n, i) { return { n: n, best: 84 - i, cnt: 16, rows: [] }; });
}

/* plantilla por club: 13 de campo + 2 porteros; XI inteligente primero */
function rosterClub(name) {
  var rows = (clubsList().filter(function (c) { return c.n === name; })[0] || {}).rows || [];
  var out = [];
  if (rows.length) {
    var gks = rows.filter(function (r) { return longestPos(r) === 'POR'; })
      .sort(function (a, b) { return (b[2] | 0) - (a[2] | 0); });
    var field = rows.filter(function (r) { return longestPos(r) !== 'POR'; })
      .sort(function (a, b) { return (b[2] | 0) - (a[2] | 0); });
    var xi = autoXI(field.map(function (r) { return ficha(r[0], r[2], r[1]); }), 10);
    var bench = field.map(function (r) { return ficha(r[0], r[2], r[1]); })
      .filter(function (f) { return xi.indexOf(f) < 0; }).slice(0, 3);
    out = xi.concat(bench);
    out.push(gks[0] ? ficha(gks[0][0], gks[0][2], 'GK') : ficha(genName(1), 80, 'GK'));
    out.push(gks[1] ? ficha(gks[1][0], gks[1][2], 'GK') : ficha(genName(2), 76, 'GK'));
    return out;
  }
  /* sin datos reales: plantilla generada */
  for (var i = 0; i < 13; i++) out.push(ficha(genName(i + name.length), 62 + rnd(28), i < 4 ? 'DF' : i < 9 ? 'MF' : 'FW'));
  out = autoXI(out, 10).concat(out.slice(10));
  out.push(ficha(genName(21 + name.length), 80, 'GK'));
  out.push(ficha(genName(31 + name.length), 74, 'GK'));
  return out;
}
function longestPos(row) { return posMap(row[1]); }

/* auto-XI: arquero aparte; el dibujo primero por posición natural y rating */
function autoXI(fieldFichas, sideN) {
  var pick = [], used = {};
  function grab(tag, need) {
    fieldFichas.forEach(function (f) {
      if (need <= 0 || used[f.n] || f.p !== tag) return;
      used[f.n] = 1; pick.push(f); need--;
    });
    return need;
  }
  var needDF = sideN >= 8 ? 4 : Math.max(1, Math.round(sideN * 0.36));
  var needFW = sideN >= 8 ? 3 : Math.max(1, Math.round(sideN * 0.30));
  var needMF = sideN - needDF - needFW;
  grab('DEL', needFW); grab('MED', needMF); grab('DEF', needDF);
  /* completar por rating si alguna banda vino corta */
  fieldFichas.forEach(function (f) { if (pick.length < sideN && !used[f.n]) { used[f.n] = 1; pick.push(f); } });
  return pick.slice(0, sideN);
}

function teamRatingOf(roster) {
  var xs = roster.filter(function (f) { return f.p !== 'POR'; }).slice(0, 10);
  if (!xs.length) return 70;
  return Math.round(xs.reduce(function (a, f) { return a + f.r; }, 0) / xs.length);
}

function shade(hex, f) {
  var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex || '');
  if (!m) return '#1d1d2f';
  return '#' + [m[1], m[2], m[3]].map(function (h) {
    var v = Math.max(0, Math.min(255, Math.round(parseInt(h, 16) * f)));
    return (v < 16 ? '0' : '') + v.toString(16);
  }).join('');
}
function colorsOf(teamName) {
  try {
    if (typeof TEAM_COLORS !== 'undefined' && TEAM_COLORS[teamName]) return [TEAM_COLORS[teamName], shade(TEAM_COLORS[teamName], 0.45)];
    if (self.TEAM_COLORS && self.TEAM_COLORS[teamName]) return [self.TEAM_COLORS[teamName], shade(self.TEAM_COLORS[teamName], 0.45)];
  } catch (e) {}
  var nat = NATIONS.filter(function (x) { return x.n === teamName; })[0];
  if (nat) return [nat.c1, nat.c2];
  return ['#b03030', shade('#b03030', 0.45)];
}

/* ── estado + persistencia ───────────────────────────────────────────── */
var CFG_KEY = 'fc27_qm_cfg', SET_KEY = 'fc27_qm_set';
function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v || d; } catch (e) { return d; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function cfg() { return load(CFG_KEY, { mode: 'f11', home: '', away: '', kindH: 'club', kindA: 'club', diff: 1, mt: 240, rules: 'normal', tie: 'et', stad: 'azteca', arena: 'concreto', side: 5, event: '' }); }
function putCfg(c) { save(CFG_KEY, c); }
function settings() { return load(SET_KEY, { mt: 240, tie: 'et' }); }

/* ── URL de cancha (mismo contrato que el bridge de Carrera) ─────────── */
function buildURL(c) {
  var isFut = c.mode === 'futsal';
  var out = { url: '', err: '' };
  if (!c.home || !c.away) { out.err = 'Elige ambos equipos'; return out; }
  if (c.home === c.away) { out.err = 'Elige dos equipos distintos'; return out; }
  var rH = (c.kindH === 'nat') ? rosterNation(c.home) : rosterClub(c.home);
  var rA = (c.kindA === 'nat') ? rosterNation(c.away) : rosterClub(c.away);
  if (!rH || !rA) { out.err = 'Plantilla vacía'; return out; }
  var hc = colorsOf(c.home), ac = colorsOf(c.away);
  var ev = (c.event && FINALS.filter(function (f) { return f.k === c.event; })[0]) || null;
  var label = isFut ? ('🏟️ FutSal ' + arebyK(c.arena).n) : (ev ? ev.n : ('🏟️ ' + stadByK(c.stad).n));
  var q = ['career=1', 'club=' + encodeURIComponent(c.home), 'rival=' + encodeURIComponent(c.away),
    'diff=' + (c.diff | 0), 'dpc=100', 'comp=liga', 'compx=' + encodeURIComponent(label),
    'h1=' + encodeURIComponent(hc[0]), 'h2=' + encodeURIComponent(hc[1]),
    'a1=' + encodeURIComponent(ac[0]), 'a2=' + encodeURIComponent(ac[1]),
    'form=4-3-3',
    'roster=' + encodeURIComponent(JSON.stringify(rH)),
    'rosterA=' + encodeURIComponent(JSON.stringify(rA)),
    'mt=' + ((c.mt | 0) || 240), 'bus=qr'];
  if (ev) q.push('mustWin=1');
  else q.push('tie=' + (c.tie || 'et'));
  if (isFut) {
    q.push('futsal=1', 'gg=1', 'music=larueda', 'n=' + Math.max(1, Math.min(4, (c.side | 0) - 1)),
      'arena=' + c.arena, 'rules=none');            /* FutSal: solo Modo Sin Reglas */
    if (arebyK(c.arena).wall) q.push('walls=1');
  } else {
    q.push('stad=' + c.stad, 'rules=' + (c.rules || 'normal'));
  }
  out.url = 'haxball-fc27.html?' + q.join('&');
  out.rosterH = rH; out.rosterA = rA;
  return out;
}
function stadByK(k) { var x = STADS.filter(function (s) { return s.k === k; })[0]; return x || STADS[0]; }
function arebyK(k) { var x = ARENAS.filter(function (s) { return s.k === k; })[0]; return x || ARENAS[0]; }

function rosterNation(name) {
  var nat = NATIONS.filter(function (x) { return x.n === name; })[0];
  if (!nat) return null;
  var field = [], gks = [];
  nat.ps.forEach(function (s) {
    var sp = s.split('|'); var pos = sp[1] || 'MF';
    if (pos === 'GK') gks.push(ficha(sp[0], nat.r - 2 + rnd(5), 'GK'));
    else field.push(ficha(sp[0], nat.r - 4 + rnd(7), pos));
  });
  var xi = autoXI(field.sort(function (a, b) { return b.r - a.r; }), 10);
  field = field.filter(function (f) { return xi.indexOf(f) < 0; });
  return xi.concat(field.slice(0, 3)).concat([gks[0] || ficha('Portero', nat.r, 'GK'), gks[1] || ficha('Suplente', nat.r - 4, 'GK')]);
}

/* ── overlay de cancha ───────────────────────────────────────────────── */
var ov = null, lastPayload = null;
function close() {
  if (ov && ov.parentNode) ov.parentNode.removeChild(ov); ov = null;
  try { if (typeof Music !== 'undefined' && Music.restore) Music.restore(); } catch (e) {}
}
function launch(c) {
  var b = buildURL(c);
  if (b.err) { toast(b.err); return false; }
  putCfg(c);
  ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:#000;z-index:99999;display:flex;flex-direction:column';
  var bar = document.createElement('div');
  bar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:#0b0d17;color:#8fa2cf;font:700 12px system-ui,-apple-system,sans-serif';
  var ttl = document.createElement('b'); ttl.style.cssText = 'color:#fff;font-size:13px';
  ttl.textContent = '⚡ ' + c.home + ' vs ' + c.away + (c.mode === 'futsal' ? ' · FutSal' : '');
  var btn = document.createElement('button');
  btn.textContent = '✕ salir';
  btn.style.cssText = 'background:#1b2138;color:#cfd8ff;border:1px solid #2c3760;border-radius:8px;padding:6px 10px;font:800 12px system-ui;cursor:pointer';
  btn.onclick = function () { if (window.confirm('¿Salir del partido rápido?')) close(); };
  bar.appendChild(ttl); bar.appendChild(btn); ov.appendChild(bar);
  var fr = document.createElement('iframe');
  fr.src = b.url; fr.style.cssText = 'flex:1;border:0;width:100%';
  ov.appendChild(fr); document.body.appendChild(ov);
  lastPayload = c;
  try { if (typeof Music !== 'undefined' && Music.duck) Music.duck(); } catch (e) {}
  return true;
}
if (typeof self !== 'undefined' && self.addEventListener) {
  self.addEventListener('message', function (e) {
    var d = e && e.data;
    if (!d || d.type !== 'FC27_RESULT' || !ov) return;
    if (typeof d.gh !== 'number' || typeof d.ga !== 'number') return;
    close();
    resultModal(d);
  });
}
function resultModal(d) {
  var c = lastPayload || { home: 'A', away: 'B' };
  var m = document.createElement('div');
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px';
  var box = document.createElement('div');
  box.style.cssText = 'background:linear-gradient(180deg,#141a38,#0d1126);border:1px solid #2c3760;border-radius:18px;padding:22px;max-width:420px;width:100%;text-align:center;color:#e9edff;font-family:system-ui,-apple-system,sans-serif';
  var pen = d.pen ? '<div style="font-size:.78rem;color:#ffd166;margin-top:4px">🥅 penales ' + (d.pen[0] || 0) + ' – ' + (d.pen[1] || 0) + '</div>' : '';
  box.innerHTML =
    '<div style="font-size:.7rem;letter-spacing:2px;color:#8fa2cf">PARTIDO RÁPIDO · FINAL</div>' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin:14px 0">' +
    '<div style="flex:1;font-weight:800">' + esc(c.home) + '</div>' +
    '<div style="font-size:2rem;font-weight:900;color:#ffd166;padding:0 12px">' + d.gh + ' – ' + d.ga + '</div>' +
    '<div style="flex:1;font-weight:800">' + esc(c.away) + '</div></div>' + pen;
  var row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:8px;margin-top:14px';
  function mk(t, cb, bg) {
    var b = document.createElement('button'); b.textContent = t;
    b.style.cssText = 'flex:1;background:' + bg + ';color:#fff;border:0;border-radius:10px;padding:12px 8px;font:800 13px system-ui;cursor:pointer';
    b.onclick = cb; row.appendChild(b);
  }
  mk('🔁 Revancha', function () { m.remove(); launch(c); }, '#1d6fe0');
  mk('⚙️ Cambiar', function () { m.remove(); openTab(); }, '#39415c');
  mk('✕ Cerrar', function () { m.remove(); }, '#20263e');
  box.appendChild(row); m.appendChild(box); document.body.appendChild(m);
  m.addEventListener('click', function (e) { if (e.target === m) m.remove(); });
}
function esc(s) { return String(s || '').replace(/</g, '&lt;'); }
function toast(t) {
  try { if (typeof showToast === 'function') { showToast(t, 'gold'); return; } } catch (e) {}
  alert(t);
}

/* ── pantalla propia (modo de menú principal, como TorneosUI) ────────── */
function open() {
  if (typeof document === 'undefined') return;
  ensureTab();
  var sc = document.getElementById('qm-screen');
  if (!sc) {
    sc = document.createElement('div');
    sc.id = 'qm-screen';
    sc.style.cssText = 'position:fixed;inset:0;z-index:9000;background:linear-gradient(180deg,#0a0f18,#070b13);overflow-y:auto;display:none';
    sc.innerHTML =
      '<div style="position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(7,11,19,.92);border-bottom:1px solid #1c2542;backdrop-filter:blur(6px)">' +
      '<button id="qm-back" style="background:#1b2138;color:#cfd8ff;border:1px solid #2c3760;border-radius:10px;padding:8px 14px;font:800 13px system-ui;cursor:pointer">← Menú</button>' +
      '<div style="font:900 15px system-ui;color:#ffd166;letter-spacing:1px">⚡ PARTIDO RÁPIDO</div></div>' +
      '<div id="qm-body" style="max-width:860px;margin:0 auto;padding:12px 10px 60px"></div>';
    document.body.appendChild(sc);
    var bk = document.getElementById('qm-back');
    if (bk) bk.onclick = function () { sc.style.display = 'none'; close(); }; /* 🩹 ← Menú también cierra el hub de Partido Rápido (antes close() solo quitaba el partido) */
  }
  sc.style.display = '';
  render();
}
function closeOverlay() {
  var sc = document.getElementById('qm-screen');
  if (sc) sc.style.display = 'none';
}
function openTab() { open(); }

var CSS_ID = 'qm-css';
function css() {
  if (document.getElementById(CSS_ID)) return;
  var st = document.createElement('style'); st.id = CSS_ID;
  st.textContent =
    '#qm-body{font-family:system-ui,-apple-system,sans-serif;color:#e9edff;display:flex;flex-direction:column;gap:14px}' +
    '.qm-card{background:linear-gradient(180deg,#141a30,#0e1224);border:1px solid #2c3760;border-radius:14px;padding:14px}' +
    '.qm-h{font-size:.72rem;letter-spacing:2px;color:#8fa2cf;text-transform:uppercase;margin-bottom:8px;font-weight:800}' +
    '.qm-modes{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.qm-mode{border:2px solid #2c3760;border-radius:12px;padding:12px;cursor:pointer;background:#131a33;transition:.15s}' +
    '.qm-mode.on{border-color:#ffd166;background:#1b2547}' +
    '.qm-mode b{font-size:.95rem;display:block}' + '.qm-mode small{opacity:.75}' +
    '.qm-sel{width:100%;padding:11px 10px;border-radius:10px;border:1px solid #2c3760;background:#12182e;color:#e9edff;font:700 13px system-ui;margin-top:6px}' +
    '.qm-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.qm-chip{border:1px solid #2c3760;border-radius:10px;padding:10px;background:#12182e;cursor:pointer;font:800 12px system-ui;text-align:center}' +
    '.qm-chip.on{border-color:#ffd166;background:#22305c}' +
    '.qm-venues{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}' +
    '.qm-ven{border:2px solid #2c3760;border-radius:12px;padding:8px;cursor:pointer;background:#12182e;text-align:center;transition:.15s}' +
    '.qm-ven.on{border-color:#ffd166}' +
    '.qm-ven .sw{height:34px;border-radius:8px;margin-bottom:6px}' +
    '.qm-ven b{font-size:.72rem;display:block;line-height:1.15}' + '.qm-ven small{font-size:.62rem;opacity:.7}' +
    '.qm-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}' +
    '.qm-btn{background:linear-gradient(180deg,#f6ad2d,#e08a12);color:#1a1206;border:0;border-radius:12px;padding:14px 18px;font:900 15px system-ui;cursor:pointer;width:100%;box-shadow:0 6px 18px rgba(246,173,45,.25)}' +
    '.qm-wall{display:inline-block;font-size:.6rem;background:#1a2140;border-radius:6px;padding:1px 6px;margin-top:4px;color:#ffd166;border:1px solid #4d5a8c}' +
    '.qm-ea-top{font-family:\'Barlow Condensed\',sans-serif;font-style:italic;font-weight:800;letter-spacing:2px;font-size:.95rem;color:#8ffce4;margin-bottom:8px}' +
    '.qm-ea{display:grid;grid-template-columns:1fr 86px 1fr;gap:10px;align-items:stretch}' +
    '.qm-panel{position:relative;background:linear-gradient(170deg,rgba(16,44,60,.6),rgba(7,17,30,.72));border:1px solid rgba(64,220,200,.20);border-radius:22px;padding:26px 14px 16px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)}' +
    '.qm-side{position:absolute;top:0;left:12px;font-family:\'Barlow Condensed\',sans-serif;font-style:italic;font-weight:800;color:rgba(190,255,238,.30);font-size:2rem;letter-spacing:2px}' +
    '.qm-panel:last-child .qm-side{left:auto;right:12px}' +
    '.qm-teamname{font-family:\'Barlow Condensed\',sans-serif;font-style:italic;font-weight:800;font-size:1.45rem;color:#eafffb;letter-spacing:.5px;margin:6px 0 4px;min-height:1.6em}' +
    '.qm-crestbox{position:relative;height:132px;display:flex;align-items:center;justify-content:center;margin:4px 0 8px}' +
    '.qm-crestimg{height:118px;max-width:150px;object-fit:contain;filter:drop-shadow(0 8px 16px rgba(0,0,0,.5))}' +
    '.qm-flagbig svg{height:96px;width:auto;border-radius:8px;box-shadow:0 8px 18px rgba(0,0,0,.45)}' +
    '.qm-shield{height:104px;width:84px;display:flex;align-items:center;justify-content:center;font-family:\'Barlow Condensed\',sans-serif;font-style:italic;font-weight:900;font-size:2rem;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.5);clip-path:polygon(50% 0,100% 18%,88% 88%,50% 100%,12% 88%,0 18%);box-shadow:0 10px 22px rgba(0,0,0,.4)}' +
    '.qm-arr{position:absolute;top:50%;transform:translateY(-50%);width:42px;height:64px;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#b9ffe9;background:rgba(255,255,255,.07);border:1px solid rgba(140,240,220,.28);border-radius:12px;cursor:pointer;z-index:2;transition:all .15s}' +
    '.qm-arr:hover{background:rgba(37,246,201,.22);color:#fff}' +
    '.qm-l{left:4px}.qm-r{right:4px}' +
    '.qm-stars{color:#ffd166;font-size:.95rem;letter-spacing:2px;margin-bottom:6px}' +
    '.qm-stars-off{opacity:.22}' +
    '.qm-attrs{display:flex;justify-content:center;gap:14px;font-size:.7rem;color:#9fd8c8;letter-spacing:1px;margin-bottom:6px}' +
    '.qm-attrs b{color:#eafffb;margin-left:2px}' +
    '.qm-tipo{font-size:.64rem;color:rgba(170,230,215,.55);letter-spacing:1px;text-transform:uppercase}' +
    '.qm-center{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}' +
    '.qm-vs{font-family:\'Barlow Condensed\',sans-serif;font-style:italic;font-weight:900;font-size:2.1rem;background:linear-gradient(180deg,#eafffb,#25f6c9);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.qm-mode-tag{font-size:.72rem;font-weight:700;color:#b9ffe9;background:rgba(37,246,201,.12);border:1px solid rgba(37,246,201,.3);border-radius:999px;padding:4px 10px}' +
    '.qm-meta-sm{font-size:.64rem;color:#8fbdb0;letter-spacing:.5px}' +
    '@media(max-width:720px){.qm-ea{grid-template-columns:1fr}.qm-center{flex-direction:row;padding:4px 0}}' +
    '@media(max-width:640px){.qm-venues{grid-template-columns:repeat(2,1fr)}}';
  document.head.appendChild(st);
}

function optsClubs(sel) {
  return clubsList().slice(0, 64).map(function (c) {
    return '<option value="' + esc(c.n) + '"' + (sel === c.n ? ' selected' : '') + '>' + esc(c.n) + ' ★' + c.best + '</option>';
  }).join('');
}
function optsNations(sel) {
  return NATIONS.map(function (n) {
    return '<option value="' + esc(n.n) + '"' + (sel === n.n ? ' selected' : '') + '>' + esc(n.n) + ' ★' + n.r + '</option>';
  }).join('');
}
function venueSw(v, isFut) {
  var cmap = isFut
    ? { parque: '#4a8f3c', playa: '#e8c983', concreto: '#1d4ed8', favela: '#8a5a3b', pro: '#7c5a2e', escolar: '#0e7490' }
    : { azteca: '#0b6d33', maracan: '#0d7f3e', wembley: '#0a6b3b', bernabu: '#0f8440', campnou: '#0a6f33', oasis: '#0d7a45' };
  return 'background:linear-gradient(135deg,' + (cmap[v.k] || '#333') + ',' + shade(cmap[v.k] || '#333', .55) + ')';
}

/* ── chooser estilo Classic Match (paneles HOME / AWAY) ─────────────────── */
/* caché del listado de clubes: el pool no cambia durante la sesión; sin esto
   cada render/arroclic re-escaneaba miles de fichas (lag en teléfonos viejos) */
var _clubMemo = { pool: null, len: -1, list: null };
function clubsListFast() {
  var p = pool();
  if (_clubMemo.pool === p && _clubMemo.list && _clubMemo.len === (p ? p.length : 0)) return _clubMemo.list;
  _clubMemo.pool = p;
  _clubMemo.len = p ? p.length : 0;
  _clubMemo.list = clubsList();
  return _clubMemo.list;
}
function listFor(kind) {
  return kind === 'nat'
    ? NATIONS.map(function (n) { return n.n; })
    : clubsListFast().slice(0, 80).map(function (x) { return x.n; });
}
function teamRate(name, kind) {
  var hit;
  if (kind === 'nat') {
    hit = NATIONS.filter(function (n) { return n.n === name; })[0];
    return hit ? hit.r : 80;
  }
  hit = clubsListFast().filter(function (c) { return c.n === name; })[0];
  return hit ? hit.best : 78;
}
function stars(r) {
  var n = Math.max(1, Math.min(5, Math.round(r / 20)));
  return '\u2605\u2605\u2605\u2605\u2605'.slice(0, n) +
    '<span class="qm-stars-off">' + '\u2605\u2605\u2605\u2605\u2605'.slice(0, 5 - n) + '</span>';
}
function crestOf(kind, name) {
  var i, u, nat = null;
  if (kind === 'nat') {
    nat = NATIONS.filter(function (n) { return n.n === name; })[0];
    try {
      if (nat && self.IntlCup && IntlCup.flagSVG) {
        var f = IntlCup.flagSVG(nat.k, 108, 72);
        if (f) return '<div class="qm-flagbig">' + f + '</div>';
      }
    } catch (e) {}
  } else {
    try {
      u = (typeof CRESTS !== 'undefined' && CRESTS[name]) || (self.CRESTS && self.CRESTS[name]);
      if (u) return '<img class="qm-crestimg" src="' + u + '" alt="">';
    } catch (e) {}
  }
  var cs = nat ? [nat.c1, nat.c2] : colorsOf(name);
  var init = String(name).split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  return '<div class="qm-shield" style="background:linear-gradient(160deg,' + cs[0] + ',' + cs[1] + ')">' + init + '</div>';
}
function cycle(side, dir) {
  var c = cfg();
  var kind = c['kind' + side], key = side === 'H' ? 'home' : 'away';
  var L = listFor(kind);
  if (!L.length) return;
  var i = L.indexOf(c[key]); if (i < 0) i = 0;
  c[key] = L[(i + dir + L.length) % L.length];
  putCfg(c);
  render();
}
function defPick(list, pref) {
  if (!list || !list.length) return '';
  if (pref && list.indexOf(pref) >= 0) return pref;
  return list[0] || '';
}
function eaCard(c) {
  var LH = listFor(c.kindH), LA = listFor(c.kindA);
  if (!c.home || LH.indexOf(c.home) < 0) c.home = defPick(LH, 'FC Barcelona');
  if (!c.away || LA.indexOf(c.away) < 0 || c.away === c.home) {
    c.away = defPick(LA, 'Real Madrid');
    if (!c.away || c.away === c.home) c.away = LA.filter(function (n) { return n !== c.home; })[0] || '';
  }
  function panel(side) {
    var kind = c['kind' + side], name = side === 'H' ? c.home : c.away;
    if (!name) name = '—';
    var r = teamRate(name, kind);
    return '<div class="qm-panel">' +
      '<div class="qm-side">' + (side === 'H' ? 'HOME' : 'AWAY') + '</div>' +
      '<div class="qm-row" style="justify-content:center">' +
      '<div class="qm-chip' + (kind === 'club' ? ' on' : '') + '" data-qm="kind' + side + ':club">\ud83c\udfd9\ufe0f Club</div>' +
      '<div class="qm-chip' + (kind === 'nat' ? ' on' : '') + '" data-qm="kind' + side + ':nat">\ud83c\udf0d Selecci\u00f3n</div></div>' +
      '<div class="qm-teamname">' + name + '</div>' +
      '<div class="qm-crestbox"><div class="qm-arr qm-l" data-qmcy="' + side + ':-1">\u2039</div>' +
      crestOf(kind, name) + '<div class="qm-arr qm-r" data-qmcy="' + side + ':1">\u203a</div></div>' +
      '<div class="qm-stars">' + stars(r) + '</div>' +
      '<div class="qm-attrs"><span>ATT <b>' + r + '</b></span><span>MID <b>' + Math.max(40, r - 1) + '</b></span><span>DEF <b>' + Math.max(40, r - 2) + '</b></span></div>' +
      '<div class="qm-tipo">' + (kind === 'club' ? '\ud83c\udfd9\ufe0f Club profesional' : '\ud83c\udf0d Selecci\u00f3n nacional') + '</div></div>';
  }
  return '<div class="qm-card"><div class="qm-ea-top">\u26a1 PARTIDO R\u00c1PIDO \u00b7 ELIGE EQUIPOS</div><div class="qm-ea">' +
    panel('H') +
    '<div class="qm-center"><div class="qm-vs">VS</div><div class="qm-mode-tag">' + (c.mode === 'futsal' ? '\ud83c\udfd9\ufe0f FutSal' : '\u26bd F11') + '</div>' +
    '<div class="qm-meta-sm">IA ' + DIFFS[c.diff] + '</div><div class="qm-meta-sm">' + (c.mt / 60) + ' min \u00b7 mitad</div></div>' +
    panel('A') + '</div></div>';
}

function render() {
  css();
  var body = document.getElementById('qm-body');
  if (!body) return;
  var c = cfg();
  var isFut = c.mode === 'futsal';
  var venues = isFut ? ARENAS : STADS;
  body.innerHTML =
    /* modalidad */
    '<div class="qm-card"><div class="qm-h">⚡ Partido Rápido · Modalidad</div>' +
    '<div class="qm-modes">' +
    '<div class="qm-mode' + (!isFut ? ' on' : '') + '" data-qm="mode:f11"><b>⚽ Partido Normal</b><small>F11 · estadios · reglas a elegir</small></div>' +
    '<div class="qm-mode' + (isFut ? ' on' : '') + '" data-qm="mode:futsal"><b>🏟️ Modo FutSal</b><small>2v2–5v5 · arenas · paredes · gol de oro</small></div>' +
    '</div></div>' +
    /* equipos */
    eaCard(c) +
    /* evento oficial (solo F11) */
    (!isFut ? '<div class="qm-card"><div class="qm-h">🏆 Encuentro</div><div class="qm-grid2">' +
      FINALS.map(function (f) { return '<div class="qm-chip' + (c.event === f.k ? ' on' : '') + '" data-qm="event:' + f.k + '">' + f.n + '</div>'; }).join('') +
      '<div class="qm-chip' + (!c.event ? ' on' : '') + '" data-qm="event:">🤝 Amistoso libre</div>' +
      '</div><div style="margin-top:8px;font-size:.68rem;color:#8fa2cf">Finales y semifinales juegan con parche y reglamento oficial (hay dueño sí o sí: prórroga y penales).</div></div>' : '') +
    /* ajustes */
    '<div class="qm-card"><div class="qm-h">⚙️ Ajustes</div>' +
    '<div class="qm-grid2">' +
    '<div><div style="font-size:.68rem;color:#8fa2cf;margin-bottom:4px">🧠 Dificultad IA</div><select class="qm-sel" id="qm-diff">' +
    DIFFS.map(function (d, i) { return '<option value="' + i + '"' + (c.diff === i ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></div>' +
    '<div><div style="font-size:.68rem;color:#8fa2cf;margin-bottom:4px">⏱️ Minutos por mitad</div><select class="qm-sel" id="qm-mt">' +
    [2, 3, 4, 5].map(function (m) { return '<option value="' + (m * 60) + '"' + (c.mt === m * 60 ? ' selected' : '') + '>' + m + ' min</option>'; }).join('') + '</select></div>' +
    (isFut ? '<div><div style="font-size:.68rem;color:#8fa2cf;margin-bottom:4px">👥 Formato</div><select class="qm-sel" id="qm-side">' +
      [2, 3, 4, 5].map(function (n) { return '<option value="' + n + '"' + (c.side === n ? ' selected' : '') + '>' + n + 'v' + n + '</option>'; }).join('') + '</select></div>' +
      '<div><div style="font-size:.68rem;color:#8fa2cf;margin-bottom:4px">📜 Reglas FutSal</div><select class="qm-sel" id="qm-rules" disabled><option value="none" selected>⛔ Modo Sin Reglas (único)</option></select></div>'
    : '<div><div style="font-size:.68rem;color:#8fa2cf;margin-bottom:4px">📜 Reglas especiales</div><select class="qm-sel" id="qm-rules">' +
      [{ k: 'normal', n: 'Normal' }, { k: 'none', n: '⛔ Modo Sin Reglas' }, { k: 'x2', n: '🔥 Goles Lejanos VALEN x2' }].map(function (r) { return '<option value="' + r.k + '"' + (c.rules === r.k ? ' selected' : '') + '>' + r.n + '</option>'; }).join('') + '</select></div>' +
      '<div><div style="font-size:.68rem;color:#8fa2cf;margin-bottom:4px">🤝 ¿Y si hay empate?</div><select class="qm-sel" id="qm-tie">' +
      TIES.map(function (t) { return '<option value="' + t.k + '"' + (c.tie === t.k ? ' selected' : '') + '>' + t.n + '</option>'; }).join('') + '</select></div>') +
    '</div>' + (isFut ? '<div style="margin-top:8px;font-size:.68rem;color:#8fa2cf">🥇 En FutSal el empate se rompe con <b>Gol de Oro</b>. 🎧 "La Rueda" suena bajito todo el partido… y ruge en cada gol.</div>' : '') + '</div>' +
    /* sede */
    '<div class="qm-card"><div class="qm-h">' + (isFut ? '🏟️ Arena FutSal' : '🏟️ Estadio') + '</div>' +
    '<div class="qm-venues">' +
    venues.map(function (v) {
      var sel = (isFut ? c.arena : c.stad) === v.k;
      return '<div class="qm-ven' + (sel ? ' on' : '') + '" data-qm="' + (isFut ? 'arena:' : 'stad:') + v.k + '">' +
        '<div class="sw" style="' + venueSw(v, isFut) + '"></div><b>' + v.n + '</b><small>' + v.d + '</small>' +
        (isFut ? '<span class="qm-wall">' + (v.wall ? '🧱 paredes vivas' : '📭 bandas y córner') + '</span>' : '') + '</div>';
    }).join('') +
    '</div></div>' +
    '<button class="qm-btn" id="qm-go">⚡ JUGAR AHORA</button>';
  wire(body, c);
}

function wire(body, c) {
  function store() { putCfg(c); }
  body.querySelectorAll('[data-qm]').forEach(function (el) {
    el.onclick = function () {
      var kv = (el.getAttribute('data-qm') || '').split(':');
      var k = kv[0], v = kv[1];
      if (k === 'mode') { c.mode = v; if (v === 'futsal') c.rules = 'none'; }
      else if (k === 'kindH' || k === 'kindA') { c[k] = v; c[k === 'kindH' ? 'home' : 'away'] = ''; }
      else c[k] = v;
      store(); render();
    };
  });
  body.querySelectorAll('[data-qmcy]').forEach(function (el) {
    el.setAttribute('role', 'button');
    el.onclick = function () {
      var kv = (el.getAttribute('data-qmcy') || '').split(':');
      cycle(kv[0], +kv[1]);
    };
  });
  function sel(id, k, num) {
    var s = document.getElementById(id); if (!s) return;
    s.onchange = function () { c[k] = num ? (+s.value) : s.value; store(); };
  }
  sel('qm-diff', 'diff', true);
  sel('qm-mt', 'mt', true); sel('qm-rules', 'rules'); sel('qm-tie', 'tie'); sel('qm-side', 'side', true);
  var go = document.getElementById('qm-go');
  if (go) go.onclick = function () {
    if (!c.home) c.home = defPick(listFor(c.kindH), 'FC Barcelona');
    if (!c.away) c.away = defPick(listFor(c.kindA), 'Real Madrid');
    if (c.away === c.home) c.away = listFor(c.kindA).filter(function (n) { return n !== c.home; })[0] || '';
    if (!c.home || !c.away) { toast('Elige ambos equipos'); return; }
    if (c.home === c.away) { toast('Elige dos equipos distintos'); return; }
    launch(c);
  };
}

/* ── ajustes compartidos (Carrera Manager) ───────────────────────────── */
function renderSettings() {
  var box = document.getElementById('tab-system');
  if (!box || document.getElementById('qm-set-card')) return;
  css();
  var st = settings();
  var card = document.createElement('div');
  card.id = 'qm-set-card'; card.className = 'qm-card'; card.style.marginTop = '12px';
  card.innerHtml = '';
  card.innerHTML =
    '<div class="qm-h">⏱️ Ajustes de partido (Carrera + QR)</div>' +
    '<div class="qm-grid2">' +
    '<div><div style="font-size:.68rem;color:#8fa2cf;margin-bottom:4px">Minutos por mitad</div>' +
    '<select class="qm-sel" id="qms-mt">' + [2, 3, 4, 5].map(function (m) {
      return '<option value="' + (m * 60) + '"' + (st.mt === m * 60 ? ' selected' : '') + '>' + m + ' min</option>';
    }).join('') + '</select></div>' +
    '<div><div style="font-size:.68rem;color:#8fa2cf;margin-bottom:4px">Amistoso empatado</div>' +
    '<select class="qm-sel" id="qms-tie">' + TIES.map(function (t) {
      return '<option value="' + t.k + '"' + (st.tie === t.k ? ' selected' : '') + '>' + t.n + '</option>';
    }).join('') + '</select></div></div>' +
    '<div style="margin-top:8px;font-size:.68rem;color:#8fa2cf">⏱️ Prórrogas y penales SIEMPRE se juegan en cancha en Carrera y QR.</div>';
  box.appendChild(card);
  var s1 = document.getElementById('qms-mt'), s2 = document.getElementById('qms-tie');
  var write = function () { save(SET_KEY, { mt: s1 ? +s1.value : 240, tie: s2 ? s2.value : 'et' }); toast('⏱️ Ajustes guardados'); };
  if (s1) s1.onchange = write; if (s2) s2.onchange = write;
}

/* ── autoinyección del modo en el MENÚ PRINCIPAL (el caché móvil no gana dos veces) │
   Si el HTML viejo no trae la tarjeta, se siembra junto a TORNEOS. ──────────────── */
function ensureTab() {
  if (typeof document === 'undefined' || !document.querySelector) return;
  try {
    if (!document.getElementById('qm-menu-btn')) {
      var t = document.querySelector('.fc-menu-grid button[onclick*="TorneosUI"]');
      if (t && t.parentNode) {
        var b = document.createElement('button');
        b.className = 'fc-btn fc-btn-wide'; b.id = 'qm-menu-btn';
        b.setAttribute('style', 'border-color:rgba(255,150,50,.6);background:linear-gradient(100deg,rgba(255,150,50,.16),rgba(245,60,120,.08));box-shadow:0 0 24px rgba(255,150,50,.14)');
        b.setAttribute('onclick', 'QUICKMATCH.open()');
        b.innerHTML = '⚡ PARTIDO RÁPIDO<small>¡NUEVO MODO! Amistosos, finales oficiales y FutSal (2v2–5v5 con arenas y paredes)</small>';
        t.parentNode.insertBefore(b, t.nextSibling);
      }
    }
  } catch (e) {}
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { ensureTab(); });
  else ensureTab();
}

return {
  DIFFS: DIFFS, STADS: STADS, ARENAS: ARENAS, TIES: TIES, FINALS: FINALS, NATIONS: NATIONS,
  clubsList: clubsList, rosterClub: rosterClub, rosterNation: rosterNation,
  autoXI: autoXI, teamRatingOf: teamRatingOf, colours: colorsOf, colorsOf: colorsOf,
  buildURL: buildURL, launch: launch, close: close,
  render: render, renderSettings: renderSettings, ensureTab: ensureTab, openTab: openTab,
  open: open, closeOverlay: closeOverlay,
  cfg: cfg, settings: settings,
  cycle: cycle, crestOf: crestOf, listFor: listFor, teamRate: teamRate, defPick: defPick
};
});
