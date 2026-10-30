/**
 * panel.ts — dominio del dashboard (sin DOM): tarjetas KPI a partir del resumen y series para las gráficas.
 */
import type { Resumen } from '../../../src/js/consts/schemas/api.schemas.js';

/** Una tarjeta KPI. */
export type Kpi = { id: string; label: string; value: string; helper: string; icon: string; color: 'brand' | 'neutral' | 'success' | 'warning' | 'danger' };

/** Formato de moneda (COP sin decimales por defecto). */
export const moneda = (n: number): string => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

/** Las seis tarjetas del panel, en orden. */
export function kpis(r: Resumen): Kpi[] {
  const pendientes = r.tareas.total - r.tareas.cerradas;
  return [
    { id: 'miembros', label: 'Miembros', value: String(r.miembros), helper: `${r.equipos} equipo${r.equipos === 1 ? '' : 's'}`, icon: 'mdi:account-group-outline', color: 'brand' },
    { id: 'canales', label: 'Mensajes hoy', value: String(r.mensajes_hoy), helper: `${r.canales} canal${r.canales === 1 ? '' : 'es'}`, icon: 'mdi:forum-outline', color: 'neutral' },
    { id: 'proyectos', label: 'Proyectos', value: String(r.proyectos), helper: `${r.tareas.total} tareas`, icon: 'mdi:view-column-outline', color: 'brand' },
    { id: 'pendientes', label: 'Tareas pendientes', value: String(pendientes), helper: `${r.tareas.en_revision} en revisión`, icon: 'mdi:checkbox-marked-circle-outline', color: pendientes ? 'warning' : 'success' },
    { id: 'vencidas', label: 'Vencidas', value: String(r.tareas.vencidas), helper: 'sin cerrar y fuera de fecha', icon: 'mdi:alarm', color: r.tareas.vencidas ? 'danger' : 'success' },
    { id: 'pipeline', label: 'Pipeline CRM', value: moneda(r.clientes.valor_pipeline), helper: `${r.clientes.total} cliente${r.clientes.total === 1 ? '' : 's'}`, icon: 'mdi:cash-multiple', color: 'success' },
  ];
}

/** Serie de la dona de tareas por estado (etiquetas legibles y en orden de flujo). */
export function serieTareas(t: Resumen['tareas']): { labels: string[]; data: number[] } {
  return { labels: ['Abiertas', 'En progreso', 'En revisión', 'Cerradas'], data: [t.abiertas, t.en_progreso, t.en_revision, t.cerradas] };
}

/** Etapas del embudo en orden, con 0 donde no hay clientes. */
export const ETAPAS = ['contacto', 'propuesta', 'negociacion', 'cerrado', 'perdido'] as const;
export const ETAPA_LABEL: Record<string, string> = { contacto: 'Contacto', propuesta: 'Propuesta', negociacion: 'Negociación', cerrado: 'Cerrado', perdido: 'Perdido' };

/** Serie de barras del CRM por etapa. */
export function serieEmbudo(c: Resumen['clientes']): { labels: string[]; data: number[] } {
  return { labels: ETAPAS.map((e) => ETAPA_LABEL[e]!), data: ETAPAS.map((e) => c.por_etapa[e] ?? 0) };
}
