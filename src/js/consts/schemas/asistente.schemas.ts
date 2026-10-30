/**
 * asistente.schemas.ts — props de los componentes de la vista `asistente` (`view/asistente/components/`): burbuja y
 * shell del chat con AVO. Un schema por tag y el mapa `ASISTENTE_PROPS` que lee `props-registro.ts`.
 */
import { z } from '../../base/zod.js';

/** Un turno del chat: quién habla, texto y hora. */
export const TurnoSchema = z.object({ id: z.string(), quien: z.enum(['yo', 'avo']), texto: z.string(), creado: z.string().nullable().default(null) });
export type Turno = z.infer<typeof TurnoSchema>;

/** Consulta guardada (historial de `consultas`). */
export const ConsultaSchema = z.object({ iconsulta: z.number(), iusuario: z.string(), iempresa: z.number().nullable().optional(), pregunta: z.string(), respuesta: z.string().nullable().optional(), creado: z.union([z.string(), z.date()]).nullable().optional() });
export type Consulta = z.infer<typeof ConsultaSchema>;

/** `<av-avo-mensaje>`: una burbuja (usuario o AVO). */
export const AvAvoMensajePropsSchema = z.object({ turno: TurnoSchema.nullable().default(null), nombre: z.string().default('') });
export type AvAvoMensajeProps = z.infer<typeof AvAvoMensajePropsSchema>;

/** `<av-asistente>` (shell): id de la ruta, turnos, sugerencias y estado. */
export const AvAsistentePropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0), turnos: z.array(TurnoSchema).default([]), sugerencias: z.array(z.string()).default([]), pensando: z.boolean().default(false), cargando: z.boolean().default(true), error: z.string().default('') });
export type AvAsistenteProps = z.infer<typeof AvAsistentePropsSchema>;

/** Props de la vista, por tag. */
export const ASISTENTE_PROPS = {
  'av-asistente': AvAsistentePropsSchema,
  'av-avo-mensaje': AvAvoMensajePropsSchema,
} as const;
