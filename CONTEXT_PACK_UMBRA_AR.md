# CONTEXT PACK — UMBRA AR (TOOL-019)

Pegar al iniciar un chat dedicado **solo a la realidad aumentada**.
No tratar aquí la Creator Tool: tiene su propio chat y su propio pack.

---

Owner: Jorge Bonilla / IF&IF Studio 2026
Proyecto: **TOOL-019 — UMBRA AR**, dentro de GAME-015 (UMBRA).
Godot 4.6.3 · WebXR/ARCore · exportación Web. Repo **privado**
`Kinnard77/umbra-ar-godot`, local en `C:\Users\illus\ClaudeCode\ar-godot`.

## Qué leer, y solo esto

`C:\Users\illus\PROYECTOS_IA_MASTER\tt-creator-tool-pwa\diseno\ESTADO_AR_TRASPASO.md`

Es el único documento necesario para esta rama. Los otros cuatro de esa
carpeta son de diseño de juego y de la Creator Tool: **no hacen falta aquí**.

---

## LAS DOS VERTIENTES, y no se mezclan

Esta es la decisión que gobierna todo. **Hay dos formas de anclar contenido,
y cada una sirve para una cosa distinta.**

### EXTERIOR — el Dragón: por coordenadas GPS

Volúmenes **grandes y lejanos** que nadie va a tocar: dragones, portales
vistos de lejos, presencias en el cielo. **Toleran metros de error**, así que
el GPS basta y no hace falta nada de la calibración.

- Vive en el proyecto **cathedral**, no en ar-godot:
  `C:\Users\illus\Proyectos Generales\Desarrollo\cathedral`
- `scripts/geo_anchor.gd` coloca dos dragones por GPS; `geo_positioner.gd`
  convierte latitud/longitud a metros locales (ENU). **Ya funciona.**
- Coordenadas del dragón: `21.158101, -100.933963`.
  Origen del datum: `21.160969, -100.909439`. Altura del flotante: 15 m.
- La escena con AR real es `escenas/geo_test.tscn`, que usa
  `scripts/webxr_ar_manager.gd`. **Confirmado que hace AR real en navegador.**

**Lo que le falta al Dragón, en orden:**
1. **El rumbo.** El GPS dice a qué distancia está, pero **no en qué dirección
   miras**. La brújula del móvil se equivoca entre 10 y 30 grados, así que el
   dragón aparece a la distancia correcta pero girado. Solución para
   exteriores: hacer caminar unos metros en línea recta y deducir el rumbo
   real del propio GPS.
2. Su interfaz es 2D y **hereda los mismos fallos ya resueltos en ar-godot**
   (ver la tabla del documento). Aprovechar lo aprendido, no repetirlo.
3. `lelegion.com/catedral` **está roto**: su `index.pck` se sobrescribió con
   el del topógrafo. Arreglo en cPanel: borrar `index.pck` y renombrar
   `cathedral-index.pck` a `index.pck`. Copia local intacta en
   `Proyectos Generales\Desarrollo\cathedral\cathedral-index.pck` (27,7 MB).

### INTERIOR — el Cryptex: por calibración con 4 referencias

Objetos que el jugador **alcanza con la mano**. Exigen **precisión de un
metro**, que el GPS no da nunca y menos bajo techo.

- Vive en `ar-godot`. Publicado en **`lelegion.com/v10`** (la carpeta se
  llama v10 por historia; **la versión va en el botón**: "INICIAR AR · v26").
- `scripts/alineacion_rigida.gd`: encaje rígido de N puntos (Umeyama /
  Procrustes). **Verificado con 4 pruebas numéricas.** Cuatro referencias
  mejoran un 45% frente a dos y delatan la mal medida.
- `scripts/topografo.gd`: herramienta de campo en dos modos. TOPÓGRAFO mide
  las referencias y coloca el contenido; JUEGO reconstruye la alineación en
  una sesión nueva para medir el error como lo vería un jugador.
- **El GPS no entra en ningún cálculo**: todo es relativo a las cuatro
  referencias. Solo se anota como etiqueta del sitio.

---

## EL BLOQUEANTE

**ARCore subcuenta el desplazamiento en distancias largas.** Medido en campo:
26,20 m reales → **2,7 m** reportados. Antes: 6 m → 0,7; 10 m → 4,7.

**Pero en corto funciona**: Jorge colocó el Cryptex, se alejó, volvió sobre
sus pasos y las marcas seguían donde las puso. El fallo aparece al alejarse,
no por moverse rápido: camina despacio y con el móvil estable.

**La deriva vertical está confirmada y ya corregida**: las marcas aparecían
en el aire porque iban al plano y=0, que deriva. Ahora van 1,35 m por debajo
de la cámara.

### Siguiente paso, concreto

La **v26 ya muestra el estado del tracking permanentemente entre corchetes**
delante de cada mensaje: `[OK]`, `[PERDIDO]`, `[SIN TEXTURA]`, `[MOVIMIENTO]`.
Y desde la v17 hay **modo diagnóstico** (botón del medio antes de iniciar AR)
con posición cruda, línea recta desde el inicio, recorrido acumulado y fps.

**No hay que construir nada de eso: ya existe.** Hay que pedirle a Jorge que
**camine 25 m mirando el corchete** y diga qué pone al llegar.

- Si dice `PERDIDO` o `SIN TEXTURA` → ARCore deja de ver, y la solución va
  por ahí.
- Si dice `OK` y aun así cuenta 2,7 m → el problema es otro y mucho más raro.

**Los datos viven en el móvil de Jorge y el asistente no puede leerlos.**
Pedir siempre una foto de la pantalla.

---

## Descartado, no volver a proponerlo

- **VPS de Google (Geospatial API)**: no existe en WebXR, solo en SDK nativo.
- **VPS de Niantic para web**: lo están apagando (feb 2026 / feb 2027).
- **Plugin godot_arcore**: sin releases estables, no compila de forma fiable.
- **APK nativo con AR**: imposible hoy en Godot. Por eso todo va por WebXR.
- **AR por marcadores**: existe, exige imágenes planas, experimental en WebXR.

---

## Reglas que costaron horas

- **La versión, visible en el botón.** Sin eso se pierden horas discutiendo
  si el archivo llegó.
- **NO TOCAR los tamaños de botones y letras**: correctos desde la v14, en
  `_forzar_tamanos()`. Jorge lo pidió expresamente.
- **Anclajes proporcionales, nunca píxeles**: al entrar en AR cambia el
  lienzo y los textos se salen de la pantalla.
- **Guardar en el almacén del navegador**, no en `user://`: Godot no lo
  sincroniza al cerrar la pestaña y se pierde el levantamiento.
- **Publicar en carpeta versionada**: una carpeta nueva no tiene caché.
- **Solo se sube `index.pck`** (3 MB), por el File Manager de cPanel a
  `public_html/v10`. El `.wasm` son 37 MB y no cambia.
- **Exportar sin abrir Godot**:
  `Godot_v4.6.3-stable_win64.exe --headless --path <proy> --export-release "Web" <sal>/index.html`
  El ejecutable está en `Downloads\Godot_v4.6.3-stable_win64.exe\` — una
  carpeta con el mismo nombre que el .exe. El .exe suelto pesa 0 bytes.
- Tras exportar, poner `display: fullscreen` en `index.manifest.json`.
- **Los .glb desempaquetan sus texturas** como PNG sueltos y disparan el
  `.pck` de 114 KB a 14 MB. Vigilarlo.
- **Describir tamaños como fracción de pantalla**, nunca en porcentajes de
  cambio: "2,5 veces más grande" no significó nada útil.

---

## Otros datos de campo

- **Con poca luz el tracking se degrada.** Regla de diseño: la oscuridad
  **puede ser el destino, pero no el camino** — ARCore aguanta unos segundos
  con los sensores, pero no un recorrido a oscuras.
- Una catedral es, por lo demás, **excelente terreno**: piedra labrada,
  capiteles, suelos con despiece. Lo malo son las superficies lisas y
  uniformes y los reflejos.
- Jorge repite **siempre el mismo recorrido con 4 referencias medidas con
  láser**: es un banco de pruebas repetible, hay que aprovecharlo.
- La app **registra cada intento** y muestra media y peor caso en la pantalla
  de reposo. **Importa el PEOR caso**: el jugador no repite hasta que sale bien.

---

## Idea anotada, sin empezar

**Tableta informativa en AR** frente a obras de arte: un panel con datos y
unos números que dirijan la mirada del jugador a detalles concretos de la
obra real. **No necesita precisión**, basta con que aparezca delante. Se
puede desarrollar en paralelo a todo lo anterior.

---

## Qué necesito lograr en este chat

- (1) …
- (2) …
