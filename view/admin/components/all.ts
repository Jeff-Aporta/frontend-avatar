/** all.ts — barril de la vista `admin` → `dist/cdn/view/admin/components/all.min.js`. Hijos antes que el shell. */
import { setCssBase } from '../../../src/js/base/componente.js';

setCssBase(new URL('../../../', import.meta.url).href);

await import('./av-usuario-form.js');
await import('./av-usuarios.js');
await import('./av-roles.js');
await import('./av-admin.js');
