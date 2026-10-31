/**
 * paginas.ts — la tabla única de páginas de Avatar (sin DOM). Cada vista tiene una ruta real con su propio HTML
 * (`<ruta>/index.html`), generado por `scripts/build/paginas.ts` con los mismos metadatos, el mismo arranque y un cuerpo que
 * es solo `<av-app vista="…">`: nada de `#/` ni `?s=`. El router y el shell leen esta tabla; agregar una vista = una fila.
 */

/** Una página: `ruta` relativa a la raíz del sitio ('' es la portada), con barra final; `shell` es el tag de la vista; `privada` exige sesión. */
export type Pagina = { vista: string; ruta: string; shell: string; titulo: string; descripcion: string; privada: boolean; indexable: boolean; escena?: string };

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

/** Enlaces del pie: páginas abiertas y demos (`ruta` relativa a la raíz del sitio). */
export const ENLACES_PIE: { ruta: string; titulo: string }[] = [
  { ruta: '', titulo: 'Inicio' },
  { ruta: 'acceso/', titulo: 'Entrar' },
  { ruta: 'chat-demo/', titulo: 'Chat en vivo' },
  { ruta: 'view/demo/', titulo: 'Demos de componentes' },
];

/** Página de una vista (o undefined). */
export const paginaDe = (vista: string): Pagina | undefined => PAGINAS.find((p) => p.vista === vista);

/** Vista de una ruta relativa a la raíz (`canales/` o `canales/index.html` → canales); desconocida → null. */
export function vistaDeRuta(relativa: string): string | null {
  const seg = relativa.replace(/index\.html$/, '').replace(/^\/+/, '');
  const pagina = PAGINAS.find((p) => p.ruta === seg || p.ruta === `${seg}/`);
  return pagina?.vista ?? null;
}

/** Título completo de la pestaña. */
export const tituloDe = (p: Pagina): string => (p.vista === 'inicio' ? p.titulo : `${p.titulo} · ${SITIO}`);
