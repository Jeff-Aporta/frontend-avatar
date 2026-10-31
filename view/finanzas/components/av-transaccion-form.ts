/**
 * <av-transaccion-form> — diálogo para registrar, ver/editar o eliminar una transacción (tipo, categoría, descripción,
 * monto, moneda, fecha, estado). Sin `avatar.finanzas` queda de solo lectura. Emite `av-transaccion-guardar { datos }`
 * (Zod), `av-transaccion-eliminar { itransaccion }`, `av-transaccion-form-error { mensaje }` y
 * `av-transaccion-form-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { leerCampos, oNulo, oNumero } from '../../../src/js/base/campos.js';
import { type AvTransaccionFormProps, ESTADOS_TRANSACCION, MONEDAS, TIPOS_TRANSACCION, TransaccionDatosSchema } from '../../../src/js/consts/schemas/finanzas.schemas.js';
import { fechaISO, hoyISO } from '../../../src/js/core/datos.js';
import { ETIQUETA } from '../utils/finanzas.js';

type DialogoEl = HTMLElement & { open: boolean };

const AvTransaccionForm = crearComponente<AvTransaccionFormProps>(
  import.meta.url,
  'av-transaccion-form',
  { abierto: false, transaccion: null, categorias: [], puedeEscribir: false, ocupado: false, error: '' },
  (root, props, host) => {
    const t = props.transaccion;
    const ro = !props.puedeEscribir || !!t?.ifactura;
    const cerrar = () => emitir(host, 'av-transaccion-form-cerrar', {});
    const guardar = () => {
      const v = leerCampos(root);
      const r = TransaccionDatosSchema.safeParse({
        itransaccion: t?.itransaccion ?? null,
        tipo: v['tipo'],
        categoria: v['categoria'] ?? '',
        descripcion: oNulo(v['descripcion']),
        monto: oNumero(v['monto']) ?? 0,
        moneda: v['moneda'],
        fecha: v['fecha'],
        estado: v['estado'],
      });
      if (!r.success) {
        emitir(host, 'av-transaccion-form-error', { mensaje: 'Revisa la categoría, el monto (mayor que 0) y la fecha' });
        return;
      }
      emitir(host, 'av-transaccion-guardar', { datos: r.data });
    };
    const titulo = t ? `${ETIQUETA[t.tipo] ?? t.tipo} · ${t.categoria}` : 'Nueva transacción';
    root.append(html`
      <iswc-dialog id="dialogo" label=${titulo} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-select name="tipo" label="Tipo" ?disabled=${ro} value=${t?.tipo ?? 'gasto'}>${TIPOS_TRANSACCION.map((x) => html`<iswc-option value=${x}>${ETIQUETA[x]}</iswc-option>`)}</iswc-select>
            <iswc-input name="categoria" label="Categoría" required maxlength="80" ?readonly=${ro} value=${t?.categoria ?? ''} hint=${props.categorias.length ? `Usadas: ${props.categorias.slice(0, 6).join(', ')}` : ''}></iswc-input>
          </div>
          <iswc-input name="descripcion" label="Descripción" maxlength="200" ?readonly=${ro} value=${t?.descripcion ?? ''}></iswc-input>
          <div class="fila">
            <iswc-input name="monto" type="number" min="0" step="any" label="Monto" required ?readonly=${ro} value=${t ? String(t.monto) : ''}></iswc-input>
            <iswc-select name="moneda" label="Moneda" ?disabled=${ro} value=${t?.moneda ?? 'COP'}>${MONEDAS.map((m) => html`<iswc-option value=${m}>${m}</iswc-option>`)}</iswc-select>
          </div>
          <div class="fila">
            <iswc-input name="fecha" type="date" label="Fecha" required ?readonly=${ro} value=${t ? fechaISO(t.fecha) : hoyISO()}></iswc-input>
            <iswc-select name="estado" label="Estado" ?disabled=${ro} value=${t?.estado ?? 'completada'}>${ESTADOS_TRANSACCION.map((x) => html`<iswc-option value=${x}>${ETIQUETA[x]}</iswc-option>`)}</iswc-select>
          </div>
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
          ${t?.ifactura ? html`<iswc-callout color="brand">Esta transacción la registró el pago de una factura: se gestiona desde la factura.</iswc-callout>` : !props.puedeEscribir ? html`<iswc-callout color="brand">Solo quien tiene el permiso de finanzas (avatar.finanzas) registra o modifica transacciones.</iswc-callout>` : null}
        </div>
        ${t && !ro ? html`<iswc-button slot="footer" id="eliminar" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar esta transacción?" oniswc-popconfirm-confirm=${() => emitir(host, 'av-transaccion-eliminar', { itransaccion: t.itransaccion })}><iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>` : null}
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${cerrar}>${ro ? 'Cerrar' : 'Cancelar'}</iswc-button>
        ${ro ? null : html`<iswc-button slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}>${t ? 'Guardar' : 'Registrar'}</iswc-button>`}
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.transaccion !== previos.transaccion || props.error !== previos.error || props.puedeEscribir !== previos.puedeEscribir || props.categorias !== previos.categorias) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-transaccion-form', AvTransaccionForm);
