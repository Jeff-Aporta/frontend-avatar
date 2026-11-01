/**
 * <av-proyecto-form> — diálogo para crear un proyecto (nombre, descripción, estado, fechas, equipo). Emite
 * `av-proyecto-guardar { datos }` (Zod) y `av-proyecto-form-cerrar`; el shell crea el proyecto y sus columnas.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { type AvProyectoFormProps, ProyectoDatosSchema } from '../../../src/js/consts/schemas/proyectos.schemas.js';
import { leerCampos, oNulo, oNumero } from '../utils/formulario.js';
import { ESTADOS_PROYECTO } from '../utils/tareas.js';

type DialogoEl = HTMLElement & { open: boolean };
const ESTADO_LABEL: Record<string, string> = { activo: 'Activo', pausado: 'Pausado', cerrado: 'Cerrado' };

const AvProyectoForm = crearComponente<AvProyectoFormProps>(
  import.meta.url,
  'av-proyecto-form',
  { abierto: false, equipos: [], ocupado: false, error: '' },
  (root, props, host) => {
    const cerrar = () => emitir(host, 'av-proyecto-form-cerrar', {});
    const guardar = () => {
      const c = leerCampos(root);
      const r = ProyectoDatosSchema.safeParse({ nombre: (c['nombre'] ?? '').trim(), descripcion: oNulo(c['descripcion']), estado: c['estado'] || 'activo', finicio: oNulo(c['finicio']), ffin: oNulo(c['ffin']), iequipo: oNumero(c['iequipo']) });
      if (!r.success) {
        emitir(host, 'av-proyecto-form-error', { mensaje: 'El nombre es obligatorio' });
        return;
      }
      emitir(host, 'av-proyecto-guardar', { datos: r.data });
    };
    root.append(html`
      <iswc-dialog id="dialogo" label="Nuevo proyecto" backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <iswc-input name="nombre" label="Nombre" required placeholder="Plataforma Odys"></iswc-input>
          <iswc-textarea name="descripcion" label="Descripción" rows="2"></iswc-textarea>
          <div class="fila">
            <iswc-select name="estado" label="Estado" value="activo">${ESTADOS_PROYECTO.map((e) => html`<iswc-option value=${e}>${ESTADO_LABEL[e]}</iswc-option>`)}</iswc-select>
            <iswc-select name="iequipo" label="Equipo" clearable><iswc-option value="">Sin equipo</iswc-option>${props.equipos.map((e) => html`<iswc-option value=${String(e.iequipo)}>${e.nombre}</iswc-option>`)}</iswc-select>
          </div>
          <div class="fila">
            <iswc-input name="finicio" type="date" label="Inicio"></iswc-input>
            <iswc-input name="ffin" type="date" label="Fin"></iswc-input>
          </div>
          <iswc-callout color="brand">Se crean las columnas Por hacer, En progreso, En revisión y Hecho.</iswc-callout>
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${cerrar}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}>Crear proyecto</iswc-button>
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.equipos !== previos.equipos || props.error !== previos.error) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-proyecto-form', AvProyectoForm);
