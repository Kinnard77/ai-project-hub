# HUB-007 — Cómo arreglar el hub para que sirva

Escrito el 1 de agosto de 2026, a partir de un fallo real: Jorge dejó de
consultar el hub **porque no le resolvía su necesidad**. Y su necesidad no
son archivos, es *ver sin esfuerzo qué queda pendiente en cada proyecto*.

---

## El diagnóstico

La app **no lee el repositorio**. Lee `src/data/status.json`, un archivo
estático que se empaqueta al compilar. Resultado: hay **dos verdades a la vez**
— los `.md` del repositorio, que están al día, y la app, que enseña lo de la
última compilación.

Y ahí está el fallo de fondo: **la herramienta que debía dar tranquilidad la
quita**, porque el usuario no sabe si lo que ve es cierto. Existen scripts
(`sync_status_from_tasks.ts`, `registry_validate.ts`) que regeneran ese JSON,
pero **exigen acordarse de ejecutarlos**. Cualquier sistema que dependa de la
memoria del usuario para estar al día está roto por diseño, porque el usuario
recurre a él precisamente cuando ya no recuerda.

---

## La solución: leer GitHub en vivo

GitHub Pages sirve archivos estáticos, pero **el navegador sí puede pedir
datos a GitHub en tiempo real**. Los repositorios públicos exponen sus
archivos sin necesidad de credenciales:

```
https://raw.githubusercontent.com/Kinnard77/ai-project-hub/main/PROJECT_REGISTRY.md
https://raw.githubusercontent.com/Kinnard77/ai-project-hub/main/TAREAS_UMBRA.md
```

Si la app los descarga al abrirse y los interpreta, **se actualiza sola** en
cuanto cambia un archivo. Sin compilar, sin desplegar, sin recordar nada.

### Cómo hacerlo, por pasos

1. **Leer el registro en vivo.** Descargar `PROJECT_REGISTRY.md` al arrancar y
   sacar de él los proyectos: ID, nombre, estado, fase, foco actual.
   `status.json` pasa a ser solo un respaldo por si falla la red.

2. **Leer las tareas de cada proyecto.** Un archivo `TAREAS_<ID>.md` por
   proyecto, con casillas `- [ ]` y `- [x]`. La tarjeta muestra **cuántas
   quedan y cuál es la siguiente**. Eso es exactamente lo que falta hoy.

3. **Marcar lo que está viejo.** Consultar la fecha del último commit de cada
   archivo con la API de GitHub y, si pasa de un mes, avisar en la tarjeta:
   *"sin actualizar desde el 3 de junio"*. Un dato desactualizado que se
   presenta como actual es peor que no tener dato.

4. **Enlazar a la fuente.** Cada tarjeta con un enlace directo al `.md` en
   GitHub, para editarlo desde el navegador y ver el cambio al recargar.

### Detalles a tener en cuenta

- La API de GitHub sin identificarse permite **60 peticiones por hora**.
  Suficiente, pero conviene guardar la respuesta un rato para no gastarlas.
- Los repositorios **privados no se pueden leer así**. `umbra-ar-godot` es
  privado: su estado tendrá que vivir en el registro del hub, que es público.
- Si GitHub no responde, usar `status.json` y **decirlo en pantalla**.

---

## Qué gana Jorge

Abre `kinnard77.github.io/ai-project-hub`, y ve **todos sus proyectos con sus
tareas pendientes reales**, actualizadas solas. Sin ejecutar scripts, sin
recordar comandos, sin dudar de si lo que ve es cierto.

Ese era el propósito del hub desde el principio. Hoy no lo cumple porque le
falta el último tramo: leer lo que ya está escrito.

---

## Nota de método

Este documento existe porque el hub falló en su propósito y conviene dejar
constancia de por qué, no solo de cómo arreglarlo. La regla que se deduce:
**un sistema de memoria no puede depender de que el usuario recuerde
alimentarlo.**
