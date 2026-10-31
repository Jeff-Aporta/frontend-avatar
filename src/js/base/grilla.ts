/**
 * grilla.ts — la tabla de catálogo que comparten las vistas de negocio: un buscador (`iswc-input`) y un
 * `iswc-data-grid` del kit, más un estado vacío (`iswc-empty-state`). La búsqueda NO filtra aquí: emite `<prefijo>-buscar`
 * para que el shell decida cómo buscar (hoy por texto; mañana semántica) y devuelva las filas.
 *
 * Eventos (todos con `entidad`): `<prefijo>-buscar { entidad, texto }`, `<prefijo>-abrir { entidad, id }` (clic en
 * fila) y `<prefijo>-accion { entidad, accion, id }` (botón de acción de la fila).
 *
 * `refrescarGrilla` reasigna filas y carga sin repintar: conserva foco del buscador, orden y página.
 */
import { emitir, html } from './componente.js';

/** Fila plana de la tabla. */
export type Fila = Record<string, unknown>;

/** Acción por fila (botón con ícono). `mostrar` decide si aplica a esa fila. */
export type AccionFila = { accion: string; label: string; icono: string; mostrar?: (fila: Fila) => boolean };

/** Columna (lo que estas tablas usan del contrato de `iswc-data-grid`) + `acciones` propias. */
export type ColumnaGrilla = {
  field: string;
  headerName: string;
  type?: string;
  flex?: number;
  minWidth?: number;
  width?: number;
  sortable?: boolean;
  valueFormatter?: (p: { value: unknown }) => string;
  renderCell?: (p: { value: unknown; row: Fila }) => Node | string | { html: string };
  acciones?: AccionFila[];
};

/** Opciones de montaje. */
export type OpcionesGrilla = {
  host: HTMLElement;
  prefijo: string;
  entidad: string;
  columnas: ColumnaGrilla[];
  filas: Fila[];
  idCampo: string;
  cargando: boolean;
  texto: string;
  buscador: string;
  vacio: { icono: string; titulo: string; texto: string };
  conAcciones: boolean;
};

type GridEl = HTMLElement & { columns: unknown[]; rows: unknown[]; getRowId: (row: Fila) => unknown; loading: boolean };
type ConProps = HTMLElement & { props: Record<string, unknown> };
type Campo = HTMLElement & { value: string };

/** Vacío base de cada grilla montada (para alternar con «sin resultados»). */
const VACIOS = new WeakMap<ShadowRoot, OpcionesGrilla['vacio']>();

/** `iswc-icon` suelto (para los botones de acción del grid, que montan nodos). */
function icono(id: string): HTMLElement {
  const i = document.createElement('iswc-icon');
  i.setAttribute('icon', id);
  return i;
}

/** Columnas con `acciones` → columna `actions` del kit que emite `<prefijo>-accion`. */
function columnasDelKit(o: OpcionesGrilla): unknown[] {
  return o.columnas
    .filter((c) => !c.acciones || o.conAcciones)
    .map((c) => {
      if (!c.acciones) return c;
      const acciones = c.acciones;
      return {
        field: c.field,
        headerName: c.headerName,
        type: 'actions',
        width: c.width,
        minWidth: c.minWidth,
        getActions: ({ row }: { row: Fila }) =>
          acciones.filter((a) => !a.mostrar || a.mostrar(row)).map((a) => ({
            label: a.label,
            icon: icono(a.icono),
            onClick: () => emitir(o.host, `${o.prefijo}-accion`, { entidad: o.entidad, accion: a.accion, id: row[o.idCampo] }),
          })),
      };
    });
}

/** Monta buscador + grid + vacío en `root`. */
export function montarGrilla(root: ShadowRoot, o: OpcionesGrilla): void {
  const buscar = (e: Event) => emitir(o.host, `${o.prefijo}-buscar`, { entidad: o.entidad, texto: (e.target as Campo).value ?? '' });
  const abrir = (e: Event) => {
    const { row } = (e as CustomEvent<{ row: Fila | null }>).detail;
    const id = row?.[o.idCampo];
    if (id != null) emitir(o.host, `${o.prefijo}-abrir`, { entidad: o.entidad, id });
  };
  root.append(html`
    <div class="barra" part="barra">
      <iswc-input class="buscador" type="search" clearable placeholder=${o.buscador} aria-label=${o.buscador} value=${o.texto} oniswc-input=${buscar}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
      <span class="conteo" part="conteo"></span>
    </div>
    <iswc-data-grid class="grid" part="grid" pagination page-size="10" page-size-options="10,25,50" density="compact" disable-row-selection-on-click oniswc-row-click=${abrir}></iswc-data-grid>
    <iswc-empty-state class="vacio" hidden></iswc-empty-state>
  `);
  const grid = root.querySelector('.grid') as GridEl;
  grid.getRowId = (row) => row[o.idCampo];
  grid.columns = columnasDelKit(o);
  VACIOS.set(root, o.vacio);
  refrescarGrilla(root, o.filas, o.cargando, o.texto);
}

/** Reasigna filas y carga (sin repintar). Muestra el vacío si no hay filas. */
export function refrescarGrilla(root: ShadowRoot, filas: Fila[], cargando: boolean, texto: string): void {
  const grid = root.querySelector('.grid') as GridEl | null;
  if (!grid) return;
  grid.rows = filas;
  grid.loading = cargando;
  const vacio = !cargando && filas.length === 0;
  grid.hidden = vacio;
  const caja = root.querySelector('.vacio') as ConProps;
  caja.hidden = !vacio;
  const base = VACIOS.get(root) ?? { icono: 'mdi:inbox-outline', titulo: 'Nada por aquí', texto: '' };
  if (vacio) caja.props = texto.trim() ? { icono: 'mdi:magnify-close', titulo: 'Sin resultados', texto: `Nada coincide con «${texto.trim()}».` } : { ...base };
  const conteo = root.querySelector('.conteo');
  if (conteo) conteo.textContent = cargando ? '' : `${filas.length} ${filas.length === 1 ? 'registro' : 'registros'}`;
  const campo = root.querySelector('.buscador') as Campo | null;
  if (campo && campo.value !== texto && root.activeElement !== campo) campo.value = texto;
}
