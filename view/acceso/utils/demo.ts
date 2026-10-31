/**
 * demo.ts — dominio de la vista `acceso` (sin DOM): los perfiles de prueba que publica `api-avatar`
 * y el texto de ayuda del acceso.
 */
import type { CredencialDemo } from '../../../src/js/consts/schemas/acceso.schemas.js';
import type { PerfilPrueba } from '../../../src/js/consts/schemas/api.schemas.js';

/** Perfiles de prueba como credenciales del acceso: el PIN hace de contraseña. */
export function credencialesDe(perfiles: PerfilPrueba[]): CredencialDemo[] {
  return perfiles.map((p) => ({ usuario: p.iusuario, password: p.pin, rol: p.rol, descripcion: p.descripcion }));
}

/** Mensaje de error legible para el formulario a partir del mensaje del API. */
export function mensajeAcceso(mensaje: string): string {
  if (/inválid|invalid|401/i.test(mensaje)) return 'Usuario o contraseña inválidos.';
  if (/429|intentos/i.test(mensaje)) return 'Demasiados intentos: espera unos minutos.';
  if (/fetch|network|Failed/i.test(mensaje)) return 'No se pudo contactar el API. Revisa la conexión.';
  return mensaje;
}
