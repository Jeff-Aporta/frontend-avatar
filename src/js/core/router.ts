/**
 * router.ts — rutas reales, una página HTML por vista (tabla en `consts/paginas.ts`): `/`, `/acceso/`, `/panel/`,
 * `/canales/`, `/proyectos/`… Sin `#/` ni `?s=`. Cada página se genera con `<base href>` a la raíz del sitio, así que
 * `document.baseURI` es la raíz (en local y en GitHub Pages) y todas las URLs se resuelven igual desde cualquier página.
 *
 *   - Vista actual: el atributo `vista` de `<av-app>` (o la ruta del documento).
 *   - Sección fija en el camino (`/finanzas/facturas/`); entidad en `?s=` (`/canales/?s=…`), codificada en `consts/paginas.ts`.
 *     Recargar y compartir funcionan; una URL vieja `/canales/12/` se reemplaza por la nueva sin recargar.
 *   - Con `<av-app>` montado (`activarSpa`) tampoco recarga cambiar de vista: los enlaces internos y `ir()` hacen
 *     `pushState`, se actualizan título y metadatos, y el shell reemplaza solo el contenido. Cada página HTML sigue
 *     existiendo para la entrada directa, la recarga y el SEO. Atrás/adelante llegan por `popstate`.
 *   - Las páginas aisladas de QA (`view/<v>/`) no activan la SPA: ahí `ir()` carga la página.
 *
 * Las vistas privadas exigen sesión: sin ella se va a `acceso` recordando el destino.
 */
import type { Ruta } from '../consts/schemas/componentes.schemas.js';
import { interpretar, metasDe, PAGINAS, paginaDe, rutaDe, URL_PUBLICA, vistaDeRuta } from '../consts/paginas.js';
import { tagsDeVista } from '../kit-tags.js';

/** Vistas que exigen sesión (de la tabla de páginas). */
export const VISTAS_PRIVADAS: readonly string[] = PAGINAS.filter((p) => p.privada).map((p) => p.vista);
/** Vista por defecto sin sesión y tras iniciar sesión. */
export const VISTA_INICIAL = 'inicio';
export const VISTA_SESION = 'panel';
/** Vista de una URL que la tabla no declara. */
export const VISTA_404 = 'no-encontrada';

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
export function urlDe(vista: string, raiz: string, id?: string | number | null): string {
  return new URL(rutaDe(vista, id), raiz).href;
}

/** Ruta de una URL dada la raíz (pura); lo que la tabla no declara es `VISTA_404`. */
export function rutaDeUrl(url: string, raiz: string): Ruta {
  const base = new URL(raiz).pathname;
  const camino = new URL(url).pathname;
  const relativa = camino.startsWith(base) ? camino.slice(base.length) : camino;
  return interpretar(relativa, new URL(url).search) ?? { vista: VISTA_404, id: null };
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

let spa = false;

/** Fija el contenido de una etiqueta `<meta>` o `href` de un `<link>` que ya trae la página. */
function fijarMeta(selector: string, atributo: string, valor: string): void {
  document.head.querySelector(selector)?.setAttribute(atributo, valor);
}

/** Título y metadatos de una URL: los mismos de su HTML estático (`metasDe`). */
export function actualizarMetas(vista: string, id: string | null = null): void {
  const m = metasDe(vista, id);
  if (!m) {
    document.title = 'Página no encontrada · Avatar';
    fijarMeta('meta[name="robots"]', 'content', 'noindex, nofollow');
    return;
  }
  const url = new URL(m.ruta, URL_PUBLICA).href;
  document.title = m.titulo;
  document.documentElement.dataset['vista'] = vista;
  fijarMeta('meta[name="description"]', 'content', m.descripcion);
  fijarMeta('meta[name="robots"]', 'content', m.indexable ? 'index, follow' : 'noindex, nofollow');
  fijarMeta('link[rel="canonical"]', 'href', url);
  fijarMeta('meta[property="og:title"]', 'content', m.titulo);
  fijarMeta('meta[property="og:description"]', 'content', m.descripcion);
  fijarMeta('meta[property="og:url"]', 'content', url);
  fijarMeta('meta[name="twitter:title"]', 'content', m.titulo);
  fijarMeta('meta[name="twitter:description"]', 'content', m.descripcion);
  const previo = document.head.querySelector('script[type="application/ld+json"]');
  if (!m.jsonLd) {
    previo?.remove();
    return;
  }
  const dato = previo ?? document.head.appendChild(Object.assign(document.createElement('script'), { type: 'application/ld+json' }));
  dato.textContent = JSON.stringify(m.jsonLd);
}

const pedidas = new Map<string, Promise<unknown>>();
type Loader = { load(...tags: string[]): Promise<unknown> };

/** Pide al loader del kit una vista (sus `iswc-*` y sus componentes). Idempotente; sin loader, nada. */
export function precargar(vista: string): Promise<unknown> {
  const L = (globalThis as { iswcLoader?: Loader }).iswcLoader;
  const tags = tagsDeVista(vista);
  if (!L || !tags.length) return Promise.resolve();
  if (!pedidas.has(vista)) {
    pedidas.set(vista, L.load(...tags).catch((e: unknown) => {
      pedidas.delete(vista);
      console.warn(`[router] vista ${vista}:`, e);
    }));
  }
  return pedidas.get(vista)!;
}

/** URL de una vista para un `href`. */
export const hrefDe = (vista: string, id?: string | number | null): string => urlDe(vista, raiz(), id);
/** ¿La ruta actual es esa vista (y ese id, si se pide)? */
export function activa(vista: string, id?: string | null): boolean {
  const r = rutaActual();
  return r.vista === vista && (id === undefined || r.id === id);
}
/** Parámetros de la URL actual. */
export const params = (): URLSearchParams => new URLSearchParams(typeof location === 'undefined' ? '' : location.search);
/** Vuelve a la entrada anterior del historial. */
export const atras = (): void => history.back();

/** Vista interna de un clic en enlace, o null si el navegador debe atenderlo (otra pestaña, descarga, otro origen, otra ruta). */
export function rutaDelEnlace(e: MouseEvent, a: HTMLAnchorElement, base: string): Ruta | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  return rutaInterna(a, base);
}

/** Ruta interna de un enlace, o null si sale de la app (otro origen, destino propio, descarga o fuera de la tabla). */
function rutaInterna(a: HTMLAnchorElement, base: string): Ruta | null {
  if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return null;
  const destino = new URL(a.href, base);
  const raizSitio = new URL(base);
  if (destino.origin !== raizSitio.origin || !destino.pathname.startsWith(raizSitio.pathname) || destino.hash) return null;
  return interpretar(destino.pathname.slice(raizSitio.pathname.length), destino.search);
}

const enlaceDe = (e: Event) => e.composedPath().find((n) => n instanceof HTMLAnchorElement) as HTMLAnchorElement | undefined;

/** Enciende la navegación sin recarga: base absoluta (Chromium la re-resuelve contra cada URL nueva), enlaces y atrás/adelante. */
export function activarSpa(): void {
  if (spa || typeof document === 'undefined') return;
  spa = true;
  const inicial = rutaDeUrl(location.href, raiz()) as Ruta & { vieja?: boolean };
  document.querySelector('base')?.setAttribute('href', document.baseURI);
  if (inicial.vieja) reemplazar(inicial.vista, inicial.id);
  document.addEventListener('click', (e) => {
    const a = enlaceDe(e);
    const r = a ? rutaDelEnlace(e, a, raiz()) : null;
    if (!r) return;
    e.preventDefault();
    ir(r.vista, r.id);
  });
  document.addEventListener('pointerover', (e) => {
    const a = enlaceDe(e);
    const r = a ? rutaInterna(a, raiz()) : null;
    if (r) void precargar(r.vista);
  });
  addEventListener('popstate', () => {
    const r = rutaActual();
    actualizarMetas(r.vista, r.id);
  });
}

/** Cambia la entrada actual del historial por otra vista, sin avisar a nadie (redirección del arranque). */
export function reemplazar(vista: string, id: string | null = null): void {
  history.replaceState({ id }, '', urlDe(vista, raiz(), id));
  actualizarMetas(vista, id);
}

/** Redirige sin dejar entrada en el historial (Atrás no vuelve a rebotar aquí). Fuera de la SPA equivale a `ir`. */
export function redirigir(vista: string, id: string | number | null): void {
  const idTxt = id == null ? null : String(id);
  if (!spa) return ir(vista, idTxt);
  reemplazar(vista, idTxt);
  dispatchEvent(new CustomEvent(EVENTO, { detail: { vista, id: idTxt, intencion: null } }));
}

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
  if (spa) return rutaDeUrl(location.href, raiz());
  const declarada = document.documentElement.dataset['vista'];
  const vista = declarada && paginaDe(declarada) ? declarada : vistaDeUrl(location.href, raiz());
  adoptarId(vista);
  const id = (history.state as { id?: string | null } | null)?.id ?? null;
  return { vista, id };
}

/**
 * Navega: otra vista → `pushState` y el shell cambia el contenido (sin `<av-app>`, carga su página); misma vista → cambia el id.
 * `intencion` (p. ej. `tarea-nueva`) le pide a la vista destino que abra algo al montar; la toma con `tomarIntencion`.
 */
export function ir(vista: string, id?: string | number | null, intencion?: string): void {
  const idTxt = id == null || id === '' ? null : String(id);
  if (intencion) sesionStorage()?.setItem(CLAVE_INTENCION + vista, intencion);
  const actual = rutaActual();
  if (actual.vista === vista && actual.id === idTxt && !intencion) return;
  const mismaVista = actual.vista === vista;
  if (spa && !(mismaVista && actual.id === idTxt)) {
    history.pushState({ id: idTxt }, '', urlDe(vista, raiz(), idTxt));
    actualizarMetas(vista, idTxt);
  } else if (mismaVista && actual.id !== idTxt) history.pushState({ ...(history.state ?? {}), id: idTxt }, '');
  if (spa || mismaVista) {
    dispatchEvent(new CustomEvent(EVENTO, { detail: { vista, id: idTxt, intencion: mismaVista ? intencion ?? null : null } }));
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

/** Escucha los cambios de ruta sin recarga (navegación interna y atrás/adelante). Devuelve la función para dejar de escuchar. */
export function escuchar(fn: (ruta: Ruta) => void): () => void {
  const h = () => fn(rutaActual());
  addEventListener(EVENTO, h);
  addEventListener('popstate', h);
  return () => {
    removeEventListener(EVENTO, h);
    removeEventListener('popstate', h);
  };
}
