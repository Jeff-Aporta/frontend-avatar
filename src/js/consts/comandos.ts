/**
 * comandos.ts — módulos del menú y comandos de la paleta global (Ctrl+K) de Avatar (sin DOM). Es también el corpus
 * `comandos` que se hornea con embeddings en el build (`scripts/build/embeddings.ts`): cada ítem se vectoriza con su
 * `texto` (título, pista y palabras clave), así la paleta encuentra «cobrar a un cliente» → «Emitir factura».
 */

/** Ítem del lateral (forma de `iswc-doc-index`). */
export type Modulo = { id: string; title: string; group: string; icon: string; keywords: string[]; hint: string };
/** Comando de la paleta: va a una vista (con una intención opcional) o ejecuta una acción global. */
export type Comando = { id: string; title: string; group: string; icon: string; hint: string; keywords: string[]; vista?: string; intencion?: string; global?: 'tema' | 'salir' | 'paleta' };

/** Todos los módulos del área privada, en el orden y los grupos del menú (como el menú del React original). */
export const MODULOS: Modulo[] = [
  { id: 'panel', title: 'Panel', group: 'Trabajo', icon: 'mdi:view-dashboard-outline', keywords: ['dashboard', 'inicio', 'kpi', 'resumen'], hint: 'Cifras de la empresa' },
  { id: 'canales', title: 'Canales', group: 'Trabajo', icon: 'mdi:forum-outline', keywords: ['chat', 'mensajes', 'equipo', 'whatsapp', 'grupos'], hint: 'Chats y grupos en tiempo real' },
  { id: 'correos', title: 'Correos', group: 'Trabajo', icon: 'mdi:email-outline', keywords: ['email', 'bandeja', 'duo'], hint: 'DUO eMail' },
  { id: 'proyectos', title: 'Proyectos', group: 'Trabajo', icon: 'mdi:view-column-outline', keywords: ['kanban', 'tareas', 'tickets'], hint: 'Tableros y tickets' },
  { id: 'crm', title: 'CRM', group: 'Negocio', icon: 'mdi:account-heart-outline', keywords: ['clientes', 'ventas', 'pipeline'], hint: 'Clientes y embudo' },
  { id: 'finanzas', title: 'Finanzas', group: 'Negocio', icon: 'mdi:cash-multiple', keywords: ['contabilidad', 'facturas', 'ingresos', 'gastos', 'monedas'], hint: 'Contabilidad y facturas' },
  { id: 'inventario', title: 'Inventario', group: 'Negocio', icon: 'mdi:package-variant-closed', keywords: ['productos', 'stock', 'pedidos', 'proveedores'], hint: 'Productos y pedidos' },
  { id: 'rrhh', title: 'Recursos Humanos', group: 'Empresa', icon: 'mdi:account-tie-outline', keywords: ['empleados', 'asistencia', 'vacaciones', 'nómina'], hint: 'Personas y solicitudes' },
  { id: 'organizacion', title: 'Organización', group: 'Empresa', icon: 'mdi:domain', keywords: ['empresa', 'miembros', 'equipos'], hint: 'Empresa, miembros y equipos' },
  { id: 'asistente', title: 'Asistente AVO', group: 'Empresa', icon: 'mdi:robot-outline', keywords: ['ia', 'ayuda', 'chatbot'], hint: 'Pregunta lo que necesites' },
  { id: 'admin', title: 'Administración', group: 'Empresa', icon: 'mdi:shield-account-outline', keywords: ['usuarios', 'roles', 'permisos', 'seguridad'], hint: 'Usuarios y permisos' },
];

/** Acciones frecuentes: llevan a la vista que las resuelve, con la intención para que la vista abra lo indicado. */
const ACCIONES: Comando[] = [
  { id: 'chat-nuevo', title: 'Nuevo chat', group: 'Acciones', icon: 'mdi:message-plus-outline', hint: 'Escribirle a una persona', keywords: ['mensaje directo', 'hablar con', 'escribir'], vista: 'canales', intencion: 'chat-nuevo' },
  { id: 'grupo-nuevo', title: 'Nuevo grupo', group: 'Acciones', icon: 'mdi:account-group-outline', hint: 'Crear un grupo de chat', keywords: ['grupo', 'equipo', 'conversación grupal'], vista: 'canales', intencion: 'grupo-nuevo' },
  { id: 'tarea-nueva', title: 'Crear tarea', group: 'Acciones', icon: 'mdi:checkbox-marked-circle-plus-outline', hint: 'Nuevo ticket en un tablero', keywords: ['ticket', 'pendiente', 'asignar trabajo', 'incidencia', 'reportar error', 'falla', 'bug', 'soporte'], vista: 'proyectos', intencion: 'tarea-nueva' },
  { id: 'cliente-nuevo', title: 'Nuevo cliente', group: 'Acciones', icon: 'mdi:account-plus-outline', hint: 'Registrar un cliente o prospecto', keywords: ['prospecto', 'lead', 'venta'], vista: 'crm', intencion: 'cliente-nuevo' },
  { id: 'factura-nueva', title: 'Emitir factura', group: 'Acciones', icon: 'mdi:file-document-plus-outline', hint: 'Cobrar a un cliente', keywords: ['cobrar', 'facturar', 'venta', 'cuenta de cobro'], vista: 'finanzas', intencion: 'factura-nueva' },
  { id: 'conversor', title: 'Convertir monedas', group: 'Acciones', icon: 'mdi:swap-horizontal', hint: 'Tasas de cambio', keywords: ['dólar', 'euro', 'peso', 'cambio'], vista: 'finanzas', intencion: 'conversor' },
  { id: 'movimiento', title: 'Registrar movimiento de inventario', group: 'Acciones', icon: 'mdi:swap-vertical', hint: 'Entrada o salida de productos', keywords: ['stock', 'entrada', 'salida', 'bodega'], vista: 'inventario', intencion: 'movimiento' },
  { id: 'asistencia', title: 'Marcar asistencia', group: 'Acciones', icon: 'mdi:clock-check-outline', hint: 'Registrar entrada o salida del día', keywords: ['llegada', 'turno', 'horario', 'jornada'], vista: 'rrhh', intencion: 'asistencia' },
  { id: 'solicitud', title: 'Pedir vacaciones o permiso', group: 'Acciones', icon: 'mdi:beach', hint: 'Solicitud a Recursos Humanos', keywords: ['vacaciones', 'permiso', 'incapacidad', 'licencia'], vista: 'rrhh', intencion: 'solicitud' },
  { id: 'correo-nuevo', title: 'Redactar correo', group: 'Acciones', icon: 'mdi:email-edit-outline', hint: 'Enviar un correo', keywords: ['email', 'enviar', 'escribir'], vista: 'correos', intencion: 'correo-nuevo' },
  { id: 'invitar', title: 'Invitar a alguien a la empresa', group: 'Acciones', icon: 'mdi:account-arrow-right-outline', hint: 'Sumar un miembro', keywords: ['invitación', 'miembro', 'agregar persona'], vista: 'organizacion', intencion: 'invitar' },
  { id: 'preguntar', title: 'Preguntarle a AVO', group: 'Acciones', icon: 'mdi:robot-happy-outline', hint: 'El asistente responde con datos reales', keywords: ['ayuda', 'inteligencia artificial', 'duda'], vista: 'asistente' },
  { id: 'tema', title: 'Cambiar tema claro u oscuro', group: 'Preferencias', icon: 'mdi:theme-light-dark', hint: 'Modo noche o modo día', keywords: ['oscuro', 'claro', 'noche', 'apariencia', 'pantalla oscura', 'brillo'], global: 'tema' },
  { id: 'paleta', title: 'Cambiar la paleta de colores', group: 'Preferencias', icon: 'mdi:palette-outline', hint: 'Colores de la interfaz', keywords: ['colores', 'color de acento', 'identidad', 'estilo'], global: 'paleta' },
  { id: 'salir', title: 'Cerrar sesión', group: 'Preferencias', icon: 'mdi:logout', hint: 'Salir de Avatar', keywords: ['salir', 'logout', 'desconectar'], global: 'salir' },
];

/** Comandos de la paleta: un «Ir a» por módulo + las acciones. */
export const COMANDOS: Comando[] = [
  ...MODULOS.map((m) => ({ id: `ir-${m.id}`, title: `Ir a ${m.title}`, group: 'Módulos', icon: m.icon, hint: m.hint, keywords: m.keywords, vista: m.id })),
  ...ACCIONES,
];

/** Texto que se vectoriza por comando (el mismo en el build y en las pruebas). */
export const textoDe = (c: { title: string; hint: string; keywords: string[] }): string => `${c.title}. ${c.hint}. ${c.keywords.join(', ')}`;
