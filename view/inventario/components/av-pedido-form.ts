/**
 * <av-pedido-form> — diálogo de pedido: tipo (a proveedor o de cliente) con su contraparte, estado, fechas de pedido,
 * envío y entrega, ítems (producto, cantidad, precio; el precio sugerido es el costo en compras y el precio de venta en
 * ventas) con total en vivo, y notas. Sin `avatar.inventario`, solo lectura. Emite `av-pedido-guardar { datos }` (Zod),
 * `av-pedido-eliminar { ipedido }`, `av-pedido-form-error { mensaje }` y `av-pedido-form-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { oNulo, oNumero } from '../../../src/js/base/campos.js';
import { type AvPedidoFormProps, ESTADOS_PEDIDO, PedidoDatosSchema, TIPOS_PEDIDO } from '../../../src/js/consts/schemas/inventario.schemas.js';
import { fechaISO, hoyISO } from '../../../src/js/core/datos.js';
import { ETIQUETA, formatoPrecio, totalPedido } from '../utils/inventario.js';

type DialogoEl = HTMLElement & { open: boolean };
type Campo = HTMLElement & { value: string };
type ItemLocal = { iproducto: number; cantidad: number; precio: number };

const AvPedidoForm = crearComponente<AvPedidoFormProps>(
  import.meta.url,
  'av-pedido-form',
  { abierto: false, pedido: null, items: [], productos: [], proveedores: [], clientes: [], puedeEscribir: false, ocupado: false, error: '' },
  (root, props, host) => {
    const p = props.pedido;
    const ro = !props.puedeEscribir;
    let items: ItemLocal[] = props.items.length ? props.items.map((i) => ({ iproducto: i.iproducto, cantidad: i.cantidad, precio: Number(i.precio ?? 0) })) : [{ iproducto: 0, cantidad: 1, precio: 0 }];
    const valor = (el: Element | null) => (el as Campo | null)?.value ?? '';
    const tipo = () => valor(root.querySelector('#tipo')) || p?.tipo || 'proveedor';
    const leerItems = (): ItemLocal[] =>
      [...root.querySelectorAll('.item')].map((f) => ({ iproducto: Number(valor(f.querySelector('.i-prod'))) || 0, cantidad: Number(valor(f.querySelector('.i-cant')) || 0), precio: Number(valor(f.querySelector('.i-precio')) || 0) }));
    const pintarTotal = () => {
      (root.querySelector('.total') as HTMLElement).textContent = formatoPrecio(totalPedido(leerItems()));
    };
    const alElegirProducto = (i: number) => (e: Event) => {
      const prod = props.productos.find((x) => x.iproducto === Number((e.target as Campo).value));
      const precio = root.querySelectorAll('.item')[i]?.querySelector('.i-precio') as Campo | null;
      if (prod && precio && !Number(precio.value)) precio.value = String(tipo() === 'proveedor' ? Number(prod.costo ?? 0) : Number(prod.precio ?? 0));
      pintarTotal();
    };
    const pintarItems = () => {
      (root.querySelector('.items') as HTMLElement).replaceChildren(html`${items.map((it, i) => html`
        <div class="item" part="item">
          <iswc-select class="i-prod" label=${i === 0 ? 'Producto' : ''} aria-label="Producto" placeholder="Producto" ?disabled=${ro} value=${it.iproducto ? String(it.iproducto) : ''} oniswc-change=${alElegirProducto(i)}>
            ${props.productos.map((x) => html`<iswc-option value=${String(x.iproducto)}>${x.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-input class="i-cant" type="number" min="1" step="1" label=${i === 0 ? 'Cant.' : ''} aria-label="Cantidad" ?readonly=${ro} value=${String(it.cantidad)}></iswc-input>
          <iswc-input class="i-precio" type="number" min="0" step="any" label=${i === 0 ? 'Precio' : ''} aria-label="Precio unitario" ?readonly=${ro} value=${String(it.precio)}></iswc-input>
          ${ro ? null : html`<iswc-button variant="plain" color="danger" size="small" aria-label="Quitar ítem" ?disabled=${items.length === 1} oniswc-click=${() => { items = leerItems(); items.splice(i, 1); pintarItems(); }}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>`}
        </div>`)}`);
      pintarTotal();
    };
    const alCambiarTipo = () => {
      const t = tipo();
      root.querySelector('.c-proveedor')?.toggleAttribute('hidden', t !== 'proveedor');
      root.querySelector('.c-cliente')?.toggleAttribute('hidden', t !== 'cliente');
    };
    const cerrar = () => emitir(host, 'av-pedido-form-cerrar', {});
    const guardar = () => {
      const t = tipo();
      const r = PedidoDatosSchema.safeParse({
        ipedido: p?.ipedido ?? null,
        tipo: t,
        iproveedor: t === 'proveedor' ? oNumero(valor(root.querySelector('#iproveedor'))) : null,
        icliente: t === 'cliente' ? oNumero(valor(root.querySelector('#icliente'))) : null,
        estado: valor(root.querySelector('#estado')) || 'pendiente',
        fpedido: valor(root.querySelector('#fpedido')) || hoyISO(),
        fenvio: oNulo(valor(root.querySelector('#fenvio'))),
        fentrega: oNulo(valor(root.querySelector('#fentrega'))),
        notas: oNulo(valor(root.querySelector('#notas'))),
        items: leerItems().filter((i) => i.iproducto),
      });
      const sinContraparte = r.success && (r.data.tipo === 'proveedor' ? !r.data.iproveedor : !r.data.icliente);
      const repetidos = r.success && new Set(r.data.items.map((i) => i.iproducto)).size !== r.data.items.length;
      if (!r.success || sinContraparte || repetidos) {
        emitir(host, 'av-pedido-form-error', { mensaje: repetidos ? 'Un producto aparece dos veces: súmalo en un solo ítem' : sinContraparte ? `Elige el ${t === 'proveedor' ? 'proveedor' : 'cliente'}` : 'Agrega al menos un producto con cantidad entera mayor que 0' });
        return;
      }
      emitir(host, 'av-pedido-guardar', { datos: r.data });
    };
    root.append(html`
      <iswc-dialog id="dialogo" label=${p ? `Pedido ${p.codigo ?? `#${p.ipedido}`}` : 'Nuevo pedido'} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-select id="tipo" label="Tipo" ?disabled=${ro || !!p} value=${p?.tipo ?? 'proveedor'} oniswc-change=${alCambiarTipo}>${TIPOS_PEDIDO.map((t) => html`<iswc-option value=${t}>${ETIQUETA[t]}</iswc-option>`)}</iswc-select>
            <iswc-select id="estado" label="Estado" ?disabled=${ro} value=${p?.estado ?? 'pendiente'}>${ESTADOS_PEDIDO.map((e) => html`<iswc-option value=${e}>${ETIQUETA[e]}</iswc-option>`)}</iswc-select>
          </div>
          <iswc-select id="iproveedor" class="c-proveedor" label="Proveedor" placeholder="Elige el proveedor" ?disabled=${ro} value=${p?.iproveedor ? String(p.iproveedor) : ''}>${props.proveedores.map((x) => html`<iswc-option value=${String(x.iproveedor)}>${x.nombre}</iswc-option>`)}</iswc-select>
          <iswc-select id="icliente" class="c-cliente" label="Cliente" placeholder="Elige el cliente" ?disabled=${ro} value=${p?.icliente ? String(p.icliente) : ''}>${props.clientes.map((c) => html`<iswc-option value=${String(c.icliente)}>${c.organizacion ? `${c.organizacion} · ${c.nombre}` : c.nombre}</iswc-option>`)}</iswc-select>
          <div class="fila tres">
            <iswc-input id="fpedido" type="date" label="Fecha del pedido" ?readonly=${ro} value=${fechaISO(p?.fpedido) || hoyISO()}></iswc-input>
            <iswc-input id="fenvio" type="date" label="Envío" ?readonly=${ro} value=${fechaISO(p?.fenvio)}></iswc-input>
            <iswc-input id="fentrega" type="date" label="Entrega" ?readonly=${ro} value=${fechaISO(p?.fentrega)}></iswc-input>
          </div>
          <div class="items" part="items" oniswc-input=${pintarTotal}></div>
          <div class="pie">
            ${ro ? null : html`<iswc-button variant="outlined" color="brand" size="small" oniswc-click=${() => { items = [...leerItems(), { iproducto: 0, cantidad: 1, precio: 0 }]; pintarItems(); }}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Agregar ítem</iswc-button>`}
            <span class="etiqueta-total">Total</span><strong class="total" part="total"></strong>
          </div>
          <iswc-textarea id="notas" label="Notas" rows="2" ?readonly=${ro} value=${p?.notas ?? ''}></iswc-textarea>
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
          ${ro ? html`<iswc-callout color="brand">Solo quien tiene el permiso de inventario (avatar.inventario) crea o modifica pedidos.</iswc-callout>` : null}
        </div>
        ${p && !ro ? html`<iswc-button slot="footer" id="eliminar" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este pedido y sus ítems?" oniswc-popconfirm-confirm=${() => emitir(host, 'av-pedido-eliminar', { ipedido: p.ipedido })}><iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>` : null}
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${cerrar}>${ro ? 'Cerrar' : 'Cancelar'}</iswc-button>
        ${ro ? null : html`<iswc-button slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}>${p ? 'Guardar' : 'Crear pedido'}</iswc-button>`}
      </iswc-dialog>
    `);
    pintarItems();
    alCambiarTipo();
  },
  (root, props, previos) => {
    if (props.pedido !== previos.pedido || props.items !== previos.items || props.productos !== previos.productos || props.error !== previos.error || props.puedeEscribir !== previos.puedeEscribir) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-pedido-form', AvPedidoForm);
