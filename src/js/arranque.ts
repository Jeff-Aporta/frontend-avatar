/**
 * arranque.ts — el mismo arranque para TODAS las páginas (las genera `scripts/paginas.ts`; ninguna lleva script en
 * línea). Lee la vista de `<html data-vista>`, carga los estilos del kit y, por el loader pineado, solo lo que esa
 * página necesita: kit del armazón + transversales + la vista. En una página aislada de QA (`data-aislada`) además
 * conecta el API y restaura la sesión (ahí no hay `<av-app>`). Marca `data-app-ready` al terminar (watchdog de 6 s).
 * Por último pide al navegador precargar en reposo las otras páginas (Speculation Rules): navegar entre rutas reales
 * es casi instantáneo, y `@view-transition` (en `app.scss`) funde una página con la siguiente.
 */
import { PAGINAS } from './consts/paginas.js';
import { APP_TAGS, SHELL_KIT_TAGS, tagsDeVista, VIEW_TAGS } from './kit-tags.js';

type Loader = { loadPageStyles(n: string[]): Promise<unknown>; load(...tags: string[]): Promise<unknown> };

const raiz = document.documentElement;
const listo = () => raiz.setAttribute('data-app-ready', '');
const watchdog = setTimeout(() => {
  console.warn('[av] el arranque excedió 6 s; se revela la página');
  listo();
}, 6000);

/** Precarga (solo el HTML, que es mínimo) de las demás páginas; los módulos ya quedan en caché HTTP. */
function precargarPaginas(vista: string): void {
  if (!HTMLScriptElement.supports?.('speculationrules')) return;
  const urls = PAGINAS.filter((p) => p.vista !== vista).map((p) => new URL(p.ruta, document.baseURI).href);
  const s = document.createElement('script');
  s.type = 'speculationrules';
  s.textContent = JSON.stringify({ prefetch: [{ source: 'list', urls }] });
  document.head.append(s);
}

try {
  const L = (globalThis as { iswcLoader?: Loader }).iswcLoader;
  if (!L) throw new Error('falta iswcLoader');
  const vista = raiz.dataset['vista'] && VIEW_TAGS[raiz.dataset['vista'] as keyof typeof VIEW_TAGS] ? raiz.dataset['vista'] : 'inicio';
  await L.loadPageStyles(['iswc-palettes-default']);
  await L.load(...SHELL_KIT_TAGS, ...APP_TAGS, ...tagsDeVista(vista));
  if (raiz.hasAttribute('data-aislada')) {
    const { conectar, cargarPerfil } = await import('./core/api.js');
    conectar();
    await cargarPerfil().catch(() => undefined);
  }
  precargarPaginas(vista);
} catch (e) {
  console.warn('[av] arranque', e);
} finally {
  clearTimeout(watchdog);
  listo();
}
