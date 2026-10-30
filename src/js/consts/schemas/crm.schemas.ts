/**
 * crm.schemas.ts — props de los componentes de la vista `crm` (`view/crm/components/`) y la forma de los clientes y
 * miembros que llegan del API. Lo externo se parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';

/** Etapas del embudo, en orden. */
export const ETAPAS_CRM = ['contacto', 'propuesta', 'negociacion', 'cerrado', 'perdido'] as const;

/** Cliente (fila de `clientes`). */
export const ClienteSchema = z.object({
  icliente: z.number(),
  iempresa: z.number(),
  nombre: z.string(),
  organizacion: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  etapa: z.string(),
  valor: z.coerce.number().nullable().optional(),
  responsable: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
  creado: z.union([z.string(), z.date()]).nullable().optional(),
});
export type Cliente = z.infer<typeof ClienteSchema>;

/** Miembro de la empresa (responsable posible). */
export const MiembroCrmSchema = z.object({ iusuario: z.string(), usuario: z.object({ iusuario: z.string(), nombre: z.string().nullable().optional() }).nullable().optional() });
export type MiembroCrm = z.infer<typeof MiembroCrmSchema>;

/** Datos del formulario de cliente. */
export const ClienteDatosSchema = z.object({
  icliente: z.number().nullable().default(null),
  nombre: z.string().min(1),
  organizacion: z.string().nullable().default(null),
  email: z.string().email().nullable().default(null),
  telefono: z.string().nullable().default(null),
  etapa: z.enum(ETAPAS_CRM).default('contacto'),
  valor: z.number().min(0).default(0),
  responsable: z.string().nullable().default(null),
  notas: z.string().nullable().default(null),
});
export type ClienteDatos = z.infer<typeof ClienteDatosSchema>;

/** Totales de una etapa. */
export const EtapaTotalSchema = z.object({ etapa: z.string(), label: z.string(), cantidad: z.number(), valor: z.number() });
export type EtapaTotal = z.infer<typeof EtapaTotalSchema>;

/** `<av-crm>` (shell): id de la ruta y versión para forzar recarga. */
export const AvCrmPropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0) });
export type AvCrmProps = z.infer<typeof AvCrmPropsSchema>;

/** `<av-embudo>`: totales por etapa y la etapa filtrada. */
export const AvEmbudoPropsSchema = z.object({ etapas: z.array(EtapaTotalSchema).default([]), activa: z.string().nullable().default(null) });
export type AvEmbudoProps = z.infer<typeof AvEmbudoPropsSchema>;

/** `<av-clientes-grid>`: filas y estado. */
export const AvClientesGridPropsSchema = z.object({ clientes: z.array(ClienteSchema).default([]), cargando: z.boolean().default(false) });
export type AvClientesGridProps = z.infer<typeof AvClientesGridPropsSchema>;

/** `<av-cliente-form>`: diálogo crear/editar. */
export const AvClienteFormPropsSchema = z.object({ abierto: z.boolean().default(false), cliente: ClienteSchema.nullable().default(null), miembros: z.array(MiembroCrmSchema).default([]), puedeEscribir: z.boolean().default(false), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvClienteFormProps = z.infer<typeof AvClienteFormPropsSchema>;

/** Props de la vista, por tag. */
export const CRM_PROPS = {
  'av-crm': AvCrmPropsSchema,
  'av-embudo': AvEmbudoPropsSchema,
  'av-clientes-grid': AvClientesGridPropsSchema,
  'av-cliente-form': AvClienteFormPropsSchema,
} as const;
