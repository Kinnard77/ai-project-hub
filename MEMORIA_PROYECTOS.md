# Memoria de Proyectos de Desarrollo

Este documento recopila el estado actual, decisiones técnicas clave y tareas pendientes de los proyectos activos, extraído del análisis de `VOLCADO_BRUTO.md`.

## 1. Odisea Challenge (Frontend UI)
**Estado:** Funcional y desplegado en Vercel.
**Stack:** HTML5, CSS3, JavaScript, Git, Vercel.
**URL:** www.odiseachallenge.com

### Decisiones Clave
- **Pipeline de Despliegue:** Código Local -> GitHub -> Vercel (Automático).
- **Dominio:** Gestionado en Name.com con redirección DNS y SSL vía Vercel.

### Tareas Pendientes
- [ ] **Resolución de Activos:** Corregir carga de imágenes (ej. `landscape.png`) revisando casing (mayúsculas/minúsculas) y rastreo en Git (`git rm --cached`).
- [ ] **Limpieza:** Asegurar nombres de archivo en minúsculas en `resources/`.
- [ ] **Refactor:** Evaluar mover estilos inline a CSS externo para mantenibilidad.

---

## 2. Lotería Mexicana
**Estado:** MVP Funcional (Local).
**Stack:** React 18, Tailwind CSS, Hooks.

### Decisiones Clave
- **Algoritmo:** Fisher-Yates para barajado justo.
- **Arquitectura:** Separación de lógica (`useLoteriaGame`) de UI (`LoteriaCard`).
- **Datos:** Estructura flexible en `CATALOG_CARDS_DATA`.

### Tareas Pendientes
- [ ] **Persistencia (Backend):** Migrar a Firebase/Firestore para catálogo editable y usuarios.
- [ ] **UX Audio:** Integrar síntesis de voz o archivos para "cantar" cartas.
- [ ] **Multijugador:** Implementar WebSockets/Firestore Listeners para sincronización real-time.
- [ ] **Animaciones:** Mejorar transiciones con Framer Motion.

---

## 3. Iron & Gears (Barbería Dieselpunk)
**Estado:** Prototipo Funcional v1.2.
**Stack:** HTML5, Tailwind CSS, JS Vanilla, Lucide Icons.

### Decisiones Clave
- **Estética:** Dieselpunk (Verde Militar, Bronce, Neón Naranja).
- **Implementación:** Todo el código fuente en `index.html` para portabilidad inicial.
- **Simulación:** Visor 3D simulado con UI de realidad aumentada.

### Tareas Pendientes
- [ ] **3D Real:** Integrar Three.js para cargar modelos GLTF/OBJ reales.
- [ ] **AR Web:** Implementar `<model-viewer>` de Google para RA en móviles.
- [ ] **Configurador:** Vincular botones de materiales a cambios de textura reales.
- [ ] **Assets:** Reemplazar placeholders con renders fotorrealistas.

---

## 4. Chronos 1881 (App de Topografía Temporal)
**Estado:** Fase de Ingeniería 01 (Concepto y Arquitectura).
**Stack:** Godot 4.3+ (Core), Supabase (Backend), Next.js (CMS).

### Decisiones Clave
- **Modelo de Distribución:** Venta directa/sideload (sin tiendas de apps iniciales y evitando comisiones).
- **Arquitectura Híbrida:** 
    - **Core:** Godot para experiencia inmersiva 2D/UI Steampunk.
    - **Módulos:** Apps externas/WebViews para AR y OCR si Godot no alcanza.
    - **CMS:** Next.js + Supabase para gestión de misiones.
- **Enfoque de Negocio:** Híbrido (Validación con 1 ciudad -> Escalado).

### Tareas Pendientes
- [ ] **Módulos Técnicos (Core):**
    - **Anclaje GPS:** Sistema de fijación < 2s con compensación para interiores.
    - **Crono-Visión:** Integración OpenCV/ML Kit para reconocimiento de marcas de cantero.
- [ ] **Prototipo Godot:** Navegación base, Escenas, QR Scanner (Plugin).
- [ ] **Backend:** Configurar sistema de misiones JSON en Supabase (Base de Datos Arcano).
- [ ] **Contenido:** Mapeo inicial de Catedral de Dolores Hidalgo (fotos, narrativa).

---

## 5. Micropasos
**Estado:** Pivot Conceptual ("State of the World").
**Concepto:** Sistema de transformación de identidad gamificado (Viaje del Héroe).

### Decisiones Clave
- **Narrativa:** "Pergamino" que se desenrolla (destino) vs "Puerta cerrada".
- **Psicología:** El nivel es "fuerza de identidad", no dificultad. Decaimiento por inacción (fragilidad).
- **Oráculo:** Telegram como voz del sistema (personaje), no solo notificaciones.
- **Datos:** Registro de `identity_state`, `hero_stage`, `challenge_mode` en cada completion.
- **Algoritmo de Micropasos:** 
    ```javascript
    cappedLevel = min(level, target_level?)
    template = templates[microstep_mode] || first_microstep
    microstepText = template.replace("{level}", cappedLevel)
    ```

### Tareas Pendientes
- [ ] **UI Narrativa:** Implementar visualización de pergamino y etapa del héroe.
- [ ] **RAG Oráculo:** Implementar memoria conversacional basada en historial de completions.
- [ ] **GDD Vivo:** Mantener documento de diseño actualizado.

---

## 6. Viajes Backend (Odisea API)
**Estado:** Endpoints funcionales en Railway.
**Stack:** Node.js, Express, Supabase (HTTP API).
**Endpoint:** `https://api.odiseachallenge.com`

### Decisiones Clave
- **Conexión:** Uso exclusivo de Supabase HTTP/SDK (evitar Postgres TCP Directo/Poolers para evitar problemas de IPv6/SSL).
- **Infra:** Deploy en Railway. Variables de entorno `SUPABASE_SERVICE_KEY`.
- **Lógica:** Reservas tipo "HOLD" (60 min) antes de pago.

### Tareas Pendientes
- [ ] **Pagos:** Integrar Mercado Pago, Conekta y OXXO/SPEI.
- [ ] **Testing (Sin Postman):** Implementar endpoints temporales `GET /trips` y `GET /test-reservation` para validar lógica desde navegador.
- [ ] **QA:** Probar endpoint `POST /reservations` vía `GET /test-reservation`.
- [ ] **Tickets:** Generación de boleto con QR y endpoint de validación `GET /verify/:token`.
- [ ] **Seguridad:** Middleware de Auth y Rate Limiting.

---

## 7. The AI Project Hub
**Estado:** Concepto / Especificación Inicial.
**Objetivo:** Dashboard centralizado para visualizar el progreso de todos los proyectos (Mental Peace).
**Stack:** Vite + React + Tailwind + GitHub Pages.

### Estructura de Datos
- **Fuente de Verdad:** `status.json` (actualizado automáticamente por Antigravity).
- **Campos:** Proyecto, Estado (Activo/Espera/Update), Progreso (Backend/UI/Testing), Checkpoint diario.

### Decisiones Clave
- **Hosting Móvil:** Despliegue automático a GitHub Pages para consulta desde celular.
- **Visualización:** Tarjetas con barras de progreso animadas (Recharts/Framer Motion).
- **Flujo:** Antigravity actualiza `status.json` -> Script hace deploy -> Usuario consulta en móvil.

### Tareas Pendientes
- [ ] **Estructura:** Crear carpeta `project-hub` e inicializar proyecto Vite.
- [ ] **Datos:** Definir esquema JSON para `status.json` y script de actualización.
- [ ] **UI:** Diseñar Dashboard con tarjetas y barras de progreso.
- [ ] **Deploy:** Configurar Action/Script para deploy a GitHub Pages.
# Gobernanaza y Estrategia del Entorno

## Estrategia de Gobernanza: Source of Truth
Para garantizar la integridad de todos los proyectos gestionados por el AI Projects Hub, se establece la siguiente jerarquía de verdad:

1.  **PROJECT_REGISTRY.md (Maestro):** Es la única fuente de verdad autoritativa para la existencia, estado y fase de cualquier proyecto.
    *   Si un proyecto no está aquí con un ID asignado, **no existe** para efectos de automatización.
    *   Los campos `status`, `phase` y `focusNow` en este archivo sobreescriben cualquier otro dato.

2.  **Tasks.md (Detalle):** La fuente de verdad para el progreso granular (tareas completadas/pendientes).
    *   El Hub lee estos archivos en modo "solo lectura" para calcular el porcentaje de avance.

3.  **Status.json (Derivado):** Es un artefacto de *lectura* puro para la UI.
    *   No se edita manualmente.
    *   Se regenera automáticamente mediante scripts de sincronización (ej. `node scripts/sync_registry.js`) leyendo el Registry y los Tasks.

Esta estructura asegura que el "Architecto" (Usuario/IA) gestione la estrategia en el Registry, y la "Operación" se refleje en la UI sin conflictos.
