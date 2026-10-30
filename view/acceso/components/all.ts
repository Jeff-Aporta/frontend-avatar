/** all.ts — barril de la vista `acceso` → `dist/cdn/view/acceso/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-credenciales-demo.js');
await import('./av-acceso.js');
