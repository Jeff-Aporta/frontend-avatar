/** all.ts — barril de la vista `inventario` → `dist/cdn/view/inventario/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-stock-alertas.js');
await import('./av-inventario-tabla.js');
await import('./av-producto-form.js');
await import('./av-movimiento-form.js');
await import('./av-pedido-form.js');
await import('./av-proveedor-form.js');
await import('./av-inventario.js');
