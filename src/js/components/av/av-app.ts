/**
 * <av-app> — shell de Avatar. No dibuja estructura propia: compone los armazones del kit.
 *
 *   - Área pública (landing, acceso): `<iswc-app-shell>` (barra superior con marca, sesión y tema).
 *   - Área privada (con sesión): `<iswc-doc-layout>` (el mismo layout documental del kit): barra con marca, empresa,
 *     sesión y tema; lateral `start` redimensionable (`iswc-split-panel` del kit, recordado por tamaño de pantalla y
 *     cajón en celular) con los módulos en `<iswc-doc-index>` (agrupados, con ícono y búsqueda); la vista al centro.
 *
 * Cada ruta es una página HTML real (`consts/paginas.ts`) cuyo cuerpo es solo `<av-app vista="…">`: sirve para la entrada
 * directa, la recarga y el SEO. Ya dentro, navegar no recarga: se reemplaza solo `.vista` y barra, lateral y sesión siguen. Arranque: restaura
 * la sesión (token en localStorage → `empresas/yo` + `GET /permisos`), resuelve la ruta (una vista privada sin sesión va
 * a la página de `acceso` recordando el destino) y monta el shell de la vista con `props = { id }`. Carga perezosa: cada vista se
 * pide al navegar (`cargarVista`), se precargan en reposo las probables y, mientras se define, se ve un esqueleto.
 */
import { avisar, crearComponente, define, html } from '../../base/componente.js';
import type { AvAppProps, Ruta } from '../../consts/schemas/componentes.schemas.js';
import { cargarPerfil, cerrarSesion, conectar, iniciarSesion, mensajeDe } from '../../core/api.js';
import { conectarBuscador } from '../../core/buscador.js';
import { alCambiar, empresaActiva, estado, fijar, haySesion } from '../../core/estado.js';
import { ACCION, puede, rolDe } from '../../core/permisos.js';
import { actualizarMetas, activarSpa, destinoTrasAcceso, escuchar, ir, precargar, recordarDestino, reemplazar, resolver, rutaActual, VISTA_SESION, VISTAS_PRIVADAS } from '../../core/router.js';
import { MODULOS, type Modulo } from '../../consts/comandos.js';
import { columnasPie } from '../../consts/paginas.js';
import { PAGINAS } from '../../consts/paginas.js';
import { VIEW_TAGS } from '../../kit-tags.js';
import './av-boton-enlace.js';
import './av-campana.js';
import './av-link.js';
import './av-menu-lateral.js';
import './av-migas.js';
import './av-outlet.js';
import './av-pestanas.js';
import './av-perfil-selector.js';
import './av-perfiles-lista.js';
import './av-perfiles-tabla.js';

type SesionEl = HTMLElement & { logged: boolean; loading: boolean; error: string; reset(): void };
type ConProps = HTMLElement & { props: Record<string, unknown> };
type Loader = { load(...tags: string[]): Promise<unknown> };
type ConIdle = { requestIdleCallback?(fn: () => void, o?: { timeout: number }): number };

/** Celular para `iswc-doc-layout`: en este ancho el lateral vive en su cajón. */
const MOVIL = '(max-width: 47.5em)';

/** En `/acceso/` sin sesión la página ya es el login: el botón Entrar de la barra sobra. */
const enAcceso = (conSesion: boolean) => !conSesion && rutaActual().vista === 'acceso';

/** Cierra el cajón del layout (el kit lo cierra con su velo; no publica un método). */
function cerrarCajon(root: ShadowRoot): void {
  (root.querySelector('iswc-doc-layout')?.shadowRoot?.querySelector('.scrim') as HTMLElement | null)?.click();
}

/** En celular el buscador pasa de la barra al cajón; deslizar a la izquierda lo cierra. */
function adaptarBarra(root: ShadowRoot): void {
  const layout = root.querySelector('iswc-doc-layout') as HTMLElement;
  const cajon = root.querySelector('.acciones-cajon') as HTMLElement;
  const piezas = [...root.querySelectorAll<HTMLElement>('.en-cajon')];
  const consulta = matchMedia(MOVIL);
  const ubicar = () => {
    if (!layout.isConnected) return consulta.removeEventListener('change', ubicar);
    const antes = layout.querySelector('[slot="actions"]:last-of-type');
    for (const p of piezas) {
      if (consulta.matches) {
        p.removeAttribute('slot');
        cajon.append(p);
      } else {
        p.setAttribute('slot', 'actions');
        layout.insertBefore(p, antes);
      }
    }
  };
  consulta.addEventListener('change', ubicar);
  ubicar();
  let inicio = 0;
  const lateral = root.querySelector('.lateral') as HTMLElement;
  lateral.addEventListener('touchstart', (e) => (inicio = e.touches[0]?.clientX ?? 0), { passive: true });
  lateral.addEventListener('touchend', (e) => {
    if (inicio - (e.changedTouches[0]?.clientX ?? inicio) > 60) cerrarCajon(root);
  }, { passive: true });
}

/** Sesión con la que se pintó el armazón: si cambia, hay que repintarlo entero. */
let sesionPintada = false;

/** Módulos visibles: solo los que tienen vista registrada; Administración solo con `avatar.seguridad`. */
export function modulos(admin: boolean): Modulo[] {
  const vistas = new Set(Object.keys(VIEW_TAGS));
  return MODULOS.filter((m) => vistas.has(m.id) && (m.id !== 'admin' || admin));
}

/** Pide una vista al loader (compartido con la precarga por hover). */
export const cargarVista = precargar;

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
/** Empresas del usuario para `<iswc-tenant-selector>`. */
function propsSelector(): Record<string, unknown> {
  const opciones = (estado.yo?.empresas ?? []).map((e) => ({ id: e.iempresa, nombre: e.nombre }));
  return { opciones, activa: empresaActiva(), etiqueta: 'Empresa activa', sinOpciones: 'Sin empresa' };
}

/**
 * Pie de la app, en columnas: marca, enlaces del sitio, pruebas y tema. La paleta y el modo van aquí, a la vista, para
 * comparar temas mientras se prueba; cambiarlos reescribe `<html>` y TODA la interfaz se re-tiñe. «Perfiles de prueba» es
 * una acción: abre el diálogo con la lista de perfiles.
 */
/** Columnas de enlaces del pie, de la tabla de rutas. */
function columnas(conSesion: boolean) {
  return columnasPie(conSesion).map((c) => html`
    <nav class=${c.enlaces.length > 8 ? 'pie-col pie-col-larga' : 'pie-col'} aria-label=${c.titulo}>
      <strong class="pie-titulo">${c.titulo}</strong>
      ${c.enlaces.map((e) => (e.vista ? html`<av-link vista=${e.vista} registro=${e.id ?? ''}>${e.titulo}</av-link>` : html`<a href=${new URL(e.ruta!, raizSitio()).href}>${e.titulo}</a>`))}
    </nav>`);
}

/** Mapa del sitio en un diálogo: en las vistas a alto completo el pie no cabe. */
function abrirMapa(root: ShadowRoot): void {
  (root.querySelector('#mapa') as HTMLElement & { open: boolean }).open = true;
}

function pie(slot: string | null) {
  return html`
    <footer class="pie" part="pie" slot=${slot}>
      <div class="pie-col pie-col-marca">
        <span class="pie-marca"><av-logo wordmark></av-logo></span>
        <span class="pie-lema">Gestión digital y automatización · Odys</span>
      </div>
      ${columnas(haySesion())}
      <div class="pie-col">
        <strong class="pie-titulo">Pruebas</strong>
        <iswc-button class="pie-accion" variant="text compact" color="text" onclick=${abrirPerfiles}>Perfiles de prueba</iswc-button>
      </div>
      <div class="pie-col">
        <strong class="pie-titulo">Tema</strong>
        <span class="pie-tema">
          <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </span>
      </div>
    </footer>
    <av-perfiles-tabla id="perfiles-tabla" onav-perfiles-cerrar=${cerrarPerfiles}></av-perfiles-tabla>
  `;
}

const tablaDe = (e: Event) => ((e.currentTarget as HTMLElement).getRootNode() as ShadowRoot).querySelector('#perfiles-tabla') as ConProps;

/** Abre el diálogo de perfiles de prueba. */
function abrirPerfiles(e: Event): void {
  tablaDe(e).props = { abierto: true };
}

function cerrarPerfiles(e: Event): void {
  (e.currentTarget as ConProps).props = { abierto: false };
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
    <iswc-session-menu slot="actions" extra-label="Entrar como…" ?hidden=${enAcceso(conSesion)} ?logged=${conSesion} name=${estado.yo?.nombre ?? estado.yo?.iusuario ?? ''} subtitle=${rolDe(estado.perfil)} label="Entrar"
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
      ${conSesion ? html`<iswc-dropdown-item value="mapa" oniswc-click=${(e: Event) => abrirMapa((e.currentTarget as HTMLElement).getRootNode() as ShadowRoot)}>Mapa del sitio</iswc-dropdown-item>` : null}
      ${conSesion
        ? html`<div slot="extra" class="menu-cuenta">
            <iswc-tenant-selector></iswc-tenant-selector>
            <av-perfil-selector id="perfil"></av-perfil-selector>
            <span class="menu-tema">
              <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
              <iswc-theme-toggle scope="root"></iswc-theme-toggle>
            </span>
          </div>`
        : html`<av-perfiles-lista slot="extra" modo="select"></av-perfiles-lista>`}
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
          reemplazar(ruta.vista);
        }
        actualizarMetas(ruta.vista, ruta.id);
        h.props = { listo: true, vista: ruta.vista, id: ruta.id };
        document.documentElement.setAttribute('data-app-ready', '');
      })();
      return;
    }
    const conSesion = haySesion();
    sesionPintada = conSesion;
    precargarEnReposo(vistasProbables(conSesion).filter((v) => v !== props.vista));
    const privada = conSesion && VISTAS_PRIVADAS.includes(props.vista);
    if (!privada) {
      root.append(html`
        <iswc-app-shell class="publica" brand="Avatar" brand-href=${raizSitio()} home-label="Ir al inicio" toast="top-end">
          <av-logo slot="brand" class="marca" wordmark animado></av-logo>
          ${conSesion ? html`<iswc-button slot="actions" variant="outlined compact" color="brand" oniswc-click=${() => ir(VISTA_SESION)}><iswc-icon slot="start" icon="mdi:view-dashboard-outline"></iswc-icon>Ir al panel</iswc-button>` : null}
          <av-campana slot="actions"></av-campana>
          <av-perfil-selector slot="actions" id="perfil"></av-perfil-selector>
          ${sesionMenu(conSesion)}
          <av-outlet class="vista" part="vista" role="main"></av-outlet>
          ${pie('footer')}
        </iswc-app-shell>
      `);
      (root.querySelector('#perfil') as ConProps).props = { activo: estado.yo?.iusuario ?? '' };
      (root.querySelector('.vista') as ConProps).props = { vista: props.vista, id: props.id, sesion: conSesion, version: props.version };
      return;
    }
    const admin = puede(estado.perfil, ACCION.seguridad, 'PUT');
    root.append(html`
      <iswc-doc-layout class="privada" storage-key="avatar-app" toc="off" hide-end start-rail start-width="260">
        <av-link slot="brand" class="marca" vista="inicio" aria-label="Avatar, ir al inicio"><av-logo wordmark animado></av-logo></av-link>
        <iswc-semantic-search class="en-cajon" slot="actions"></iswc-semantic-search>
        <av-campana slot="actions"></av-campana>
        ${sesionMenu(true)}
        <div slot="start" class="lateral">
          <div class="acciones-cajon"></div>
          <av-menu-lateral id="indice"></av-menu-lateral>
        </div>
        <av-migas></av-migas>
        <av-outlet class="vista" part="vista" role="main">${pie('pie')}</av-outlet>
      </iswc-doc-layout>
      <iswc-dialog id="mapa" label="Mapa del sitio" backdrop-variant="basic"><div class="pie-mapa">${columnas(true)}</div></iswc-dialog>
      <iswc-toast placement="top-end"></iswc-toast>
    `);
    const indice = root.querySelector('#indice') as ConProps;
    const riel = root.querySelector('iswc-doc-layout') as HTMLElement & { rail?: boolean };
    indice.props = { items: modulos(admin), compacto: riel.rail === true };
    riel.addEventListener('iswc-doc-layout-rail', (e) => (indice.props = { compacto: (e as CustomEvent<{ rail: boolean }>).detail.rail }));
    conectarBuscador(root.querySelector('iswc-semantic-search') as ConProps, modulos(admin).map((m) => m.id), (accion) => void accionGlobal(accion, root));
    (root.querySelector('#perfil') as ConProps).props = { activo: estado.yo?.iusuario ?? '' };
    const selector = root.querySelector('iswc-tenant-selector') as ConProps;
    selector.addEventListener('iswc-tenant-change', (e) => fijar({ empresa: Number((e as CustomEvent<{ id: number }>).detail.id) }));
    selector.props = propsSelector();
    (root.querySelector('.vista') as ConProps).props = { vista: props.vista, id: props.id, sesion: true, version: props.version };
    adaptarBarra(root);
  },
  // Repintado parcial: otro id solo pasa el id al shell; otra vista u otra empresa (`version`) remontan solo el contenido.
  // El armazón (anchos, cajón, índice) se repinta únicamente al pasar entre área pública y privada o al cambiar la sesión.
  (root, props, previos) => {
    const conSesion = haySesion();
    if (!props.listo || !previos.listo || conSesion !== sesionPintada) return false;
    const privada = (v: string) => conSesion && VISTAS_PRIVADAS.includes(v);
    if (privada(props.vista) !== privada(previos.vista)) return false;
    const salida = root.querySelector('.vista') as ConProps | null;
    if (!salida) return false;
    salida.props = { vista: props.vista, id: props.id, sesion: conSesion, version: props.version };
    if (props.vista !== previos.vista) {
      root.querySelector('iswc-session-menu')?.toggleAttribute('hidden', enAcceso(conSesion));
      cerrarCajon(root);
      salida.scrollTop = 0;
      scrollTo(0, 0);
    }
    if (props.version !== previos.version) {
      const selector = root.querySelector('iswc-tenant-selector') as ConProps | null;
      if (selector) selector.props = propsSelector();
    }
    return true;
  },
);

define('av-app', AvApp);

// El id viaja en el historial de la página; la empresa activa, en el estado. Un cambio de empresa sube `version`.
if (typeof document !== 'undefined') {
  const app = () => document.querySelector('av-app') as ConProps | null;
  if (app()) activarSpa();
  escuchar((r) => {
    const a = app();
    if (!a?.props['listo']) return;
    const ruta = resolver(r, haySesion());
    if (ruta.vista !== r.vista) {
      recordarDestino(r);
      reemplazar(ruta.vista);
    }
    a.props = { vista: ruta.vista, id: ruta.id };
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
