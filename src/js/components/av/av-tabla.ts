/**
 * <av-tabla> — la tabla de catálogo de las vistas de negocio: un buscador, el grid del kit (`GRID_TAG`) y un estado vacío.
 * Se configura por props (`utils` de cada vista); no conoce ningún dominio. La búsqueda NO filtra aquí: emite
 * `<prefijo>-buscar` para que el shell decida cómo buscar (hoy por texto; mañana semántica) y devuelva las filas.
 *
 * Eventos (todos con `entidad`): `<prefijo>-buscar { entidad, texto }`, `<prefijo>-abrir { entidad, id }` (clic en fila) y
 * `<prefijo>-accion { entidad, accion, id }` (botón de acción de la fila).
 *
 * `filas`, `cargando`, `texto` y `vacio` refrescan sin repintar: conservan foco del buscador, orden y página.
 */
import { crearComponente, define, emitir, html, raw } from '../../base/componente.js';
import { escHtml } from '../../core/datos.js';
import type { AvTablaProps, FilaTabla } from '../../consts/schemas/componentes.schemas.js';
import { GRID_TAG } from '../../kit-tags.js';

type GridEl = HTMLElement & { columns: unknown[]; rows: unknown[] };
type Celda = { value: unknown; data: FilaTabla };
type ConProps = HTMLElement & { props: Record<string, unknown> };
type Campo = HTMLElement & { value: string };

/** Lo que devuelve `renderCell` → HTML de la celda: el motor del grid pinta texto, no nodos. */
function htmlDeCelda(valor: Node | string | { html: string }): string {
  if (typeof valor === 'string') return escHtml(valor);
  if (!(valor instanceof Node)) return valor.html;
  const caja = document.createElement('div');
  caja.append(valor);
  return caja.innerHTML;
}

/** Columnas de la tabla → columnas del grid. Las acciones usan `data-action`, que el grid convierte en `iswc-action`. Sin permiso, no se muestran. */
function columnasDelKit(p: AvTablaProps): unknown[] {
  return p.columnas
    .filter((c) => !c.acciones || p.puedeEscribir)
    .map(({ acciones, renderCell, ...c }) => {
      if (acciones) {
        const boton = (a: (typeof acciones)[number]) => `<button class="mim-dg__action" type="button" data-action="${escHtml(a.accion)}" title="${escHtml(a.label)}"><iswc-icon icon="${escHtml(a.icono)}"></iswc-icon></button>`;
        return { ...c, sortable: false, cellRenderer: ({ data }: Celda) => acciones.filter((a) => !a.mostrar || a.mostrar(data)).map(boton).join('') };
      }
      if (!renderCell) return c;
      return { ...c, cellRenderer: ({ value, data }: Celda) => htmlDeCelda(renderCell({ value, row: data })) };
    });
}

/** Reasigna filas y carga (sin repintar). Muestra el vacío si no hay filas. */
function refrescar(root: ShadowRoot, p: AvTablaProps): void {
  const grid = root.querySelector('.grid') as GridEl;
  grid.rows = p.filas;
  grid.toggleAttribute('loading', p.cargando);
  const vacio = !p.cargando && p.filas.length === 0;
  grid.hidden = vacio;
  const caja = root.querySelector('.vacio') as ConProps;
  caja.hidden = !vacio;
  const buscado = p.texto.trim();
  if (vacio) caja.props = buscado ? { icono: 'mdi:magnify-close', titulo: 'Sin resultados', texto: `Nada coincide con «${buscado}».` } : { ...p.vacio };
  (root.querySelector('.conteo') as HTMLElement).textContent = p.cargando ? '' : `${p.filas.length} ${p.filas.length === 1 ? 'registro' : 'registros'}`;
  const campo = root.querySelector('.buscador') as Campo;
  if (campo.value !== p.texto && root.activeElement !== campo) campo.value = p.texto;
}

/** Lo que obliga a repintar: las funciones de las columnas no cuentan, una columna se identifica por sus datos. */
const configuracion = (p: AvTablaProps): string => JSON.stringify([p.prefijo, p.entidad, p.columnas, p.idCampo, p.buscador, p.porPagina, p.puedeEscribir]);

const AvTabla = crearComponente<AvTablaProps>(
  import.meta.url,
  'av-tabla',
  { prefijo: 'av-tabla', entidad: '', columnas: [], idCampo: 'id', buscador: 'Buscar…', vacio: { icono: 'mdi:inbox-outline', titulo: 'Nada por aquí', texto: '' }, porPagina: 10, filas: [], cargando: false, texto: '', puedeEscribir: false },
  (root, props, host) => {
    const buscar = (e: Event) => emitir(host, `${props.prefijo}-buscar`, { entidad: props.entidad, texto: (e.target as Campo).value ?? '' });
    const abrir = (e: Event) => {
      const { row } = (e as CustomEvent<{ row: FilaTabla | null }>).detail;
      const id = row?.[props.idCampo];
      if (id != null) emitir(host, `${props.prefijo}-abrir`, { entidad: props.entidad, id });
    };
    const accion = (e: Event) => {
      const { row, action } = (e as CustomEvent<{ row: FilaTabla; action: string }>).detail;
      emitir(host, `${props.prefijo}-accion`, { entidad: props.entidad, accion: action, id: row[props.idCampo] });
    };
    root.append(html`
      <div class="barra" part="barra">
        <iswc-input class="buscador" type="search" clearable placeholder=${props.buscador} aria-label=${props.buscador} value=${props.texto} oniswc-input=${buscar}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
        <span class="conteo" part="conteo"></span>
      </div>
      <${raw(GRID_TAG)} class="grid" part="grid" pagination page-size=${props.porPagina} page-size-options="10,25,50" density="compact" toolbar="false" get-row-id=${props.idCampo} oniswc-cell-click=${abrir} oniswc-action=${accion}></${raw(GRID_TAG)}>
      <iswc-empty-state class="vacio" hidden></iswc-empty-state>
    `);
    const grid = root.querySelector('.grid') as GridEl;
    grid.columns = columnasDelKit(props);
    refrescar(root, props);
  },
  (root, props, previos) => {
    if (configuracion(props) !== configuracion(previos)) return false;
    refrescar(root, props);
    return true;
  },
);

define('av-tabla', AvTabla);
