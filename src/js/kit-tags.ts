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
  'iswc-command-palette',
  'iswc-app-shell',
  'iswc-doc-layout',
  'iswc-doc-index',
  'iswc-session-menu',
  'iswc-dropdown',
  'iswc-dropdown-item',
  'iswc-theme-toggle',
  'iswc-palette-selector',
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
  'iswc-stat',
  'iswc-grid-layout',
] as const;

/** Hijos que registra su padre: nunca se piden al loader (lo rechaza y tumba la carga). */
export const HIJOS_KIT = ['iswc-tab', 'iswc-tab-panel', 'iswc-kanban-column', 'iswc-kanban-card'] as const;

/** Tags del kit propios de cada vista (además de los del shell). */
export const VIEW_KIT_TAGS: Record<string, readonly string[]> = {
  inicio: [],
  acceso: ['iswc-login'],
  panel: ['iswc-stat', 'iswc-doughnut-chart', 'iswc-bar-chart', 'iswc-relative-time'],
  canales: ['iswc-split-panel', 'iswc-dialog', 'iswc-input', 'iswc-textarea', 'iswc-tab-group', 'iswc-progress-bar', 'iswc-format-bytes', 'iswc-lightbox', 'iswc-checkbox'],
  'chat-demo': ['iswc-split-panel', 'iswc-dialog', 'iswc-input', 'iswc-textarea', 'iswc-tab-group', 'iswc-progress-bar', 'iswc-format-bytes', 'iswc-lightbox', 'iswc-checkbox', 'iswc-switch'],
  proyectos: ['iswc-kanban', 'iswc-dialog', 'iswc-drawer', 'iswc-input', 'iswc-textarea', 'iswc-popconfirm', 'iswc-divider', 'iswc-relative-time'],
  crm: ['iswc-data-grid', 'iswc-dialog', 'iswc-input', 'iswc-textarea', 'iswc-popconfirm'],
  organizacion: ['iswc-tab-group', 'iswc-dialog', 'iswc-input', 'iswc-textarea', 'iswc-popconfirm'],
  asistente: ['iswc-textarea', 'iswc-relative-time'],
  admin: ['iswc-tab-group', 'iswc-data-grid', 'iswc-dialog', 'iswc-input', 'iswc-switch', 'iswc-popconfirm', 'iswc-relative-time'],
  correos: ['iswc-split-panel', 'iswc-dialog', 'iswc-input', 'iswc-textarea', 'iswc-relative-time'],
  finanzas: ['iswc-tab-group', 'iswc-data-grid', 'iswc-input', 'iswc-dialog', 'iswc-textarea', 'iswc-popconfirm', 'iswc-bar-chart', 'iswc-doughnut-chart'],
  inventario: ['iswc-tab-group', 'iswc-data-grid', 'iswc-input', 'iswc-dialog', 'iswc-textarea', 'iswc-popconfirm', 'iswc-switch'],
  rrhh: ['iswc-tab-group', 'iswc-data-grid', 'iswc-input', 'iswc-dialog', 'iswc-textarea', 'iswc-popconfirm', 'iswc-bar-chart', 'iswc-doughnut-chart'],
  demo: ['iswc-code', 'iswc-dialog'],
};

/** Todos los tags del kit de la app (shell + vistas), sin repetir: lo usa la galería. */
export const KIT_TAGS: readonly string[] = [...new Set([...SHELL_KIT_TAGS, ...Object.values(VIEW_KIT_TAGS).flat()])];

export const PREFIJO = 'av';

/** Transversales (varias vistas): shell, cabecera de página, estado vacío, persona y selector de empresa. */
export const APP_TAGS = ['av-logo', 'av-escena', 'av-buscador', 'av-cabecera', 'av-vacio', 'av-persona', 'av-empresa-selector', 'av-indicadores', 'av-app'] as const;

/** Por vista: hijos antes que el shell (el último es el shell de la vista). */
export const VIEW_TAGS = {
  inicio: ['av-hero', 'av-comunidad', 'av-caracteristicas', 'av-precios', 'av-abierto', 'av-inicio'],
  acceso: ['av-credenciales-demo', 'av-acceso'],
  panel: ['av-kpis', 'av-tareas-grafica', 'av-embudo-grafica', 'av-notificaciones', 'av-panel'],
  canales: ['av-canal-form', 'av-canales'],
  'chat-demo': ['av-chat-demo'],
  proyectos: ['av-tarea-form', 'av-tarea-detalle', 'av-tablero', 'av-proyecto-form', 'av-proyectos'],
  crm: ['av-embudo', 'av-clientes-grid', 'av-cliente-form', 'av-crm'],
  organizacion: ['av-empresa-form', 'av-invitar-form', 'av-miembros', 'av-equipos', 'av-organizacion'],
  asistente: ['av-avo-mensaje', 'av-asistente'],
  admin: ['av-usuario-form', 'av-usuarios', 'av-roles', 'av-admin'],
  correos: ['av-correo-carpetas', 'av-correo-lista', 'av-correo-lector', 'av-correo-redactar', 'av-correos'],
  finanzas: ['av-finanzas-grafica', 'av-conversor', 'av-finanzas-tabla', 'av-transaccion-form', 'av-factura-form', 'av-finanzas'],
  inventario: ['av-stock-alertas', 'av-inventario-tabla', 'av-producto-form', 'av-movimiento-form', 'av-pedido-form', 'av-proveedor-form', 'av-inventario'],
  rrhh: ['av-rrhh-grafica', 'av-asistencia-dia', 'av-rrhh-tabla', 'av-solicitudes', 'av-empleado-form', 'av-solicitud-form', 'av-rrhh'],
} as const satisfies Record<string, readonly `av-${string}`[]>;

/**
 * Familias: componentes genéricos (candidatos al kit) en `src/js/components/<familia>/` → `dist/cdn/js/components/<familia>/`.
 * No entran al arranque: los carga la vista que los usa (VIEW_FAMILIAS), junto con sus `iswc-*` (en VIEW_KIT_TAGS de esa
 * vista). Hijos antes que el shell de la familia.
 */
export const FAMILIA_TAGS = {
  chat: [
    'av-chat-item', 'av-chat-reacciones', 'av-chat-adjunto', 'av-chat-audio', 'av-chat-burbuja', 'av-chat-emojis', 'av-chat-lista', 'av-chat-cabecera',
    'av-chat-mensajes', 'av-chat-compositor', 'av-chat-visor', 'av-chat-busqueda', 'av-chat-nuevo', 'av-chat-grupo-form', 'av-chat-info', 'av-chat-reenviar',
    'av-chat-llamada', 'av-chat',
  ],
  /** Traídos de ISW-TestPatyIA para auditarlos en el explorador: solo los carga la galería. */
  paty: ['av-paty-cargando', 'av-paty-process', 'av-paty-traza', 'av-paty-pagination', 'av-paty-chat-bubble', 'av-paty-json-dialog'],
} as const satisfies Record<string, readonly `av-${string}`[]>;

/** Familias que carga cada vista (antes que sus propios componentes). */
export const VIEW_FAMILIAS: Record<string, readonly (keyof typeof FAMILIA_TAGS)[]> = {
  canales: ['chat'],
  'chat-demo': ['chat'],
  demo: ['paty'],
};

export type AppTag = (typeof APP_TAGS)[number] | (typeof VIEW_TAGS)[keyof typeof VIEW_TAGS][number] | (typeof FAMILIA_TAGS)[keyof typeof FAMILIA_TAGS][number];
export type Vista = keyof typeof VIEW_TAGS;

/** Carpeta publicada (relativa a `dist/cdn/`) de un componente propio; `null` si no es de la app. */
export function rutaComponente(tag: string): string | null {
  if ((APP_TAGS as readonly string[]).includes(tag)) return `js/components/${PREFIJO}/`;
  for (const [vista, tags] of Object.entries(VIEW_TAGS)) {
    if ((tags as readonly string[]).includes(tag)) return `view/${vista}/components/`;
  }
  for (const [familia, tags] of Object.entries(FAMILIA_TAGS)) {
    if ((tags as readonly string[]).includes(tag)) return `js/components/${familia}/`;
  }
  return null;
}

/** tag → ruta del módulo relativa a `dist/cdn/` (exige el prefijo de la app). */
export function mapaRutas(): Record<string, string> {
  const mapa: Record<string, string> = {};
  for (const tag of [...APP_TAGS, ...Object.values(VIEW_TAGS).flat(), ...Object.values(FAMILIA_TAGS).flat()]) {
    if (!tag.startsWith(`${PREFIJO}-`)) throw new Error(`kit-tags: ${tag} no lleva el prefijo ${PREFIJO}-`);
    mapa[tag] = `${rutaComponente(tag)}${tag}.js`;
  }
  return mapa;
}

/** Tags que el shell pide al arrancar (transversales + todas las vistas): solo para la galería y hosts sin carga perezosa. */
export const tagsArranque = (): string[] => [...APP_TAGS, ...Object.values(FAMILIA_TAGS).flat(), ...Object.values(VIEW_TAGS).flat()];

/** Lo que hay que pedir al loader para mostrar una vista: sus tags del kit y sus componentes (hijos antes que el shell). */
export function tagsDeVista(vista: string): string[] {
  const familias = (VIEW_FAMILIAS[vista] ?? []).flatMap((f) => FAMILIA_TAGS[f]);
  return [...(VIEW_KIT_TAGS[vista] ?? []), ...familias, ...((VIEW_TAGS as Record<string, readonly string[]>)[vista] ?? [])];
}
