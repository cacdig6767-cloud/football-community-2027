# 🚀 Football Community 2027 en Vercel — cómo publicar
Todo es **estático puro**: solo necesitas esta carpeta con `index.html` + `assets/` (ya está preparada en `vercel-deploy/`). No hay build ni dependencias.

## Camino A — Git + deploy automático (recomendado)
1. **Crea un repo en GitHub** y súbele el contenido de esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Football Community 2027 v1"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/football-community-2027.git
   git push -u origin main
   ```
2. En **[vercel.com](https://vercel.com)** → **Add New… → Project** → **Import Git Repository** y dale tu repo.
3. Vercel detecta **Framework Preset: Other** (estático puro) → **Deploy** ✔. En ~30 s tienes URL tipo `football-community-2027.vercel.app`.
4. **Dominio propio gratis**: en *Settings → Domains* puedes cambiar el `*.vercel.app` o amarrar tu `.com`.

## Camino B — 1 clic sin Git (drag & drop)
1. Ve a **[vercel.com/new](https://vercel.com/new)** y **arrastra la carpeta** `vercel-deploy` entera a la zona de drag & drop.
2. Vercel la sube y despliega al instante, sin build. 👌

## 💡 Datos clave de tu proyecto Vercel
- **Volumen**: ~22 MB música + html (12 canciones 96k) — entra sobrado en el plan **Hobby gratuito**.
- **localStorage en web**: cada jugador guarda su carrera en el navegador de su propio dispositivo (igual que en local); al publicar, todos comparten el mismo dominio pero NO la partida.
- **Sin CSP raro**: el juego funciona igual sin configuración extra.

## 🔄 Cómo actualizar después
1. Cambias tu juego (`football-community.html`, músicas, etc.).
2. Sustituyes el contenido de esta carpeta:
   ```bash
   cp /home/user/football-community.html /home/user/vercel-deploy/index.html
   cp -r /home/user/assets /home/user/vercel-deploy/assets
   ```
3. **Si es con Git (Camino A):** `git add . && git commit -m "UI126" && git push` → Vercel **auto-despliega** en segundos.
   **Si es drag & drop (Camino B):** sube de nuevo la carpeta a tu proyecto en el dashboard → **Redeploy**.

## ⚠️ Lo único a vigilar
- Si te excedes de marcha de visitas (958 Hobby ~100MB)… solo pasa que se lentizan los assets (no cobran sin pedir pásale en la beta). Con tu peso (~24MB) vas sobradísimo.
- Si cambias el `BUILD UI1xx` activos, recuerda subir todo junto (html + assets) para que el juego y las canciones vayan parejito.

## ✅ Checklist publicable (ya está)
- Música legal propia (IA), no DMCA ✔
- SFX sintéticos sin archivos externos ✔
- localStorage + export/imports ✔
- Guía con Yamal ✔ · Sin dependencias externas ✔

¡Listo para subirlo al aire, míster! 🟡🔴⚽