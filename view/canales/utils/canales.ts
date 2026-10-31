/**
 * canales.ts — dominio de la vista `canales` (sin DOM): qué puede mostrar la vista según empresa y permisos
 * (W-CHAT-41) y cuándo un error del API significa que el chat aún no está publicado (para caer al demo local).
 */
import type { Perfil } from '../../../src/js/consts/schemas/api.schemas.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';

/** Estado de la vista: sin empresa activa, sin permiso de chat, o lista para conversar. */
export type EstadoCanales = 'sin-empresa' | 'sin-permiso' | 'listo';

export function estadoCanales(iempresa: number | null, perfil: Perfil | null): EstadoCanales {
  if (!iempresa) return 'sin-empresa';
  if (!puede(perfil, ACCION.chat)) return 'sin-permiso';
  return 'listo';
}

/** ¿El error dice que el API todavía no expone las rutas del chat? (path no definido en el plugin, 404 de ruta). */
export const apiChatPendiente = (mensaje: string): boolean => /no define el path|not found|404|no existe la ruta/i.test(mensaje);

/** Id de chat de la ruta (o `null`). */
export const chatDeRuta = (id: string | null | undefined): string | null => (id && id.trim() ? id.trim() : null);
