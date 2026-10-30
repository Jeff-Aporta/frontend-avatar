/** all.ts — barril de la vista `proyectos` → `dist/cdn/view/proyectos/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-tarea-form.js');
await import('./av-tarea-detalle.js');
await import('./av-tablero.js');
await import('./av-proyecto-form.js');
await import('./av-proyectos.js');
