/**
 * <av-proveedor-form> — diálogo para crear, ver/editar o eliminar un proveedor (nombre, contacto, correo, teléfono).
 * Un proveedor que surte productos no se elimina (se avisa cuántos). Sin `avatar.inventario`, solo lectura. Emite
 * `av-proveedor-guardar { datos }` (Zod), `av-proveedor-eliminar { iproveedor }`, `av-proveedor-form-error { mensaje }`
 * y `av-proveedor-form-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { leerCampos, oNulo } from '../../../src/js/base/campos.js';
import { type AvProveedorFormProps, ProveedorDatosSchema } from '../../../src/js/consts/schemas/inventario.schemas.js';

type DialogoEl = HTMLElement & { open: boolean };

const AvProveedorForm = crearComponente<AvProveedorFormProps>(
  import.meta.url,
  'av-proveedor-form',
  { abierto: false, proveedor: null, productos: 0, puedeEscribir: false, ocupado: false, error: '' },
  (root, props, host) => {
    const p = props.proveedor;
    const ro = !props.puedeEscribir;
    const cerrar = () => emitir(host, 'av-proveedor-form-cerrar', {});
    const guardar = () => {
      const v = leerCampos(root);
      const r = ProveedorDatosSchema.safeParse({ iproveedor: p?.iproveedor ?? null, nombre: v['nombre'] ?? '', contacto: oNulo(v['contacto']), email: oNulo(v['email']), telefono: oNulo(v['telefono']) });
      if (!r.success) {
        emitir(host, 'av-proveedor-form-error', { mensaje: 'Revisa el nombre y el correo' });
        return;
      }
      emitir(host, 'av-proveedor-guardar', { datos: r.data });
    };
    root.append(html`
      <iswc-dialog id="dialogo" label=${p ? p.nombre : 'Nuevo proveedor'} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <iswc-input name="nombre" label="Nombre" required maxlength="160" ?readonly=${ro} value=${p?.nombre ?? ''}></iswc-input>
          <iswc-input name="contacto" label="Persona de contacto" maxlength="120" ?readonly=${ro} value=${p?.contacto ?? ''}></iswc-input>
          <div class="fila">
            <iswc-input name="email" type="email" label="Correo" maxlength="160" ?readonly=${ro} value=${p?.email ?? ''}></iswc-input>
            <iswc-input name="telefono" type="tel" label="Teléfono" maxlength="40" ?readonly=${ro} value=${p?.telefono ?? ''}></iswc-input>
          </div>
          ${p ? html`<p class="nota"><iswc-icon icon="mdi:package-variant-closed"></iswc-icon> Surte ${props.productos} producto${props.productos === 1 ? '' : 's'} del catálogo.</p>` : null}
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
          ${ro ? html`<iswc-callout color="brand">Solo quien tiene el permiso de inventario (avatar.inventario) modifica proveedores.</iswc-callout>` : null}
        </div>
        ${p && !ro && props.productos === 0 ? html`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este proveedor?" oniswc-popconfirm-confirm=${() => emitir(host, 'av-proveedor-eliminar', { iproveedor: p.iproveedor })}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>` : null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${cerrar}>${ro ? 'Cerrar' : 'Cancelar'}</iswc-button>
        ${ro ? null : html`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}>${p ? 'Guardar' : 'Crear proveedor'}</iswc-button>`}
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.proveedor !== previos.proveedor || props.productos !== previos.productos || props.error !== previos.error || props.puedeEscribir !== previos.puedeEscribir) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-proveedor-form', AvProveedorForm);
