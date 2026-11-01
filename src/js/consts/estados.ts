/**
 * estados.ts — presets de `<iswc-empty-state>` que comparten las vistas: sin empresa y sin permiso. Un texto propio de la
 * vista se pasa como argumento; icono y título viven solo aquí. Los vacíos propios de cada dato siguen en su vista.
 */
import type { EstadoVacio } from './schemas/componentes.schemas.js';

/** Hay empresas, pero ninguna activa. `que` completa «Elige una empresa en la barra para ver …». */
export const sinEmpresa = (que: string): EstadoVacio => ({ icono: 'mdi:domain', titulo: 'Sin empresa activa', texto: `Elige una empresa en la barra para ver ${que}.` });

/** El usuario no pertenece a ninguna empresa. */
export const sinMembresia = (texto: string): EstadoVacio => ({ icono: 'mdi:domain', titulo: 'Aún no perteneces a una empresa', texto });

/** Al rol le falta un permiso. `area` completa «Sin permiso de …». */
export const sinPermiso = (area: string, texto: string, icono = 'mdi:lock-outline'): EstadoVacio => ({ icono, titulo: `Sin permiso de ${area}`, texto });
