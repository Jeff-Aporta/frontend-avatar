/**
 * cuentas.ts — varias cuentas en el mismo navegador. Los JWT se guardan por usuario en `localStorage` (la bóveda,
 * compartida entre pestañas) y el perfil activo es de CADA pestaña (`sessionStorage`): dos pestañas pueden estar con dos
 * perfiles a la vez y verse en tiempo real. Una pestaña nueva arranca con el último perfil usado.
 */

const CLAVE_BOVEDA = 'avatar:cuentas';
const CLAVE_ACTIVO = 'avatar:activo';
const CLAVE_ULTIMO = 'avatar:ultimo';
const CLAVE_VIEJA = 'avatar:token';

type Claims = { sub?: string; exp?: number };

const guardar = <T>(fn: () => T, porDefecto: T): T => {
  try {
    return fn();
  } catch {
    return porDefecto;
  }
};

/** Datos del JWT (sin verificar: solo para saber de quién es y cuándo vence; quien valida es el API). */
export function claimsDe(token: string): Claims {
  return guardar(() => JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/'))) as Claims, {});
}

/** Un token es vigente si no vence en el próximo minuto. */
export const vigente = (token: string, ahora = Date.now()): boolean => (claimsDe(token).exp ?? 0) * 1000 > ahora + 60000;

function leerBoveda(): Record<string, string> {
  return guardar(() => {
    const vieja = localStorage.getItem(CLAVE_VIEJA);
    const b = JSON.parse(localStorage.getItem(CLAVE_BOVEDA) ?? '{}') as Record<string, string>;
    if (!vieja) return b;
    localStorage.removeItem(CLAVE_VIEJA);
    const sub = claimsDe(vieja).sub;
    return sub ? { ...b, [sub]: vieja } : b;
  }, {});
}

const escribirBoveda = (b: Record<string, string>): void => void guardar(() => localStorage.setItem(CLAVE_BOVEDA, JSON.stringify(b)), undefined);

/** Usuario activo de esta pestaña. */
export const usuarioActivo = (): string | null => guardar(() => sessionStorage.getItem(CLAVE_ACTIVO) ?? localStorage.getItem(CLAVE_ULTIMO), null);

/** Marca el perfil activo de esta pestaña (y el que heredan las pestañas nuevas). */
export function activar(usuario: string): void {
  guardar(() => {
    sessionStorage.setItem(CLAVE_ACTIVO, usuario);
    localStorage.setItem(CLAVE_ULTIMO, usuario);
  }, undefined);
}

/** Token del perfil activo, si sigue vigente. */
export function tokenActivo(): string | null {
  const u = usuarioActivo();
  const t = u ? leerBoveda()[u] : null;
  return t && vigente(t) ? t : null;
}

/** Guarda el token recién obtenido y deja a su dueño como perfil activo. */
export function guardarCuenta(token: string): void {
  const sub = claimsDe(token).sub;
  if (!sub) return;
  escribirBoveda({ ...leerBoveda(), [sub]: token });
  activar(sub);
}

/** Olvida la cuenta activa (cerrar sesión). */
export function quitarActiva(): void {
  const u = usuarioActivo();
  if (u) {
    const { [u]: _fuera, ...resto } = leerBoveda();
    escribirBoveda(resto);
  }
  guardar(() => {
    sessionStorage.removeItem(CLAVE_ACTIVO);
    if (localStorage.getItem(CLAVE_ULTIMO) === u) localStorage.removeItem(CLAVE_ULTIMO);
  }, undefined);
}

/** ¿Hay un JWT vigente guardado para este usuario? Entonces el cambio es directo, sin PIN. */
export function tieneCuenta(usuario: string): boolean {
  const t = leerBoveda()[usuario];
  return !!t && vigente(t);
}
