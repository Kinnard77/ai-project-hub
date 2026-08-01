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

    // Varios proyectos no traen todos los campos en status.json y la tarjeta
    // salia con huecos en blanco. Se rellenan desde el registro o con un
    // valor razonable: una tarjeta a medias parece rota, y el hub existe
    // justo para que Jorge vea el estado de un vistazo.
    const foco = c.focusNow || previo.pendingFocus || '';
    const fase = c.phase || previo.assistedPhase || '—';
    const asistido = previo.progressAssisted ?? 0;

    return {
      ...previo,
      id: p.id ?? previo.id,
      codigo: p.codigo,
      name: p.name || previo.name,
      esParaguas: p.esParaguas,
      status: c.status || previo.status || 'Active',
      tech: c.tech || previo.tech || c.repoFolder || '—',
      theme: previo.theme || 'violet',
      lastUpdate: previo.lastUpdate || new Date().toISOString().slice(0, 10),
      description: c.notes || c.description || previo.description || foco,
      humanContext: previo.humanContext || c.notes || foco,
      tasksSummary: previo.tasksSummary || (foco ? `Siguiente: ${foco}` : 'Sin tareas anotadas'),
      progressAssisted: asistido,
      progressAuditable: previo.progressAuditable ?? asistido,
      pendingFocus: foco,
      assistedPhase: fase,
      repo: c.repo || null,
      publicado: c.publicado || null,
      padre: c.padre || null,
      componentes: c.componentes || null,
      _urlTareas: urlTareas(c),
      enGitHub: true,
    };
  });
}

/**
 * Cuenta las casillas de un tasks.md. Esto es lo unico realmente auditable:
 * no una estimacion escrita a mano, sino lo que esta marcado como hecho.
 */
export function contarTareas(markdown) {
  const hechas = (markdown.match(/^\s*[-*]\s+\[[xX]\]/gm) || []).length;
  const pendientes = (markdown.match(/^\s*[-*]\s+\[ \]/gm) || []).length;
  const total = hechas + pendientes;
  if (!total) return null;

  // La primera pendiente es la siguiente a atacar: el orden del archivo es
  // deliberado, lo que bloquea va arriba.
  const linea = markdown.split('\n').find((l) => /^\s*[-*]\s+\[ \]/.test(l)) || '';
  const siguiente = linea
    .replace(/^\s*[-*]\s+\[ \]\s*/, '')
    .replace(/\*\*/g, '')
    .trim();

  return {
    hechas,
    pendientes,
    total,
    porcentaje: Math.round((hechas / total) * 100),
    siguiente,
  };
}

/** Deduce donde vive el tasks.md de un proyecto a partir de su campo repo. */
function urlTareas(campos) {
  if (campos.tareasUrl) return campos.tareasUrl;
  const repo = (campos.repo || '').match(/([\w.-]+\/[\w.-]+)/);
  if (!repo) return null;
  // Los privados no se pueden leer sin credenciales.
  if (/privado|private/i.test(campos.repo)) return null;
  return `https://raw.githubusercontent.com/${repo[1]}/main/tasks.md`;
}

/** Añade a cada proyecto el recuento real de sus tareas, si es accesible. */
async function conTareasReales(proyectos) {
  return Promise.all(
    proyectos.map(async (p) => {
      const url = p._urlTareas;
      if (!url) return p;
      try {
        const r = await fetch(url, { cache: 'no-store' });
        if (!r.ok) return p;
        const t = contarTareas(await r.text());
        if (!t) return p;
        return {
          ...p,
          progressAuditable: t.porcentaje,
          tareas: t,
          tasksSummary: `${t.hechas} de ${t.total} hechas · siguiente: ${t.siguiente}`,
        };
      } catch {
        return p;
      }
    })
  );
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

      const fundidos = await conTareasReales(fundir(interpretarRegistro(await r.text())));
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
