/**
 * canales.schemas.ts — props de los componentes de la vista `canales` (`view/canales/components/`): el shell (que monta
 * el chat de `src/js/components/chat/`) y el diálogo de canal nuevo. Un schema por tag y el mapa `CANALES_PROPS` que lee
 * `props-registro.ts`. Lo externo se parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';

/** Equipo (para el selector del formulario de canal). */
export const EquipoOpcionSchema = z.object({ iequipo: z.number(), nombre: z.string() });
export type EquipoOpcion = z.infer<typeof EquipoOpcionSchema>;

/** `<av-canales>` (shell): id del chat de la ruta, diálogo de canal nuevo y aviso (p. ej. «usando el demo local»). */
export const AvCanalesPropsSchema = z.object({ id: z.string().nullable().default(null), formulario: z.boolean().default(false), aviso: z.string().default('') });
export type AvCanalesProps = z.infer<typeof AvCanalesPropsSchema>;

/** `<av-canal-form>`: diálogo de canal nuevo. Emite `av-canal-crear { nombre, tipo, descripcion, iequipo }` y `av-canal-form-cerrar`. */
export const AvCanalFormPropsSchema = z.object({ abierto: z.boolean().default(false), equipos: z.array(EquipoOpcionSchema).default([]), guardando: z.boolean().default(false), error: z.string().default('') });
export type AvCanalFormProps = z.infer<typeof AvCanalFormPropsSchema>;

/** Props de la vista, por tag. */
export const CANALES_PROPS = {
  'av-canales': AvCanalesPropsSchema,
  'av-canal-form': AvCanalFormPropsSchema,
} as const;
