/**
 * acceso.schemas.ts — props de la vista `acceso` (login).
 */
import { z } from '../../base/zod.js';

/** `<av-acceso>` (shell): estado del formulario. */
export const AvAccesoPropsSchema = z.object({ ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvAccesoProps = z.infer<typeof AvAccesoPropsSchema>;

/** Props de la vista, por tag. */
export const ACCESO_PROPS = {
  'av-acceso': AvAccesoPropsSchema,
} as const;
