/**
 * correos.schemas.ts — DUO eMail (`view/correos/`): forma de la bandeja y el resumen que devuelven los flujos
 * `correos/bandeja` y `correos/resumen`, del borrador que se envía por `correos/enviar` y de las props de los
 * componentes de la vista. Lo externo se parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';

/** Carpetas del buzón, en orden. */
export const CARPETAS_CORREO = ['entrada', 'enviados', 'archivados', 'papelera'] as const;
export type CarpetaCorreo = (typeof CARPETAS_CORREO)[number];

/** Un correo visto desde el buzón del usuario. */
export const CorreoBandejaSchema = z.object({
  ibuzon: z.number(),
  icorreo: z.number(),
  carpeta: z.string(),
  leido: z.boolean(),
  destacado: z.boolean(),
  remitente: z.string(),
  destinatarios: z.array(z.string()).default([]),
  cc: z.array(z.string()).default([]),
  asunto: z.string(),
  cuerpo: z.string(),
  etiquetas: z.array(z.string()).default([]),
  respuesta_a: z.number().nullable().default(null),
  creado: z.string(),
});
export type CorreoBandeja = z.infer<typeof CorreoBandejaSchema>;

/** `GET correos/bandeja`: correos de la carpeta, no leídos de la entrada y conteo por carpeta. */
export const BandejaSchema = z.object({ iempresa: z.number(), carpeta: z.string(), no_leidos: z.number(), por_carpeta: z.record(z.string(), z.number()), correos: z.array(CorreoBandejaSchema) });
export type Bandeja = z.infer<typeof BandejaSchema>;

/** `GET correos/resumen`: no leídos, destacados, total en entrada y enviados hoy. */
export const ResumenCorreoSchema = z.object({ iempresa: z.number(), no_leidos: z.number(), destacados: z.number(), entrada: z.number(), enviados_hoy: z.number() });
export type ResumenCorreo = z.infer<typeof ResumenCorreoSchema>;

/** Miembro de la empresa (destinatario posible) con su nombre. */
export const MiembroCorreoSchema = z.object({ iusuario: z.string(), usuario: z.object({ iusuario: z.string(), nombre: z.string().nullable().optional() }).nullable().optional() });
export type MiembroCorreo = z.infer<typeof MiembroCorreoSchema>;

/** Borrador del formulario de redacción (lo que va a `correos/enviar`, sin `iempresa`). */
export const CorreoDatosSchema = z.object({
  destinatarios: z.array(z.string().min(1)).min(1),
  cc: z.array(z.string().min(1)).default([]),
  asunto: z.string().trim().min(1).max(200),
  cuerpo: z.string().trim().min(1).max(20000),
  etiquetas: z.array(z.string().min(1).max(40)).max(10).default([]),
  respuesta_a: z.number().nullable().default(null),
});
export type CorreoDatos = z.infer<typeof CorreoDatosSchema>;

/** Borrador inicial (redactar, responder, reenviar): campos sueltos, aún sin validar. */
export const BorradorCorreoSchema = z.object({
  destinatarios: z.array(z.string()).default([]),
  cc: z.array(z.string()).default([]),
  asunto: z.string().default(''),
  cuerpo: z.string().default(''),
  etiquetas: z.array(z.string()).default([]),
  respuesta_a: z.number().nullable().default(null),
});
export type BorradorCorreo = z.infer<typeof BorradorCorreoSchema>;

/** Una carpeta con su conteo para la navegación. */
export const CarpetaInfoSchema = z.object({ carpeta: z.string(), label: z.string(), icono: z.string(), total: z.number(), noLeidos: z.number() });
export type CarpetaInfo = z.infer<typeof CarpetaInfoSchema>;

/** Correo relacionado (misma conversación o parecido). */
export const CorreoRelacionadoSchema = z.object({ ibuzon: z.number(), asunto: z.string(), remitente: z.string(), creado: z.string() });
export type CorreoRelacionado = z.infer<typeof CorreoRelacionadoSchema>;

/** `<av-correos>` (shell): carpeta de la ruta y versión para recargar. */
export const AvCorreosPropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0) });
export type AvCorreosProps = z.infer<typeof AvCorreosPropsSchema>;

/** `<av-correo-carpetas>`: carpetas con conteo y la activa. */
export const AvCorreoCarpetasPropsSchema = z.object({ carpetas: z.array(CarpetaInfoSchema).default([]), activa: z.string().default('entrada') });
export type AvCorreoCarpetasProps = z.infer<typeof AvCorreoCarpetasPropsSchema>;

/** `<av-correo-lista>`: correos de la carpeta (ya filtrados por la búsqueda), el abierto y nombres por usuario. */
export const AvCorreoListaPropsSchema = z.object({
  correos: z.array(CorreoBandejaSchema).default([]),
  activo: z.number().nullable().default(null),
  carpeta: z.string().default('entrada'),
  nombres: z.record(z.string(), z.string()).default({}),
  texto: z.string().default(''),
  cargando: z.boolean().default(false),
  puedeMarcar: z.boolean().default(false),
});
export type AvCorreoListaProps = z.infer<typeof AvCorreoListaPropsSchema>;

/** `<av-correo-lector>`: el correo abierto, nombres, permiso y relacionados (se ocultan si no hay). */
export const AvCorreoLectorPropsSchema = z.object({
  correo: CorreoBandejaSchema.nullable().default(null),
  nombres: z.record(z.string(), z.string()).default({}),
  puedeMarcar: z.boolean().default(false),
  relacionados: z.array(CorreoRelacionadoSchema).default([]),
});
export type AvCorreoLectorProps = z.infer<typeof AvCorreoLectorPropsSchema>;

/** `<av-correo-redactar>`: diálogo de redacción. */
export const AvCorreoRedactarPropsSchema = z.object({
  abierto: z.boolean().default(false),
  borrador: BorradorCorreoSchema.default({ destinatarios: [], cc: [], asunto: '', cuerpo: '', etiquetas: [], respuesta_a: null }),
  miembros: z.array(MiembroCorreoSchema).default([]),
  yo: z.string().default(''),
  ocupado: z.boolean().default(false),
  error: z.string().default(''),
});
export type AvCorreoRedactarProps = z.infer<typeof AvCorreoRedactarPropsSchema>;

/** Props de la vista, por tag. */
export const CORREOS_PROPS = {
  'av-correos': AvCorreosPropsSchema,
  'av-correo-carpetas': AvCorreoCarpetasPropsSchema,
  'av-correo-lista': AvCorreoListaPropsSchema,
  'av-correo-lector': AvCorreoLectorPropsSchema,
  'av-correo-redactar': AvCorreoRedactarPropsSchema,
} as const;
