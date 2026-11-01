/**
 * <av-proyectos> — shell de la vista de proyectos (`/proyectos/` (id `iproyecto` en el historial)): selector de proyecto, tablero kanban,
 * formulario de tarea, detalle con comentarios y formulario de proyecto. Es el único que habla con el API (plugin
 * `avatar` de DER: `tablero`, `mover` y los controllers `proyectos`, `columnas`, `tareas`, `comentarios`, `miembros`,
 * `equipos`); los hijos pintan y emiten `av-*`.
 */
import { z } from '../../../src/js/base/zod.js';
import { crearComponente, define, html, avisar } from '../../../src/js/base/componente.js';
import { TableroSchema, type TareaTablero } from '../../../src/js/consts/schemas/api.schemas.js';
import { type AvProyectosProps, type Columna, ColumnaSchema, type Comentario, ComentarioSchema, type Equipo, EquipoSchema, type Miembro, MiembroSchema, type Proyecto, type ProyectoDatos, ProyectoSchema, type TareaDatos } from '../../../src/js/consts/schemas/proyectos.schemas.js';
import { sinEmpresa } from '../../../src/js/consts/estados.js';
import { controller, dominio, mensajeDe } from '../../../src/js/core/api.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { ir, redirigir, tomarIntencion } from '../../../src/js/core/router.js';
import { columnasPorDefecto } from '../utils/tareas.js';
import './av-tablero.js';
import './av-tarea-form.js';
import './av-tarea-detalle.js';
import './av-proyecto-form.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type SelectEl = HTMLElement & { value: string };
type Tablero = z.infer<typeof TableroSchema>;

/** Filas de un `query` de DER como JSON plano validado. */
function filas<T>(schema: z.ZodType<T>, rows: unknown[]): T[] {
  const out: T[] = [];
  for (const r of rows) {
    const j = r && typeof (r as { toJSON?: unknown }).toJSON === 'function' ? (r as { toJSON(): unknown }).toJSON() : r;
    const p = schema.safeParse(j);
    if (p.success) out.push(p.data);
  }
  return out;
}

const AvProyectos = crearComponente<AvProyectosProps>(import.meta.url, 'av-proyectos', { id: null, version: 0 }, (root, props, host) => {
  const h = host as unknown as ConProps;
  const iempresa = empresaActiva();
  const perfil = estado.perfil;
  const puedeTareas = puede(perfil, ACCION.tareas);
  const puedeGestionar = puede(perfil, ACCION.gestionar);
  const iproyecto = props.id ? Number(props.id) : null;
  const recargar = () => (h.props = { version: (props.version ?? 0) + 1 });

  let proyectos: Proyecto[] = [];
  let tablero: Tablero | null = null;
  let columnas: Columna[] = [];
  let miembros: Miembro[] = [];
  let equipos: Equipo[] = [];
  const $ = (id: string) => root.querySelector(`#${id}`) as ConProps;
  const tareaPorId = (itarea: number): TareaTablero | null => tablero?.columnas.flatMap((c) => c.tareas).find((t) => t.itarea === itarea) ?? null;

  const cargarTablero = async () => {
    if (!iproyecto) return;
    $('tablero').props = { cargando: true };
    try {
      const r = TableroSchema.safeParse(await dominio()['tablero'](iproyecto));
      if (!r.success) throw new Error('Tablero con forma inesperada');
      tablero = r.data;
      columnas = r.data.columnas.map((c) => ({ icolumna: c.icolumna, nombre: c.nombre, orden: c.orden, cierra: null }));
      $('tablero').props = { tablero, cargando: false, puedeMover: puedeTareas };
      $('tarea-form').props = { columnas, iproyecto };
    } catch (err) {
      $('tablero').props = { tablero: null, cargando: false };
      avisar(mensajeDe(err), 'danger');
    }
  };
  const cargarComentarios = async (itarea: number): Promise<Comentario[]> => {
    try {
      return filas(ComentarioSchema, await controller('comentarios').query({ where: { itarea }, orderBy: 'creado', include: { autor: true }, pageSize: 100 }));
    } catch {
      return [];
    }
  };
  const abrirDetalle = async (itarea: number) => {
    const tarea = tareaPorId(itarea);
    if (!tarea) return;
    $('detalle').props = { abierto: true, tarea, comentarios: [], puedeComentar: puedeTareas, puedeEditar: puedeTareas, puedeEliminar: puedeGestionar };
    $('detalle').props = { comentarios: await cargarComentarios(itarea) };
  };

  const alMover = async (e: Event) => {
    const { itarea, icolumna, orden } = (e as CustomEvent<{ itarea: number; icolumna: number; orden: number }>).detail;
    try {
      await dominio()['mover'](itarea, { icolumna, orden });
      avisar('Tarea movida', 'success');
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
    await cargarTablero();
  };
  const alNueva = (e: Event) => {
    const { icolumna } = (e as CustomEvent<{ icolumna: number }>).detail;
    $('tarea-form').props = { abierto: true, tarea: null, icolumna, iproyecto, columnas, miembros, error: '' };
  };
  const alEditar = (e: Event) => {
    const { itarea } = (e as CustomEvent<{ itarea: number }>).detail;
    $('detalle').props = { abierto: false };
    $('tarea-form').props = { abierto: true, tarea: tareaPorId(itarea), iproyecto, columnas, miembros, error: '' };
  };
  const alGuardarTarea = async (e: Event) => {
    const { datos } = (e as CustomEvent<{ datos: TareaDatos }>).detail;
    const tareas = controller('tareas');
    $('tarea-form').props = { ocupado: true, error: '' };
    try {
      const { itarea, ...resto } = datos;
      if (itarea) await tareas.put(tareas.pojo({ itarea, ...resto }));
      else await tareas.post(tareas.pojo({ ...resto, creado_por: estado.yo?.iusuario ?? null, estado: 'abierta', orden: 0 }));
      $('tarea-form').props = { abierto: false, ocupado: false };
      avisar(itarea ? 'Tarea guardada' : 'Tarea creada', 'success');
      await cargarTablero();
    } catch (err) {
      $('tarea-form').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const alComentar = async (e: Event) => {
    const { itarea, contenido } = (e as CustomEvent<{ itarea: number; contenido: string }>).detail;
    const comentarios = controller('comentarios');
    $('detalle').props = { ocupado: true };
    try {
      await comentarios.post(comentarios.pojo({ itarea, iusuario: estado.yo?.iusuario ?? '', contenido }));
      $('detalle').props = { ocupado: false, comentarios: await cargarComentarios(itarea) };
    } catch (err) {
      $('detalle').props = { ocupado: false };
      avisar(mensajeDe(err), 'danger');
    }
  };
  const alEliminar = async (e: Event) => {
    const { itarea } = (e as CustomEvent<{ itarea: number }>).detail;
    const tareas = controller('tareas');
    try {
      await tareas.delete(tareas.pojo({ itarea }));
      $('detalle').props = { abierto: false };
      avisar('Tarea eliminada', 'success');
      await cargarTablero();
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };
  const alGuardarProyecto = async (e: Event) => {
    const { datos } = (e as CustomEvent<{ datos: ProyectoDatos }>).detail;
    if (!iempresa) return;
    const proys = controller('proyectos');
    const cols = controller('columnas');
    $('proyecto-form').props = { ocupado: true, error: '' };
    try {
      const creado = await proys.post(proys.pojo({ ...datos, iempresa }));
      const nuevo = ProyectoSchema.safeParse(typeof creado.toJSON === 'function' ? creado.toJSON() : creado);
      const id = nuevo.success ? nuevo.data.iproyecto : Number((creado as Record<string, unknown>)['iproyecto']);
      for (const c of columnasPorDefecto(id)) await cols.post(cols.pojo(c));
      $('proyecto-form').props = { abierto: false, ocupado: false };
      avisar('Proyecto creado', 'success');
      ir('proyectos', id);
      recargar();
    } catch (err) {
      $('proyecto-form').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const alElegir = (e: Event) => {
    const v = (e.target as SelectEl).value;
    if (v && Number(v) !== iproyecto) ir('proyectos', v);
  };

  root.append(html`
    <div class="pagina" part="pagina"
      onav-tarea-mover=${alMover} onav-tarea-abrir=${(e: Event) => void abrirDetalle((e as CustomEvent<{ itarea: number }>).detail.itarea)} onav-tarea-nueva=${alNueva}
      onav-tarea-guardar=${alGuardarTarea} onav-tarea-form-cerrar=${() => ($('tarea-form').props = { abierto: false })} onav-tarea-form-error=${(e: Event) => avisar((e as CustomEvent<{ mensaje: string }>).detail.mensaje, 'warning')}
      onav-tarea-comentar=${alComentar} onav-tarea-editar=${alEditar} onav-tarea-eliminar=${alEliminar} onav-tarea-detalle-cerrar=${() => ($('detalle').props = { abierto: false })}
      onav-proyecto-guardar=${alGuardarProyecto} onav-proyecto-form-cerrar=${() => ($('proyecto-form').props = { abierto: false })} onav-proyecto-form-error=${(e: Event) => avisar((e as CustomEvent<{ mensaje: string }>).detail.mensaje, 'warning')}>
      <iswc-page-header id="cabecera">
        <iswc-select slot="acciones" id="selector" class="selector" aria-label="Proyecto" placeholder="Elige un proyecto" oniswc-change=${alElegir}></iswc-select>
        <iswc-button slot="acciones" variant="outlined compact" color="neutral" oniswc-click=${recargar}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        ${puedeTareas && iproyecto ? html`<iswc-button variant="compact" slot="acciones" color="brand" oniswc-click=${() => ($('tarea-form').props = { abierto: true, tarea: null, icolumna: null, iproyecto, columnas, miembros, error: '' })}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Nueva tarea</iswc-button>` : null}
        ${puedeGestionar ? html`<iswc-button slot="acciones" variant="outlined compact" color="brand" oniswc-click=${() => ($('proyecto-form').props = { abierto: true, equipos, error: '' })}><iswc-icon slot="start" icon="mdi:folder-plus-outline"></iswc-icon>Nuevo proyecto</iswc-button>` : null}
      </iswc-page-header>
      ${!iempresa ? html`<iswc-empty-state id="sin-empresa"></iswc-empty-state>` : html`<iswc-empty-state id="sin-proyectos" hidden></iswc-empty-state><av-tablero id="tablero"></av-tablero>`}
      <av-tarea-form id="tarea-form"></av-tarea-form>
      <av-tarea-detalle id="detalle"></av-tarea-detalle>
      <av-proyecto-form id="proyecto-form"></av-proyecto-form>
    </div>
  `);
  $('cabecera').props = { titulo: 'Proyectos', subtitulo: 'Tableros kanban y tickets de la empresa', icono: 'mdi:view-column-outline' };
  const elSinEmpresa = root.querySelector('#sin-empresa') as ConProps | null;
  if (elSinEmpresa) {
    elSinEmpresa.props = sinEmpresa('sus proyectos');
    return;
  }
  $('sin-proyectos').props = { icono: 'mdi:view-column-outline', titulo: 'Aún no hay proyectos', texto: puedeGestionar ? 'Crea el primero con «Nuevo proyecto».' : 'Pide a un gestor que cree el primer proyecto.' };
  $('tablero').props = { cargando: true };

  void (async () => {
    try {
      const [p, m, q] = await Promise.all([
        controller('proyectos').query({ where: { iempresa }, orderBy: 'nombre', pageSize: 100 }),
        controller('miembros').query({ where: { iempresa }, include: { usuario: true }, pageSize: 200 }),
        controller('equipos').query({ where: { iempresa }, pageSize: 100 }),
      ]);
      proyectos = filas(ProyectoSchema, p);
      miembros = filas(MiembroSchema, m);
      equipos = filas(EquipoSchema, q);
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
    const sel = root.querySelector('#selector') as SelectEl;
    sel.replaceChildren(...proyectos.map((p) => {
      const o = document.createElement('iswc-option');
      o.setAttribute('value', String(p.iproyecto));
      o.textContent = p.nombre;
      return o;
    }));
    $('tarea-form').props = { miembros };
    $('proyecto-form').props = { equipos };
    if (proyectos.length === 0) {
      $('sin-proyectos').hidden = false;
      $('tablero').props = { tablero: null, cargando: false };
      return;
    }
    if (!iproyecto || !proyectos.some((p) => p.iproyecto === iproyecto)) {
      redirigir('proyectos', proyectos[0]!.iproyecto);
      return;
    }
    sel.value = String(iproyecto);
    await cargarTablero();
    // columnas con `cierra` para preseleccionar la primera abierta en el formulario
    try {
      columnas = filas(ColumnaSchema, await controller('columnas').query({ where: { iproyecto }, orderBy: 'orden', pageSize: 50 }));
      $('tarea-form').props = { columnas };
    } catch {
      /* el tablero ya trajo las columnas */
    }
    // Paleta global (Ctrl+K) → «Crear tarea»: abre el formulario en el tablero ya cargado.
    if (tomarIntencion('proyectos') === 'tarea-nueva' && puedeTareas) $('tarea-form').props = { abierto: true, tarea: null, icolumna: null, iproyecto, columnas, miembros, error: '' };
  })();
});

define('av-proyectos', AvProyectos);
