/**
 * canales.schemas.ts — props de los componentes de la vista `canales` (`view/canales/components/`): lista de canales,
 * conversación, mensaje, redactor, formulario de canal y el shell. Un schema por tag y el mapa `CANALES_PROPS` que lee
 * `props-registro.ts`. Lo externo (mensajes, canales) se parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';
import { CanalMioSchema } from './api.schemas.js';

/** Mensaje de un canal tal como lo devuelve el controller (POJO plano) con su autor incluido. */
export const MensajeSchema = z.object({
  imensaje: z.number(),
  icanal: z.number(),
  iusuario: z.string(),
  contenido: z.string(),
  tipo: z.string().nullable().optional(),
  respuesta_a: z.number().nullable().optional(),
  editado: z.boolean().nullable().optional(),
  creado: z.union([z.string(), z.date()]).nullable().optional(),
  autor: z.object({ iusuario: z.string(), nombre: z.string().nullable().optional() }).nullable().optional(),
});
export type Mensaje = z.infer<typeof MensajeSchema>;

/** Equipo (para el selector del formulario de canal). */
export const EquipoOpcionSchema = z.object({ iequipo: z.number(), nombre: z.string() });
export type EquipoOpcion = z.infer<typeof EquipoOpcionSchema>;

/** `<av-canales>` (shell): id de la ruta (`#/canales/<icanal>`) y versión para forzar recarga. */
export const AvCanalesPropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0), canales: z.array(CanalMioSchema).default([]), cargando: z.boolean().default(true), error: z.string().default(''), formulario: z.boolean().default(false) });
export type AvCanalesProps = z.infer<typeof AvCanalesPropsSchema>;

/** `<av-canal-lista>`: canales con no leídos y el activo. Emite `av-canal-elegido { icanal }` y `av-canal-nuevo`. */
export const AvCanalListaPropsSchema = z.object({ canales: z.array(CanalMioSchema).default([]), activo: z.number().nullable().default(null), cargando: z.boolean().default(false), puedeCrear: z.boolean().default(false) });
export type AvCanalListaProps = z.infer<typeof AvCanalListaPropsSchema>;

/** `<av-mensaje>`: un mensaje; `propio` lo alinea a la derecha. */
export const AvMensajePropsSchema = z.object({ mensaje: MensajeSchema.nullable().default(null), propio: z.boolean().default(false) });
export type AvMensajeProps = z.infer<typeof AvMensajePropsSchema>;

/** `<av-redactor>`: caja de escribir. Emite `av-mensaje-enviar { contenido }`. */
export const AvRedactorPropsSchema = z.object({ deshabilitado: z.boolean().default(false), enviando: z.boolean().default(false), placeholder: z.string().default('Escribe un mensaje… (Enter envía, Shift+Enter salto de línea)') });
export type AvRedactorProps = z.infer<typeof AvRedactorPropsSchema>;

/** `<av-conversacion>`: cabecera del canal, mensajes agrupados por día y el redactor. Emite `av-conversacion-refrescar`, `av-conversacion-volver` y reemite `av-mensaje-enviar`. */
export const AvConversacionPropsSchema = z.object({ canal: CanalMioSchema.nullable().default(null), mensajes: z.array(MensajeSchema).default([]), yo: z.string().default(''), cargando: z.boolean().default(false), enviando: z.boolean().default(false), puedeEscribir: z.boolean().default(false) });
export type AvConversacionProps = z.infer<typeof AvConversacionPropsSchema>;

/** `<av-canal-form>`: diálogo de canal nuevo. Emite `av-canal-crear { nombre, tipo, descripcion, iequipo }` y `av-canal-form-cerrar`. */
export const AvCanalFormPropsSchema = z.object({ abierto: z.boolean().default(false), equipos: z.array(EquipoOpcionSchema).default([]), guardando: z.boolean().default(false), error: z.string().default('') });
export type AvCanalFormProps = z.infer<typeof AvCanalFormPropsSchema>;

/** Props de la vista, por tag. */
export const CANALES_PROPS = {
  'av-canales': AvCanalesPropsSchema,
  'av-canal-lista': AvCanalListaPropsSchema,
  'av-mensaje': AvMensajePropsSchema,
  'av-redactor': AvRedactorPropsSchema,
  'av-conversacion': AvConversacionPropsSchema,
  'av-canal-form': AvCanalFormPropsSchema,
} as const;
