// finanzas.test.ts — dominio de la vista `finanzas` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-FIN-01  indicadores del mes con tendencia con signo
//   W-FIN-02  series de barras y dona (vacía sin gastos)
//   W-FIN-03  equivalencias de tasas
//   W-FIN-04  filas de transacciones
//   W-FIN-05  validación de transacción
//   W-FIN-06  estado efectivo (vencida) y filas de facturas
//   W-FIN-07  totales y validación de factura
//   W-FIN-08  búsqueda por texto
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const f = await import('../../dist/cdn/view/finanzas/utils/finanzas.js');
const { filtrarTexto, tendencia } = await import('../../dist/cdn/js/core/datos.js');
const { FacturaDatosSchema, TransaccionDatosSchema } = await import('../../dist/cdn/js/consts/schemas/finanzas.schemas.js');

const RESUMEN = {
  iempresa: 1, mes: '2026-10', moneda: 'COP',
  ingresos: { actual: 300, anterior: 200, variacion: 50 },
  gastos: { actual: 100, anterior: 100, variacion: 0 },
  beneficio: { actual: 200, anterior: 100, variacion: 100 },
  facturas_pendientes: { cantidad: 2, monto: { actual: 50, anterior: 0, variacion: null } },
  por_categoria: { Marketing: 30, Nómina: 70, Vacía: 0 },
};
const T = [
  { itransaccion: 1, iempresa: 1, tipo: 'gasto', categoria: 'Marketing', descripcion: 'Campaña redes', monto: 2400000, moneda: 'COP', fecha: '2026-10-12', estado: 'completada' },
  { itransaccion: 2, iempresa: 1, tipo: 'ingreso', categoria: 'Licencias', descripcion: 'Licencias anuales', monto: 3200, moneda: 'USD', fecha: '2026-10-05', estado: 'pendiente' },
];
const F = [
  { ifactura: 1, numero: 'FAC-000001', iempresa: 1, icliente: 7, items: [{ descripcion: 'Soporte', cantidad: 1, precio: 100 }], total: 119, moneda: 'COP', estado: 'emitida', femision: '2026-09-01', fvence: '2026-10-01' },
  { ifactura: 2, numero: 'FAC-000002', iempresa: 1, icliente: null, items: [], total: 0, moneda: 'USD', estado: 'borrador', femision: null, fvence: null },
];
const CLIENTES = [{ icliente: 7, nombre: 'Juan Pérez', organizacion: 'Tech Titans' }];

export default definirPruebas([
  {
    nombre: 'finanzas W-FIN-01 indicadores del mes con tendencia',
    categoria: 'what',
    correr({ eq }) {
      const k = f.indicadoresFinanzas(RESUMEN);
      eq('ids', k.map((x: { id: string }) => x.id), ['ingresos', 'gastos', 'beneficio', 'pendientes']);
      eq('tendencias', k.map((x: { trend: string }) => x.trend), ['+50 %', '0 %', '+100 %', '']);
      eq('direcciones', k.map((x: { trendDirection: string }) => x.trendDirection), ['up', 'flat', 'up', '']);
      eq('pendientes con cantidad', k[3]!.helper, '2 por cobrar');
      eq('tendencia negativa', tendencia(-44.6), '-44,6 %');
      eq('beneficio negativo en rojo', f.indicadoresFinanzas({ ...RESUMEN, beneficio: { actual: -5, anterior: 0, variacion: null } })[2]!.color, 'danger');
    },
  },
  {
    nombre: 'finanzas W-FIN-02 series de las gráficas',
    categoria: 'what',
    correr({ eq }) {
      const b = f.serieComparativa(RESUMEN);
      eq('etiquetas', b.data.labels, ['Ingresos', 'Gastos', 'Beneficio']);
      eq('mes anterior', b.data.datasets[0]!.data, [200, 100, 100]);
      eq('este mes', b.data.datasets[1]!.data, [300, 100, 200]);
      const d = f.serieCategorias(RESUMEN);
      eq('categorías de mayor a menor y sin ceros', d!.data.labels, ['Nómina', 'Marketing']);
      eq('sin gastos = null', f.serieCategorias({ ...RESUMEN, por_categoria: {} }), null);
    },
  },
  {
    nombre: 'finanzas W-FIN-03 equivalencias de tasas',
    categoria: 'what',
    correr({ eq, expect }) {
      const e = f.equivalencias([{ iempresa: 1, moneda: 'USD', a_cop: 4150 }, { iempresa: 1, moneda: 'COP', a_cop: 1 }, { iempresa: 1, moneda: 'EUR', a_cop: 4500 }]);
      eq('sin COP y ordenadas', e.map((x: { moneda: string }) => x.moneda), ['EUR', 'USD']);
      expect('texto', /^1 USD = \$\s?4\.150$/.test(e[1].texto.replace(/ /g, ' ')), e[1].texto);
      eq('monedas con tasa', f.monedasConTasa([{ iempresa: 1, moneda: 'USD', a_cop: 1 }]), ['COP', 'USD']);
    },
  },
  {
    nombre: 'finanzas W-FIN-04 filas de transacciones',
    categoria: 'what',
    correr({ eq, expect }) {
      const filas = f.filasTransacciones(T);
      eq('campos', f.columnasFinanzas('transacciones').map((c: { field: string }) => c.field), ['fecha', 'tipo', 'categoria', 'descripcion', 'montoTexto', 'estado']);
      eq('tipo legible', filas.map((x: { tipo: string }) => x.tipo), ['Gasto', 'Ingreso']);
      eq('estado legible', filas[1].estado, 'Pendiente');
      expect('monto con moneda', String(filas[1].montoTexto).includes('3.200,00'), String(filas[1].montoTexto));
      expect('id = itransaccion', filas.every((x: { id: number; itransaccion: number }) => x.id === x.itransaccion));
    },
  },
  {
    nombre: 'finanzas W-FIN-05 validación de transacción',
    categoria: 'what',
    correr({ expect }) {
      const ok = { tipo: 'gasto', categoria: 'Marketing', monto: 10, moneda: 'COP', fecha: '2026-10-30', estado: 'completada' };
      expect('válida', TransaccionDatosSchema.safeParse(ok).success);
      expect('monto 0', !TransaccionDatosSchema.safeParse({ ...ok, monto: 0 }).success);
      expect('sin categoría', !TransaccionDatosSchema.safeParse({ ...ok, categoria: ' ' }).success);
      expect('fecha mala', !TransaccionDatosSchema.safeParse({ ...ok, fecha: '30/10/2026' }).success);
      expect('moneda fuera de lista', !TransaccionDatosSchema.safeParse({ ...ok, moneda: 'BTC' }).success);
    },
  },
  {
    nombre: 'finanzas W-FIN-06 estado efectivo y filas de facturas',
    categoria: 'what',
    correr({ eq }) {
      eq('emitida vencida', f.estadoFactura({ estado: 'emitida', fvence: '2026-10-01' }, '2026-10-30'), 'vencida');
      eq('emitida al día', f.estadoFactura({ estado: 'emitida', fvence: '2026-11-30' }, '2026-10-30'), 'emitida');
      eq('pagada sigue pagada', f.estadoFactura({ estado: 'pagada', fvence: '2026-10-01' }, '2026-10-30'), 'pagada');
      const filas = f.filasFacturas(F, CLIENTES, '2026-10-30');
      eq('cliente con organización', filas[0].cliente, 'Tech Titans · Juan Pérez');
      eq('sin cliente', filas[1].cliente, 'Sin cliente');
      eq('estado efectivo', filas.map((x: { estadoClave: string }) => x.estadoClave), ['vencida', 'borrador']);
      const acciones = (f.columnasFinanzas('facturas').find((c: { field: string }) => c.field === 'acciones') as unknown as { acciones: { accion: string; mostrar?: (x: unknown) => boolean }[] }).acciones;
      const aplican = (fila: Record<string, unknown>) => acciones.filter((a) => !a.mostrar || a.mostrar(fila)).map((a) => a.accion);
      eq('borrador → emitir', aplican(filas[1]), ['emitir']);
      eq('vencida → pagar', aplican(filas[0]), ['pagar']);
    },
  },
  {
    nombre: 'finanzas W-FIN-07 totales y validación de factura',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('totales con IVA', f.totalesFactura([{ descripcion: 'a', cantidad: 2, precio: 50 }, { descripcion: 'b', cantidad: 1, precio: 0.5 }], 19), { subtotal: 100.5, iva: 19.1, total: 119.6 });
      eq('sin IVA', f.totalesFactura([{ descripcion: 'a', cantidad: 1, precio: 10 }], 0).total, 10);
      const ok = { moneda: 'COP', impuesto: 19, items: [{ descripcion: 'Soporte', cantidad: 1, precio: 100 }] };
      expect('válida', FacturaDatosSchema.safeParse(ok).success);
      expect('sin ítems', !FacturaDatosSchema.safeParse({ ...ok, items: [] }).success);
      expect('cantidad 0', !FacturaDatosSchema.safeParse({ ...ok, items: [{ descripcion: 'x', cantidad: 0, precio: 1 }] }).success);
      expect('IVA > 100', !FacturaDatosSchema.safeParse({ ...ok, impuesto: 120 }).success);
    },
  },
  {
    nombre: 'finanzas W-FIN-08 búsqueda en transacciones y facturas',
    categoria: 'what',
    correr({ eq }) {
      eq('transacción por categoría', filtrarTexto(T, 'licencias', f.camposTransaccion).map((x: { itransaccion: number }) => x.itransaccion), [2]);
      eq('transacción por tipo legible', filtrarTexto(T, 'gasto campaña', f.camposTransaccion).map((x: { itransaccion: number }) => x.itransaccion), [1]);
      eq('factura por cliente', filtrarTexto(F, 'titans', (x: typeof F[0]) => f.camposFactura(x, CLIENTES)).map((x: { ifactura: number }) => x.ifactura), [1]);
      eq('factura por ítem', filtrarTexto(F, 'soporte', (x: typeof F[0]) => f.camposFactura(x, CLIENTES)).map((x: { ifactura: number }) => x.ifactura), [1]);
      eq('categorías únicas ordenadas', f.categoriasDe([...T, { ...T[0], itransaccion: 3 }]), ['Licencias', 'Marketing']);
    },
  },
]);
