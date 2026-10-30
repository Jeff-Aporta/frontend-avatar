/**
 * acceso.schemas.ts — props de la vista `acceso` (login).
 */
import { z } from '../../base/zod.js';

/** `<av-acceso>` (shell): estado del formulario. */
export const AvAccesoPropsSchema = z.object({ ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvAccesoProps = z.infer<typeof AvAccesoPropsSchema>;

/** Usuario de muestra para probar la app. */
export const CredencialDemoSchema = z.object({ usuario: z.string(), password: z.string(), rol: z.string(), descripcion: z.string() });
export type CredencialDemo = z.infer<typeof CredencialDemoSchema>;

/** `<av-credenciales-demo>`: lista de usuarios de muestra; emite `av-credencial-elegida { usuario, password }`. */
export const AvCredencialesDemoPropsSchema = z.object({ items: z.array(CredencialDemoSchema).default([]) });
export type AvCredencialesDemoProps = z.infer<typeof AvCredencialesDemoPropsSchema>;

/** Props de la vista, por tag. */
export const ACCESO_PROPS = {
  'av-acceso': AvAccesoPropsSchema,
  'av-credenciales-demo': AvCredencialesDemoPropsSchema,
} as const;
