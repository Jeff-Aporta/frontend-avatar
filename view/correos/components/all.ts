/** all.ts — barril de la vista `correos` → `dist/cdn/view/correos/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-correo-carpetas.js');
await import('./av-correo-lista.js');
await import('./av-correo-lector.js');
await import('./av-correo-redactar.js');
await import('./av-correos.js');
