/**
 * api.schemas.ts — forma de lo que llega del API fuera de los POJOs de DER (paths que devuelven JSON).
 * Los POJOs (empresas, tareas, mensajes…) ya los valida el `ClientController` de DER; aquí solo los JSON de los flujos.
 * Todo lo externo se PARSEA con `safeParse`, nunca se castea con `as`.
 */
import { z } from '../../base/zod.js';

/** `GET empresas/yo`: el usuario de la sesión, sus empresas y notificaciones sin leer. */
export const YoSchema = z.object({
  iusuario: z.string(),
  nombre: z.string().nullable(),
  email: z.string().nullable(),
  empresas: z.array(z.object({ iempresa: z.number(), nombre: z.string(), rol: z.string() })),
  sin_leer: z.number(),
});
export type Yo = z.infer<typeof YoSchema>;

/** `GET permisos`: perfil de permisos (rol efectivo y vector de acciones). */
export const PerfilSchema = z.object({
  usuario: z.string().nullable(),
  irol: z.string(),
  igrupo: z.string(),
  roles: z.array(z.string()),
  perms: z.record(z.string(), z.unknown()),
});
export type Perfil = z.infer<typeof PerfilSchema>;

/** `GET empresa/{iempresa}/resumen`: KPIs del dashboard. */
export const ResumenSchema = z.object({
  iempresa: z.number(),
  nombre: z.string(),
  miembros: z.number(),
  equipos: z.number(),
  canales: z.number(),
  proyectos: z.number(),
  tareas: z.object({ total: z.number(), abiertas: z.number(), en_progreso: z.number(), en_revision: z.number(), cerradas: z.number(), vencidas: z.number() }),
  clientes: z.object({ total: z.number(), por_etapa: z.record(z.string(), z.number()), valor_pipeline: z.number() }),
  mensajes_hoy: z.number(),
});
export type Resumen = z.infer<typeof ResumenSchema>;

/** `GET canales/mios`: canal visible con no leídos y último mensaje. */
export const CanalMioSchema = z.object({
  icanal: z.number(),
  iempresa: z.number(),
  iequipo: z.number().nullable(),
  nombre: z.string(),
  tipo: z.string(),
  descripcion: z.string().nullable(),
  sin_leer: z.number(),
  ultimo: z.object({ contenido: z.string(), iusuario: z.string(), creado: z.string() }).nullable(),
});
export type CanalMio = z.infer<typeof CanalMioSchema>;

/** Tarea tal como viaja dentro del tablero (JSON plano del POJO). */
export const TareaTableroSchema = z.object({
  itarea: z.number(),
  codigo: z.string().nullable().optional(),
  iproyecto: z.number(),
  icolumna: z.number(),
  titulo: z.string(),
  descripcion: z.string().nullable().optional(),
  prioridad: z.string(),
  estado: z.string(),
  asignado_a: z.string().nullable().optional(),
  creado_por: z.string().nullable().optional(),
  fvence: z.string().nullable().optional(),
  orden: z.number().nullable().optional(),
  etiquetas: z.unknown().optional(),
  asignado: z.object({ iusuario: z.string(), nombre: z.string().nullable().optional() }).nullable().optional(),
});
export type TareaTablero = z.infer<typeof TareaTableroSchema>;

/** `GET proyecto/{iproyecto}/tablero`: columnas con sus tareas. */
export const TableroSchema = z.object({
  iproyecto: z.number(),
  nombre: z.string(),
  columnas: z.array(z.object({ icolumna: z.number(), nombre: z.string(), orden: z.number(), color: z.string().nullable(), limite: z.number().nullable(), tareas: z.array(TareaTableroSchema) })),
});
export type Tablero = z.infer<typeof TableroSchema>;

/** `POST consultas/preguntar`: respuesta del asistente AVO. */
export const RespuestaAsistenteSchema = z.object({ iconsulta: z.number(), pregunta: z.string(), respuesta: z.string(), sugerencias: z.array(z.string()) });
export type RespuestaAsistente = z.infer<typeof RespuestaAsistenteSchema>;

/** Notificación (lista de `notificaciones/mias`). */
export const NotificacionSchema = z.object({
  inotificacion: z.number(),
  iusuario: z.string(),
  tipo: z.string(),
  titulo: z.string(),
  cuerpo: z.string().nullable().optional(),
  leida: z.boolean().nullable().optional(),
  referencia: z.unknown().optional(),
  creado: z.union([z.string(), z.date()]).nullable().optional(),
});
export type Notificacion = z.infer<typeof NotificacionSchema>;
