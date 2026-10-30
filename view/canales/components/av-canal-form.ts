/**
 * <av-canal-form> — diálogo para crear un canal: nombre, tipo (público/privado/directo), descripción y equipo opcional.
 * Emite `av-canal-crear { nombre, tipo, descripcion, iequipo }` al guardar y `av-canal-form-cerrar` al cerrar.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvCanalFormProps } from '../../../src/js/consts/schemas/canales.schemas.js';

type CampoEl = HTMLElement & { value: string };
type DialogoEl = HTMLElement & { open: boolean };

const AvCanalForm = crearComponente<AvCanalFormProps>(
  import.meta.url,
  'av-canal-form',
  { abierto: false, equipos: [], guardando: false, error: '' },
  (root, props, host) => {
    const valor = (id: string) => (root.querySelector(`#${id}`) as CampoEl | null)?.value?.trim() ?? '';
    const guardar = () => {
      const nombre = valor('nombre');
      if (!nombre) {
        root.querySelector('#nombre')?.setAttribute('error-text', 'El nombre es obligatorio');
        return;
      }
      const iequipo = Number(valor('equipo')) || null;
      emitir(host, 'av-canal-crear', { nombre, tipo: valor('tipo') || 'publico', descripcion: valor('descripcion') || null, iequipo });
    };
    const cerrar = () => emitir(host, 'av-canal-form-cerrar');
    root.append(html`
      <iswc-dialog id="dialogo" label="Nuevo canal" backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <iswc-input id="nombre" label="Nombre" placeholder="general, soporte, ventas…" required maxlength="120"></iswc-input>
          <iswc-select id="tipo" label="Tipo" value="publico">
            <iswc-option value="publico">Público (toda la empresa)</iswc-option>
            <iswc-option value="privado">Privado (solo participantes)</iswc-option>
            <iswc-option value="directo">Directo</iswc-option>
          </iswc-select>
          <iswc-select id="equipo" label="Equipo (opcional)" clearable placeholder="Sin equipo">
            ${props.equipos.map((e) => html`<iswc-option value=${String(e.iequipo)}>${e.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-textarea id="descripcion" label="Descripción" rows="2" maxlength="500"></iswc-textarea>
          ${props.error ? html`<iswc-callout tone="danger">${props.error}</iswc-callout>` : null}
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${cerrar}>Cancelar</iswc-button>
        <iswc-button slot="footer" color="brand" id="guardar" ?loading=${props.guardando} oniswc-click=${guardar}>Crear canal</iswc-button>
      </iswc-dialog>
    `);
  },
  // Repintado parcial: abrir/cerrar y guardando no rehacen el formulario (se conserva lo escrito).
  (root, props, previos) => {
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d || props.equipos !== previos.equipos || props.error !== previos.error) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.guardando);
    return true;
  },
);

define('av-canal-form', AvCanalForm);
