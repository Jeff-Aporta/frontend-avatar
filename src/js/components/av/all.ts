/**
 * all.ts — barril de compatibilidad → `dist/cdn/all.min.js` (todos los componentes en un módulo).
 * La carga normal es el registrador (`avLoader.min.js`); este bundle es para hosts que quieren un solo <script>.
 * Fija la raíz de hojas: cada tag busca su CSS en su carpeta (kit-tags). Hijos antes que shells; el shell de la app al final.
 */
import { setCssBase } from '../../base/componente.js';

setCssBase(new URL('./', import.meta.url).href);

await import('./av-logo.js');
await import('./av-escena.js');
await import('../../../../view/inicio/components/all.js');
await import('../../../../view/acceso/components/all.js');
await import('../../../../view/panel/components/all.js');
await import('../chat/all.js');
await import('../../../../view/canales/components/all.js');
await import('../../../../view/chat-demo/components/all.js');
await import('../../../../view/proyectos/components/all.js');
await import('../../../../view/crm/components/all.js');
await import('../../../../view/organizacion/components/all.js');
await import('../../../../view/asistente/components/all.js');
await import('../../../../view/admin/components/all.js');
await import('../../../../view/correos/components/all.js');
await import('../../../../view/finanzas/components/all.js');
await import('../../../../view/inventario/components/all.js');
await import('../../../../view/rrhh/components/all.js');
await import('./av-app.js');
