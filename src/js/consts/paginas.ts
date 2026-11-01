/**
 * paginas.ts — la tabla única de rutas de Avatar (sin DOM): de aquí salen el router, el HTML estático, los metadatos por
 * URL (title, description, canonical, Open Graph, JSON-LD) y el sitemap. Una URL es determinista: `<vista>/` o
 * `<vista>/<id>/`, donde `id` es una `parte` declarada (pestaña, con HTML propio) o un registro (entra por `404.html`).
 * Cada vista tiene una ruta real con su propio HTML
 * (`<ruta>/index.html`), generado por `scripts/build/paginas.ts` con los mismos metadatos, el mismo arranque y un cuerpo que
 * es solo `<av-app vista="…">`: nada de `#/` ni `?s=`. El router y el shell leen esta tabla; agregar una vista = una fila.
 */

/** Una página: `ruta` relativa a la raíz del sitio ('' es la portada), con barra final; `shell` es el tag de la vista; `privada` exige sesión. */
/** Sub-URL estática de una vista: normalmente una pestaña. */
export type Parte = { id: string; titulo: string; descripcion: string };
export type Pagina = { vista: string; ruta: string; shell: string; titulo: string; descripcion: string; privada: boolean; indexable: boolean; escena?: string; partes?: Parte[]; registros?: boolean; jsonLd?: Record<string, unknown>; layout?: 'normal' | 'completo' };
/** Lo que se publica por URL. */
export type Metas = { ruta: string; titulo: string; descripcion: string; indexable: boolean; jsonLd: Record<string, unknown> | null };

/** Nombre del sitio (sufijo de los títulos y `og:site_name`). */
export const SITIO = 'Avatar';
/** URL pública del sitio (GitHub Pages), base de `canonical` y `og:url`. */
export const URL_PUBLICA = 'https://jeff-aporta.github.io/frontend-avatar/';

export const PAGINAS: Pagina[] = [
  { vista: 'inicio', ruta: '', shell: 'av-inicio', titulo: 'Avatar · Comunicación y gestión para tu empresa', descripcion: 'Canales y chat en tiempo real, proyectos kanban, CRM, finanzas, inventario, recursos humanos y el asistente AVO en una sola plataforma para equipos.', privada: false, indexable: true, escena: 'bienvenida' },
  { vista: 'acceso', ruta: 'acceso/', shell: 'av-acceso', titulo: 'Entrar', descripcion: 'Inicia sesión en Avatar para trabajar con tu equipo.', privada: false, indexable: true, escena: 'acceso' },
  { vista: 'panel', ruta: 'panel/', shell: 'av-panel', titulo: 'Panel', descripcion: 'Cifras de la empresa: tareas, clientes, mensajes y actividad.', privada: true, indexable: false },
  { vista: 'canales', ruta: 'canales/', shell: 'av-canales', titulo: 'Canales', descripcion: 'Chats 1:1, grupos y canales de la empresa en tiempo real.', privada: true, indexable: false, escena: 'canales' },
  { vista: 'chat-demo', ruta: 'chat-demo/', shell: 'av-chat-demo', titulo: 'Chat en vivo (demo)', descripcion: 'Demo del chat de Avatar sin cuenta: abre dos pestañas y conversa en tiempo real con mensajes, archivos, notas de voz, reacciones y llamadas.', privada: false, indexable: false },
  { vista: 'correos', ruta: 'correos/', shell: 'av-correos', titulo: 'Correos', descripcion: 'Bandeja de correo de la empresa: leer, redactar y organizar.', privada: true, indexable: false, escena: 'correos' },
  { vista: 'proyectos', ruta: 'proyectos/', shell: 'av-proyectos', titulo: 'Proyectos', descripcion: 'Tableros kanban, tareas y tickets del equipo.', privada: true, indexable: false, escena: 'proyectos' },
  { vista: 'crm', ruta: 'crm/', shell: 'av-crm', titulo: 'CRM', descripcion: 'Clientes y embudo comercial.', privada: true, indexable: false, escena: 'crm' },
  { vista: 'finanzas', ruta: 'finanzas/', shell: 'av-finanzas', titulo: 'Finanzas', descripcion: 'Transacciones, facturas y conversión de monedas.', privada: true, indexable: false, escena: 'finanzas' },
  { vista: 'inventario', ruta: 'inventario/', shell: 'av-inventario', titulo: 'Inventario', descripcion: 'Productos, stock, movimientos, pedidos y proveedores.', privada: true, indexable: false, escena: 'inventario' },
  { vista: 'rrhh', ruta: 'rrhh/', shell: 'av-rrhh', titulo: 'Recursos Humanos', descripcion: 'Empleados, asistencia y solicitudes.', privada: true, indexable: false, escena: 'rrhh' },
  { vista: 'organizacion', ruta: 'organizacion/', shell: 'av-organizacion', titulo: 'Organización', descripcion: 'Empresa, miembros y equipos.', privada: true, indexable: false, escena: 'organizacion' },
  { vista: 'asistente', ruta: 'asistente/', shell: 'av-asistente', titulo: 'Asistente AVO', descripcion: 'Pregúntale a AVO por tareas, clientes y la plataforma.', privada: true, indexable: false, escena: 'asistente' },
  { vista: 'admin', ruta: 'admin/', shell: 'av-admin', titulo: 'Administración', descripcion: 'Usuarios, roles y permisos.', privada: true, indexable: false },
];

/** Columnas de enlaces del pie (`ruta` relativa a la raíz del sitio). */
export const COLUMNAS_PIE: { titulo: string; enlaces: { ruta: string; titulo: string; vista?: string }[] }[] = [
  { titulo: 'Avatar', enlaces: [{ ruta: '', titulo: 'Inicio', vista: 'inicio' }, { ruta: 'acceso/', titulo: 'Entrar', vista: 'acceso' }] },
  { titulo: 'Demos', enlaces: [{ ruta: 'chat-demo/', titulo: 'Chat en vivo', vista: 'chat-demo' }, { ruta: 'view/demo/', titulo: 'Demos de componentes' }] },
];

const parte = (id: string, titulo: string, descripcion: string): Parte => ({ id, titulo, descripcion });
const PARTES: Record<string, Parte[]> = {
  finanzas: [parte('general', 'General', 'Indicadores del mes, gráficas y conversor de monedas.'), parte('transacciones', 'Transacciones', 'Ingresos y gastos de la empresa.'), parte('facturas', 'Facturas', 'Facturas emitidas, pendientes y pagadas.'), parte('hoja', 'Hoja', 'Hoja de cálculo para cuadrar cifras.')],
  inventario: [parte('productos', 'Productos', 'Catálogo de productos y stock.'), parte('movimientos', 'Movimientos', 'Entradas y salidas de inventario.'), parte('pedidos', 'Pedidos', 'Pedidos a proveedores y de clientes.'), parte('proveedores', 'Proveedores', 'Proveedores de la empresa.')],
  rrhh: [parte('general', 'General', 'Indicadores de recursos humanos.'), parte('empleados', 'Empleados', 'Personas de la empresa.'), parte('asistencia', 'Asistencia', 'Asistencia del día.'), parte('solicitudes', 'Solicitudes', 'Permisos, vacaciones y certificados.')],
  organizacion: [parte('empresa', 'Empresa', 'Datos de la empresa.'), parte('miembros', 'Miembros', 'Miembros de la empresa.'), parte('equipos', 'Equipos', 'Equipos de trabajo.')],
  admin: [parte('usuarios', 'Usuarios', 'Usuarios y su rol principal.'), parte('roles', 'Roles', 'Roles y permisos.'), parte('almacenamiento', 'Almacenamiento', 'Límites de archivos.'), parte('cuenta', 'Cuenta', 'Tu cuenta.')],
};
for (const p of PAGINAS) {
  const partes = PARTES[p.vista];
  if (partes) p.partes = partes;
  if (p.vista === 'canales' || p.vista === 'proyectos' || p.vista === 'chat-demo') p.registros = true;
  if (p.vista === 'canales' || p.vista === 'correos' || p.vista === 'asistente') p.layout = 'completo';
  if (p.vista === 'inicio') p.jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: SITIO, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: URL_PUBLICA, description: p.descripcion };
}

/** Página de una vista (o undefined). */
export const paginaDe = (vista: string): Pagina | undefined => PAGINAS.find((p) => p.vista === vista);

/** Ruta relativa de una vista y su id (`finanzas/facturas/`). */
export function rutaDe(vista: string, id?: string | number | null): string {
  const base = paginaDe(vista)?.ruta ?? '';
  return id == null || id === '' ? base : `${base}${encodeURIComponent(String(id))}/`;
}

/** Interpreta una ruta relativa: `{ vista, id }`, o null si la tabla no la declara. */
export function interpretar(relativa: string): { vista: string; id: string | null } | null {
  const segmentos = relativa.replace(/index\.html$/, '').split('/').filter(Boolean);
  if (segmentos.length > 2) return null;
  const pagina = PAGINAS.find((p) => p.ruta === (segmentos[0] ? `${segmentos[0]}/` : ''));
  if (!pagina) return null;
  const crudo = segmentos[1];
  if (crudo == null) return { vista: pagina.vista, id: null };
  const id = decodeURIComponent(crudo);
  return pagina.registros || pagina.partes?.some((p) => p.id === id) ? { vista: pagina.vista, id } : null;
}

/** Vista de una ruta relativa a la raíz (`canales/` o `canales/index.html` → canales); desconocida → null. */
export function vistaDeRuta(relativa: string): string | null {
  const seg = relativa.replace(/index\.html$/, '').replace(/^\/+/, '');
  const pagina = PAGINAS.find((p) => p.ruta === seg || p.ruta === `${seg}/`);
  return pagina?.vista ?? null;
}

/** Metadatos de una URL: los usan el generador de páginas y el router, así que nunca difieren. */
export function metasDe(vista: string, id?: string | null): Metas | null {
  const p = paginaDe(vista);
  if (!p) return null;
  const pieza = p.partes?.find((x) => x.id === id);
  return { ruta: rutaDe(vista, id), titulo: pieza ? `${pieza.titulo} · ${p.titulo} · ${SITIO}` : tituloDe(p), descripcion: pieza?.descripcion ?? p.descripcion, indexable: p.indexable && (!id || !!pieza), jsonLd: id ? null : p.jsonLd ?? null };
}

/** Título completo de la pestaña. */
export const tituloDe = (p: Pagina): string => (p.vista === 'inicio' ? p.titulo : `${p.titulo} · ${SITIO}`);
