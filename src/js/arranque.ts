/**
 * arranque.ts — el mismo arranque para TODAS las páginas (las genera `scripts/paginas.ts`; ninguna lleva script en
 * línea). Lee la vista de `<html data-vista>`, carga los estilos del kit y, por el loader pineado, solo lo que esa
 * página necesita: lo crítico del armazón + transversales + la vista (el resto del armazón, en reposo). En una página aislada de QA (`data-aislada`) además
 * conecta el API y restaura la sesión (ahí no hay `<av-app>`). Marca `data-app-ready` al terminar (watchdog de 6 s).
 * Por último pide al navegador precargar en reposo las otras páginas (Speculation Rules), para los saltos que sí cargan
 * documento (fuera de `<av-app>`), que `@view-transition` (en `app.scss`) funde con la página siguiente.
 */
import { PAGINAS } from './consts/paginas.js';
import { APP_TAGS, SHELL_DIFERIDO, shellInicial, tagsDeVista, VIEW_TAGS } from './kit-tags.js';
import { iniciarBitacora } from './core/bitacora.js';
import { iniciarParalaje } from './core/paralaje.js';

iniciarBitacora();

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
  // `moderate`: al apuntar un enlace, no todas de una (son decenas de páginas y en móvil cuesta datos)
  s.textContent = JSON.stringify({ prefetch: [{ source: 'list', urls, eagerness: 'moderate' }] });
  document.head.append(s);
}

try {
  const L = (globalThis as { iswcLoader?: Loader }).iswcLoader;
  if (!L) throw new Error('falta iswcLoader');
  const vista = raiz.dataset['vista'] && VIEW_TAGS[raiz.dataset['vista'] as keyof typeof VIEW_TAGS] ? raiz.dataset['vista'] : 'inicio';
  // Fase 1: lo que pinta la primera vista. Lo diferido llega en reposo y se define solo (los componentes guardan sus props).
  await L.loadPageStyles(['iswc-palettes-default']);
  await L.load(...shellInicial(vista), ...APP_TAGS, ...tagsDeVista(vista));
  const diferir = (globalThis as { requestIdleCallback?: (fn: () => void, o?: { timeout: number }) => void }).requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 400));
  diferir(() => void L.load(...SHELL_DIFERIDO, ...shellInicial('resto')), { timeout: 3000 });
  // el botón de reporte vive fuera de <av-app>: sobrevive a sus repintados
  if (!raiz.hasAttribute('data-aislada')) document.body.append(document.createElement('av-reporte'));
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
