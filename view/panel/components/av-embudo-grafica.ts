/**
 * <av-embudo-grafica> — barras del CRM por etapa (`iswc-bar-chart`) con el valor del pipeline en la cabecera.
 */
import { crearComponente, define, html, raw } from '../../../src/js/base/componente.js';
import type { AvEmbudoGraficaProps } from '../../../src/js/consts/schemas/panel.schemas.js';
import { moneda, serieEmbudo } from '../utils/panel.js';

const AvEmbudoGrafica = crearComponente<AvEmbudoGraficaProps>(import.meta.url, 'av-embudo-grafica', { clientes: null }, (root, props) => {
  const c = props.clientes;
  const config = c ? { data: { labels: serieEmbudo(c).labels, datasets: [{ label: 'Clientes', data: serieEmbudo(c).data }] }, options: { plugins: { legend: { display: false } } } } : null;
  root.append(html`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:filter-variant"></iswc-icon> Embudo CRM</strong>
      ${c ? html`<iswc-tag slot="header-actions" color="success">${moneda(c.valor_pipeline)}</iswc-tag>` : null}
      ${config && c && c.total > 0
        ? html`<iswc-bar-chart class="grafica" part="grafica" label="Clientes por etapa" without-legend>${raw(`<script type="application/json">${JSON.stringify(config).replace(/</g, '\\u003c')}</script>`)}</iswc-bar-chart>`
        : html`<av-vacio class="vacio"></av-vacio>`}
    </iswc-card>
  `);
  const vacio = root.querySelector('av-vacio') as (HTMLElement & { props: Record<string, unknown> }) | null;
  if (vacio) vacio.props = c ? { icono: 'mdi:account-heart-outline', titulo: 'Sin clientes', texto: 'Registra clientes en el CRM para ver el embudo.' } : { estado: 'cargando' };
});

define('av-embudo-grafica', AvEmbudoGrafica);
