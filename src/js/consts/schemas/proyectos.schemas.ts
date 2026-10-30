/**
 * proyectos.schemas.ts — props de los componentes de la vista `proyectos` (`view/proyectos/components/`). Un schema por tag con props,
 * y el mapa `PROYECTOS_PROPS` (tag → schema) que lee `props-registro.ts`. Lo externo se parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';

/** `<av-proyectos>` (shell): id de la ruta (`#/proyectos/<id>`) y versión para forzar recarga. */
export const AvProyectosPropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0) });
export type AvProyectosProps = z.infer<typeof AvProyectosPropsSchema>;

/** Props de la vista, por tag. */
export const PROYECTOS_PROPS = {
  'av-proyectos': AvProyectosPropsSchema,
} as const;
