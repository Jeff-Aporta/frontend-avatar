/**
 * crm.schemas.ts — props de los componentes de la vista `crm` (`view/crm/components/`). Un schema por tag con props,
 * y el mapa `CRM_PROPS` (tag → schema) que lee `props-registro.ts`. Lo externo se parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';

/** `<av-crm>` (shell): id de la ruta (`#/crm/<id>`) y versión para forzar recarga. */
export const AvCrmPropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0) });
export type AvCrmProps = z.infer<typeof AvCrmPropsSchema>;

/** Props de la vista, por tag. */
export const CRM_PROPS = {
  'av-crm': AvCrmPropsSchema,
} as const;
