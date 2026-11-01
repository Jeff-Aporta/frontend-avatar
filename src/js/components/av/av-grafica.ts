/**
 * <av-grafica> — tarjeta con título, ícono y una gráfica del kit; sin datos pinta el estado vacío o el de carga.
 * Un refresco con la misma forma solo reasigna `config`, sin rehacer la gráfica. Traducir los datos del dominio a
 * `config` es trabajo del componente de la vista.
 *
 * Los tags de las gráficas no se nombran en la plantilla: la vista que usa `av-grafica` los declara en VIEW_KIT_TAGS, así
 * el transversal no obliga a cargar gráficas en todas las vistas.
 */
import { crearComponente, define, el, html } from '../../base/componente.js';
import type { AvGraficaProps } from '../../consts/schemas/componentes.schemas.js';

type Grafica = HTMLElement & { config: unknown };

const TAGS = { barras: 'iswc-bar-chart', dona: 'iswc-doughnut-chart' } as const;

function lienzo(props: AvGraficaProps): HTMLElement {
  const leyenda = props.leyenda ? { 'legend-position': 'bottom' } : { 'without-legend': true };
  // Sin `label`: el kit lo pintaría como segundo título debajo del de la tarjeta.
  return el(TAGS[props.tipo], { class: 'grafica', part: 'grafica', role: 'img', 'aria-label': props.etiqueta || props.titulo, ...leyenda });
}

const AvGrafica = crearComponente<AvGraficaProps>(
  import.meta.url,
  'av-grafica',
  { tipo: 'barras', titulo: '', icono: 'mdi:chart-bar', detalle: '', etiqueta: '', leyenda: true, config: null, cargando: false, vacio: { icono: 'mdi:chart-bar', titulo: 'Sin datos', texto: '' } },
  (root, props) => {
    const grafica = props.config ? lienzo(props) : null;
    root.append(html`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header" class="titulo"><iswc-icon icon=${props.icono}></iswc-icon> ${props.titulo}${props.detalle ? html`<span class="detalle">${props.detalle}</span>` : null}</strong>
        <slot name="acciones" slot="header-actions"></slot>
        ${grafica
          ?? (props.cargando
            ? html`<iswc-empty-state class="vacio" estado="cargando"></iswc-empty-state>`
            : html`<iswc-empty-state class="vacio" icono=${props.vacio.icono} titulo=${props.vacio.titulo} texto=${props.vacio.texto}></iswc-empty-state>`)}
      </iswc-card>
    `);
    if (grafica) (grafica as Grafica).config = props.config;
  },
  (root, props, previos) => {
    const grafica = root.querySelector('.grafica') as Grafica | null;
    const misma = props.tipo === previos.tipo && props.titulo === previos.titulo && props.detalle === previos.detalle && props.leyenda === previos.leyenda;
    if (!grafica || !props.config || !misma) return false;
    grafica.config = props.config;
    return true;
  },
);

define('av-grafica', AvGrafica);
