/**
 * <av-kpis> — traduce el resumen de la empresa a `iswc-stat-group`: seis cifras, con esqueletos mientras no hay datos.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvKpisProps } from '../../../src/js/consts/schemas/panel.schemas.js';
import { kpis } from '../utils/panel.js';

type Grupo = HTMLElement & { props: Record<string, unknown> };

const AvKpis = crearComponente<AvKpisProps>(
  import.meta.url,
  'av-kpis',
  { resumen: null },
  (root, props) => {
    root.append(html`<iswc-stat-group part="grupo" esqueletos="6"></iswc-stat-group>`);
    (root.querySelector('iswc-stat-group') as Grupo).props = { items: props.resumen ? kpis(props.resumen) : null };
  },
  (root, props) => {
    const grupo = root.querySelector('iswc-stat-group') as Grupo | null;
    if (!grupo) return false;
    grupo.props = { items: props.resumen ? kpis(props.resumen) : null };
    return true;
  },
);

define('av-kpis', AvKpis);
