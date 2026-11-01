/**
 * <av-movimiento-form> — diálogo para mover stock: producto, tipo (entrada, salida o ajuste por conteo físico),
 * cantidad y motivo, con la vista previa «stock actual → resultante» (avisa si quedaría negativo). Emite
 * `av-movimiento-guardar { datos }` (Zod), `av-movimiento-form-error { mensaje }` y `av-movimiento-form-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { leerCampos, oNulo, oNumero } from '../../../src/js/base/campos.js';
import { type AvMovimientoFormProps, MovimientoDatosSchema, TIPOS_MOVIMIENTO } from '../../../src/js/consts/schemas/inventario.schemas.js';
import { ETIQUETA, stockResultante } from '../utils/inventario.js';

type DialogoEl = HTMLElement & { open: boolean };

const AYUDA: Record<string, string> = { entrada: 'Suma al stock (compras, devoluciones).', salida: 'Resta del stock (ventas, despachos, mermas).', ajuste: 'Fija el stock al conteo físico.' };

const AvMovimientoForm = crearComponente<AvMovimientoFormProps>(
  import.meta.url,
  'av-movimiento-form',
  { abierto: false, productos: [], iproducto: null, tipo: 'entrada', ocupado: false, error: '' },
  (root, props, host) => {
    const cerrar = () => emitir(host, 'av-movimiento-form-cerrar', {});
    const previa = () => {
      const v = leerCampos(root);
      const p = props.productos.find((x) => x.iproducto === Number(v['iproducto']));
      const caja = root.querySelector('.previa') as HTMLElement;
      const ayuda = root.querySelector('.ayuda') as HTMLElement;
      ayuda.textContent = AYUDA[v['tipo'] ?? ''] ?? '';
      if (!p) {
        caja.replaceChildren(html`<span>Elige un producto</span>`);
        return;
      }
      const r = stockResultante(p.stock, v['tipo'] ?? 'entrada', oNumero(v['cantidad']) ?? 0);
      caja.toggleAttribute('data-error', r == null);
      caja.replaceChildren(html`<span class="rotulo">Stock</span><strong>${p.stock}</strong><iswc-icon icon="mdi:arrow-right-thin"></iswc-icon><strong class="nuevo">${r == null ? 'insuficiente' : r}</strong>`);
    };
    const guardar = () => {
      const v = leerCampos(root);
      const r = MovimientoDatosSchema.safeParse({ iproducto: oNumero(v['iproducto']) ?? 0, tipo: v['tipo'], cantidad: oNumero(v['cantidad']) ?? -1, motivo: oNulo(v['motivo']) });
      if (!r.success || !r.data.iproducto) {
        emitir(host, 'av-movimiento-form-error', { mensaje: 'Elige el producto y una cantidad entera (mayor que 0, salvo en un ajuste)' });
        return;
      }
      const p = props.productos.find((x) => x.iproducto === r.data.iproducto);
      if (p && stockResultante(p.stock, r.data.tipo, r.data.cantidad) == null) {
        emitir(host, 'av-movimiento-form-error', { mensaje: `Stock insuficiente: hay ${p.stock}` });
        return;
      }
      emitir(host, 'av-movimiento-guardar', { datos: r.data });
    };
    root.append(html`
      <iswc-dialog id="dialogo" label="Movimiento de inventario" backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos" oniswc-change=${previa} oniswc-input=${previa}>
          <iswc-select name="iproducto" label="Producto" required placeholder="Elige un producto" value=${props.iproducto ? String(props.iproducto) : ''}>
            ${props.productos.map((p) => html`<iswc-option value=${String(p.iproducto)}>${p.sku ? `${p.sku} · ` : ''}${p.nombre} (${p.stock})</iswc-option>`)}
          </iswc-select>
          <div class="fila">
            <iswc-select name="tipo" label="Tipo" value=${props.tipo}>${TIPOS_MOVIMIENTO.map((t) => html`<iswc-option value=${t}>${ETIQUETA[t]}</iswc-option>`)}</iswc-select>
            <iswc-input name="cantidad" type="number" min="0" step="1" label=${props.tipo === 'ajuste' ? 'Conteo físico' : 'Cantidad'} required value="1"></iswc-input>
          </div>
          <p class="ayuda"></p>
          <div class="previa" part="previa" aria-live="polite"></div>
          <iswc-input name="motivo" label="Motivo" maxlength="300" placeholder="Compra, venta, conteo…"></iswc-input>
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${cerrar}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}><iswc-icon slot="start" icon="mdi:check"></iswc-icon>Registrar</iswc-button>
      </iswc-dialog>
    `);
    previa();
  },
  (root, props, previos) => {
    if (props.productos !== previos.productos || props.iproducto !== previos.iproducto || props.tipo !== previos.tipo || props.error !== previos.error) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-movimiento-form', AvMovimientoForm);
