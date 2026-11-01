/**
 * finanzas.ts — dominio de la vista `finanzas` (sin DOM): indicadores del mes, series de las gráficas, columnas y
 * filas de las tablas, totales de factura, estado efectivo (vencida), categorías y equivalencias de tasas. Los
 * componentes solo pintan lo que esto devuelve.
 */
import type { ColumnaTabla, ConfigTabla, EstadoVacio, FilaTabla, Indicador } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { ClienteRef, Factura, ItemFactura, ResumenFinanzas, Tasa, Transaccion } from '../../../src/js/consts/schemas/finanzas.schemas.js';
import { celdaTag, fechaISO, formatoMoneda, hoyISO, tendencia } from '../../../src/js/core/datos.js';

/** Etiqueta legible por estado o tipo. */
export const ETIQUETA: Record<string, string> = {
  ingreso: 'Ingreso', gasto: 'Gasto',
  completada: 'Completada', pendiente: 'Pendiente', anulada: 'Anulada',
  borrador: 'Borrador', emitida: 'Emitida', pagada: 'Pagada', vencida: 'Vencida',
};

/** Matriz de la hoja de cuadre: transacciones en A:F y, en H:K, ingresos, gastos y balance por moneda con fórmulas. */
export function filasHoja(ts: Transaccion[]): (string | number)[][] {
  const fin = Math.max(ts.length + 1, 2);
  const suma = (tipo: string, fila: number) => `=SUMIFS($E$2:$E$${fin},$B$2:$B$${fin},"${tipo}",$F$2:$F$${fin},H${fila})`;
  const resumen = [...new Set(ts.map((t) => t.moneda))].sort().map((m, i) => [m, suma('Ingreso', i + 2), suma('Gasto', i + 2), `=I${i + 2}-J${i + 2}`]);
  const filas = ts.map((t) => [fechaISO(t.fecha), ETIQUETA[t.tipo] ?? t.tipo, t.categoria, t.descripcion ?? '', t.monto, t.moneda]);
  const cuerpo = Array.from({ length: Math.max(filas.length, resumen.length) }, (_, i) => [...(filas[i] ?? ['', '', '', '', '', '']), '', ...(resumen[i] ?? [])]);
  return [['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto', 'Moneda', '', 'Moneda', 'Ingresos', 'Gastos', 'Balance'], ...cuerpo];
}

/** Color del kit por estado de factura o transacción. */
export function colorEstado(estado: string): 'neutral' | 'brand' | 'success' | 'warning' | 'danger' {
  if (estado === 'pagada' || estado === 'completada' || estado === 'ingreso') return 'success';
  if (estado === 'emitida') return 'brand';
  if (estado === 'vencida' || estado === 'gasto') return 'danger';
  if (estado === 'pendiente') return 'warning';
  return 'neutral';
}

/** Estado efectivo de una factura: una emitida con vencimiento pasado se muestra vencida. */
export function estadoFactura(f: Pick<Factura, 'estado' | 'fvence'>, hoy = hoyISO()): string {
  const vence = fechaISO(f.fvence);
  return f.estado === 'emitida' && vence && vence < hoy ? 'vencida' : f.estado;
}

/** Nombre del mes `YYYY-MM` en español. */
export function nombreMes(mes: string): string {
  const [a, m] = mes.split('-').map(Number);
  if (!a || !m) return mes;
  const t = new Date(Date.UTC(a, m - 1, 15)).toLocaleDateString('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** KPIs del mes (en COP): ingresos, gastos, beneficio neto y facturas pendientes, con su variación. */
export function indicadoresFinanzas(r: ResumenFinanzas): Indicador[] {
  const dir = (v: number | null): 'up' | 'down' | 'flat' | '' => (v == null ? '' : v > 0 ? 'up' : v < 0 ? 'down' : 'flat');
  return [
    { id: 'ingresos', label: 'Ingresos del mes', value: formatoMoneda(r.ingresos.actual), helper: 'vs. mes anterior', icon: 'mdi:trending-up', color: 'success', trend: tendencia(r.ingresos.variacion), trendDirection: dir(r.ingresos.variacion) },
    { id: 'gastos', label: 'Gastos del mes', value: formatoMoneda(r.gastos.actual), helper: 'vs. mes anterior', icon: 'mdi:trending-down', color: 'danger', trend: tendencia(r.gastos.variacion), trendDirection: dir(r.gastos.variacion) },
    { id: 'beneficio', label: 'Beneficio neto', value: formatoMoneda(r.beneficio.actual), helper: r.beneficio.actual >= 0 ? 'ingresos − gastos' : 'el mes va en pérdida', icon: 'mdi:cash-check', color: r.beneficio.actual >= 0 ? 'brand' : 'danger', trend: tendencia(r.beneficio.variacion), trendDirection: dir(r.beneficio.variacion) },
    { id: 'pendientes', label: 'Facturas pendientes', value: formatoMoneda(r.facturas_pendientes.monto.actual), helper: `${r.facturas_pendientes.cantidad} por cobrar`, icon: 'mdi:timer-sand', color: 'warning', trend: tendencia(r.facturas_pendientes.monto.variacion), trendDirection: dir(r.facturas_pendientes.monto.variacion) },
  ];
}

/** Configuración (forma Chart.js) de barras: mes anterior vs actual en ingresos, gastos y beneficio. */
export function serieComparativa(r: ResumenFinanzas): { data: { labels: string[]; datasets: { label: string; data: number[] }[] } } {
  return {
    data: {
      labels: ['Ingresos', 'Gastos', 'Beneficio'],
      datasets: [
        { label: 'Mes anterior', data: [r.ingresos.anterior, r.gastos.anterior, r.beneficio.anterior] },
        { label: nombreMes(r.mes), data: [r.ingresos.actual, r.gastos.actual, r.beneficio.actual] },
      ],
    },
  };
}

/** Configuración de dona: gastos del mes por categoría (de mayor a menor). Vacía si no hay gastos. */
export function serieCategorias(r: ResumenFinanzas): { data: { labels: string[]; datasets: { label: string; data: number[] }[] } } | null {
  const pares = Object.entries(r.por_categoria).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  if (!pares.length) return null;
  return { data: { labels: pares.map(([k]) => k), datasets: [{ label: 'Gastos por categoría', data: pares.map(([, v]) => v) }] } };
}

/** Columnas de la tabla de transacciones. */
function columnasTransacciones(): ColumnaTabla[] {
  return [
    { field: 'fecha', headerName: 'Fecha', width: 110 },
    { field: 'tipo', headerName: 'Tipo', width: 110, renderCell: ({ row }) => celdaTag(ETIQUETA[String(row['tipoClave'])] ?? String(row['tipoClave']), colorEstado(String(row['tipoClave'])), 'outlined') },
    { field: 'categoria', headerName: 'Categoría', flex: 0.9, minWidth: 130 },
    { field: 'descripcion', headerName: 'Descripción', flex: 1.4, minWidth: 180 },
    { field: 'montoTexto', headerName: 'Monto', flex: 0.9, minWidth: 140, renderCell: ({ row }) => ({ html: `<strong style="color:var(--iswc-color-${row['tipoClave'] === 'gasto' ? 'danger' : 'success'}, inherit)">${row['tipoClave'] === 'gasto' ? '−' : '+'} ${String(row['montoTexto'])}</strong>` }) },
    { field: 'estado', headerName: 'Estado', width: 130, renderCell: ({ row }) => celdaTag(String(row['estado']), colorEstado(String(row['estadoClave']))) },
  ];
}

/** Columnas de la tabla de facturas (con acciones Emitir / Pagar según el estado). */
function columnasFacturas(): ColumnaTabla[] {
  return [
    { field: 'numero', headerName: 'Número', width: 130 },
    { field: 'cliente', headerName: 'Cliente', flex: 1.2, minWidth: 170 },
    { field: 'totalTexto', headerName: 'Total', flex: 0.9, minWidth: 140 },
    { field: 'estado', headerName: 'Estado', width: 120, renderCell: ({ row }) => celdaTag(String(row['estado']), colorEstado(String(row['estadoClave']))) },
    { field: 'femision', headerName: 'Emisión', width: 110 },
    { field: 'fvence', headerName: 'Vence', width: 110 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 110,
      acciones: [
        { accion: 'emitir', label: 'Emitir factura', icono: 'mdi:send-check-outline', mostrar: (f) => f['estadoClave'] === 'borrador' },
        { accion: 'pagar', label: 'Registrar pago', icono: 'mdi:cash-check', mostrar: (f) => f['estadoClave'] === 'emitida' || f['estadoClave'] === 'vencida' },
      ],
    },
  ];
}

/** Columnas por entidad de la vista. */
export function columnasFinanzas(entidad: string): ColumnaTabla[] {
  return entidad === 'facturas' ? columnasFacturas() : columnasTransacciones();
}

/** Filas planas de transacciones. */
export function filasTransacciones(ts: Transaccion[]): FilaTabla[] {
  return ts.map((t) => ({
    id: t.itransaccion,
    itransaccion: t.itransaccion,
    fecha: fechaISO(t.fecha),
    tipo: ETIQUETA[t.tipo] ?? t.tipo,
    tipoClave: t.tipo,
    categoria: t.categoria,
    descripcion: t.descripcion ?? '',
    monto: t.monto,
    montoTexto: formatoMoneda(t.monto, t.moneda),
    estado: ETIQUETA[t.estado] ?? t.estado,
    estadoClave: t.estado,
  }));
}

/** Nombre del cliente (organización si la hay). */
export const nombreCliente = (c: ClienteRef | undefined): string => (c ? (c.organizacion ? `${c.organizacion} · ${c.nombre}` : c.nombre) : 'Sin cliente');

/** Filas planas de facturas (con estado efectivo). */
export function filasFacturas(fs: Factura[], clientes: ClienteRef[], hoy = hoyISO()): FilaTabla[] {
  const porId = new Map(clientes.map((c) => [c.icliente, c]));
  return fs.map((f) => {
    const estado = estadoFactura(f, hoy);
    return {
      id: f.ifactura,
      ifactura: f.ifactura,
      numero: f.numero ?? `#${f.ifactura}`,
      cliente: f.icliente ? nombreCliente(porId.get(f.icliente)) : 'Sin cliente',
      total: Number(f.total ?? 0),
      totalTexto: formatoMoneda(Number(f.total ?? 0), f.moneda),
      estado: ETIQUETA[estado] ?? estado,
      estadoClave: estado,
      femision: fechaISO(f.femision),
      fvence: fechaISO(f.fvence),
    };
  });
}

/** Campos de búsqueda de una transacción. */
export const camposTransaccion = (t: Transaccion): unknown[] => [t.categoria, t.descripcion, t.tipo, ETIQUETA[t.tipo], t.estado, t.moneda, fechaISO(t.fecha), t.monto];

/** Campos de búsqueda de una factura. */
export function camposFactura(f: Factura, clientes: ClienteRef[]): unknown[] {
  const c = clientes.find((x) => x.icliente === f.icliente);
  return [f.numero, c?.nombre, c?.organizacion, f.estado, ETIQUETA[estadoFactura(f)], f.notas, ...(f.items ?? []).map((i) => i.descripcion)];
}

/** Subtotal, impuesto y total de unos ítems (redondeo a centavos, como el API). */
export function totalesFactura(items: ItemFactura[], impuesto: number): { subtotal: number; iva: number; total: number } {
  const subtotal = Math.round(items.reduce((s, it) => s + Number(it.cantidad || 0) * Number(it.precio || 0), 0) * 100) / 100;
  const total = Math.round(subtotal * (1 + Number(impuesto || 0) / 100) * 100) / 100;
  return { subtotal, iva: Math.round((total - subtotal) * 100) / 100, total };
}

/** Categorías usadas (para sugerir), ordenadas. */
export function categoriasDe(ts: Transaccion[]): string[] {
  return [...new Set(ts.map((t) => t.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
}

/** Monedas con tasa (COP siempre). */
export function monedasConTasa(tasas: Tasa[]): string[] {
  return [...new Set(['COP', ...tasas.map((t) => t.moneda)])];
}

/** «1 USD = $ 4.150» por cada tasa distinta de COP. */
export function equivalencias(tasas: Tasa[]): { moneda: string; texto: string; actualizado: string }[] {
  return tasas
    .filter((t) => t.moneda !== 'COP')
    .sort((a, b) => a.moneda.localeCompare(b.moneda))
    .map((t) => ({ moneda: t.moneda, texto: `1 ${t.moneda} = ${formatoMoneda(t.a_cop)}`, actualizado: t.actualizado ? String(t.actualizado instanceof Date ? t.actualizado.toISOString() : t.actualizado) : '' }));
}

/** Configuración de cada tabla de la vista: id, texto del buscador y estado vacío. */
export const TABLAS_FINANZAS: Record<string, { idCampo: string; buscador: string; vacio: EstadoVacio }> = {
  transacciones: { idCampo: 'itransaccion', buscador: 'Buscar por categoría, descripción, estado…', vacio: { icono: 'mdi:swap-vertical-circle-outline', titulo: 'Sin transacciones', texto: 'Registra ingresos y gastos para llevar la contabilidad.' } },
  facturas: { idCampo: 'ifactura', buscador: 'Buscar por número, cliente, ítem…', vacio: { icono: 'mdi:file-document-outline', titulo: 'Sin facturas', texto: 'Crea una factura en borrador y emítela cuando esté lista.' } },
};

/** Configuración de `<av-tabla>` para una entidad de la vista. */
export function tablaFinanzas(entidad: string): ConfigTabla {
  return { prefijo: 'av-finanzas', entidad, columnas: columnasFinanzas(entidad), ...TABLAS_FINANZAS[entidad]! };
}
