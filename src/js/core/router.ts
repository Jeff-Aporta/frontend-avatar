/**
 * router.ts — rutas por hash (`#/<vista>/<id>`), sin DOM salvo `location`/`window`.
 *
 *   #/                 → inicio (landing pública)
 *   #/acceso           → login
 *   #/panel            → dashboard             #/canales/12  → canal 12
 *   #/proyectos/3      → tablero del proyecto  #/crm · #/organizacion · #/asistente · #/admin
 *
 * Las vistas privadas exigen sesión: sin ella se redirige a `acceso` recordando el destino.
 */
import type { Ruta } from '../consts/schemas/componentes.schemas.js';
import { VIEW_TAGS } from '../kit-tags.js';

/** Vistas que exigen sesión. */
export const VISTAS_PRIVADAS: readonly string[] = ['panel', 'canales', 'proyectos', 'crm', 'organizacion', 'asistente', 'admin'];
/** Vista por defecto con sesión y sin ella. */
export const VISTA_INICIAL = 'inicio';
export const VISTA_SESION = 'panel';

const VISTAS = new Set(Object.keys(VIEW_TAGS));

/** `#/canales/12` → `{ vista: 'canales', id: '12' }`; vacío o desconocido → inicio. */
export function parsear(hash: string): Ruta {
  const limpio = hash.replace(/^#\/?/, '');
  const [vista = '', id = ''] = limpio.split('/').map((s) => decodeURIComponent(s));
  if (!vista) return { vista: VISTA_INICIAL, id: null };
  if (!VISTAS.has(vista)) return { vista: VISTA_INICIAL, id: null };
  return { vista, id: id || null };
}

/** Hash de una ruta. */
export function hashDe(vista: string, id?: string | number | null): string {
  return `#/${vista}${id == null || id === '' ? '' : `/${encodeURIComponent(String(id))}`}`;
}

/** Ruta actual del documento. */
export function rutaActual(): Ruta {
  return parsear(typeof location === 'undefined' ? '' : location.hash);
}

/** Navega (cambia el hash; el oyente de `hashchange` hace el resto). */
export function ir(vista: string, id?: string | number | null): void {
  const h = hashDe(vista, id);
  if (location.hash === h) return;
  location.hash = h;
}

/** Decide a dónde va una ruta según haya sesión: privada sin sesión → acceso; acceso/inicio con sesión → la misma (el usuario puede ver la landing). */
export function resolver(ruta: Ruta, conSesion: boolean): Ruta {
  if (!conSesion && VISTAS_PRIVADAS.includes(ruta.vista)) return { vista: 'acceso', id: null };
  return ruta;
}

/** Escucha los cambios de hash. Devuelve la función para dejar de escuchar. */
export function escuchar(fn: (ruta: Ruta) => void): () => void {
  const h = () => fn(rutaActual());
  addEventListener('hashchange', h);
  return () => removeEventListener('hashchange', h);
}
