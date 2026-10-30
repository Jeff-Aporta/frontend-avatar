/**
 * panel.schemas.ts — props de la vista `panel` (dashboard).
 */
import { z } from '../../base/zod.js';
import { NotificacionSchema, ResumenSchema } from './api.schemas.js';

/** `<av-panel>` (shell): resumen cargado (o null mientras carga) y error. */
export const AvPanelPropsSchema = z.object({ resumen: ResumenSchema.nullable().default(null), error: z.string().default(''), version: z.number().default(0) });
export type AvPanelProps = z.infer<typeof AvPanelPropsSchema>;

/** `<av-kpis>`: tarjetas KPI a partir del resumen. */
export const AvKpisPropsSchema = z.object({ resumen: ResumenSchema.nullable().default(null) });
export type AvKpisProps = z.infer<typeof AvKpisPropsSchema>;

/** `<av-tareas-grafica>`: dona de tareas por estado. */
export const AvTareasGraficaPropsSchema = z.object({ tareas: ResumenSchema.shape.tareas.nullable().default(null) });
export type AvTareasGraficaProps = z.infer<typeof AvTareasGraficaPropsSchema>;

/** `<av-embudo-grafica>`: barras del CRM por etapa. */
export const AvEmbudoGraficaPropsSchema = z.object({ clientes: ResumenSchema.shape.clientes.nullable().default(null) });
export type AvEmbudoGraficaProps = z.infer<typeof AvEmbudoGraficaPropsSchema>;

/** `<av-notificaciones>`: lista de notificaciones del usuario; emite `av-notificaciones-leer { ids }`. */
export const AvNotificacionesPropsSchema = z.object({ items: z.array(NotificacionSchema).default([]), cargando: z.boolean().default(false) });
export type AvNotificacionesProps = z.infer<typeof AvNotificacionesPropsSchema>;

/** Props de la vista, por tag. */
export const PANEL_PROPS = {
  'av-panel': AvPanelPropsSchema,
  'av-kpis': AvKpisPropsSchema,
  'av-tareas-grafica': AvTareasGraficaPropsSchema,
  'av-embudo-grafica': AvEmbudoGraficaPropsSchema,
  'av-notificaciones': AvNotificacionesPropsSchema,
} as const;
