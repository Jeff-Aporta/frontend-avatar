/**
 * arranque.ts — el mismo arranque para TODAS las páginas (las genera `scripts/paginas.ts`; ninguna lleva script en
 * línea). Lee la vista de `<html data-vista>` y, por el loader pineado, pide solo lo que esa página necesita. Las hojas
 * base del kit (`is-base`, paletas) y el cierre de módulos del armazón ya vienen en el HTML (`<link>` y `modulepreload`).
 *
 *   1. Crítico: el armazón inicial de la vista (`shellInicial`) + `<av-app>`, que trae su propio esqueleto mientras la
 *      vista se define. Con eso definido (`ensure`) se marca `data-app-ready` y la página se revela.
 *   2. Progresivo (a la vez, sin esperar): transversales (`APP_TAGS`) y la vista; se «upgradean» al llegar.
 *   3. En reposo, tras el primer pintado: `SHELL_DIFERIDO` y el resto del armazón.
 *
 * En una página aislada de QA (`data-aislada`) no hay `<av-app>`: lo crítico es toda la vista, y además se conecta el API
 * y se restaura la sesión. Watchdog de 6 s. Por último pide al navegador precargar en reposo las otras páginas (Speculation
 * Rules), para los saltos que sí cargan documento (fuera de `<av-app>`), que `@view-transition` (en `app.scss`) funde con
 * la página siguiente. Sin top-level await: todo corre dentro de `arrancar()`.
 */
import { PAGINAS } from './consts/paginas.js';
import { APP_TAGS, SHELL_DIFERIDO, shellInicial, tagsDeVista, VIEW_TAGS } from './kit-tags.js';
import { iniciarBitacora } from './core/bitacora.js';
import { iniciarParalaje } from './core/paralaje.js';

iniciarBitacora();

type Loader = { load(...tags: string[]): Promise<unknown>; ensure(tag: string): Promise<unknown> };

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

const diferir = (globalThis as { requestIdleCallback?: (fn: () => void, o?: { timeout: number }) => void }).requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 400));

async function arrancar(): Promise<void> {
  try {
    const L = (globalThis as { iswcLoader?: Loader }).iswcLoader;
    if (!L) throw new Error('falta iswcLoader');
    const vista = raiz.dataset['vista'] && VIEW_TAGS[raiz.dataset['vista'] as keyof typeof VIEW_TAGS] ? raiz.dataset['vista'] : 'inicio';
    const aislada = raiz.hasAttribute('data-aislada');
    const progresivo = [...APP_TAGS, ...tagsDeVista(vista)];
    const critico = aislada ? [...shellInicial(vista), ...progresivo] : [...shellInicial(vista), 'av-app'];
    // Lo progresivo sale a la vez que lo crítico (sus módulos ya vienen precargados por el HTML), pero no se espera.
    if (!aislada) void L.load(...progresivo).catch((e) => console.warn('[av] carga progresiva', e));
    await Promise.all(critico.map((t) => L.ensure(t)));
    // el botón de reporte vive fuera de <av-app>: sobrevive a sus repintados
    if (!aislada) document.body.append(document.createElement('av-reporte'));
    if (aislada) {
      const { conectar, cargarPerfil } = await import('./core/api.js');
      conectar();
      await cargarPerfil().catch(() => undefined);
    }
    clearTimeout(watchdog);
    listo();
    // Tras el primer pintado: lo diferido del armazón (paleta de comandos, búsqueda, selectores, panel lateral).
    diferir(() => void L.load(...SHELL_DIFERIDO, ...shellInicial('resto')), { timeout: 3000 });
    precargarPaginas(vista);
  } catch (e) {
    console.warn('[av] arranque', e);
  } finally {
    clearTimeout(watchdog);
    listo();
  }
}

void arrancar();
