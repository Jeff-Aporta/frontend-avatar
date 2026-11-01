/**
 * rrhh.schemas.ts — recursos humanos (`view/rrhh/`): empleados, asistencias, solicitudes y el resumen
 * (`empleados/resumen`), más los datos de los formularios y las props de los componentes de la vista. Lo externo se
 * parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';

export const ESTADOS_EMPLEADO = ['activo', 'vacaciones', 'licencia', 'retirado'] as const;
export const ESTADOS_ASISTENCIA = ['presente', 'ausente', 'retardo', 'vacaciones'] as const;
export const TIPOS_SOLICITUD = ['vacaciones', 'permiso', 'certificado'] as const;
export const ESTADOS_SOLICITUD = ['pendiente', 'aprobada', 'rechazada'] as const;

const fecha = z.union([z.string(), z.date()]).nullable().optional();

/** Empleado. */
export const EmpleadoSchema = z.object({
  iempleado: z.number(),
  iempresa: z.number(),
  iusuario: z.string().nullable().optional(),
  nombre: z.string(),
  email: z.string().nullable().optional(),
  departamento: z.string().nullable().optional(),
  cargo: z.string().nullable().optional(),
  salario: z.coerce.number().nullable().optional(),
  estado: z.string(),
  fingreso: fecha,
  creado: fecha,
});
export type Empleado = z.infer<typeof EmpleadoSchema>;

/** Asistencia de un empleado en una fecha. */
export const AsistenciaSchema = z.object({ iempleado: z.number(), fecha: z.union([z.string(), z.date()]), iempresa: z.number(), estado: z.string(), entrada: z.string().nullable().optional(), salida: z.string().nullable().optional() });
export type Asistencia = z.infer<typeof AsistenciaSchema>;

/** Solicitud (vacaciones, permiso, certificado). */
export const SolicitudSchema = z.object({
  isolicitud: z.number(),
  iempresa: z.number(),
  iempleado: z.number(),
  tipo: z.string(),
  desde: fecha,
  hasta: fecha,
  motivo: z.string().nullable().optional(),
  estado: z.string(),
  resuelto_por: z.string().nullable().optional(),
  comentario: z.string().nullable().optional(),
  resuelto: fecha,
  creado: fecha,
});
export type Solicitud = z.infer<typeof SolicitudSchema>;

/** `GET empleados/resumen`. */
export const ResumenRrhhSchema = z.object({
  iempresa: z.number(),
  empleados: z.number(),
  por_estado: z.record(z.string(), z.number()),
  asistencia_hoy: z.object({ presente: z.number(), ausente: z.number(), retardo: z.number(), vacaciones: z.number(), sin_marcar: z.number(), porcentaje: z.number() }),
  solicitudes_pendientes: z.number(),
  nomina_mensual: z.number(),
});
export type ResumenRrhh = z.infer<typeof ResumenRrhhSchema>;

/** Datos del formulario de empleado. */
export const EmpleadoDatosSchema = z.object({
  iempleado: z.number().nullable().default(null),
  nombre: z.string().trim().min(1).max(160),
  email: z.string().email().max(160).nullable().default(null),
  departamento: z.string().max(80).nullable().default(null),
  cargo: z.string().max(120).nullable().default(null),
  salario: z.number().min(0),
  estado: z.enum(ESTADOS_EMPLEADO),
  fingreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  iusuario: z.string().nullable().default(null),
});
export type EmpleadoDatos = z.infer<typeof EmpleadoDatosSchema>;

/** Marca de asistencia (lo que va a `empleado/{id}/asistencia`). */
export const MarcaAsistenciaSchema = z.object({ iempleado: z.number(), estado: z.enum(ESTADOS_ASISTENCIA), fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), entrada: z.string().regex(/^\d{2}:\d{2}$/).nullable().default(null), salida: z.string().regex(/^\d{2}:\d{2}$/).nullable().default(null) });
export type MarcaAsistencia = z.infer<typeof MarcaAsistenciaSchema>;

/** Datos del formulario de solicitud. */
export const SolicitudDatosSchema = z
  .object({ iempleado: z.number(), tipo: z.enum(TIPOS_SOLICITUD), desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), hasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), motivo: z.string().max(2000).nullable().default(null) })
  .refine((v) => v.hasta >= v.desde, 'La fecha final no puede ser anterior a la inicial');
export type SolicitudDatos = z.infer<typeof SolicitudDatosSchema>;

/** Miembro de la empresa (para vincular un empleado con su usuario). */
export const MiembroRrhhSchema = z.object({ iusuario: z.string(), usuario: z.object({ iusuario: z.string(), nombre: z.string().nullable().optional() }).nullable().optional() });
export type MiembroRrhh = z.infer<typeof MiembroRrhhSchema>;

/** Fila del día de asistencia: empleado + su marca (si la hay). */
export const FilaAsistenciaSchema = z.object({ iempleado: z.number(), nombre: z.string(), cargo: z.string(), departamento: z.string(), estadoEmpleado: z.string(), estado: z.string().nullable(), entrada: z.string().nullable(), salida: z.string().nullable() });
export type FilaAsistencia = z.infer<typeof FilaAsistenciaSchema>;


/** `<av-rrhh>` (shell). */
export const AvRrhhPropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0) });
export type AvRrhhProps = z.infer<typeof AvRrhhPropsSchema>;

/** `<av-rrhh-grafica>`: asistencia de hoy y plantilla por departamento. */
export const AvRrhhGraficaPropsSchema = z.object({ resumen: ResumenRrhhSchema.nullable().default(null), departamentos: z.array(z.object({ nombre: z.string(), cantidad: z.number() })).default([]) });
export type AvRrhhGraficaProps = z.infer<typeof AvRrhhGraficaPropsSchema>;

/** `<av-asistencia-dia>`: control de asistencia de una fecha. */
export const AvAsistenciaDiaPropsSchema = z.object({ fecha: z.string().default(''), filas: z.array(FilaAsistenciaSchema).default([]), cargando: z.boolean().default(false), puedeMarcar: z.boolean().default(false), ocupados: z.array(z.number()).default([]) });
export type AvAsistenciaDiaProps = z.infer<typeof AvAsistenciaDiaPropsSchema>;

/** Solicitud lista para pintar (con el nombre del empleado). */
export const SolicitudVistaSchema = SolicitudSchema.extend({ empleado: z.string() });
export type SolicitudVista = z.infer<typeof SolicitudVistaSchema>;

/** `<av-solicitudes>`: solicitudes filtradas por estado. */
export const AvSolicitudesPropsSchema = z.object({ solicitudes: z.array(SolicitudVistaSchema).nullable().default(null), filtro: z.string().default('pendiente'), puedeResolver: z.boolean().default(false), compacto: z.boolean().default(false), ocupados: z.array(z.number()).default([]) });
export type AvSolicitudesProps = z.infer<typeof AvSolicitudesPropsSchema>;

/** `<av-empleado-form>`: diálogo de empleado. */
export const AvEmpleadoFormPropsSchema = z.object({ abierto: z.boolean().default(false), empleado: EmpleadoSchema.nullable().default(null), miembros: z.array(MiembroRrhhSchema).default([]), puedeEscribir: z.boolean().default(false), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvEmpleadoFormProps = z.infer<typeof AvEmpleadoFormPropsSchema>;

/** `<av-solicitud-form>`: diálogo de nueva solicitud. */
export const AvSolicitudFormPropsSchema = z.object({ abierto: z.boolean().default(false), empleados: z.array(EmpleadoSchema).default([]), iempleado: z.number().nullable().default(null), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvSolicitudFormProps = z.infer<typeof AvSolicitudFormPropsSchema>;

/** Props de la vista, por tag. */
export const RRHH_PROPS = {
  'av-rrhh': AvRrhhPropsSchema,
  'av-rrhh-grafica': AvRrhhGraficaPropsSchema,
  'av-asistencia-dia': AvAsistenciaDiaPropsSchema,
  'av-solicitudes': AvSolicitudesPropsSchema,
  'av-empleado-form': AvEmpleadoFormPropsSchema,
  'av-solicitud-form': AvSolicitudFormPropsSchema,
} as const;
