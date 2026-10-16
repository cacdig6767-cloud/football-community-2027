/* ═══ FC 2027 · press-bank.js — 🎙️ PRESSBANK: banco de ruedas de prensa ═══
   Miles de preguntas CONTEXTUALES (sobre TU club / TU jugador, nunca humo ajeno):
   · PRESSBANK.mgrQS(d) → banco del Mánager (Press, index.html)  [opts: t/morale/conf/fb]
   · PRESSBANK.plQS(d)  → banco del Jugador (NEWSHUB.pressPlayer) [opts: t/fb/mo]
   d (mgr): {club, rival, star, joven, veterano, goleador, liga, mister, conf, ronda}
   d (pl):  {me, club, rival, pos, edad, liga, nota}                                        */
(function(){
'use strict';
if (window.PRESSBANK) return;
function R(n){ return Math.floor(Math.random() * n); }
function pick(a){ return a[R(a.length)]; }
function fill(t, d){
  return String(t).replace(/\{(\w+)\}/g, function(m, k){
    var v = d && d[k];
    return (v == null || v === '') ? m : v;
  });
}
var MEDIOS = ['Marca Total','El Estadio','Gol Diario','La Pizarra','El Banquillo','Directo Radio','TV Deporte+','El Silbato','Crónica 90','Portal FC','La Tribuna','Radio Grada','Diario Campo','Canal Gol','El Marcador','Maratonazo TV','Zona Mixta Radio','Grada Norte','Liga Total TV','El Descuento','Poste Izquierdo','Cadena Copa','Fútbol+Hoy','Diario del Mediocampo'];
var PERIOD = ['Martín Rojas','Lucía Ferrer','Andrés Cano','Vera Montes','Pablo Iniesta','Carmen Soler','Nico Aranda','Julia Reyes','Óscar Beltrán','Sara Fuentes','Tomás Aguilar','Marta Núñez','Diego Salas','Elena Duarte','Bruno Vera','Rita Campos','Iker Sotelo','Paula Mendieta','Raúl Camacho','Lidia Paredes','Gonzalo Fuertes','Aitana Cuadra','Marco Salas','Nerea Bravo'];
function pre(){ return '🎙️ ' + pick(PERIOD) + ' (' + pick(MEDIOS) + '): «'; }
function fin(){ return '»'; }

/* ═══════════ MÁNAGER — [ctx, [v1,v2,v3], [[t,fb,morale,conf],×3]] ═══════════ */
var MG = [
/* ─────────────── CRISIS (derrota / mala racha / directiva fría) ─────────────── */
['crisis',[
 'Llevan varias jornadas sin ganar: ¿no teme que el {club} se quede sin margen?',
 'Otra tarde gris del {club} en {liga}. ¿Por dónde se empieza a levantar esto, míster?',
 'La clasificación aprieta y el {club} vuelve a fallar. ¿Qué se está rompiendo?'],
 [['El escudo del {club} exige y eso nos hace grandes','La sala admite el gesto: discurso de líder.',2,1],
  ['El que quiera bajarse del barco, que se baje ya','Mano dura. A la directiva le gusta; al vestuario, menos.',0,2],
  ['Ustedes pónganse cómodos, nosotros vamos a trabajar','Bronca con la prensa. Ambiente tenso.',-1,-2]]],
['crisis',[
 'La afición del {club} pitó al equipo en el descanso. ¿Qué les responde?',
 'Se oyeron pitos claros contra el {club} hoy. ¿Exceso de exigencia o realidad?',
 'La grada se impacienta con el {club}. ¿Le duele escucharlo?'],
 [['Les debemos una y lo sabemos: van a tener respuesta','Humildad que abraza a la grada.',2,1],
  ['La afición del {club} siempre empuja: hoy necesitamos ese empuje','Mensaje de unión. La curva asiente.',1,1],
  ['Que piten a mí, no a mis jugadores','Escudo público que el vestuario agradece.',3,0]]],
['crisis',[
 '¿Sigue teniendo el vestuario del {club} de su parte, míster?',
 'Se rumorea que el grupo ya no le responde. ¿Es así en el {club}?',
 'Hay quien dice que su discurso ya no llega. ¿Se siente respaldado por la plantilla?'],
 [['El grupo está conmigo a muerte, y eso se va a notar','El vestuario aplaude la defensa pública.',3,1],
  ['Las dudas se resuelven ganando, no hablando','Frase dura pero realista.',1,1],
  ['Pregunta trampa. Siguiente','Desplante seco: la prensa no perdona.',-2,-3]]],
['crisis',[
 '¿Teme por su puesto tras este resultado en el {club}?',
 'La directiva del {club} guardó silencio esta semana. ¿Le llegó el respaldo?',
 'Muchos ya hablan de su sucesor. ¿Cómo se digiere eso?'],
 [['Solo pienso en el próximo partido del {club}','Calma profesional. Baja el humo.',2,1],
  ['Mi trabajo y la historia del {club} hablan por mí','Suena a orgullo en mal momento.',0,-2],
  ['La directiva sabe el proyecto que tiene entre manos','Mensaje interno que la sala interpreta a favor.',1,2]]],
['crisis',[
 'Los cambios que hizo no movieron el partido. ¿Se equivocó en la lectura?',
 'Sus sustituciones volvieron a llegar tarde, dicen los analistas. ¿Está de acuerdo?',
 '¿Por qué no se atrevió antes con las variantes desde el banquillo?'],
 [['El entrenador que se equivoca y lo admite mejora: me toca a mí','Autocrítica sana. Suma respeto.',1,2],
  ['Cambiar ese partido era como girar un barco: pedí paciencia','Defensa técnica que la sala compra.',1,0],
  ['Si se los explico de pizarra, ustedes escriben otra cosa','Chispazo que enfría la sala.',-1,-1]]],
['crisis',[
 '{star} hoy volvió a pasar desapercibido. ¿Qué le pasa a su estrella?',
 'El {club} necesitó a {star} y no apareció. ¿Se lo reclamó en privado?',
 'Se nota la falta de liderazgo de {star} en los días malos, ¿no?'],
 [['A mis jugadores los defiendo en público SIEMPRE: {star} dará la cara','Defensa total. El grupo se crece.',3,1],
  ['{star} es humano: trabajará el doble esta semana','Gestión inteligente de la figura.',1,1],
  ['El fútbol es de todos, no de un nombre','Frase correcta pero tibia.',0,0]]],
['crisis',[
 'La confianza de la directiva ronda el {conf} sobre 100. ¿Se siente cuestionado?',
 '¿Le transmite la junta del {club} la misma calma que muestra usted?',
 'Con la directiva al {conf}% de respaldo, ¿cuánto margen le queda?'],
 [['Los números de respaldo no entrenan: yo entreno','Zasca elegante. Sonrisas en sala.',1,0],
  ['Hablo con la junta a diario: el proyecto del {club} está firme','Mensaje de estabilidad que gusta arriba.',1,2],
  ['Pregúntenle a ellos, yo mando en el campo','Frialdad que genera titulares.',-1,-2]]],
['crisis',[
 '¿Le ha pasado por la cabeza dimitir del {club}?',
 'Hay entrenadores que en su situación ya habrían renunciado. ¿Y usted?',
 '¿Se considera parte del problema o de la solución del {club}?'],
 [['De la solución, y lo voy a demostrar con resultados','Pecho al ruedo. El vestuario reacciona.',2,1],
  ['Dimitir nunca fue una palabra del {club}','Orgullo de la casa que conecta con la grada.',2,1],
  ['No responderé a provocaciones de taberna','Enroque inútil. La nota sube de tono.',-1,-1]]],
['crisis',[
 'El {club} encajó demasiado esta temporada. ¿El problema es el sistema o las piernas?',
 'Los goles en contra se repiten por el mismo lado. ¿No da tiempo a corregirlo en la semana?',
 '¿Toca replantearse el dibujo defensivo del {club}?'],
 [['El gol en contra casi siempre es cadena: ajustamos toda la línea','Análisis sobrio. Tranquilidad.',1,1],
  ['El dibujo no concede: las segundas jugadas sí. Manos a la obra','Justificación técnica razonable.',1,0],
  ['Si ustedes ven el fallo tan claro, vénganse al entreno','Salida de tono que incomoda.',-1,-1]]],
['crisis',[
 'Algunos aficionados del {club} pedían cabezas a la salida. ¿Merece usted la crítica?',
 'Hubo pancartas pidiendo cambios en la grada. ¿Las vio?',
 'La paciencia social del {club} parece agotarse. ¿Cómo se para eso?'],
 [['La crítica la acepto y la convierto en trabajo: prometido','Compromiso público. Baja revoluciones.',2,1],
  ['Las pancartas se tapan ganando el domingo','Directo y claro. La sala asiente.',1,1],
  ['Aquí nadie da clases de sentimiento','Respuesta agria que no ayuda.',-1,0]]],
['crisis',[
 'El calendario del {club} es de locos. ¿Cuánto pesa la carga en los resultados?',
 '¿Cree que la fatiga explica el bajón del {club} o es solo excusa?',
 'Tres competiciones, mismos onces. ¿Rotará más o morirá con los suyos?'],
 [['La carga existe, pero no es excusa: arriba el nivel','Responsabilidad primero. La directiva valora.',1,1],
  ['Rotaremos con cabeza: la temporada del {club} es larga','Alivio para los suplentes.',1,1],
  ['Que se quejen los rivales, que también viajan','Mal tono, peor titular.',-1,0]]],
['crisis',[
 'El {club} lleva una sequía de gol preocupante. ¿Falta nueve o falta idea?',
 '¿Por qué le cuesta tanto al {club} convertir sus ocasiones?',
 'Mucho balón y poco gol: ¿qué falta en el último pase?'],
 [['El gol es hijo del fútbol: el fútbol vuelve antes que el marcador','Filosofía que la sala respeta.',1,1],
  ['Esta semana entrenaremos definición hasta que el balón pida basta','Plan claro. Buen titular.',2,1],
  ['Si fuera fácil, ustedes lo harían','Soberbio. Silencio incómodo.',-1,0]]],
['crisis',[
 'La temporada pasada el {club} volaba y hoy sufre. ¿Qué cambió de verdad?',
 'Se compara este {club} con el de la temporada gloriosa. ¿Es justa la comparación?',
 '¿Echa de menos a los futbolistas que se fueron del {club}?'],
 [['Cada temporada es un mundo: este grupo escribirá la suya','Cierre de debate elegante.',1,1],
  ['Los que se fueron fueron; los que están son mi orgullo','Defensa del grupo actual.',2,0],
  ['La comparación la hacen ustedes, no el vestuario','Corte a los medios.',0,0]]],
['crisis',[
 'El próximo partido es contra {rival}. ¿Es final o fuego lo que viene?',
 '¿Es {rival} el partido más difícil que podía tocarles ahora?',
 'Contra {rival} no valen medias tintas. ¿Sorpresas en el once?'],
 [['Contra {rival} saldremos a por los tres puntos, sin miedo','Declaración de guerra contenida.',2,1],
  ['Hay que respetar a {rival}, pero el {club} no se esconde jamás','Respeto y orgullo en la medida justa.',1,1],
  ['El once lo sabrá {rival} el día del partido','Cierre de pizarra. Risas flojas.',0,0]]],
/* ─────────────── GLORY (exhibición / título / racha) ─────────────── */
['glory',[
 '¡Exhibición del {club}! ¿Es este el mejor equipo de {liga} ahora mismo?',
 '¿Puede alguien parar a este {club} cuando juega así?',
 'Partidazo total del {club}. ¿Soñó usted alguna vez un tramo así?'],
 [['Vamos partido a partido: la soberbia mata proyectos','Humildad de campeón. Marco de sala.',1,2],
  ['Que nos paren si pueden','El vestuario se crece… y los rivales toman nota.',3,-1],
  ['El mérito es de los jugadores del {club}, no mío','Los jugadores darían la vida por usted.',3,1]]],
['glory',[
 '¿Ya se atreve a pronunciar la palabra título en el {club}?',
 'La afición ya canta campeón. ¿Les frena usted o les acompaña?',
 'Con esta ventaja, ¿es el {club} favorito al título de {liga}?'],
 [['Queda una eternidad de temporada','Pies en el suelo. Aplauso del sentido común.',1,2],
  ['El {club} nació para pelearlo todo','Ambición con escudo. La grada lo compra.',2,1],
  ['El título será nuestro destino','Sobrecarga de presión gratuita.',2,-2]]],
['glory',[
 'Hable de {star}: ¿está ante la mejor versión de su carrera?',
 '¿Qué le dice a {star} cuando juega así de suelto?',
 '{star} vuelve a salir en todas las portadas. ¿Cómo se gestiona esa fama?'],
 [['{star} es feliz en el {club} y cuando es feliz, es imparable','Caricia pública que la estrella agradece.',3,1],
  ['{star} trabaja más de lo que brilla: ese es el secreto','Mensaje de cultura de trabajo.',2,1],
  ['Que brille: para eso le pagamos','El grupo celebra la naturalidad.',2,0]]],
['glory',[
 'Racha histórica del {club}. ¿Conoce el récord que tiene al alcance?',
 '¿Le quita el sueño la marca o vive el presente del {club}?',
 'Están escribiendo páginas del club. ¿Se lo recuerda al grupo?'],
 [['Los récords se celebran en mayo, no en la sala de prensa','Cabezas frías. El mensaje cala.',1,2],
  ['Que la historia la cuente la grada: nosotros a seguir','Respeto a la afición.',2,1],
  ['El grupo ya sabe que puede ser leyenda del {club}','Gasolina ambiciosa.',3,0]]],
['glory',[
 'Este {club} enamora con el balón. ¿Es el fútbol que usted soñó al llegar?',
 'Los analistas llaman al {club} el equipo mejor armado del año. ¿Les da la razón?',
 '¿Cuál fue la clave para que el {club} juegue tan fluido?'],
 [['El fútbol del {club} se construyó entrenamiento a entrenamiento','Defensa del proceso.',1,1],
  ['Jugar bonito y ganar: esa es la identidad que pedía este escudo','Identidad reivindicada.',2,1],
  ['Que lo vivan en la grada, que el show sigue','Showman sin querer. Risas.',2,0]]],
['glory',[
 '{goleador} no para de marcar. ¿Qué le da más, goles o tranquilidad?',
 '¿Es {goleador} el delantero más letal de {liga} esta temporada?',
 '¿Cómo se potencia a un nueve en estado de gracia como {goleador}?'],
 [['{goleador} huele el gol; el trabajo se lo damos en la semana','Elogio fino al artillero.',2,1],
  ['Que firme esos goles en mayo: ahí cuentan doble','Perspectiva de técnico.',1,1],
  ['Cuidado con inflarle: el {club} gana con los once','El grupo respira; el nueve se pica.',1,1]]],
['glory',[
 'El vestuario del {club} parece una verbena. ¿Tan bueno es el ambiente?',
 'Se les ve celebrar como niños. ¿Qué semilla sembró usted?',
 '¿La unión de este grupo es la mejor que ha dirigido?'],
 [['Este vestuario del {club} es una familia: punto','Foto de familia en sala. Todos contentos.',3,1],
  ['El humor es gratis: exijo mucho porque el grupo lo da todo','Lado humano del míster.',2,1],
  ['Bonito es ganar; lo otro se construye a diario','Sobriedad de líder.',1,1]]],
['glory',[
 'La afición del {club} vuelve a soñar. ¿Qué supone para usted ver la grada así?',
 'Entradas agotadas otra vez. ¿Mensaje para la marea que sigue al {club}?',
 'El estadio fue una caldera. ¿Cuánto ganó el equipo por la grada?'],
 [['Esta afición del {club} merece lo mejor: se lo vamos a dar','Compromiso con la grada. Aplausos.',2,1],
  ['Que sigan viniendo: esto va en serio','Aviso divertido. La sala ríe.',2,0],
  ['La grada marcó dos goles hoy','Elogio máximo al público.',2,1]]],
['glory',[
 'Con enero cerca y el equipo volando: ¿blinda usted a {star} del mercado?',
 '¿Teme que vengan con el camión de dinero por {star} en invierno?',
 'El {club} brilla y los tiburones acechan. ¿Hay plan para retener a la figura?'],
 [['{star} es intransferible: el {club} no es escaparate, es destino','Mensaje fortísimo que la grada corea.',2,2],
  ['El club blinda a sus figuras; yo me ocupo del campo','Deriva elegante a los despachos.',1,1],
  ['Si llaman, que vengan con paciencia: aquí felices no se venden','Gancho con guante de seda.',2,0]]],
['glory',[
 'El siguiente es {rival}. ¿Sigue el rodillo o toca gestión?',
 'Después de una exhibición, ¿cómo se evita la resaca contra {rival}?',
 '{rival} le espera con la escopeta cargada. ¿Rotará el once del {club}?'],
 [['Contra {rival} saldremos con la misma hambre: ese es el examen real','Mensaje de exigencia. La sala firma.',2,1],
  ['Cada partido es una guerra distinta; {rival} nos obligará a sufrir','Respeto táctico.',1,1],
  ['El once lo dirá la semana, no la euforia','Calma de míster veterano.',1,0]]],
['glory',[
 '¿Siente que está construyendo algo para la historia del {club}?',
 'Este tramo suyo ya se compara con las mejores épocas del {club}. ¿Le emociona?',
 'Los veteranos del club le felicitan en privado. ¿Qué significa eso para usted?'],
 [['La historia del {club} se respeta trabajando, no hablando','Grandeza mesurada. Sala entregada.',1,2],
  ['Que me comparen con los grandes de esta casa es un honor que cargo con humildad','Respeto a la leyenda del club.',2,1],
  ['Historia será si en mayo hay trofeo','Exigencia pura.',1,1]]],
['glory',[
 'Y la guinda: ¿su renovación con el {club} está cerca?',
 'La grada pide a gritos que el {club} le renueve. ¿Le han llegado ofertas de arriba?',
 '¿Se ve muchos años en este banquillo?'],
 [['Mi presente es el {club} y se me ve feliz: lo demás llega solo','Mensaje de estabilidad. Arriba lo celebran.',1,2],
  ['Las renovaciones las firmo con puntos','Zasca elegante. Carcajadas.',2,0],
  ['Tengo contrato y muchas ganas: que se ocupe la junta de la cuenta','Directo sin fricción.',1,1]]],
/* ─────────────── ROUTINE (semana a semana) ─────────────── */
['routine',[
 'Mercado encendido: ¿busca el {club} algún refuerzo o cerrará la plantilla?',
 '¿Qué le hace falta a este {club} para dar el salto?',
 '¿Está contento con la plantilla que tiene el {club}?'],
 [['Confío plenamente en esta plantilla del {club}','El grupo se siente valorado.',3,0],
  ['El club trabaja; yo entreno a los que tengo','Naturalidad sin titulares.',0,1],
  ['La puerta del mercado siempre entreabierta, nunca de par en par','Prudencia mercantil.',1,0]]],
['routine',[
 'La cantera del {club} vuelve a empujar: ¿es el momento de {joven}?',
 '¿Veremos más minutos de {joven} en el primer equipo?',
 '¿Qué le pediría a un chaval como {joven} para ganarse el {club}?'],
 [['{joven} trabaja como un veterano: la oportunidad llega sola','Elogio al chaval, alivio a la grada.',2,1],
  ['La cantera del {club} es nuestro orgullo, pero sin prisas','Gestión fina de la joya.',1,1],
  ['Que {joven} siga así y nos obligará a todos','Reto público cariñoso.',2,0]]],
['routine',[
 'El capitán {veterano} cumple otra temporada de servicio. ¿Cómo se administra a una leyenda así?',
 '¿Es {veterano} el líder invisible del {club}?',
 '¿El futuro de {veterano} pasa por renovar o por la despedida?'],
 [['{veterano} es el termómetro del vestuario: lo cuidamos como merece','Mimo al capitán. Sala conmovida.',2,1],
  ['Con {veterano} hablo cada día: su palabra pesa en el {club}','Liderazgo reconocido.',2,0],
  ['Lo que decida {veterano} será ley para este club','Respeto absoluto.',1,1]]],
['routine',[
 '¿Se mantiene el dibujo del {club} o habrá sorpresa táctica ante {rival}?',
 'Su sistema es la comidilla de la semana: ¿es innegociable?',
 '¿Se adapta el {club} al rival o impone siempre su idea?'],
 [['El {club} tiene identidad y la defiende contra {rival} y contra todos','Convicción táctica.',1,1],
  ['Tenemos plan A, B y hasta C si hace falta','Preparación que tranquiliza.',1,1],
  ['La pizarra manda en el entreno, no en la sala','Cierre simpático.',0,0]]],
['routine',[
 '¿Qué opina del arbitraje de la última jornada del {club}?',
 'Hubo polémica arbitral contra {rival}. ¿Protestará el {club} oficialmente?',
 'El VAR le quitó un gol al {club}. ¿Sigue confiando en la tecnología?'],
 [['Los árbitros se equivocan como nosotros: a otra cosa','Fin de la polémica. Clase.',1,1],
  ['La polémica no puntúa: el {club} se hace fuerte jugando','Mensaje de entidad grande.',2,1],
  ['El club reclamará por los cauces, yo ya pasé página','Deriva al despacho.',0,1]]],
['routine',[
 'Calendario comprimido otra vez: ¿cómo se dosifica al {club}?',
 'Viaje largo y poco descanso. ¿Injusto para el {club}?',
 '¿Llega la plantilla justa de fuerzas al tramo decisivo?'],
 [['Dosificamos con datos y con sentido común: llegan bien','Gestión física moderna.',1,1],
  ['El calendario es igual para todos: adaptarse es de grandes','Sin excusas. Firmeza.',1,1],
  ['La ciencia del descanso ya ganó un par de partidos','Guiño al staff.',1,0]]],
['routine',[
 'El césped no estuvo a la altura el último día. ¿Reclamará el {club} el estado del campo?',
 'Lluvia prevista para el próximo partido. ¿Cambia mucho al {club} jugar mojado?',
 '¿Prefiere verde rápido o lento para el estilo del {club}?'],
 [['El {club} juega a lo que toque: el escudo no se moja','Orgullo adaptativo.',1,1],
  ['Pediremos el mejor césped posible: el espectáculo lo agradece','Defensa del producto.',1,0],
  ['Con lluvia o con sol, el balón rueda igual si tienes ideas','Mesura técnica.',1,0]]],
['routine',[
 'Se acerca el duelo con {rival}: ¿es solo un partido más para el {club}?',
 '¿Qué significa para usted medirse a {rival}?',
 'Los aficionados ya cuentan los días para ver al {club} contra {rival}. ¿Y usted?'],
 [['Contra {rival} nunca es un partido más: lo sabe hasta la mascota','Gas emocional. La grada lo firma.',2,1],
  ['{rival} obliga a estar fino: nos conviene esa exigencia','Respeto rival.',1,1],
  ['Yo cuento los días de todos los partidos, ese es el trabajo','Sobriedad.',0,0]]],
['routine',[
 'Los titulares de la semana no fueron de fútbol. ¿Le molesta el ruido alrededor del {club}?',
 'Mucho clickbait sobre el {club} estos días. ¿Se protege al grupo de las redes?',
 '¿Cómo se convive con la presión mediática de dirigir al {club}?'],
 [['El grupo entrena con los auriculares puestos: a lo que toca','Protección del vestuario.',2,0],
  ['Las redes no puntúan: el campo puntúa','Cierre elegante.',1,1],
  ['La presión del {club} es un privilegio: si no la quiero, me dedico a otra cosa','Filosofía de banquillo grande.',1,1]]],
['routine',[
 '¿Cómo está el parte médico del {club} esta semana?',
 '¿Recupera el {club} efectivos antes del duelo con {rival}?',
 'Los fisios del {club} no paran: ¿luz verde para algún lesionado?'],
 [['El médico manda: aventuras cero con las lesiones','Prudencia sanitaria. La directiva lo valora.',1,1],
  ['Hay buenas noticias de la enfermería del {club}','Mensaje optimista.',2,0],
  ['El parte se publica cuando el club decide, no antes','Hermetismo habitual.',0,0]]],
['routine',[
 '¿Por qué el entrenamiento abierto de ayer reunió a tanta afición del {club}?',
 'La grada llenó una sesión de entreno. ¿Se siente el cariño?',
 '¿Les pesan las ojeadas de los rivales cuando entrenan a puerta abierta?'],
 [['La afición del {club} es parte del staff: las puertas se abren para ella','Cercanía que entusiasma.',2,1],
  ['Lo importante se ensaya a puerta cerrada, el cariño es abierto','Guiño cómplice.',1,0],
  ['Emociona ver a la grada empujar así en una semana cualquiera','Gratitud.',2,0]]],
['routine',[
 'El {club} cumple años esta semana. ¿Cómo se homenajea la historia de esta casa?',
 'Si le piden un deseo para el aniversario del {club}, ¿cuál sería?',
 '¿Qué le dice la historia del {club} a un míster como usted?'],
 [['La historia del {club} nos obliga: jugar bien es la mejor ofrenda','Homenaje con fútbol.',1,1],
  ['El mejor regalo es ver la grada llena y orgullosa','Cariño a la afición.',2,0],
  ['Lo primero que enseña esta casa: respeto por el escudo','Simbología correcta.',1,1]]],
['routine',[
 'Tarjetas: ¿le preocupa perder titulares por sanción en el tramo clave del {club}?',
 'El {club} lidera dos estadísticas: faltas a favor y en contra. ¿Demasiada fricción?',
 '¿Pide al grupo que baje la intensidad cerca del área?'],
 [['La agresividad del {club} es controlada: niña buena, nunca','Identidad salvada con humor.',1,0],
  ['Las tarjetas tontas se castigan internamente','Mano dentro-dentro.',0,1],
  ['El rival tiembla cuando les presionamos fuerte: lo que cambia es dónde','Ajuste técnico.',1,0]]],
['routine',[
 'Dos porteros de nivel y un solo puesto: ¿cómo se gestiona la portería del {club}?',
 '¿Hay portero titular o porteros por partido en el {club}?',
 'La portería es el único debate que le falta. ¿Cómo lo lleva?'],
 [['Tenemos dos guardianes y un solo club: decidiré cada semana sin dramas','Gestión justa.',1,1],
  ['La portería del {club} está en las mejores manos del país, la que elija','Elogio a ambos.',1,0],
  ['El puesto se gana en la semana, como todos','Meritocracia.',1,0]]],
['routine',[
 '¿Por qué al {club} le cuestan tanto los penaltis esta temporada?',
 '¿Quién lanza el próximo penalti del {club}?',
 '¿Entrenan penaltis con tanta guasa como se dice en los medios?'],
 [['El que tenga el día lo lanzará: confío en todos los ejecutantes','Repóker de confianza.',1,0],
  ['Los penaltis se entrenan serio, aunque la sala se ría','Normalidad pizarra.',1,0],
  ['El próximo lo señala el capitán en el campo','Protocolo claro.',0,1]]],
['routine',[
 'Los suplentes del {club} piden minutos. ¿Cómo se mantiene viva la competencia interna?',
 'Banquillo de lujo, dice la prensa. ¿Es un problema de gestión?',
 '¿Cuánto vale un suplente contento en una temporada larga?'],
 [['Nadie es suplente en el {club}: son segundos titulares','Mensaje de grupo.',2,1],
  ['La competencia interna es el motor del {club}','Cultura de exigencia.',1,1],
  ['El banquillo ganó y perderá finales: lo cuido con mimo','Importancia de la unidad.',2,0]]],
['routine',[
 'La tienda del {club} agota camisetas cada semana. ¿Le llega el dato del negocio?',
 'El club factura récords. ¿Eso ayuda o despista deportivamente?',
 '¿En qué se nota el crecimiento económico del {club} en el día a día?'],
 [['La camiseta del {club} se vende solo si el equipo juega así','Conexión correcta.',1,1],
  ['A mí me llegan los goles; las cuentas, al presidente','Deslinde limpio.',0,1],
  ['El club crece en todo: ahí, los resultados suman','Satisfacción global.',1,1]]],
['routine',[
 'Sorteo copero a la vista: ¿quiere el {club} un grande o un camino suave?',
 '¿Prefiere evitar a {rival} en la siguiente ronda?',
 '¿La copa es objetivo o regalo para el {club} este año?'],
 [['El {club} no elige rivales: los respete quien los dibuje','Coraje de campeonato.',1,1],
  ['Que toque quien toque: en casa el {club} es fuerte','Confianza hogareña.',2,0],
  ['La copa es obligación de este escudo','Compromiso copero.',2,1]]],
['routine',[
 '¿Cómo imagina la próxima pretemporada del {club}?',
 '¿Habrá gira o concentración tranquila para cargar pilas?',
 'Le piden amistosos en tres continentes. ¿Prioridad comercial o deportiva?'],
 [['La carga de verano se diseña para llegar en abril, no para la foto','Planificación a largo plazo.',1,1],
  ['La pretemporada se negocia con la dirección deportiva: ellos mandan ahí','Delegación sana.',0,1],
  ['Donde vaya el {club}, irá con la misma brújula','Sobriedad.',1,0]]],
['routine',[
 'Los datos dicen que el {club} es el equipo que más corre de {liga}. ¿Lo sabía?',
 '¿Hasta qué punto manda el analytics en sus decisiones del {club}?',
 'El GPS de esta semana marcó récord. ¿Qué se premia ahí?'],
 [['Los datos confirman lo que el ojo grita: este grupo se entrega','Validación del esfuerzo.',2,1],
  ['El dato ayuda, la decisión es humana','Marco correcto.',1,1],
  ['Si no hubieran corrido, me quedaría con su GPS de recuerdo','Humor sano.',1,0]]],
['routine',[
 '{rival} llega en crisis. ¿Es un truco o una oportunidad peligrosa?',
 'Cuidado: los equipos heridos muerden. ¿Cómo prepara al {club} para {rival}?',
 'Contra un rival en horas bajas, ¿exige más o menos al grupo?'],
 [['{rival} en crisis es más peligroso que {rival} en forma: lo sé y lo diré al grupo','Advertencia pública. La sala concuerda.',1,1],
  ['La crisis de un equipo se acaba contra ti si te duermes','Mensaje al vestuario.',1,1],
  ['Nosotros a lo nuestro: alta exigencia propia','Foco interno.',1,0]]],
['routine',[
 '¿Qué es lo innegociable del {club} mientras usted mande en el banquillo?',
 'Si tuviera que resumir su sello en el {club} en una frase, ¿cuál sería?',
 '¿Qué filosofía heredó y cuál implantó en el {club}?'],
 [['Competir entero los noventa y pico: esa es la norma de la casa','Decálogo en una línea.',2,1],
  ['El {club} ya tenía alma; yo solo pongo brújula','Respeto a lo heredado.',1,1],
  ['El fútbol es de los futbolistas: mi sello es dejarles ser','Humbildad técnica.',1,1]]],
['routine',[
 'El objetivo real de la temporada: ¿cumplir o soñar en grande?',
 '¿Qué sería un buen año para el {club} de verdad?',
 'La junta pidió lo mínimo y usted habla de títulos: ¿cuál es la verdad?'],
 [['El objetivo del {club} es pelear cada partido; la tabla dirá lo demás','Pragmatismo sincero.',1,1],
  ['Soñar es gratis y en el {club} se cobra con trabajo','Ampuloso pero pegadizo.',2,0],
  ['La junta y yo compartimos mapa: eso no es noticia','Mensaje de unidad.',1,2]]],
['routine',[
 'Otro viaje largo por {liga}. ¿Cómo se cuida al grupo en carretera?',
 'Media plantilla duerme más en hoteles que en casa. ¿Se nota?',
 '¿Se protocoliza también la siesta del equipo?'],
 [['Los viajes del {club} son laboratorio de descanso: todo medido','Gestión científica.',1,0],
  ['Estar lejos de casa une al grupo: el vestuario lo sabe','Armor de vestuario.',1,1],
  ['Los hoteles no ganan partidos, los piernas sí','Sencillez.',0,0]]],
['routine',[
 'Horario insólito otra vez para el {club}. ¿Se queja oficialmente?',
 'Las televisiones mandan demasiado en el calendario, ¿no cree?',
 '¿Afecta jugar de noche al plan de la semana del {club}?'],
 [['Jugamos cuando mandan: el club protesta por cauces y yo ajusto siestas','Protesta práctica.',1,0],
  ['Los horarios favorecen la mejor pantalla: el {club} la da','Vuelta positiva.',1,1],
  ['Quejarme no cambia la hora: entrenar sí cambia el partido','Entereza.',1,0]]],
['routine',[
 'Su rueda de prensa anterior levantó polvo. ¿Se arrepiente de algo dicho?',
 'Algunos cortes suyos se hicieron virales. ¿Cuida más las formas?',
 '¿Le divierte o le cansa este ritual semanal ante los medios?'],
 [['Dije lo que pensaba y lo repito con calma','Orgullo firme.',0,1],
  ['Las formas importan: la próxima vez, con más pausa','Autocorrección noble.',1,1],
  ['Este ritual también construye al {club}: lo tomo en serio','Profesionalidad.',1,1]]],
['routine',[
 'La joya {joven} acaba de firmar su primer contrato largo. ¿Cuál es el plan con él?',
 '¿Cómo se protege a {joven} del entorno cuando todo brilla tan pronto?',
 'El {club} apuesta por {joven}: ¿tutelaje de los veteranos?'],
 [['{joven} tiene los pies en casa: el plan es paciencia y minutos bien dados','Hoja de ruta de cantera.',2,1],
  ['{veterano} y los capitanes lo cuidan como a un hermano','Estructura de protección.',2,0],
  ['Las prisas matan joyas: {joven} será grande a su ritmo','Paciencia virtuosa.',1,1]]],
];

/* ═══════════ JUGADOR — [ctx, [v1,v2,v3], [[t,fb,mo],×3]] ═══════════ */
var PL = [
/* ─────────────── GLORY (nota alta / gran partido) ─────────────── */
['glory',[
 'Hoy fuiste de lo mejor de la cancha. ¿Es este el mejor momento de tu carrera en el {club}?',
 'Rendimiento de gala, {me}. ¿Qué ha cambiado para verte así?',
 'El partido que firmaste hoy dará mucho que hablar. ¿Lo sentiste especial también?'],
 [['Mejor que nunca… y va a más','Sonrisa del míster. Titular de crack.',3],
  ['Sin fiesta hasta el título: el {club} me exige esa mentalidad','Seriedad de líder que enamora.',2],
  ['El fútbol me está devolviendo todo lo que le doy','Humildad bonita.',2]]],
['glory',[
 'La grada del {club} coreó tu nombre. ¿En qué se convierte uno cuando pasa eso?',
 '¿Cómo se describen los segundos en que todo el estadio grita tu nombre?',
 'Tu nombre sonó hasta en la sala de prensa rival. ¿Qué supone para ti?'],
 [['Es el abrazo más grande que te puede dar este club: lo llevo tatuado','La grada vuelve a enamorarse.',3],
  ['Por esos coros entreno todos los días','Cercanía brutal con la afición.',2],
  ['Bonito, sí, pero el lunes toca sudar otra vez','Pies en la tierra.',1]]],
['glory',[
 'Te comparan con los ídolos históricos del {club}. ¿Te pesa o te impulsa?',
 'Hasta los ex futbolistas de la casa te aplauden ya. ¿Cómo se digiere eso?',
 '¿Te ves capaz de escribir una página dorada en la historia del {club}?'],
 [['Compararme con leyendas es un honor: mi página aún se está escribiendo','Respeto a la historia.',2],
  ['Yo quiero hacer mi camino: que otros hagan las comparaciones','Identidad propia.',2],
  ['Esa historia se gana en el campo, no aquí sentados','Freno al hype.',1]]],
['glory',[
 'Con este nivel, ¿sueñas con la llamada de la selección?',
 'Tu nombre ya se cuela en todas las quinielas de la convocatoria. ¿Le das importancia?',
 '¿Vestir la camiseta de tu país sigue siendo el sueño máximo?'],
 [['La selección se gana con partidos como el de hoy en el {club}: ahí pongo el foco','Prioridad correcta.',2],
  ['Vestir la camiseta de mi país es el sueño de niño que sigue intacto','Sentimiento puro.',2],
  ['Si tiene que llegar, llegará: yo hablo en el campo','Despeje limpio.',1]]],
['glory',[
 'Tu valor sube cada semana. ¿Te llegan ofertas o vives ajeno a eso en el {club}?',
 'Los grandes clubes ya te vigilan, dice la prensa. ¿Te entra vértigo o hambre?',
 '¿Te preocupa que la fama distraiga lo que haces con el {club}?'],
 [['Yo juego en el {club} y aquí soy feliz: lo demás es ruido bonito','Lealtad que la grada corea.',3],
  ['Mi agente me cuenta lo justo: yo solo tengo hambre de más fútbol','Foco absoluto.',2],
  ['El vértigo se quita ganando partidos','Respuesta seca pero efectiva.',1]]],
['glory',[
 'Hoy te vas para casa con otro premio al mejor del partido. ¿Dónde vas a ponerlos todos?',
 'Otro MOM más a la colección. ¿Te importan esos galardones o van de relleno?',
 'Premio individual otra vez. ¿Lo celebras con alguien especial?'],
 [['Los premios se los dedico al vestuario del {club}: sin ellos no hay trofeo','Unidad de grupo.',3],
  ['Mi familia los guarda mejor que yo','Lado humano.',2],
  ['Bonito detalle, pero el premio que quiero es colectivo','Puntería colectiva.',2]]],
['glory',[
 '¿Te llevarás el balón a casa después de un día así?',
 'Ese balón del partido ya le pertenece a alguien de tu familia, ¿no?',
 '¿Qué ritual sigues después de un gran partido como el de hoy?'],
 [['El balón va para la gente que está desde el día uno','Fidelidad a los orígenes.',2],
  ['Ritual: hielo, familia y dormir tranquilo','Humanidad total.',2],
  ['Celebrado, pero mañana amanece partido nuevo','Freno profesional.',1]]],
['glory',[
 'Tu jugada de hoy ya es viral en redes. ¿La has visto ya mil veces?',
 'TikTok arde con tu jugada. ¿Cómo vives ese megáfono de las redes?',
 '¿Las redes son un plus o una carga para un futbolista como tú?'],
 [['Vi la jugada un par de veces, no me voy a engañar','Sinceridad simpática.',2],
  ['Las redes empujan, pero en el campo no hay filtros','Equilibrio digital.',1],
  ['Que lo disfrute la gente: yo me quedo con el balón parado de entreno','Frialdad profesional.',1]]],
['glory',[
 'Tu camiseta es la más vendida del {club} este mes. ¿Te crece la responsabilidad?',
 'Los niños ya llevan tu dorsal por todas partes. ¿Qué les dirías?',
 '¿Te pesa ser la cara del {club} para tantos niños?'],
 [['Ser espejo de los niños es el premio más serio: a dar el ejemplo siempre','Conciencia de referente.',3],
  ['Que sueñen: yo también fui ese niño con la camiseta grande','Memoria emotiva.',2],
  ['La responsabilidad se lleva con naturalidad y trabajo','Sencillez.',1]]],
['glory',[
 '¿Te ves capitán del {club} algún día?',
 'El brazalete te quedaría bien, dictan en la grada. ¿Lo ambicionas?',
 'Cuando piensas en crecer aquí, ¿te imaginas con el brazalete?'],
 [['Capitán se nace o se hace; yo aprendo de los que lo llevan hoy','Respeto a los capitanes.',2],
  ['Primero ganarme cada entrenamiento; el brazalete llegará si toca','Escalera correcta.',2],
  ['El liderazgo es diario, con o sin brazalete','Madurez.',1]]],
['glory',[
 'El míster sonríe cuando habla de ti en privado. ¿Qué relación tienen?',
 '¿Qué te pidió esta semana el técnico del {club} para salir así hoy?',
 '¿Cuánto le debes al cuerpo técnico del {club} en esta racha?'],
 [['La confianza del míster se paga los domingos: eso es lo que intento','Gratitud al banquillo.',2],
  ['Me pidió valentía y por ahí empezó todo','Detalle de vestuario que suma.',2],
  ['Les debo la libertad con la que juego','Reconocimiento al staff.',2]]],
['glory',[
 'Con {edad} años y este nivel, ¿hasta dónde puede llegar {me}?',
 '¿Ya se monta uno en la nube con tan buenas sensaciones?',
 '¿Cuál es el techo de esta versión tuya?'],
 [['El techo lo decide el trabajo de cada semana, no la nube','Freno aeroespacial.',2],
  ['Me monto en la ilusión, no en la nube: a seguir','Ambición con freno.',2],
  ['Ni idea del techo: lo sabremos peleando','Humildad competitiva.',1]]],
/* ─────────────── CRISIS (nota baja / bache) ─────────────── */
['crisis',[
 'La crítica te vuelve a señalar tras el partido. ¿Te afecta?',
 '¿Es tu peor tramo desde que llegaste al {club}?',
 'Los comentarios no fueron suaves esta semana. ¿Cómo lo llevas?'],
 [['La crítica duele y la convierto en entrenamiento extra','Profesionalidad.',2],
  ['Soy mi peor crítico: ya estoy trabajando el doble','Autocrítica digna.',2],
  ['Los comentarios pasan; el trabajo queda','Filosofía corta.',1]]],
['crisis',[
 '¿Temes el banquillo en el próximo partido del {club}?',
 'La competencia en tu puesto aprieta. ¿Cómo respondes desde dentro?',
 '¿Se ha hablado contigo desde el banquillo esta semana?'],
 [['El once lo decide el míster: yo decido mi trabajo','Protocolo correcto.',1],
  ['La competencia es el mejor regalo para el {club}: me crece','Actitud competitiva sana.',2],
  ['Si toca banquillo, empujaré desde ahí: el club antes que yo','Compromiso.',2]]],
['crisis',[
 'La sequía de gol se alarga. ¿Qué le falta a tu juego ahora mismo?',
 '¿Es mental, físico o pura mala suerte este tramo sin brillo?',
 'Los números no mienten: ¿qué cambias esta semana?'],
 [['El gol se fue pero vuelve: el olfato no se pierde','Confianza sin soberbia.',2],
  ['Cambio detalles: llegadas, timing y descanso','Análisis honesto.',1],
  ['Los palos cuentan estadística pero no cuentan historia','Defensa con gracia.',1]]],
['crisis',[
 'Tu cuerpo no parece al cien por cien después de la última lesión. ¿Estás bien?',
 '¿Cómo está realmente esa molestia que te persigue desde hace semanas?',
 '¿Arriesgaste demasiado al volver tan pronto al {club}?'],
 [['Estoy bien: las molestias las gestionan los físicos y yo','Calma sanitaria.',1],
  ['Volví porque el {club} me necesitaba y me siento fuerte','Compromiso con el escudo.',2],
  ['El cuerpo pide calma y yo le doy trabajo inteligente','Autocuidado.',1]]],
['crisis',[
 'El palo del otro día lo celebró hasta el portero rival. ¿La mala suerte existe?',
 '¿Cuánto le duele a un futbolista que el balón no quiera entrar?',
 '¿Te persiguen esas jugadas que no salen durante la semana?'],
 [['La suerte se trabaja: volverá a entrar tres seguidas','Determinación.',2],
  ['Duele una noche, no más: al día siguiente vuelvo a soñar','Sobrellevar.',2],
  ['El balón es caprichoso, pero me conoce ya de antes','Paciencia romántica.',1]]],
['crisis',[
 '¿Le pides explicaciones a tu representación por los rumores que se filtran?',
 'Tu agente y la prensa parecen peleados. ¿Te afecta ese frente?',
 '¿Prefieres silencio total de tu entorno en estos momentos?'],
 [['Mi entorno sabe que yo solo hablo de fútbol','Deslinde con elegancia.',1],
  ['Que hable el campo: es la mejor agencia de comunicación','Mensaje de profesional.',2],
  ['El silencio también es una respuesta: dejo que trabaje','Misterio controlado.',0]]],
['crisis',[
 'El míster dijo que el grupo debe dar más. ¿Te incluyes en esa exigencia?',
 '¿Cómo reaccionó el vestuario tras la charla del técnico?',
 '¿La bronca del entrenador fue merecida esta vez?'],
 [['Me incluyo el primero en la exigencia: la respuesta llegará','Liderato silencioso.',2],
  ['El vestuario del {club} cerró filas: eso vale más que mil charlas','Imagen de unidad.',2],
  ['Las broncas deportivas se aceptan cuando el grupo las entiende','Madurez.',1]]],
['crisis',[
 'Algunos hablan de que tu precio pesó demasiado. ¿Te lo crees?',
 'El cartel de fichaje caro: ¿ventaja o lastre en el {club}?',
 '¿El dinero que costaste debería importarle al aficionado?'],
 [['El precio lo puso el mercado: yo me ocupo de justificarlo en el campo','Realismo.',1],
  ['Al aficionado le importan mis goles, no mi cláusula: a eso voy','Conexión con la grada.',2],
  ['La etiqueta se quita sudando','Frase de vestuario.',1]]],
['crisis',[
 '¿Recuerdas tu mejor versión en el {club}? ¿Qué tiene que volver para recuperarla?',
 '¿Cómo se vuelve al nivel que ya demostraste antes?',
 '¿Te miras partidos viejos para recuperar sensaciones?'],
 [['Claro que me miro: mi mejor versión ya está entrenada, solo hay que despertarla','Optimismo trabajado.',2],
  ['Vuelve con rutinas: cuerpo, sueño y cabeza tranquila','Plan serio.',1],
  ['La memoria sirve; el presente se construye hoy','Siguiente página.',1]]],
['crisis',[
 'Silencio en tus redes desde hace semanas. ¿Es decisión tuya?',
 '¿Las redes afectan tu rendimiento cuando el partido no fue bueno?',
 '¿Te levantan o te hunden los comentarios en línea?'],
 [['Las redes descansan cuando el campo exige concentración','Disciplina digital.',1],
  ['Ni me levantan ni me hunden: el ánimo lo pongo yo','Coraza.',1],
  ['Los buenos comentarios duelen menos que el marcador; ya pasará','Ironía amable.',0]]],
['crisis',[
 '¿Duermes bien antes de los partidos en esta mala racha del {club}?',
 '¿Cómo se cuida la cabeza cuando el fútbol no sale?',
 '¿Trabajas con alguien tu parte mental en la semana?'],
 [['El fútbol se juega con la cabeza fría: la cuido como las piernas','Salud mental normalizada.',2],
  ['Duermo porque el trabajo diario deja la conciencia tranquila','Tranquilidad honesta.',1],
  ['Hablar de lo mental ya no es raro: es de profesionales','Mensaje moderno valioso.',2]]],
/* ─────────────── ROUTINE (semana a semana del jugador) ─────────────── */
['routine',[
 'Esta semana se habló mucho de tu posición. ¿Te sientes mejor como {pos} clásico o con más libertad?',
 '¿Dónde te ves más útil para el {club}: como {pos} puro o cambiando de zona?',
 'Tu mapa de calor dio que hablar esta jornada. ¿Estás cómodo con el rol que tienes?'],
 [['Juego donde el míster decida: mi puesto es ayudar al {club}','Polivalencia comprometida.',2],
  ['Como {pos} me siento protagonista: ahí quiero crecer','Identidad de posición clara.',2],
  ['La libertad se gana haciendo primero los deberes','Cultura táctica.',1]]],
['routine',[
 '¿Cómo describirías tu rol dentro del {club} a alguien que nunca te vio jugar?',
 '¿Qué pide el vestuario de ti más allá del talento?',
 '¿Eres más de brillar un día o de empujar siempre?'],
 [['Soy el que empuja cuando brillar no basta: el {club} me formó así','Identidad de equipo.',2],
  ['El vestuario me pide verdad: trabajo y vestir el escudo por dentro','Compromiso.',2],
  ['Brillar está bien; estar siempre está mejor','Consistencia.',1]]],
['routine',[
 'El próximo es contra {rival}. ¿Partido marcado en tu calendario?',
 '¿Qué le pides a un duelo como el de {rival}?',
 '¿Cómo preparas mentalmente un partido grande como el de {rival}?'],
 [['Contrarreloj en la cabeza desde ya: {rival} nos exigirá todo','Exigencia top.',2],
  ['Le pido seguir siendo nosotros y ganar: ni más ni menos','Plan sencillo.',1],
  ['La preparación mental es trabajar duro y dormir bien: sin cuento','Sobriedad.',1]]],
['routine',[
 '¿Tienes alguna rutina infalible antes de saltar al campo?',
 'Los fans quieren saber: ¿qué haces las dos horas antes del partido?',
 '¿Música, silencio o charla de vestuario antes de jugar?'],
  [['Siempre lo mismo: mismos pasos, mismas ganas','Ritual de perfeccionista.',1],
  ['Música concentrado y una llamada a mi familia','Lado humano.',2],
  ['Charla con el capitán: eso me pone en modo guerra','Vestuario fuerte.',1]]],
['routine',[
 '¿Quién cocina en casa? Se rumorea que tu chef es casi tan famoso como tú.',
 '¿Le das tanta importancia a la mesa como al entreno?',
 '¿Hay algo que no pruebas por nada del mundo en semana de partido?'],
 [['La mesa también entrena: cuido cada detalle que puedo','Profesional 24/7.',2],
  ['Chef no, pero dieta seria sí: la edad pide cabeza','Autocuidado total.',1],
  ['Lo prohibido existe, pero el sueño del trofeo vale más','Sacrificio.',1]]],
['routine',[
 'Se te ve mucho en videojuegos últimamente. ¿También compites ahí?',
 '¿Quién es el mejor del vestuario en la consola?',
 '¿Relaja o pica el videojuego con los compañeros?'],
 [['En la consola también le gano a más de uno del vestuario','Picardía de grupo.',1],
  ['Relaja y pica a partes iguales: buen termómetro','Equilibrio.',1],
  ['La consola es familia; el fútbol, trabajo: cada cosa en su hora','Orden de prioridades.',1]]],
['routine',[
 'Tu familia estuvo en la grada otra vez. ¿Qué significa verlos ahí?',
 '¿Viajan contigo a los partidos fuera?',
 '¿Quién fue el primero en creer en ti antes de todo esto?'],
 [['Mi familia es mi primera tifosi: sin ellos no hay {me}','Amor filial que conecta.',3],
  ['Viajan si pueden: cuando no pueden, los llevo en la cabeza','Cercanía.',2],
  ['El primero fue mi familia y el segundo fui yo, en ese orden','Orgullo sano.',2]]],
['routine',[
 '¿A quién te copiabas los gestos de niño?',
 '¿Tu ídolo sabe que era tu ídolo?',
 'Si pudieras cenar con una leyenda del fútbol, ¿con quién sería?'],
 [['Mi ídolo lo fue porque hacía magia simple: eso intento','Influencia declarada.',2],
  ['Le escribí hace tiempo... y contestó: aún me tiemblan las manos','Vulnerabilidad bonita.',3],
  ['Cenaría con mi abuelo, que me enseñó a patear','Sentimiento hogareño.',2]]],
['routine',[
 'El dorsal que llevas tiene peso en la historia del {club}. ¿Lo sientes?',
 '¿Elegiste tu número o te eligió él?',
 '¿Cambiarias tu dorsal por otro histórico del {club}?'],
 [['Cada dorsal del {club} tiene dueños anteriores: lo honro jugando','Respeto a la historia.',2],
  ['El número me eligió: la camiseta me queda grande de orgullo','Poesía de vestuario.',2],
  ['Un dorsal no hace al jugador; el jugador hace al dorsal','Identidad propia.',1]]],
['routine',[
 '¿Quién es tu mejor aliado dentro del vestuario del {club}?',
 '¿Con quién compartes más risas en los entrenos?',
 '¿Existen clanes en el vestuario o es realmente una piña?'],
 [['El vestuario del {club} es una piña real: las bromas vuelan y el respeto manda','Imagen de grupo sano.',2],
  ['Mi aliado es el grupo entero; las risas se reparten','Unidad total.',2],
  ['Con los que comparto idioma río más, pero unidos somos todos','Naturalidad multicultural.',1]]],
['routine',[
 '¿Ya dominas el idioma del vestuario o sigues con el traductor?',
 '¿Cuál fue la primera frase que aprendiste en el {club}?',
 '¿Cómo te comunicas en el campo cuando el ruido manda?'],
 [['La primera frase: «somos familia», y se quedó','Aww colectivo.',3],
  ['En el campo todos hablamos el idioma del balón','Futbol puro.',2],
  ['El traductor me salva las tardes; los gestos, los partidos','Humor humilde.',1]]],
['routine',[
 'De la cantera del {club} saliste tú. ¿Qué le dirías a los chavos que vienen detrás?',
 '¿Vuelves de vez en cuando a ver a los juveniles?',
 '¿Qué echas de menos de tus días en el filial?'],
 [['Que trabajen callados: el {club} siempre mira a los suyos','Consejo de mayor.',2],
  ['Vuelvo cuando puedo: verles entrenar me recuerda quién fui','Raíces.',2],
  ['Echo de menos el vestuario pequeño… pero no el frío de las gradas','Humor nostálgico.',1]]],
['routine',[
 'Tu agente anda por todas las portadas últimamente. ¿Cuánto pesa en tus decisiones?',
 '¿Qué le pides a tu representante en verano?',
 '¿El mercado te quita el sueño o es puro papeleo?'],
 [['Mi agente trabaja y yo juego: división clara','Deslinde limpio.',1],
  ['Le pido silencio y aciertos: en ese orden','Directividad simpática.',1],
  ['El papel me aburre; el verde no','Respuesta corta.',0]]],
['routine',[
 '¿Hablemos de renovación? El {club} y tú debéis mucho a la grada en ese tema.',
 '¿El contrato nuevo está cerca o es humo de portal?',
 '¿Quieres retirarte en este club algún día?'],
 [['Renovar con el {club} sería un honor que se habla en privado','Hermetismo con cariño.',1],
  ['Sueño con una historia larga aquí: se lo diré a mi agente','Lealtad declarada.',2],
  ['Las fechas las ponen los despachos; los goles, yo','Zasca elegante.',1]]],
['routine',[
 '¿Te ves algún día en la gala del premio al mejor jugador del mundo?',
 'Soñar es gratis: ¿el gran premio individual te quita el sueño?',
 '¿Qué te falta para estar en esa conversación?'],
 [['Soñar no cuesta: costar llegar, y ahí andamos','Ambición realista.',2],
  ['Los premios colectivos me quitan más sueño que los individuales','Espíritu colectivo.',2],
  ['Me falta mantener el nivel muchos meses: eso dirá el tiempo','Sensatez.',1]]],
['routine',[
 '¿Lees lo que escribe la grada de ti en redes, {me}?',
 '¿Te llegan las bufandas gigantes que sacan con tu cara?',
 '¿Has tenido alguna petición rara de un fan esta semana?'],
 [['Veo muestras de cariño todos los días: energía pura','Conexión con la afición.',2],
  ['La bufanda con mi cara la vi en la grada: casi lloro','Emoción genuina.',3],
  ['Me pidieron el silbato del calentamiento: se lo mandé firmado','Anécdota entrañable.',2]]],
['routine',[
 '¿Cómo celebras un cumpleaños en semana de partido?',
 '¿Te hicieron los compañeros alguna novatada de entrenamiento?',
 '¿Quién trae los pasteles al vestuario del {club}?'],
 [['El cumpleaños se celebra en mayo con un trofeo','Seriedad simpática.',1],
  ['Las novatadas existen: lo que pasa en el vestuario se queda ahí','Misterio con guiño.',2],
  ['Los pasteles los trae el capitán y los paga el más nuevo','Tradición de grupo.',2]]],
['routine',[
 '¿Tienes estadio favorito además de la casa del {club}?',
 '¿En qué campo rival sientes que el fútbol huele distinto?',
 '¿El ambiente rival te intimida o te enciende?'],
 [['El ambiente hostil me enciende: juego mejor con fuego','Mentalidad asesina.',2],
  ['Hay templos del fútbol que se respetan: jugar ahí es regalo','Cultura football.',2],
  ['Mi estadio favorito es donde gana el {club}','Zasca final.',1]]],
['routine',[
 '¿Cómo te has adaptado al clima de esta ciudad? Los uniformes sudan solos.',
 '¿Te metió prisa el cambio de ciudad cuando llegaste al {club}?',
 '¿Qué es lo primero que haces cuando vuelves de un viaje largo?'],
 [['La ciudad me adoptó rápido: hasta sudo con orgullo','Adaptación sellada.',2],
  ['La mudanza pesa, pero el {club} cuida al jugador de fuera','Agradecimiento al club.',2],
  ['Lo primero: dormir en mi cama y un buen plato de casa','Sencillez total.',1]]],
['routine',[
 '¿Del entrenamiento doble de ayer qué parte preferimos no repetir?',
 '¿Se nota cuando los físicos se ceban en la semana?',
 '¿Rodillas arriba o escaleras de coordinación? Dilo de corazón.'],
 [['Los físicos son malos con amor: pero duelen','Humor sufrido.',2],
  ['Se nota en abril, no en agosto: esa es la idea','Confianza en el plan.',1],
  ['Prefiero mil veces el balón, pero las escaleras también ganan partidos','Resignación simpática.',1]]],
['routine',[
 'Cuando visitas estadios rivales, ¿sientes que te pitan más que a otros?',
 '¿Te han hecho la guerra psicológica alguna vez?',
 '¿Sigues alguna superstición los días de visitante?'],
 [['Los pitos de la grada rival son el mejor altavoz: me encienden','Fuego inhóspito.',2],
  ['La guerra psicológica se responde con goles','Silencio goleador.',1],
  ['Entro con el pie de costumbre: superstición pequeña, manía grande','Ritual divertido.',1]]],
['routine',[
 '¿Cuántos pares de botas llevas en la mochila esta semana?',
 '¿Te gusta cambiar de modelo o eres de las botas viejas fieles?',
 '¿Tus botas ya son edición especial o todavía básicas de tienda?'],
 [['Las viejas fieles: si funcionan, no se tocan','Costumbre futbolera.',2],
  ['La edición especial llega cuando llegan los goles','Ambición discreta.',1],
  ['Tres pares: uno por si llueve, otro por si no, y el de la suerte','Superstición clásica.',1]]],
['routine',[
 'El himno del {club} sonó a capela en la grada esta semana. ¿Te lo sabes ya?',
 '¿Qué canción canta el vestuario cuando gana el {club}?',
 '¿Te atreves a tararearnos algo del repertorio del equipo?'],
 [['El himno se aprende de memoria y de corazón: ya me sale','Cariño al club.',2],
  ['La canción de las victorias se queda en el vestuario: pacto','Misterio de grupo.',1],
  ['Tararear no, pero que lo cante la grada que es mejor','Delegación melódica.',1]]],
['routine',[
 '__KARAOKE__: ¿quién canta peor en el vestuario del {club}?',
 'Se habla de un karaoke secreto este año. ¿Tus compañeros mienten?',
 '¿Cantas delante del grupo o eres más de ducha privada?'],
 [['Peor que un defensa cantando, nadie: y juro por él','Humor de vestuario.',2],
  ['El karaoke quedó documentado: pronto saldrá a la luz','Intriga divertida.',1],
  ['Yo canto bajo la ducha y compito hasta ahí','Confesión simpática.',1]]],
['routine',[
 '¿Te premian el mes? Los votantes lo debaten entre tú y el goleador del equipo.',
 '¿Te importan los premios de mejor jugador del mes del {club}?',
 '¿Quién debería ganar el premio del mes si no fueras tú?'],
 [['Si me toca, lo comparto con el goleador: sus goles también fueron míos en asistencia','Fair play interno.',2],
  ['Los premios del mes son gasolina: bienvenidos','Motivación sana.',1],
  ['Gane quien gane dentro del {club}, ganamos todos','Unidad.',1]]],
['routine',[
 '¿Qué regate dominabas de niño que todavía usas hoy?',
 '¿Todavía entrenas trucos de patio entre ejercicios serios?',
 '¿Ese movimiento tuyo se puede enseñar o se nace con él?'],
 [['El regate del patio sigue vivo: sólo que ahora con más físico','Infancia presente.',2],
  ['Los trucos nacen, la disciplina los afila','Caracterización perfecta.',2],
  ['Entreno trucos porque el fútbol también es alegría','Alegría de juego.',2]]],
['routine',[
 'El fisio del club cumple 30 años de servicio esta semana. ¿Palabras para él?',
 '¿El staff del {club} es invisible pero imprescindible? ¿Se les recuerda bastante?',
 '¿Qué pesa más: la plantilla o la gente que nadie ve en el día a día?'],
 [['Sin el fisio a estas horas no hablo, estaría en la camilla: gracias eternas','Humor y gratitud.',3],
  ['El staff del {club} es la mitad de cada victoria','Reconocimiento honrado.',2],
  ['La gente invisible sostiene a todos: se les debe más que una frase','Mensaje valioso.',2]]],
['routine',[
 '¿Qué plato de tu país echas más de menos en semana de partido?',
 '¿El chef del club ya copió alguna receta de tu tierra?',
 'La cocina del vestuario también une culturas, ¿no?'],
 [['La cocina del vestuario viaja por el mundo cada día: eso nos une','Integración cultural.',2],
  ['Mi plato favorito ya lo cocinan en el club: detalles que abrigan','Agradecimiento.',2],
  ['Como en casa no se come en ningún lado, pero el club se acerca','Añoranza simpática.',1]]],
];

/* ═══════════ builders ═══════════ */
function mgrQS(d){
  d = d || {};
  var out = [];
  for (var i = 0; i < MG.length; i++){
    var g = MG[i];
    for (var j = 0; j < g[1].length; j++){
      (function(g, j){
        var opts = g[2].map(function(o){
          return { t: fill(o[0], d), fb: fill(o[1], d), morale: o[2] | 0, conf: o[3] | 0 };
        });
        out.push({ ctx: g[0], q: pre() + fill(g[1][j], d) + fin(), opts: opts });
      })(g, j);
    }
  }
  return out;
}
function plQS(d){
  d = d || {};
  var out = [];
  for (var i = 0; i < PL.length; i++){
    var g = PL[i];
    for (var j = 0; j < g[1].length; j++){
      (function(g, j){
        var opts = g[2].map(function(o){
          return { t: fill(o[0], d), fb: fill(o[1], d), mo: o[2] | 0 };
        });
        out.push({ ctx: g[0], q: pre() + fill(g[1][j], d) + fin(), opts: opts });
      })(g, j);
    }
  }
  return out;
}
function stats(){
  return { mgrGroups: MG.length, mgrPhrasings: MG.reduce(function(a,g){ return a + g[1].length; }, 0),
           plGroups: PL.length, plPhrasings: PL.reduce(function(a,g){ return a + g[1].length; }, 0),
           medios: MEDIOS.length, periodistas: PERIOD.length };
}
window.PRESSBANK = { mgrQS: mgrQS, plQS: plQS, stats: stats, _MG: MG, _PL: PL };
})();
console.log('[PRESSBANK] ' + (window.PRESSBANK.stats().mgrPhrasings + window.PRESSBANK.stats().plPhrasings) + ' redacciones base × ' + (window.PRESSBANK.stats().medios * window.PRESSBANK.stats().periodistas) + ' firmas/medios = miles de ruedas de prensa distintas');
