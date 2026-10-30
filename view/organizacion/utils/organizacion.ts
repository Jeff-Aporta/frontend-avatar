/**
 * organizacion.ts — dominio de la vista `organizacion` (sin DOM): etiquetas de rol, validación de formularios,
 * ordenación de miembros y agrupación de integrantes por equipo. Los componentes solo pintan lo que esto devuelve.
 */
import type { EmpresaForm, Integrante, InvitarForm, Miembro } from '../../../src/js/consts/schemas/organizacion.schemas.js';
import { ROLES_EMPRESA } from '../../../src/js/consts/schemas/organizacion.schemas.js';

/** Etiqueta legible de un rol de empresa. */
export const ROL_LABEL: Record<string, string> = { propietario: 'Propietario', admin: 'Administrador', miembro: 'Miembro', invitado: 'Invitado', lider: 'Líder', integrante: 'Integrante' };

/** Color de iswc-tag según rol. */
export function colorRol(rol: string): 'brand' | 'neutral' | 'success' | 'warning' | 'info' {
  if (rol === 'propietario') return 'warning';
  if (rol === 'admin' || rol === 'lider') return 'brand';
  if (rol === 'invitado') return 'neutral';
  return 'success';
}

/** Etiqueta de un rol (o el id si no se conoce). */
export const etiquetaRol = (rol: string): string => ROL_LABEL[rol] ?? rol;

/** Orden de los miembros: propietario, admin, miembro, invitado; dentro, por nombre. */
export function ordenarMiembros(items: Miembro[]): Miembro[] {
  const peso = (r: string) => Math.max(0, ROLES_EMPRESA.indexOf(r as (typeof ROLES_EMPRESA)[number]));
  return [...items].sort((a, b) => peso(a.rol) - peso(b.rol) || nombreDe(a).localeCompare(nombreDe(b)));
}

/** Nombre visible de un miembro o integrante (el del usuario o su id). */
export function nombreDe(m: { iusuario: string; usuario?: { nombre?: string | null | undefined } | null | undefined }): string {
  return m.usuario?.nombre || m.iusuario;
}

/** Mensajes de error del formulario de empresa (vacío = válido). */
export function validarEmpresa(d: EmpresaForm): string[] {
  const errores: string[] = [];
  if (!d.nombre.trim()) errores.push('El nombre es obligatorio');
  if (d.nombre.trim().length > 160) errores.push('El nombre no puede superar 160 caracteres');
  if (d.nit && !/^[0-9A-Za-z.-]+$/.test(d.nit.trim())) errores.push('El NIT solo admite dígitos, letras, puntos y guiones');
  return errores;
}

/** Mensajes de error del formulario de invitación (vacío = válido). */
export function validarInvitacion(d: InvitarForm): string[] {
  const errores: string[] = [];
  if (!d.iusuario.trim()) errores.push('Elige o escribe el usuario');
  if (!ROLES_EMPRESA.includes(d.rol)) errores.push('Rol desconocido');
  return errores;
}

/** Cuerpo limpio para el API a partir del formulario de empresa (strings vacíos → null). */
export function cuerpoEmpresa(d: EmpresaForm): Record<string, unknown> {
  const limpio = (s: string) => (s.trim() ? s.trim() : null);
  return { nombre: d.nombre.trim(), nit: limpio(d.nit), sector: limpio(d.sector), descripcion: limpio(d.descripcion) };
}

/** Agrupa integrantes por equipo (líderes primero). */
export function agruparIntegrantes(items: Integrante[]): Map<number, Integrante[]> {
  const mapa = new Map<number, Integrante[]>();
  for (const i of items) {
    if (!mapa.has(i.iequipo)) mapa.set(i.iequipo, []);
    mapa.get(i.iequipo)!.push(i);
  }
  for (const lista of mapa.values()) lista.sort((a, b) => (a.rol === 'lider' ? -1 : 0) - (b.rol === 'lider' ? -1 : 0) || nombreDe(a).localeCompare(nombreDe(b)));
  return mapa;
}

/** Miembros que aún no están en el equipo (candidatos a agregar). */
export function candidatos(miembros: Miembro[], integrantes: Integrante[]): Miembro[] {
  const dentro = new Set(integrantes.map((i) => i.iusuario));
  return ordenarMiembros(miembros.filter((m) => !dentro.has(m.iusuario)));
}

/** Color de equipo seguro para CSS (hex válido o el acento por defecto). */
export function colorEquipo(color: string | null | undefined): string {
  return color && /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : 'var(--iswc-accent)';
}
