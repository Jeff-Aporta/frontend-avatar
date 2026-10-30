/** all.ts — barril de la vista `asistente` → `dist/cdn/view/asistente/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-avo-mensaje.js');
await import('./av-asistente.js');
