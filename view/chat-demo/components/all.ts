/** all.ts — barril de la vista `chat-demo` → `dist/cdn/view/chat-demo/components/all.min.js`. La familia del chat va antes. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('../../../src/js/components/chat/all.js');
await import('./av-chat-demo.js');
