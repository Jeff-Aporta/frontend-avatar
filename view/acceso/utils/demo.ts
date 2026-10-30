/**
 * demo.ts — dominio de la vista `acceso` (sin DOM): los usuarios de muestra que siembra `api-avatar` (`deno task demo`)
 * y el texto de ayuda del acceso.
 */
import type { CredencialDemo } from '../../../src/js/consts/schemas/acceso.schemas.js';

/** Usuarios de muestra: los mismos de `src/seed.ts` del API (el admin se crea con la contraseña del secreto). */
export function credencialesDemo(): CredencialDemo[] {
  return [
    { usuario: 'ana', password: 'avatar-demo-2026', rol: 'Gestora', descripcion: 'Administra empresas, equipos, canales, proyectos y CRM.' },
    { usuario: 'beto', password: 'avatar-demo-2026', rol: 'Usuario', descripcion: 'Chatea, mueve sus tareas y comenta.' },
    { usuario: 'carla', password: 'avatar-demo-2026', rol: 'Usuario', descripcion: 'Comercial: ve el CRM y conversa con su equipo.' },
  ];
}

/** Mensaje de error legible para el formulario a partir del mensaje del API. */
export function mensajeAcceso(mensaje: string): string {
  if (/inválid|invalid|401/i.test(mensaje)) return 'Usuario o contraseña inválidos.';
  if (/429|intentos/i.test(mensaje)) return 'Demasiados intentos: espera unos minutos.';
  if (/fetch|network|Failed/i.test(mensaje)) return 'No se pudo contactar el API. Revisa la conexión.';
  return mensaje;
}
