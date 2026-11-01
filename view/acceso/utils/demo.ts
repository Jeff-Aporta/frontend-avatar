/**
 * demo.ts — dominio de la vista `acceso` (sin DOM): el texto de ayuda del acceso.
 */
/** Mensaje de error legible para el formulario a partir del mensaje del API. */
export function mensajeAcceso(mensaje: string): string {
  if (/inválid|invalid|401/i.test(mensaje)) return 'Usuario o contraseña inválidos.';
  if (/429|intentos/i.test(mensaje)) return 'Demasiados intentos: espera unos minutos.';
  if (/fetch|network|Failed/i.test(mensaje)) return 'No se pudo contactar el API. Revisa la conexión.';
  return mensaje;
}
