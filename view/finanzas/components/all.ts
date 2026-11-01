/** all.ts — barril de la vista `finanzas` → `dist/cdn/view/finanzas/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-finanzas-grafica.js');
await import('./av-conversor.js');
await import('./av-finanzas-hoja.js');
await import('./av-transaccion-form.js');
await import('./av-factura-form.js');
await import('./av-finanzas.js');
