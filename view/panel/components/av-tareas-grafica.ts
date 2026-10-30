/**
 * <av-tareas-grafica> — dona de tareas por estado (`iswc-doughnut-chart`) dentro de una tarjeta.
 */
import { crearComponente, define, html, raw } from '../../../src/js/base/componente.js';
import type { AvTareasGraficaProps } from '../../../src/js/consts/schemas/panel.schemas.js';
import { serieTareas } from '../utils/panel.js';

const AvTareasGrafica = crearComponente<AvTareasGraficaProps>(import.meta.url, 'av-tareas-grafica', { tareas: null }, (root, props) => {
  const t = props.tareas;
  const config = t ? { data: { labels: serieTareas(t).labels, datasets: [{ label: 'Tareas', data: serieTareas(t).data }] } } : null;
  root.append(html`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:chart-donut"></iswc-icon> Tareas por estado</strong>
      ${config && t && t.total > 0
        ? html`<iswc-doughnut-chart class="grafica" part="grafica" label="Tareas por estado" legend-position="bottom">${raw(`<script type="application/json">${JSON.stringify(config).replace(/</g, '\\u003c')}</script>`)}</iswc-doughnut-chart>`
        : html`<av-vacio class="vacio"></av-vacio>`}
    </iswc-card>
  `);
  const vacio = root.querySelector('av-vacio') as (HTMLElement & { props: Record<string, unknown> }) | null;
  if (vacio) vacio.props = t ? { icono: 'mdi:checkbox-blank-circle-outline', titulo: 'Sin tareas', texto: 'Cuando el equipo cree tareas aparecerán aquí por estado.' } : { estado: 'cargando' };
});

define('av-tareas-grafica', AvTareasGrafica);
