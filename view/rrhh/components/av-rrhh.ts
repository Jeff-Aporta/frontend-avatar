/**
 * <av-rrhh> — shell de recursos humanos (`rrhh[/<pestaña>]`): KPIs y pestañas General (gráficas y solicitudes
 * pendientes), Empleados, Asistencia (control del día e historial) y Solicitudes, con los diálogos de empleado y de
 * solicitud. Es el único que habla con el API: `resumenRrhh`, `marcarAsistencia`, `aprobar`, `rechazar` y los
 * controllers `empleados`, `asistencias`, `solicitudes` y `miembros`. Escribir exige `avatar.rrhh`; sin ella la vista
 * lo explica y deshabilita lo que no se puede.
 *
 * Búsqueda: `buscarCatalogo` centraliza la búsqueda de cada tabla (hoy por texto sobre lo cargado): ahí se enchufa la
 * búsqueda semántica sin tocar los hijos.
 */
import { crearComponente, define, html, avisar } from '../../../src/js/base/componente.js';
import { escucharIntencion } from '../../../src/js/base/intencion.js';
import { type Asistencia, AsistenciaSchema, type AvRrhhProps, type Empleado, type EmpleadoDatos, EmpleadoSchema, type MarcaAsistencia, type MiembroRrhh, MiembroRrhhSchema, ResumenRrhhSchema, type Solicitud, type SolicitudDatos, SolicitudSchema } from '../../../src/js/consts/schemas/rrhh.schemas.js';
import { controller, dominio, mensajeDe } from '../../../src/js/core/api.js';
import { fechaISO, filas, filtrarTexto, hoyISO } from '../../../src/js/core/datos.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { camposAsistencia, camposEmpleado, departamentosDe, ETIQUETA, filasAsistenciaDia, filasAsistencias, filasEmpleados, indicadoresRrhh, solicitudesVista } from '../utils/rrhh.js';
import './av-rrhh-grafica.js';
import './av-asistencia-dia.js';
import './av-rrhh-tabla.js';
import './av-solicitudes.js';
import './av-empleado-form.js';
import './av-solicitud-form.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Detalle<T> = CustomEvent<T>;
type Entidad = 'empleados' | 'asistencias';

const PESTANAS = ['general', 'empleados', 'asistencia', 'solicitudes'] as const;

/** Búsqueda de catálogo de la vista: hoy por texto sobre lo cargado. Aquí se enchufa la búsqueda semántica. */
async function buscarCatalogo<T>(_entidad: Entidad, texto: string, items: T[], campos: (x: T) => unknown[]): Promise<T[]> {
  return filtrarTexto(items, texto, campos);
}

const AvRrhh = crearComponente<AvRrhhProps>(import.meta.url, 'av-rrhh', { id: null, version: 0 }, (root, props, host) => {
  const iempresa = empresaActiva();
  const puedeEscribir = puede(estado.perfil, ACCION.rrhh);
  const pestana = (PESTANAS as readonly string[]).includes(props.id ?? '') ? props.id! : 'general';
  let empleados: Empleado[] = [];
  let asistencias: Asistencia[] = [];
  let solicitudes: Solicitud[] | null = null;
  let miembros: MiembroRrhh[] = [];
  let fecha = hoyISO();
  let filtro = 'pendiente';
  const ocupadosAsis = new Set<number>();
  const ocupadosSol = new Set<number>();
  const texto: Record<Entidad, string> = { empleados: '', asistencias: '' };
  const cargado = { empleados: false, asistencias: false };
  const $ = (id: string) => root.querySelector(`#${id}`) as ConProps;

  const pintarEmpleados = async () => {
    $('tabla-empleados').props = { entidad: 'empleados', filas: filasEmpleados(await buscarCatalogo('empleados', texto.empleados, empleados, camposEmpleado)), cargando: !cargado.empleados, texto: texto.empleados, puedeEscribir };
  };
  const pintarAsistencias = async () => {
    const orden = [...asistencias].sort((a, b) => fechaISO(b.fecha).localeCompare(fechaISO(a.fecha)));
    $('tabla-asistencias').props = { entidad: 'asistencias', filas: filasAsistencias(await buscarCatalogo('asistencias', texto.asistencias, orden, (a) => camposAsistencia(a, empleados)), empleados), cargando: !cargado.asistencias, texto: texto.asistencias, puedeEscribir };
    $('dia').props = { fecha, filas: filasAsistenciaDia(empleados, asistencias, fecha), cargando: !cargado.asistencias || !cargado.empleados, puedeMarcar: puedeEscribir, ocupados: [...ocupadosAsis] };
  };
  const pintarSolicitudes = () => {
    const vista = solicitudes ? solicitudesVista(solicitudes, empleados) : null;
    $('solicitudes').props = { solicitudes: vista, filtro, puedeResolver: puedeEscribir, compacto: false, ocupados: [...ocupadosSol] };
    $('pendientes').props = { solicitudes: vista, filtro: 'pendiente', puedeResolver: puedeEscribir, compacto: true, ocupados: [...ocupadosSol] };
  };
  const pintarTodo = () => {
    void pintarEmpleados();
    void pintarAsistencias();
    pintarSolicitudes();
  };

  const cargarResumen = async () => {
    if (!iempresa) return;
    try {
      const r = ResumenRrhhSchema.safeParse(await dominio()['resumenRrhh'](iempresa));
      if (!r.success) throw new Error('El resumen de RRHH llegó con una forma inesperada');
      $('kpis').props = { items: indicadoresRrhh(r.data) };
      $('grafica').props = { resumen: r.data, departamentos: departamentosDe(empleados) };
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };
  const cargarEmpleados = async () => {
    if (!iempresa) return;
    try {
      empleados = filas(EmpleadoSchema, await controller('empleados').query({ where: { iempresa }, orderBy: 'nombre', pageSize: 500 }));
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
    cargado.empleados = true;
    pintarTodo();
    void cargarResumen();
    atender();
  };
  /** Intención pendiente (paleta global): asistencia o solicitud; la solicitud espera a tener empleados. */
  let pendiente: string | null = null;
  const atender = () => {
    const pestanas = root.querySelector('iswc-tab-group') as (HTMLElement & { show(n: string): void }) | null;
    if (pendiente === 'asistencia') {
      pendiente = null;
      pestanas?.show('asistencia');
      $('dia').scrollIntoView({ block: 'start', behavior: 'smooth' });
      if (!puedeEscribir) avisar('Tu rol no tiene el permiso de recursos humanos (avatar.rrhh) para marcar asistencia', 'warning');
    } else if (pendiente === 'solicitud' && cargado.empleados) {
      pendiente = null;
      pestanas?.show('solicitudes');
      if (puedeEscribir) abrirSolicitud(null);
      else avisar('Las solicitudes las registra Recursos Humanos (avatar.rrhh): pídesela a tu equipo de RRHH', 'warning');
    }
  };
  /** Asistencias de la empresa (historial) y, si hace falta, las de la fecha elegida. */
  const cargarAsistencias = async (soloFecha = false) => {
    if (!iempresa) return;
    try {
      if (soloFecha) {
        const delDia = filas(AsistenciaSchema, await controller('asistencias').query({ where: { iempresa, fecha }, pageSize: 500 }));
        asistencias = [...asistencias.filter((a) => fechaISO(a.fecha) !== fecha), ...delDia];
      } else {
        asistencias = filas(AsistenciaSchema, await controller('asistencias').query({ where: { iempresa }, orderBy: '-fecha', pageSize: 500 }));
      }
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
    cargado.asistencias = true;
    await pintarAsistencias();
  };
  const cargarSolicitudes = async () => {
    if (!iempresa) return;
    try {
      solicitudes = filas(SolicitudSchema, await controller('solicitudes').query({ where: { iempresa }, orderBy: '-creado', pageSize: 500 }));
    } catch (err) {
      solicitudes = solicitudes ?? [];
      avisar(mensajeDe(err), 'danger');
    }
    pintarSolicitudes();
  };
  const recargar = () => {
    void cargarEmpleados();
    void cargarAsistencias();
    void cargarSolicitudes();
  };

  // ── Asistencia ──
  const marcar = async (e: Event) => {
    const d = (e as Detalle<MarcaAsistencia>).detail;
    if (!puedeEscribir) return;
    ocupadosAsis.add(d.iempleado);
    await pintarAsistencias();
    try {
      const guardada = await dominio()['marcarAsistencia'](d.iempleado, { estado: d.estado, fecha: d.fecha, ...(d.entrada ? { entrada: d.entrada } : {}), ...(d.salida ? { salida: d.salida } : {}) });
      const [a] = filas(AsistenciaSchema, [guardada]);
      const nueva = a ?? { iempleado: d.iempleado, fecha: d.fecha, iempresa, estado: d.estado, entrada: d.entrada, salida: d.salida };
      asistencias = [...asistencias.filter((x) => !(x.iempleado === d.iempleado && fechaISO(x.fecha) === d.fecha)), nueva as Asistencia];
      const emp = empleados.find((x) => x.iempleado === d.iempleado);
      avisar(`${emp?.nombre ?? 'Empleado'}: ${ETIQUETA[d.estado]?.toLowerCase() ?? d.estado}${d.salida ? ` · salida ${d.salida}` : ''}`, 'success');
      if (d.fecha === hoyISO()) void cargarResumen();
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
    ocupadosAsis.delete(d.iempleado);
    await pintarAsistencias();
  };
  // ── Solicitudes ──
  const resolver = async (e: Event) => {
    const { isolicitud, accion } = (e as Detalle<{ isolicitud: number; accion: 'aprobar' | 'rechazar' }>).detail;
    if (!puedeEscribir) return;
    ocupadosSol.add(isolicitud);
    pintarSolicitudes();
    try {
      await dominio()[accion](isolicitud, {});
      avisar(accion === 'aprobar' ? 'Solicitud aprobada' : 'Solicitud rechazada', accion === 'aprobar' ? 'success' : 'warning');
      ocupadosSol.delete(isolicitud);
      await cargarSolicitudes();
      void cargarResumen();
    } catch (err) {
      ocupadosSol.delete(isolicitud);
      pintarSolicitudes();
      avisar(mensajeDe(err), 'danger');
    }
  };
  const abrirSolicitud = (iempleado: number | null) => {
    $('form-empleado').props = { abierto: false };
    $('form-solicitud').props = { abierto: true, empleados, iempleado, ocupado: false, error: '' };
  };
  const guardarSolicitud = async (e: Event) => {
    const { datos } = (e as Detalle<{ datos: SolicitudDatos }>).detail;
    const ctrl = controller('solicitudes');
    $('form-solicitud').props = { ocupado: true, error: '' };
    try {
      await ctrl.post(ctrl.pojo({ ...datos, iempresa, estado: 'pendiente' }));
      $('form-solicitud').props = { abierto: false, ocupado: false };
      avisar('Solicitud registrada', 'success');
      await cargarSolicitudes();
      void cargarResumen();
    } catch (err) {
      $('form-solicitud').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  // ── Empleados ──
  const abrirEmpleado = (emp: Empleado | null) => ($('form-empleado').props = { abierto: true, empleado: emp, miembros, puedeEscribir, ocupado: false, error: '' });
  const guardarEmpleado = async (e: Event) => {
    const { datos } = (e as Detalle<{ datos: EmpleadoDatos }>).detail;
    const ctrl = controller('empleados');
    $('form-empleado').props = { ocupado: true, error: '' };
    try {
      const { iempleado, ...resto } = datos;
      if (iempleado) await ctrl.put(ctrl.pojo({ iempleado, ...resto }));
      else await ctrl.post(ctrl.pojo({ ...resto, iempresa }));
      $('form-empleado').props = { abierto: false, ocupado: false };
      avisar(iempleado ? 'Empleado guardado' : 'Empleado creado', 'success');
      await cargarEmpleados();
    } catch (err) {
      $('form-empleado').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const eliminarEmpleado = async (e: Event) => {
    const { iempleado } = (e as Detalle<{ iempleado: number }>).detail;
    const ctrl = controller('empleados');
    try {
      await ctrl.delete(ctrl.pojo({ iempleado }));
      $('form-empleado').props = { abierto: false };
      avisar('Empleado eliminado', 'success');
      await cargarEmpleados();
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };

  const abrir = (e: Event) => {
    const { entidad, id } = (e as Detalle<{ entidad: Entidad; id: unknown }>).detail;
    const iempleado = entidad === 'empleados' ? Number(id) : Number(String(id).split('-')[0]);
    abrirEmpleado(empleados.find((x) => x.iempleado === iempleado) ?? null);
  };
  const buscar = (e: Event) => {
    const { entidad, texto: t } = (e as Detalle<{ entidad: Entidad; texto: string }>).detail;
    texto[entidad] = t;
    void (entidad === 'empleados' ? pintarEmpleados() : pintarAsistencias());
  };
  const aviso = (e: Event) => avisar((e as Detalle<{ mensaje: string }>).detail.mensaje, 'warning');

  root.append(html`
    <div class="pagina" part="pagina"
      onav-rrhh-buscar=${buscar} onav-rrhh-abrir=${abrir}
      onav-asistencia-marcar=${marcar} onav-asistencia-fecha=${(e: Event) => { fecha = (e as Detalle<{ fecha: string }>).detail.fecha; void pintarAsistencias(); void cargarAsistencias(true); }}
      onav-solicitudes-filtro=${(e: Event) => { filtro = (e as Detalle<{ filtro: string }>).detail.filtro; pintarSolicitudes(); }}
      onav-solicitud-resolver=${resolver} onav-solicitud-nueva=${(e: Event) => abrirSolicitud((e as Detalle<{ iempleado: number }>).detail.iempleado)}
      onav-solicitud-guardar=${guardarSolicitud} onav-solicitud-form-cerrar=${() => ($('form-solicitud').props = { abierto: false })} onav-solicitud-form-error=${aviso}
      onav-empleado-guardar=${guardarEmpleado} onav-empleado-eliminar=${eliminarEmpleado} onav-empleado-form-cerrar=${() => ($('form-empleado').props = { abierto: false })} onav-empleado-form-error=${aviso}>
      <av-cabecera id="cabecera">
        <iswc-button slot="acciones" variant="outlined" color="neutral" oniswc-click=${recargar}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button slot="acciones" variant="outlined" color="brand" ?disabled=${!puedeEscribir || !iempresa} oniswc-click=${() => abrirSolicitud(null)}><iswc-icon slot="start" icon="mdi:calendar-plus"></iswc-icon>Nueva solicitud</iswc-button>
        <iswc-button slot="acciones" color="brand" ?disabled=${!puedeEscribir || !iempresa} oniswc-click=${() => abrirEmpleado(null)}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Nuevo empleado</iswc-button>
      </av-cabecera>
      ${!iempresa ? html`<av-vacio id="sin-empresa"></av-vacio>` : html`
        ${puedeEscribir ? null : html`<iswc-callout color="warning"><strong>Solo lectura.</strong> Tu rol no incluye el permiso de recursos humanos (avatar.rrhh): puedes consultar la plantilla, la asistencia y las solicitudes, pero no marcar asistencia, registrar o aprobar solicitudes ni editar empleados.</iswc-callout>`}
        <av-indicadores id="kpis"></av-indicadores>
        <iswc-tab-group active=${pestana}>
          <iswc-tab slot="nav" panel="general"><iswc-icon slot="start" icon="mdi:view-dashboard-variant-outline"></iswc-icon>General</iswc-tab>
          <iswc-tab slot="nav" panel="empleados"><iswc-icon slot="start" icon="mdi:account-group-outline"></iswc-icon>Empleados</iswc-tab>
          <iswc-tab slot="nav" panel="asistencia"><iswc-icon slot="start" icon="mdi:calendar-check-outline"></iswc-icon>Asistencia</iswc-tab>
          <iswc-tab slot="nav" panel="solicitudes"><iswc-icon slot="start" icon="mdi:inbox-full-outline"></iswc-icon>Solicitudes</iswc-tab>
          <iswc-tab-panel name="general">
            <div class="general">
              <av-rrhh-grafica id="grafica"></av-rrhh-grafica>
              <section class="bloque" aria-label="Solicitudes pendientes"><h2 class="rotulo"><iswc-icon icon="mdi:timer-sand"></iswc-icon> Pendientes de aprobación</h2><av-solicitudes id="pendientes"></av-solicitudes></section>
            </div>
          </iswc-tab-panel>
          <iswc-tab-panel name="empleados"><av-rrhh-tabla id="tabla-empleados"></av-rrhh-tabla></iswc-tab-panel>
          <iswc-tab-panel name="asistencia">
            <div class="asistencia">
              <av-asistencia-dia id="dia"></av-asistencia-dia>
              <section class="bloque" aria-label="Historial de asistencia"><h2 class="rotulo"><iswc-icon icon="mdi:history"></iswc-icon> Historial</h2><av-rrhh-tabla id="tabla-asistencias"></av-rrhh-tabla></section>
            </div>
          </iswc-tab-panel>
          <iswc-tab-panel name="solicitudes"><av-solicitudes id="solicitudes"></av-solicitudes></iswc-tab-panel>
        </iswc-tab-group>
      `}
      <av-empleado-form id="form-empleado"></av-empleado-form>
      <av-solicitud-form id="form-solicitud"></av-solicitud-form>
    </div>
  `);
  const nombreEmpresa = estado.yo?.empresas.find((x) => x.iempresa === iempresa)?.nombre ?? 'Avatar';
  $('cabecera').props = { titulo: 'Recursos Humanos', subtitulo: `Personas, asistencia y solicitudes · ${nombreEmpresa}`, icono: 'mdi:account-tie-outline' };
  if (!iempresa) {
    $('sin-empresa').props = { icono: 'mdi:domain', titulo: 'Sin empresa activa', texto: 'Elige una empresa en la barra para ver su gente.' };
    return;
  }
  pintarTodo();
  recargar();
  escucharIntencion(host, 'rrhh', (intencion) => {
    pendiente = intencion;
    atender();
  });
  void (async () => {
    try {
      miembros = filas(MiembroRrhhSchema, await controller('miembros').query({ where: { iempresa }, include: { usuario: true }, pageSize: 200 }));
    } catch {
      miembros = [];
    }
  })();
});

define('av-rrhh', AvRrhh);
