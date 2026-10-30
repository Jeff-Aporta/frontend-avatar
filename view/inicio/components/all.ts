/** all.ts — barril de la vista `inicio` → `dist/cdn/view/inicio/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-hero.js');
await import('./av-comunidad.js');
await import('./av-caracteristicas.js');
await import('./av-precios.js');
await import('./av-abierto.js');
await import('./av-inicio.js');
