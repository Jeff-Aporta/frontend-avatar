/**
 * <av-factura-form> — diálogo de factura: cliente, moneda, impuesto, ítems (descripción, cantidad, precio; se agregan
 * y quitan) con subtotal, IVA y total en vivo, y notas. Solo un borrador es editable (y solo con `avatar.finanzas`);
 * emitida, pagada o vencida se ven en solo lectura con su acción siguiente (Emitir / Registrar pago).
 * Emite `av-factura-guardar { datos }`, `av-factura-eliminar { ifactura }`, `av-finanzas-accion { entidad: 'facturas',
 * accion, id }` (emitir / pagar), `av-factura-form-error { mensaje }` y `av-factura-form-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { oNulo } from '../../../src/js/base/campos.js';
import { type AvFacturaFormProps, FacturaDatosSchema, type ItemFactura, MONEDAS } from '../../../src/js/consts/schemas/finanzas.schemas.js';
import { fechaISO, formatoMoneda } from '../../../src/js/core/datos.js';
import { colorEstado, ETIQUETA, estadoFactura, nombreCliente, totalesFactura } from '../utils/finanzas.js';

type DialogoEl = HTMLElement & { open: boolean };
type Campo = HTMLElement & { value: string };

const AvFacturaForm = crearComponente<AvFacturaFormProps>(
  import.meta.url,
  'av-factura-form',
  { abierto: false, factura: null, clientes: [], puedeEscribir: false, ocupado: false, error: '' },
  (root, props, host) => {
    const f = props.factura;
    const estado = f ? estadoFactura(f) : 'borrador';
    const editable = props.puedeEscribir && estado === 'borrador';
    let items: ItemFactura[] = f?.items?.length ? f.items.map((i) => ({ ...i })) : [{ descripcion: '', cantidad: 1, precio: 0 }];
    const moneda = () => (root.querySelector('#moneda') as Campo | null)?.value || f?.moneda || 'COP';
    const impuesto = () => Number((root.querySelector('#impuesto') as Campo | null)?.value ?? f?.impuesto ?? 19);
    const valor = (el: Element | null) => (el as Campo | null)?.value ?? '';

    /** Lee los ítems de las filas pintadas. */
    const leerItems = (): ItemFactura[] =>
      [...root.querySelectorAll('.item')].map((fila) => ({
        descripcion: valor(fila.querySelector('.i-desc')).trim(),
        cantidad: Number(valor(fila.querySelector('.i-cant')) || 0),
        precio: Number(valor(fila.querySelector('.i-precio')) || 0),
      }));
    const pintarTotales = () => {
      const t = totalesFactura(editable ? leerItems() : items, impuesto());
      const m = moneda();
      (root.querySelector('.totales') as HTMLElement).replaceChildren(html`
        <dt>Subtotal</dt><dd>${formatoMoneda(t.subtotal, m)}</dd>
        <dt>IVA (${impuesto()} %)</dt><dd>${formatoMoneda(t.iva, m)}</dd>
        <dt class="total">Total</dt><dd class="total">${formatoMoneda(t.total, m)}</dd>
      `);
    };
    const pintarItems = () => {
      const caja = root.querySelector('.items') as HTMLElement;
      caja.replaceChildren(html`${items.map((it, i) => html`
        <div class="item" part="item" data-i=${String(i)}>
          <iswc-input class="i-desc" label=${i === 0 ? 'Descripción' : ''} aria-label="Descripción" placeholder="Servicio o producto" ?readonly=${!editable} value=${it.descripcion}></iswc-input>
          <iswc-input class="i-cant" type="number" min="0" step="any" label=${i === 0 ? 'Cant.' : ''} aria-label="Cantidad" ?readonly=${!editable} value=${String(it.cantidad)}></iswc-input>
          <iswc-input class="i-precio" type="number" min="0" step="any" label=${i === 0 ? 'Precio' : ''} aria-label="Precio unitario" ?readonly=${!editable} value=${String(it.precio)}></iswc-input>
          ${editable ? html`<iswc-button class="quitar" variant="plain" color="danger" size="small" aria-label="Quitar ítem" ?disabled=${items.length === 1} oniswc-click=${() => { items = leerItems(); items.splice(i, 1); pintarItems(); }}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>` : null}
        </div>`)}`);
      pintarTotales();
    };
    const cerrar = () => emitir(host, 'av-factura-form-cerrar', {});
    const guardar = () => {
      const r = FacturaDatosSchema.safeParse({
        ifactura: f?.ifactura ?? null,
        icliente: Number(valor(root.querySelector('#cliente'))) || null,
        moneda: moneda(),
        impuesto: impuesto(),
        items: leerItems().filter((i) => i.descripcion || i.precio),
        notas: oNulo(valor(root.querySelector('#notas'))),
      });
      if (!r.success) {
        emitir(host, 'av-factura-form-error', { mensaje: 'Cada ítem necesita descripción, cantidad mayor que 0 y precio; el IVA va de 0 a 100' });
        return;
      }
      emitir(host, 'av-factura-guardar', { datos: r.data });
    };
    const accion = (a: string) => f && emitir(host, 'av-finanzas-accion', { entidad: 'facturas', accion: a, id: f.ifactura });
    const titulo = f ? `Factura ${f.numero ?? `#${f.ifactura}`}` : 'Nueva factura';
    root.append(html`
      <iswc-dialog id="dialogo" label=${titulo} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          ${f ? html`<div class="estado"><iswc-tag color=${colorEstado(estado)} pill>${ETIQUETA[estado] ?? estado}</iswc-tag>
            ${fechaISO(f.femision) ? html`<span>Emitida ${fechaISO(f.femision)}</span>` : null}
            ${fechaISO(f.fvence) ? html`<span>Vence ${fechaISO(f.fvence)}</span>` : null}
            ${fechaISO(f.fpago) ? html`<span>Pagada ${fechaISO(f.fpago)}</span>` : null}</div>` : null}
          <iswc-select id="cliente" label="Cliente" clearable ?disabled=${!editable} value=${f?.icliente ? String(f.icliente) : ''} placeholder="Sin cliente">
            ${props.clientes.map((c) => html`<iswc-option value=${String(c.icliente)}>${nombreCliente(c)}</iswc-option>`)}
          </iswc-select>
          <div class="fila">
            <iswc-select id="moneda" label="Moneda" ?disabled=${!editable} value=${f?.moneda ?? 'COP'} oniswc-change=${pintarTotales}>${MONEDAS.map((m) => html`<iswc-option value=${m}>${m}</iswc-option>`)}</iswc-select>
            <iswc-input id="impuesto" type="number" min="0" max="100" step="any" label="IVA %" ?readonly=${!editable} value=${String(f?.impuesto ?? 19)} oniswc-input=${pintarTotales}></iswc-input>
          </div>
          <div class="items" part="items" oniswc-input=${pintarTotales}></div>
          ${editable ? html`<iswc-button class="agregar" variant="outlined" color="brand" size="small" oniswc-click=${() => { items = [...leerItems(), { descripcion: '', cantidad: 1, precio: 0 }]; pintarItems(); }}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Agregar ítem</iswc-button>` : null}
          <dl class="totales" part="totales"></dl>
          <iswc-textarea id="notas" label="Notas" rows="2" ?readonly=${!editable} value=${f?.notas ?? ''}></iswc-textarea>
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
          ${!props.puedeEscribir ? html`<iswc-callout color="brand">Solo quien tiene el permiso de finanzas (avatar.finanzas) crea, emite o cobra facturas.</iswc-callout>` : !editable ? html`<iswc-callout color="brand">Una factura emitida ya no se edita: se cobra o se anula.</iswc-callout>` : null}
        </div>
        ${f && editable ? html`<iswc-button slot="footer" id="eliminar" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este borrador?" oniswc-popconfirm-confirm=${() => emitir(host, 'av-factura-eliminar', { ifactura: f.ifactura })}><iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>` : null}
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${cerrar}>${editable ? 'Cancelar' : 'Cerrar'}</iswc-button>
        ${f && editable ? html`<iswc-button slot="footer" variant="soft" color="brand" ?disabled=${props.ocupado} oniswc-click=${() => accion('emitir')}><iswc-icon slot="start" icon="mdi:send-check-outline"></iswc-icon>Emitir</iswc-button>` : null}
        ${f && props.puedeEscribir && (estado === 'emitida' || estado === 'vencida') ? html`<iswc-button slot="footer" color="success" ?loading=${props.ocupado} oniswc-click=${() => accion('pagar')}><iswc-icon slot="start" icon="mdi:cash-check"></iswc-icon>Registrar pago</iswc-button>` : null}
        ${editable ? html`<iswc-button slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}>${f ? 'Guardar' : 'Crear borrador'}</iswc-button>` : null}
      </iswc-dialog>
    `);
    pintarItems();
  },
  (root, props, previos) => {
    if (props.factura !== previos.factura || props.clientes !== previos.clientes || props.error !== previos.error || props.puedeEscribir !== previos.puedeEscribir) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-factura-form', AvFacturaForm);
