# TAREAS — UMBRA (GAME-015)

Estado a 1 de agosto de 2026. Lo que falta, en orden.

---

## BLOQUEANTE — nada avanza hasta resolver esto

- [ ] **Diagnosticar por qué ARCore no sigue el movimiento.**
      Caminando 6 m reales, la app reporta 0,7 m. En otro intento, 10 m → 4,7 m.
      Construir pantalla de diagnóstico: posición cruda de la cámara en vivo,
      estado del tracking permanente en grande, y el registro en texto para
      fotografiar (los datos viven en el móvil, el asistente no los ve).

- [ ] **Medir el error real del sistema** con el recorrido de 4 referencias ya
      medido con láser. Repetir 3-4 veces. **Importa el PEOR caso, no la media.**
      Criterio: <50 cm seguimos · 50 cm-1,5 m sirve con ajustes · >2 m replantear.

---

## Depende del número anterior

- [ ] Manual de referenciado para interiores (catedral): cómo elegir y medir
      las referencias con el láser, cómo distribuirlas, cómo documentarlas.
- [ ] Pantalla de anclas en la Creator Tool: coordenadas locales métricas,
      foto obligatoria, descripción de identificación, tipo calibración/contenido.
- [ ] ContentDB en Godot: cargador del export `tt-content/3.0`.
- [ ] Integrar el AR real en el proyecto cathedral (hoy usa fake AR con
      CameraServer en `lucas.gd`).
- [ ] Medir a qué nivel de luz deja de funcionar el tracking. Determina dónde
      se puede poner contenido anclado dentro de una catedral.

---

## Creator Tool — construcción

- [ ] **Fusión por capas** (no es fusión, son capas): base UMBRA + trasplante
      del offline-first con Dexie, la ficha completa de POI, el esquema con
      autenticación y el export.
- [ ] Conectar Data Collection Box con POIs: el saber alimenta los puzles.
      **NO TOCAR hasta que Jorge haga su comparativa.**
- [ ] Collection Box a nivel de Labyrinthos, no solo por umbral: hay saber que
      no pertenece a ningún punto (el Tetramorfo son 4 ubicaciones, un símbolo).
- [ ] Etiquetas y enlaces entre entradas (copiar `ct_links` del otro proyecto).
- [ ] Modo GamePlayer: ver cada umbral como lo verá el jugador, sin campos.
- [ ] Interfaz para `estado_inicial` y `estado_final` del Labyrinthos.
      Las columnas existen en la base de datos, la pantalla no.

---

## Decisiones pendientes de Jorge

- [ ] **¿Personaje narrativo y rol jugable son la misma entidad?**
      Afecta al esquema. Se juega en familias de 3-4 y tres máquinas exigen roles.
- [ ] Comparativa Data Collection Box vs POIs.
- [ ] Enseñar la generación del personaje y la taza (para conectarla al elixir).
- [ ] Corregir `project.md`: dice que Pan y Luzbel son "fuerzas, no personajes",
      y ya se decidió que sí son personajes secundarios.

---

## Ideas anotadas, sin empezar

- [ ] **Tableta informativa en AR** frente a obras de arte: números que dirijan
      la mirada del jugador a detalles concretos. No necesita precisión, se
      puede desarrollar en paralelo.
- [ ] Enviar o copiar los datos medidos desde el móvil, para no depender de
      apuntar a mano en la catedral.
- [ ] Rectificar los croquis de catedrales con medidas de láser para
      convertirlos en planos a escala.

---

## Hecho (para no repetirlo)

AR real funcionando y publicado · calibración por 4 referencias verificada con
4 pruebas numéricas · credenciales fuera del repo público y login añadido ·
renombrado a Labyrinthos completo · las 12 máquinas y el arco de 8 etapas
implementados con validador · registro de intentos con media y peor caso ·
ambos repos en GitHub · 5 documentos de diseño guardados en `diseno/`.
