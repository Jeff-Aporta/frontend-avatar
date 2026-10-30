/**
 * kit-tags.ts — REGISTRO ÚNICO de tags de la app (estándar iswc-foundation).
 *
 * Todo lo demás se deriva de aquí: el registrador (`avLoader.min.js`, vía `registerApp`), el bundle de
 * compatibilidad, la galería de demos y los guardianes. Un componente nuevo se declara UNA vez:
 *
 *   SHELL_KIT_TAGS / VIEW_KIT_TAGS → tags `iswc-*` del kit (solo padres registrables: un hijo como `iswc-tab` lo
 *                registra su padre y va en HIJOS_KIT; el loader rechaza su nombre y tumba la carga de TODO el kit).
 *   APP_TAGS   → componentes transversales → `dist/cdn/js/components/av/<tag>.js`.
 *   VIEW_TAGS  → componentes de cada vista → `dist/cdn/view/<vista>/components/<tag>.js`.
 *
 * APP_TAGS y la unión de VIEW_TAGS son disjuntos: una vista no importa componentes de otra; lo compartido sube
 * a APP_TAGS. Se publica en `dist/cdn/js/kit-tags.js` para los hosts.
 */
/**
 * Carga perezosa (estrategia del ecosistema):
 *   1. Arranque: SHELL_KIT_TAGS + APP_TAGS + la vista de la ruta actual (VIEW_KIT_TAGS[v] + VIEW_TAGS[v]).
 *   2. Al navegar: `<av-app>` pide la vista destino (y muestra un esqueleto hasta que su shell esté definido).
 *   3. En reposo (`requestIdleCallback`): precarga las vistas probables según haya o no sesión.
 * Un guardián (`tests/vistas/registro.test.ts`) verifica que cada `iswc-*` usado en una vista esté declarado en su
 * lista o en la del shell, para que la carga perezosa nunca deje un tag sin definir.
 */
/** Tags del kit que usa el armazón (barra, sesión, menú, avisos) y piezas comunes a casi todas las vistas. */
export const SHELL_KIT_TAGS = [
  'iswc-app-shell',
  'iswc-session-menu',
  'iswc-dropdown',
  'iswc-dropdown-item',
  'iswc-theme-toggle',
  'iswc-icon',
  'iswc-button',
  'iswc-spinner',
  'iswc-skeleton',
  'iswc-toast',
  'iswc-avatar',
  'iswc-tag',
  'iswc-badge',
  'iswc-select',
  'iswc-option',
  'iswc-callout',
  'iswc-card',
] as const;

/** Hijos que registra su padre: nunca se piden al loader (lo rechaza y tumba la carga). */
export const HIJOS_KIT = ['iswc-tab', 'iswc-tab-panel', 'iswc-kanban-column', 'iswc-kanban-card'] as const;

/** Tags del kit propios de cada vista (además de los del shell). */
export const VIEW_KIT_TAGS: Record<string, readonly string[]> = {
  inicio: [],
  acceso: ['iswc-login'],
  panel: ['iswc-stat', 'iswc-doughnut-chart', 'iswc-bar-chart', 'iswc-relative-time'],
  canales: ['iswc-dialog', 'iswc-input', 'iswc-textarea', 'iswc-relative-time'],
  proyectos: ['iswc-kanban', 'iswc-dialog', 'iswc-drawer', 'iswc-input', 'iswc-textarea', 'iswc-popconfirm', 'iswc-divider', 'iswc-relative-time'],
  crm: ['iswc-data-grid', 'iswc-dialog', 'iswc-input', 'iswc-textarea', 'iswc-popconfirm'],
  organizacion: ['iswc-tab-group', 'iswc-dialog', 'iswc-input', 'iswc-textarea', 'iswc-popconfirm'],
  asistente: ['iswc-textarea', 'iswc-relative-time'],
  admin: ['iswc-tab-group', 'iswc-data-grid', 'iswc-dialog', 'iswc-input', 'iswc-switch', 'iswc-popconfirm', 'iswc-relative-time'],
};

/** Todos los tags del kit de la app (shell + vistas), sin repetir: lo usa la galería. */
export const KIT_TAGS: readonly string[] = [...new Set([...SHELL_KIT_TAGS, ...Object.values(VIEW_KIT_TAGS).flat()])];

export const PREFIJO = 'av';

/** Transversales (varias vistas): shell, cabecera de página, estado vacío, persona, selector de empresa y menú lateral. */
export const APP_TAGS = ['av-cabecera', 'av-vacio', 'av-persona', 'av-empresa-selector', 'av-menu', 'av-app'] as const;

/** Por vista: hijos antes que el shell (el último es el shell de la vista). */
export const VIEW_TAGS = {
  inicio: ['av-hero', 'av-comunidad', 'av-caracteristicas', 'av-precios', 'av-abierto', 'av-inicio'],
  acceso: ['av-credenciales-demo', 'av-acceso'],
  panel: ['av-kpis', 'av-tareas-grafica', 'av-embudo-grafica', 'av-notificaciones', 'av-panel'],
  canales: ['av-canal-lista', 'av-mensaje', 'av-redactor', 'av-conversacion', 'av-canal-form', 'av-canales'],
  proyectos: ['av-tarea-form', 'av-tarea-detalle', 'av-tablero', 'av-proyecto-form', 'av-proyectos'],
  crm: ['av-embudo', 'av-clientes-grid', 'av-cliente-form', 'av-crm'],
  organizacion: ['av-empresa-form', 'av-invitar-form', 'av-miembros', 'av-equipos', 'av-organizacion'],
  asistente: ['av-avo-mensaje', 'av-asistente'],
  admin: ['av-usuario-form', 'av-usuarios', 'av-roles', 'av-admin'],
} as const satisfies Record<string, readonly `av-${string}`[]>;

export type AppTag = (typeof APP_TAGS)[number] | (typeof VIEW_TAGS)[keyof typeof VIEW_TAGS][number];
export type Vista = keyof typeof VIEW_TAGS;

/** Carpeta publicada (relativa a `dist/cdn/`) de un componente propio; `null` si no es de la app. */
export function rutaComponente(tag: string): string | null {
  if ((APP_TAGS as readonly string[]).includes(tag)) return `js/components/${PREFIJO}/`;
  for (const [vista, tags] of Object.entries(VIEW_TAGS)) {
    if ((tags as readonly string[]).includes(tag)) return `view/${vista}/components/`;
  }
  return null;
}

/** tag → ruta del módulo relativa a `dist/cdn/` (exige el prefijo de la app). */
export function mapaRutas(): Record<string, string> {
  const mapa: Record<string, string> = {};
  for (const tag of [...APP_TAGS, ...Object.values(VIEW_TAGS).flat()]) {
    if (!tag.startsWith(`${PREFIJO}-`)) throw new Error(`kit-tags: ${tag} no lleva el prefijo ${PREFIJO}-`);
    mapa[tag] = `${rutaComponente(tag)}${tag}.js`;
  }
  return mapa;
}

/** Tags que el shell pide al arrancar (transversales + todas las vistas): solo para la galería y hosts sin carga perezosa. */
export const tagsArranque = (): string[] => [...APP_TAGS, ...Object.values(VIEW_TAGS).flat()];

/** Lo que hay que pedir al loader para mostrar una vista: sus tags del kit y sus componentes (hijos antes que el shell). */
export function tagsDeVista(vista: string): string[] {
  return [...(VIEW_KIT_TAGS[vista] ?? []), ...((VIEW_TAGS as Record<string, readonly string[]>)[vista] ?? [])];
}
