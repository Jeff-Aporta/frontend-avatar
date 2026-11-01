/**
 * paginas.ts — la tabla única de rutas de Avatar (sin DOM): de aquí salen el router, el HTML estático, los metadatos por
 * URL (title, description, canonical, Open Graph, JSON-LD) y el sitemap. Una URL es determinista: `<vista>/`, `<vista>/<parte>/`
 * para una sección fija (pestaña, con HTML propio) o `<vista>/?s=<estado>` para una entidad: `s` es `{ id }` en JSON y b64url,
 * la misma forma de `doc-demo-estado` del kit, codificada solo aquí. Las URLs viejas `<vista>/<id>/` se redirigen.
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
  if (['canales', 'correos', 'proyectos', 'crm', 'finanzas', 'inventario', 'rrhh', 'chat-demo'].includes(p.vista)) p.registros = true;
  if (['canales', 'correos', 'asistente', 'chat-demo'].includes(p.vista)) p.layout = 'completo';
  if (p.vista === 'inicio') p.jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: SITIO, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: URL_PUBLICA, description: p.descripcion };
}

/** Una columna del pie: `vista` (y `id`) navega por la SPA; `ruta` es una página fuera de la app (los demos). */
export type EnlacePie = { titulo: string; vista?: string; id?: string; ruta?: string };
export type ColumnaPie = { titulo: string; enlaces: EnlacePie[] };

/** Pie generado de la tabla: ninguna página, sección o demo puede faltar. Privadas solo con sesión. */
export function columnasPie(conSesion: boolean): ColumnaPie[] {
  const visibles = PAGINAS.filter((p) => conSesion || !p.privada);
  const enlace = (p: Pagina): EnlacePie => ({ titulo: p.titulo.split(' · ')[0]!, vista: p.vista });
  const secciones = visibles.filter((p) => p.partes).map((p) => ({ titulo: p.titulo, enlaces: p.partes!.map((x) => ({ titulo: x.titulo, vista: p.vista, id: x.id })) }));
  return [
    { titulo: SITIO, enlaces: PAGINAS.filter((p) => !p.privada).map(enlace) },
    ...(conSesion ? [{ titulo: 'Módulos', enlaces: PAGINAS.filter((p) => p.privada).map(enlace) }] : []),
    ...secciones,
    { titulo: 'Demos', enlaces: [{ titulo: 'Todos los componentes', ruta: 'view/demo/' }, ...PAGINAS.map((p) => ({ titulo: p.titulo.split(' · ')[0]!, ruta: `view/${p.vista}/demo/` }))] },
  ];
}

/** Página de una vista (o undefined). */
export const paginaDe = (vista: string): Pagina | undefined => PAGINAS.find((p) => p.vista === vista);

const b64url = (texto: string): string => btoa(String.fromCharCode(...new TextEncoder().encode(texto))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const deB64url = (s: string): string => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)));

/** Estado de entidad → valor de `?s=`: determinista, un solo lugar. */
export const codificarEntidad = (id: string | number): string => b64url(JSON.stringify({ id: String(id) }));

/** Valor de `?s=` → id, o null si no es válido. */
export function leerEntidad(s: string | null): string | null {
  if (!s) return null;
  try {
    const dato = JSON.parse(deB64url(s)) as { id?: unknown };
    return typeof dato.id === 'string' ? dato.id : null;
  } catch {
    return null;
  }
}

/** Ruta relativa de una vista: sección fija en el camino (`finanzas/facturas/`), entidad en `?s=`. */
export function rutaDe(vista: string, id?: string | number | null): string {
  const p = paginaDe(vista);
  const base = p?.ruta ?? '';
  if (id == null || id === '') return base;
  if (p?.partes?.some((x) => x.id === String(id))) return `${base}${encodeURIComponent(String(id))}/`;
  return `${base}?s=${codificarEntidad(id)}`;
}

/** Interpreta camino y `?s=`: `{ vista, id }`, o null si la tabla no lo declara. `vieja`: el id venía en el camino y hay que redirigir. */
export function interpretar(relativa: string, busqueda = ''): { vista: string; id: string | null; vieja?: boolean } | null {
  const segmentos = relativa.replace(/index\.html$/, '').split('/').filter(Boolean);
  if (segmentos.length > 2) return null;
  const pagina = PAGINAS.find((p) => p.ruta === (segmentos[0] ? `${segmentos[0]}/` : ''));
  if (!pagina) return null;
  const crudo = segmentos[1];
  if (crudo == null) return { vista: pagina.vista, id: leerEntidad(new URLSearchParams(busqueda).get('s')) };
  const id = decodeURIComponent(crudo);
  if (pagina.partes?.some((p) => p.id === id)) return { vista: pagina.vista, id };
  return pagina.registros ? { vista: pagina.vista, id, vieja: true } : null;
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
