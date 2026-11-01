/**
 * <av-usuarios> — tabla de usuarios (`iswc-ag-grid`: usuario, nombre, correo, activo, rol) y, por fila seleccionada,
 * acciones: editar, eliminar (popconfirm) y asignar rol principal (select). Emite `av-usuario-nuevo`,
 * `av-usuario-editar { iusuario }`, `av-usuario-eliminar { iusuario }` y `av-usuario-rol { iusuario, irol }` (irol '' = quitar).
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvUsuariosProps } from '../../../src/js/consts/schemas/admin.schemas.js';
import { etiquetaRol, rolPrincipal } from '../utils/admin.js';

type Grid = HTMLElement & { columns: unknown[]; rows: Record<string, unknown>[] };
type Campo = HTMLElement & { value: string };

const AvUsuarios = crearComponente<AvUsuariosProps>(import.meta.url, 'av-usuarios', { items: [], roles: [], asignaciones: [], cargando: false }, (root, props, host) => {
  let elegido: string | null = null;
  const pintarSeleccion = () => {
    const barra = root.querySelector('#seleccion') as HTMLElement;
    barra.hidden = !elegido;
    if (!elegido) return;
    (root.querySelector('#sel-nombre') as HTMLElement).textContent = elegido;
    (root.querySelector('#sel-rol') as Campo).value = rolPrincipal(elegido, props.asignaciones) ?? '';
  };
  const seleccionar = (e: Event) => {
    const fila = (e as CustomEvent<{ row?: Record<string, unknown>; id?: unknown }>).detail;
    const id = fila?.row?.['iusuario'] ?? fila?.id;
    elegido = typeof id === 'string' ? id : null;
    pintarSeleccion();
  };
  root.append(html`
    <section class="usuarios" part="usuarios">
      <div class="barra">
        <strong class="titulo"><iswc-icon icon="mdi:account-multiple-outline"></iswc-icon> Usuarios <iswc-badge color="neutral" pill>${props.items.length}</iswc-badge></strong>
        <iswc-button variant="compact" id="nuevo" color="brand" oniswc-click=${() => emitir(host, 'av-usuario-nuevo', {})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Nuevo usuario</iswc-button>
      </div>
      <div id="seleccion" class="seleccion" part="seleccion" hidden>
        <strong id="sel-nombre"></strong>
        <iswc-select id="sel-rol" label="Rol principal" placeholder="Rol base (Usuario)" clearable oniswc-change=${(e: Event) => elegido && emitir(host, 'av-usuario-rol', { iusuario: elegido, irol: (e.target as Campo).value ?? '' })}>
          ${props.roles.filter((r) => r.irol !== 'USR').map((r) => html`<iswc-option value=${r.irol}>${etiquetaRol(r.irol)}</iswc-option>`)}
        </iswc-select>
        <iswc-button variant="outlined compact" color="neutral" oniswc-click=${() => elegido && emitir(host, 'av-usuario-editar', { iusuario: elegido })}><iswc-icon slot="start" icon="mdi:pencil-outline"></iswc-icon>Editar</iswc-button>
        <iswc-button id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button>
        <iswc-popconfirm for="eliminar" message="¿Eliminar el usuario seleccionado?" oniswc-popconfirm-confirm=${() => elegido && emitir(host, 'av-usuario-eliminar', { iusuario: elegido })}>
          <iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button>
          <iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button>
        </iswc-popconfirm>
      </div>
      <iswc-ag-grid id="grid" class="grid" part="grid" density="compact" get-row-id="id" ?loading=${props.cargando} oniswc-cell-click=${seleccionar}></iswc-ag-grid>
    </section>
  `);
  const grid = root.querySelector('#grid') as Grid;
  grid.columns = [
    { field: 'iusuario', headerName: 'Usuario', width: 140 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'email', headerName: 'Correo', flex: 1 },
    { field: 'rol', headerName: 'Rol', width: 140 },
    { field: 'bactivo', headerName: 'Activo', type: 'boolean', width: 90 },
  ];
  grid.rows = props.items.map((u) => ({ id: u.iusuario, iusuario: u.iusuario, nombre: u.nombre ?? '', email: u.email ?? '', bactivo: u.bactivo !== false, rol: etiquetaRol(rolPrincipal(u.iusuario, props.asignaciones) ?? 'USR') }));
});

define('av-usuarios', AvUsuarios);
