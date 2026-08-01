# PROJECT REGISTRY — AI PROJECTS HUB (v1.0)
Owner: Jorge Bonilla / IF&IF Studio 2026

## HUB-007 — The AI Project Hub (OFICIAL) (ID 7)
- repoFolder: The AI Projects Hub App
- status: Active
- phase: FASE 2 (Auditable 0%)
- focusNow: LEER GITHUB EN VIVO — la app usa src/data/status.json estatico y
  muestra datos viejos. Plan en MEJORA_HUB.md
- notes: HUB oficial. Sin snapshots/muestras.
- fallo detectado (1 ago 2026): Jorge dejo de consultarlo porque no le
  resuelve ver que queda pendiente. Un sistema de memoria no puede depender
  de que el usuario recuerde alimentarlo.

## GAME-015 — UMBRA (ID 15) — UMBRELLA
- repoFolder: (paraguas, sin repo propio)
- componentes: TOOL-018 (Creator Tool) · TOOL-019 (AR)
- repos: Kinnard77/tt-creator-tool-pwa (Creator Tool) · Kinnard77/umbra-ar-godot (AR, privado)
- status: Active
- phase: P1 (arquitectura cerrada, validación de precisión en curso)
- focusNow: BLOQUEANTE — ARCore no sigue el movimiento (6 m reales = 0,7 m medidos)
- publicado: lelegion.com/v10 (topógrafo AR) · lelegion.com/catedral
- vocabulario: UMBRA el juego · Labyrinthos la sede · Umbral el nodo · Ciclo = 4 umbrales
- diseño: ver carpeta `diseno/` en tt-creator-tool-pwa (5 documentos)
- decidido: se juega en FAMILIAS de 3-4 · 12 máquinas · arco de 8 etapas · 5 ciclos = etapas II-VI
- notes: Nace del chat Pantheon/Catedrales. Presencia obligatoria. Anti-IA por diseño.

## TOOL-018 — UMBRA Creator Tool (ID 18)
- padre: GAME-015 (UMBRA)
- repo: Kinnard77/tt-creator-tool-pwa (público)
- repoFolder: PROYECTOS_IA_MASTER	t-creator-tool-pwa
- status: Active
- phase: P1 — arco y validador implementados; falta la capa de anclas
- tech: Next.js 14 + Supabase + Dexie (offline-first) + Leaflet
- arranque: `npm run dev` → puerto 3100 (el 3000 es de la herramienta antigua)
- focusNow: pantalla de anclas, y fusión por capas con tt-creator-tool
- hecho: renombrado a Labyrinthos · 12 máquinas y arco de 8 etapas · validador
  · curva emocional · login y RLS · registro con media y peor caso
- tareas: `tasks.md` del repo · diseño en `diseno/` (5 documentos)
- notes: Herramienta de autor, solo la usa Jorge. Produce el JSON que consume
  el cliente de Godot. NO tocar la Data Collection Box hasta que Jorge haga
  su comparativa con los POIs.

## TOOL-019 — UMBRA AR (Godot/WebXR) (ID 19)
- padre: GAME-015 (UMBRA)
- repo: Kinnard77/umbra-ar-godot (PRIVADO — el hub no puede leerlo)
- repoFolder: ClaudeCoder-godot
- status: Active
- phase: P1 — bloqueado en validación de precisión
- tech: Godot 4.6.3 · WebXR/ARCore · exportación Web
- publicado: lelegion.com/v10 (topógrafo) · lelegion.com/catedral
- focusNow: **BLOQUEANTE** — ARCore no sigue el movimiento (6 m reales = 0,7 m)
- hecho: AR real verificado en dispositivo · calibración por 4 referencias
  (Umeyama) con 4 pruebas numéricas · registro de intentos
- notes: Al ser privado, su estado debe mantenerse aquí a mano. Reglas de
  trabajo y los 12 fallos resueltos en `diseno/ESTADO_AR_TRASPASO.md` del
  repo de la Creator Tool.

## APP-005 — Micropasos App (ID 5)
- repoFolder: Micropasos App/micropasos---app
- status: Active
- focusNow: Auth flows (reset/verify) + UX optimistic

## OPS-010 — Agente Operativo: Arquitecto Silencioso (ID 10)
- repoFolder: AgenteOperativo
- status: Active
- notes: App interna para operación de viajes (ciudades, itinerarios, control operativo).
- focusNow: Implementación de Mapa de Salidas (Leaflet) + Filtros de fecha (Vie-Dom)

## GAME-001 — Odisea Challenge (Frontend) (ID 1)
- repoFolder: OdiseaChallenge
- status: Active

## APP-006 — Viajes Backend (ID 6)
- repoFolder: Viajes Backend
- status: Active
- tech: Node/Express/Supabase

## UI-008 — Travel Booking UI (ID 8)
- repoFolder: Travel Booking UI
- status: Active
- tech: HTML/CSS/JS + Tailwind

## PROG-016 — Odisea Travel Platform (UMBRELLA) (ID 16)
- status: Active
- fronts:
  - APP-006 — Viajes Backend (ID 6)
  - UI-008 — Travel Booking UI (ID 8)
- contrato: UI consume API del Backend (reservas, disponibilidad, pagos)
- focusNow:
  - definir endpoints mínimos del backend
  - tareas auditable para ambos frentes

## APP-002 — Lotería Mexicana (ID 2)
- status: Active

## APP-003 — Iron & Gears (ID 3)
- status: Active

## GAME-004 — Chronos 1881  (ID 4)
- status: Planning

## GAME-009 — RiddleSphere: Neon Challenge (ID 9)
- status: Active

## APP-017 — Digital Health Sentinel (ID 17)
- repoFolder: Digital-Health-Sentinel
- status: Planning
- phase: P0 (Conceptualización)
- focusNow: Solo registro inicial. Prioridad BAJA.
- notes: App de vigilancia de consumo digital y bienestar mental (Dieta de Contenido). Notificaciones vía Telegram.
