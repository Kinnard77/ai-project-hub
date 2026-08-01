import { useState, useEffect, useCallback } from 'react';
import statusData from '../data/status.json';

/**
 * Lee PROJECT_REGISTRY.md directamente de GitHub, en vivo.
 *
 * POR QUE EXISTE
 * La app mostraba src/data/status.json, un archivo que se empaqueta al
 * compilar. Resultado: dos verdades a la vez — los .md al dia y la app
 * congelada en la ultima compilacion. Los scripts que regeneraban ese JSON
 * exigian acordarse de ejecutarlos, y uno acude al hub precisamente cuando
 * ya no recuerda.
 *
 * Regla que se deduce: un sistema de memoria no puede depender de que el
 * usuario recuerde alimentarlo.
 */

const REPO = 'Kinnard77/ai-project-hub';
const RAMA = 'main';
const CRUDO = `https://raw.githubusercontent.com/${REPO}/${RAMA}/PROJECT_REGISTRY.md`;

// Decidido con Jorge: media hora. La API sin identificarse permite 60
// peticiones por hora, asi que a este ritmo sobran de largo.
const VIGENCIA_MS = 30 * 60 * 1000;
const CLAVE = 'hub_registro_v1';

/** Convierte el markdown del registro en objetos. */
export function interpretarRegistro(markdown) {
  const proyectos = [];
  let actual = null;

  for (const cruda of markdown.split('\n')) {
    const linea = cruda.replace(/\r$/, '');

    // El sufijo UMBRELLA va DESPUES del (ID n), asi que se aparta antes de
    // buscar el identificador; si no, el nombre se traga el "(ID 15)".
    const esParaguas = /—\s*UMBRELLA\s*$/i.test(linea);
    const limpia = linea.replace(/\s*—\s*UMBRELLA\s*$/i, '');

    const cabecera = limpia.match(/^##\s+([A-Z]+-\d+)\s+—\s+(.+?)\s*(?:\(ID\s+(\d+)\))?\s*$/);
    if (cabecera) {
      if (actual) proyectos.push(actual);
      const [, codigo, nombre, id] = cabecera;
      actual = {
        codigo,
        name: nombre.trim(),
        esParaguas,
        id: id ? Number(id) : null,
        campos: {},
      };
      continue;
    }
    const campo = linea.match(/^-\s+([a-zA-ZñÑ_]+):\s*(.+)$/);
    if (campo && actual) actual.campos[campo[1]] = campo[2].trim();
  }
  if (actual) proyectos.push(actual);
  return proyectos;
}

/** Funde lo leido de GitHub con lo que ya trae status.json (tema, colores). */
function fundir(delRegistro) {
  return delRegistro.map((p) => {
    const previo = statusData.find((s) => s.id === p.id) || {};
    const c = p.campos;
    return {
      ...previo,
      id: p.id ?? previo.id,
      codigo: p.codigo,
      name: p.name || previo.name,
      esParaguas: p.esParaguas,
      status: c.status || previo.status,
      tech: c.tech || previo.tech,
      description: c.notes || c.description || previo.description,
      pendingFocus: c.focusNow || previo.pendingFocus,
      assistedPhase: c.phase || previo.assistedPhase,
      repo: c.repo || null,
      publicado: c.publicado || null,
      padre: c.padre || null,
      componentes: c.componentes || null,
      enGitHub: true,
    };
  });
}

export function useRegistroVivo() {
  const [proyectos, setProyectos] = useState(statusData);
  const [fuente, setFuente] = useState('local');
  const [actualizado, setActualizado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const traer = useCallback(async (forzar = false) => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (!forzar && guardado && Date.now() - guardado.cuando < VIGENCIA_MS) {
        setProyectos(guardado.proyectos);
        setFuente('github');
        setActualizado(new Date(guardado.cuando));
        return;
      }

      setCargando(true);
      setError(null);
      const r = await fetch(CRUDO, { cache: 'no-store' });
      if (!r.ok) throw new Error(`GitHub respondio ${r.status}`);

      const fundidos = fundir(interpretarRegistro(await r.text()));
      if (!fundidos.length) throw new Error('El registro llego vacio');

      setProyectos(fundidos);
      setFuente('github');
      const cuando = Date.now();
      setActualizado(new Date(cuando));
      localStorage.setItem(CLAVE, JSON.stringify({ cuando, proyectos: fundidos }));
    } catch (e) {
      // Si GitHub no responde se usa lo empaquetado, pero se DICE en pantalla:
      // un dato viejo presentado como actual es peor que no tener dato.
      setError(e.message);
      setFuente('local');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { traer(false); }, [traer]);

  return { proyectos, fuente, actualizado, cargando, error, refrescar: () => traer(true) };
}
