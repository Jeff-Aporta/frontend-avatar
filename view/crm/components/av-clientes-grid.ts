/**
 * <av-clientes-grid> — tabla de clientes (`iswc-data-grid`) con búsqueda rápida, orden y paginación del kit. Clic en una
 * fila emite `av-cliente-abrir { icliente }`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvClientesGridProps } from '../../../src/js/consts/schemas/crm.schemas.js';
import { columnasClientes, filasClientes } from '../utils/crm.js';

type GridEl = HTMLElement & { columns: unknown[]; rows: unknown[]; getRowId: (row: Record<string, unknown>) => unknown; loading: boolean };
type ConProps = HTMLElement & { props: Record<string, unknown> };

const AvClientesGrid = crearComponente<AvClientesGridProps>(
  import.meta.url,
  'av-clientes-grid',
  { clientes: [], cargando: false },
  (root, props, host) => {
    if (!props.cargando && props.clientes.length === 0) {
      root.append(html`<iswc-empty-state id="vacio"></iswc-empty-state>`);
      (root.querySelector('#vacio') as ConProps).props = { icono: 'mdi:account-search-outline', titulo: 'Sin clientes', texto: 'No hay clientes para mostrar con este filtro.' };
      return;
    }
    const abrir = (e: Event) => {
      const { row } = (e as CustomEvent<{ id: unknown; row: Record<string, unknown> | null }>).detail;
      const icliente = Number(row?.['icliente']);
      if (icliente) emitir(host, 'av-cliente-abrir', { icliente });
    };
    root.append(html`<iswc-data-grid id="grid" class="grid" part="grid" quick-filter show-toolbar pagination page-size="25" density="compact" disable-row-selection-on-click oniswc-row-click=${abrir}></iswc-data-grid>`);
    const grid = root.querySelector('#grid') as GridEl;
    grid.getRowId = (row) => row['icliente'];
    grid.columns = columnasClientes();
    grid.rows = filasClientes(props.clientes);
    grid.loading = props.cargando;
  },
  (root, props, previos) => {
    // Mismas filas visibles o vacías → repintar; si hay grid, solo se reasignan los datos (conserva búsqueda y orden).
    const grid = root.querySelector('#grid') as GridEl | null;
    if (!grid || (!props.cargando && props.clientes.length === 0)) return false;
    if (props.clientes !== previos.clientes) grid.rows = filasClientes(props.clientes);
    grid.loading = props.cargando;
    return true;
  },
);

define('av-clientes-grid', AvClientesGrid);
