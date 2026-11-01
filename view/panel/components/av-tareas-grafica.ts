/**
 * <av-tareas-grafica> — traduce las tareas del resumen a una dona en `av-grafica`.
 */
import { crearComponente, define, el } from '../../../src/js/base/componente.js';
import type { AvGraficaProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { AvTareasGraficaProps } from '../../../src/js/consts/schemas/panel.schemas.js';
import '../../../src/js/components/av/av-grafica.js';
import { serieTareas } from '../utils/panel.js';

type Grafica = HTMLElement & { props: Partial<AvGraficaProps> };

const tarjeta = ({ tareas: t }: AvTareasGraficaProps): Partial<AvGraficaProps> => {
  const serie = t ? serieTareas(t) : null;
  return {
    tipo: 'dona',
    titulo: 'Tareas por estado',
    icono: 'mdi:chart-donut',
    cargando: !t,
    config: serie && t && t.total > 0 ? { data: { labels: serie.labels, datasets: [{ label: 'Tareas', data: serie.data }] } } : null,
    vacio: { icono: 'mdi:checkbox-blank-circle-outline', titulo: 'Sin tareas', texto: 'Cuando el equipo cree tareas aparecerán aquí por estado.' },
  };
};

const AvTareasGrafica = crearComponente<AvTareasGraficaProps>(
  import.meta.url,
  'av-tareas-grafica',
  { tareas: null },
  (root, props) => {
    const grafica = el('av-grafica') as Grafica;
    root.append(grafica);
    grafica.props = tarjeta(props);
  },
  (root, props) => {
    const grafica = root.querySelector('av-grafica') as Grafica | null;
    if (!grafica) return false;
    grafica.props = tarjeta(props);
    return true;
  },
);

define('av-tareas-grafica', AvTareasGrafica);
