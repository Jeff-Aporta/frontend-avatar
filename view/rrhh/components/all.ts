/** all.ts — barril de la vista `rrhh` → `dist/cdn/view/rrhh/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-rrhh-grafica.js');
await import('./av-asistencia-dia.js');
await import('./av-solicitudes.js');
await import('./av-empleado-form.js');
await import('./av-solicitud-form.js');
await import('./av-rrhh.js');
