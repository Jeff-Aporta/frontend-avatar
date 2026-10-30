/**
 * <av-app> — shell de la app sobre `<iswc-app-shell>`: barra con marca, menú lateral (`<av-menu>`) con sesión y
 * los permisos, selector de empresa, sesión (`<iswc-session-menu>`: entrar desde la barra o cerrar sesión) y la vista
 * activa debajo. Enruta por hash (`core/router.ts`): la app solo conoce el shell de cada vista (SHELLS).
 *
 * Arranque: restaura la sesión (token en localStorage → `empresas/yo` + `GET /permisos`), resuelve la ruta (una vista
 * privada sin sesión cae en `acceso`) y monta el shell de la vista con `props = { id }`.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvAppProps, ItemMenu, Ruta } from '../../consts/schemas/componentes.schemas.js';
import { cargarPerfil, cerrarSesion, conectar, iniciarSesion, mensajeDe } from '../../core/api.js';
import { alCambiar, empresaActiva, estado, fijar, haySesion } from '../../core/estado.js';
import { ACCION, puede, rolDe } from '../../core/permisos.js';
import { escuchar, ir, resolver, rutaActual, VISTA_SESION } from '../../core/router.js';
import { tagsDeVista, VIEW_TAGS } from '../../kit-tags.js';
import './av-empresa-selector.js';
import './av-menu.js';

/** Vista → tag del shell de esa vista (cada vista tiene UN shell). */
const SHELLS: Record<string, string> = {
  inicio: 'av-inicio',
  acceso: 'av-acceso',
  panel: 'av-panel',
  canales: 'av-canales',
  proyectos: 'av-proyectos',
  crm: 'av-crm',
  organizacion: 'av-organizacion',
  asistente: 'av-asistente',
  admin: 'av-admin',
};

type SesionEl = HTMLElement & { logged: boolean; loading: boolean; error: string; reset(): void };
type ConProps = HTMLElement & { props: Record<string, unknown> };

type Loader = { load(...tags: string[]): Promise<unknown> };
type ConIdle = { requestIdleCallback?(fn: () => void, o?: { timeout: number }): number };

const pedidas = new Map<string, Promise<unknown>>();
/**
 * Pide al loader del kit una vista: sus `iswc-*` y sus componentes (`tagsDeVista`). Idempotente y compartida: dos
 * pedidos de la misma vista esperan la misma promesa. Sin loader (pruebas sin navegador), nada.
 */
export function cargarVista(vista: string): Promise<unknown> {
  const L = (globalThis as { iswcLoader?: Loader }).iswcLoader;
  const tags = tagsDeVista(vista);
  if (!L || !tags.length) return Promise.resolve();
  if (!pedidas.has(vista)) pedidas.set(vista, L.load(...tags).catch((e: unknown) => {
    pedidas.delete(vista);
    console.warn(`[av-app] vista ${vista}:`, e);
  }));
  return pedidas.get(vista)!;
}

/** Vistas que conviene tener listas: con sesión, las del trabajo (las más usadas primero); sin sesión, el acceso. */
export function vistasProbables(conSesion: boolean): string[] {
  return conSesion ? ['panel', 'canales', 'proyectos', 'crm', 'asistente', 'organizacion', 'admin'] : ['acceso'];
}

/** En reposo, una vista por vez (sin competir con lo que el usuario está mirando). */
function precargarEnReposo(vistas: string[]): void {
  const g = globalThis as ConIdle;
  const siguiente = () => {
    const v = vistas.shift();
    if (!v) return;
    void cargarVista(v).then(() => esperarReposo(siguiente));
  };
  const esperarReposo = (fn: () => void) => (g.requestIdleCallback ? g.requestIdleCallback(fn, { timeout: 4000 }) : setTimeout(fn, 600));
  esperarReposo(siguiente);
}

/** Todos los módulos del área privada, en el orden y los grupos del menú (como el menú del React original). */
const MODULOS: ItemMenu[] = [
  { id: 'panel', label: 'Panel', icon: 'mdi:view-dashboard-outline', grupo: 'Trabajo', contador: 0 },
  { id: 'canales', label: 'Canales', icon: 'mdi:forum-outline', grupo: 'Trabajo', contador: 0 },
  { id: 'correos', label: 'Correos', icon: 'mdi:email-outline', grupo: 'Trabajo', contador: 0 },
  { id: 'proyectos', label: 'Proyectos', icon: 'mdi:view-column-outline', grupo: 'Trabajo', contador: 0 },
  { id: 'crm', label: 'CRM', icon: 'mdi:account-heart-outline', grupo: 'Negocio', contador: 0 },
  { id: 'finanzas', label: 'Finanzas', icon: 'mdi:cash-multiple', grupo: 'Negocio', contador: 0 },
  { id: 'inventario', label: 'Inventario', icon: 'mdi:package-variant-closed', grupo: 'Negocio', contador: 0 },
  { id: 'rrhh', label: 'Recursos Humanos', icon: 'mdi:account-tie-outline', grupo: 'Empresa', contador: 0 },
  { id: 'organizacion', label: 'Organización', icon: 'mdi:domain', grupo: 'Empresa', contador: 0 },
  { id: 'asistente', label: 'Asistente AVO', icon: 'mdi:robot-outline', grupo: 'Empresa', contador: 0 },
  { id: 'admin', label: 'Administración', icon: 'mdi:shield-account-outline', grupo: 'Empresa', contador: 0 },
];

/** Módulos visibles: solo los que tienen vista registrada; Administración solo con `avatar.seguridad`. */
export function modulos(admin: boolean, contadores: Record<string, number> = {}): ItemMenu[] {
  const vistas = new Set(Object.keys(VIEW_TAGS));
  return MODULOS.filter((m) => vistas.has(m.id) && (m.id !== 'admin' || admin)).map((m) => ({ ...m, contador: contadores[m.id] ?? 0 }));
}

const CLAVE_PLEGADO = 'avatar:menu-plegado';
function menuPlegado(): boolean {
  try {
    return localStorage.getItem(CLAVE_PLEGADO) === '1';
  } catch {
    return false;
  }
}

const AvApp = crearComponente<AvAppProps>(
  import.meta.url,
  'av-app',
  { vista: 'inicio', id: null, listo: false },
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
        const ruta = resolver(rutaActual(), haySesion());
        if (ruta.vista !== rutaActual().vista) ir(ruta.vista, ruta.id);
        h.props = { listo: true, vista: ruta.vista, id: ruta.id };
        document.documentElement.setAttribute('data-app-ready', '');
      })();
      return;
    }
    const conSesion = haySesion();
    const admin = puede(estado.perfil, ACCION.seguridad, 'PUT');
    const plegado = menuPlegado();
    const tagVista = SHELLS[props.vista] ?? SHELLS['inicio']!;
    void cargarVista(props.vista);
    precargarEnReposo(vistasProbables(conSesion).filter((v) => v !== props.vista));
    const shellVista = document.createElement(tagVista) as ConProps;
    shellVista.props = props.vista === 'inicio' || !SHELLS[props.vista] ? { sesion: conSesion } : { id: props.id };
    // Mientras la vista se define (carga perezosa) se ve un esqueleto en su lugar, nunca un hueco.
    const esqueleto = customElements.get(tagVista) ? null : document.createElement('av-vacio') as ConProps;
    if (esqueleto) {
      esqueleto.props = { estado: 'cargando' };
      esqueleto.classList.add('esqueleto');
      void customElements.whenDefined(tagVista).then(() => esqueleto.remove());
    }
    const logo = new URL('assets/img/logo.svg', document.baseURI).href;
    root.append(html`
      <iswc-app-shell brand="Avatar" logo=${logo} brand-href="#/" home-label="Ir al inicio" sidebar-label="Módulos" toast="top-end"
        style=${conSesion ? `--iswc-shell-sidebar-width:${plegado ? '4.4em' : '15em'}` : ''}>
        ${conSesion ? html`<av-menu slot="sidebar" id="menu"
          onav-menu-ir=${(e: Event) => ir((e as CustomEvent<{ id: string }>).detail.id)}
          onav-menu-plegar=${(e: Event) => {
            const p = (e as CustomEvent<{ plegado: boolean }>).detail.plegado;
            try {
              localStorage.setItem(CLAVE_PLEGADO, p ? '1' : '0');
            } catch {
              /* sin almacenamiento */
            }
            (root.querySelector('#menu') as ConProps).props = { plegado: p };
            (root.querySelector('iswc-app-shell') as HTMLElement).style.setProperty('--iswc-shell-sidebar-width', p ? '4.4em' : '15em');
          }}></av-menu>` : null}
        ${conSesion ? html`<av-empresa-selector slot="actions"></av-empresa-selector>` : null}
        <iswc-session-menu slot="actions" ?logged=${conSesion} name=${estado.yo?.nombre ?? estado.yo?.iusuario ?? ''} subtitle=${rolDe(estado.perfil)} label="Entrar" heading="Entrar a Avatar"
          oniswc-login-submit=${async (e: Event) => {
            const sesion = e.currentTarget as SesionEl;
            const { username, password } = (e as CustomEvent<{ username: string; password: string }>).detail;
            sesion.loading = true;
            try {
              await iniciarSesion(username, password);
              sesion.reset();
              ir(VISTA_SESION);
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
        <iswc-theme-toggle slot="actions" scope="root"></iswc-theme-toggle>
        <main class="vista" part="vista">${shellVista}${esqueleto}</main>
      </iswc-app-shell>
    `);
    const menu = root.querySelector('#menu') as ConProps | null;
    if (menu) menu.props = { items: modulos(admin, { canales: 0 }), activo: props.vista, plegado };
    const selector = root.querySelector('av-empresa-selector') as ConProps | null;
    if (selector) selector.props = { empresas: estado.yo?.empresas ?? [], activa: empresaActiva() };
  },
  // Repintado parcial: si solo cambió el id de la misma vista, se reasignan las props del shell de la vista.
  (root, props, previos) => {
    if (!props.listo || !previos.listo || props.vista !== previos.vista) return false;
    const menu = root.querySelector('#menu') as ConProps | null;
    if (menu) menu.props = { activo: props.vista };
    const shellVista = root.querySelector('.vista')?.firstElementChild as ConProps | null;
    if (!shellVista) return false;
    shellVista.props = { id: props.id };
    return true;
  },
);

define('av-app', AvApp);

// La ruta vive en el hash; la sesión y la empresa, en el estado. Cualquiera de los dos repinta el shell.
if (typeof document !== 'undefined') {
  const app = () => document.querySelector('av-app') as ConProps | null;
  const aplicar = (r: Ruta) => {
    const ruta = resolver(r, haySesion());
    if (ruta.vista !== r.vista) return ir(ruta.vista, ruta.id);
    fijar({ ruta });
    const a = app();
    if (a) a.props = { vista: ruta.vista, id: ruta.id };
  };
  escuchar(aplicar);
  alCambiar('yo', () => {
    const a = app();
    if (a) a.props = { ...rutaActual(), listo: true };
  });
  alCambiar('empresa', () => {
    const a = app();
    if (a) a.props = { ...rutaActual(), listo: true };
  });
}
