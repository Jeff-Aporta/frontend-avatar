/**
 * <av-stock-alertas> — franja de alertas de stock (agotados primero): cada producto en o bajo su mínimo como una
 * tarjeta con su stock, el mínimo, la ubicación y «Reponer» (solo con permiso). Sin alertas, una confirmación verde.
 * Emite `av-inventario-abrir { entidad: 'productos', id }` y `av-producto-mover { iproducto, tipo: 'entrada' }`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvStockAlertasProps } from '../../../src/js/consts/schemas/inventario.schemas.js';

const AvStockAlertas = crearComponente<AvStockAlertasProps>(import.meta.url, 'av-stock-alertas', { alertas: null, puedeMover: false }, (root, props, host) => {
  const a = props.alertas;
  if (!a) {
    root.append(html`<div class="franja" part="franja" aria-busy="true">${[1, 2, 3].map(() => html`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);
    return;
  }
  if (!a.length) {
    root.append(html`<iswc-callout color="success" class="ok"><strong>Stock en orden.</strong> Ningún producto está en o bajo su mínimo.</iswc-callout>`);
    return;
  }
  root.append(html`
    <section class="alertas" part="alertas" aria-label="Alertas de stock">
      <h2 class="rotulo"><iswc-icon icon="mdi:alert-decagram-outline"></iswc-icon> Alertas de stock <iswc-badge color="danger" pill>${a.length}</iswc-badge></h2>
      <div class="franja" part="franja">
        ${a.map((p) => html`
          <article class="alerta" part="alerta" data-agotado=${p.agotado ? 'si' : 'no'}>
            <div class="cabeza">
              <iswc-tag color=${p.agotado ? 'danger' : 'warning'} pill>${p.agotado ? 'Agotado' : 'Bajo mínimo'}</iswc-tag>
              <span class="sku">${p.sku}</span>
            </div>
            <iswc-button class="nombre" variant="text" color="neutral" oniswc-click=${() => emitir(host, 'av-inventario-abrir', { entidad: 'productos', id: p.iproducto })}>${p.nombre}</iswc-button>
            <div class="cifras"><strong class="stock">${p.stock}</strong><span>/ mín ${p.stock_minimo}</span>${p.ubicacion ? html`<span class="ubicacion"><iswc-icon icon="mdi:map-marker-outline"></iswc-icon>${p.ubicacion}</span>` : null}</div>
            ${props.puedeMover ? html`<iswc-button class="reponer" size="small" variant="soft" color=${p.agotado ? 'danger' : 'warning'} oniswc-click=${() => emitir(host, 'av-producto-mover', { iproducto: p.iproducto, tipo: 'entrada' })}><iswc-icon slot="start" icon="mdi:tray-arrow-down"></iswc-icon>Reponer</iswc-button>` : null}
          </article>
        `)}
      </div>
    </section>
  `);
});

define('av-stock-alertas', AvStockAlertas);
