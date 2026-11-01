/**
 * <av-cliente-form> — diálogo para crear, ver/editar o eliminar un cliente (nombre, organización, correo, teléfono,
 * etapa, valor, responsable, notas). Sin permiso de escritura los campos quedan de solo lectura. Emite
 * `av-cliente-guardar { datos }` (Zod), `av-cliente-eliminar { icliente }`, `av-cliente-form-error { mensaje }` y
 * `av-cliente-form-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { type AvClienteFormProps, ClienteDatosSchema, ETAPAS_CRM } from '../../../src/js/consts/schemas/crm.schemas.js';
import { leerCampos, oNulo, oNumero } from '../utils/formulario.js';
import { ETAPA_LABEL } from '../utils/crm.js';

type DialogoEl = HTMLElement & { open: boolean };

const AvClienteForm = crearComponente<AvClienteFormProps>(
  import.meta.url,
  'av-cliente-form',
  { abierto: false, cliente: null, miembros: [], puedeEscribir: false, ocupado: false, error: '' },
  (root, props, host) => {
    const c = props.cliente;
    const ro = !props.puedeEscribir;
    const cerrar = () => emitir(host, 'av-cliente-form-cerrar', {});
    const guardar = () => {
      const v = leerCampos(root);
      const r = ClienteDatosSchema.safeParse({
        icliente: c?.icliente ?? null,
        nombre: (v['nombre'] ?? '').trim(),
        organizacion: oNulo(v['organizacion']),
        email: oNulo(v['email']),
        telefono: oNulo(v['telefono']),
        etapa: v['etapa'] || 'contacto',
        valor: oNumero(v['valor']) ?? 0,
        responsable: oNulo(v['responsable']),
        notas: oNulo(v['notas']),
      });
      if (!r.success) {
        emitir(host, 'av-cliente-form-error', { mensaje: 'Revisa el nombre, el correo y el valor' });
        return;
      }
      emitir(host, 'av-cliente-guardar', { datos: r.data });
    };
    root.append(html`
      <iswc-dialog id="dialogo" label=${c ? c.nombre : 'Nuevo cliente'} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-input name="nombre" label="Nombre" required ?readonly=${ro} value=${c?.nombre ?? ''}></iswc-input>
            <iswc-input name="organizacion" label="Organización" ?readonly=${ro} value=${c?.organizacion ?? ''}></iswc-input>
          </div>
          <div class="fila">
            <iswc-input name="email" type="email" label="Correo" ?readonly=${ro} value=${c?.email ?? ''}></iswc-input>
            <iswc-input name="telefono" type="tel" label="Teléfono" ?readonly=${ro} value=${c?.telefono ?? ''}></iswc-input>
          </div>
          <div class="fila">
            <iswc-select name="etapa" label="Etapa" ?disabled=${ro} value=${c?.etapa ?? 'contacto'}>${ETAPAS_CRM.map((e) => html`<iswc-option value=${e}>${ETAPA_LABEL[e]}</iswc-option>`)}</iswc-select>
            <iswc-input name="valor" type="number" min="0" step="1000" label="Valor" prefix="$" ?readonly=${ro} value=${String(c?.valor ?? 0)}></iswc-input>
          </div>
          <iswc-select name="responsable" label="Responsable" clearable ?disabled=${ro} value=${c?.responsable ?? ''}>
            <iswc-option value="">Sin responsable</iswc-option>
            ${props.miembros.map((m) => html`<iswc-option value=${m.iusuario}>${m.usuario?.nombre || m.iusuario}</iswc-option>`)}
          </iswc-select>
          <iswc-textarea name="notas" label="Notas" rows="3" ?readonly=${ro} value=${c?.notas ?? ''}></iswc-textarea>
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
          ${ro ? html`<iswc-callout color="brand">Solo un gestor puede modificar clientes.</iswc-callout>` : null}
        </div>
        ${c && !ro ? html`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este cliente?" oniswc-popconfirm-confirm=${() => emitir(host, 'av-cliente-eliminar', { icliente: c.icliente })}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>` : null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${cerrar}>${ro ? 'Cerrar' : 'Cancelar'}</iswc-button>
        ${ro ? null : html`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}>${c ? 'Guardar' : 'Crear'}</iswc-button>`}
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.cliente !== previos.cliente || props.miembros !== previos.miembros || props.error !== previos.error || props.puedeEscribir !== previos.puedeEscribir) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-cliente-form', AvClienteForm);
