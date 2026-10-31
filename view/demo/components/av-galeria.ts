/**
 * Explorador de demos de Avatar: el mismo `<iswc-doc-demo>` del índice del kit, alimentado con `view/demo/manifest.json`
 * ({tag, file} → definición `iswc-preview/v1`) por `doc-demo-galeria` del kit. Aquí solo va lo propio de la app: cargar
 * sus tags y nombrar sus categorías. Un componente nuevo entra con su línea en `manifest.json`.
 */
import { KIT_TAGS, tagsArranque } from '../../../src/js/kit-tags.js';
import type { LoaderGaleria } from '../../../src/js/consts/schemas/demo.schemas.js';

/** Categoría → rótulo: el orden de las claves es el del catálogo. */
const CATEGORIAS: Record<string, string> = {
  shell: 'Armazón',
  transversal: 'Transversales',
  inicio: 'Portada',
  acceso: 'Acceso',
  panel: 'Panel',
  canales: 'Canales',
  chat: 'Chat',
  'chat-demo': 'Chat en vivo',
  correos: 'Correos',
  proyectos: 'Proyectos',
  crm: 'CRM',
  finanzas: 'Finanzas',
  inventario: 'Inventario',
  rrhh: 'RRHH',
  organizacion: 'Organización',
  asistente: 'Asistente',
  admin: 'Administración',
  paty: 'Propuestas de PatyIA',
};

const L = (globalThis as { iswcLoader?: LoaderGaleria }).iswcLoader;
if (!L) throw new Error('galería: falta iswcLoader');
await L.load(...KIT_TAGS, ...tagsArranque());
const { montarGaleria } = await import(new URL('../preview/doc-demo-galeria.min.js', L.selfBase).href);
await montarGaleria({ manifest: new URL('manifest.json', location.href), categorias: CATEGORIAS });
