/**
 * <av-inventario> — shell de inventario (`inventario[/<pestaña>]`): KPIs, alertas de stock y pestañas Productos,
 * Movimientos (kardex), Pedidos y Proveedores, con los diálogos de producto, movimiento, pedido y proveedor. Es el
 * único que habla con el API: `resumenInventario`, `alertas`, `movimiento` y los controllers `productos`,
 * `movimientos`, `pedidos`, `itemspedido`, `proveedores` y `clientes`. Escribir exige `avatar.inventario`; sin ella
 * la vista lo explica y deshabilita lo que no se puede.
 *
 * Búsqueda: `buscarCatalogo` centraliza la búsqueda de cada tabla (hoy por texto sobre lo cargado) y
 * `relacionadosProducto` el hueco «Productos relacionados»: ahí se enchufa la búsqueda semántica sin tocar los hijos.
 */
import { soloPestana } from '../../../src/js/components/av/av-pestanas.js';
import { crearComponente, define, html, avisar } from '../../../src/js/base/componente.js';
import { escucharIntencion } from '../../../src/js/base/intencion.js';
import { z } from '../../../src/js/base/zod.js';
import { AlertaStockSchema, type AvInventarioProps, type ClientePedido, ClientePedidoSchema, type ItemPedido, ItemPedidoSchema, type Movimiento, type MovimientoDatos, MovimientoSchema, type Pedido, type PedidoDatos, PedidoSchema, type Producto, type ProductoDatos, ProductoSchema, type Proveedor, type ProveedorDatos, ProveedorSchema, ResumenInventarioSchema } from '../../../src/js/consts/schemas/inventario.schemas.js';
import { sinEmpresa } from '../../../src/js/consts/estados.js';
import { controller, dominio, mensajeDe } from '../../../src/js/core/api.js';
import { filas, filtrarTexto } from '../../../src/js/core/datos.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { camposMovimiento, camposPedido, camposProducto, camposProveedor, filasMovimientos, filasPedidos, filasProductos, filasProveedores, indicadoresInventario, relacionadosDe, tablaInventario, totalPedido } from '../utils/inventario.js';
import './av-stock-alertas.js';
import '../../../src/js/components/av/av-tabla.js';
import './av-producto-form.js';
import './av-movimiento-form.js';
import './av-pedido-form.js';
import './av-proveedor-form.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Detalle<T> = CustomEvent<T>;
type Entidad = 'productos' | 'movimientos' | 'pedidos' | 'proveedores';

const PESTANAS: readonly Entidad[] = ['productos', 'movimientos', 'pedidos', 'proveedores'];

/** Búsqueda de catálogo de la vista: hoy por texto sobre lo cargado. Aquí se enchufa la búsqueda semántica. */
async function buscarCatalogo<T>(_entidad: Entidad, texto: string, items: T[], campos: (x: T) => unknown[]): Promise<T[]> {
  return filtrarTexto(items, texto, campos);
}

/** Productos relacionados con uno (hueco del diálogo): hoy misma categoría o proveedor. */
async function relacionadosProducto(p: Producto, todos: Producto[]): Promise<Producto[]> {
  return relacionadosDe(p, todos);
}

const AvInventario = crearComponente<AvInventarioProps>(import.meta.url, 'av-inventario', { id: null, version: 0 }, (root, props, host) => {
  const iempresa = empresaActiva();
  const puedeEscribir = puede(estado.perfil, ACCION.inventario);
  const pestana = (PESTANAS as readonly string[]).includes(props.id ?? '') ? props.id! : 'productos';
  let productos: Producto[] = [];
  let movimientos: Movimiento[] = [];
  let pedidos: Pedido[] = [];
  let proveedores: Proveedor[] = [];
  let clientes: ClientePedido[] = [];
  const texto: Record<Entidad, string> = { productos: '', movimientos: '', pedidos: '', proveedores: '' };
  const cargado: Record<Entidad, boolean> = { productos: false, movimientos: false, pedidos: false, proveedores: false };
  const $ = (id: string) => root.querySelector(`#${id}`) as ConProps;

  const pintarTabla = async (entidad: Entidad) => {
    let filasDe: Record<string, unknown>[];
    if (entidad === 'productos') filasDe = filasProductos(await buscarCatalogo(entidad, texto.productos, productos, (p) => camposProducto(p, proveedores)), proveedores);
    else if (entidad === 'movimientos') filasDe = filasMovimientos(await buscarCatalogo(entidad, texto.movimientos, movimientos, (m) => camposMovimiento(m, productos)), productos);
    else if (entidad === 'pedidos') filasDe = filasPedidos(await buscarCatalogo(entidad, texto.pedidos, pedidos, (p) => camposPedido(p, proveedores, clientes)), proveedores, clientes);
    else filasDe = filasProveedores(await buscarCatalogo(entidad, texto.proveedores, proveedores, camposProveedor), productos);
    $(`tabla-${entidad}`).props = { entidad, filas: filasDe, cargando: !cargado[entidad], texto: texto[entidad], puedeEscribir };
  };
  const pintarTodo = () => PESTANAS.forEach((e) => void pintarTabla(e));

  const cargarResumen = async () => {
    if (!iempresa) return;
    try {
      const [r, a] = await Promise.all([dominio()['resumenInventario'](iempresa), dominio()['alertas'](iempresa)]);
      const res = ResumenInventarioSchema.safeParse(r);
      const al = z.array(AlertaStockSchema).safeParse(a);
      if (res.success) $('kpis').props = { items: indicadoresInventario(res.data) };
      $('alertas').props = { alertas: al.success ? al.data : [], puedeMover: puedeEscribir };
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };
  /** Carga una entidad del catálogo y repinta su tabla (y las que la usan para nombres). */
  const cargar = async (entidad: Entidad | 'clientes') => {
    if (!iempresa) return;
    try {
      if (entidad === 'productos') productos = filas(ProductoSchema, await controller('productos').query({ where: { iempresa }, orderBy: 'nombre', pageSize: 500 }));
      else if (entidad === 'movimientos') movimientos = filas(MovimientoSchema, await controller('movimientos').query({ where: { iempresa }, orderBy: '-creado', pageSize: 300 }));
      else if (entidad === 'pedidos') pedidos = filas(PedidoSchema, await controller('pedidos').query({ where: { iempresa }, orderBy: '-creado', pageSize: 300 }));
      else if (entidad === 'proveedores') proveedores = filas(ProveedorSchema, await controller('proveedores').query({ where: { iempresa }, orderBy: 'nombre', pageSize: 300 }));
      else clientes = filas(ClientePedidoSchema, await controller('clientes').query({ where: { iempresa }, pageSize: 500 }));
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
    if (entidad !== 'clientes') cargado[entidad] = true;
    pintarTodo();
    if (entidad === 'productos') atender();
  };
  /** Intención pendiente (paleta global): se resuelve cuando hay productos para elegir. */
  let pendiente: string | null = null;
  const atender = () => {
    if (pendiente !== 'movimiento' || !cargado.productos) return;
    pendiente = null;
    if (puedeEscribir) abrirMovimiento(null, 'entrada');
    else avisar('Tu rol no tiene el permiso de inventario (avatar.inventario) para mover stock', 'warning');
  };
  const recargar = () => {
    void cargarResumen();
    void Promise.all([cargar('proveedores'), cargar('clientes')]).then(() => Promise.all([cargar('productos'), cargar('movimientos'), cargar('pedidos')]));
  };

  // ── Productos ──
  const abrirProducto = async (p: Producto | null) => {
    $('form-producto').props = { abierto: true, producto: p, proveedores, relacionados: p ? await relacionadosProducto(p, productos) : [], puedeEscribir, ocupado: false, error: '' };
  };
  const guardarProducto = async (e: Event) => {
    const { datos } = (e as Detalle<{ datos: ProductoDatos }>).detail;
    const ctrl = controller('productos');
    $('form-producto').props = { ocupado: true, error: '' };
    try {
      const { iproducto, ...resto } = datos;
      if (iproducto) await ctrl.put(ctrl.pojo({ iproducto, ...resto }));
      else await ctrl.post(ctrl.pojo({ ...resto, iempresa, stock: 0 }));
      $('form-producto').props = { abierto: false, ocupado: false };
      avisar(iproducto ? 'Producto guardado' : 'Producto creado (stock 0: registra una entrada)', 'success');
      await cargar('productos');
      void cargarResumen();
    } catch (err) {
      $('form-producto').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  // ── Movimientos ──
  const abrirMovimiento = (iproducto: number | null, tipo: string) => {
    $('form-producto').props = { abierto: false };
    $('form-movimiento').props = { abierto: true, productos: productos.filter((p) => p.bactivo !== false), iproducto, tipo, ocupado: false, error: '' };
  };
  const guardarMovimiento = async (e: Event) => {
    const { datos } = (e as Detalle<{ datos: MovimientoDatos }>).detail;
    $('form-movimiento').props = { ocupado: true, error: '' };
    try {
      await dominio()['movimiento'](datos.iproducto, { tipo: datos.tipo, cantidad: datos.cantidad, ...(datos.motivo ? { motivo: datos.motivo } : {}) });
      $('form-movimiento').props = { abierto: false, ocupado: false };
      const p = productos.find((x) => x.iproducto === datos.iproducto);
      avisar(`${datos.tipo === 'entrada' ? 'Entrada' : datos.tipo === 'salida' ? 'Salida' : 'Ajuste'} registrada${p ? ` · ${p.nombre}` : ''}`, 'success');
      await Promise.all([cargar('productos'), cargar('movimientos')]);
      void cargarResumen();
    } catch (err) {
      $('form-movimiento').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  // ── Pedidos ──
  const abrirPedido = async (p: Pedido | null) => {
    let items: ItemPedido[] = [];
    if (p) {
      try {
        items = filas(ItemPedidoSchema, await controller('itemspedido').query({ where: { ipedido: p.ipedido }, pageSize: 200 }));
      } catch (err) {
        avisar(mensajeDe(err), 'warning');
      }
    }
    $('form-pedido').props = { abierto: true, pedido: p, items, productos, proveedores, clientes, puedeEscribir, ocupado: false, error: '' };
  };
  const guardarPedido = async (e: Event) => {
    const { datos } = (e as Detalle<{ datos: PedidoDatos }>).detail;
    const cp = controller('pedidos');
    const ci = controller('itemspedido');
    $('form-pedido').props = { ocupado: true, error: '' };
    try {
      const { ipedido, items, ...resto } = datos;
      const total = totalPedido(items);
      let id = ipedido;
      if (id) {
        await cp.put(cp.pojo({ ipedido: id, ...resto, total }));
        const viejos = filas(ItemPedidoSchema, await ci.query({ where: { ipedido: id }, pageSize: 200 }));
        for (const v of viejos) await ci.delete(ci.pojo({ ipedido: id, iproducto: v.iproducto }));
      } else {
        const creado = await cp.post(cp.pojo({ ...resto, iempresa, total }));
        const j = PedidoSchema.safeParse(creado && typeof (creado as { toJSON?: unknown }).toJSON === 'function' ? (creado as { toJSON(): unknown }).toJSON() : creado);
        if (!j.success) throw new Error('El API no devolvió el pedido creado');
        id = j.data.ipedido;
      }
      for (const it of items) await ci.post(ci.pojo({ ipedido: id, ...it }));
      $('form-pedido').props = { abierto: false, ocupado: false };
      avisar(ipedido ? 'Pedido guardado' : 'Pedido creado', 'success');
      await cargar('pedidos');
      void cargarResumen();
    } catch (err) {
      $('form-pedido').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const eliminarPedido = async (e: Event) => {
    const { ipedido } = (e as Detalle<{ ipedido: number }>).detail;
    const cp = controller('pedidos');
    const ci = controller('itemspedido');
    try {
      const viejos = filas(ItemPedidoSchema, await ci.query({ where: { ipedido }, pageSize: 200 }));
      for (const v of viejos) await ci.delete(ci.pojo({ ipedido, iproducto: v.iproducto }));
      await cp.delete(cp.pojo({ ipedido }));
      $('form-pedido').props = { abierto: false };
      avisar('Pedido eliminado', 'success');
      await cargar('pedidos');
      void cargarResumen();
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };
  // ── Proveedores ──
  const abrirProveedor = (p: Proveedor | null) => {
    $('form-proveedor').props = { abierto: true, proveedor: p, productos: p ? productos.filter((x) => x.iproveedor === p.iproveedor).length : 0, puedeEscribir, ocupado: false, error: '' };
  };
  const guardarProveedor = async (e: Event) => {
    const { datos } = (e as Detalle<{ datos: ProveedorDatos }>).detail;
    const ctrl = controller('proveedores');
    $('form-proveedor').props = { ocupado: true, error: '' };
    try {
      const { iproveedor, ...resto } = datos;
      if (iproveedor) await ctrl.put(ctrl.pojo({ iproveedor, ...resto }));
      else await ctrl.post(ctrl.pojo({ ...resto, iempresa }));
      $('form-proveedor').props = { abierto: false, ocupado: false };
      avisar(iproveedor ? 'Proveedor guardado' : 'Proveedor creado', 'success');
      await cargar('proveedores');
    } catch (err) {
      $('form-proveedor').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const eliminarProveedor = async (e: Event) => {
    const { iproveedor } = (e as Detalle<{ iproveedor: number }>).detail;
    const ctrl = controller('proveedores');
    try {
      await ctrl.delete(ctrl.pojo({ iproveedor }));
      $('form-proveedor').props = { abierto: false };
      avisar('Proveedor eliminado', 'success');
      await cargar('proveedores');
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };

  const abrir = (e: Event) => {
    const { entidad, id } = (e as Detalle<{ entidad: Entidad; id: number }>).detail;
    if (entidad === 'productos') void abrirProducto(productos.find((p) => p.iproducto === Number(id)) ?? null);
    else if (entidad === 'pedidos') void abrirPedido(pedidos.find((p) => p.ipedido === Number(id)) ?? null);
    else if (entidad === 'proveedores') abrirProveedor(proveedores.find((p) => p.iproveedor === Number(id)) ?? null);
    else {
      const m = movimientos.find((x) => x.imovimiento === Number(id));
      if (m) void abrirProducto(productos.find((p) => p.iproducto === m.iproducto) ?? null);
    }
  };
  const accion = (e: Event) => {
    const { accion: a, id } = (e as Detalle<{ entidad: string; accion: string; id: number }>).detail;
    if (puedeEscribir && (a === 'entrada' || a === 'salida')) abrirMovimiento(Number(id), a);
  };
  const buscar = (e: Event) => {
    const { entidad, texto: t } = (e as Detalle<{ entidad: Entidad; texto: string }>).detail;
    texto[entidad] = t;
    void pintarTabla(entidad);
  };
  const aviso = (e: Event) => avisar((e as Detalle<{ mensaje: string }>).detail.mensaje, 'warning');
  const cerrar = (id: string) => () => ($(id).props = { abierto: false });

  root.append(html`
    <div class="pagina" part="pagina"
      onav-inventario-buscar=${buscar} onav-inventario-abrir=${abrir} onav-inventario-accion=${accion}
      onav-producto-mover=${(e: Event) => { const d = (e as Detalle<{ iproducto: number; tipo: string }>).detail; if (puedeEscribir) abrirMovimiento(d.iproducto, d.tipo); }}
      onav-producto-guardar=${guardarProducto} onav-producto-form-cerrar=${cerrar('form-producto')} onav-producto-form-error=${aviso}
      onav-movimiento-guardar=${guardarMovimiento} onav-movimiento-form-cerrar=${cerrar('form-movimiento')} onav-movimiento-form-error=${aviso}
      onav-pedido-guardar=${guardarPedido} onav-pedido-eliminar=${eliminarPedido} onav-pedido-form-cerrar=${cerrar('form-pedido')} onav-pedido-form-error=${aviso}
      onav-proveedor-guardar=${guardarProveedor} onav-proveedor-eliminar=${eliminarProveedor} onav-proveedor-form-cerrar=${cerrar('form-proveedor')} onav-proveedor-form-error=${aviso}>
      <iswc-page-header id="cabecera">
        <iswc-button slot="acciones" variant="outlined compact" color="neutral" oniswc-click=${recargar}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button slot="acciones" variant="outlined compact" color="brand" ?disabled=${!puedeEscribir || !iempresa} oniswc-click=${() => abrirMovimiento(null, 'entrada')}><iswc-icon slot="start" icon="mdi:swap-vertical-bold"></iswc-icon>Movimiento</iswc-button>
        <iswc-button slot="acciones" variant="outlined compact" color="brand" ?disabled=${!puedeEscribir || !iempresa} oniswc-click=${() => void abrirPedido(null)}><iswc-icon slot="start" icon="mdi:truck-plus-outline"></iswc-icon>Pedido</iswc-button>
        <iswc-button slot="acciones" variant="outlined compact" color="brand" ?disabled=${!puedeEscribir || !iempresa} oniswc-click=${() => abrirProveedor(null)}><iswc-icon slot="start" icon="mdi:factory"></iswc-icon>Proveedor</iswc-button>
        <iswc-button variant="compact" slot="acciones" color="brand" ?disabled=${!puedeEscribir || !iempresa} oniswc-click=${() => void abrirProducto(null)}><iswc-icon slot="start" icon="mdi:package-variant-plus"></iswc-icon>Nuevo producto</iswc-button>
      </iswc-page-header>
      ${!iempresa ? html`<iswc-empty-state id="sin-empresa"></iswc-empty-state>` : html`
        ${puedeEscribir ? null : html`<iswc-callout color="warning"><strong>Solo lectura.</strong> Tu rol no incluye el permiso de inventario (avatar.inventario): puedes consultar stock, kardex y pedidos, pero no mover stock ni editar el catálogo.</iswc-callout>`}
        <iswc-stat-group id="kpis"></iswc-stat-group>
        <av-stock-alertas id="alertas"></av-stock-alertas>
        <av-pestanas vista="inventario"><iswc-tab-group active=${pestana}>
          <iswc-tab slot="nav" panel="productos"><iswc-icon slot="start" icon="mdi:package-variant-closed"></iswc-icon>Productos</iswc-tab>
          <iswc-tab slot="nav" panel="movimientos"><iswc-icon slot="start" icon="mdi:swap-vertical"></iswc-icon>Movimientos</iswc-tab>
          <iswc-tab slot="nav" panel="pedidos"><iswc-icon slot="start" icon="mdi:truck-outline"></iswc-icon>Pedidos</iswc-tab>
          <iswc-tab slot="nav" panel="proveedores"><iswc-icon slot="start" icon="mdi:factory"></iswc-icon>Proveedores</iswc-tab>
          <iswc-tab-panel name="productos"><av-tabla id="tabla-productos"></av-tabla></iswc-tab-panel>
          <iswc-tab-panel name="movimientos"><av-tabla id="tabla-movimientos"></av-tabla></iswc-tab-panel>
          <iswc-tab-panel name="pedidos"><av-tabla id="tabla-pedidos"></av-tabla></iswc-tab-panel>
          <iswc-tab-panel name="proveedores"><av-tabla id="tabla-proveedores"></av-tabla></iswc-tab-panel>
        </iswc-tab-group></av-pestanas>
      `}
      <av-producto-form id="form-producto"></av-producto-form>
      <av-movimiento-form id="form-movimiento"></av-movimiento-form>
      <av-pedido-form id="form-pedido"></av-pedido-form>
      <av-proveedor-form id="form-proveedor"></av-proveedor-form>
    </div>
  `);
  const nombreEmpresa = estado.yo?.empresas.find((e) => e.iempresa === iempresa)?.nombre ?? 'Avatar';
  $('cabecera').props = { titulo: 'Inventario', subtitulo: `Productos, stock, pedidos y proveedores · ${nombreEmpresa}`, icono: 'mdi:warehouse' };
  if (!iempresa) {
    $('sin-empresa').props = sinEmpresa('su inventario');
    return;
  }
  for (const e of PESTANAS) $(`tabla-${e}`).props = { ...tablaInventario(e), cargando: true, puedeEscribir };
  recargar();
  escucharIntencion(host, 'inventario', (intencion) => {
    pendiente = intencion;
    atender();
  });
}, soloPestana);

define('av-inventario', AvInventario);
