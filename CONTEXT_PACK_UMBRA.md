# CONTEXT PACK — UMBRA (GAME-015)

Pegar al iniciar un chat nuevo sobre UMBRA.

---

Owner: Jorge Bonilla / IF&IF Studio 2026
Proyecto: **GAME-015 — UMBRA**. Street game iniciático en catedrales,
parques y calles, para **familias de 3-4 personas**. Presencia física
obligatoria, anti-IA por diseño.

## Antes de nada, lee esto

En `Kinnard77/tt-creator-tool-pwa`, carpeta `diseno/`:

- **ESTADO_AR_TRASPASO.md** — el problema abierto, lo descartado y por qué,
  los 12 fallos ya resueltos con su causa real. **Empezar por aquí.**
- **FUSION_CREATOR_TOOL.md** — las tres capas, el vocabulario, qué se queda
  de cada herramienta.
- **ARCO_Y_MAQUINAS.md** — el arco de 8 etapas y las 12 máquinas.
- **ATLAS_DE_MAQUINAS.md** — catálogo operativo.
- **CONTRATO_CREATOR_GODOT.md** — el formato de intercambio.

## Los dos repositorios

- **Creator Tool** (herramienta de autor, Next.js + Supabase):
  `Kinnard77/tt-creator-tool-pwa` · local en `PROYECTOS_IA_MASTER\tt-creator-tool-pwa`
  Arranca con `npm run dev` en el puerto **3100**.
- **AR** (Godot 4.6.3, WebXR): `Kinnard77/umbra-ar-godot` (privado)
  local en `ClaudeCode\ar-godot`. Publicado en `lelegion.com/v10`.

## Vocabulario, cerrado

UMBRA es el juego · **Labyrinthos** la sede (catedral, parque, calle) ·
**Umbral** el nodo · **Ciclo** = 4 umbrales que forman un metapuzzle.

## Estado

**BLOQUEANTE**: ARCore no sigue el movimiento. Caminando 6 m reales, la app
reporta 0,7 m. Sin resolver esto, ninguna medida de precisión vale.
Siguiente paso: **pantalla de diagnóstico** — posición cruda de la cámara en
vivo, estado del tracking permanente, y el registro en texto para que Jorge
lo fotografíe (los datos viven en su móvil, el asistente no puede leerlos).

## Reglas de trabajo que costaron horas

- **Marcar la versión en pantalla** (el botón dice "INICIAR AR · v16").
- **No tocar los tamaños de botones y letras**: están perfectos desde v14.
- **Publicar en carpeta versionada** (`/v10/`): una carpeta nueva no tiene caché.
- **Solo se sube `index.pck`** (3 MB). El `.wasm` son 37 MB y no cambia.
- **Exportar sin abrir Godot**:
  `Godot_v4.6.3-stable_win64.exe --headless --path <proy> --export-release "Web" <sal>/index.html`
  (el ejecutable está en `Downloads\Godot_v4.6.3-stable_win64.exe\`)
- Tras exportar, poner `display: fullscreen` en `index.manifest.json`.
- Describir tamaños como **fracción de pantalla**, nunca en porcentajes.

## Pendiente de Jorge

- Comparativa Data Collection Box vs POIs (**no tocar** hasta que avise).
- ¿Personaje narrativo y rol jugable son la misma entidad?
- Enseñar la generación del personaje y la taza.
- Idea anotada: tableta informativa en AR frente a obras de arte.

## Qué necesito lograr en este chat

- (1) …
- (2) …
