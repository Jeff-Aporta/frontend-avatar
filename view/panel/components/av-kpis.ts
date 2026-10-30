/**
 * <av-kpis> — rejilla de tarjetas KPI (`iswc-stat`) a partir del resumen de la empresa; esqueletos mientras no hay datos.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvKpisProps } from '../../../src/js/consts/schemas/panel.schemas.js';
import { kpis } from '../utils/panel.js';

const AvKpis = crearComponente<AvKpisProps>(import.meta.url, 'av-kpis', { resumen: null }, (root, props) => {
  if (!props.resumen) {
    root.append(html`<div class="rejilla" part="rejilla" aria-busy="true">${[1, 2, 3, 4, 5, 6].map(() => html`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);
    return;
  }
  root.append(html`
    <div class="rejilla" part="rejilla">
      ${kpis(props.resumen).map((k) => html`<iswc-stat class="kpi" data-id=${k.id} label=${k.label} value=${k.value} helper=${k.helper} icon=${k.icon} color=${k.color}></iswc-stat>`)}
    </div>
  `);
});

define('av-kpis', AvKpis);
