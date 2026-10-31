/**
 * all.ts — barril de la familia del chat → `dist/cdn/js/components/chat/all.min.js` (un solo módulo para hosts que no
 * usan el registrador). Hijos antes que el shell `av-chat`. La carga normal es perezosa: la pide la vista que la usa.
 */
import { setCssBase } from '../../base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-chat-item.js');
await import('./av-chat-reacciones.js');
await import('./av-chat-adjunto.js');
await import('./av-chat-audio.js');
await import('./av-chat-burbuja.js');
await import('./av-chat-emojis.js');
await import('./av-chat-lista.js');
await import('./av-chat-cabecera.js');
await import('./av-chat-mensajes.js');
await import('./av-chat-compositor.js');
await import('./av-chat-visor.js');
await import('./av-chat-busqueda.js');
await import('./av-chat-nuevo.js');
await import('./av-chat-grupo-form.js');
await import('./av-chat-info.js');
await import('./av-chat-reenviar.js');
await import('./av-chat-llamada.js');
await import('./av-chat.js');
