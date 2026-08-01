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

**Ya construido para diagnosticarlo (v17)**: con el botón del medio, *antes*
de iniciar AR, se activa el modo diagnóstico. Muestra en vivo el estado del
tracking, la posición cruda de la cámara, la distancia en línea recta desde
el inicio, el recorrido acumulado y los fotogramas por segundo.
**Pedirle a Jorge una foto de esa pantalla**: los datos viven en su móvil y
el asistente no puede leerlos.

Cómo interpretarla: si camina 10 m y la línea recta dice 2, la posición no
crece como debe. Si el recorrido acumulado sube pero la línea recta no, la
posición oscila sin avanzar. Si los fotogramas caen por debajo de diez, el
problema es de rendimiento.

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

## Los porqués — lo que más cuesta reconstruir

Jorge trabaja en varios proyectos a la vez y vuelve a este tras semanas. Los
datos los recupera de los archivos; **los porqués, no**. Aquí están:

- **Labyrinthos y no Templo ni Témenos.** Témenos no le decía nada a nadie;
  Recinto sonaba a jerga política; Templo gustaba pero no emocionaba. El
  laberinto se eligió porque las catedrales góticas *tenían* laberintos en el
  suelo que los peregrinos recorrían como iniciación, y porque el nombre
  además **sugiere cómo diseñar**: un laberinto tiene centro, recorrido y
  orden de llegada. En griego, no en español, por decisión suya.
- **El orgullo no necesita actor.** En una familia el público ya está dentro:
  a un niño le pesa más el reconocimiento de su padre que el de un extraño
  disfrazado. Y un diseño que exige contratar a alguien es frágil: no escala
  a cinco sedes ni funciona un martes por la mañana.
- **El miedo se descartó a propósito**, no por difícil. El miedo cierra la
  mirada y este juego necesita abrirla; además hay niños en el grupo.
- **Los artefactos son Elixir, no Orgullo.** El orgullo es inmediato; la
  Character Sheet, la taza y la cena llegan después. Su retraso deja de ser
  un defecto: el elixir se disfruta en el mundo ordinario.
- **La emoción no se elige, es consecuencia de la máquina.** Si hay que
  generar Urgencia, para eso está la Cuenta Regresiva, y no debe generarse
  Urgencia en otra etapa del arco.
- **La calibración manual sustituye al VPS.** El tracking de ARCore ya es
  centimétrico en corto; lo que le falta es saber dónde está anclado al
  mundo. Dos puntos fijan origen y rumbo; cuatro lo hacen un 45% mejor y
  delatan al mal medido. El ojo humano hace lo que haría la nube.
- **La oscuridad puede ser el destino, pero no el camino.** ARCore deja de
  seguirte si la recorre, pero aguanta unos segundos con los sensores.

## Pendiente de Jorge

- Comparativa Data Collection Box vs POIs (**no tocar** hasta que avise).
- ¿Personaje narrativo y rol jugable son la misma entidad?
- Enseñar la generación del personaje y la taza.
- Idea anotada: tableta informativa en AR frente a obras de arte.

## El hub, para consultar el estado

`kinnard77.github.io/ai-project-hub` lee **en vivo** el `PROJECT_REGISTRY.md`
de GitHub y cuenta las casillas de cada `tasks.md`. La barra *Auditable* es
real; la *Asistida* es una estimación. Editar el registro en GitHub basta:
la app lo refleja al recargar.

## Qué necesito lograr en este chat

- (1) …
- (2) …
