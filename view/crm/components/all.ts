/** all.ts — barril de la vista `crm` → `dist/cdn/view/crm/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-embudo.js');
await import('./av-clientes-grid.js');
await import('./av-cliente-form.js');
await import('./av-crm.js');
