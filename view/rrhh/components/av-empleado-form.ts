/**
 * <av-empleado-form> — diálogo para crear, ver/editar o eliminar un empleado (nombre, correo, departamento, cargo,
 * salario, estado, fecha de ingreso y usuario de la plataforma vinculado). Desde aquí también se pide una solicitud
 * para él. Sin `avatar.rrhh` queda de solo lectura. Emite `av-empleado-guardar { datos }` (Zod),
 * `av-empleado-eliminar { iempleado }`, `av-solicitud-nueva { iempleado }`, `av-empleado-form-error { mensaje }` y
 * `av-empleado-form-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { leerCampos, oNulo, oNumero } from '../../../src/js/base/campos.js';
import { type AvEmpleadoFormProps, EmpleadoDatosSchema, ESTADOS_EMPLEADO } from '../../../src/js/consts/schemas/rrhh.schemas.js';
import { fechaISO } from '../../../src/js/core/datos.js';
import { ETIQUETA } from '../utils/rrhh.js';

type DialogoEl = HTMLElement & { open: boolean };

const AvEmpleadoForm = crearComponente<AvEmpleadoFormProps>(
  import.meta.url,
  'av-empleado-form',
  { abierto: false, empleado: null, miembros: [], puedeEscribir: false, ocupado: false, error: '' },
  (root, props, host) => {
    const e = props.empleado;
    const ro = !props.puedeEscribir;
    const cerrar = () => emitir(host, 'av-empleado-form-cerrar', {});
    const guardar = () => {
      const v = leerCampos(root);
      const r = EmpleadoDatosSchema.safeParse({
        iempleado: e?.iempleado ?? null,
        nombre: v['nombre'] ?? '',
        email: oNulo(v['email']),
        departamento: oNulo(v['departamento']),
        cargo: oNulo(v['cargo']),
        salario: oNumero(v['salario']) ?? 0,
        estado: v['estado'] || 'activo',
        fingreso: oNulo(v['fingreso']),
        iusuario: oNulo(v['iusuario']),
      });
      if (!r.success) {
        emitir(host, 'av-empleado-form-error', { mensaje: 'Revisa el nombre, el correo y el salario (no negativo)' });
        return;
      }
      emitir(host, 'av-empleado-guardar', { datos: r.data });
    };
    root.append(html`
      <iswc-dialog id="dialogo" label=${e ? e.nombre : 'Nuevo empleado'} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-input name="nombre" label="Nombre completo" required maxlength="160" ?readonly=${ro} value=${e?.nombre ?? ''}></iswc-input>
            <iswc-input name="email" type="email" label="Correo" maxlength="160" ?readonly=${ro} value=${e?.email ?? ''}></iswc-input>
          </div>
          <div class="fila">
            <iswc-input name="departamento" label="Departamento" maxlength="80" ?readonly=${ro} value=${e?.departamento ?? ''}></iswc-input>
            <iswc-input name="cargo" label="Cargo" maxlength="120" ?readonly=${ro} value=${e?.cargo ?? ''}></iswc-input>
          </div>
          <div class="fila">
            <iswc-input name="salario" type="number" min="0" step="1000" label="Salario mensual" prefix="$" ?readonly=${ro} value=${String(e?.salario ?? 0)}></iswc-input>
            <iswc-select name="estado" label="Estado" ?disabled=${ro} value=${e?.estado ?? 'activo'}>${ESTADOS_EMPLEADO.map((x) => html`<iswc-option value=${x}>${ETIQUETA[x]}</iswc-option>`)}</iswc-select>
          </div>
          <div class="fila">
            <iswc-input name="fingreso" type="date" label="Fecha de ingreso" ?readonly=${ro} value=${fechaISO(e?.fingreso)}></iswc-input>
            <iswc-select name="iusuario" label="Usuario vinculado" clearable placeholder="Sin usuario" hint="Recibe avisos de sus solicitudes" ?disabled=${ro} value=${e?.iusuario ?? ''}>
              ${props.miembros.map((m) => html`<iswc-option value=${m.iusuario}>${m.usuario?.nombre || m.iusuario}</iswc-option>`)}
            </iswc-select>
          </div>
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
          ${ro ? html`<iswc-callout color="brand">Solo quien tiene el permiso de recursos humanos (avatar.rrhh) modifica empleados.</iswc-callout>` : null}
        </div>
        ${e && !ro ? html`<iswc-button slot="footer" id="eliminar" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este empleado? Mejor márcalo como retirado si tiene historial." oniswc-popconfirm-confirm=${() => emitir(host, 'av-empleado-eliminar', { iempleado: e.iempleado })}><iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>` : null}
        ${e && !ro && e.estado !== 'retirado' ? html`<iswc-button slot="footer" variant="outlined" color="brand" oniswc-click=${() => emitir(host, 'av-solicitud-nueva', { iempleado: e.iempleado })}><iswc-icon slot="start" icon="mdi:calendar-plus"></iswc-icon>Solicitud</iswc-button>` : null}
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${cerrar}>${ro ? 'Cerrar' : 'Cancelar'}</iswc-button>
        ${ro ? null : html`<iswc-button slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}>${e ? 'Guardar' : 'Crear empleado'}</iswc-button>`}
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.empleado !== previos.empleado || props.miembros !== previos.miembros || props.error !== previos.error || props.puedeEscribir !== previos.puedeEscribir) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-empleado-form', AvEmpleadoForm);
