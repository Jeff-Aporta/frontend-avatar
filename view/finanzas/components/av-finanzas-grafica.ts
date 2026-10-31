/**
 * <av-finanzas-grafica> — dos tarjetas: barras del mes anterior vs el actual (ingresos, gastos, beneficio) y dona de
 * gastos del mes por categoría. Con `resumen: null` muestra cargando; un refresco solo reasigna `config` a las gráficas.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvFinanzasGraficaProps } from '../../../src/js/consts/schemas/finanzas.schemas.js';
import { nombreMes, serieCategorias, serieComparativa } from '../utils/finanzas.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Grafica = HTMLElement & { config: unknown };

const AvFinanzasGrafica = crearComponente<AvFinanzasGraficaProps>(
  import.meta.url,
  'av-finanzas-grafica',
  { resumen: null },
  (root, props) => {
    const r = props.resumen;
    const categorias = r ? serieCategorias(r) : null;
    root.append(html`
      <div class="rejilla" part="rejilla">
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:chart-bar"></iswc-icon> Mes contra mes <span class="mes">${r ? nombreMes(r.mes) : ''}</span></strong>
          ${r ? html`<iswc-bar-chart id="barras" class="grafica" label="Ingresos, gastos y beneficio: mes anterior contra el actual" legend-position="bottom"></iswc-bar-chart>` : html`<av-vacio class="vacio"></av-vacio>`}
        </iswc-card>
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:chart-donut"></iswc-icon> Gastos por categoría</strong>
          ${categorias ? html`<iswc-doughnut-chart id="dona" class="grafica" label="Gastos del mes por categoría" legend-position="bottom"></iswc-doughnut-chart>` : html`<av-vacio class="vacio"></av-vacio>`}
        </iswc-card>
      </div>
    `);
    if (r) (root.querySelector('#barras') as Grafica).config = serieComparativa(r);
    if (categorias) (root.querySelector('#dona') as Grafica).config = categorias;
    for (const v of root.querySelectorAll<ConProps>('.vacio')) v.props = r ? { icono: 'mdi:chart-donut', titulo: 'Sin gastos este mes', texto: 'Cuando registres gastos verás aquí su reparto.' } : { estado: 'cargando' };
  },
  (root, props, previos) => {
    const r = props.resumen;
    const barras = root.querySelector('#barras') as Grafica | null;
    const dona = root.querySelector('#dona') as Grafica | null;
    const categorias = r ? serieCategorias(r) : null;
    if (!r || !previos.resumen || !barras || !!dona !== !!categorias || r.mes !== previos.resumen.mes) return false;
    barras.config = serieComparativa(r);
    if (dona && categorias) dona.config = categorias;
    return true;
  },
);

define('av-finanzas-grafica', AvFinanzasGrafica);
