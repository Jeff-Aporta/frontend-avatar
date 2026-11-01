/**
 * <av-embudo-grafica> — traduce los clientes del resumen a barras por etapa en `av-grafica`, con el valor del pipeline
 * en la cabecera.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvGraficaProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { AvEmbudoGraficaProps } from '../../../src/js/consts/schemas/panel.schemas.js';
import '../../../src/js/components/av/av-grafica.js';
import { moneda, serieEmbudo } from '../utils/panel.js';

type Grafica = HTMLElement & { props: Partial<AvGraficaProps> };

const tarjeta = ({ clientes: c }: AvEmbudoGraficaProps): Partial<AvGraficaProps> => {
  const serie = c ? serieEmbudo(c) : null;
  return {
    tipo: 'barras',
    titulo: 'Embudo CRM',
    icono: 'mdi:filter-variant',
    etiqueta: 'Clientes por etapa',
    leyenda: false,
    cargando: !c,
    config: serie && c && c.total > 0 ? { data: { labels: serie.labels, datasets: [{ label: 'Clientes', data: serie.data }] }, options: { plugins: { legend: { display: false } } } } : null,
    vacio: { icono: 'mdi:account-heart-outline', titulo: 'Sin clientes', texto: 'Registra clientes en el CRM para ver el embudo.' },
  };
};

const AvEmbudoGrafica = crearComponente<AvEmbudoGraficaProps>(import.meta.url, 'av-embudo-grafica', { clientes: null }, (root, props) => {
  root.append(html`<av-grafica>${props.clientes ? html`<iswc-tag slot="acciones" color="success">${moneda(props.clientes.valor_pipeline)}</iswc-tag>` : null}</av-grafica>`);
  (root.querySelector('av-grafica') as Grafica).props = tarjeta(props);
});

define('av-embudo-grafica', AvEmbudoGrafica);
