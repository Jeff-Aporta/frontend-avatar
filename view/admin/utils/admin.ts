/**
 * admin.ts — dominio de la vista `admin` (sin DOM): validación del formulario de usuario, normalización de ids de rol,
 * rol principal por usuario, acciones por rol y valor legible de una acción. Los componentes solo pintan.
 */
import type { AccionRol, RolUsuario, UsuarioForm } from '../../../src/js/consts/schemas/admin.schemas.js';

/** Grupo de roles de Avatar (el mismo del API). */
export const GRUPO = 'AVATAR';
/** Roles que siembra el API y no se borran. */
export const ROLES_BASE = ['USR', 'ADMIN'] as const;

/** Mensajes de error del formulario de usuario (vacío = válido). */
export function validarUsuario(d: UsuarioForm): string[] {
  const errores: string[] = [];
  if (d.nuevo && !/^[a-z0-9._-]{2,120}$/i.test(d.iusuario.trim())) errores.push('El usuario debe tener entre 2 y 120 caracteres (letras, dígitos, punto, guion)');
  if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errores.push('El correo no es válido');
  if (d.nuevo && d.password.length < 8) errores.push('La contraseña debe tener al menos 8 caracteres');
  if (!d.nuevo && d.password && d.password.length < 8) errores.push('La nueva contraseña debe tener al menos 8 caracteres');
  return errores;
}

/** Cuerpo para el API: al editar solo viaja lo que cambia (sin contraseña vacía). */
export function cuerpoUsuario(d: UsuarioForm): Record<string, unknown> {
  const out: Record<string, unknown> = { iusuario: d.iusuario.trim(), nombre: d.nombre.trim() || null, email: d.email.trim() || null, bactivo: d.bactivo };
  if (d.password) out['password'] = d.password;
  return out;
}

/** Id de rol normalizado: mayúsculas, sin espacios, solo A-Z0-9_ (máx. 30). */
export function normalizarIrol(texto: string): string {
  return texto.trim().toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z0-9_]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 30);
}

/** Rol principal de un usuario (el marcado `bprincipal`, o el primero). */
export function rolPrincipal(iusuario: string, asignaciones: RolUsuario[]): string | null {
  const mias = asignaciones.filter((a) => a.iusuario === iusuario);
  return (mias.find((a) => a.bprincipal) ?? mias[0])?.irol ?? null;
}

/** Acciones de un rol, ordenadas por id. */
export function accionesDe(irol: string, acciones: AccionRol[]): AccionRol[] {
  return acciones.filter((a) => a.irol === irol).sort((a, b) => a.iaccion.localeCompare(b.iaccion));
}

/** Valor de una acción en texto corto («permite», «niega», «GET sí · POST no»). */
export function valorLegible(valor: unknown): string {
  if (valor === true) return 'permite';
  if (valor === false) return 'niega';
  if (valor && typeof valor === 'object') {
    const o = valor as Record<string, unknown>;
    const verbos = ['GET', 'POST', 'PUT', 'DELETE'].filter((v) => v in o);
    if (verbos.length) return verbos.map((v) => `${v} ${o[v] === true ? 'sí' : 'no'}`).join(' · ');
    return JSON.stringify(valor);
  }
  return String(valor ?? '');
}

/** Color de la etiqueta según el valor. */
export function colorValor(valor: unknown): 'success' | 'danger' | 'neutral' {
  if (valor === true) return 'success';
  if (valor === false) return 'danger';
  return 'neutral';
}

/** Etiqueta legible de un rol conocido. */
export function etiquetaRol(irol: string): string {
  if (irol === 'USR') return 'Usuario';
  if (irol === 'ADMIN') return 'Administrador';
  if (irol === 'GESTOR') return 'Gestor';
  return irol;
}
