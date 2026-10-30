/**
 * <av-tarea-form> — diálogo (`iswc-dialog`) para crear o editar una tarea: título, descripción, prioridad, columna,
 * asignado (miembros de la empresa), vencimiento y etiquetas. Al guardar emite `av-tarea-guardar { datos }`
 * (validados con Zod); cerrar emite `av-tarea-form-cerrar`. El shell escribe en el API.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { type AvTareaFormProps, TareaDatosSchema } from '../../../src/js/consts/schemas/proyectos.schemas.js';
import { leerCampos, oNulo } from '../utils/formulario.js';
import { columnaInicial, etiquetasDe, nombreMiembro, parsearEtiquetas, PRIORIDAD_LABEL, PRIORIDADES } from '../utils/tareas.js';

type DialogoEl = HTMLElement & { open: boolean };

const AvTareaForm = crearComponente<AvTareaFormProps>(
  import.meta.url,
  'av-tarea-form',
  { abierto: false, tarea: null, iproyecto: null, icolumna: null, columnas: [], miembros: [], ocupado: false, error: '' },
  (root, props, host) => {
    const t = props.tarea;
    const cerrar = () => emitir(host, 'av-tarea-form-cerrar', {});
    const guardar = () => {
      const c = leerCampos(root);
      const r = TareaDatosSchema.safeParse({
        itarea: t?.itarea ?? null,
        iproyecto: t?.iproyecto ?? props.iproyecto,
        icolumna: Number(c['icolumna']),
        titulo: (c['titulo'] ?? '').trim(),
        descripcion: oNulo(c['descripcion']),
        prioridad: c['prioridad'] || 'media',
        asignado_a: oNulo(c['asignado_a']),
        fvence: oNulo(c['fvence']),
        etiquetas: parsearEtiquetas(c['etiquetas'] ?? ''),
      });
      if (!r.success) {
        emitir(host, 'av-tarea-form-error', { mensaje: 'Revisa el título y la columna' });
        return;
      }
      emitir(host, 'av-tarea-guardar', { datos: r.data });
    };
    const columna = t?.icolumna ?? props.icolumna ?? columnaInicial(props.columnas);
    root.append(html`
      <iswc-dialog id="dialogo" label=${t ? `Editar ${t.codigo ?? 'tarea'}` : 'Nueva tarea'} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <iswc-input name="titulo" label="Título" required value=${t?.titulo ?? ''} placeholder="Qué hay que hacer"></iswc-input>
          <iswc-textarea name="descripcion" label="Descripción" rows="3" value=${t?.descripcion ?? ''}></iswc-textarea>
          <div class="fila">
            <iswc-select name="prioridad" label="Prioridad" value=${t?.prioridad ?? 'media'}>
              ${PRIORIDADES.map((p) => html`<iswc-option value=${p}>${PRIORIDAD_LABEL[p]}</iswc-option>`)}
            </iswc-select>
            <iswc-select name="icolumna" label="Columna" value=${columna == null ? '' : String(columna)}>
              ${props.columnas.map((c) => html`<iswc-option value=${String(c.icolumna)}>${c.nombre}</iswc-option>`)}
            </iswc-select>
          </div>
          <div class="fila">
            <iswc-select name="asignado_a" label="Asignado a" clearable value=${t?.asignado_a ?? ''}>
              <iswc-option value="">Sin asignar</iswc-option>
              ${props.miembros.map((m) => html`<iswc-option value=${m.iusuario}>${nombreMiembro(m)}</iswc-option>`)}
            </iswc-select>
            <iswc-input name="fvence" type="date" label="Vence" value=${t?.fvence ? String(t.fvence).slice(0, 10) : ''}></iswc-input>
          </div>
          <iswc-input name="etiquetas" label="Etiquetas" hint="Separadas por comas" value=${etiquetasDe(t?.etiquetas).join(', ')}></iswc-input>
          ${props.error ? html`<iswc-callout tone="danger">${props.error}</iswc-callout>` : null}
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${cerrar}>Cancelar</iswc-button>
        <iswc-button slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}>${t ? 'Guardar' : 'Crear'}</iswc-button>
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    // Solo abrir/cerrar u ocupado: no se rehace el formulario (conserva lo escrito).
    if (props.tarea !== previos.tarea || props.columnas !== previos.columnas || props.miembros !== previos.miembros || props.error !== previos.error) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    const b = root.querySelector('#guardar');
    if (b) b.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-tarea-form', AvTareaForm);
