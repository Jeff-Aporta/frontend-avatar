/**
 * router.ts — rutas reales, una página HTML por vista (tabla en `consts/paginas.ts`): `/`, `/acceso/`, `/panel/`,
 * `/canales/`, `/proyectos/`… Sin `#/` ni `?s=`. Cada página se genera con `<base href>` a la raíz del sitio, así que
 * `document.baseURI` es la raíz (en local y en GitHub Pages) y todas las URLs se resuelven igual desde cualquier página.
 *
 *   - Vista actual: el atributo `vista` de `<av-app>` (o la ruta del documento).
 *   - Id del registro abierto (canal, proyecto, cliente…): viaja en el historial (`history.state.id`), no en la URL;
 *     al cambiar de página se entrega por `sessionStorage` y la página destino lo pasa a su historial (sobrevive a
 *     recargar y a atrás/adelante).
 *   - Cambiar de id dentro de la misma vista no recarga: `pushState` + evento `av-ruta`.
 *
 * Las vistas privadas exigen sesión: sin ella se va a `acceso` recordando el destino.
 */
import type { Ruta } from '../consts/schemas/componentes.schemas.js';
import { PAGINAS, paginaDe, vistaDeRuta } from '../consts/paginas.js';

/** Vistas que exigen sesión (de la tabla de páginas). */
export const VISTAS_PRIVADAS: readonly string[] = PAGINAS.filter((p) => p.privada).map((p) => p.vista);
/** Vista por defecto sin sesión y tras iniciar sesión. */
export const VISTA_INICIAL = 'inicio';
export const VISTA_SESION = 'panel';

const CLAVE_ID = 'av-id:';
const CLAVE_INTENCION = 'av-intencion:';
const CLAVE_DESTINO = 'av-destino';
const EVENTO = 'av-ruta';

const sesionStorage = (): Storage | null => {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage;
  } catch {
    return null;
  }
};

/** URL absoluta de la página de una vista dada la raíz del sitio (pura: la usan el router, el generador y las pruebas). */
export function urlDe(vista: string, raiz: string): string {
  return new URL(paginaDe(vista)?.ruta ?? '', raiz).href;
}

/** Vista de una URL dada la raíz del sitio (pura); fuera de la tabla → inicio. */
export function vistaDeUrl(url: string, raiz: string): string {
  const base = new URL(raiz).pathname;
  const camino = new URL(url).pathname;
  const relativa = camino.startsWith(base) ? camino.slice(base.length) : camino;
  return vistaDeRuta(relativa) ?? VISTA_INICIAL;
}

/** Raíz del sitio: el `<base href>` de la página (toda página generada lo trae). */
const raiz = (): string => (typeof document === 'undefined' ? 'http://localhost/' : document.baseURI);

/** Pasa el id entregado por la página anterior al historial de esta (una sola vez). */
function adoptarId(vista: string): void {
  const ss = sesionStorage();
  const id = ss?.getItem(CLAVE_ID + vista);
  if (id == null) return;
  ss!.removeItem(CLAVE_ID + vista);
  history.replaceState({ ...(history.state ?? {}), id }, '');
}

/** Ruta actual del documento. */
export function rutaActual(): Ruta {
  if (typeof document === 'undefined') return { vista: VISTA_INICIAL, id: null };
  const declarada = document.querySelector('av-app')?.getAttribute('vista') ?? document.documentElement.dataset['vista'];
  const vista = declarada && paginaDe(declarada) ? declarada : vistaDeUrl(location.href, raiz());
  adoptarId(vista);
  const id = (history.state as { id?: string | null } | null)?.id ?? null;
  return { vista, id };
}

/**
 * Navega: otra vista → su página (carga real, con transición de documento); misma vista → cambia el id sin recargar.
 * `intencion` (p. ej. `tarea-nueva`) le pide a la vista destino que abra algo al montar; la toma con `tomarIntencion`.
 */
export function ir(vista: string, id?: string | number | null, intencion?: string): void {
  const idTxt = id == null || id === '' ? null : String(id);
  if (intencion) sesionStorage()?.setItem(CLAVE_INTENCION + vista, intencion);
  const actual = rutaActual();
  if (actual.vista === vista) {
    if (actual.id === idTxt && !intencion) return;
    if (actual.id !== idTxt) history.pushState({ ...(history.state ?? {}), id: idTxt }, '');
    dispatchEvent(new CustomEvent(EVENTO, { detail: { vista, id: idTxt, intencion: intencion ?? null } }));
    return;
  }
  if (idTxt != null) sesionStorage()?.setItem(CLAVE_ID + vista, idTxt);
  location.assign(urlDe(vista, raiz()));
}

/** La intención pendiente para una vista (y la olvida): la vista la consulta al montar. */
export function tomarIntencion(vista: string): string | null {
  const ss = sesionStorage();
  const v = ss?.getItem(CLAVE_INTENCION + vista) ?? null;
  if (v != null) ss!.removeItem(CLAVE_INTENCION + vista);
  return v;
}

/** Decide a dónde va una ruta según haya sesión: privada sin sesión → acceso (recordando el destino). */
export function resolver(ruta: Ruta, conSesion: boolean): Ruta {
  if (!conSesion && VISTAS_PRIVADAS.includes(ruta.vista)) return { vista: 'acceso', id: null };
  return ruta;
}

/** Recuerda a dónde quería ir el usuario antes de pedirle sesión. */
export function recordarDestino(ruta: Ruta): void {
  sesionStorage()?.setItem(CLAVE_DESTINO, JSON.stringify(ruta));
}

/** Tras iniciar sesión: el destino recordado (y lo olvida) o el panel. */
export function destinoTrasAcceso(): Ruta {
  const ss = sesionStorage();
  try {
    const r = JSON.parse(ss?.getItem(CLAVE_DESTINO) ?? 'null') as Ruta | null;
    ss?.removeItem(CLAVE_DESTINO);
    if (r && VISTAS_PRIVADAS.includes(r.vista)) return r;
  } catch {
    /* destino corrupto: se ignora */
  }
  return { vista: VISTA_SESION, id: null };
}

/** Escucha los cambios de id en la misma página (navegación interna y atrás/adelante). Devuelve la función para dejar de escuchar. */
export function escuchar(fn: (ruta: Ruta) => void): () => void {
  const h = () => fn(rutaActual());
  addEventListener(EVENTO, h);
  addEventListener('popstate', h);
  return () => {
    removeEventListener(EVENTO, h);
    removeEventListener('popstate', h);
  };
}
