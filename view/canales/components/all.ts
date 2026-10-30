/** all.ts — barril de la vista `canales` → `dist/cdn/view/canales/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-canal-lista.js');
await import('./av-mensaje.js');
await import('./av-redactor.js');
await import('./av-conversacion.js');
await import('./av-canal-form.js');
await import('./av-canales.js');
