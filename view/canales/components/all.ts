/** all.ts — barril de la vista `canales` → `dist/cdn/view/canales/components/all.min.js`. La familia del chat va antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('../../../src/js/components/chat/all.js');
await import('./av-canal-form.js');
await import('./av-canales.js');
