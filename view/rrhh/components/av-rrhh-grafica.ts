/**
 * <av-rrhh-grafica> — traduce el resumen a dos `av-grafica`: dona de la asistencia de hoy y barras de la plantilla por
 * departamento.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvGraficaProps } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { AvRrhhGraficaProps } from '../../../src/js/consts/schemas/rrhh.schemas.js';
import '../../../src/js/components/av/av-grafica.js';
import { serieAsistenciaHoy, seriePorDepartamento } from '../utils/rrhh.js';

type Grafica = HTMLElement & { props: Partial<AvGraficaProps> };

const asistencia = ({ resumen: r }: AvRrhhGraficaProps): Partial<AvGraficaProps> => ({
  tipo: 'dona',
  titulo: 'Asistencia de hoy',
  icono: 'mdi:chart-donut',
  etiqueta: 'Asistencia de hoy por estado',
  cargando: !r,
  config: r ? serieAsistenciaHoy(r) : null,
  vacio: { icono: 'mdi:calendar-blank-outline', titulo: 'Sin datos de hoy', texto: 'Marca la asistencia para verla aquí.' },
});

const plantilla = ({ resumen: r, departamentos }: AvRrhhGraficaProps): Partial<AvGraficaProps> => ({
  tipo: 'barras',
  titulo: 'Plantilla por departamento',
  icono: 'mdi:office-building-outline',
  etiqueta: 'Personas por departamento',
  cargando: !r,
  config: seriePorDepartamento(departamentos),
  vacio: { icono: 'mdi:account-group-outline', titulo: 'Sin plantilla', texto: 'Registra empleados con su departamento.' },
});

function asignar(root: ShadowRoot, props: AvRrhhGraficaProps): boolean {
  const [a, b] = root.querySelectorAll<Grafica>('av-grafica');
  if (!a || !b) return false;
  a.props = asistencia(props);
  b.props = plantilla(props);
  return true;
}

const AvRrhhGrafica = crearComponente<AvRrhhGraficaProps>(
  import.meta.url,
  'av-rrhh-grafica',
  { resumen: null, departamentos: [] },
  (root, props) => {
    root.append(html`<div class="rejilla" part="rejilla"><av-grafica></av-grafica><av-grafica></av-grafica></div>`);
    asignar(root, props);
  },
  (root, props) => asignar(root, props),
);

define('av-rrhh-grafica', AvRrhhGrafica);
