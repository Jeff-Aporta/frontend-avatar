/**
 * proyectos.schemas.ts — props de los componentes de la vista `proyectos` (`view/proyectos/components/`) y las formas de
 * los datos que llegan del API para esta vista (proyectos, miembros, comentarios). Lo externo se parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';
import { TableroSchema, TareaTableroSchema } from './api.schemas.js';

/** Proyecto (fila de `proyectos`). */
export const ProyectoSchema = z.object({ iproyecto: z.number(), iempresa: z.number(), iequipo: z.number().nullable().optional(), nombre: z.string(), descripcion: z.string().nullable().optional(), estado: z.string(), finicio: z.string().nullable().optional(), ffin: z.string().nullable().optional() });
export type Proyecto = z.infer<typeof ProyectoSchema>;

/** Miembro de la empresa con su usuario (para asignar). */
export const MiembroSchema = z.object({ iempresa: z.number(), iusuario: z.string(), rol: z.string().nullable().optional(), usuario: z.object({ iusuario: z.string(), nombre: z.string().nullable().optional() }).nullable().optional() });
export type Miembro = z.infer<typeof MiembroSchema>;

/** Equipo (para el formulario de proyecto). */
export const EquipoSchema = z.object({ iequipo: z.number(), nombre: z.string() });
export type Equipo = z.infer<typeof EquipoSchema>;

/** Columna del tablero (para el formulario de tarea). */
export const ColumnaSchema = z.object({ icolumna: z.number(), nombre: z.string(), orden: z.number().nullable().optional(), cierra: z.boolean().nullable().optional() });
export type Columna = z.infer<typeof ColumnaSchema>;

/** Comentario de una tarea con su autor. */
export const ComentarioSchema = z.object({ icomentario: z.number(), itarea: z.number(), iusuario: z.string(), contenido: z.string(), creado: z.union([z.string(), z.date()]).nullable().optional(), autor: z.object({ iusuario: z.string(), nombre: z.string().nullable().optional() }).nullable().optional() });
export type Comentario = z.infer<typeof ComentarioSchema>;

/** Datos del formulario de tarea (lo que se envía a `tareas`). */
export const TareaDatosSchema = z.object({ itarea: z.number().nullable().default(null), iproyecto: z.number(), icolumna: z.number(), titulo: z.string().min(1), descripcion: z.string().nullable().default(null), prioridad: z.string().default('media'), asignado_a: z.string().nullable().default(null), fvence: z.string().nullable().default(null), etiquetas: z.array(z.string()).default([]) });
export type TareaDatos = z.infer<typeof TareaDatosSchema>;

/** Datos del formulario de proyecto. */
export const ProyectoDatosSchema = z.object({ nombre: z.string().min(1), descripcion: z.string().nullable().default(null), estado: z.string().default('activo'), finicio: z.string().nullable().default(null), ffin: z.string().nullable().default(null), iequipo: z.number().nullable().default(null) });
export type ProyectoDatos = z.infer<typeof ProyectoDatosSchema>;

/** `<av-proyectos>` (shell): id de la ruta (`#/proyectos/<iproyecto>`) y versión para forzar recarga. */
export const AvProyectosPropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0) });
export type AvProyectosProps = z.infer<typeof AvProyectosPropsSchema>;

/** `<av-tablero>`: tablero cargado, si se puede mover/crear. */
export const AvTableroPropsSchema = z.object({ tablero: TableroSchema.nullable().default(null), cargando: z.boolean().default(false), puedeMover: z.boolean().default(false) });
export type AvTableroProps = z.infer<typeof AvTableroPropsSchema>;

/** `<av-tarea-form>`: diálogo crear/editar. */
export const AvTareaFormPropsSchema = z.object({ abierto: z.boolean().default(false), tarea: TareaTableroSchema.nullable().default(null), iproyecto: z.number().nullable().default(null), icolumna: z.number().nullable().default(null), columnas: z.array(ColumnaSchema).default([]), miembros: z.array(MiembroSchema).default([]), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvTareaFormProps = z.infer<typeof AvTareaFormPropsSchema>;

/** `<av-tarea-detalle>`: cajón con la tarea y sus comentarios. */
export const AvTareaDetallePropsSchema = z.object({ abierto: z.boolean().default(false), tarea: TareaTableroSchema.nullable().default(null), comentarios: z.array(ComentarioSchema).default([]), puedeComentar: z.boolean().default(false), puedeEditar: z.boolean().default(false), puedeEliminar: z.boolean().default(false), ocupado: z.boolean().default(false) });
export type AvTareaDetalleProps = z.infer<typeof AvTareaDetallePropsSchema>;

/** `<av-proyecto-form>`: diálogo nuevo proyecto. */
export const AvProyectoFormPropsSchema = z.object({ abierto: z.boolean().default(false), equipos: z.array(EquipoSchema).default([]), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvProyectoFormProps = z.infer<typeof AvProyectoFormPropsSchema>;

/** Props de la vista, por tag. */
export const PROYECTOS_PROPS = {
  'av-proyectos': AvProyectosPropsSchema,
  'av-tablero': AvTableroPropsSchema,
  'av-tarea-form': AvTareaFormPropsSchema,
  'av-tarea-detalle': AvTareaDetallePropsSchema,
  'av-proyecto-form': AvProyectoFormPropsSchema,
} as const;
