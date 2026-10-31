/**
 * permisos.ts — lectura del vector de permisos de DER en el front (sin DOM).
 * El perfil (`GET /permisos`) trae `perms`: acción → valor. Un valor `true` permite; `false` niega; un objeto
 * partido por verbo (`{ GET: true, POST: false }`) decide por método; sin entrada se mira el comodín `"*"`.
 * El server es quien manda: aquí solo se decide qué botones mostrar.
 */
import type { Perfil } from '../consts/schemas/api.schemas.js';

/** Acciones con alias en el API (las mismas de `security.ts` del api-avatar). */
export const ACCION = {
  chat: 'avatar.chat',
  tareas: 'avatar.tareas',
  gestionar: 'avatar.gestionar',
  seguridad: 'avatar.seguridad',
  correo: 'avatar.correo',
  finanzas: 'avatar.finanzas',
  inventario: 'avatar.inventario',
  rrhh: 'avatar.rrhh',
} as const;

function valorDe(perms: Record<string, unknown>, accion: string): unknown {
  if (accion in perms) return perms[accion];
  return perms['*'];
}

/** ¿El perfil permite la acción (para el verbo dado, default POST)? */
export function puede(perfil: Perfil | null, accion: string, verbo = 'POST'): boolean {
  if (!perfil) return false;
  const v = valorDe(perfil.perms, accion);
  if (v === true) return true;
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (verbo in o) return o[verbo] === true;
    return 'protected' in o;
  }
  return false;
}

/** Rol efectivo legible. */
export function rolDe(perfil: Perfil | null): string {
  if (!perfil) return 'Invitado';
  const r = perfil.roles[0] ?? perfil.irol;
  return r === 'USR' ? 'Usuario' : r === 'ADMIN' ? 'Administrador' : r === 'GESTOR' ? 'Gestor' : r;
}
