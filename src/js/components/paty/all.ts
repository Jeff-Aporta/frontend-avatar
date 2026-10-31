/**
 * all.ts — barril de los componentes de PatyIA en auditoría → `dist/cdn/js/components/paty/all.min.js`.
 */
import { setCssBase } from '../../base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-paty-cargando.js');
await import('./av-paty-process.js');
await import('./av-paty-traza.js');
await import('./av-paty-pagination.js');
await import('./av-paty-chat-bubble.js');
await import('./av-paty-json-dialog.js');
