/** all.ts — barril de la vista `organizacion` → `dist/cdn/view/organizacion/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-empresa-form.js');
await import('./av-invitar-form.js');
await import('./av-miembros.js');
await import('./av-equipos.js');
await import('./av-organizacion.js');
