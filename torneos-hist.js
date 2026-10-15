/* ═══════════════════════════════════════════════════════════════════════════
   TORNEOS · HISTORIA & PRÓXIMAS EDICIONES v1.0
   ─────────────────────────────────────────────────────────────────────────
   · Todas las ediciones desde la 1ª, con su formato y sus equipos/selecciones.
   · Selecciones: campos COMPLETOS. Clubes: campeón/final/semis por edición +
     plantilla completa en la fundacional y la moderna.
   · Genera la SIGUIENTE edición: anfitrión y clasificados por 🥇 RANKING
     o 🎲 ALEATORIO (reales si juega en el modo Torneos).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  var H = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = H;
  root.TORNHIST = factory ? H : H;
  if (root !== H) root.TORNHIST = H;
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

/* nombre + poder base (ranking FIFA-ish, para el sorteo 🥇) */
function NT(name, r, conf) { return { kind: 'sel', name: name, r: r, conf: conf }; }

/* ══════════════════ COPA MUNDIAL FIFA (1930 → hoy) ══════════════════ */
var MUNDIAL = [
 { y: 1930, host: 'Uruguay', fmt: '13 invitadas · 4 grupos + semifinales y final', field: ['Uruguay','Argentina','Brasil','Chile','Estados Unidos','México','Perú','Paraguay','Bolivia','Francia','Rumania','Yugoslavia','Bélgica'] },
 { y: 1934, host: 'Italia', fmt: '16 plazas · copa directa desde octavos', field: ['Italia','Checoslovaquia','Alemania','Austria','España','Hungría','Suiza','Suecia','Argentina','Francia','Países Bajos','Rumania','Egipto','Brasil','Bélgica','Estados Unidos'] },
 { y: 1938, host: 'Francia', fmt: '15 plazas (Austria se retiró anexada) · copa directa', field: ['Italia','Hungría','Brasil','Suecia','Checoslovaquia','Suiza','Francia','Bélgica','Alemania','Noruega','Polonia','Rumania','Países Bajos','Cuba','Indias Orientales Holandesas'] },
 { y: 1950, host: 'Brasil', fmt: '13 plazas · grupos; UN grupo final en vez de final definida', field: ['Uruguay','Brasil','Suecia','España','Inglaterra','Chile','Estados Unidos','Paraguay','Italia','Suiza','Yugoslavia','Bolivia','México'] },
 { y: 1954, host: 'Suiza', fmt: '16 plazas · grupos + cuartos', field: ['Alemania Federal','Hungría','Austria','Uruguay','Suiza','Brasil','Escocia','Inglaterra','Francia','Italia','México','Turquía','Bélgica','Corea del Sur','Checoslovaquia','Yugoslavia'] },
 { y: 1958, host: 'Suecia', fmt: '16 plazas · grupos + cuartos', field: ['Brasil','Suecia','Francia','Alemania Federal','Gales','Unión Soviética','Irlanda del Norte','Yugoslavia','Argentina','Austria','Inglaterra','Hungría','México','Paraguay','Escocia','Checoslovaquia'] },
 { y: 1962, host: 'Chile', fmt: '16 plazas · grupos + cuartos', field: ['Brasil','Checoslovaquia','Chile','Yugoslavia','Hungría','Unión Soviética','Argentina','Bulgaria','Colombia','Alemania Federal','España','Inglaterra','Italia','México','Suiza','Uruguay'] },
 { y: 1966, host: 'Inglaterra', fmt: '16 plazas · grupos + cuartos', field: ['Inglaterra','Alemania Federal','Portugal','Unión Soviética','Argentina','Hungría','Uruguay','Corea del Norte','Italia','Bulgaria','España','Brasil','México','Suiza','Francia','Chile'] },
 { y: 1970, host: 'México', fmt: '16 plazas · grupos + cuartos', field: ['Brasil','Italia','Alemania Federal','Uruguay','Unión Soviética','México','Perú','Inglaterra','Suecia','Bélgica','Bulgaria','Checoslovaquia','Israel','Marruecos','Rumania','El Salvador'] },
 { y: 1974, host: 'Alemania Federal', fmt: '16 plazas · 2ª fase de grupos + final', field: ['Alemania Federal','Países Bajos','Polonia','Brasil','Suecia','Alemania Democrática','Yugoslavia','Argentina','Italia','Escocia','Bulgaria','Chile','Uruguay','Zaire','Haití','Australia'] },
 { y: 1978, host: 'Argentina', fmt: '16 plazas · 2ª fase de grupos + final', field: ['Argentina','Países Bajos','Brasil','Italia','Polonia','Alemania Federal','Austria','Perú','Túnez','España','Escocia','Francia','Suecia','Irán','Hungría','México'] },
 { y: 1982, host: 'España', fmt: '24 plazas · grupos + 2ª fase de grupos + semis', field: ['Italia','Alemania Federal','Polonia','Francia','Brasil','Inglaterra','Unión Soviética','Austria','Irlanda del Norte','España','Argentina','Hungría','Checoslovaquia','Yugoslavia','Bélgica','Uruguay','Argelia','Camerún','Honduras','Chile','El Salvador','Kuwait','Nueva Zelanda','Perú'] },
 { y: 1986, host: 'México', fmt: '24 plazas · grupos + octavos', field: ['Argentina','Alemania Federal','Francia','Bélgica','Brasil','México','España','Inglaterra','Unión Soviética','Italia','Uruguay','Dinamarca','Paraguay','Polonia','Bulgaria','Portugal','Hungría','Escocia','Argelia','Canadá','Corea del Sur','Irak','Marruecos','Irlanda del Norte'] },
 { y: 1990, host: 'Italia', fmt: '24 plazas · grupos + octavos', field: ['Alemania Federal','Argentina','Italia','Inglaterra','Yugoslavia','Checoslovaquia','Irlanda','Camerún','España','Bélgica','Brasil','Uruguay','Países Bajos','Rumania','Escocia','Suecia','Unión Soviética','Colombia','Costa Rica','Austria','Emiratos Árabes','Egipto','Estados Unidos','Corea del Sur'] },
 { y: 1994, host: 'Estados Unidos', fmt: '24 plazas · grupos + octavos', field: ['Brasil','Italia','Suecia','Bulgaria','Alemania','Rumania','Países Bajos','España','Nigeria','Argentina','Bélgica','Arabia Saudita','México','Estados Unidos','Suiza','Irlanda','Camerún','Colombia','Bolivia','Noruega','Rusia','Grecia','Marruecos','Corea del Sur'] },
 { y: 1998, host: 'Francia', fmt: '32 plazas · 8 grupos de 4 + octavos', field: ['Francia','Brasil','Croacia','Países Bajos','Italia','Argentina','Alemania','Dinamarca','Inglaterra','Rumania','México','Nigeria','Noruega','Chile','España','Marruecos','Bélgica','Irán','Colombia','Jamaica','Austria','Bulgaria','Camerún','Yugoslavia','Japón','Estados Unidos','Arabia Saudita','Corea del Sur','Escocia','Sudáfrica','Paraguay','Túnez'] },
 { y: 2002, host: 'Corea del Sur · Japón', fmt: '32 plazas · 8 grupos + octavos', field: ['Brasil','Alemania','Turquía','Corea del Sur','España','Inglaterra','Senegal','Estados Unidos','Japón','Dinamarca','Suecia','México','Portugal','Irlanda','Italia','Bélgica','Arabia Saudita','Argentina','Camerún','China','Costa Rica','Croacia','Ecuador','Francia','Nigeria','Paraguay','Polonia','Rusia','Eslovenia','Sudáfrica','Túnez','Uruguay'] },
 { y: 2006, host: 'Alemania', fmt: '32 plazas · 8 grupos + octavos', field: ['Italia','Francia','Alemania','Portugal','Brasil','Argentina','Inglaterra','Ucrania','España','Suiza','Países Bajos','México','Costa Rica','Ecuador','Costa de Marfil','Croacia','Suecia','Polonia','Angola','Arabia Saudita','Australia','Gana','Irán','Japón','Corea del Sur','Paraguay','República Checa','Serbia y Montenegro','Trinidad y Tobago','Túnez','Estados Unidos'] },
 { y: 2010, host: 'Sudáfrica', fmt: '32 plazas · 8 grupos + octavos', field: ['España','Países Bajos','Alemania','Uruguay','Argentina','Brasil','Paraguay','Ghana','Chile','Portugal','México','Corea del Sur','Inglaterra','Italia','Francia','Grecia','Suiza','Dinamarca','Eslovenia','Estados Unidos','Argelia','Australia','Serbia','Nigeria','Camerún','Costa de Marfil','Honduras','Sudáfrica','Japón','Eslovaquia','Nueva Zelanda','Corea del Norte'] },
 { y: 2014, host: 'Brasil', fmt: '32 plazas · 8 grupos + octavos', field: ['Alemania','Argentina','Países Bajos','Brasil','Colombia','Bélgica','Francia','Costa Rica','Chile','México','Suiza','Uruguay','Grecia','Italia','España','Costa de Marfil','Nigeria','Argelia','Rusia','Corea del Sur','Australia','Camerún','Croacia','Ecuador','Ghana','Honduras','Irán','Japón','Portugal','Bosnia y Herzegovina','Inglaterra'] },
 { y: 2018, host: 'Rusia', fmt: '32 plazas · 8 grupos + octavos', field: ['Francia','Croacia','Bélgica','Inglaterra','Uruguay','Brasil','Suecia','Rusia','Colombia','España','Dinamarca','México','Portugal','Suiza','Japón','Argentina','Senegal','Egipto','Nigeria','Alemania','Panamá','Túnez','Arabia Saudita','Australia','Islandia','Costa Rica','Serbia','Polonia','Corea del Sur','Irán','Marruecos','Perú'] },
 { y: 2022, host: 'Qatar', fmt: '32 plazas · 8 grupos + octavos', field: ['Argentina','Francia','Croacia','Marruecos','Países Bajos','Inglaterra','Brasil','Portugal','España','Japón','Suiza','México','Polonia','Corea del Sur','Australia','Bélgica','Alemania','Dinamarca','Túnez','Camerún','Gales','Canadá','Qatar','Ecuador','Ghana','Serbia','Uruguay','Arabia Saudita','Iran','Senegal','Estados Unidos','Costa Rica'] },
 { y: 2026, host: 'México · Canadá · Estados Unidos', fmt: '48 plazas · 12 grupos de 4 + dieciseisavos', field: ['México','Canadá','Estados Unidos','Argentina','Brasil','Francia','España','Inglaterra','Alemania','Italia','Portugal','Países Bajos','Uruguay','Colombia','Bélgica','Croacia','Suiza','Austria','Polonia','Suecia','Noruega','Dinamarca','Turquía','Serbia','Ucrania','Marruecos','Senegal','Japón','Corea del Sur','Australia','Irán','Arabia Saudita','Qatar','Ecuador','Paraguay','Chile','Perú','Venezuela','Bolivia','Costa Rica','Panamá','Jamaica','Honduras','El Salvador','Ghana','Nigeria','Egipto','Nueva Zelanda','Curazao','Haití'] }
];

/* ══════════════════ EUROCOPA (1960 → hoy) ══════════════════ */
var EURO = [
 { y: 1960, host: 'Francia', fmt: '4 finalistas tras eliminatorias · semis + final', field: ['Unión Soviética','Yugoslavia','Checoslovaquia','Francia'] },
 { y: 1964, host: 'España', fmt: '4 finalistas · semis + final', field: ['España','Unión Soviética','Hungría','Dinamarca'] },
 { y: 1968, host: 'Italia', fmt: '4 finalistas · semis + final', field: ['Italia','Yugoslavia','Inglaterra','Unión Soviética'] },
 { y: 1972, host: 'Bélgica', fmt: '4 finalistas · semis + final', field: ['Alemania Federal','Unión Soviética','Bélgica','Hungría'] },
 { y: 1976, host: 'Yugoslavia', fmt: '4 finalistas · semis + final', field: ['Checoslovaquia','Alemania Federal','Países Bajos','Yugoslavia'] },
 { y: 1980, host: 'Italia', fmt: '8 selecciones · 2 grupos + final', field: ['Alemania Federal','Bélgica','Italia','Hungría','Países Bajos','Inglaterra','Checoslovaquia','Grecia','España'] },
 { y: 1984, host: 'Francia', fmt: '8 selecciones · 2 grupos + semis y final', field: ['Francia','España','Dinamarca','Portugal','Bélgica','Rumania','Alemania Federal','Yugoslavia'] },
 { y: 1988, host: 'Alemania Federal', fmt: '8 selecciones · 2 grupos + semis y final', field: ['Países Bajos','Unión Soviética','Italia','Alemania Federal','España','Irlanda','Dinamarca','Inglaterra'] },
 { y: 1992, host: 'Suecia', fmt: '8 selecciones · 2 grupos + semis y final', field: ['Dinamarca','Alemania','Suecia','Países Bajos','Escocia','CEI (URSS)','Francia','Inglaterra'] },
 { y: 1996, host: 'Inglaterra', fmt: '16 selecciones · 4 grupos + cuartos', field: ['Alemania','República Checa','Inglaterra','Francia','Portugal','Croacia','España','Italia','Rumania','Dinamarca','Turquía','Bulgaria','Rusia','Escocia','Suiza','Países Bajos'] },
 { y: 2000, host: 'Bélgica · Países Bajos', fmt: '16 selecciones · 4 grupos + cuartos', field: ['Francia','Italia','Países Bajos','Portugal','España','Turquía','Yugoslavia','Rumania','Inglaterra','Alemania','Bélgica','Dinamarca','Eslovenia','República Checa','Noruega','Suecia'] },
 { y: 2004, host: 'Portugal', fmt: '16 selecciones · 4 grupos + cuartos', field: ['Grecia','Portugal','República Checa','Países Bajos','Inglaterra','Francia','Suecia','Dinamarca','Alemania','Croacia','Italia','España','Letonia','Bulgaria','Rusia','Suiza'] },
 { y: 2008, host: 'Austria · Suiza', fmt: '16 selecciones · 4 grupos + cuartos', field: ['España','Alemania','Turquía','Rusia','Países Bajos','Italia','Croacia','Portugal','Francia','Suiza','Austria','Grecia','Suecia','Polonia','Rumania','República Checa'] },
 { y: 2012, host: 'Polonia · Ucrania', fmt: '16 selecciones · 4 grupos + cuartos', field: ['España','Italia','Alemania','Portugal','Inglaterra','Francia','Croacia','Grecia','República Checa','Ucrania','Irlanda','Polonia','Rusia','Suecia','Dinamarca','Países Bajos'] },
 { y: 2016, host: 'Francia', fmt: '24 selecciones · 6 grupos + mejores terceros', field: ['Portugal','Francia','Alemania','Gales','Inglaterra','Bélgica','Italia','Croacia','España','Islandia','Irlanda','Polonia','Suiza','Hungría','Irlanda del Norte','Eslovaquia','Rumania','Turquía','Albania','Ucrania','Suecia','Rusia','Austria','República Checa'] },
 { y: 2020, host: 'Pan-europea (Londres la final)', fmt: '24 selecciones · 6 grupos + mejores terceros', field: ['Italia','Inglaterra','España','Dinamarca','Bélgica','República Checa','Suiza','Ucrania','Austria','Croacia','Gales','Escocia','Países Bajos','Alemania','Portugal','Francia','Suecia','Finlandia','Polonia','Rusia','Macedonia del Norte','Hungría','Turquía','Eslovaquia'] },
 { y: 2024, host: 'Alemania', fmt: '24 selecciones · 6 grupos + mejores terceros', field: ['España','Inglaterra','Francia','Países Bajos','Alemania','Portugal','Suiza','Turquía','Italia','Austria','Georgia','Bélgica','Eslovaquia','Rumania','Eslovenia','Dinamarca','Croacia','Albania','Polonia','Escocia','Serbia','República Checa','Hungría','Ucrania'] }
];

/* ══════════════════ COPA AMÉRICA (1916 → hoy) ══════════════════ */
var COPA_AMERICA = [
 { y: 1916, host: 'Argentina', fmt: '4 invitadas · liga a una vuelta', field: ['Uruguay','Argentina','Brasil','Chile'] },
 { y: 1917, host: 'Uruguay', fmt: '4 invitadas · liga a una vuelta', field: ['Uruguay','Argentina','Brasil','Chile'] },
 { y: 1919, host: 'Brasil', fmt: '4 invitadas · liga a una vuelta', field: ['Brasil','Uruguay','Argentina','Chile'] },
 { y: 1920, host: 'Chile', fmt: '4 invitadas · liga a una vuelta', field: ['Uruguay','Argentina','Chile','Brasil'] },
 { y: 1921, host: 'Argentina', fmt: '4 invitadas · liga a una vuelta', field: ['Argentina','Brasil','Uruguay','Paraguay'] },
 { y: 1922, host: 'Brasil', fmt: '5 invitadas · liga a una vuelta', field: ['Brasil','Uruguay','Argentina','Paraguay','Chile'] },
 { y: 1923, host: 'Uruguay', fmt: '4 invitadas · liga a una vuelta', field: ['Uruguay','Argentina','Brasil','Paraguay'] },
 { y: 1924, host: 'Uruguay', fmt: '4 invitadas · liga a una vuelta', field: ['Uruguay','Argentina','Paraguay','Chile'] },
 { y: 1925, host: 'Argentina', fmt: '3 invitadas · liga a una vuelta', field: ['Argentina','Brasil','Paraguay'] },
 { y: 1926, host: 'Chile', fmt: '5 invitadas · liga a una vuelta', field: ['Uruguay','Brasil','Argentina','Chile','Bolivia'] },
 { y: 1927, host: 'Perú', fmt: '4 invitadas · liga a una vuelta', field: ['Argentina','Uruguay','Perú','Bolivia'] },
 { y: 1929, host: 'Perú', fmt: '4 invitadas · liga a una vuelta', field: ['Argentina','Uruguay','Perú','Paraguay'] },
 { y: 1935, host: 'Perú', fmt: '4 invitadas · liga a una vuelta', field: ['Uruguay','Perú','Chile','Argentina'] },
 { y: 1937, host: 'Perú', fmt: '6 invitadas · liga a una vuelta', field: ['Argentina','Brasil','Uruguay','Perú','Paraguay','Chile'] },
 { y: 1939, host: 'Perú', fmt: '5 invitadas · liga a una vuelta', field: ['Brasil','Argentina','Perú','Uruguay','Paraguay'] },
 { y: 1941, host: 'Perú', fmt: '5 invitadas · liga a una vuelta', field: ['Argentina','Chile','Perú','Uruguay','Bolivia'] },
 { y: 1942, host: 'Chile', fmt: '7 invitadas · liga a una vuelta', field: ['Chile','Argentina','Uruguay','Bolivia','Brasil','Perú','Paraguay'] },
 { y: 1945, host: 'Chile', fmt: '7 invitadas · liga a una vuelta', field: ['Argentina','Brasil','Chile','Uruguay','Bolivia','Perú','Paraguay'] },
 { y: 1946, host: 'Argentina', fmt: '6 invitadas · liga a una vuelta', field: ['Argentina','Brasil','Chile','Uruguay','Perú','Bolivia'] },
 { y: 1947, host: 'Colombia', fmt: '7 invitadas · liga a una vuelta', field: ['Argentina','Uruguay','Chile','Brasil','Paraguay','Perú','Bolivia'] },
 { y: 1949, host: 'Brasil', fmt: '6 invitadas · liga a una vuelta', field: ['Brasil','Argentina','Uruguay','Paraguay','Chile','Perú'] },
 { y: 1953, host: 'Perú', fmt: '7 invitadas · liga a una vuelta', field: ['Paraguay','Brasil','Uruguay','Perú','Chile','Bolivia','Argentina'] },
 { y: 1955, host: 'Chile', fmt: '6 invitadas · liga a una vuelta', field: ['Chile','Argentina','Brasil','Uruguay','Perú','Paraguay'] },
 { y: 1956, host: 'Brasil', fmt: '5 invitadas · liga a una vuelta', field: ['Uruguay','Argentina','Brasil','Perú','Paraguay'] },
 { y: 1957, host: 'Perú', fmt: '6 invitadas · liga a una vuelta', field: ['Brasil','Argentina','Perú','Uruguay','Chile','Paraguay'] },
 { y: 1959, host: 'Argentina (1ª del año)', fmt: '4 invitadas · liga a una vuelta', field: ['Uruguay','Argentina','Brasil','Chile'] },
 { y: 1960, host: 'Ecuador (2ª del año)', fmt: '4 invitadas · liga a una vuelta', field: ['Uruguay','Brasil','Chile','Ecuador'] },
 { y: 1963, host: 'Bolivia', fmt: '6 invitadas · liga a una vuelta', field: ['Bolivia','Argentina','Brasil','Chile','Perú','Paraguay'] },
 { y: 1967, host: 'Uruguay', fmt: '6 invitadas · liga a una vuelta', field: ['Uruguay','Argentina','Chile','Brasil','Perú','Bolivia'] },
 { y: 1975, host: 'Sin sede fija (idA/vuelta)', fmt: '10 selecciones · grupos + semis estilo copa', field: ['Perú','Brasil','Argentina','Uruguay','Chile','Colombia','Paraguay','Bolivia','Ecuador','Venezuela'] },
 { y: 1979, host: 'Sin sede fija (idA/vuelta)', fmt: '10 selecciones · grupos + semis', field: ['Argentina','Brasil','Uruguay','Chile','Colombia','Paraguay','Perú','Bolivia','Ecuador','Venezuela'] },
 { y: 1983, host: 'Sin sede fija (idA/vuelta)', fmt: '10 selecciones · grupos + semis', field: ['Uruguay','Brasil','Argentina','Chile','Colombia','Perú','Paraguay','Bolivia','Ecuador','Venezuela'] },
 { y: 1987, host: 'Argentina', fmt: '10 selecciones · 2 grupos + semis', field: ['Uruguay','Chile','Argentina','Colombia','Brasil','Paraguay','Perú','Ecuador','Bolivia','Venezuela'] },
 { y: 1989, host: 'Brasil', fmt: '10 selecciones · 2 grupos + semis y final', field: ['Brasil','Uruguay','Argentina','Paraguay','Chile','Colombia','Perú','Bolivia','Venezuela'] },
 { y: 1991, host: 'Chile', fmt: '10 selecciones · 2 grupos + cuadro final de 4', field: ['Brasil','Uruguay','Chile','Colombia','Argentina','Perú','Ecuador','Paraguay','Bolivia','Venezuela'] },
 { y: 1993, host: 'Ecuador', fmt: '12 (+México y EE.UU. invitados) · 3 grupos + cuartos', field: ['Argentina','Colombia','Brasil','Chile','Uruguay','Paraguay','Perú','Bolivia','Ecuador','Venezuela','México','Estados Unidos'] },
 { y: 1995, host: 'Uruguay', fmt: '12 (+ en el nombre y el campo) · 3 grupos + cuartos', field: ['Uruguay','Brasil','Argentina','Colombia','Chile','Paraguay','Perú','Bolivia','Ecuador','Venezuela','México','Estados Unidos'] },
 { y: 1997, host: 'Bolivia', fmt: '12 · 3 grupos + cuartos', field: ['Brasil','Bolivia','México','Colombia','Argentina','Chile','Uruguay','Perú','Paraguay','Ecuador','Venezuela','Estados Unidos'] },
 { y: 1999, host: 'Paraguay', fmt: '12 · 3 grupos + cuartos', field: ['Uruguay','Brasil','México','Paraguay','Argentina','Chile','Colombia','Perú','Bolivia','Ecuador','Venezuela','Jamaica'] },
 { y: 2001, host: 'Colombia', fmt: '12 · 3 grupos + cuartos (seguridad: EE.UU. se bajó)', field: ['Colombia','Honduras','Brasil','Argentina','Chile','Uruguay','Perú','Paraguay','México','Ecuador','Venezuela','Panamá'] },
 { y: 2004, host: 'Perú', fmt: '12 · 3 grupos + cuartos', field: ['Brasil','Argentina','Chile','Colombia','Perú','Uruguay','Paraguay','Bolivia','Ecuador','Venezuela','México','Costa Rica'] },
 { y: 2007, host: 'Venezuela', fmt: '12 · 3 grupos + cuartos', field: ['Brasil','Argentina','Uruguay','Chile','Paraguay','Colombia','Ecuador','Bolivia','Perú','Venezuela','México','Jamaica'] },
 { y: 2011, host: 'Argentina', fmt: '12 · 3 grupos + cuartos', field: ['Uruguay','Argentina','Brasil','Paraguay','Chile','Perú','Colombia','Bolivia','Ecuador','Venezuela','México','Costa Rica'] },
 { y: 2015, host: 'Chile', fmt: '12 · 3 grupos + cuartos', field: ['Chile','Argentina','Colombia','Perú','Brasil','Uruguay','Paraguay','Bolivia','Ecuador','Venezuela','Jamaica','México'] },
 { y: 2016, host: 'Estados Unidos (centenario)', fmt: '16 · 4 grupos + cuartos', field: ['Chile','Argentina','Colombia','Perú','Brasil','Paraguay','Uruguay','Ecuador','México','Costa Rica','Jamaica','Panamá','Estados Unidos','Venezuela','Bolivia','Haití'] },
 { y: 2019, host: 'Brasil', fmt: '12 (Japón y Qatar invitados) · 3 grupos + cuartos', field: ['Brasil','Perú','Argentina','Colombia','Chile','Uruguay','Paraguay','Ecuador','Bolivia','Venezuela','Japón','Qatar'] },
 { y: 2021, host: 'Brasil (emergencia por pandemia)', fmt: '10 burbuja · 2 grupos + cuartos', field: ['Argentina','Brasil','Colombia','Chile','Uruguay','Ecuador','Perú','Paraguay','Venezuela','Bolivia'] },
 { y: 2024, host: 'Estados Unidos', fmt: '16 · 4 grupos + cuartos', field: ['Argentina','Colombia','Uruguay','Brasil','Chile','Perú','Ecuador','México','Costa Rica','Jamaica','Panamá','Estados Unidos','Paraguay','Bolivia','Venezuela','Canadá'] }
];

/* ═════════ COPA ORO CONCACAF (Campeonato 1963–1989 + Copa Oro 1991→) ═════════ */
var COPA_ORO = [
 { y: 1963, host: 'El Salvador', fmt: '9 del área · 2 grupos + final', field: ['Costa Rica','El Salvador','Honduras','Guatemala','Panamá','Nicaragua','Antillas Neerlandesas','Jamaica','Trinidad y Tobago'] },
 { y: 1965, host: 'Guatemala', fmt: '6 del área · liga', field: ['México','Guatemala','Costa Rica','El Salvador','Honduras','Haití'] },
 { y: 1967, host: 'Honduras', fmt: '6 del área · liga', field: ['México','Guatemala','Honduras','El Salvador','Haití','Nicaragua'] },
 { y: 1969, host: 'Costa Rica', fmt: '6 del área · liga', field: ['Costa Rica','Guatemala','México','Antillas Neerlandesas','Honduras','Trinidad y Tobago'] },
 { y: 1971, host: 'Trinidad y Tobago', fmt: '6 del área · liga', field: ['México','Haití','Costa Rica','Cuba','Honduras','Trinidad y Tobago'] },
 { y: 1973, host: 'Haití', fmt: '6 del área · liga', field: ['Haití','Trinidad y Tobago','México','Honduras','Guatemala','Jamaica'] },
 { y: 1977, host: 'México', fmt: '6 del área · liga', field: ['México','Haití','El Salvador','Nicaragua','Guatemala','Surinam'] },
 { y: 1981, host: 'Surinam', fmt: '6 del área · liga', field: ['Honduras','El Salvador','Costa Rica','Guatemala','Haití','Surinam'] },
 { y: 1985, host: 'Sin sede fija', fmt: '9 del área · 3 grupos + final round', field: ['Canadá','Estados Unidos','México','Guatemala','Jamaica','Haití','Costa Rica','Honduras','Surinam'] },
 { y: 1989, host: 'Sin sede fija', fmt: '5 del área · liga', field: ['Estados Unidos','Costa Rica','Honduras','México','Guatemala'] },
 { y: 1991, host: 'Estados Unidos', fmt: '8 · 2 grupos + semis', field: ['Estados Unidos','México','Costa Rica','Honduras','Canadá','Guatemala','Haití','Jamaica'] },
 { y: 1993, host: 'Estados Unidos', fmt: '8 · 2 grupos + semis', field: ['México','Estados Unidos','Costa Rica','Jamaica','Honduras','Canadá','Martinica','Haití'] },
 { y: 1996, host: 'Estados Unidos', fmt: '9 · 3 grupos + semis (Brasil invitado)', field: ['México','Brasil','Guatemala','Estados Unidos','Honduras','Costa Rica','Jamaica','Trinidad y Tobago','El Salvador'] },
 { y: 1998, host: 'Estados Unidos', fmt: '10 · 3 grupos + semis (Brasil invitado)', field: ['Estados Unidos','Brasil','México','Jamaica','Costa Rica','Honduras','Panamá','Trinidad y Tobago','El Salvador','Cuba'] },
 { y: 2000, host: 'Estados Unidos', fmt: '12 · 4 grupos + cuartos (Brasil, Perú, Corea invitados)', field: ['México','Estados Unidos','Costa Rica','Canadá','Trinidad y Tobago','Jamaica','Brasil','Perú','Corea del Sur','Honduras','Panamá','Haití'] },
 { y: 2002, host: 'Estados Unidos', fmt: '12 · 4 grupos + cuartos (Corea invitada)', field: ['Estados Unidos','México','Canadá','Costa Rica','Haití','Trinidad y Tobago','Panamá','Honduras','Guadalupe','Martinica','El Salvador','Corea del Sur'] },
 { y: 2003, host: 'EE.UU. · México', fmt: '12 · 4 grupos + cuartos (Brasil y Colombia invitados)', field: ['México','Estados Unidos','Brasil','Colombia','Canadá','Costa Rica','Honduras','Guadalupe','Jamaica','Panamá','El Salvador','Martinica'] },
 { y: 2005, host: 'Estados Unidos', fmt: '12 · 4 grupos + cuartos', field: ['México','Canadá','Estados Unidos','Costa Rica','Honduras','Panamá','Jamaica','Trinidad y Tobago','Guadalupe','Martinica','El Salvador','Surinam'] },
 { y: 2007, host: 'Estados Unidos', fmt: '12 · 4 grupos + cuartos', field: ['Estados Unidos','México','Canadá','Honduras','Panamá','Costa Rica','Jamaica','Trinidad y Tobago','Guadalupe','El Salvador','Martinica','Surinam'] },
 { y: 2009, host: 'Estados Unidos', fmt: '12 · 4 grupos + cuartos', field: ['México','Costa Rica','Estados Unidos','Honduras','Panamá','Canadá','Jamaica','Trinidad y Tobago','Haití','Nicaragua','El Salvador','Martinica'] },
 { y: 2011, host: 'Estados Unidos', fmt: '12 · 4 grupos + cuartos', field: ['México','Estados Unidos','Honduras','Canadá','Costa Rica','Panamá','Jamaica','Guadalupe','Martinica','El Salvador','Trinidad y Tobago','Nicaragua'] },
 { y: 2013, host: 'Estados Unidos', fmt: '12 · 4 grupos + cuartos', field: ['Estados Unidos','Panamá','Honduras','México','Costa Rica','Canadá','Trinidad y Tobago','El Salvador','Haití','Cuba','Guadalupe','Martinica'] },
 { y: 2015, host: 'EE.UU. · Canadá', fmt: '12 · 4 grupos + cuartos', field: ['México','Jamaica','Estados Unidos','Honduras','Costa Rica','Panamá','Trinidad y Tobago','Canadá','El Salvador','Haití','Cuba','Guadalupe'] },
 { y: 2017, host: 'Estados Unidos', fmt: '12 · 4 grupos + cuartos', field: ['México','Jamaica','Estados Unidos','Costa Rica','Honduras','Canadá','Guadalupe','Martinica','El Salvador','Haití','Nicaragua','Curazao'] },
 { y: 2019, host: 'EE.UU. · Costa Rica', fmt: '16 · 4 grupos + cuartos', field: ['México','Estados Unidos','Haití','Jamaica','Canada','Honduras','Curazao','Martinica','Panamá','Bermudas','Cuba','Surinam','Nicaragua','Trinidad y Tobago','Guayana'] },
 { y: 2021, host: 'Estados Unidos', fmt: '16 · 4 grupos + cuartos', field: ['Estados Unidos','México','Canadá','Jamaica','Haití','Honduras','Costa Rica','Panamá','Martinica','Guadalupe','Trinidad y Tobago','Nicaragua','Surinam','Granada','Guyana'] },
 { y: 2023, host: 'EE.UU. · Canadá', fmt: '16 · 4 grupos + cuartos', field: ['México','Panamá','Estados Unidos','Canadá','Jamaica','Honduras','Costa Rica','Haití','Guadalupe','Martinica','Curazao','Surinam','Granada','Trinidad y Tobago','Barbados','Kitts y Nevis'] }
];

/* ═════════ NATIONS LEAGUE UEFA + CONCACAF (2019 → hoy) ═════════ */
var NATIONS_U = [
 { y: '2018/19', host: 'Final Four en Portugal', fmt: '55 por niveles + final four', field: ['Países Bajos','Inglaterra','Portugal','Suiza'] },
 { y: '2020/21', host: 'Final Four en Italia', fmt: '55 por niveles + final four', field: ['España','Francia','Italia','Bélgica'] },
 { y: '2022/23', host: 'Final Four en Países Bajos', fmt: '55 por niveles + final four', field: ['Países Bajos','Croacia','España','Italia'] },
 { y: '2024/25', host: 'Final Four por definir', fmt: '55 por niveles + final four', field: ['Portugal','España','Italia','Alemania'] }
];
var NATIONS_C = [
 { y: '2019/20', host: 'Final Four en Denver', fmt: '41 por niveles + final four', field: ['México','Estados Unidos','Canadá','Honduras','Costa Rica','Jamaica'] },
 { y: '2022/23', host: 'Final Four en Las Vegas', fmt: '41 por niveles + final four', field: ['Estados Unidos','Canadá','México','Jamaica','Honduras','Panamá'] },
 { y: '2023/24', host: 'Final Four por definir', fmt: '41 por niveles + final four', field: ['Estados Unidos','México','Panamá','Jamaica','Honduras','Costa Rica'] },
 { y: '2024/25', host: 'Final Four por definir', fmt: '41 por niveles + final four', field: ['México','Estados Unidos','Honduras','Canadá','Panamá','Jamaica'] }
];

/* ══════════ CLUBES: campeón / finalista por edición (semilleros claros) ══════════ */
function E2(y, champ, runner, note, fmt) { return { y: y, champ: champ, runner: runner, note: note || '', fmt: fmt || '' }; }
var CHAMPIONS = [
 E2(1956, 'Real Madrid','Stade de Reims','16 invitados de honor: Madrid, Reims, Milan, Hibernian, Djurgården, Partizan, Rapid Viena, Anderlecht, Servette, Saarbrücken, MTK Budapest, Gwardia Varsovia, Rot-Weiss Essen, AGF Aarhus, PSV, Slovan Bratislava','Copa directa ida y vuelta + final única'),
 E2(1957, 'Real Madrid','Fiorentina'), E2(1958, 'Real Madrid','AC Milan'), E2(1959, 'Real Madrid','Stade de Reims'),
 E2(1960, 'Real Madrid','Eintracht Frankfurt','7-3 en Hampden: la final de todas las finales'),
 E2(1961, 'Benfica','FC Barcelona'), E2(1962, 'Benfica','Real Madrid'), E2(1963, 'AC Milan','Benfica'),
 E2(1964, 'Inter','Real Madrid'), E2(1965, 'Inter','Benfica'), E2(1966, 'Real Madrid','Partizan Belgrado'),
 E2(1967, 'Celtic','Inter','los Leones de Lisboa'), E2(1968, 'Manchester United','Benfica'),
 E2(1969, 'AC Milan','Ajax'), E2(1970, 'Feyenoord','Celtic'), E2(1971, 'Ajax','Panathinaikos'),
 E2(1972, 'Ajax','Inter'), E2(1973, 'Ajax','Juventus','triplete del Total Football'),
 E2(1974, 'Bayern Múnich','Atlético de Madrid'), E2(1975, 'Bayern Múnich','Leeds United'),
 E2(1976, 'Bayern Múnich','Saint-Étienne'), E2(1977, 'Liverpool','Borussia Mönchengladbach'),
 E2(1978, 'Liverpool','Club Brugge'), E2(1979, 'Nottingham Forest','Malmö'), E2(1980, 'Nottingham Forest','Hamburgo'),
 E2(1981, 'Liverpool','Real Madrid'), E2(1982, 'Aston Villa','Bayern Múnich'), E2(1983, 'Hamburgo','Juventus'),
 E2(1984, 'Liverpool','Roma','penales en el Olímpico'), E2(1985, 'Juventus','Liverpool','negra noche de Heysel'),
 E2(1986, 'Steaua Bucarest','FC Barcelona','penales: el Barça de Urruti'), E2(1987, 'Oporto','Bayern Múnich'),
 E2(1988, 'PSV','Benfica'), E2(1989, 'AC Milan','Steaua Bucarest'), E2(1990, 'AC Milan','Benfica'),
 E2(1991, 'Estrella Roja','Olympique'), E2(1992, 'FC Barcelona','Sampdoria','la última Copa de Europa'),
 E2(1993, 'Olympique Marseille','AC Milan','nace la Champions League'),
 E2(1994, 'AC Milan','FC Barcelona'), E2(1995, 'Ajax','AC Milan'), E2(1996, 'Juventus','Ajax','penales'),
 E2(1997, 'Borussia Dortmund','Juventus'), E2(1998, 'Real Madrid','Juventus'),
 E2(1999, 'Manchester United','Bayern Múnich','el triplete de los minutos 90+'),
 E2(2000, 'Real Madrid','Valencia','24 equipos con 2ª fase de grupos'),
 E2(2001, 'Bayern Múnich','Valencia','penales'), E2(2002, 'Real Madrid','Bayer Leverkusen','la volea de Zidane'),
 E2(2003, 'AC Milan','Juventus','penales en Old Trafford'), E2(2004, 'Oporto','Mónaco'),
 E2(2005, 'Liverpool','AC Milan','El Milagro de Estambul'), E2(2006, 'FC Barcelona','Arsenal'),
 E2(2007, 'AC Milan','Liverpool'), E2(2008, 'Manchester United','Chelsea','noche de penales en Moscú'),
 E2(2009, 'FC Barcelona','Manchester United'), E2(2010, 'Inter','Bayern Múnich','triplete de Mourinho'),
 E2(2011, 'FC Barcelona','Manchester United'), E2(2012, 'Chelsea','Bayern Múnich','penales en Múnich'),
 E2(2013, 'Bayern Múnich','Borussia Dortmund'), E2(2014, 'Real Madrid','Atlético de Madrid','La Décima, minuto 93'),
 E2(2015, 'FC Barcelona','Juventus'), E2(2016, 'Real Madrid','Atlético de Madrid','penales: La Undécima'),
 E2(2017, 'Real Madrid','Juventus','La Duodécima en Cardiff'), E2(2018, 'Real Madrid','Liverpool','La Decimotercera en Kiev'),
 E2(2019, 'Liverpool','Tottenham'), E2(2020, 'Bayern Múnich','PSG','final 8 en Lisboa (COVID)'),
 E2(2021, 'Chelsea','Manchester City'), E2(2022, 'Real Madrid','Liverpool','La Decimocuarta'),
 E2(2023, 'Manchester City','Inter'), E2(2024, 'Real Madrid','Borussia Dortmund','La Decimoquinta'),
 E2(2025, 'PSG','Inter','era formato de liga: 36 equipos · 8 jornadas','Liga única de 36 · 8 jornadas + play-offs')
];
var LIBERTADORES = [
 E2(1960, 'Peñarol','Olimpia','7 clubes fundadores'), E2(1961, 'Peñarol','Palmeiras'), E2(1962, 'Santos','Peñarol','el Santos de Pelé'),
 E2(1963, 'Santos','Boca Juniors'), E2(1964, 'Independiente','Nacional'), E2(1965, 'Independiente','Peñarol'),
 E2(1966, 'Peñarol','River Plate'), E2(1967, 'Racing','Nacional'), E2(1968, 'Estudiantes LP','Palmeiras'),
 E2(1969, 'Estudiantes LP','Nacional'), E2(1970, 'Estudiantes LP','Peñarol'), E2(1971, 'Nacional','Estudiantes LP'),
 E2(1972, 'Independiente','Universitario'), E2(1973, 'Independiente','Colo Colo'), E2(1974, 'Independiente','São Paulo'),
 E2(1975, 'Independiente','Unión Española'), E2(1976, 'Cruzeiro','River Plate'), E2(1977, 'Boca Juniors','Cruzeiro'),
 E2(1978, 'Boca Juniors','Deportivo Cali'), E2(1979, 'Olimpia','Boca Juniors'), E2(1980, 'Nacional','Internacional'),
 E2(1981, 'Flamengo','Cobreloa'), E2(1982, 'Peñarol','Cobreloa'), E2(1983, 'Grêmio','Peñarol'),
 E2(1984, 'Independiente','Grêmio'), E2(1985, 'Argentinos Juniors','América de Cali'), E2(1986, 'River Plate','América de Cali'),
 E2(1987, 'Peñarol','América de Cali'), E2(1988, 'Nacional','Newells'), E2(1989, 'Atlético Nacional','Olimpia'),
 E2(1990, 'Olimpia','Barcelona SC'), E2(1991, 'Colo Colo','Olimpia'), E2(1992, 'São Paulo','Newells'),
 E2(1993, 'São Paulo','U Católica'), E2(1994, 'Vélez','São Paulo'), E2(1995, 'Grêmio','Atlético Nacional'),
 E2(1996, 'River Plate','América de Cali'), E2(1997, 'Cruzeiro','Sporting Cristal'), E2(1998, 'Vasco da Gama','Barcelona SC'),
 E2(1999, 'Palmeiras','Deportivo Cali'), E2(2000, 'Boca Juniors','Palmeiras'), E2(2001, 'Boca Juniors','Cruz Azul'),
 E2(2002, 'Olimpia','São Caetano'), E2(2003, 'Boca Juniors','Santos'), E2(2004, 'Once Caldas','Boca Juniors'),
 E2(2005, 'São Paulo','Athletico Paranaense'), E2(2006, 'Internacional','São Paulo'), E2(2007, 'Boca Juniors','Grêmio'),
 E2(2008, 'LDU Quito','Fluminense','penales: primera de Ecuador'), E2(2009, 'Estudiantes LP','Cruzeiro'),
 E2(2010, 'Internacional','Chivas'), E2(2011, 'Santos','Peñarol'), E2(2012, 'Corinthians','Boca Juniors'),
 E2(2013, 'Atlético Mineiro','Olimpia','comeback del Gauchito'), E2(2014, 'San Lorenzo','Nacional (Paraguay)'),
 E2(2015, 'River Plate','Tigres'), E2(2016, 'Atlético Nacional','Independiente del Valle'),
 E2(2017, 'Grêmio','Lanús'), E2(2018, 'River Plate','Boca Juniors','la final del siglo en Madrid'),
 E2(2019, 'Flamengo','River Plate','los dos goles del Gabigol'), E2(2020, 'Palmeiras','Santos'),
 E2(2021, 'Palmeiras','Flamengo','prórroga'), E2(2022, 'Flamengo','Athletico Paranaense'),
 E2(2023, 'Fluminense','Boca Juniors','prórroga en el Maracaná'), E2(2024, 'Botafogo','Atlético Mineiro'),
 E2(2025, '— definir —','— definir —','próxima edición: genérala con ranking o al azar')
];
var CONCA = [
 E2(1962, 'Guadalajara','Comunicaciones'), E2(1963, 'Racing de Haití','Guadalajara'), E2(1967, 'Alianza','Jong Colombia'),
 E2(1968, 'Toluca','Aurora'), E2(1969, 'Cruz Azul','Comunicaciones'), E2(1970, 'Cruz Azul','Saprissa'),
 E2(1971, 'Cruz Azul','Alajuelense'), E2(1972, 'Olimpia','Robin Hood'), E2(1973, 'Transvaal','Saprissa'),
 E2(1975, 'Atlético Español','Transvaal'), E2(1976, 'Águila','Robin Hood'), E2(1977, 'América','Robin Hood'),
 E2(1978, 'Comunicaciones','Leones del Norte'), E2(1979, 'FAS','Jong Colombia'), E2(1980, 'Pumas UNAM','Robin Hood'),
 E2(1981, 'Transvaal','Atlético Marte'), E2(1982, 'Pumas UNAM','Robin Hood'), E2(1983, 'Atlante','Robin Hood'),
 E2(1984, 'Violette','FAS'), E2(1986, 'Alajuelense','Transvaal'), E2(1987, 'América','Defence Force'),
 E2(1988, 'Olimpia','Defence Force'), E2(1989, 'Pumas UNAM','Pinar del Río'), E2(1990, 'América','Pinar del Río'),
 E2(1991, 'Puebla','Police'), E2(1992, 'América','Alajuelense'), E2(1993, 'Saprissa','León'),
 E2(1994, 'Cartaginés','Atlante'), E2(1995, 'Saprissa','Municipal'), E2(1996, 'Cruz Azul','Necaxa'),
 E2(1997, 'Cruz Azul','LA Galaxy'), E2(1998, 'DC United','Toluca'), E2(1999, 'Necaxa','Alajuelense'),
 E2(2000, 'LA Galaxy','Olimpia'), E2(2002, 'Pachuca','Morelia'), E2(2003, 'Toluca','Morelia'),
 E2(2004, 'Alajuelense','Saprissa'), E2(2005, 'Saprissa','Pumas UNAM'), E2(2006, 'América','Toluca'),
 E2(2007, 'Pachuca','Guadalajara'), E2(2008, 'Pachuca','Saprissa'), E2(2009, 'Atlante','Cruz Azul'),
 E2(2010, 'Pachuca','Cruz Azul'), E2(2011, 'Monterrey','Real Salt Lake'), E2(2012, 'Monterrey','Santos Laguna'),
 E2(2013, 'Monterrey','Olimpia'), E2(2014, 'Cruz Azul','Toluca'), E2(2015, 'América','Saprissa'),
 E2(2016, 'América','Tigres'), E2(2018, 'Guadalajara','Toronto'), E2(2019, 'Monterrey','Tigres'),
 E2(2020, 'Tigres','LAFC'), E2(2021, 'Monterrey','América'), E2(2022, 'Seattle Sounders','Pumas UNAM'),
 E2(2023, 'León','LAFC'), E2(2024, 'Cruz Azul','Columbus Crew'), E2(2025, 'Pachuca','Inter Miami')
];
/* funciones de apoyo para el paseo histórico */
function edList(key) {
  var db = COMPS[key]; return db ? db.editions : [];
}
function fmtOf(key, ed) {
  return ed.fmt || (COMPS[key] && COMPS[key].fmtDefault) || '';
}

/* ══════════ COMPS maestro ══════════ */
var COMPS = {
 mundial: { name: 'Copa Mundial FIFA', icon: '🌍', type: 'nat', cadence: 4, next: 2030, nextHost: 'España · Marruecos · Portugal', editions: MUNDIAL },
 euro: { name: 'Eurocopa', icon: '🏆', type: 'nat', cadence: 4, next: 2028, nextHost: 'Inglaterra · Irlanda · Escocia · Gales', editions: EURO },
 copaamerica: { name: 'Copa América', icon: '🏟️', type: 'nat', cadence: 3, next: 2028, nextHost: 'Por sortear (CONMEBOL)', editions: COPA_AMERICA },
 coporo: { name: 'Copa Oro', icon: '🥇', type: 'nat', cadence: 2, next: 2025, nextHost: 'EE.UU. · Canadá (oficial)', editions: COPA_ORO },
 nationsU: { name: 'Nations League UEFA', icon: '🌐', type: 'nat', cadence: 2, next: '2026/27', editions: NATIONS_U, years: true },
 nationsC: { name: 'Nations League CONCACAF', icon: '🌎', type: 'nat', cadence: 2, next: '2026/27', editions: NATIONS_C, years: true },
 champions: { name: 'UEFA Champions League', icon: '🌟', type: 'club', cadence: 1, next: 2026, editions: CHAMPIONS },
 libertadores: { name: 'Copa Libertadores', icon: '🌎', type: 'club', cadence: 1, next: 2026, editions: LIBERTADORES },
 concacaf: { name: 'Concachampions', icon: '🦅', type: 'club', cadence: 1, next: 2026, editions: CONCA }
};
/* alias de cortesía: 'copa Oro' también se lee al revés */
COMPS.copaoro = COMPS.coporo;

/* ══════════════ RANKINGS (orden 🥇 de cada competición) ══════════════ */
var NAT_POWER = [
 ['España',90],['Argentina',89],['Francia',89],['Inglaterra',88],['Brasil',87],['Portugal',87],['Países Bajos',86],['Italia',86],['Alemania',85],['Uruguay',85],['Colombia',84],['Croacia',84],['Bélgica',84],['Suiza',83],['México',82],['Marruecos',82],['Japón',82],['Senegal',81],['Estados Unidos',81],['Checoslovaquia',79],['Dinamarca',81],['Turquía',81],['Suecia',80],['Polonia',80],['Chile',79],['Perú',78],['Ecuador',79],['Paraguay',78],['Venezuela',75],['Bolivia',72],['Austria',81],['Ucrania',79],['Serbia',79],['Noruega',80],['Escocia',77],['Gales',76],['República Checa',78],['Grecia',76],['Eslovaquia',76],['Eslovenia',76],['Macedonia del Norte',73],['Georgia',77],['Bosnia y Herzegovina',75],['Hungría',77],['Rumania',77],['Islandia',73],['Irlanda',75],['Irlanda del Norte',74],['Finlandia',73],['Bielorrusia',71],['Estonia',67],['Letonia',70],['Lituania',70],['Luxemburgo',72],['Malta',66],['Qatar',76],['Corea del Sur',79],['Irán',79],['Arabia Saudita',77],['Australia',76],['Nigeria',80],['Egipto',78],['Costa de Marfil',78],['Argelia',78],['Túnez',77],['Ghana',76],['Camerún',77],['Sudáfrica',73],['Nueva Zelanda',72],['Canadá',76],['Estados Unidos? no dup',80],['Jamaica',75],['Panamá',75],['Haití',73],['Curazao',72],['Trinidad y Tobago',73],['Barbados',69],['Cuba',71],['Martinica',72],['Guadalupe',73],['Nicaragua',72],['El Salvador',72],['Guatemala',73],['Surinam',71],['Granada',70],['Kitts y Nevis',68],['Bermudas',68],['Guyana',70],['Dominica',66],['Angola',74],['Mali',77],['Burkina Faso',75],['Cabo Verde',75],['Guinea',74],['Zambia',73],['Zimbabue',70],['Congo',71],['RD Congo',73],['Uganda',72],['Kenia',69],['Tanzania',70],['Ruanda',69],['Madagascar',70],['Emiratos Árabes',72],['Iraq',73],['Jordania',72],['Uzbekistán',74],['Oman',72],['Barein',71],['Kuwait',69],['Líbano',68],['Siria',70],['India',68],['Vietnam',72],['Tailandia',72],['Indonesia',70],['Malasia',71],['Singapur',68],['Filipinas',68],['China',73],['Corea del Norte',69],['Mongolia',63],['Laos',64],['Camboya',65],['Timor Oriental',63],['Belice',69],['Islas Vírgenes',63],['Anguila',63],['Santa Lucía',66],['Dominica? no dup',66],['San Vicente y las Granadinas',67],['Azores? no real',60]
];
NAT_POWER = NAT_POWER.filter(function(x){ return x[0].indexOf('?') < 0; });
function natRankField(n) {
  return NAT_POWER.slice().sort(function(a, b){ return b[1] - a[1]; }).slice(0, n || 48).map(function(x){ return NT(x[0], x[1]); });
}
var CLUB_POWER = [
 ['Real Madrid',91],['Manchester City',89],['Bayern Múnich',88],['PSG',87],['Inter',87],['FC Barcelona',87],['Arsenal',85],['Liverpool',86],['Bayer Leverkusen',84],['Atlético de Madrid',86],['Borussia Dortmund',84],['Juventus',84],['AC Milan',84],['Napoli',83],['Benfica',84],['Oporto',83],['Sporting CP',83],['Ajax',82],['PSV',81],['Feyenoord',81],['Chelsea',84],['Tottenham',83],['Manchester United',84],['Newcastle',83],['Aston Villa',82],['Roma',82],['Lazio',81],['Atalanta',82],['Fiorentina',81],['RB Leipzig',82],['Eintracht Frankfurt',80],['Villarreal',81],['Real Sociedad',81],['Sevilla',82],['Athletic Club',81],['Valencia',79],['Betis',80],['Getafe',78],['Girona',79],['Celtic',79],['Rangers',78],['Galatasaray',81],['Fenerbahçe',81],['Besiktas',78],['Olympiacos',79],['PAOK',77],['AEK',77],['Copenhague',77],['Molde',75],['Bodø/Glimt',77],['Estrella Roja',78],['Dinamo Zagreb',79],['Shakhtar',79],['Dynamo Kyiv',76],['Cruzeiro',80],['Flamengo',84],['Palmeiras',84],['São Paulo',82],['Corinthians',82],['Grêmio',82],['Internacional',82],['Atlético Mineiro',82],['Fluminense',82],['Botafogo',82],['Fortaleza',80],['Bragantino',79],['River Plate',83],['Boca Juniors',82],['Racing',81],['Independiente',80],['San Lorenzo',80],['Estudiantes LP',80],['Vélez',80],['Argentinos Juniors',80],['Gimnasia LP',79],['Instituto',78],['Newells Old Boys',79],['Rosario Central',79],['Tigres',81],['Monterrey',81],['América (MEX)',82],['Chivas',80],['Cruz Azul',81],['Pumas UNAM',79],['Toluca',79],['León',79],['Pachuca',80],['Santos Laguna',78],['LA Galaxy',79],['Seattle Sounders',79],['Inter Miami',82],['Atlanta United',79],['NY City FC',79],['LAFC',79],['Olimpia',80],['Motagua',79],['Saprissa',80],['Alajuelense',79],['Comunicaciones',78],['Tauro',77],['Al Nasar',79],['Al Hilal',83],['Al Ittihad',79],['Al Nassr',80],['Urawa Reds',78],['Kashima',77],['Jeonbuk',77],['Ulsan',77],['Al Ahly',81],['Zamalek',79],['Wydad',79],['Esperance',79],['Raja',78],['Mamelodi',78],['Orlando Pirates',76],['Auckland City',75]
];
CLUB_POWER = CLUB_POWER.filter(function(x){ return x[0].indexOf('?') < 0; });
function clubRankField(n) {
  return CLUB_POWER.slice().sort(function(a, b){ return b[1] - a[1]; }).slice(0, n || 32).map(function(x){ return { kind: 'club', name: x[0], r: x[1] }; });
}

/* ══════════════ API pública de HISTORIA ══════════════ */
function summary(key) {
  var c = COMPS[key]; if (!c) return null;
  return { key: key, name: c.name, icon: c.icon, type: c.type, editions: c.editions.length,
           first: c.editions[0] && c.editions[0].y, last: c.editions[c.editions.length - 1] && c.editions[c.editions.length - 1].y,
           next: c.next, nextHost: c.nextHost || null };
}
function edition(key, idx) {
  var c = COMPS[key]; if (!c) return null;
  idx = (idx == null) ? c.editions.length - 1 : Math.max(0, Math.min(c.editions.length - 1, idx | 0));
  var e = c.editions[idx];
  return { key: key, idx: idx, year: e.y, host: e.host || null, fmt: e.fmt || c.fmtDefault || 'formato clásico',
           field: e.field || null, champ: e.champ || null, runner: e.runner || null, note: e.note || '' };
}

/* 🪄 campo para la SIGUIENTE edición: ranking o al azar */
function nextField(key, mode, n) {
  var c = COMPS[key]; if (!c) return [];
  n = n || (Math.max(8, ((c.editions[c.editions.length - 1] || {}).field || []).length));
  var pool = (c.type === 'club') ? clubRankField(64) : natRankField(120);
  if (mode === 'rank') return pool.slice(0, n);
  /* aleatorio — baraja limpia */
  var sh = pool.slice(), out = [];
  while (out.length < n && sh.length) { out.push(sh.splice((Math.random() * sh.length) | 0, 1)[0]); }
  return out;
}

return {
  COMPS: COMPS, summary: summary, edition: edition,
  nextField: nextField, natRankField: natRankField, clubRankField: clubRankField,
  MUNDIAL: MUNDIAL, EURO: EURO, COPA_AMERICA: COPA_AMERICA, COPA_ORO: COPA_ORO,
  NATIONS_U: NATIONS_U, NATIONS_C: NATIONS_C, CHAMPIONS: CHAMPIONS, LIBERTADORES: LIBERTADORES, CONCA: CONCA
};
});
