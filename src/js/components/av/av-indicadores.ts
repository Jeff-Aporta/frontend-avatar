/**
 * <av-indicadores> — fila de KPIs de una vista (`iswc-stat` dentro de `iswc-grid-layout`, rejilla que se acomoda al
 * ancho). Con `items: null` pinta esqueletos. Un refresco con los mismos indicadores (mismos `id` en el mismo orden)
 * solo actualiza los atributos: no repinta ni parpadea.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvIndicadoresProps, Indicador } from '../../consts/schemas/componentes.schemas.js';

/** Atributos de un `iswc-stat` para un indicador. */
function atributos(k: Indicador): Record<string, string> {
  return { label: k.label, value: k.value, helper: k.helper, icon: k.icon, color: k.color, trend: k.trend, 'trend-direction': k.trendDirection };
}

function aplicar(el: Element, k: Indicador): void {
  for (const [n, v] of Object.entries(atributos(k))) {
    if (!v) el.removeAttribute(n);
    else if (el.getAttribute(n) !== v) el.setAttribute(n, v);
  }
}

const AvIndicadores = crearComponente<AvIndicadoresProps>(
  import.meta.url,
  'av-indicadores',
  { items: null, esqueletos: 4 },
  (root, props) => {
    const celdas = 'repeat(auto-fit, minmax(min(100%, 9.5em), 1fr))';
    if (!props.items) {
      root.append(html`<iswc-grid-layout class="rejilla" part="rejilla" cells=${celdas} aria-busy="true">${Array.from({ length: props.esqueletos }, () => html`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</iswc-grid-layout>`);
      return;
    }
    root.append(html`<iswc-grid-layout class="rejilla" part="rejilla" cells=${celdas}>${props.items.map((k) => html`<iswc-stat class="kpi" part="kpi" data-id=${k.id}></iswc-stat>`)}</iswc-grid-layout>`);
    const stats = root.querySelectorAll('.kpi');
    props.items.forEach((k, i) => aplicar(stats[i]!, k));
  },
  (root, props) => {
    if (!props.items) return false;
    const stats = [...root.querySelectorAll<HTMLElement>('.kpi')];
    if (stats.length !== props.items.length || stats.some((s, i) => s.dataset.id !== props.items![i]!.id)) return false;
    props.items.forEach((k, i) => aplicar(stats[i]!, k));
    return true;
  },
);

define('av-indicadores', AvIndicadores);
