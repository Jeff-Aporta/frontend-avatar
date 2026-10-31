/**
 * <av-producto-form> — diálogo de producto: datos de catálogo (nombre, categoría, marca, modelo, precio, costo, stock
 * mínimo, ubicación, proveedor, activo). El stock no se edita aquí: se muestra con su nivel y los atajos Entrada /
 * Salida, que dejan rastro en el kardex. Abajo, «Productos relacionados» (se oculta si no hay). Sin
 * `avatar.inventario` queda de solo lectura. Emite `av-producto-guardar { datos }`, `av-producto-mover { iproducto,
 * tipo }`, `av-inventario-abrir { entidad: 'productos', id }`, `av-producto-form-error { mensaje }` y
 * `av-producto-form-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { leerCampos, oNulo, oNumero } from '../../../src/js/base/campos.js';
import { type AvProductoFormProps, ProductoDatosSchema } from '../../../src/js/consts/schemas/inventario.schemas.js';
import { colorDe, ETIQUETA, formatoPrecio, nivelStock } from '../utils/inventario.js';

type DialogoEl = HTMLElement & { open: boolean };
type Interruptor = HTMLElement & { checked: boolean };

const AvProductoForm = crearComponente<AvProductoFormProps>(
  import.meta.url,
  'av-producto-form',
  { abierto: false, producto: null, proveedores: [], relacionados: [], puedeEscribir: false, ocupado: false, error: '' },
  (root, props, host) => {
    const p = props.producto;
    const ro = !props.puedeEscribir;
    const cerrar = () => emitir(host, 'av-producto-form-cerrar', {});
    const guardar = () => {
      const v = leerCampos(root);
      const r = ProductoDatosSchema.safeParse({
        iproducto: p?.iproducto ?? null,
        nombre: v['nombre'] ?? '',
        categoria: oNulo(v['categoria']),
        marca: oNulo(v['marca']),
        modelo: oNulo(v['modelo']),
        precio: oNumero(v['precio']) ?? 0,
        costo: oNumero(v['costo']) ?? 0,
        stock_minimo: oNumero(v['stock_minimo']) ?? 0,
        ubicacion: oNulo(v['ubicacion']),
        iproveedor: oNumero(v['iproveedor']),
        bactivo: (root.querySelector('#bactivo') as Interruptor | null)?.checked ?? true,
      });
      if (!r.success) {
        emitir(host, 'av-producto-form-error', { mensaje: 'Revisa el nombre, los precios (no negativos) y el stock mínimo (entero)' });
        return;
      }
      emitir(host, 'av-producto-guardar', { datos: r.data });
    };
    const nivel = p ? nivelStock(p) : null;
    root.append(html`
      <iswc-dialog id="dialogo" label=${p ? p.nombre : 'Nuevo producto'} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          ${p && nivel ? html`
            <div class="stock" part="stock" data-nivel=${nivel}>
              <div class="cifra"><span class="rotulo">Stock</span><strong>${p.stock}</strong><iswc-tag color=${colorDe(nivel)} pill>${ETIQUETA[nivel]} · mín ${p.stock_minimo}</iswc-tag></div>
              ${ro ? null : html`<div class="mover">
                <iswc-button size="small" variant="soft" color="success" oniswc-click=${() => emitir(host, 'av-producto-mover', { iproducto: p.iproducto, tipo: 'entrada' })}><iswc-icon slot="start" icon="mdi:tray-arrow-down"></iswc-icon>Entrada</iswc-button>
                <iswc-button size="small" variant="soft" color="danger" ?disabled=${p.stock <= 0} oniswc-click=${() => emitir(host, 'av-producto-mover', { iproducto: p.iproducto, tipo: 'salida' })}><iswc-icon slot="start" icon="mdi:tray-arrow-up"></iswc-icon>Salida</iswc-button>
                <iswc-button size="small" variant="outlined" color="neutral" oniswc-click=${() => emitir(host, 'av-producto-mover', { iproducto: p.iproducto, tipo: 'ajuste' })}><iswc-icon slot="start" icon="mdi:counter"></iswc-icon>Ajuste</iswc-button>
              </div>`}
              ${p.sku ? html`<span class="sku">${p.sku}</span>` : null}
            </div>` : null}
          <iswc-input name="nombre" label="Nombre" required maxlength="160" ?readonly=${ro} value=${p?.nombre ?? ''}></iswc-input>
          <div class="fila">
            <iswc-input name="categoria" label="Categoría" maxlength="80" ?readonly=${ro} value=${p?.categoria ?? ''}></iswc-input>
            <iswc-input name="marca" label="Marca" maxlength="80" ?readonly=${ro} value=${p?.marca ?? ''}></iswc-input>
            <iswc-input name="modelo" label="Modelo" maxlength="80" ?readonly=${ro} value=${p?.modelo ?? ''}></iswc-input>
          </div>
          <div class="fila">
            <iswc-input name="precio" type="number" min="0" step="any" label="Precio de venta" prefix="$" ?readonly=${ro} value=${String(p?.precio ?? 0)}></iswc-input>
            <iswc-input name="costo" type="number" min="0" step="any" label="Costo" prefix="$" ?readonly=${ro} value=${String(p?.costo ?? 0)}></iswc-input>
            <iswc-input name="stock_minimo" type="number" min="0" step="1" label="Stock mínimo" ?readonly=${ro} value=${String(p?.stock_minimo ?? 0)}></iswc-input>
          </div>
          <div class="fila dos">
            <iswc-input name="ubicacion" label="Ubicación" placeholder="A1-B2" maxlength="40" ?readonly=${ro} value=${p?.ubicacion ?? ''}></iswc-input>
            <iswc-select name="iproveedor" label="Proveedor" clearable placeholder="Sin proveedor" ?disabled=${ro} value=${p?.iproveedor ? String(p.iproveedor) : ''}>
              ${props.proveedores.map((x) => html`<iswc-option value=${String(x.iproveedor)}>${x.nombre}</iswc-option>`)}
            </iswc-select>
          </div>
          <iswc-switch id="bactivo" ?checked=${p ? p.bactivo !== false : true} ?disabled=${ro}>Activo en el catálogo</iswc-switch>
          ${p && p.precio != null && p.costo != null && Number(p.precio) > 0 ? html`<p class="margen">Margen: ${formatoPrecio(Number(p.precio) - Number(p.costo))} por unidad (${Math.round(((Number(p.precio) - Number(p.costo)) / Number(p.precio)) * 100)} %)</p>` : null}
          ${props.relacionados.length ? html`
            <section class="relacionados" part="relacionados" aria-label="Productos relacionados">
              <h3 class="rotulo"><iswc-icon icon="mdi:vector-link"></iswc-icon> Productos relacionados</h3>
              <div class="chips">${props.relacionados.map((r) => html`<iswc-button size="small" variant="outlined" color=${colorDe(nivelStock(r))} oniswc-click=${() => emitir(host, 'av-inventario-abrir', { entidad: 'productos', id: r.iproducto })}>${r.nombre}<span slot="end" class="r-stock">${r.stock}</span></iswc-button>`)}</div>
            </section>` : null}
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
          ${ro ? html`<iswc-callout color="brand">Solo quien tiene el permiso de inventario (avatar.inventario) modifica el catálogo o mueve stock.</iswc-callout>` : null}
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${cerrar}>${ro ? 'Cerrar' : 'Cancelar'}</iswc-button>
        ${ro ? null : html`<iswc-button slot="footer" color="brand" id="guardar" ?loading=${props.ocupado} oniswc-click=${guardar}>${p ? 'Guardar' : 'Crear producto'}</iswc-button>`}
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.producto !== previos.producto || props.proveedores !== previos.proveedores || props.relacionados !== previos.relacionados || props.error !== previos.error || props.puedeEscribir !== previos.puedeEscribir) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#guardar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-producto-form', AvProductoForm);
