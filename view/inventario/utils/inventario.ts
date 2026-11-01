/**
 * inventario.ts — dominio de la vista `inventario` (sin DOM): indicadores, nivel de stock, columnas y filas de las
 * cuatro tablas (productos, movimientos, pedidos, proveedores), campos de búsqueda, stock resultante de un movimiento,
 * total de un pedido y productos relacionados por defecto. Los componentes solo pintan lo que esto devuelve.
 */
import type { ColumnaTabla, ConfigTabla, EstadoVacio, FilaTabla, Indicador } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { ClientePedido, Movimiento, Pedido, Producto, Proveedor, ResumenInventario } from '../../../src/js/consts/schemas/inventario.schemas.js';
import { celdaTag, fechaISO, formatoNumero, normalizar } from '../../../src/js/core/datos.js';

/** Precio sin moneda (el API no guarda moneda en productos ni pedidos): `$ 1.234,50`. */
export const formatoPrecio = (n: number): string => `$ ${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;

/** Etiquetas legibles. */
export const ETIQUETA: Record<string, string> = {
  entrada: 'Entrada', salida: 'Salida', ajuste: 'Ajuste',
  proveedor: 'A proveedor', cliente: 'De cliente',
  pendiente: 'Pendiente', procesando: 'Procesando', enviado: 'Enviado', entregado: 'Entregado', cancelado: 'Cancelado',
  agotado: 'Agotado', bajo: 'Stock bajo', ok: 'Disponible',
};

/** Color del kit por nivel, tipo o estado. */
export function colorDe(clave: string): 'neutral' | 'brand' | 'success' | 'warning' | 'danger' {
  if (clave === 'agotado' || clave === 'salida' || clave === 'cancelado') return 'danger';
  if (clave === 'bajo' || clave === 'pendiente' || clave === 'ajuste') return 'warning';
  if (clave === 'ok' || clave === 'entrada' || clave === 'entregado') return 'success';
  if (clave === 'procesando' || clave === 'enviado') return 'brand';
  return 'neutral';
}

/** Nivel de stock: agotado (≤ 0), bajo (≤ mínimo) u ok. */
export function nivelStock(p: Pick<Producto, 'stock' | 'stock_minimo'>): 'agotado' | 'bajo' | 'ok' {
  if (p.stock <= 0) return 'agotado';
  if (p.stock <= p.stock_minimo) return 'bajo';
  return 'ok';
}

/** KPIs del inventario. */
export function indicadoresInventario(r: ResumenInventario): Indicador[] {
  return [
    { id: 'productos', label: 'Productos activos', value: formatoNumero(r.productos), helper: 'en el catálogo', icon: 'mdi:package-variant-closed', color: 'brand', trend: '', trendDirection: '' },
    { id: 'valor', label: 'Valor del inventario', value: formatoPrecio(r.valor_inventario), helper: 'stock × costo', icon: 'mdi:cash-multiple', color: 'success', trend: '', trendDirection: '' },
    { id: 'critico', label: 'Stock crítico', value: formatoNumero(r.stock_critico), helper: r.agotados ? `${r.agotados} agotado${r.agotados === 1 ? '' : 's'}` : 'ninguno agotado', icon: 'mdi:alert-octagon-outline', color: r.stock_critico ? 'danger' : 'success', trend: '', trendDirection: '' },
    { id: 'pedidos', label: 'Pedidos pendientes', value: formatoNumero(r.pedidos_pendientes), helper: `${r.despachos_hoy} despacho${r.despachos_hoy === 1 ? '' : 's'} hoy`, icon: 'mdi:truck-fast-outline', color: r.pedidos_pendientes ? 'warning' : 'neutral', trend: '', trendDirection: '' },
  ];
}

const nombreDe = <T extends { nombre: string }>(lista: T[], id: unknown, clave: keyof T): string => lista.find((x) => x[clave] === id)?.nombre ?? '';

/** Columnas de productos (con acciones de entrada / salida). */
function columnasProductos(): ColumnaTabla[] {
  return [
    { field: 'sku', headerName: 'SKU', width: 120 },
    { field: 'nombre', headerName: 'Producto', flex: 1.5, minWidth: 190 },
    { field: 'categoria', headerName: 'Categoría', flex: 0.8, minWidth: 120 },
    { field: 'marca', headerName: 'Marca', flex: 0.7, minWidth: 100 },
    { field: 'precioTexto', headerName: 'Precio', width: 120 },
    { field: 'stock', headerName: 'Stock', type: 'number', width: 90 },
    { field: 'nivel', headerName: 'Nivel', width: 175, renderCell: ({ row }) => celdaTag(String(row['nivel']), colorDe(String(row['nivelClave']))) },
    { field: 'ubicacion', headerName: 'Ubicación', width: 110 },
    { field: 'proveedor', headerName: 'Proveedor', flex: 0.9, minWidth: 130 },
    {
      field: 'acciones',
      headerName: 'Mover',
      width: 100,
      acciones: [
        { accion: 'entrada', label: 'Registrar entrada', icono: 'mdi:tray-arrow-down' },
        { accion: 'salida', label: 'Registrar salida', icono: 'mdi:tray-arrow-up', mostrar: (f) => Number(f['stock']) > 0 },
      ],
    },
  ];
}

function columnasMovimientos(): ColumnaTabla[] {
  return [
    { field: 'fecha', headerName: 'Fecha', width: 150 },
    { field: 'producto', headerName: 'Producto', flex: 1.4, minWidth: 180 },
    { field: 'tipo', headerName: 'Tipo', width: 110, renderCell: ({ row }) => celdaTag(String(row['tipo']), colorDe(String(row['tipoClave'])), 'outlined') },
    { field: 'cantidadTexto', headerName: 'Cantidad', width: 100 },
    { field: 'traza', headerName: 'Stock', width: 110 },
    { field: 'motivo', headerName: 'Motivo', flex: 1.2, minWidth: 160 },
    { field: 'iusuario', headerName: 'Por', width: 100 },
  ];
}

function columnasPedidos(): ColumnaTabla[] {
  return [
    { field: 'codigo', headerName: 'Código', width: 130 },
    { field: 'tipo', headerName: 'Tipo', width: 120 },
    { field: 'contraparte', headerName: 'Proveedor / cliente', flex: 1.3, minWidth: 180 },
    { field: 'estado', headerName: 'Estado', width: 125, renderCell: ({ row }) => celdaTag(String(row['estado']), colorDe(String(row['estadoClave']))) },
    { field: 'totalTexto', headerName: 'Total', width: 130 },
    { field: 'fpedido', headerName: 'Pedido', width: 110 },
    { field: 'fenvio', headerName: 'Envío', width: 110 },
    { field: 'fentrega', headerName: 'Entrega', width: 110 },
  ];
}

function columnasProveedores(): ColumnaTabla[] {
  return [
    { field: 'nombre', headerName: 'Proveedor', flex: 1.2, minWidth: 170 },
    { field: 'contacto', headerName: 'Contacto', flex: 1, minWidth: 140 },
    { field: 'email', headerName: 'Correo', flex: 1.2, minWidth: 180 },
    { field: 'telefono', headerName: 'Teléfono', flex: 0.9, minWidth: 140 },
    { field: 'productos', headerName: 'Productos', type: 'number', width: 110 },
  ];
}

/** Columnas por entidad de la vista. */
export function columnasInventario(entidad: string): ColumnaTabla[] {
  if (entidad === 'movimientos') return columnasMovimientos();
  if (entidad === 'pedidos') return columnasPedidos();
  if (entidad === 'proveedores') return columnasProveedores();
  return columnasProductos();
}

/** Filas planas de productos. */
export function filasProductos(ps: Producto[], proveedores: Proveedor[]): FilaTabla[] {
  return ps.map((p) => {
    const nivel = nivelStock(p);
    return {
      id: p.iproducto, iproducto: p.iproducto, sku: p.sku ?? '', nombre: p.nombre, categoria: p.categoria ?? '', marca: p.marca ?? '',
      precio: Number(p.precio ?? 0), precioTexto: formatoPrecio(Number(p.precio ?? 0)),
      stock: p.stock, stock_minimo: p.stock_minimo, nivel: `${ETIQUETA[nivel]} · mín ${p.stock_minimo}`, nivelClave: nivel,
      ubicacion: p.ubicacion ?? '', proveedor: nombreDe(proveedores, p.iproveedor, 'iproveedor'),
    };
  });
}

/** Fecha y hora corta de un `creado`. */
function fechaHora(v: unknown): string {
  if (!v) return '';
  const d = new Date(String(v instanceof Date ? v.toISOString() : v));
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
}

/** Filas planas del kardex. */
export function filasMovimientos(ms: Movimiento[], productos: Producto[]): FilaTabla[] {
  return ms.map((m) => ({
    id: m.imovimiento, imovimiento: m.imovimiento, fecha: fechaHora(m.creado), producto: nombreDe(productos, m.iproducto, 'iproducto') || `#${m.iproducto}`,
    tipo: ETIQUETA[m.tipo] ?? m.tipo, tipoClave: m.tipo,
    cantidadTexto: m.tipo === 'ajuste' ? `= ${m.cantidad}` : `${m.tipo === 'salida' ? '−' : '+'}${m.cantidad}`,
    traza: m.stock_anterior != null && m.stock_resultante != null ? `${m.stock_anterior} → ${m.stock_resultante}` : '',
    motivo: m.motivo ?? '', iusuario: m.iusuario ?? '',
  }));
}

/** Nombre de cliente para pedidos. */
const nombreCliente = (c: ClientePedido | undefined): string => (c ? c.organizacion || c.nombre : '');

/** Filas planas de pedidos. */
export function filasPedidos(ps: Pedido[], proveedores: Proveedor[], clientes: ClientePedido[]): FilaTabla[] {
  return ps.map((p) => ({
    id: p.ipedido, ipedido: p.ipedido, codigo: p.codigo ?? `#${p.ipedido}`, tipo: ETIQUETA[p.tipo] ?? p.tipo, tipoClave: p.tipo,
    contraparte: p.tipo === 'proveedor' ? nombreDe(proveedores, p.iproveedor, 'iproveedor') : nombreCliente(clientes.find((c) => c.icliente === p.icliente)),
    estado: ETIQUETA[p.estado] ?? p.estado, estadoClave: p.estado,
    total: Number(p.total ?? 0), totalTexto: formatoPrecio(Number(p.total ?? 0)),
    fpedido: fechaISO(p.fpedido), fenvio: fechaISO(p.fenvio), fentrega: fechaISO(p.fentrega),
  }));
}

/** Filas planas de proveedores (con cuántos productos surten). */
export function filasProveedores(ps: Proveedor[], productos: Producto[]): FilaTabla[] {
  return ps.map((p) => ({ id: p.iproveedor, iproveedor: p.iproveedor, nombre: p.nombre, contacto: p.contacto ?? '', email: p.email ?? '', telefono: p.telefono ?? '', productos: productos.filter((x) => x.iproveedor === p.iproveedor).length }));
}

/** Campos de búsqueda por entidad. */
export const camposProducto = (p: Producto, proveedores: Proveedor[]): unknown[] => [p.sku, p.nombre, p.categoria, p.marca, p.modelo, p.ubicacion, nombreDe(proveedores, p.iproveedor, 'iproveedor'), ETIQUETA[nivelStock(p)]];
export const camposMovimiento = (m: Movimiento, productos: Producto[]): unknown[] => [nombreDe(productos, m.iproducto, 'iproducto'), m.tipo, ETIQUETA[m.tipo], m.motivo, m.iusuario];
export const camposPedido = (p: Pedido, proveedores: Proveedor[], clientes: ClientePedido[]): unknown[] => [p.codigo, p.tipo, ETIQUETA[p.tipo], p.estado, ETIQUETA[p.estado], p.notas, nombreDe(proveedores, p.iproveedor, 'iproveedor'), nombreCliente(clientes.find((c) => c.icliente === p.icliente))];
export const camposProveedor = (p: Proveedor): unknown[] => [p.nombre, p.contacto, p.email, p.telefono];

/** Stock que quedaría tras un movimiento (`null` si deja negativo). */
export function stockResultante(stock: number, tipo: string, cantidad: number): number | null {
  const r = tipo === 'entrada' ? stock + cantidad : tipo === 'salida' ? stock - cantidad : cantidad;
  return r < 0 ? null : r;
}

/** Total de un pedido (cantidad × precio, a centavos). */
export const totalPedido = (items: { cantidad: number; precio?: number | null }[]): number => Math.round(items.reduce((s, i) => s + Number(i.cantidad || 0) * Number(i.precio || 0), 0) * 100) / 100;

/** Relacionados por defecto: misma categoría o mismo proveedor (activos, sin el propio). Máx. 4. */
export function relacionadosDe(p: Producto, todos: Producto[]): Producto[] {
  const cat = normalizar(p.categoria);
  return todos
    .filter((x) => x.iproducto !== p.iproducto && x.bactivo !== false && ((cat && normalizar(x.categoria) === cat) || (p.iproveedor != null && x.iproveedor === p.iproveedor)))
    .slice(0, 4);
}

/** Configuración de cada tabla: id, buscador y vacío. */
export const TABLAS_INVENTARIO: Record<string, { idCampo: string; buscador: string; vacio: EstadoVacio }> = {
  productos: { idCampo: 'iproducto', buscador: 'Buscar por SKU, nombre, marca, ubicación…', vacio: { icono: 'mdi:package-variant', titulo: 'Sin productos', texto: 'Agrega productos al catálogo para controlar su stock.' } },
  movimientos: { idCampo: 'imovimiento', buscador: 'Buscar por producto, tipo, motivo…', vacio: { icono: 'mdi:swap-vertical', titulo: 'Sin movimientos', texto: 'Las entradas, salidas y ajustes quedan aquí como kardex.' } },
  pedidos: { idCampo: 'ipedido', buscador: 'Buscar por código, proveedor, cliente, estado…', vacio: { icono: 'mdi:truck-outline', titulo: 'Sin pedidos', texto: 'Registra pedidos a proveedores o de clientes.' } },
  proveedores: { idCampo: 'iproveedor', buscador: 'Buscar proveedor, contacto, correo…', vacio: { icono: 'mdi:factory', titulo: 'Sin proveedores', texto: 'Agrega a quienes te surten productos.' } },
};

/** Configuración de `<av-tabla>` para una entidad de la vista. */
export function tablaInventario(entidad: string): ConfigTabla {
  return { prefijo: 'av-inventario', entidad, columnas: columnasInventario(entidad), ...TABLAS_INVENTARIO[entidad]! };
}
