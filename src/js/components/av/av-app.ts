/**
 * <av-app> — shell de la app sobre `<iswc-app-shell>`: barra con marca, navegación (`<iswc-app-nav>`) según la sesión y
 * los permisos, selector de empresa, sesión (`<iswc-session-menu>`: entrar desde la barra o cerrar sesión) y la vista
 * activa debajo. Enruta por hash (`core/router.ts`): la app solo conoce el shell de cada vista (SHELLS).
 *
 * Arranque: restaura la sesión (token en localStorage → `empresas/yo` + `GET /permisos`), resuelve la ruta (una vista
 * privada sin sesión cae en `acceso`) y monta el shell de la vista con `props = { id }`.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvAppProps, Ruta } from '../../consts/schemas/componentes.schemas.js';
import { cargarPerfil, cerrarSesion, conectar, iniciarSesion, mensajeDe } from '../../core/api.js';
import { alCambiar, empresaActiva, estado, fijar, haySesion } from '../../core/estado.js';
import { ACCION, puede, rolDe } from '../../core/permisos.js';
import { escuchar, ir, resolver, rutaActual, VISTA_SESION } from '../../core/router.js';
import { KIT_TAGS, VIEW_TAGS } from '../../kit-tags.js';
import './av-empresa-selector.js';

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

type Tab = { id: string; label: string; icon: string; hidden?: boolean };
type NavEl = HTMLElement & { rows: { id: string; value: string; tabs: Tab[] }[] };
type SesionEl = HTMLElement & { logged: boolean; loading: boolean; error: string; reset(): void };
type ConProps = HTMLElement & { props: Record<string, unknown> };

type Loader = { load(...tags: string[]): Promise<unknown> };

/** Pide al loader del kit los tags de una vista (idempotente: lo ya cargado no se repite). Sin loader (pruebas), nada. */
export function cargarVista(vista: string): Promise<unknown> {
  const L = (globalThis as { iswcLoader?: Loader }).iswcLoader;
  const tags = (VIEW_TAGS as Record<string, readonly string[]>)[vista] ?? [];
  return L && tags.length ? L.load(...tags).catch((e: unknown) => console.warn(`[av-app] vista ${vista}:`, e)) : Promise.resolve();
}

let kitPedido = false;
/** Una vez por documento y sin bloquear el pintado: el resto de los `iswc-*` de la app quedan registrados en segundo plano. */
function precargarKit(): void {
  const L = (globalThis as { iswcLoader?: Loader }).iswcLoader;
  if (kitPedido || !L) return;
  kitPedido = true;
  void L.load(...KIT_TAGS).catch((e: unknown) => console.warn('[av-app] kit:', e));
}

/** Pestañas de la barra: públicas sin sesión; con sesión, las del trabajo (admin solo con `avatar.seguridad`). */
export function pestanas(conSesion: boolean, admin: boolean): Tab[] {
  if (!conSesion) {
    return [
      { id: 'inicio', label: 'Inicio', icon: 'mdi:home-outline' },
      { id: 'acceso', label: 'Entrar', icon: 'mdi:login' },
    ];
  }
  return [
    { id: 'panel', label: 'Panel', icon: 'mdi:view-dashboard-outline' },
    { id: 'canales', label: 'Canales', icon: 'mdi:forum-outline' },
    { id: 'proyectos', label: 'Proyectos', icon: 'mdi:view-column-outline' },
    { id: 'crm', label: 'CRM', icon: 'mdi:account-heart-outline' },
    { id: 'organizacion', label: 'Organización', icon: 'mdi:domain' },
    { id: 'asistente', label: 'AVO', icon: 'mdi:robot-outline' },
    { id: 'admin', label: 'Admin', icon: 'mdi:shield-account-outline', hidden: !admin },
  ];
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
    void cargarVista(props.vista);
    precargarKit();
    const shellVista = document.createElement(SHELLS[props.vista] ?? SHELLS['inicio']!) as ConProps;
    shellVista.props = { id: props.id, sesion: conSesion };
    const logo = new URL('assets/img/logo.svg', document.baseURI).href;
    root.append(html`
      <iswc-app-shell brand="Avatar" logo=${logo} brand-href="#/" home-label="Ir al inicio" toast="top-end">
        <iswc-app-nav slot="nav" oniswc-nav-select=${(e: Event) => {
          const { id } = (e as CustomEvent<{ id: string }>).detail;
          ir(id);
        }}></iswc-app-nav>
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
        <main class="vista" part="vista">${shellVista}</main>
      </iswc-app-shell>
    `);
    const nav = root.querySelector('iswc-app-nav') as NavEl;
    nav.rows = [{ id: 'vista', value: props.vista, tabs: pestanas(conSesion, admin) }];
    const selector = root.querySelector('av-empresa-selector') as ConProps | null;
    if (selector) selector.props = { empresas: estado.yo?.empresas ?? [], activa: empresaActiva() };
  },
  // Repintado parcial: si solo cambió el id de la misma vista, se reasignan las props del shell de la vista.
  (root, props, previos) => {
    if (!props.listo || !previos.listo || props.vista !== previos.vista) return false;
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
