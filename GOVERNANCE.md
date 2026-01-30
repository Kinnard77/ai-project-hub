# GOVERNANCE — AI PROJECTS HUB

## Reglas de Oro
1. **Source of Truth**: Si no está en `PROJECT_REGISTRY.md`, el proyecto no existe oficialmente.
2. **Evidencia**: Nada está DONE sin evidencia (URL, screenshot, log).
3. **Visibilidad**: Cambios visibles requieren run verde en Actions + verificación del bundle.

## Definition of Done (DoD)
Para cambios operacionales y de código:
- [x] Code committed & pushed to `main`
- [x] GitHub Actions workflow (Deploy pages) **GREEN**
- [x] Verificación de bundle (`npm run pages:verify`) exitosa
- [ ] (Opcional) Verificación visual en `kinnard77.github.io`
