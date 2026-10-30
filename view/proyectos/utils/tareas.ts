/**
 * tareas.ts — dominio de la vista `proyectos` (sin DOM): color por prioridad, vencimiento, orden de tarjetas, columnas
 * por defecto de un proyecto nuevo, etiquetas y lectura de formularios. Los componentes solo pintan lo que esto devuelve.
 */
import type { TareaTablero } from '../../../src/js/consts/schemas/api.schemas.js';
import type { Columna, Miembro } from '../../../src/js/consts/schemas/proyectos.schemas.js';

/** Prioridades en orden de urgencia (de más a menos). */
export const PRIORIDADES = ['urgente', 'alta', 'media', 'baja'] as const;
/** Etiquetas legibles. */
export const PRIORIDAD_LABEL: Record<string, string> = { urgente: 'Urgente', alta: 'Alta', media: 'Media', baja: 'Baja' };
export const ESTADO_LABEL: Record<string, string> = { abierta: 'Abierta', en_progreso: 'En progreso', en_revision: 'En revisión', cerrada: 'Cerrada' };
export const ESTADOS_PROYECTO = ['activo', 'pausado', 'cerrado'] as const;

/** Color del kit para la etiqueta de prioridad. */
export function colorPrioridad(p: string | null | undefined): 'danger' | 'warning' | 'brand' | 'neutral' {
  if (p === 'urgente') return 'danger';
  if (p === 'alta') return 'warning';
  if (p === 'baja') return 'neutral';
  return 'brand';
}

/** Fecha `YYYY-MM-DD` de hoy (UTC). */
export const hoy = (): string => new Date().toISOString().slice(0, 10);

/** Una tarea vence si tiene fecha anterior a hoy y no está cerrada. */
export function estaVencida(t: { fvence?: string | null | undefined; estado: string }, fecha = hoy()): boolean {
  if (!t.fvence || t.estado === 'cerrada') return false;
  return String(t.fvence).slice(0, 10) < fecha;
}

/** Fecha corta para la tarjeta (`5 nov`). */
export function fechaCorta(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(`${String(iso).slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d);
}

/** Tarjetas de una columna: por `orden` y, a igual orden, por prioridad. */
export function ordenarTareas<T extends { orden?: number | null | undefined; prioridad: string }>(tareas: T[]): T[] {
  const peso = (p: string) => PRIORIDADES.indexOf(p as (typeof PRIORIDADES)[number]);
  return [...tareas].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || peso(a.prioridad) - peso(b.prioridad));
}

/** Columnas con que nace un proyecto nuevo (la última cierra la tarea). */
export function columnasPorDefecto(iproyecto: number): { iproyecto: number; nombre: string; orden: number; color: string; cierra: boolean }[] {
  return [
    { iproyecto, nombre: 'Por hacer', orden: 0, color: '#64748b', cierra: false },
    { iproyecto, nombre: 'En progreso', orden: 1, color: '#2563eb', cierra: false },
    { iproyecto, nombre: 'En revisión', orden: 2, color: '#d97706', cierra: false },
    { iproyecto, nombre: 'Hecho', orden: 3, color: '#16a34a', cierra: true },
  ];
}

/** `"odys, api"` → `["odys", "api"]` (sin vacíos ni repetidos). */
export function parsearEtiquetas(texto: string): string[] {
  return [...new Set(texto.split(',').map((s) => s.trim()).filter(Boolean))];
}

/** Etiquetas de una tarea tal como vienen (json) → arreglo de textos. */
export function etiquetasDe(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string') return parsearEtiquetas(v);
  return [];
}

/** Nombre visible de un miembro. */
export function nombreMiembro(m: Miembro): string {
  return m.usuario?.nombre || m.iusuario;
}

/** Encabezado de la tarjeta: código + título. */
export function encabezado(t: TareaTablero): string {
  return t.codigo ? `${t.codigo} · ${t.titulo}` : t.titulo;
}

/** Posición nueva de una tarjeta: el índice en que quedó en la columna destino. */
export function ordenEnColumna(ids: number[], itarea: number): number {
  const i = ids.indexOf(itarea);
  return i < 0 ? ids.length : i;
}

/** Columna por defecto para una tarea nueva: la primera que no cierra. */
export function columnaInicial(columnas: Columna[]): number | null {
  const abierta = columnas.find((c) => !c.cierra) ?? columnas[0];
  return abierta ? abierta.icolumna : null;
}
