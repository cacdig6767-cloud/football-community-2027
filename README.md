# ⚽ Football Community 2027

**Tu comunidad, tu juego.** Un modo carrera de fútbol completo que vive en **un solo archivo HTML** — sin instalación, sin cuentas, gratis. Funciona en el navegador del teléfono y de la compu.

![Estado](https://img.shields.io/badge/build-UI133-00c853)
![Tests](https://img.shields.io/badge/tests-140%2F140%20OK-success)
![Stack](https://img.shields.io/badge/stack-HTML%20%2B%20JS%20puro-blue)
![Peso](https://img.shields.io/badge/juego-1%20archivo-orange)

---

## 🎮 Qué es Football Community 2027

Un "modo carrera" estilo manager creado por y para la comunidad, con el sabor local que los juegos grandes no traen: **19 ligas del mundo incluida la Liga Nacional de Honduras** 🇭🇳, más de **300 clubes**, mercado con casi **8.000 jugadores** y economía calibrada con los **valores oficiales de FC 26**.

### Lo último (BUILD UI130)
- 💰 **Precios FC 26 reales**: Bellingham €178M · Vini Jr €174M · Mbappé €163M · Haaland €161M · Yamal €144M… techo €185M (adiós inflaciones tipo Neymar 2.0).
- 🌎 **TODAS las plantillas al mercado**: los 302 clubes de las 19 ligas venden su plantilla completa (~22 por equipo) — 7.961 jugadores disponibles, con la Liga Nacional hondureña en su escala real.
- 🌟 **Regens cada temporada**: llega la "Clase 20XX" con minas de oro (74-82 media, potencial 86-94) y joyas baratas.
- 🎯 **Reposicionamiento estilo FC 26/27**: reentrena la posición de tus jugadores; el tiempo (2-9 semanas) y la probabilidad (15-92%) dependen de edad, forma, moral y cercanía de posiciones.
- 🔓 **Modo "Fundar club desde cero" sin bloqueos**: currículums baratos infinitos (portero garantizado si falta), agentes libres siempre vivos y presupuestos iniciales mejorados.
- 🧠 Carrera vivo: Bosman, ventanas de fichajes, cesiones, charlas de vestuario, regens, premios de temporada, momentos clave con IA opcional (BYOK) y soundtrack original generado con IA (licencia comercial incluida).

## 🚀 Cómo jugar

1. **Online**: abre la URL que te compartan (deploy en Vercel).
2. **Local**: descarga `index.html` + la carpeta `assets/` en la misma carpeta y haz doble clic en `index.html`. No necesita servidor.

## 📂 Estructura del repo

```
index.html        ← EL JUEGO COMPLETO (un solo archivo)
assets/
  ├─ crests/      ← 405 escudos de clubes
  ├─ music/       ← 12 pistas originales (IA, licencia comercial)
  ├─ favicon.png / apple-touch-icon.png
  └─ bg1.jpg / bg2.jpg
vercel.json       ← headers de caché (deploy sin build)
```

## ☁️ Deploy propio (2 minutos)

Es estático puro — no hay build ni dependencias:

1. Sube este repo a GitHub (o arrastra la carpeta a [vercel.com/new](https://vercel.com/new)).
2. En Vercel: **Add New → Project → Import** → Framework **"Other"** → Deploy.
3. Listo: tendrás tu URL `*.vercel.app` para compartir.

Más detalle en [`README-DEPLOY.md`](README-DEPLOY.md).

---

⚽ *Hecho con la comunidad, para la comunidad. Si se te ocurre algo, se construye.*
