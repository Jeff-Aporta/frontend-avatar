// inventario.test.ts — dominio de la vista `inventario` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-INV-01  indicadores
//   W-INV-03  nivel de stock y filas de productos (acciones Entrada / Salida)
//   W-INV-04  stock resultante y validación de movimiento
//   W-INV-05  filas del kardex
//   W-INV-06  productos relacionados
//   W-INV-07  total y validación de pedido
//   W-INV-08  validación de proveedor y productos que surte
//   W-INV-09  búsqueda por texto
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const v = await import('../../dist/cdn/view/inventario/utils/inventario.js');
const { filtrarTexto } = await import('../../dist/cdn/js/core/datos.js');
const { MovimientoDatosSchema, PedidoDatosSchema, ProveedorDatosSchema } = await import('../../dist/cdn/js/consts/schemas/inventario.schemas.js');

const PROV = [{ iproveedor: 1, iempresa: 1, nombre: 'TecnoSuministros' }, { iproveedor: 2, iempresa: 1, nombre: 'ElectroParts' }];
const P = [
  { iproducto: 1, sku: 'PROD-00001', iempresa: 1, nombre: 'Procesador i9', categoria: 'Electrónicos', marca: 'Intel', precio: 499.99, costo: 380, stock: 3, stock_minimo: 5, ubicacion: 'A1-B2', iproveedor: 1, bactivo: true },
  { iproducto: 2, sku: 'PROD-00002', iempresa: 1, nombre: 'Memoria RAM', categoria: 'Electrónicos', marca: 'Corsair', precio: 79.99, costo: 52, stock: 25, stock_minimo: 10, ubicacion: 'A2-C1', iproveedor: 2, bactivo: true },
  { iproducto: 3, sku: 'PROD-00003', iempresa: 1, nombre: 'SSD 1TB', categoria: 'Almacenamiento', marca: 'Samsung', precio: 120, costo: 90, stock: 0, stock_minimo: 2, ubicacion: null, iproveedor: 1, bactivo: true },
  { iproducto: 4, sku: 'PROD-00004', iempresa: 1, nombre: 'Viejo', categoria: 'Electrónicos', marca: null, precio: 1, costo: 1, stock: 1, stock_minimo: 0, ubicacion: null, iproveedor: null, bactivo: false },
];

export default definirPruebas([
  {
    nombre: 'inventario W-INV-03 nivel de stock y filas de productos',
    categoria: 'what',
    correr({ eq }) {
      eq('niveles', P.map((p) => v.nivelStock(p)), ['bajo', 'ok', 'agotado', 'ok']);
      eq('en el mínimo = bajo', v.nivelStock({ stock: 5, stock_minimo: 5 }), 'bajo');
      const filas = v.filasProductos(P, PROV);
      eq('proveedor por nombre', filas.map((f: { proveedor: string }) => f.proveedor), ['TecnoSuministros', 'ElectroParts', 'TecnoSuministros', '']);
      eq('nivel con mínimo', filas[0].nivel, 'Stock bajo · mín 5');
      const acciones = (v.columnasInventario('productos').find((c: { field: string }) => c.field === 'acciones') as unknown as { acciones: { accion: string; mostrar?: (x: unknown) => boolean }[] }).acciones;
      const aplican = (f: Record<string, unknown>) => acciones.filter((a) => !a.mostrar || a.mostrar(f)).map((a) => a.accion);
      eq('con stock: entrada y salida', aplican(filas[0]), ['entrada', 'salida']);
      eq('agotado: solo entrada', aplican(filas[2]), ['entrada']);
    },
  },
  {
    nombre: 'inventario W-INV-01 indicadores',
    categoria: 'what',
    correr({ eq, expect }) {
      const k = v.indicadoresInventario({ iempresa: 1, productos: 8, valor_inventario: 10063, stock_critico: 4, agotados: 1, pedidos_pendientes: 3, despachos_hoy: 1 });
      eq('ids', k.map((x: { id: string }) => x.id), ['productos', 'valor', 'critico', 'pedidos']);
      eq('crítico con agotados', k[2]!.helper, '1 agotado');
      eq('despachos', k[3]!.helper, '1 despacho hoy');
      expect('valor con $', k[1]!.value.startsWith('$ ') && k[1]!.value.includes('10.063,00'), k[1]!.value);
    },
  },
  {
    nombre: 'inventario W-INV-04 stock resultante y validación de movimiento',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('entrada suma', v.stockResultante(3, 'entrada', 5), 8);
      eq('salida resta', v.stockResultante(3, 'salida', 3), 0);
      eq('salida sin stock', v.stockResultante(3, 'salida', 4), null);
      eq('ajuste fija', v.stockResultante(3, 'ajuste', 10), 10);
      expect('entrada válida', MovimientoDatosSchema.safeParse({ iproducto: 1, tipo: 'entrada', cantidad: 2 }).success);
      expect('entrada en 0 no', !MovimientoDatosSchema.safeParse({ iproducto: 1, tipo: 'entrada', cantidad: 0 }).success);
      expect('ajuste en 0 sí', MovimientoDatosSchema.safeParse({ iproducto: 1, tipo: 'ajuste', cantidad: 0 }).success);
      expect('decimal no', !MovimientoDatosSchema.safeParse({ iproducto: 1, tipo: 'salida', cantidad: 1.5 }).success);
    },
  },
  {
    nombre: 'inventario W-INV-05 filas del kardex',
    categoria: 'what',
    correr({ eq }) {
      const m = v.filasMovimientos([
        { imovimiento: 1, iempresa: 1, iproducto: 2, tipo: 'entrada', cantidad: 20, stock_anterior: 5, stock_resultante: 25, motivo: 'Pedido', iusuario: 'elena' },
        { imovimiento: 2, iempresa: 1, iproducto: 1, tipo: 'salida', cantidad: 1, stock_anterior: 4, stock_resultante: 3, motivo: null, iusuario: null },
        { imovimiento: 3, iempresa: 1, iproducto: 9, tipo: 'ajuste', cantidad: 7, stock_anterior: null, stock_resultante: null },
      ], P);
      eq('cantidad con signo', m.map((x: { cantidadTexto: string }) => x.cantidadTexto), ['+20', '−1', '= 7']);
      eq('traza', m.map((x: { traza: string }) => x.traza), ['5 → 25', '4 → 3', '']);
      eq('producto por nombre o id', m.map((x: { producto: string }) => x.producto), ['Memoria RAM', 'Procesador i9', '#9']);
    },
  },
  {
    nombre: 'inventario W-INV-06 productos relacionados',
    categoria: 'what',
    correr({ eq }) {
      eq('misma categoría o proveedor, activos y sin el propio', v.relacionadosDe(P[0], P).map((p: { iproducto: number }) => p.iproducto), [2, 3]);
      eq('por proveedor', v.relacionadosDe(P[2], P).map((p: { iproducto: number }) => p.iproducto), [1]);
    },
  },
  {
    nombre: 'inventario W-INV-07 total y validación de pedido',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('total', v.totalPedido([{ cantidad: 2, precio: 10.555 }, { cantidad: 1, precio: null }]), 21.11);
      const ok = { tipo: 'proveedor', iproveedor: 1, estado: 'pendiente', fpedido: '2026-10-30', items: [{ iproducto: 1, cantidad: 2, precio: 380 }] };
      expect('válido', PedidoDatosSchema.safeParse(ok).success);
      expect('sin ítems', !PedidoDatosSchema.safeParse({ ...ok, items: [] }).success);
      expect('cantidad decimal', !PedidoDatosSchema.safeParse({ ...ok, items: [{ iproducto: 1, cantidad: 1.5, precio: 1 }] }).success);
      expect('estado fuera de lista', !PedidoDatosSchema.safeParse({ ...ok, estado: 'perdido' }).success);
      const filas = v.filasPedidos([{ ipedido: 1, codigo: 'PED-1', iempresa: 1, tipo: 'cliente', icliente: 7, estado: 'enviado', total: 10, fpedido: '2026-10-01' }], PROV, [{ icliente: 7, nombre: 'Juan', organizacion: 'Tech Titans' }]);
      eq('contraparte cliente', filas[0].contraparte, 'Tech Titans');
      eq('estado legible', filas[0].estado, 'Enviado');
    },
  },
  {
    nombre: 'inventario W-INV-08 proveedores',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('productos que surte', v.filasProveedores(PROV, P).map((x: { productos: number }) => x.productos), [2, 1]);
      expect('válido', ProveedorDatosSchema.safeParse({ nombre: 'X', email: 'ventas@x.test' }).success);
      expect('correo inválido', !ProveedorDatosSchema.safeParse({ nombre: 'X', email: 'no-es-correo' }).success);
      expect('sin nombre', !ProveedorDatosSchema.safeParse({ nombre: '  ' }).success);
    },
  },
  {
    nombre: 'inventario W-INV-09 búsqueda por texto',
    categoria: 'what',
    correr({ eq }) {
      const buscar = (t: string) => filtrarTexto(P, t, (p: typeof P[0]) => v.camposProducto(p, PROV)).map((p: { iproducto: number }) => p.iproducto);
      eq('por marca', buscar('corsair'), [2]);
      eq('por proveedor', buscar('tecno'), [1, 3]);
      eq('por nivel', buscar('agotado'), [3]);
      eq('por categoría con tilde', buscar('electronicos intel'), [1]);
    },
  },
]);
