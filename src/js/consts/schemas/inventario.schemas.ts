/**
 * inventario.schemas.ts — inventario (`view/inventario/`): proveedores, productos, movimientos (kardex), pedidos y sus
 * ítems, las alertas de stock (`productos/alertas`) y el resumen (`productos/resumen`), más los datos de los
 * formularios y las props de los componentes de la vista. Lo externo se parsea con `safeParse`.
 */
import { z } from '../../base/zod.js';

/** Tipos de movimiento (`ajuste` fija el stock al conteo físico). */
export const TIPOS_MOVIMIENTO = ['entrada', 'salida', 'ajuste'] as const;
/** Tipos y estados de pedido. */
export const TIPOS_PEDIDO = ['proveedor', 'cliente'] as const;
export const ESTADOS_PEDIDO = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'] as const;

const fecha = z.union([z.string(), z.date()]).nullable().optional();

/** Proveedor. */
export const ProveedorSchema = z.object({ iproveedor: z.number(), iempresa: z.number(), nombre: z.string(), contacto: z.string().nullable().optional(), email: z.string().nullable().optional(), telefono: z.string().nullable().optional(), creado: fecha });
export type Proveedor = z.infer<typeof ProveedorSchema>;

/** Producto. */
export const ProductoSchema = z.object({
  iproducto: z.number(),
  sku: z.string().nullable().optional(),
  iempresa: z.number(),
  nombre: z.string(),
  categoria: z.string().nullable().optional(),
  marca: z.string().nullable().optional(),
  modelo: z.string().nullable().optional(),
  precio: z.coerce.number().nullable().optional(),
  costo: z.coerce.number().nullable().optional(),
  stock: z.coerce.number(),
  stock_minimo: z.coerce.number(),
  ubicacion: z.string().nullable().optional(),
  iproveedor: z.number().nullable().optional(),
  bactivo: z.boolean().nullable().optional(),
  creado: fecha,
});
export type Producto = z.infer<typeof ProductoSchema>;

/** Movimiento del kardex. */
export const MovimientoSchema = z.object({ imovimiento: z.number(), iempresa: z.number(), iproducto: z.number(), tipo: z.string(), cantidad: z.coerce.number(), stock_anterior: z.coerce.number().nullable().optional(), stock_resultante: z.coerce.number().nullable().optional(), motivo: z.string().nullable().optional(), iusuario: z.string().nullable().optional(), creado: fecha });
export type Movimiento = z.infer<typeof MovimientoSchema>;

/** Pedido (a proveedor o de cliente). */
export const PedidoSchema = z.object({ ipedido: z.number(), codigo: z.string().nullable().optional(), iempresa: z.number(), tipo: z.string(), iproveedor: z.number().nullable().optional(), icliente: z.number().nullable().optional(), estado: z.string(), total: z.coerce.number().nullable().optional(), fpedido: fecha, fenvio: fecha, fentrega: fecha, notas: z.string().nullable().optional(), creado: fecha });
export type Pedido = z.infer<typeof PedidoSchema>;

/** Ítem de pedido. */
export const ItemPedidoSchema = z.object({ ipedido: z.number(), iproducto: z.number(), cantidad: z.coerce.number(), precio: z.coerce.number().nullable().optional() });
export type ItemPedido = z.infer<typeof ItemPedidoSchema>;

/** Cliente (para pedidos de cliente). */
export const ClientePedidoSchema = z.object({ icliente: z.number(), nombre: z.string(), organizacion: z.string().nullable().optional() });
export type ClientePedido = z.infer<typeof ClientePedidoSchema>;

/** `GET productos/alertas`. */
export const AlertaStockSchema = z.object({ iproducto: z.number(), sku: z.string(), nombre: z.string(), stock: z.number(), stock_minimo: z.number(), ubicacion: z.string().nullable(), agotado: z.boolean() });
export type AlertaStock = z.infer<typeof AlertaStockSchema>;

/** `GET productos/resumen`. */
export const ResumenInventarioSchema = z.object({ iempresa: z.number(), productos: z.number(), valor_inventario: z.number(), stock_critico: z.number(), agotados: z.number(), pedidos_pendientes: z.number(), despachos_hoy: z.number() });
export type ResumenInventario = z.infer<typeof ResumenInventarioSchema>;

/** Datos del formulario de producto (el stock no: cambia por movimientos). */
export const ProductoDatosSchema = z.object({
  iproducto: z.number().nullable().default(null),
  nombre: z.string().trim().min(1).max(160),
  categoria: z.string().max(80).nullable().default(null),
  marca: z.string().max(80).nullable().default(null),
  modelo: z.string().max(80).nullable().default(null),
  precio: z.number().min(0),
  costo: z.number().min(0),
  stock_minimo: z.number().int().min(0),
  ubicacion: z.string().max(40).nullable().default(null),
  iproveedor: z.number().nullable().default(null),
  bactivo: z.boolean().default(true),
});
export type ProductoDatos = z.infer<typeof ProductoDatosSchema>;

/** Datos del formulario de movimiento (lo que va a `producto/{id}/movimiento`). */
export const MovimientoDatosSchema = z.object({ iproducto: z.number(), tipo: z.enum(TIPOS_MOVIMIENTO), cantidad: z.number().int().min(0), motivo: z.string().max(300).nullable().default(null) }).refine((v) => v.tipo === 'ajuste' || v.cantidad > 0, 'La cantidad debe ser mayor que 0');
export type MovimientoDatos = z.infer<typeof MovimientoDatosSchema>;

/** Datos del formulario de pedido (con sus ítems). */
export const PedidoDatosSchema = z.object({
  ipedido: z.number().nullable().default(null),
  tipo: z.enum(TIPOS_PEDIDO),
  iproveedor: z.number().nullable().default(null),
  icliente: z.number().nullable().default(null),
  estado: z.enum(ESTADOS_PEDIDO),
  fpedido: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fenvio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  fentrega: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  notas: z.string().nullable().default(null),
  items: z.array(z.object({ iproducto: z.number(), cantidad: z.number().int().positive(), precio: z.number().min(0) })).min(1),
});
export type PedidoDatos = z.infer<typeof PedidoDatosSchema>;

/** Datos del formulario de proveedor. */
export const ProveedorDatosSchema = z.object({ iproveedor: z.number().nullable().default(null), nombre: z.string().trim().min(1).max(160), contacto: z.string().max(120).nullable().default(null), email: z.string().email().max(160).nullable().default(null), telefono: z.string().max(40).nullable().default(null) });
export type ProveedorDatos = z.infer<typeof ProveedorDatosSchema>;

const FilaSchema = z.record(z.string(), z.unknown());

/** `<av-inventario>` (shell). */
export const AvInventarioPropsSchema = z.object({ id: z.string().nullable().default(null), version: z.number().default(0) });
export type AvInventarioProps = z.infer<typeof AvInventarioPropsSchema>;

/** `<av-stock-alertas>`: productos en o bajo el mínimo. */
export const AvStockAlertasPropsSchema = z.object({ alertas: z.array(AlertaStockSchema).nullable().default(null), puedeMover: z.boolean().default(false) });
export type AvStockAlertasProps = z.infer<typeof AvStockAlertasPropsSchema>;

/** `<av-inventario-tabla>`: tabla de productos, movimientos, pedidos o proveedores. */
export const AvInventarioTablaPropsSchema = z.object({
  entidad: z.enum(['productos', 'movimientos', 'pedidos', 'proveedores']).default('productos'),
  filas: z.array(FilaSchema).default([]),
  cargando: z.boolean().default(false),
  texto: z.string().default(''),
  puedeEscribir: z.boolean().default(false),
});
export type AvInventarioTablaProps = z.infer<typeof AvInventarioTablaPropsSchema>;

/** `<av-producto-form>`: diálogo de producto con relacionados (se ocultan si no hay). */
export const AvProductoFormPropsSchema = z.object({ abierto: z.boolean().default(false), producto: ProductoSchema.nullable().default(null), proveedores: z.array(ProveedorSchema).default([]), relacionados: z.array(ProductoSchema).default([]), puedeEscribir: z.boolean().default(false), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvProductoFormProps = z.infer<typeof AvProductoFormPropsSchema>;

/** `<av-movimiento-form>`: diálogo de entrada / salida / ajuste. */
export const AvMovimientoFormPropsSchema = z.object({ abierto: z.boolean().default(false), productos: z.array(ProductoSchema).default([]), iproducto: z.number().nullable().default(null), tipo: z.enum(TIPOS_MOVIMIENTO).default('entrada'), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvMovimientoFormProps = z.infer<typeof AvMovimientoFormPropsSchema>;

/** `<av-pedido-form>`: diálogo de pedido con ítems. */
export const AvPedidoFormPropsSchema = z.object({ abierto: z.boolean().default(false), pedido: PedidoSchema.nullable().default(null), items: z.array(ItemPedidoSchema).default([]), productos: z.array(ProductoSchema).default([]), proveedores: z.array(ProveedorSchema).default([]), clientes: z.array(ClientePedidoSchema).default([]), puedeEscribir: z.boolean().default(false), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvPedidoFormProps = z.infer<typeof AvPedidoFormPropsSchema>;

/** `<av-proveedor-form>`: diálogo de proveedor. */
export const AvProveedorFormPropsSchema = z.object({ abierto: z.boolean().default(false), proveedor: ProveedorSchema.nullable().default(null), productos: z.number().default(0), puedeEscribir: z.boolean().default(false), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvProveedorFormProps = z.infer<typeof AvProveedorFormPropsSchema>;

/** Props de la vista, por tag. */
export const INVENTARIO_PROPS = {
  'av-inventario': AvInventarioPropsSchema,
  'av-stock-alertas': AvStockAlertasPropsSchema,
  'av-inventario-tabla': AvInventarioTablaPropsSchema,
  'av-producto-form': AvProductoFormPropsSchema,
  'av-movimiento-form': AvMovimientoFormPropsSchema,
  'av-pedido-form': AvPedidoFormPropsSchema,
  'av-proveedor-form': AvProveedorFormPropsSchema,
} as const;
