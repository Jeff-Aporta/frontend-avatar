/**
 * <av-finanzas> — shell de finanzas y contabilidad (`finanzas[/<pestaña>]`): KPIs del mes, pestañas General (gráficas y
 * conversor de monedas), Transacciones y Facturas, y los diálogos de transacción y factura. Es el único que habla con
 * el API: `resumenFinanzas`, `convertir`, `emitir`, `pagar` y los controllers `transacciones`, `facturas`, `tasas` y
 * `clientes`. Escribir exige `avatar.finanzas`; sin ella la vista lo explica y deshabilita lo que no se puede.
 *
 * Búsqueda: `buscarCatalogo` centraliza la búsqueda de cada tabla (hoy por texto sobre lo cargado). Es el punto donde
 * se enchufa la búsqueda semántica del API sin tocar los hijos.
 */
import { crearComponente, define, html, avisar } from '../../../src/js/base/componente.js';
import { escucharIntencion } from '../../../src/js/base/intencion.js';
import { type AvFinanzasProps, type ClienteRef, ClienteRefSchema, ConversionSchema, type Factura, type FacturaDatos, FacturaSchema, ResumenFinanzasSchema, type Tasa, TasaSchema, type Transaccion, type TransaccionDatos, TransaccionSchema } from '../../../src/js/consts/schemas/finanzas.schemas.js';
import { controller, dominio, mensajeDe } from '../../../src/js/core/api.js';
import { filas, filtrarTexto } from '../../../src/js/core/datos.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { camposFactura, camposTransaccion, categoriasDe, filasFacturas, filasTransacciones, indicadoresFinanzas } from '../utils/finanzas.js';
import './av-finanzas-grafica.js';
import './av-conversor.js';
import './av-finanzas-tabla.js';
import './av-transaccion-form.js';
import './av-factura-form.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Detalle<T> = CustomEvent<T>;
type Entidad = 'transacciones' | 'facturas';

const PESTANAS = ['general', 'transacciones', 'facturas'] as const;

/** Búsqueda de catálogo de la vista: hoy por texto sobre lo cargado. Aquí se enchufa la búsqueda semántica. */
async function buscarCatalogo<T>(_entidad: Entidad, texto: string, items: T[], campos: (x: T) => unknown[]): Promise<T[]> {
  return filtrarTexto(items, texto, campos);
}

const AvFinanzas = crearComponente<AvFinanzasProps>(import.meta.url, 'av-finanzas', { id: null, version: 0 }, (root, props, host) => {
  const iempresa = empresaActiva();
  const yo = estado.yo?.iusuario ?? null;
  const puedeEscribir = puede(estado.perfil, ACCION.finanzas);
  const pestana = (PESTANAS as readonly string[]).includes(props.id ?? '') ? props.id! : 'general';
  let transacciones: Transaccion[] = [];
  let facturas: Factura[] = [];
  let tasas: Tasa[] = [];
  let clientes: ClienteRef[] = [];
  const texto: Record<Entidad, string> = { transacciones: '', facturas: '' };
  const cargado: Record<Entidad, boolean> = { transacciones: false, facturas: false };
  const conversion = { monto: 1000, de: 'USD', a: 'COP' };
  let espera: ReturnType<typeof setTimeout> | undefined;
  const $ = (id: string) => root.querySelector(`#${id}`) as ConProps;

  const pintarTabla = async (entidad: Entidad) => {
    const filasDe = entidad === 'transacciones'
      ? filasTransacciones(await buscarCatalogo(entidad, texto.transacciones, transacciones, camposTransaccion))
      : filasFacturas(await buscarCatalogo(entidad, texto.facturas, facturas, (f) => camposFactura(f, clientes)), clientes);
    $(`tabla-${entidad}`).props = { entidad, filas: filasDe, cargando: !cargado[entidad], texto: texto[entidad], puedeEscribir };
  };
  const cargarResumen = async () => {
    if (!iempresa) return;
    try {
      const r = ResumenFinanzasSchema.safeParse(await dominio()['resumenFinanzas'](iempresa));
      if (!r.success) throw new Error('El resumen financiero llegó con una forma inesperada');
      $('kpis').props = { items: indicadoresFinanzas(r.data) };
      $('grafica').props = { resumen: r.data };
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };
  const cargarTransacciones = async () => {
    if (!iempresa) return;
    try {
      transacciones = filas(TransaccionSchema, await controller('transacciones').query({ where: { iempresa }, orderBy: '-fecha', pageSize: 500 }));
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
    cargado.transacciones = true;
    await pintarTabla('transacciones');
  };
  const cargarFacturas = async () => {
    if (!iempresa) return;
    try {
      facturas = filas(FacturaSchema, await controller('facturas').query({ where: { iempresa }, orderBy: '-creado', pageSize: 500 }));
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
    cargado.facturas = true;
    await pintarTabla('facturas');
  };
  const convertir = async () => {
    if (!iempresa) return;
    if (!(conversion.monto >= 0)) return;
    $('conversor').props = { ocupado: true, error: '' };
    try {
      const r = ConversionSchema.safeParse(await dominio()['convertir']({ iempresa, ...conversion }));
      if (!r.success) throw new Error('La conversión llegó con una forma inesperada');
      $('conversor').props = { ...conversion, resultado: r.data, ocupado: false };
    } catch (err) {
      $('conversor').props = { ocupado: false, error: mensajeDe(err), resultado: null };
    }
  };
  const cargarTasas = async () => {
    if (!iempresa) return;
    try {
      tasas = filas(TasaSchema, await controller('tasas').query({ where: { iempresa }, pageSize: 50 }));
    } catch {
      tasas = [];
    }
    $('conversor').props = { tasas, ...conversion };
    await convertir();
  };
  const recargar = () => {
    void cargarResumen();
    void cargarTransacciones();
    void cargarFacturas();
    void cargarTasas();
  };

  const abrirTransaccion = (t: Transaccion | null) => ($('form-transaccion').props = { abierto: true, transaccion: t, categorias: categoriasDe(transacciones), puedeEscribir, ocupado: false, error: '' });
  const abrirFactura = (f: Factura | null) => ($('form-factura').props = { abierto: true, factura: f, clientes, puedeEscribir, ocupado: false, error: '' });

  const guardarTransaccion = async (e: Event) => {
    const { datos } = (e as Detalle<{ datos: TransaccionDatos }>).detail;
    const ctrl = controller('transacciones');
    $('form-transaccion').props = { ocupado: true, error: '' };
    try {
      const { itransaccion, ...resto } = datos;
      if (itransaccion) await ctrl.put(ctrl.pojo({ itransaccion, ...resto }));
      else await ctrl.post(ctrl.pojo({ ...resto, iempresa, creado_por: yo }));
      $('form-transaccion').props = { abierto: false, ocupado: false };
      avisar(itransaccion ? 'Transacción guardada' : 'Transacción registrada', 'success');
      await cargarTransacciones();
      void cargarResumen();
    } catch (err) {
      $('form-transaccion').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const eliminarTransaccion = async (e: Event) => {
    const { itransaccion } = (e as Detalle<{ itransaccion: number }>).detail;
    const ctrl = controller('transacciones');
    try {
      await ctrl.delete(ctrl.pojo({ itransaccion }));
      $('form-transaccion').props = { abierto: false };
      avisar('Transacción eliminada', 'success');
      await cargarTransacciones();
      void cargarResumen();
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };
  const guardarFactura = async (e: Event) => {
    const { datos } = (e as Detalle<{ datos: FacturaDatos }>).detail;
    const ctrl = controller('facturas');
    $('form-factura').props = { ocupado: true, error: '' };
    try {
      const { ifactura, ...resto } = datos;
      if (ifactura) await ctrl.put(ctrl.pojo({ ifactura, ...resto }));
      else await ctrl.post(ctrl.pojo({ ...resto, iempresa, estado: 'borrador' }));
      $('form-factura').props = { abierto: false, ocupado: false };
      avisar(ifactura ? 'Factura guardada' : 'Borrador de factura creado', 'success');
      await cargarFacturas();
    } catch (err) {
      $('form-factura').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const eliminarFactura = async (e: Event) => {
    const { ifactura } = (e as Detalle<{ ifactura: number }>).detail;
    const ctrl = controller('facturas');
    try {
      await ctrl.delete(ctrl.pojo({ ifactura }));
      $('form-factura').props = { abierto: false };
      avisar('Borrador eliminado', 'success');
      await cargarFacturas();
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };
  /** Acciones de factura (desde la tabla o el diálogo): emitir o registrar el pago. */
  const accion = async (e: Event) => {
    const { accion: a, id } = (e as Detalle<{ entidad: string; accion: string; id: number }>).detail;
    if (!puedeEscribir) return;
    const f = facturas.find((x) => x.ifactura === Number(id));
    $('form-factura').props = { ocupado: true };
    try {
      if (a === 'emitir') await dominio()['emitir'](Number(id), {});
      else if (a === 'pagar') await dominio()['pagar'](Number(id), {});
      else return;
      $('form-factura').props = { abierto: false, ocupado: false };
      avisar(a === 'emitir' ? `Factura ${f?.numero ?? id} emitida` : `Pago de ${f?.numero ?? id} registrado como ingreso`, 'success');
      await cargarFacturas();
      if (a === 'pagar') void cargarTransacciones();
      void cargarResumen();
    } catch (err) {
      $('form-factura').props = { ocupado: false };
      avisar(mensajeDe(err), 'danger');
    }
  };
  const abrir = (e: Event) => {
    const { entidad, id } = (e as Detalle<{ entidad: Entidad; id: number }>).detail;
    if (entidad === 'transacciones') abrirTransaccion(transacciones.find((t) => t.itransaccion === Number(id)) ?? null);
    else abrirFactura(facturas.find((f) => f.ifactura === Number(id)) ?? null);
  };
  const buscar = (e: Event) => {
    const { entidad, texto: t } = (e as Detalle<{ entidad: Entidad; texto: string }>).detail;
    texto[entidad] = t;
    void pintarTabla(entidad);
  };
  const alConvertir = (e: Event) => {
    Object.assign(conversion, (e as Detalle<{ monto: number; de: string; a: string }>).detail);
    clearTimeout(espera);
    espera = setTimeout(() => void convertir(), 300);
  };

  root.append(html`
    <div class="pagina" part="pagina"
      onav-finanzas-buscar=${buscar} onav-finanzas-abrir=${abrir} onav-finanzas-accion=${accion} onav-conversor-convertir=${alConvertir}
      onav-transaccion-guardar=${guardarTransaccion} onav-transaccion-eliminar=${eliminarTransaccion}
      onav-transaccion-form-cerrar=${() => ($('form-transaccion').props = { abierto: false })}
      onav-transaccion-form-error=${(e: Event) => avisar((e as Detalle<{ mensaje: string }>).detail.mensaje, 'warning')}
      onav-factura-guardar=${guardarFactura} onav-factura-eliminar=${eliminarFactura}
      onav-factura-form-cerrar=${() => ($('form-factura').props = { abierto: false })}
      onav-factura-form-error=${(e: Event) => avisar((e as Detalle<{ mensaje: string }>).detail.mensaje, 'warning')}>
      <iswc-page-header id="cabecera">
        <iswc-button slot="acciones" variant="outlined" color="neutral" oniswc-click=${recargar}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button slot="acciones" variant="outlined" color="brand" ?disabled=${!puedeEscribir || !iempresa} oniswc-click=${() => abrirFactura(null)}><iswc-icon slot="start" icon="mdi:file-document-plus-outline"></iswc-icon>Nueva factura</iswc-button>
        <iswc-button slot="acciones" color="brand" ?disabled=${!puedeEscribir || !iempresa} oniswc-click=${() => abrirTransaccion(null)}><iswc-icon slot="start" icon="mdi:plus-circle-outline"></iswc-icon>Nueva transacción</iswc-button>
      </iswc-page-header>
      ${!iempresa ? html`<iswc-empty-state id="sin-empresa"></iswc-empty-state>` : html`
        ${puedeEscribir ? null : html`<iswc-callout color="warning"><strong>Solo lectura.</strong> Tu rol no incluye el permiso de finanzas (avatar.finanzas): puedes consultar cifras, transacciones y facturas, pero no registrar, emitir ni cobrar.</iswc-callout>`}
        <iswc-stat-group id="kpis"></iswc-stat-group>
        <iswc-tab-group active=${pestana}>
          <iswc-tab slot="nav" panel="general"><iswc-icon slot="start" icon="mdi:view-dashboard-variant-outline"></iswc-icon>General</iswc-tab>
          <iswc-tab slot="nav" panel="transacciones"><iswc-icon slot="start" icon="mdi:swap-vertical"></iswc-icon>Transacciones</iswc-tab>
          <iswc-tab slot="nav" panel="facturas"><iswc-icon slot="start" icon="mdi:file-document-multiple-outline"></iswc-icon>Facturas</iswc-tab>
          <iswc-tab-panel name="general">
            <div class="general"><av-finanzas-grafica id="grafica"></av-finanzas-grafica><av-conversor id="conversor"></av-conversor></div>
          </iswc-tab-panel>
          <iswc-tab-panel name="transacciones"><av-finanzas-tabla id="tabla-transacciones"></av-finanzas-tabla></iswc-tab-panel>
          <iswc-tab-panel name="facturas"><av-finanzas-tabla id="tabla-facturas"></av-finanzas-tabla></iswc-tab-panel>
        </iswc-tab-group>
      `}
      <av-transaccion-form id="form-transaccion"></av-transaccion-form>
      <av-factura-form id="form-factura"></av-factura-form>
    </div>
  `);
  const nombreEmpresa = estado.yo?.empresas.find((e) => e.iempresa === iempresa)?.nombre ?? 'Avatar';
  $('cabecera').props = { titulo: 'Finanzas', subtitulo: `Contabilidad, facturas y monedas · ${nombreEmpresa}`, icono: 'mdi:finance' };
  if (!iempresa) {
    $('sin-empresa').props = { icono: 'mdi:domain', titulo: 'Sin empresa activa', texto: 'Elige una empresa en la barra para ver sus finanzas.' };
    return;
  }
  $('tabla-transacciones').props = { entidad: 'transacciones', cargando: true, puedeEscribir };
  $('tabla-facturas').props = { entidad: 'facturas', cargando: true, puedeEscribir };
  $('conversor').props = { ...conversion };
  void cargarResumen();
  void cargarTransacciones();
  void cargarTasas();
  void (async () => {
    try {
      clientes = filas(ClienteRefSchema, await controller('clientes').query({ where: { iempresa }, pageSize: 500 }));
    } catch {
      clientes = [];
    }
    $('form-factura').props = { clientes };
    await cargarFacturas();
  })();
  escucharIntencion(host, 'finanzas', (intencion) => {
    const pestanas = root.querySelector('iswc-tab-group') as (HTMLElement & { show(n: string): void }) | null;
    if (intencion === 'factura-nueva') {
      pestanas?.show('facturas');
      if (puedeEscribir) abrirFactura(null);
      else avisar('Tu rol no tiene el permiso de finanzas (avatar.finanzas) para facturar', 'warning');
    } else if (intencion === 'conversor') {
      pestanas?.show('general');
      const conversor = $('conversor');
      conversor.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => (conversor.shadowRoot?.querySelector('#monto') as HTMLElement | null)?.focus(), 300);
    }
  });
});

define('av-finanzas', AvFinanzas);
