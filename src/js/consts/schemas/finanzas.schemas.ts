/**
 * finanzas.schemas.ts — finanzas y contabilidad (`view/finanzas/`): transacciones, facturas, tasas de cambio, el
 * resumen del mes (`transacciones/resumen`) y la conversión (`tasas/convertir`), más los datos de los formularios y
 * las props de los componentes de la vista. Lo externo se parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';

/** Monedas soportadas. */
export const MONEDAS = ['COP', 'USD', 'MXN', 'EUR'] as const;
/** Tipos y estados de transacción. */
export const TIPOS_TRANSACCION = ['ingreso', 'gasto'] as const;
export const ESTADOS_TRANSACCION = ['completada', 'pendiente', 'anulada'] as const;
/** Estados de factura. */
export const ESTADOS_FACTURA = ['borrador', 'emitida', 'pagada', 'vencida', 'anulada'] as const;

const fecha = z.union([z.string(), z.date()]).nullable().optional();

/** Transacción (fila de `transacciones`). */
export const TransaccionSchema = z.object({
  itransaccion: z.number(),
  iempresa: z.number(),
  tipo: z.string(),
  categoria: z.string(),
  descripcion: z.string().nullable().optional(),
  monto: z.coerce.number(),
  moneda: z.string(),
  fecha: z.union([z.string(), z.date()]),
  estado: z.string(),
  icliente: z.number().nullable().optional(),
  ifactura: z.number().nullable().optional(),
  creado_por: z.string().nullable().optional(),
  creado: fecha,
});
export type Transaccion = z.infer<typeof TransaccionSchema>;

/** Ítem de factura. */
export const ItemFacturaSchema = z.object({ descripcion: z.string(), cantidad: z.coerce.number(), precio: z.coerce.number() });
export type ItemFactura = z.infer<typeof ItemFacturaSchema>;

/** Factura (fila de `facturas`). */
export const FacturaSchema = z.object({
  ifactura: z.number(),
  numero: z.string().nullable().optional(),
  iempresa: z.number(),
  icliente: z.number().nullable().optional(),
  items: z.array(ItemFacturaSchema).nullable().optional(),
  subtotal: z.coerce.number().nullable().optional(),
  impuesto: z.coerce.number().nullable().optional(),
  total: z.coerce.number().nullable().optional(),
  moneda: z.string(),
  estado: z.string(),
  femision: fecha,
  fvence: fecha,
  fpago: fecha,
  notas: z.string().nullable().optional(),
  creado: fecha,
});
export type Factura = z.infer<typeof FacturaSchema>;

/** Tasa de cambio: cuántos COP vale una unidad de `moneda`. */
export const TasaSchema = z.object({ iempresa: z.number(), moneda: z.string(), a_cop: z.coerce.number(), actualizado: fecha });
export type Tasa = z.infer<typeof TasaSchema>;

/** Cliente (para facturas): solo lo que se muestra. */
export const ClienteRefSchema = z.object({ icliente: z.number(), nombre: z.string(), organizacion: z.string().nullable().optional() });
export type ClienteRef = z.infer<typeof ClienteRefSchema>;

/** Una cifra del mes con la del anterior. */
export const ComparativoSchema = z.object({ actual: z.number(), anterior: z.number(), variacion: z.number().nullable() });
export type Comparativo = z.infer<typeof ComparativoSchema>;

/** `GET transacciones/resumen`. */
export const ResumenFinanzasSchema = z.object({
  iempresa: z.number(),
  mes: z.string(),
  moneda: z.string(),
  ingresos: ComparativoSchema,
  gastos: ComparativoSchema,
  beneficio: ComparativoSchema,
  facturas_pendientes: z.object({ cantidad: z.number(), monto: ComparativoSchema }),
  por_categoria: z.record(z.string(), z.number()),
});
export type ResumenFinanzas = z.infer<typeof ResumenFinanzasSchema>;

/** `GET tasas/convertir`. */
export const ConversionSchema = z.object({ monto: z.number(), de: z.string(), a: z.string(), tasa: z.number(), resultado: z.number() });
export type Conversion = z.infer<typeof ConversionSchema>;

/** Datos del formulario de transacción. */
export const TransaccionDatosSchema = z.object({
  itransaccion: z.number().nullable().default(null),
  tipo: z.enum(TIPOS_TRANSACCION),
  categoria: z.string().trim().min(1).max(80),
  descripcion: z.string().max(200).nullable().default(null),
  monto: z.number().positive(),
  moneda: z.enum(MONEDAS),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  estado: z.enum(ESTADOS_TRANSACCION),
});
export type TransaccionDatos = z.infer<typeof TransaccionDatosSchema>;

/** Datos del formulario de factura (borrador). */
export const FacturaDatosSchema = z.object({
  ifactura: z.number().nullable().default(null),
  icliente: z.number().nullable().default(null),
  moneda: z.enum(MONEDAS),
  impuesto: z.number().min(0).max(100),
  items: z.array(z.object({ descripcion: z.string().trim().min(1).max(200), cantidad: z.number().positive(), precio: z.number().min(0) })).min(1),
  notas: z.string().nullable().default(null),
});
export type FacturaDatos = z.infer<typeof FacturaDatosSchema>;

/** Fila plana de una tabla de la vista. */
const FilaSchema = z.record(z.string(), z.unknown());

/** `<av-finanzas>` (shell): pestaña de la ruta y versión. */
export const AvFinanzasPropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0) });
export type AvFinanzasProps = z.infer<typeof AvFinanzasPropsSchema>;

/** `<av-finanzas-grafica>`: resumen del mes (null = cargando). */
export const AvFinanzasGraficaPropsSchema = z.object({ resumen: ResumenFinanzasSchema.nullable().default(null) });
export type AvFinanzasGraficaProps = z.infer<typeof AvFinanzasGraficaPropsSchema>;

/** `<av-conversor>`: tasas, entrada y resultado. */
export const AvConversorPropsSchema = z.object({
  tasas: z.array(TasaSchema).default([]),
  monto: z.number().default(1000),
  de: z.string().default('USD'),
  a: z.string().default('COP'),
  resultado: ConversionSchema.nullable().default(null),
  ocupado: z.boolean().default(false),
  error: z.string().default(''),
});
export type AvConversorProps = z.infer<typeof AvConversorPropsSchema>;

/** `<av-finanzas-tabla>`: tabla de `transacciones` o `facturas`. */
export const AvFinanzasTablaPropsSchema = z.object({
  entidad: z.enum(['transacciones', 'facturas']).default('transacciones'),
  filas: z.array(FilaSchema).default([]),
  cargando: z.boolean().default(false),
  texto: z.string().default(''),
  puedeEscribir: z.boolean().default(false),
});
export type AvFinanzasTablaProps = z.infer<typeof AvFinanzasTablaPropsSchema>;

/** `<av-transaccion-form>`: diálogo crear/editar/eliminar. */
export const AvTransaccionFormPropsSchema = z.object({ abierto: z.boolean().default(false), transaccion: TransaccionSchema.nullable().default(null), categorias: z.array(z.string()).default([]), puedeEscribir: z.boolean().default(false), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvTransaccionFormProps = z.infer<typeof AvTransaccionFormPropsSchema>;

/** `<av-factura-form>`: diálogo de factura (editable solo en borrador). */
export const AvFacturaFormPropsSchema = z.object({ abierto: z.boolean().default(false), factura: FacturaSchema.nullable().default(null), clientes: z.array(ClienteRefSchema).default([]), puedeEscribir: z.boolean().default(false), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvFacturaFormProps = z.infer<typeof AvFacturaFormPropsSchema>;

/** Props de la vista, por tag. */
export const FINANZAS_PROPS = {
  'av-finanzas': AvFinanzasPropsSchema,
  'av-finanzas-grafica': AvFinanzasGraficaPropsSchema,
  'av-conversor': AvConversorPropsSchema,
  'av-finanzas-tabla': AvFinanzasTablaPropsSchema,
  'av-transaccion-form': AvTransaccionFormPropsSchema,
  'av-factura-form': AvFacturaFormPropsSchema,
} as const;
