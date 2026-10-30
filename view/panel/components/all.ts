/** all.ts — barril de la vista `panel` → `dist/cdn/view/panel/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-kpis.js');
await import('./av-tareas-grafica.js');
await import('./av-embudo-grafica.js');
await import('./av-notificaciones.js');
await import('./av-panel.js');
