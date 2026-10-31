/**
 * <av-app> — shell de Avatar. No dibuja estructura propia: compone los armazones del kit.
 *
 *   - Área pública (landing, acceso): `<iswc-app-shell>` (barra superior con marca, sesión y tema).
 *   - Área privada (con sesión): `<iswc-doc-layout>` (el mismo layout documental del kit): barra con marca, empresa,
 *     sesión y tema; lateral `start` redimensionable (`iswc-split-panel` del kit, recordado por tamaño de pantalla y
 *     cajón en celular) con los módulos en `<iswc-doc-index>` (agrupados, con ícono y búsqueda); la vista al centro.
 *
 * Cada ruta es una página HTML real (`consts/paginas.ts`) cuyo cuerpo es solo `<av-app vista="…">`. Arranque: restaura
 * la sesión (token en localStorage → `empresas/yo` + `GET /permisos`), resuelve la ruta (una vista privada sin sesión va
 * a la página de `acceso` recordando el destino) y monta el shell de la vista con `props = { id }`. Carga perezosa: cada vista se
 * pide al navegar (`cargarVista`), se precargan en reposo las probables y, mientras se define, se ve un esqueleto.
 */
import { avisar, crearComponente, define, html } from '../../base/componente.js';
import type { AvAppProps, Ruta } from '../../consts/schemas/componentes.schemas.js';
import { cargarPerfil, cerrarSesion, conectar, iniciarSesion, mensajeDe, perfilesPrueba } from '../../core/api.js';
import { alCambiar, empresaActiva, estado, haySesion } from '../../core/estado.js';
import { ACCION, puede, rolDe } from '../../core/permisos.js';
import { destinoTrasAcceso, escuchar, ir, recordarDestino, resolver, rutaActual, VISTA_SESION, VISTAS_PRIVADAS } from '../../core/router.js';
import { MODULOS, type Modulo } from '../../consts/comandos.js';
import { COLUMNAS_PIE } from '../../consts/paginas.js';
import { PAGINAS } from '../../consts/paginas.js';
import { tagsDeVista, VIEW_TAGS } from '../../kit-tags.js';
import './av-empresa-selector.js';
import './av-perfil-selector.js';
import './av-perfiles-tabla.js';

/** Vista → tag del shell de esa vista (cada vista tiene UN shell; la tabla de páginas es la fuente). */
const SHELLS: Record<string, string> = Object.fromEntries(PAGINAS.map((p) => [p.vista, p.shell]));

type SesionEl = HTMLElement & { logged: boolean; loading: boolean; error: string; reset(): void };
type ConProps = HTMLElement & { props: Record<string, unknown> };
type IndiceEl = HTMLElement & { items: unknown[]; current: string };
type LayoutEl = HTMLElement & { scrollContentTo?(top: number): void };
type Loader = { load(...tags: string[]): Promise<unknown> };
type ConIdle = { requestIdleCallback?(fn: () => void, o?: { timeout: number }): number };

/** Módulos visibles: solo los que tienen vista registrada; Administración solo con `avatar.seguridad`. */
export function modulos(admin: boolean): Modulo[] {
  const vistas = new Set(Object.keys(VIEW_TAGS));
  return MODULOS.filter((m) => vistas.has(m.id) && (m.id !== 'admin' || admin));
}

const pedidas = new Map<string, Promise<unknown>>();
/**
 * Pide al loader del kit una vista: sus `iswc-*` y sus componentes (`tagsDeVista`). Idempotente y compartida: dos
 * pedidos de la misma vista esperan la misma promesa. Sin loader (pruebas sin navegador), nada.
 */
export function cargarVista(vista: string): Promise<unknown> {
  const L = (globalThis as { iswcLoader?: Loader }).iswcLoader;
  const tags = tagsDeVista(vista);
  if (!L || !tags.length) return Promise.resolve();
  if (!pedidas.has(vista)) {
    pedidas.set(vista, L.load(...tags).catch((e: unknown) => {
      pedidas.delete(vista);
      console.warn(`[av-app] vista ${vista}:`, e);
    }));
  }
  return pedidas.get(vista)!;
}

/** Vistas que conviene tener listas: con sesión, las del trabajo (las más usadas primero); sin sesión, el acceso. */
export function vistasProbables(conSesion: boolean): string[] {
  return conSesion ? ['panel', 'canales', 'correos', 'proyectos', 'crm', 'finanzas', 'inventario', 'rrhh', 'asistente', 'organizacion', 'admin'] : ['acceso'];
}

/** En reposo, una vista por vez (sin competir con lo que el usuario está mirando). */
function precargarEnReposo(vistas: string[]): void {
  const g = globalThis as ConIdle;
  const esperarReposo = (fn: () => void) => (g.requestIdleCallback ? g.requestIdleCallback(fn, { timeout: 4000 }) : setTimeout(fn, 600));
  const siguiente = () => {
    const v = vistas.shift();
    if (!v) return;
    void cargarVista(v).then(() => esperarReposo(siguiente));
  };
  esperarReposo(siguiente);
}

/** El shell de una vista, con esqueleto mientras su tag no está definido (carga perezosa). */
function montarVista(vista: string, id: string | null, conSesion: boolean): DocumentFragment {
  const tag = SHELLS[vista] ?? SHELLS['inicio']!;
  void cargarVista(vista);
  const shell = document.createElement(tag) as ConProps;
  // Solo las vistas con registro abierto reciben `id` (las demás no lo declaran).
  if (vista === 'inicio' || !SHELLS[vista]) shell.props = { sesion: conSesion };
  else if (id != null) shell.props = { id };
  const frag = document.createDocumentFragment();
  frag.append(shell);
  if (!customElements.get(tag)) {
    const esqueleto = document.createElement('av-vacio') as ConProps;
    esqueleto.props = { estado: 'cargando' };
    esqueleto.classList.add('esqueleto');
    frag.append(esqueleto);
    void customElements.whenDefined(tag).then(() => esqueleto.remove());
  }
  return frag;
}

/**
 * Pie de la app, en columnas: marca, enlaces del sitio, pruebas y tema. La paleta y el modo van aquí, a la vista, para
 * comparar temas mientras se prueba; cambiarlos reescribe `<html>` y TODA la interfaz se re-tiñe. «Perfiles de prueba» es
 * una acción: abre la tabla con usuario, nombre y PIN.
 */
function pie(slot: string | null) {
  return html`
    <footer class="pie" part="pie" slot=${slot}>
      <div class="pie-col pie-col-marca">
        <span class="pie-marca"><av-logo wordmark></av-logo></span>
        <span class="pie-lema">Gestión digital y automatización · Odys</span>
      </div>
      ${COLUMNAS_PIE.map((c) => html`
        <nav class="pie-col" aria-label=${c.titulo}>
          <strong class="pie-titulo">${c.titulo}</strong>
          ${c.enlaces.map((e) => html`<a href=${new URL(e.ruta, raizSitio()).href}>${e.titulo}</a>`)}
        </nav>`)}
      <div class="pie-col">
        <strong class="pie-titulo">Pruebas</strong>
        <button class="pie-accion" type="button" onclick=${abrirPerfiles}>Perfiles de prueba</button>
      </div>
      <div class="pie-col">
        <strong class="pie-titulo">Tema</strong>
        <span class="pie-tema">
          <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </span>
      </div>
    </footer>
    <av-perfiles-tabla id="perfiles-tabla" onav-perfiles-cerrar=${cerrarPerfiles} onav-perfil-usar=${usarPerfil}></av-perfiles-tabla>
  `;
}

const tablaDe = (e: Event) => ((e.currentTarget as HTMLElement).getRootNode() as ShadowRoot).querySelector('#perfiles-tabla') as ConProps;

/** Abre la tabla de perfiles de prueba. */
async function abrirPerfiles(e: Event): Promise<void> {
  const tabla = tablaDe(e);
  tabla.props = { abierto: true };
  try {
    tabla.props = { perfiles: await perfilesPrueba() };
  } catch (err) {
    avisar(mensajeDe(err), 'danger');
  }
}

function cerrarPerfiles(e: Event): void {
  (e.currentTarget as ConProps).props = { abierto: false };
}

/** «Usar» en la tabla: el selector decide si el cambio es directo o pide el PIN. */
function usarPerfil(e: Event): void {
  const tabla = e.currentTarget as ConProps;
  tabla.props = { abierto: false };
  const selector = (tabla.getRootNode() as ShadowRoot).querySelector('av-perfil-selector');
  selector?.dispatchEvent(new CustomEvent('av-perfil-pedir', { detail: (e as CustomEvent).detail }));
}

/** Acciones globales de la paleta de comandos: tema, paleta (lleva al selector del pie) y salir. */
async function accionGlobal(accion: string, root: ShadowRoot): Promise<void> {
  if (accion === 'tema') {
    (root.querySelector('iswc-theme-toggle') as HTMLElement | null)?.click();
    return;
  }
  if (accion === 'paleta') {
    const selector = root.querySelector('iswc-palette-selector') as HTMLElement | null;
    selector?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    selector?.focus();
    return;
  }
  if (accion === 'salir') {
    await cerrarSesion();
    ir('inicio');
  }
}

/** Raíz del sitio (portada): todas las páginas traen `<base href>` a la raíz. */
const raizSitio = (): string => new URL('./', document.baseURI).href;

/** Acceso desde la barra: el kit pinta el login; la app autentica con DER. */
function sesionMenu(conSesion: boolean) {
  return html`
    <iswc-session-menu slot="actions" ?logged=${conSesion} name=${estado.yo?.nombre ?? estado.yo?.iusuario ?? ''} subtitle=${rolDe(estado.perfil)} label="Entrar" heading="Entrar a Avatar"
      oniswc-login-submit=${async (e: Event) => {
        const sesion = e.currentTarget as SesionEl;
        const { username, password } = (e as CustomEvent<{ username: string; password: string }>).detail;
        sesion.loading = true;
        try {
          await iniciarSesion(username, password);
          sesion.reset();
          const destino = destinoTrasAcceso();
          ir(destino.vista, destino.id);
        } catch (err) {
          sesion.error = mensajeDe(err);
        } finally {
          sesion.loading = false;
        }
      }}
      oniswc-logout=${async () => {
        await cerrarSesion();
        ir('inicio');
      }}>
      <iswc-dropdown-item value="asistente" oniswc-click=${() => ir('asistente')}>Preguntar a AVO</iswc-dropdown-item>
    </iswc-session-menu>
  `;
}

const AvApp = crearComponente<AvAppProps>(
  import.meta.url,
  'av-app',
  { vista: 'inicio', id: null, listo: false, version: 0 },
  (root, props, host) => {
    const h = host as unknown as ConProps;
    if (!props.listo) {
      root.append(html`<div class="arranque" part="arranque"><iswc-spinner></iswc-spinner><span>Cargando Avatar…</span></div>`);
      void (async () => {
        conectar();
        try {
          await cargarPerfil();
        } catch (err) {
          console.warn('[av-app] sesión no restaurada:', mensajeDe(err));
        }
        const actual = rutaActual();
        const ruta = resolver(actual, haySesion());
        if (ruta.vista !== actual.vista) {
          recordarDestino(actual);
          ir(ruta.vista, ruta.id);
          return;
        }
        h.props = { listo: true, vista: ruta.vista, id: ruta.id };
        document.documentElement.setAttribute('data-app-ready', '');
      })();
      return;
    }
    const conSesion = haySesion();
    precargarEnReposo(vistasProbables(conSesion).filter((v) => v !== props.vista));
    const privada = conSesion && VISTAS_PRIVADAS.includes(props.vista);
    if (!privada) {
      root.append(html`
        <iswc-app-shell class="publica" brand="Avatar" brand-href=${raizSitio()} home-label="Ir al inicio" toast="top-end">
          <av-logo slot="brand" class="marca" wordmark animado></av-logo>
          ${conSesion ? html`<iswc-button slot="actions" variant="outlined" color="brand" oniswc-click=${() => ir(VISTA_SESION)}><iswc-icon slot="start" icon="mdi:view-dashboard-outline"></iswc-icon>Ir al panel</iswc-button>` : null}
          <av-perfil-selector slot="actions" id="perfil"></av-perfil-selector>
          ${sesionMenu(conSesion)}
          <main class="vista" part="vista">${montarVista(props.vista, props.id, conSesion)}</main>
          ${pie('footer')}
        </iswc-app-shell>
      `);
      (root.querySelector('#perfil') as ConProps).props = { activo: estado.yo?.iusuario ?? '' };
      return;
    }
    const admin = puede(estado.perfil, ACCION.seguridad, 'PUT');
    root.append(html`
      <iswc-doc-layout class="privada" storage-key="avatar-app" toc="off" hide-end start-width="260">
        <a slot="brand" class="marca" href=${raizSitio()} aria-label="Avatar, ir al inicio"><av-logo wordmark animado></av-logo></a>
        <av-buscador slot="actions"></av-buscador>
        <av-empresa-selector slot="actions"></av-empresa-selector>
        <av-perfil-selector slot="actions" id="perfil"></av-perfil-selector>
        ${sesionMenu(true)}
        <iswc-doc-index slot="start" id="indice" placeholder="Buscar módulo…"
          oniswc-doc-index-select=${(e: Event) => ir((e as CustomEvent<{ id: string }>).detail.id)}></iswc-doc-index>
        <main class="vista" part="vista">${montarVista(props.vista, props.id, true)}</main>
        ${pie(null)}
      </iswc-doc-layout>
      <iswc-toast placement="top-end"></iswc-toast>
    `);
    const indice = root.querySelector('#indice') as IndiceEl & { textos: Record<string, string> };
    indice.textos = { placeholder: 'Buscar módulo…', sinResultados: 'Ningún módulo coincide.', resumen: '' };
    indice.items = modulos(admin);
    const buscador = root.querySelector('av-buscador') as ConProps;
    buscador.props = { permitidos: modulos(admin).map((m) => m.id) };
    buscador.addEventListener('av-buscador-global', (e) => void accionGlobal((e as CustomEvent<{ accion: string }>).detail.accion, root));
    indice.current = props.vista;
    (root.querySelector('#perfil') as ConProps).props = { activo: estado.yo?.iusuario ?? '' };
    (root.querySelector('av-empresa-selector') as ConProps).props = { empresas: estado.yo?.empresas ?? [], activa: empresaActiva() };
  },
  // Repintado parcial dentro de la página: otro id solo pasa el id al shell de la vista; otra empresa (`version`)
  // remonta solo el contenido y el selector. El layout (anchos, cajón, índice) nunca se repinta: sin parpadeo.
  (root, props, previos) => {
    if (!props.listo || !previos.listo || props.vista !== previos.vista || !haySesion()) return false;
    const vista = root.querySelector('.vista');
    if (!vista) return false;
    if (props.version !== previos.version) {
      vista.replaceChildren(montarVista(props.vista, props.id, true));
      const selector = root.querySelector('av-empresa-selector') as ConProps | null;
      if (selector) selector.props = { empresas: estado.yo?.empresas ?? [], activa: empresaActiva() };
      (root.querySelector('iswc-doc-layout') as LayoutEl | null)?.scrollContentTo?.(0);
      return true;
    }
    const shell = vista.firstElementChild as ConProps | null;
    if (!shell) return false;
    shell.props = { id: props.id };
    return true;
  },
);

define('av-app', AvApp);

// El id viaja en el historial de la página; la empresa activa, en el estado. Un cambio de empresa sube `version`.
if (typeof document !== 'undefined') {
  const app = () => document.querySelector('av-app') as ConProps | null;
  escuchar((r) => {
    const a = app();
    if (a && r.vista === a.props['vista']) a.props = { id: r.id };
  });
  // Una intención en la misma vista (p. ej. «Nuevo grupo» estando en Canales) remonta el contenido para que la tome.
  addEventListener('av-ruta', (e) => {
    const a = app();
    if ((e as CustomEvent<{ intencion: string | null }>).detail.intencion && a?.props['listo']) a.props = { version: Number(a.props['version'] ?? 0) + 1 };
  });
  alCambiar('empresa', () => {
    const a = app();
    if (a?.props['listo']) a.props = { version: Number(a.props['version'] ?? 0) + 1 };
  });
}
