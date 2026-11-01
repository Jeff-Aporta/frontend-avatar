/**
 * <av-solicitud-form> — diálogo para registrar una solicitud de un empleado: tipo (vacaciones, permiso, certificado),
 * desde, hasta (con el conteo de días) y motivo. Emite `av-solicitud-guardar { datos }` (Zod),
 * `av-solicitud-form-error { mensaje }` y `av-solicitud-form-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { leerCampos, oNulo, oNumero } from '../../../src/js/base/campos.js';
import { type AvSolicitudFormProps, SolicitudDatosSchema, TIPOS_SOLICITUD } from '../../../src/js/consts/schemas/rrhh.schemas.js';
import { hoyISO } from '../../../src/js/core/datos.js';
import { diasSolicitud, ETIQUETA } from '../utils/rrhh.js';

type DialogoEl = HTMLElement & { open: boolean };

const AvSolicitudForm = crearComponente<AvSolicitudFormProps>(
  import.meta.url,
  'av-solicitud-form',
  { abierto: false, empleados: [], iempleado: null, ocupado: false, error: '' },
  (root, props, host) => {
    const hoy = hoyISO();
    const cerrar = () => emitir(host, 'av-solicitud-form-cerrar', {});
    const dias = () => {
      const v = leerCampos(root);
      const n = diasSolicitud({ desde: v['desde'], hasta: v['hasta'] });
      (root.querySelector('.dias') as HTMLElement).textContent = v['tipo'] === 'certificado' ? 'Un certificado no descuenta días.' : `${n} día${n === 1 ? '' : 's'} calendario`;
    };
    const guardar = () => {
      const v = leerCampos(root);
      const r = SolicitudDatosSchema.safeParse({ iempleado: oNumero(v['iempleado']) ?? 0, tipo: v['tipo'], desde: v['desde'], hasta: v['hasta'] || v['desde'], motivo: oNulo(v['motivo']) });
      if (!r.success || !r.data.iempleado) {
        emitir(host, 'av-solicitud-form-error', { mensaje: !oNumero(v['iempleado']) ? 'Elige el empleado' : 'Revisa las fechas: la final no puede ser anterior a la inicial' });
        return;
      }
      emitir(host, 'av-solicitud-guardar', { datos: r.data });
    };
    root.append(html`
      <iswc-dialog id="dialogo" label="Nueva solicitud" backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos" oniswc-change=${dias} oniswc-input=${dias}>
          <iswc-select name="iempleado" label="Empleado" required placeholder="Elige el empleado" value=${props.iempleado ? String(props.iempleado) : ''}>
            ${props.empleados.filter((e) => e.estado !== 'retirado').map((e) => html`<iswc-option value=${String(e.iempleado)}>${e.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-select name="tipo" label="Tipo" value="vacaciones">${TIPOS_SOLICITUD.map((t) => html`<iswc-option value=${t}>${ETIQUETA[t]}</iswc-option>`)}</iswc-select>
          <div class="fila">
            <iswc-input name="desde" type="date" label="Desde" required value=${hoy}></iswc-input>
            <iswc-input name="hasta" type="date" label="Hasta" value=${hoy}></iswc-input>
          </div>
          <p class="dias" aria-live="polite"></p>
          <iswc-textarea name="motivo" label="Motivo" rows="3"></iswc-textarea>
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${cerrar}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}><iswc-icon slot="start" icon="mdi:send"></iswc-icon>Registrar</iswc-button>
      </iswc-dialog>
    `);
    dias();
  },
  (root, props, previos) => {
    if (props.empleados !== previos.empleados || props.iempleado !== previos.iempleado || props.error !== previos.error) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-solicitud-form', AvSolicitudForm);
