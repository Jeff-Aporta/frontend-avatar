/**
 * <av-finanzas-grafica> — traduce el resumen del mes a dos `av-grafica`: barras del mes anterior contra el actual y dona
 * de gastos por categoría. Con `resumen: null` ambas muestran carga.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvGraficaProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { AvFinanzasGraficaProps } from '../../../src/js/consts/schemas/finanzas.schemas.js';
import '../../../src/js/components/av/av-grafica.js';
import { nombreMes, serieCategorias, serieComparativa } from '../utils/finanzas.js';

type Grafica = HTMLElement & { props: Partial<AvGraficaProps> };

const barras = ({ resumen: r }: AvFinanzasGraficaProps): Partial<AvGraficaProps> => ({
  tipo: 'barras',
  titulo: 'Mes contra mes',
  icono: 'mdi:chart-bar',
  detalle: r ? nombreMes(r.mes) : '',
  etiqueta: 'Ingresos, gastos y beneficio: mes anterior contra el actual',
  cargando: !r,
  config: r ? serieComparativa(r) : null,
});

const dona = ({ resumen: r }: AvFinanzasGraficaProps): Partial<AvGraficaProps> => ({
  tipo: 'dona',
  titulo: 'Gastos por categoría',
  icono: 'mdi:chart-donut',
  etiqueta: 'Gastos del mes por categoría',
  cargando: !r,
  config: r ? serieCategorias(r) : null,
  vacio: { icono: 'mdi:chart-donut', titulo: 'Sin gastos este mes', texto: 'Cuando registres gastos verás aquí su reparto.' },
});

function asignar(root: ShadowRoot, props: AvFinanzasGraficaProps): boolean {
  const [a, b] = root.querySelectorAll<Grafica>('av-grafica');
  if (!a || !b) return false;
  a.props = barras(props);
  b.props = dona(props);
  return true;
}

const AvFinanzasGrafica = crearComponente<AvFinanzasGraficaProps>(
  import.meta.url,
  'av-finanzas-grafica',
  { resumen: null },
  (root, props) => {
    root.append(html`<div class="rejilla" part="rejilla"><av-grafica></av-grafica><av-grafica></av-grafica></div>`);
    asignar(root, props);
  },
  (root, props) => asignar(root, props),
);

define('av-finanzas-grafica', AvFinanzasGrafica);
