/**
 * kit-tags.ts — REGISTRO ÚNICO de tags de la app (estándar iswc-foundation).
 *
 * Todo lo demás se deriva de aquí: el registrador (`avLoader.min.js`, vía `registerApp`), el bundle de
 * compatibilidad, la galería de demos y los guardianes. Un componente nuevo se declara UNA vez:
 *
 *   KIT_TAGS   → tags `iswc-*` del kit que la app pide al loader (solo padres registrables).
 *   APP_TAGS   → componentes transversales → `dist/cdn/js/components/av/<tag>.js`.
 *   VIEW_TAGS  → componentes de cada vista → `dist/cdn/view/<vista>/components/<tag>.js`.
 *
 * APP_TAGS y la unión de VIEW_TAGS son disjuntos: una vista no importa componentes de otra; lo compartido sube
 * a APP_TAGS. Se publica en `dist/cdn/js/kit-tags.js` para los hosts.
 */
export const KIT_TAGS = [
  'iswc-app-shell',
  'iswc-app-nav',
  'iswc-session-menu',
  'iswc-theme-toggle',
  'iswc-avatar',
  'iswc-badge',
  'iswc-bar-chart',
  'iswc-button',
  'iswc-callout',
  'iswc-card',
  'iswc-checkbox',
  'iswc-data-grid',
  'iswc-dialog',
  'iswc-divider',
  'iswc-doughnut-chart',
  'iswc-drawer',
  'iswc-dropdown',
  'iswc-icon',
  'iswc-input',
  'iswc-kanban',
  'iswc-login',
  'iswc-popconfirm',
  'iswc-relative-time',
  'iswc-select',
  'iswc-skeleton',
  'iswc-spinner',
  'iswc-stat',
  'iswc-switch',
  'iswc-tab-group',
  'iswc-tag',
  'iswc-textarea',
  'iswc-toast',
  'iswc-tooltip',
] as const;

export const PREFIJO = 'av';

/** Transversales (varias vistas): shell, cabecera de página, estado vacío, persona y selector de empresa. */
export const APP_TAGS = ['av-cabecera', 'av-vacio', 'av-persona', 'av-empresa-selector', 'av-app'] as const;

/** Por vista: hijos antes que el shell (el último es el shell de la vista). */
export const VIEW_TAGS = {
  inicio: ['av-hero', 'av-caracteristicas', 'av-precios', 'av-inicio'],
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

/** Tags que el shell pide al arrancar (transversales + todas las vistas). */
export const tagsArranque = (): string[] => [...APP_TAGS, ...Object.values(VIEW_TAGS).flat()];
