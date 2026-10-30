/**
 * estado.ts — el estado compartido de la app (sin DOM): sesión, perfil, permisos, empresa activa y ruta.
 * Un store mínimo: `estado` (lectura), `fijar(parcial)` (escritura) y `alCambiar(clave, fn)` (suscripción).
 */
import type { Perfil, Yo } from '../consts/schemas/api.schemas.js';
import type { Ruta } from '../consts/schemas/componentes.schemas.js';

/** Forma del estado global. */
export type Estado = { token: string | null; yo: Yo | null; perfil: Perfil | null; empresa: number | null; ruta: Ruta; cargando: boolean };

const CLAVE_EMPRESA = 'avatar:empresa';

function leerEmpresa(): number | null {
  try {
    const v = Number(localStorage.getItem(CLAVE_EMPRESA));
    return Number.isInteger(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

/** El estado vivo (solo lectura desde fuera: escribir con `fijar`). */
export const estado: Estado = { token: null, yo: null, perfil: null, empresa: leerEmpresa(), ruta: { vista: 'inicio', id: null }, cargando: false };

const oyentes = new Map<keyof Estado, Set<() => void>>();

/** Escribe parte del estado y avisa a los oyentes de cada clave que cambió. Devuelve las claves cambiadas. */
export function fijar(parcial: Partial<Estado>): (keyof Estado)[] {
  const cambiadas: (keyof Estado)[] = [];
  for (const k of Object.keys(parcial) as (keyof Estado)[]) {
    const nuevo = parcial[k];
    if (Object.is((estado as Record<string, unknown>)[k], nuevo)) continue;
    (estado as Record<string, unknown>)[k] = nuevo;
    cambiadas.push(k);
  }
  if (cambiadas.includes('empresa')) {
    try {
      if (estado.empresa) localStorage.setItem(CLAVE_EMPRESA, String(estado.empresa));
      else localStorage.removeItem(CLAVE_EMPRESA);
    } catch {
      /* sin almacenamiento */
    }
  }
  for (const k of cambiadas) for (const fn of oyentes.get(k) ?? []) fn();
  return cambiadas;
}

/** Se suscribe a una clave; devuelve la función para desuscribirse. */
export function alCambiar(clave: keyof Estado, fn: () => void): () => void {
  if (!oyentes.has(clave)) oyentes.set(clave, new Set());
  oyentes.get(clave)!.add(fn);
  return () => oyentes.get(clave)?.delete(fn);
}

/** Hay sesión iniciada (token y perfil cargado). */
export const haySesion = (): boolean => !!estado.token && !!estado.yo;

/** Empresa activa: la elegida, o la primera del usuario. */
export function empresaActiva(): number | null {
  const mias = estado.yo?.empresas ?? [];
  if (estado.empresa && mias.some((e) => e.iempresa === estado.empresa)) return estado.empresa;
  return mias[0]?.iempresa ?? null;
}
