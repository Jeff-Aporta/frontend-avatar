/**
 * <av-rrhh-grafica> — dos tarjetas: dona de la asistencia de hoy (presentes, retardos, ausentes, vacaciones, sin
 * marcar) y barras de la plantilla por departamento. Un refresco solo reasigna `config` a las gráficas.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvRrhhGraficaProps } from '../../../src/js/consts/schemas/rrhh.schemas.js';
import { serieAsistenciaHoy, seriePorDepartamento } from '../utils/rrhh.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Grafica = HTMLElement & { config: unknown };

const AvRrhhGrafica = crearComponente<AvRrhhGraficaProps>(
  import.meta.url,
  'av-rrhh-grafica',
  { resumen: null, departamentos: [] },
  (root, props) => {
    const asis = props.resumen ? serieAsistenciaHoy(props.resumen) : null;
    const deps = seriePorDepartamento(props.departamentos);
    root.append(html`
      <div class="rejilla" part="rejilla">
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:chart-donut"></iswc-icon> Asistencia de hoy</strong>
          ${asis ? html`<iswc-doughnut-chart id="asistencia" class="grafica" label="Asistencia de hoy por estado" legend-position="bottom"></iswc-doughnut-chart>` : html`<av-vacio class="vacio" data-cual="asistencia"></av-vacio>`}
        </iswc-card>
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:office-building-outline"></iswc-icon> Plantilla por departamento</strong>
          ${deps ? html`<iswc-bar-chart id="departamentos" class="grafica" label="Personas por departamento" legend-position="bottom"></iswc-bar-chart>` : html`<av-vacio class="vacio" data-cual="departamentos"></av-vacio>`}
        </iswc-card>
      </div>
    `);
    if (asis) (root.querySelector('#asistencia') as Grafica).config = asis;
    if (deps) (root.querySelector('#departamentos') as Grafica).config = deps;
    for (const v of root.querySelectorAll<ConProps>('.vacio')) {
      v.props = !props.resumen ? { estado: 'cargando' } : v.dataset.cual === 'asistencia' ? { icono: 'mdi:calendar-blank-outline', titulo: 'Sin datos de hoy', texto: 'Marca la asistencia para verla aquí.' } : { icono: 'mdi:account-group-outline', titulo: 'Sin plantilla', texto: 'Registra empleados con su departamento.' };
    }
  },
  (root, props) => {
    const asis = props.resumen ? serieAsistenciaHoy(props.resumen) : null;
    const deps = seriePorDepartamento(props.departamentos);
    const ga = root.querySelector('#asistencia') as Grafica | null;
    const gd = root.querySelector('#departamentos') as Grafica | null;
    if (!props.resumen || !!ga !== !!asis || !!gd !== !!deps) return false;
    if (ga && asis) ga.config = asis;
    if (gd && deps) gd.config = deps;
    return true;
  },
);

define('av-rrhh-grafica', AvRrhhGrafica);
