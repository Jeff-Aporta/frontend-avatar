/**
 * <av-empresa-form> — diálogo crear/editar empresa (nombre, NIT, sector, descripción). No habla con el API: valida con
 * `validarEmpresa` y emite `av-empresa-guardar { datos }`; cerrar emite `av-empresa-cerrar`. El shell decide post/put.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvEmpresaFormProps, EmpresaForm } from '../../../src/js/consts/schemas/organizacion.schemas.js';
import { validarEmpresa } from '../utils/organizacion.js';

type Campo = HTMLElement & { value: string };
type Dialogo = HTMLElement & { open: boolean };

const AvEmpresaForm = crearComponente<AvEmpresaFormProps>(
  import.meta.url,
  'av-empresa-form',
  { abierto: false, datos: { iempresa: null, nombre: '', nit: '', sector: '', descripcion: '' }, ocupado: false, error: '' },
  (root, props, host) => {
    const leer = (): EmpresaForm => ({
      iempresa: props.datos.iempresa,
      nombre: (root.querySelector('#nombre') as Campo).value,
      nit: (root.querySelector('#nit') as Campo).value,
      sector: (root.querySelector('#sector') as Campo).value,
      descripcion: (root.querySelector('#descripcion') as Campo).value,
    });
    const guardar = () => {
      const datos = leer();
      const errores = validarEmpresa(datos);
      const aviso = root.querySelector('#aviso') as HTMLElement;
      if (errores.length) {
        aviso.textContent = errores.join('. ');
        aviso.hidden = false;
        return;
      }
      aviso.hidden = true;
      emitir(host, 'av-empresa-guardar', { datos });
    };
    const cerrar = () => emitir(host, 'av-empresa-cerrar', {});
    const nueva = props.datos.iempresa === null;
    root.append(html`
      <iswc-dialog id="dialogo" label=${nueva ? 'Nueva empresa' : 'Editar empresa'} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <iswc-input id="nombre" label="Nombre" required maxlength="160" value=${props.datos.nombre}></iswc-input>
          <iswc-input id="nit" label="NIT" maxlength="30" value=${props.datos.nit} hint="Identificación tributaria (opcional)"></iswc-input>
          <iswc-input id="sector" label="Sector" maxlength="80" value=${props.datos.sector}></iswc-input>
          <iswc-textarea id="descripcion" label="Descripción" rows="3" value=${props.datos.descripcion}></iswc-textarea>
          <iswc-callout id="aviso" color="danger" ?hidden=${!props.error}>${props.error}</iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${cerrar}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" id="guardar" color="brand" ?loading=${props.ocupado} oniswc-click=${guardar}>${nueva ? 'Crear' : 'Guardar'}</iswc-button>
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.datos !== previos.datos) return false;
    const d = root.querySelector('#dialogo') as Dialogo | null;
    if (!d) return false;
    d.open = props.abierto;
    const aviso = root.querySelector('#aviso') as HTMLElement;
    aviso.textContent = props.error;
    aviso.hidden = !props.error;
    (root.querySelector('#guardar') as HTMLElement).toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-empresa-form', AvEmpresaForm);
